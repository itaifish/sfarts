import GameManager from "../../../../../src/shared/game/manager/gameManager";
import MapManager from "../../../../../src/shared/game/manager/mapManager";
import MoveAction from "../../../../../src/shared/game/move/moveAction";

describe("gameManager", () => {
    test("gameMangerStuff", () => {
        const manager: GameManager = new GameManager("gameId", 1, [], MapManager.getMapFromId("1", [0, 1]));
        const firstBoyo = manager.getUnitAt({ x: 0, y: 0 });
        const moveAction: MoveAction = {
            unitDoingAction: firstBoyo,
            targetedCoordinates: { x: 1, y: 1 },
        };
        manager.addMovesForPlayer(1, [moveAction]);
        manager.endTurn();
        expect(manager.getUnitAt({ x: 0, y: 0 })).toBe(null);
        expect(manager.getUnitAt({ x: 1, y: 1 })).toBe(firstBoyo);
    });
});
