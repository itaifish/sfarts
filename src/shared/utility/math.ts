export default class MathUtility {
    static clamp(num: number, max: number, min: number): number {
        return Math.min(Math.max(num, min), max);
    }
}
