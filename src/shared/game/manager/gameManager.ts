import GameBoard from "../../../client/game/gameBoard";
import GameUnit from "../units/gameUnit";
import Location from "../location";
import log, { LOG_LEVEL } from "../../utility/logger";
import MoveHistory from "../move/moveHistory";
import MoveAction from "../move/moveAction";
import SpecialAction, { SpecialActionName } from "../move/specialAction";
import locationToString from "../../utility/convertToString";

export default class GameManager {
    gameId: string;
    controllerId: number;
    private board: GameBoard;
    boardState: GameUnit[][];
    moveHistory: MoveHistory;
    playerIds: number[];
    endedTurnMap: Set<number>;

    constructor(gameId: string, controllerId: number, allPlayers: number[], boardState?: GameUnit[][]) {
        this.gameId = gameId;
        this.controllerId = controllerId;
        if (boardState) {
            this.boardState = boardState;
        } else {
            this.boardState = new Array(5);
        }
        this.moveHistory = new MoveHistory(allPlayers);
        this.playerIds = allPlayers;
        this.endedTurnMap = new Set<number>();
    }

    copyBoardState(boardState: GameUnit[][]) {
        this.boardState = [];
        for (let y = 0; y < boardState.length; y++) {
            this.boardState.push([]);
            for (let x = 0; x < boardState[y].length; x++) {
                const oldGameUnit = boardState[y][x];
                if (oldGameUnit) {
                    this.boardState[y].push(
                        new GameUnit(
                            oldGameUnit.controller,
                            oldGameUnit.team,
                            oldGameUnit.unitStats,
                            oldGameUnit.specialMoves,
                            oldGameUnit.location,
                            oldGameUnit.name,
                        ),
                    );
                } else {
                    this.boardState[y].push(null);
                }
            }
        }
    }

    addMovesForPlayer(playerId: number, moveList: MoveAction[]) {
        moveList.forEach((move) => {
            this.moveHistory.playerMove(playerId, move);
        });
    }

    addSpecialsForPlayer(playerId: number, specialList: SpecialAction[]) {
        specialList.forEach((special) => {
            this.moveHistory.playerSpecial(playerId, special);
        });
    }

    getNumTurns(): number {
        return this.moveHistory.history.length;
    }

    playerSendsEndTurnSignal(playerId: number, endTurn: boolean) {
        if (endTurn) {
            this.endedTurnMap.add(playerId);
        } else {
            this.endedTurnMap.delete(playerId);
        }
    }

    allPlayersHaveEndedTurn(): boolean {
        return this.endedTurnMap.size == this.playerIds.length;
    }

    endTurn() {
        // Do Specials **FIRST** and then moves
        const turnHistory = this.moveHistory.saveAndGetTurnHistory();
        Object.keys(turnHistory).forEach((playerId) => {
            const playerIdNum = parseInt(playerId);
            Object.keys(turnHistory[playerIdNum]).forEach((locationKey) => {
                this.doSpecial(turnHistory[playerIdNum][locationKey].specialAction);
            });
        });
        Object.keys(turnHistory).forEach((playerId) => {
            const playerIdNum = parseInt(playerId);
            Object.keys(turnHistory[playerIdNum]).forEach((locationKey) => {
                const moveAction = turnHistory[playerIdNum][locationKey].moveAction;
                if (moveAction) {
                    const unitDoingAction = this.getUnitAt(moveAction.unitDoingAction.turnStartLocation);
                    // copy over health and stuff
                    this.moveUnit(unitDoingAction, unitDoingAction.turnStartLocation, moveAction.targetedCoordinates);
                }
            });
        });
        // copy over own boardstate because passed in objects lose their functions
        // TODO: fix this feature in the server so this inefficiency does not have to happen
        this.copyBoardState(this.boardState);
        this.boardState.forEach((row, rowIdx) => {
            row.forEach((gameUnit, colIdx) => {
                if (gameUnit) {
                    if (gameUnit.unitStats.health <= 0) {
                        log(
                            `gameUnit ${gameUnit.name} is dying, at position ${gameUnit.location.x}, ${gameUnit.location.y}`,
                            this.constructor.name,
                            LOG_LEVEL.TRACE,
                        );
                        this.setUnitAt({ x: colIdx, y: rowIdx }, null);
                    } else {
                        gameUnit.processNewTurn();
                    }
                }
            }, this);
        }, this);
        this.endedTurnMap.clear();
    }

    resetPlayerMoves(playerId: number): GameUnit[][] {
        this.moveHistory.resetPlayerMoves(playerId);
        return this.boardState;
    }

    getUnitAt(location: Location): GameUnit | null {
        if (location && this.boardState[location.y]) {
            return this.boardState[location.y][location.x];
        }
        return null;
    }

    private setUnitAt(location: Location, unit: GameUnit | null) {
        this.boardState[location.y][location.x] = unit;
    }

    private moveUnit(unitMoving: GameUnit, oldLocation: Location, newLocation: Location) {
        if (unitMoving.turnStartLocation != oldLocation) {
            log(
                `${locationToString(unitMoving.turnStartLocation)} is not equal to ${locationToString(oldLocation)}`,
                this.constructor.name,
                LOG_LEVEL.ERROR,
            );
        } else {
            this.setUnitAt(oldLocation, null);
            const newLocationUnit = this.getUnitAt(newLocation);
            if (newLocationUnit) {
                if (newLocationUnit.team == unitMoving.team) {
                    log(
                        `${unitMoving} is on the same team (${unitMoving.team}) as ${newLocationUnit}`,
                        this.constructor.name,
                        LOG_LEVEL.ERROR,
                    );
                } else {
                    // Smash Health
                    const higherHealthUnit =
                        newLocationUnit.unitStats.health > unitMoving.unitStats.health ? newLocationUnit : unitMoving;
                    const lowerHealth = Math.min(newLocationUnit.unitStats.health, unitMoving.unitStats.health);
                    higherHealthUnit.unitStats.health -= lowerHealth;
                    this.setUnitAt(newLocation, higherHealthUnit);
                    unitMoving.location = newLocation;
                }
            } else {
                this.setUnitAt(newLocation, unitMoving);
                unitMoving.location = newLocation;
            }
        }
    }

    private doSpecial(action: SpecialAction) {
        if (!action) {
            return;
        }
        if (action.actionName == SpecialActionName.ATTACK) {
            const unitAttacking = this.getUnitAt(action.unitDoingAction?.turnStartLocation);
            if (action.unitDoingAction?.unitStats?.damage != unitAttacking?.unitStats.damage) {
                log(
                    `ERROR: Damage is not consistent, likely refering to different gameobjects or something is incorrectly null`,
                    this.constructor.name,
                    LOG_LEVEL.WARN,
                );
            } else {
                const unitBeingAttacked = this.getUnitAt(action.targetedCoordinates);
                if (!unitBeingAttacked || unitAttacking?.controller == unitBeingAttacked?.controller) {
                    log(`ERROR: unit is attacking null or an ally`, this.constructor.name, LOG_LEVEL.WARN);
                } else {
                    unitBeingAttacked.unitStats.health -= unitAttacking.unitStats.damage;
                    log(
                        `Unit for player ${unitBeingAttacked.controller} took ${unitAttacking.unitStats.damage} damage, health is now at ${unitBeingAttacked.unitStats.health}`,
                        this.constructor.name,
                        LOG_LEVEL.DEBUG,
                    );
                }
            }
        }
    }
}
