import getInput from '../../../utils/getInput';

const part1 = () => {
    const input = getInput('2021', '3').split('\n');

    // The amount of times bit 1 occurs in each position
    let onesCount = input[0].split('').map(() => 0);
    for (const line of input) {
        const thisLine = line.split('').map((char) => Number(char));
        onesCount = onesCount.map((count, index) => count + thisLine[index]);
    }

    // Binary number of the most common bit in each place
    const gammaRateBinary = onesCount.map((count) => Number(count > input.length / 2)).join('');
    const gammaRate = Number.parseInt(gammaRateBinary, 2);

    // Binary number of the least common bit in each place
    const epsilonRateBinary = onesCount.map((count) => Number(count < input.length / 2)).join('');
    const epsilonRate = Number.parseInt(epsilonRateBinary, 2);

    return gammaRate * epsilonRate;
};

const part2 = () => {
    const input = getInput('2021', '3').split('\n');

    let oxRemaining = input;
    let coRemaining = input;
    let oxygenRating = 0;
    let co2Rating = 0;

    // For each bit
    for (let index = 0; index < input[0].length; index++) {
        if (oxygenRating && co2Rating) break;

        // Filter most common bit for oxygen rating
        const oxOnesCount = oxRemaining.reduce((count, line) => count + Number(line[index]), 0);
        const oxBit = Number(oxOnesCount >= oxRemaining.length / 2);
        oxRemaining = oxRemaining.filter((line) => Number(line[index]) === oxBit);

        // Filter least common bit for co2 rating
        const coOnesCount = coRemaining.reduce((count, line) => count + Number(line[index]), 0);
        const coBit = Number(coOnesCount < coRemaining.length / 2);
        coRemaining = coRemaining.filter((line) => Number(line[index]) === coBit);

        // If only one remaining, this is the rating in binary
        if (!oxygenRating && oxRemaining.length === 1) {
            oxygenRating = Number.parseInt(oxRemaining[0], 2);
        }

        if (!co2Rating && coRemaining.length === 1) {
            co2Rating = Number.parseInt(coRemaining[0], 2);
        }
    }

    return oxygenRating * co2Rating;
};

console.log(`Solution 1: ${part1()}`);
console.log(`Solution 2: ${part2()}`);
