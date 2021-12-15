import getInput from '../../../utils/getInput';
import Heap from 'heap';

type Point = {
    col: number,
    cost: number,
    row: number,
    totalCost: number,
};

const directions = [
    [0, -1],
    [0, 1],
    [1, 0],
    [-1, 0],
];

class Grid {
    points: Point[][];

    constructor (input: string[], nSquaredTiles = 1) {
        this.points = this._parseInput(input, nSquaredTiles);
    }

    findShortestPath (start: Point, end: Point): number {
        const pQueue = new Heap((a: Point, b: Point) => b.totalCost > a.totalCost ? -1 : 1);
        pQueue.push(start);
        start.totalCost = 0;

        while (!pQueue.empty()) {
            const next = pQueue.pop();
            if (!next) throw new Error('No more points');
            if (next === end) {
                return end.totalCost;
            }

            const shorterNeighbours = this.getNeighbours(next).filter(
                (neighbour) => neighbour.totalCost > next.totalCost + neighbour.cost,
            );

            for (const short of shorterNeighbours) {
                short.totalCost = next.totalCost + short.cost;
                if (short === end) {
                    return end.totalCost;
                }

                pQueue.push(short);
            }
        }

        throw new Error('Found no Path!');
    }

    getPoint (row: number, col: number): Point {
        return this.points[row] && this.points[row][col]
            ? this.points[row][col]
            : { col, cost: Number.POSITIVE_INFINITY, row, totalCost: Number.POSITIVE_INFINITY };
    }

    getNeighbours (point: Point): Point[] {
        return directions.map((direction) => {
            return this.getPoint(point.row + direction[0], point.col + direction[1]);
        });
    }

    _parseInput (input: string[], nSquaredTiles: number): Point[][] {
        const points: Point[][] = [];

        for (let rowTile = 0; rowTile < nSquaredTiles; rowTile++) {
            for (const [rowIndex, inputRow] of input.entries()) {
                const row: Point[] = [];

                for (let colTile = 0; colTile < nSquaredTiles; colTile++) {
                    for (const [colIndex, point] of inputRow.split('').entries()) {
                        row.push({
                            col: colIndex + input[0].length * colTile,
                            cost: this._getCost(Number(point) + rowTile + colTile),
                            row: rowIndex + input.length * rowTile,
                            totalCost: Number.POSITIVE_INFINITY,
                        });
                    }
                }

                points.push(row);
            }
        }

        return points;
    }

    _getCost (cost: number): number {
        while (cost > 9) cost -= 9;
        return cost;
    }

    printGrid (): void {
        console.log(
            this.points
                .map((row) => row.map((point) => `${point.cost}`.slice(-3)).join(' '))
                .join('\n'),
        );
        console.log(
            this.points
                .map((row) => row.map((point) => `000${point.totalCost}`.slice(-3)).join(' '))
                .join('\n'),
        );
    }
}

const part1 = () => {
    console.time('p1');
    const input = getInput('2021', '15')
        .split('\n')
        .filter((line) => line !== '');

    const grid = new Grid(input, 1);

    const start = grid.getPoint(0, 0);
    const end = grid.getPoint(
        grid.points.length - 1,
        grid.points[grid.points.length - 1].length - 1,
    );

    return grid.findShortestPath(start, end);
};

const part2 = () => {
    const input = getInput('2021', '15')
        .split('\n')
        .filter((line) => line !== '');

    const grid = new Grid(input, 5);

    const start = grid.getPoint(0, 0);
    const end = grid.getPoint(
        grid.points.length - 1,
        grid.points[grid.points.length - 1].length - 1,
    );

    return grid.findShortestPath(start, end);
};

console.log(`Solution 1: ${part1()}`);
console.log(`Solution 2: ${part2()}`);
