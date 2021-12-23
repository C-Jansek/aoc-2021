import { assert } from 'console';
import _ from 'lodash';
import getInput from '../../../utils/getInput';

const addSnailfishNumbers = (a: string, b: string): string => {
    const combinedNumbers = `[${a},${b}]`;
    if (maxDepth(combinedNumbers) < 4 && maxNumber(combinedNumbers) > 9) return combinedNumbers;

    return reduceSnailfishNumber(combinedNumbers);
};

const maxDepth = (snailfishNumber: string): number => {
    let maxDepth = 0;
    let depth = 0;
    for (const char of snailfishNumber) {
        if (char === '[') depth++;
        else if (char === ']') depth--;
        if (depth > maxDepth) maxDepth = depth;
    }
    return maxDepth;
};

const maxNumber = (snailfishNumber: string): number => {
    const numbers = snailfishNumber.match(/\d+/g)?.map((value) => Number(value)) ?? [0];
    return Math.max(...numbers);
};

const reduceSnailfishNumber = (combined: string): string => {
    let reduced = combined;
    while (maxDepth(reduced) > 4 || maxNumber(reduced) > 9) {
        if (maxDepth(reduced) > 4) {
            reduced = explodeSnailfishNumber(reduced);
        } else if (maxNumber(reduced) > 9) {
            reduced = splitSnailfishNumber(reduced);
        }
    }
    return reduced;
};

const splitLine = (line: string): [string, string] => {
    let depth = 0;
    let index = 0;
    for (const char of line) {
        if (char === '[') depth++;
        else if (char === ']') depth--;
        if (depth === 1 && char === ',') {
            return [line.slice(1, index), line.slice(index + 1, -1)];
        }
        index++;
    }
    throw new Error('no return?');
};

const splitSnailfishNumber = (combined: string): string => {
    if (combined[0] !== '[') {
        return `[${Math.floor(Number(combined) / 2)},${Math.ceil(Number(combined) / 2)}]`;
    }

    const [first, second] = splitLine(combined);

    if (maxNumber(first) > 9) {
        const split = splitSnailfishNumber(first);
        return `[${split},${second}]`;
    }
    assert(maxNumber(second) > 9);
    const split = splitSnailfishNumber(second);
    return `[${first},${split}]`;
};

const findExplodeParts = (combined: string) => {
    let depth = 0;
    let explodeStart = 0;
    let first: any;
    let second: any;
    let explodeEnd: any;
    for (const char of combined) {
        if (char === '[') depth++;
        else if (char === ']') depth--;
        if (depth === 5) {
            first = _.get(combined.slice(explodeStart).match(/\[(\d+),/g), 0)?.slice(1, -1);
            second = _.get(combined.slice(explodeStart).match(/,(\d+)]/g), 0)?.slice(1, -1);
            explodeEnd = explodeStart + combined.slice(explodeStart).indexOf(']') + 1;
            break;
        }
        explodeStart++;
    }
    return [first, second, explodeStart, explodeEnd];
};

const explodeSnailfishNumber = (combined: string): string => {
    const [first, second, explodeStart, explodeEnd] = findExplodeParts(combined);

    // Go to the Left
    const reversedBegin = combined
        .slice(0, explodeStart)
        .split('')
        .reverse()
        .join('');
    let leftCharEnd = 0;
    let leftCharStart;
    let leftIndex = explodeStart;

    for (const char of reversedBegin) {
        if (!['[', ']', ','].includes(char)) {
            if (!leftCharEnd) {
                leftCharEnd = leftIndex;
            }
        } else if (leftCharEnd) {
            leftCharStart = leftIndex;
            break;
        }
        leftIndex--;
    }

    // Go to the right
    let rightCharEnd;
    let rightCharStart;
    let rightIndex = explodeEnd + 1;
    for (const char of combined.slice(explodeEnd + 1)) {
        if (!['[', ']', ','].includes(char)) {
            if (!rightCharStart) {
                rightCharStart = rightIndex;
            }
        } else if (rightCharStart) {
            rightCharEnd = rightIndex;
            break;
        }
        rightIndex++;
    }

    const closestLeft = combined.slice(leftCharEnd, explodeStart);
    const closestRight = combined.slice(explodeEnd, rightCharStart);
    const middle = `${closestLeft}0${closestRight}`;

    let output = '';
    if (leftCharStart) {
        output += combined.slice(0, leftCharStart);
        output += `${Number(combined.slice(leftCharStart, leftCharEnd)) + Number(first)}`;
    }
    output += middle;
    if (rightCharEnd) {
        output += `${Number(combined.slice(rightCharStart, rightCharEnd)) + Number(second)}`;
        output += combined.slice(rightCharEnd);
    }

    return output;
};

const calculateMagnitude = (combined: string): number => {
    if (combined[0] !== '[') {
        return Number(combined);
    }

    const [first, second] = splitLine(combined);
    return 3 * calculateMagnitude(first) + 2 * calculateMagnitude(second);
};

const part1 = () => {
    const input = getInput('2021', '18')
        .split('\n')
        .filter((line) => line !== '');

    const homework = input.reduce((total, current) => addSnailfishNumbers(total, current));

    return calculateMagnitude(homework);
};

const part2 = () => {
    const input = getInput('2021', '18')
        .split('\n')
        .filter((line) => line !== '');

    let topMagnitude = 0;
    for (const first of input) {
        for (const second of input) {
            if (first !== second) {
                const magnitude = calculateMagnitude(addSnailfishNumbers(first, second));
                if (magnitude > topMagnitude) topMagnitude = magnitude;
            }
        }
    }
    return topMagnitude;
};

console.log(`Solution 1: ${part1()}`);
console.log(`Solution 2: ${part2()}`);
