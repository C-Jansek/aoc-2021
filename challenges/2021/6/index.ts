import getInput from '../../../utils/getInput';
import * as _ from 'lodash';

/**
 * Return a new array of zeros (0) of length `length`
 * @param {number} length
 * @return {number[]}
 */
const newZerosArray = (length: number): number[] => Array.from({ length: length }).map(() => 0);

/**
 * Simulate fish population.
 * For `days` days, fish will become one day closer to reproduction every day.
 * Fish that reproduced will not reproduce the next `reproducedFishAge` days.
 * Fish that are newly born will not reproduce the next `newlyBornAge` days.
 *
 * @param {number[]} input Days till reproduction of starting fish
 * @param {number} [days = 256]
 * @param {number} [newlyBornAge = 8]
 * @param {number} [reproducedFishAge = 6]
 * @return {number} Total fish after `days` days
 */
function simulateFishPopulation(
    input: number[],
    days = 256,
    newlyBornAge = 8,
    reproducedFishAge = 6,
) {
    // Set starting fish days till reproduce
    let fishDaysTillReproduce = newZerosArray(newlyBornAge + 1);
    for (const fish of input) {
        fishDaysTillReproduce[fish + 1] += 1;
    }

    // For each day
    for (let day = 0; day <= days; day++) {
        const newFish = newZerosArray(newlyBornAge + 1);
        for (let fishAge = newlyBornAge; fishAge >= 0; fishAge--) {
            // Fishes at 0 reproduce
            if (fishAge === 0) {
                newFish[reproducedFishAge] += fishDaysTillReproduce[0];
                newFish[newlyBornAge] += fishDaysTillReproduce[0];
            }
            // Others get closer to reproduction
            else {
                newFish[fishAge - 1] = fishDaysTillReproduce[fishAge];
            }
        }

        fishDaysTillReproduce = newFish;
    }

    // Return total amount of fish
    return fishDaysTillReproduce.reduce((total, daysToGo) => total + daysToGo, 0);
}

const part1 = () => {
    const input = getInput('2021', '6')
        .split('\n')[0]
        .split(',')
        .map((fish) => Number(fish));

    return simulateFishPopulation(input, 80);
};

const part2 = () => {
    const input = getInput('2021', '6')
        .split('\n')[0]
        .split(',')
        .map((fish) => Number(fish));

    return simulateFishPopulation(input, 256);
};

console.log(`Solution 1: ${part1()}`);
console.log(`Solution 2: ${part2()}`);
