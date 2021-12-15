import getInput from '../../../utils/getInput';

type Point = {
    row: number;
    col: number;
    pathUntil: number;
    cost: number;
    pointsUntil: Point[];
};

const part1 = () => {
    const input = getInput('2021', '15')
        .split('\n')
        .filter((line) => line !== '')
        .map((row) => row.split(''));

    const grid: Point[][] = [];

    for (const [rowIndex, row] of input.entries()) {
        const pointRow: Point[] = [];
        for (const [colIndex, col] of row.entries()) {
            pointRow[colIndex] = {
                row: rowIndex,
                col: colIndex,
                pathUntil: Number.POSITIVE_INFINITY,
                cost: Number(col),
                pointsUntil: [],
            };
        }
        grid[rowIndex] = pointRow;
    }

    const start = grid[0][0];
    const end = grid[grid.length - 1][grid[0].length - 1];

    start.pathUntil = 0;
    const seen = new Set<string>();
    const adjacent: Point[] = [start];

    // Looping
    while (adjacent.length > 0) {
        const nextToCheck = adjacent.pop();
        // If it is the last element
        if (!nextToCheck) {
            throw new Error('No more points!');
        }
        seen.add(getHash(nextToCheck));

        if (nextToCheck === end) {
            return nextToCheck.pathUntil;
        }

        adjacent.push(...getNeighbours(nextToCheck, grid, seen));
        if (adjacent.includes(end)) {
            return end.pathUntil;
        }
        adjacent.sort((a, b) => b.pathUntil - a.pathUntil);
    }

    return;
};

const directions = [
    [0, -1],
    [0, 1],
    [1, 0],
    [-1, 0],
];
const getNeighbours = (point: Point, grid: Point[][], seen: Set<string>): Point[] => {
    const neighbours: Point[] = [];
    for (const direction of directions) {
        const row = grid[point.row + direction[0]];
        if (row) {
            const col = row[point.col + direction[1]];
            if (col && col.pathUntil === Number.POSITIVE_INFINITY) {
                col.pathUntil = point.pathUntil + col.cost;
                col.pointsUntil = [...point.pointsUntil, col];
                neighbours.push(col);
            }
        }
    }
    return neighbours;
};

const part2 = () => {
    const input = getInput('2021', '15')
        .split('\n')
        .filter((line) => line !== '')
        .map((row) => row.split(''));

    const grid: Point[][] = [];

    const width = input[0].length;
    const height = input.length;

    for (let rowFactor = 0; rowFactor < 5; rowFactor++) {
        for (let colFactor = 0; colFactor < 5; colFactor++) {
            for (const [rowIndex, row] of input.entries()) {
                const pointRow: Point[] = grid[rowIndex + rowFactor * height]
                    ? grid[rowIndex + rowFactor * height]
                    : [];
                for (const [colIndex, col] of row.entries()) {
                    const cost = calculateCost(Number(col), rowFactor, colFactor);
                    pointRow[colIndex + colFactor * width] = {
                        row: rowIndex + colFactor * width,
                        col: colIndex + rowFactor * height,
                        pathUntil: Number.POSITIVE_INFINITY,
                        cost,
                        pointsUntil: [],
                    };
                }
                grid[rowIndex + rowFactor * height] = pointRow;
            }
        }
    }

    const start = grid[0][0];
    const end = grid[grid.length - 1][grid[0].length - 1];

    start.pathUntil = 0;
    const seen = new Set<string>();
    const adjacent: Point[] = [start];

    // Looping
    while (adjacent.length > 0) {
        const nextToCheck = adjacent.pop();
        // If it is the last element
        if (!nextToCheck) {
            throw new Error('No more points!');
        }
        seen.add(getHash(nextToCheck));

        if (nextToCheck === end) {
            return nextToCheck.pathUntil;
        }

        adjacent.push(...getNeighbours(nextToCheck, grid, seen));
        if (adjacent.includes(end)) {
            return end.pathUntil;
        }
        adjacent.sort((a, b) => b.pathUntil - a.pathUntil);
    }
    console.log('wait what?');
    return;
};

const getHash = (point: Point): string => {
    return `${point.row}_${point.col}_${point.cost}`;
};

const calculateCost = (cost: number, rowFactor: number, colFactor: number): number => {
    cost += rowFactor + colFactor;
    while (true) {
        if (cost <= 9) return cost;
        cost -= 9;
    }
};

console.log(`Solution 1: ${part1()}`);
console.log(`Solution 2: ${part2()}`);
