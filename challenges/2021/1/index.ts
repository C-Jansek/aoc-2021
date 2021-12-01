import getInput from '../../../utils/getInput';

const part1 = () => {
    let depths = getInput('2021', '1')
        .split('\n')
        .map((depth) => Number(depth));

    console.log(depths.length);

    let prevDepth = depths[0];
    depths = depths.slice(1);
    let count = 0;
    for (const depth of depths) {
        if (depth > prevDepth) count++;
        prevDepth = depth;
    }
    return count;
};

const part2 = () => {
    let depths = getInput('2021', '1')
        .split('\n')
        .map((depth) => Number(depth));

    console.log(depths.length);

    let prevDepth = depths[0];
    prevDepth += depths[1];
    prevDepth += depths[2];
    depths = depths.slice(0);
    let count = 0;
    for (let i = 0; i < depths.length; i++) {
        const depth = depths[i - 2] + depths[i - 1] + depths[i];
        if (depth > prevDepth) count++;
        prevDepth = depth;
    }
    return count;
};

console.log(`Solution 1: ${part1()}`);
console.log(`Solution 2: ${part2()}`);
