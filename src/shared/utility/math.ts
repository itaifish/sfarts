import Location from "../game/location";

export default class MathUtility {
    static clamp(num: number, max: number, min: number): number {
        return Math.min(Math.max(num, min), max);
    }

    static locationEquals(location1: Location, location2: Location): boolean {
        return location1.x == location2.x && location1.y == location2.y;
    }
}
