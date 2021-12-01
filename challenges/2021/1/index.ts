import getInput from '../../../utils/getInput';

const part1 = () => {
    let depths = getInput('2021', '1')
        .split('\n')
        .map((depth) => Number(depth));

    return depths
        .map((cur, i, allDepths) => allDepths[i] > allDepths[i - 1])
        .reduce((acc, cur) => acc + Number(cur), 0);
};

const part2 = () => {
    let depths = getInput('2021', '1')
        .split('\n')
        .map((depth) => Number(depth));

    return depths
        .map(
            (cur, i, allDepths) =>
                allDepths[i - 2] + allDepths[i - 1] + allDepths[i] >
                allDepths[i - 3] + allDepths[i - 2] + allDepths[i - 1]
        )
        .reduce((acc, cur) => acc + Number(cur), 0);
};

console.log(`Solution 1: ${part1()}`);
console.log(`Solution 2: ${part2()}`);
