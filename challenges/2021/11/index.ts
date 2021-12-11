import getInput from '../../../utils/getInput';

type Octopuss = {
    row: number;
    col: number;
    energyLevel: number;
    flashed: boolean;
};

const part1 = () => {
    const input = getInput('2021', '11')
        .split('\n')
        .filter((row) => row != '');

    // const input = [
    //     '5483143223',
    //     '2745854711',
    //     '5264556173',
    //     '6141336146',
    //     '6357385478',
    //     '4167524645',
    //     '2176841721',
    //     '6882881134',
    //     '4846848554',
    //     '5283751526',
    // ];

    let octopusses = input.map((row, rowIndex) =>
        row.split('').map((col, colIndex) => {
            return {
                row: rowIndex,
                col: colIndex,
                energyLevel: Number(col),
                flashed: false,
            };
        }),
    );

    let flashes = 0;

    for (let step = 0; step < 100; step++) {
        // Increase by One
        for (const octopuss of octopusses.flat(2)) {
            octopuss.energyLevel += 1;
            octopuss.flashed = false;
        }

        // Flash
        while (
            octopusses.flat(2).some((octopuss) => octopuss.energyLevel > 9 && !octopuss.flashed)
        ) {
            for (const [rowIndex, row] of octopusses.entries()) {
                for (const [colIndex, octopuss] of row.entries()) {
                    if (octopuss.energyLevel > 9 && !octopuss.flashed) {
                        octopusses[rowIndex][colIndex].flashed = true;
                        for (const neighbour of findNeighbours(octopusses, octopuss)) {
                            neighbour.energyLevel += 1;
                        }
                    }
                }
            }
        }
        for (const octopuss of octopusses.flat(2)) {
            if (octopuss.flashed) {
                octopuss.energyLevel = 0;
                flashes += 1;
            }
        }
    }

    return flashes;
};

const findNeighbours = (octopusses: Octopuss[][], octopuss: Octopuss): Octopuss[] => {
    const neighbours: Octopuss[] = [];
    for (let row = -1; row <= 1; row++) {
        for (let col = -1; col <= 1; col++) {
            if (
                0 <= octopuss.row - row &&
                octopuss.row - row < octopusses.length &&
                0 <= octopuss.col - col &&
                octopuss.col - col < octopusses[0].length
            ) {
                neighbours.push(octopusses[octopuss.row - row][octopuss.col - col]);
            }
        }
    }
    return neighbours;
};

const part2 = () => {
    const input = getInput('2021', '11')
        .split('\n')
        .filter((row) => row != '');

    // const input = [
    //     '5483143223',
    //     '2745854711',
    //     '5264556173',
    //     '6141336146',
    //     '6357385478',
    //     '4167524645',
    //     '2176841721',
    //     '6882881134',
    //     '4846848554',
    //     '5283751526',
    // ];

    let octopusses = input.map((row, rowIndex) =>
        row.split('').map((col, colIndex) => {
            return {
                row: rowIndex,
                col: colIndex,
                energyLevel: Number(col),
                flashed: false,
            };
        }),
    );
    let step = 0;
    while (!octopusses.flat(2).every((octopuss) => octopuss.flashed)) {
        // Increase by One
        for (const octopuss of octopusses.flat(2)) {
            octopuss.energyLevel += 1;
            octopuss.flashed = false;
        }

        // Flash
        while (
            octopusses.flat(2).some((octopuss) => octopuss.energyLevel > 9 && !octopuss.flashed)
        ) {
            for (const [rowIndex, row] of octopusses.entries()) {
                for (const [colIndex, octopuss] of row.entries()) {
                    if (octopuss.energyLevel > 9 && !octopuss.flashed) {
                        octopusses[rowIndex][colIndex].flashed = true;
                        for (const neighbour of findNeighbours(octopusses, octopuss)) {
                            neighbour.energyLevel += 1;
                        }
                    }
                }
            }
        }

        // Reset
        for (const octopuss of octopusses.flat(2)) {
            if (octopuss.flashed) {
                octopuss.energyLevel = 0;
            }
        }
        step++;
    }

    return step;
};

console.log(`Solution 1: ${part1()}`);
console.log(`Solution 2: ${part2()}`);
