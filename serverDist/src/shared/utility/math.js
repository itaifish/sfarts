"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MathUtility {
    static clamp(num, max, min) {
        return Math.min(Math.max(num, min), max);
    }
    static locationEquals(location1, location2) {
        return location1.x == location2.x && location1.y == location2.y;
    }
}
exports.default = MathUtility;
//# sourceMappingURL=math.js.map