import * as _ from 'lodash';
import getInput from '../../../utils/getInput';

type Point = {
    x: number,
    y: number,
};

type Fold = {
    axis: string,
    value: number,
};

/**
 * Parse the input to a list of coordinates and a list of folds.
 */
const parseInput = (input: string[]): { coordinates: Point[], folds: Fold[], } => {
    const coordinates = input
        .filter((line) => line !== '')
        .filter((line) => /fold along/.exec(line) === null)
        .map((line) => line.split(','))
        .map((point) => {
            return { x: Number(point[0]), y: Number(point[1]) };
        });

    const folds = input
        .filter((line) => line !== '')
        .filter((line) => /fold along/.exec(line) !== null)
        .map((line) => {
            const row = line.split('=');
            const axis = row[0].endsWith('x') ? 'x' : 'y';
            const value = Number(row[1]);
            return { axis, value };
        });

    return { coordinates, folds };
};

/**
 * Output an array of rows in which coordinates in the list are displayed as a block (█),
 * and coordinates that are not in the list are displayed as a space ( ).
 */
const printCode = (coordinates: Point[]): string => {
    const maxX = Math.max(...coordinates.map((point) => point.x));
    const maxY = Math.max(...coordinates.map((point) => point.y));

    let output = '\n';
    for (let row = 0; row <= maxY; row++) {
        for (let col = 0; col <= maxX; col++) {
            output += coordinates.some((point) => point.x === col && point.y === row) ? '█' : ' ';
        }

        output += '\n';
    }

    return output;
};

const part1 = () => {
    const input = getInput('2021', '13').split('\n');

    const { coordinates, folds } = parseInput(input);

    // Do the first fold
    const fold = folds[0];
    for (const coord of coordinates) {
        if (fold.axis === 'y' && coord.y > fold.value) {
            coord.y = fold.value - (coord.y - fold.value);
        }

        if (fold.axis === 'x' && coord.x > fold.value) {
            coord.x = fold.value - (coord.x - fold.value);
        }
    }

    // Filter out points that landed on the same spot after folding
    const newCoordinates = _.uniqBy(coordinates, (point) => `${point.x}_${point.y}`);

    return newCoordinates.length;
};

const part2 = () => {
    const input = getInput('2021', '13').split('\n');

    const { coordinates, folds } = parseInput(input);

    // Do all folds
    for (const fold of folds) {
        for (const coord of coordinates) {
            if (fold.axis === 'y' && coord.y > fold.value) {
                coord.y = fold.value - (coord.y - fold.value);
            }

            if (fold.axis === 'x' && coord.x > fold.value) {
                coord.x = fold.value - (coord.x - fold.value);
            }
        }
    }

    // Filter out points that landed on the same spot after folding
    const uniqCoordinates = _.uniqBy(coordinates, (point) => `${point.x}_${point.y}`);

    return printCode(uniqCoordinates);
};

console.log(`Solution 1: ${part1()}`);
console.log(`Solution 2: ${part2()}`);
