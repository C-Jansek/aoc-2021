import getInput from '../../../utils/getInput';

/**
 * The different opening and closing character matches.
 * Also includes their scores for both corruption and autoCompletion.
 */
const chars = [
    { open: '(', close: ')', corruptionScore: 3, autoCompleteScore: 1 },
    { open: '[', close: ']', corruptionScore: 57, autoCompleteScore: 2 },
    { open: '{', close: '}', corruptionScore: 1197, autoCompleteScore: 3 },
    { open: '<', close: '>', corruptionScore: 25_137, autoCompleteScore: 4 },
];

/**
 * Check this line for corruption.
 *
 * return `corruptionScore` of the first corrupted character if corrupted.
 *
 * return `0` otherwise
 */
const corruptedScore = (line: string): number => {
    const charStack: string[] = [];
    for (const character of line) {
        // Push opening characters onto the stack
        if (chars.map((char) => char.open).includes(character)) {
            charStack.push(character);
        } else {
            // Or pop the latest character from the stack if the next character is closing
            const lastCharacter = charStack.pop();
            const correctClosingChar = chars.find((char) => char.open === lastCharacter);

            // Return the score when the last character on the stack
            // and the next character do not match
            if (correctClosingChar?.close !== character) {
                return chars.find((char) => char.close === character)?.corruptionScore || 0;
            }
        }
    }
    return 0;
};

/**
 * Calculate autoCompletion score for this line.
 *
 * return `autoCompletionScore` if line is autocompleted.
 *
 * return `0` if line is allready complete
 */
const autoCompleteScore = (line: string): number => {
    const charStack: string[] = [];
    // Process line
    for (const character of line) {
        if (chars.map((char) => char.open).includes(character)) {
            charStack.push(character);
        } else {
            // Line is not corrupt, so can be sure to pop without checking
            charStack.pop();
        }
    }

    // Calculate score for the remaining characters left on the stack
    let score = 0;
    while (charStack.length > 0) {
        const lastCharacter = charStack.pop();
        score *= 5;
        score += chars.find((char) => char.open === lastCharacter)?.autoCompleteScore || 0;
    }
    return score;
};

const part1 = () => {
    const input = getInput('2021', '10')
        .split('\n')
        .filter((line) => line != '');

    // Return the summed score of the corrupted lines
    return input.reduce((total, line) => total + corruptedScore(line), 0);
};

const part2 = () => {
    const input = getInput('2021', '10')
        .split('\n')
        .filter((line) => line != '');

    // Filter out corrupted lines, then compute their score
    const scores: number[] = input
        .filter((line) => !corruptedScore(line))
        .map((line) => autoCompleteScore(line));

    // Return the middle score
    scores.sort((a, b) => a - b);
    return scores[Math.floor(scores.length / 2)];
};

console.log(`Solution 1: ${part1()}`);
console.log(`Solution 2: ${part2()}`);
