import getInput from '../../../utils/getInput';

const part1 = () => {
    const depths = getInput('2021', '1')
        .split('\n')
        .map((depth) => Number(depth));

    return depths
        .map((current, index, allDepths) => allDepths[index] > allDepths[index - 1])
        .reduce((accumulator, current) => accumulator + Number(current), 0);
};

const part2 = () => {
    const depths = getInput('2021', '1')
        .split('\n')
        .map((depth) => Number(depth));

    return depths
        .map(
            (current, index, allDepths) =>
                allDepths[index - 2] + allDepths[index - 1] + allDepths[index] >
                allDepths[index - 3] + allDepths[index - 2] + allDepths[index - 1],
        )
        .reduce((accumulator, current) => accumulator + Number(current), 0);
};

console.log(`Solution 1: ${part1()}`);
console.log(`Solution 2: ${part2()}`);
