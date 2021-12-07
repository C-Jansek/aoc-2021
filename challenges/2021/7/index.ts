import getInput from '../../../utils/getInput';

const part1 = () => {
    const input = getInput('2021', '7').split('\n');

    const crabs = input[0].split(',').map((crab) => Number(crab));

    const minHorizontal = Math.min(...crabs);
    const maxHorizontal = Math.max(...crabs);

    let minFuel = Number.POSITIVE_INFINITY;
    for (let position = minHorizontal; position <= maxHorizontal; position++) {
        let neededFuel = 0;
        for (const crab of crabs) {
            neededFuel += Math.abs(position - crab);
        }
        if (minFuel > neededFuel) minFuel = neededFuel;
    }

    return minFuel;
};

const part2 = () => {
    const input = getInput('2021', '7').split('\n');

    const crabs = input[0].split(',').map((crab) => Number(crab));

    const minHorizontal = Math.min(...crabs);
    const maxHorizontal = Math.max(...crabs);

    let minFuel = Number.POSITIVE_INFINITY;
    for (let position = minHorizontal; position <= maxHorizontal; position++) {
        let neededFuel = 0;
        for (const crab of crabs) {
            const steps = Math.abs(position - crab);
            for (let step = 1; step <= steps; step++) {
                neededFuel += step;
            }
        }
        if (minFuel > neededFuel) minFuel = neededFuel;
    }

    return minFuel;
};

console.log(`Solution 1: ${part1()}`);
console.log(`Solution 2: ${part2()}`);
