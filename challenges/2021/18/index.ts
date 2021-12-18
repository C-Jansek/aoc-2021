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
    let count = 0;
    while ((maxDepth(reduced) > 4 || maxNumber(reduced) > 9) && count < 8) {
        // while (maxNumber(reduced) > 9) {
        console.log(
            '\n\nreduce ROUND -------------------------------\n',
            util.inspect(reduced, false, null, true),
        );
        if (maxDepth(reduced) > 4) {
            console.log('explode');
            reduced = explodeSnailfishNumber(reduced);
            count++;
            console.log(maxDepth(reduced) >= 4, maxNumber(reduced) > 9, count < 2);
            continue;
        }
        if (maxNumber(reduced) > 9) {
            console.log('split');
            reduced = splitSnailfishNumber(reduced);
        }
        console.log(maxDepth(reduced) >= 4, maxNumber(reduced) > 9, count < 2);
        count++;
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
            console.log({ depth, first, second });
            break;
        }
        explodeStart++;
    }
    console.log(first);
    console.log(second);

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
        if (char === ',') {
            leftCharEnd = leftIndex - 1;
        }
        if (leftCharEnd && char === '[') {
            leftCharStart = leftIndex;
            break;
        }
        leftIndex--;
    }

    // Go to the right
    let rightCharEnd;
    let rightCharStart;
    let rightIndex = explodeEnd;
    for (const char of combined.slice(explodeEnd)) {
        if (char === ',') {
            rightCharStart = rightIndex + 1;
        }
        if (rightCharStart && char === ']') {
            rightCharEnd = rightIndex;
            break;
        }
        rightIndex++;
    }

    let output = '';
    if (leftCharStart) {
        console.log('out 1', output);
        output += combined.slice(0, leftCharStart);
        console.log('out 2', output);
        console.log(combined.slice(leftCharStart, leftCharEnd), first);
        console.log(Number(combined.slice(leftCharStart, leftCharEnd)), Number(first));
        output += `${Number(combined.slice(leftCharStart, leftCharEnd)) + Number(first)}`;
        console.log('out 3', output);
    }
    output += `${combined.slice(leftCharEnd, explodeStart)}`;
    console.log('out 4', output);
    output += `0`;
    console.log('out 5', output);
    output += `${combined.slice(explodeEnd, rightCharStart)}`;
    console.log('out 6', output);

    if (rightCharEnd) {
        output += `${Number(combined.slice(rightCharStart, rightCharEnd)) + Number(second)}`;
        console.log('out 7', output);
        output += combined.slice(rightCharEnd);
        console.log('out 8', output);
    }

    console.log(combined);
    console.log('\t V');
    console.log(output);

    return output;
};

const part1 = () => {
    // const input = getInput('2021', '18')
    //     .split('\n')
    //     .filter((line) => line !== '');

    // const input = ['[[[[[9,8],1],2],3],4]'];
    // const input = ['[[[[0,7],4],[15,[0,13]]],[1,1]]'];
    // const input = ['[[[[[9,8],1],2],3],4]'];
    const input = ['[[[[[4,3],4],4],[7,[[8,4],9]]],[1,1]]'];

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
