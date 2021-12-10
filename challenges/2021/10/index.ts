import getInput from '../../../utils/getInput';

const part1 = () => {
    const input = getInput('2021', '10')
        .split('\n')
        .filter((line) => line != '');

    let total = 0;
    for (const line of input) {
        const corrupted = corruptedScore(line);
        if (corrupted) {
            console.log(corrupted);
            total += corrupted;
        }
    }

    console.log(input);

    return total;
};

const chars = [
    { open: '(', close: ')', score: 3, autoCompleteScore: 1 },
    { open: '[', close: ']', score: 57, autoCompleteScore: 2 },
    { open: '{', close: '}', score: 1197, autoCompleteScore: 3 },
    { open: '<', close: '>', score: 25137, autoCompleteScore: 4 },
];

const corruptedScore = (line: string): number => {
    const charStack: string[] = [];
    for (const character of line) {
        // console.log(line);
        // console.log(charStack, character);
        if (chars.map((char) => char.open).includes(character)) {
            charStack.push(character);
        } else {
            const lastCharacter = charStack.pop();
            const correctClosingChar = chars.find((char) => char.open === lastCharacter);
            if (correctClosingChar) {
                if (correctClosingChar?.close === character) {
                    continue;
                } else {
                    return chars.find((char) => char.close === character)?.score || 0;
                }
            }
        }
    }
    return 0;
};

const part2 = () => {
    const input = getInput('2021', '10')
        .split('\n')
        .filter((line) => line != '');

    const nonCorrupted: string[] = [];
    for (const line of input) {
        const corrupted = corruptedScore(line);
        if (!corrupted) {
            nonCorrupted.push(line);
        }
    }

    let scores = [];
    for (const line of nonCorrupted) {
        scores.push(autoCompleteScore(line));
    }
    scores.sort((a, b) => a - b);
    console.log(scores);
    return scores[Math.floor(scores.length / 2)];
};

const autoCompleteScore = (line: string): number => {
    const charStack: string[] = [];
    for (const character of line) {
        if (chars.map((char) => char.open).includes(character)) {
            charStack.push(character);
        } else {
            charStack.pop();
        }
    }

    let score = 0;
    while (charStack.length > 0) {
        const lastCharacter = charStack.pop();
        score =
            score * 5 + (chars.find((char) => char.open === lastCharacter)?.autoCompleteScore || 0);
    }
    return score;
};

console.log(`Solution 1: ${part1()}`);
console.log(`Solution 2: ${part2()}`);
