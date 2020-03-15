import { SlotRoller } from "./slots/SlotRoller"

/**
 * Generates javascript log files.
 * This class is a helper tool for debug purposes only.
 */
export abstract class LogGenerator {

    /**
     * Save text to file and download it.
     * @param filename Generated file name.
     * @param text Text to save.
     */
    public static download(filename: string, text: string): void {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }

    /**
     * Generate javascript log file and download it.
     * @param tileCount Amount of unique tile textures.
     * @param reelCount Amount of vertical rolling lines in this machine.
     * @param length Amount of rolls (iterations) in log history.
     */
    public static generateBaseLog(tileCount: number, reelCount: number, length: number) {
        let log = [];
        for (let i = 0; i < length; i++) {
            log.push(SlotRoller.roll(tileCount, reelCount));
        }
        LogGenerator.download('log.js', `module.exports = {\n\thistory: ${JSON.stringify(log)}\n}`);
    }
    
}
