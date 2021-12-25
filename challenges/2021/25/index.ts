import { cloneDeep } from 'lodash';
import getInput from '../../../utils/getInput';

type Point = {
    value: '.' | '>' | 'v';
    row: number;
    col: number;
};

class Grid {
    points: Point[][];

    constructor(input: string[]) {
        this.points = this.parseInput(input);
    }

    parseInput(input: string[]): Point[][] {
        const points: Point[][] = [];

        for (const [rowIndex, inputRow] of input.entries()) {
            const row: Point[] = [];
            for (const [colIndex, inputCol] of inputRow.split('').entries()) {
                if (inputCol !== 'v' && inputCol !== '>' && inputCol !== '.') {
                    throw new Error('No sea cucumber');
                }

                row.push({
                    value: inputCol,
                    row: rowIndex,
                    col: colIndex,
                });
            }
            points.push(row);
        }

        return points;
    }

    _doEastStep(): boolean {
        const points: Point[][] = cloneDeep(this.points);

        for (const row of this.points) {
            for (const point of row) {
                if (point.value === 'v' || point.value === '.') {
                    continue;
                }

                const nextPosition = this.points[point.row][point.col + 1];
                if (nextPosition) {
                    if (nextPosition.value === '.') {
                        points[point.row][point.col + 1].value = '>';
                        points[point.row][point.col].value = '.';
                    }
                } else if (this.points[point.row][0].value === '.') {
                    points[point.row][0].value = '>';
                    points[point.row][point.col].value = '.';
                }
            }
        }

        if (this.noMoreMovement(this.points, points)) return true;

        this.points = points;
        return false;
    }

    _doSouthStep(): boolean {
        const points: Point[][] = cloneDeep(this.points);

        for (const row of this.points) {
            for (const point of row) {
                if (point.value === '>' || point.value === '.') {
                    continue;
                }

                const nextPositionRow = this.points[point.row + 1];

                if (nextPositionRow) {
                    if (nextPositionRow[point.col].value === '.') {
                        points[point.row + 1][point.col].value = 'v';
                        points[point.row][point.col].value = '.';
                    }
                } else if (this.points[0][point.col].value === '.') {
                    points[0][point.col].value = 'v';
                    points[point.row][point.col].value = '.';
                }
            }
        }
        if (this.noMoreMovement(this.points, points)) return true;

        this.points = points;
        return false;
    }

    doStep() {
        let stopNow = true;
        stopNow = this._doEastStep() && stopNow;
        stopNow = this._doSouthStep() && stopNow;
        return stopNow;
    }

    noMoreMovement(a: Point[][], b: Point[][]) {
        const aString = a.map((row) => row.map((point) => point.value).join('')).join('\n');
        const bString = b.map((row) => row.map((point) => point.value).join('')).join('\n');

        return aString === bString;
    }

    printGrid() {
        console.log(this.points.map((row) => row.map((point) => point.value).join('')).join('\n'));
    }
}

const part1 = () => {
    const input = getInput('2021', '25').split('\n');

    // const input = ['...>...', '.......', '......>', 'v.....>', '......>', '.......', '..vvv..'];
    // const input = [
    //     'v...>>.vv>',
    //     '.vv>>.vv..',
    //     '>>.>v>...v',
    //     '>>v>>.>.v.',
    //     'v>v.vv.v..',
    //     '>.>>..v...',
    //     '.vv..>.>v.',
    //     'v.v..>>v.v',
    //     '....v..v.>',
    // ];

    const grid = new Grid(input);

    let index = 0;

    while (!grid.doStep()) {
        index++;
        console.log(index);
    }

    grid.printGrid();
    // grid.doStep();
    // console.log();
    // grid.printGrid();

    return index + 1;
};

const part2 = () => {
    const input = getInput('2021', '25').split('\n');

    return;
};

console.log(`Solution 1: ${part1()}`);
console.log(`Solution 2: ${part2()}`);
