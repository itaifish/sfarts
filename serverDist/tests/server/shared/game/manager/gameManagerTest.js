"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const gameManager_1 = __importDefault(require("../../../../../src/shared/game/manager/gameManager"));
const mapManager_1 = __importDefault(require("../../../../../src/shared/game/manager/mapManager"));
describe("gameManager", () => {
    test("gameMangerStuff", () => {
        const manager = new gameManager_1.default("gameId", 1, [], mapManager_1.default.getMapFromId("1", [0, 1]));
        const firstBoyo = manager.getUnitAt({ x: 0, y: 0 });
        const moveAction = {
            unitDoingAction: firstBoyo,
            targetedCoordinates: { x: 1, y: 1 },
        };
        manager.addMovesForPlayer(1, [moveAction]);
        manager.endTurn();
        expect(manager.getUnitAt({ x: 0, y: 0 })).toBe(null);
        expect(manager.getUnitAt({ x: 1, y: 1 })).toBe(firstBoyo);
    });
});
//# sourceMappingURL=gameManagerTest.js.map