import getInput from '../../../utils/getInput';
import * as _ from 'lodash';

const part1 = () => {
    const input = getInput('2021', '6')
        .split('\n')[0]
        .split(',')
        .map((fish) => Number(fish));

    let lanternfish = input;

    for (let day = 0; day < 80; day++) {
        const newLanternfish: number[] = [];
        lanternfish = lanternfish.map((fish) => {
            if (fish === 0) {
                newLanternfish.push(8);
                return 6;
            }
            return fish - 1;
        });
        lanternfish.push(...newLanternfish);
    }

    return lanternfish.length;
};

const part2 = () => {
    const input = getInput('2021', '6')
        .split('\n')[0]
        .split(',')
        .map((fish) => Number(fish));

    const days = 256;
    const newFishAge = 8;
    const reproducedFishAge = 6;

    // Set starting fish days till reproduce
    let fishDaysTillReproduce = newZerosArray(newFishAge + 1);
    for (const fish of input) {
        fishDaysTillReproduce[fish + 1] += 1;
    }

    // For each day
    for (let day = 0; day <= days; day++) {
        const newFish = newZerosArray(newFishAge + 1);
        for (let fishAge = newFishAge; fishAge >= 0; fishAge--) {
            // Fishes at 0 reproduce
            if (fishAge === 0) {
                newFish[reproducedFishAge] += fishDaysTillReproduce[0];
                newFish[newFishAge] += fishDaysTillReproduce[0];
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
};

const newZerosArray = (length: number): number[] => Array.from({ length: length }).map(() => 0);

console.log(`Solution 1: ${part1()}`);
console.log(`Solution 2: ${part2()}`);
