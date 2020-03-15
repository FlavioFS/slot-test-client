export abstract class Dice {
    /**
     * Returns a random integer between min (inclusive) and max (exclusive).
     * @param min Minimum value (inclusive).
     * @param max Maximum value (exclusive).
     */
    public static randomInt (min: number, max: number) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    /**
     * Returns a random integer between 0 (inclusive) and max (exclusive).
     * @param max Maximum value (exclusive).
     */
    public static roll (max: number) {
        return Dice.randomInt(0, max);
    }

    /**
     * Returns a random integer between 0 (inclusive) and max (exclusive) that is different from a specific value.
     * @param max Maximum value (exclusive).
     * @param except Any result except by this number.
     */
    public static rollDifferent (max: number, except: number) {
        const roll = Dice.roll(max-1);
        return (roll < except) ? roll : roll + 1;
    }
}