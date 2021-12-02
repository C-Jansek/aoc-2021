import { readFileSync } from 'fs';

/**
 * Read challenge input from file
 * @param {string} year
 * @param {string} day
 * @return {string}
 */
export default function readInputFile(year: string, day: string): string {
    return readFileSync(`challenges/${year}/${day}/input.txt`, 'utf-8');
}
