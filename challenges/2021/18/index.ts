import _ from 'lodash';
import util from 'util';
import getInput from '../../../utils/getInput';

// const parseInput = (input: string[]) => {
//     return input.map((line) => parseLine(line));
// };

// const parseLine = (line: string): any => {
//     if (line.length < 5) return Number(line);
//     if (line.length === 5) {
//         return line
//             .slice(1, -1)
//             .split(',')
//             .map((value) => Number(value));
//     }

//     const snailfishNumbers = [];
//     let depth = 0;
//     let index = 0;
//     for (const char of line) {
//         if (char === '[') depth++;
//         else if (char === ']') depth--;
//         if (depth === 1 && char === ',') {
//             snailfishNumbers.push(
//                 parseLine(line.slice(1, index)),
//                 parseLine(line.slice(index + 1, -1)),
//             );
//             break;
//         }
//         index++;
//     }
//     return snailfishNumbers;
// };

// const addSnailfishNumbers = (a: any, b: any): any => {
//     const combinedNumbers = [a, b];
//     if (maxDepth(combinedNumbers) < 4 && maxNumber(combinedNumbers) > 9) return combinedNumbers;

//     return reduceSnailfishNumber(combinedNumbers);
// };

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

const reduceSnailfishNumber = (combined: string): any => {
    let reduced = combined;
    console.log('reduce', reduced);
    while (maxDepth(reduced) >= 4 || maxNumber(reduced) > 9) {
        // while (maxNumber(reduced) > 9) {
        console.log(
            '\n\nreduce ROUND -------------------------------\n',
            util.inspect(reduced, false, null, true),
        );
        if (maxDepth(combined) >= 4) {
            console.log('explode');
            combined = explodeSnailfishNumber(combined);
            continue;
        }
        if (maxNumber(reduced) > 9) {
            console.log('split');
            reduced = splitSnailfishNumber(reduced);
        }
    }

    console.log('okay now??', util.inspect(reduced, false, null, true));
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

const splitSnailfishNumber = (combined: string): any => {
    if (combined[0] !== '[') {
        return `[${Math.floor(Number(combined) / 2)},${Math.ceil(Number(combined) / 2)}]`;
    }

    const [first, second] = splitLine(combined);

    // console.log(first, second);
    // console.log(maxNumber(first), maxNumber(second));

    if (maxNumber(first) > 9) {
        const split = splitSnailfishNumber(first);
        return `[${split},${second}]`;
    } else if (maxNumber(second) > 9) {
        const split = splitSnailfishNumber(second);
        return `[${first},${split}]`;
    }
    throw new Error('no split?');
};

const explodeSnailfishNumber = (combined: string): string => {
    let depth = 0;
    let explodeIndex = 0;
    let first: any;
    let second: any;
    let endStart: any;

    for (const char of combined) {
        if (char === '[') depth++;
        else if (char === ']') depth--;
        if (depth === 4) {
            first = _.get(combined.slice(explodeIndex).match(/\[(\d+),/g), 0)?.slice(1, -1);
            second = _.get(combined.slice(explodeIndex).match(/,(\d+)]/g), 0)?.slice(1, -1);
            endStart = explodeIndex + combined.slice(explodeIndex).indexOf(']') + 1;
            break;
        }
        explodeIndex++;
    }
    console.log(first);
    console.log(second);

    // Go to the right
    let rightCharEnd;
    let rightCharStart;
    let rightIndex = endStart;
    for (const char of combined.slice(endStart)) {
        if (char === ',') {
            rightCharStart = rightIndex + 1;
        }
        if (rightCharStart && char === ']') {
            rightCharEnd = rightIndex;
            break;
        }
        rightIndex++;
    }

    const middle = `0${combined.slice(endStart, rightCharStart)}${Number(
        combined.slice(rightCharStart, rightCharEnd),
    ) + Number(second)}`;

    const front = combined.slice(0, explodeIndex);
    const end = combined.slice(rightCharEnd);

    const output = `${front}${middle}${end}`;
    console.log(output);

    throw new Error('no return?');
};

const part1 = () => {
    // const input = getInput('2021', '18')
    //     .split('\n')
    //     .filter((line) => line !== '');

    // const input = ['[[[[[9,8],1],2],3],4]'];
    // const input = ['[[[[0,7],4],[15,[0,13]]],[1,1]]'];
    const input = ['[[[[[9,8],1],2],3],4]'];

    // const homework = snailfishNumbers.reduce((total, current) =>
    //     addSnailfishNumbers(total, current),
    // );

    const homework = reduceSnailfishNumber(input[0]);
    console.log('homework:\n', util.inspect(homework, false, null, true));

    return;
};

const part2 = () => {
    const input = getInput('2021', '18').split('\n');

    return;
};

console.log(`Solution 1: ${part1()}`);
console.log(`Solution 2: ${part2()}`);
