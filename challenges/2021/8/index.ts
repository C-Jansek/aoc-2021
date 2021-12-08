import getInput from '../../../utils/getInput';

const part1 = () => {
    const input = getInput('2021', '8')
        .split('\n')
        .slice(0, -1);

    let total = 0;
    for (const line of input) {
        const outputs = line.split(' | ')[1].split(' ');
        for (const out of outputs) {
            if ([2, 3, 4, 7].includes(out.length)) total++;
        }
    }

    return total;
};

const setIntersection = (a: Set<any>, b: Set<any>): Set<any> => {
    return new Set([...a].filter((x) => b.has(x)));
};

const setsAreEqual = (a: Set<any>, b: Set<any>): boolean => {
    return a.size === b.size && [...a].every((value) => b.has(value));
};

const processLine = (line: string): number => {
    const [input, output] = line
        .split(' | ')
        .map((part) => part.split(' ').map((segment) => new Set(segment.split(''))));

    const digits: { [key: number]: Set<string> } = {};

    // Set all unique lengths
    for (const digit of input) {
        if (digit.size === 2) digits[1] = new Set(digit);
        else if (digit.size === 4) digits[4] = new Set(digit);
        else if (digit.size === 3) digits[7] = new Set(digit);
        else if (digit.size === 7) digits[8] = new Set(digit);
    }

    for (const digit of input) {
        if (digit.size === 5) {
            if (setIntersection(digit, digits[1]).size === 2) {
                digits[3] = digit;
            } else if (setIntersection(digit, digits[4]).size === 3) {
                digits[5] = digit;
            } else {
                digits[2] = digit;
            }
        } else if (digit.size === 6) {
            if (setIntersection(digit, digits[7]).size === 2) {
                digits[6] = digit;
            } else if (setIntersection(digit, digits[4]).size === 4) {
                digits[9] = digit;
            } else {
                digits[0] = digit;
            }
        }
    }

    let outputValue = '';
    for (const out of output) {
        for (const [digit, digitSegments] of Object.entries(digits)) {
            if (setsAreEqual(out, digitSegments)) outputValue += String(digit);
        }
    }

    return Number(outputValue);
};

const part2 = () => {
    const input = getInput('2021', '8')
        .split('\n')
        .slice(0, -1);

    let total = 0;
    for (const line of input) {
        total += processLine(line);
    }
    return total;
};

console.log(`Solution 1: ${part1()}`);
console.log(`Solution 2: ${part2()}`);
