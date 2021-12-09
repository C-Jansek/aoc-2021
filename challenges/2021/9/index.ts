import _ from 'lodash';
import getInput from '../../../utils/getInput';

const part1 = () => {
    const input = getInput('2021', '9')
        .split('\n')
        .filter((row) => row !== '');

    // const input = ['2199943210', '3987894921', '9856789892', '8767896789', '9899965678'];

    const grid = input.map((row) => row.split('').map((point) => Number(point)));

    const lowPoints = findLowPoints(grid);

    let total = 0;
    for (const lowPoint of lowPoints) {
        total += 1 + lowPoint.value;
    }

    return total;
};

type lowPoint = {
    value: number;
    row: number;
    col: number;
};

type Point = {
    value: number;
    row: number;
    col: number;
};

const findLowPoints = (grid: number[][]): lowPoint[] => {
    const lowPoints = [];

    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[0].length; j++) {
            const value = grid[i][j];

            const otherValues: number[] = [];
            if (grid[i - 1]) otherValues.push(grid[i - 1][j]);
            if (grid[i + 1]) otherValues.push(grid[i + 1][j]);
            if (grid[i]) otherValues.push(grid[i][j - 1]);
            if (grid[i]) otherValues.push(grid[i][j + 1]);

            if (otherValues.filter((x) => x !== undefined).every((x) => x > value)) {
                lowPoints.push({
                    value: value,
                    row: i,
                    col: j,
                });
            }
        }
    }

    return lowPoints;
};

const part2 = () => {
    const input = getInput('2021', '9')
        .split('\n')
        .filter((row) => row !== '');

    // const input = ['2199943210', '3987894921', '9856789892', '8767896789', '9899965678'];

    const grid = input.map((row) => row.split('').map((point) => Number(point)));

    const pointGrid = [];

    for (let i = 0; i < grid.length; i++) {
        const row = [];
        for (let j = 0; j < grid[0].length; j++) {
            row.push({
                value: grid[i][j],
                row: i,
                col: j,
            });
        }
        pointGrid.push(row);
    }

    const lowPoints = findLowPoints(grid);

    const basins = findBasinSizes(pointGrid, lowPoints);

    const basinSizes = basins.map((basin) => basin.length).sort((a, b) => (a < b ? 1 : -1));
    console.log(basinSizes);
    return basinSizes[0] * basinSizes[1] * basinSizes[2];
};

const findBasinSizes = (grid: Point[][], lowPoints: lowPoint[]): Point[][] => {
    const basins: Point[][] = [];

    for (const lowPoint of lowPoints) {
        // console.log(lowPoint, '---------------');
        const seen = new Set<Point>();
        const basin: Point[] = [lowPoint];

        let i = 0;

        while (basin.some((point) => !seen.has(point))) {
            // console.log(basin, seen);
            for (const point of basin.filter((point) => !seen.has(point))) {
                // console.log('\n\ncheck', point);
                const row = point.row;
                const col = point.col;

                let neighbours: Point[] = [];
                if (grid[row - 1]) {
                    neighbours.push(grid[row - 1][col]);
                }
                if (grid[row + 1]) {
                    neighbours.push(grid[row + 1][col]);
                }
                if (grid[row]) {
                    neighbours.push(grid[row][col - 1], grid[row][col + 1]);
                }

                // console.log('neighbours', neighbours);
                neighbours = neighbours.filter(
                    (x) => x?.value !== undefined && x.value < 9 && !seen.has(x),
                );
                // console.log(neighbours, seen);
                // console.log('filtered neighbours', neighbours);
                basin.push(...neighbours);

                seen.add(point);
            }
            // if (i < 2) i++;
            // else break;
        }

        const newBasin: Point[] = [];
        for (let i = 0; i < grid.length; i++) {
            for (let j = 0; j < grid[0].length; j++) {
                const point = basin.find((point) => point.row === i && point.col === j);
                if (point) {
                    newBasin.push(point);
                }
            }
        }
        basins.push(newBasin);
    }

    return basins;
};

console.log(`Solution 1: ${part1()}`);
console.log(`Solution 2: ${part2()}`);
