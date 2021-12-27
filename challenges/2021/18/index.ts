import _, { isUndefined } from 'lodash';
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
            continue;
        }

        if (maxNumber(reduced) > 9) {
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

const getExplodingSnailfishNumber = (
    combined: string,
): {
    explodeStart: number;
    explodeEnd: number;
    explodePair: string[];
} => {
    let depth = 0;
    let explodeStart = 0;
    const explodePair: string[] = [];
    let explodeEnd = 0;

    for (const char of combined) {
        if (char === '[') depth++;
        else if (char === ']') depth--;
        if (depth === 5) {
            const first = _.get(combined.slice(explodeStart).match(/\[(\d+),/g), 0)?.slice(1, -1);
            const second = _.get(combined.slice(explodeStart).match(/,(\d+)]/g), 0)?.slice(1, -1);
            if (isUndefined(first) || isUndefined(second)) throw new Error('Cannot find pair');

            explodePair.push(first, second);
            explodeEnd = explodeStart + combined.slice(explodeStart).indexOf(']') + 1;

            return {
                explodeStart,
                explodeEnd,
                explodePair,
            };
        }
        explodeStart++;
    }

    throw new Error('Cannot explode Snailfish number');
};

const getLeftOfExplodingSnailfishNumber = (
    combined: string,
    explodeStart: number,
): {
    leftStart: number | undefined;
    leftEnd: number;
} => {
    const reversedBegin = combined
        .slice(0, explodeStart)
        .split('')
        .reverse()
        .join('');
    let leftEnd = 0;
    let leftStart;
    let leftIndex = explodeStart;

    for (const char of reversedBegin) {
        if (!['[', ']', ','].includes(char)) {
            if (!leftEnd) {
                leftEnd = leftIndex;
            }
        } else if (leftEnd) {
            leftStart = leftIndex;
            break;
        }
        leftIndex--;
    }

    return {
        leftStart,
        leftEnd,
    };
};

const getRightOfExplodingSnailfishNumber = (
    combined: string,
    explodeEnd: number,
): {
    rightStart: number | undefined;
    rightEnd: number | undefined;
} => {
    let rightStart;
    let rightEnd;
    let rightIndex = explodeEnd + 1;
    for (const char of combined.slice(explodeEnd + 1)) {
        if (!['[', ']', ','].includes(char)) {
            if (!rightStart) {
                rightStart = rightIndex;
            }
        } else if (rightStart) {
            rightEnd = rightIndex;
            break;
        }
        rightIndex++;
    }

    return {
        rightStart,
        rightEnd,
    };
};

const explodeSnailfishNumber = (combined: string): string => {
    const { explodeStart, explodeEnd, explodePair } = getExplodingSnailfishNumber(combined);

    // Go to the Left
    const { leftStart, leftEnd } = getLeftOfExplodingSnailfishNumber(combined, explodeStart);
    let left = '';
    if (leftStart) {
        left =
            combined.slice(0, leftStart) +
            (Number(combined.slice(leftStart, leftEnd)) + Number(explodePair[0])).toString();
    }

    // Go to the right
    const { rightStart, rightEnd } = getRightOfExplodingSnailfishNumber(combined, explodeEnd);
    let right = '';
    if (rightEnd) {
        right =
            (Number(combined.slice(rightStart, rightEnd)) + Number(explodePair[1])).toString() +
            combined.slice(rightEnd);
    }

    const middle =
        combined.slice(leftEnd, explodeStart).toString() +
        '0' +
        combined.slice(explodeEnd, rightStart).toString();

    return left + middle + right;
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
