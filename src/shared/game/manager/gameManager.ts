import GameBoard from "../../../client/game/gameBoard";
import GameUnit from "../units/gameUnit";
import Location from "../location";
import log, { LOG_LEVEL } from "../../utility/logger";
import MoveHistory from "../move/moveHistory";
import MoveAction from "../move/moveAction";
import SpecialAction from "../move/specialAction";

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
                this.moveUnit(
                    moveAction.unitDoingAction,
                    moveAction.unitDoingAction.location,
                    moveAction.targetedCoordinates,
                );
            });
        });
        this.endedTurnMap.clear();
    }

    getUnitAt(location: Location): GameUnit | null {
        if (this.boardState[location.x]) {
            return this.boardState[location.x][location.y];
        }
        return null;
    }

    private setUnitAt(location: Location, unit: GameUnit | null) {
        this.boardState[location.x][location.y] = unit;
    }

    private moveUnit(unitMoving: GameUnit, oldLocation: Location, newLocation: Location) {
        if (unitMoving != this.getUnitAt(oldLocation)) {
            log(`${unitMoving} is not equal to ${this.getUnitAt(oldLocation)}`, this.constructor.name, LOG_LEVEL.ERROR);
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
        //
    }
}
