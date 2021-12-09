import _ from 'lodash';
import getInput from '../../../utils/getInput';

type Point = {
    value: number;
    row: number;
    col: number;
};

// Relative coordinates to find neighbours
const directions = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
];

/**
 * Get all neighbours of `point` that are directly adjacent (horizontal or vertical).
 * @param {Array<Array<Point>>} grid The grid of points
 * @param {Point} point The point to get neigbours from
 * @return {Point[]} The neighbours
 */
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
    lowPoints: Point[];
    basins: Point[][];

    constructor(grid: number[][]) {
        this.points = this.parseToPoints(grid);
        this.lowPoints = this.findLowPoints();
        this.basins = this.findBasins();
    }

    parseToPoints(grid: number[][]): Point[][] {
        return grid.map((row, rowCount) => {
            return row.map((value, colCount) => {
                return {
                    value: value,
                    row: rowCount,
                    col: colCount,
                };
            });
        });
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

        for (const lowPoint of this.lowPoints) {
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

    return grid.lowPoints
        .map((lowPoint) => lowPoint.value + 1)
        .reduce((accumulator, current) => accumulator + current, 0);
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
