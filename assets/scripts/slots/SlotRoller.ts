import { Dice } from "../Dice";

/**
 * Rolls the reels.
 */
export class SlotRoller {

    static readonly ROLL_ALL_EQUAL: number = 7;
    static readonly ROLL_TWO_LINES: number = 10 + SlotRoller.ROLL_ALL_EQUAL;     // 17
    static readonly ROLL_SINGLE_LINE: number = 33 + SlotRoller.ROLL_TWO_LINES;   // 50

    static readonly REEL_LENGTH: number = 3

    // ====================================================
    // Public
    // ====================================================
    /**
     * Returns results based on a predefined probability list.
     * @param tileCount Amount of unique tile textures.
     * @param reelCount Amount of vertical rolling lines in this machine.
     */
    public static roll(tileCount: number, reelCount: number): IResult {
        var result = {
            reels: [],
            equalLines: [],
            equalTile: 0
        };
    
        const roll = Dice.roll(100);
        if (roll < SlotRoller.ROLL_ALL_EQUAL) {
            result = SlotRoller.allLinesResult(tileCount, reelCount);
        }
        else if (roll < SlotRoller.ROLL_TWO_LINES) {
            result = SlotRoller.twoLinesResult(tileCount, reelCount);
        }
        else if (roll < SlotRoller.ROLL_SINGLE_LINE) {
            result = SlotRoller.singleLineResult(tileCount, reelCount);
        }
        else {
            result = SlotRoller.noLinesResult(tileCount, reelCount);
        }
        
        return result;
    }


    // ====================================================
    // Private
    // ====================================================
    /**
     * Creates an empty matrix of a given size.
     * @param reelCount Column count.
     */
    private static createEmptyMatrix(reelCount: number): Array<Array<number>> {
        var result = [];
        for (let j = 0; j < reelCount; j++) {
            result.push([]);
        }
        return result;
    }

    /**
     * Generates a line containing at least one different tile.
     * @param reelCount Line length.
     */
    private static createUnequalLine(tileCount: number, reelCount: number): Array<number> {
        var result = [];
        var uniqueValues = [];

        for (let j = 0; j < reelCount; ++j) {
            result[j] = Dice.roll(tileCount);
            if (!uniqueValues.includes(result[j])) {
                uniqueValues.push(result[j]);
            }
        }

        if(uniqueValues.length <= 1) {
            const differentPosition = Dice.roll(length);
            const differentValue = Dice.rollDifferent(reelCount, uniqueValues[0]);
            result[differentPosition] = differentValue;
        }

        return result;
    }

    /**
     * Returns a result according to the following condition:
     *  - All lines are SOLELY composed by THE SAME tile.
     * @param tileCount Amount of unique tile textures.
     * @param reelCount Amount of vertical rolling lines in this machine.
     */
    private static allLinesResult(tileCount: number, reelCount: number): IResult {
        var result = {
            reels: SlotRoller.createEmptyMatrix(reelCount),
            equalLines: [],
            equalTile: Dice.roll(tileCount)
        };
        
        // Saves equal lines
        for (let i = 0; i < this.REEL_LENGTH; ++i) {
            result.equalLines.push(i);
        }

        SlotRoller.populateMatrix(result, tileCount, reelCount);

        return result;
    }

    /**
     * Returns a result according to the following condition:
     *  - All lines contain AT LEAST ONE different tile.
     * @param tileCount Amount of unique tile textures.
     * @param reelCount Amount of vertical rolling lines in this machine.
     */
    private static noLinesResult(tileCount: number, reelCount: number): IResult {
        var result = {
            reels: SlotRoller.createEmptyMatrix(reelCount),
            equalLines: [],
            equalTile: -1
        };

        SlotRoller.populateMatrix(result, tileCount, reelCount);

        return result;
    }

    /**
     * Returns a result according to the following condition:
     *  - There is one line that contains AT LEAST ONE different tile.
     * @param tileCount Amount of unique tile textures.
     * @param reelCount Amount of vertical rolling lines in this machine.
     */
    private static twoLinesResult(tileCount: number, reelCount: number): IResult {
        var result = {
            reels: SlotRoller.createEmptyMatrix(reelCount),
            equalLines: [],
            equalTile: Dice.roll(tileCount)
        };

        // Saves equal lines
        const differentLine = Dice.roll(this.REEL_LENGTH);
        for (let i = 0; i < this.REEL_LENGTH; i++) {
            if (i != differentLine) {
                result.equalLines.push(i);
            }
        }

        SlotRoller.populateMatrix(result, tileCount, reelCount);

        return result;
    }

    /**
     * Returns a result according to the following condition:
     * - There is ONLY ONE line whose tiles are all the same.
     * @param tileCount Amount of unique tile textures.
     * @param reelCount Amount of vertical rolling lines in this machine.
     */
    private static singleLineResult(tileCount: number, reelCount: number): IResult {
        var result = {
            reels: SlotRoller.createEmptyMatrix(reelCount),
            equalLines: [Dice.roll(this.REEL_LENGTH)],
            equalTile: Dice.roll(tileCount)
        };

        SlotRoller.populateMatrix(result, tileCount, reelCount);

        return result;
    }
    
    /**
     * Populates a tile matrix from an IResult interface.
     * @param result Contains the matrix to edit.
     * @param tileCount Amount of unique tile textures.
     * @param reelCount Amount of vertical rolling lines in this machine.
     */
    private static populateMatrix(result: IResult, tileCount: number, reelCount: number) {
        for (let i = 0; i < this.REEL_LENGTH; ++i) {
            if (result.equalLines.includes(i)) {
                for (let j = 0; j < reelCount; ++j) {
                    result.reels[j][i] = result.equalTile;
                }
            }
            else {
                const unequalLine: Array<number> = this.createUnequalLine(tileCount, reelCount);
                for (let j = 0; j < reelCount; ++j) {
                    result.reels[j][i] = unequalLine[j];
                }
            }
        }
    }   

}