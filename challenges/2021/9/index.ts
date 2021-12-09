import _ from 'lodash';
import getInput from '../../../utils/getInput';

type Point = {
    value: number;
    row: number;
    col: number;
};

const directions = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
];

const getNeighbours = (grid: Point[][], point: Point): Point[] => {
    const neighbours: Point[] = [];
    for (const direction of directions) {
        if (
            grid[point.row + direction[0]] &&
            grid[point.row + direction[0]][point.col + direction[1]]
        ) {
            neighbours.push(grid[point.row + direction[0]][point.col + direction[1]]);
        }
    }
    return neighbours;
};

class Grid {
    points: Point[][];
    basins: Point[][];

    constructor(grid: number[][]) {
        this.points = this.parseToPoints(grid);
        this.basins = this.findBasins();
    }

    parseToPoints(grid: number[][]): Point[][] {
        const pointGrid = [];

        for (let row = 0; row < grid.length; row++) {
            const pointsRow: Point[] = [];
            for (let col = 0; col < grid[0].length; col++) {
                pointsRow.push({
                    value: grid[row][col],
                    row: row,
                    col: col,
                });
            }
            pointGrid.push(pointsRow);
        }
        return pointGrid;
    }

    findLowPoints(): Point[] {
        const lowPoints = [];

        for (const row of this.points) {
            for (const point of row) {
                const neighbours: Point[] = getNeighbours(this.points, point);

                if (neighbours.every((x) => x.value > point.value)) {
                    lowPoints.push(point);
                }
            }
        }

        return lowPoints;
    }

    findBasins(): Point[][] {
        const basins: Point[][] = [];

        for (const lowPoint of this.findLowPoints()) {
            const seen = new Set<Point>([lowPoint]);
            const toCheck: Point[] = [lowPoint];

            while (true) {
                const point = toCheck.shift();
                if (!point) break;
                seen.add(point);

                const neighbours: Point[] = getNeighbours(this.points, point);
                toCheck.push(
                    ...neighbours.filter(
                        (neighbour) => neighbour.value < 9 && !seen.has(neighbour),
                    ),
                );
            }

            basins.push([...seen]);
        }
        return basins;
    }
}

const part1 = () => {
    const input = getInput('2021', '9')
        .split('\n')
        .filter((row) => row !== '')
        .map((row) => row.split('').map((point) => Number(point)));

    const grid = new Grid(input);
    const lowPoints = grid.findLowPoints();

    let total = 0;
    for (const lowPoint of lowPoints) {
        total += 1 + lowPoint.value;
    }

    return total;
};

const part2 = () => {
    const input = getInput('2021', '9')
        .split('\n')
        .filter((row) => row !== '')
        .map((row) => row.split('').map((point) => Number(point)));

    const grid = new Grid(input);
    const basinSizes = grid.basins.map((basin) => basin.length).sort((a, b) => b - a);

    return basinSizes.slice(0, 3).reduce((total, size) => total * size, 1);
};
console.log(`Solution 1: ${part1()}`);
console.log(`Solution 2: ${part2()}`);
