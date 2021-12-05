import getInput from '../../../utils/getInput';

import { Vector4 } from 'three';
import _ from 'lodash';

const part1 = () => {
    const input = getInput('2021', '5')
        .split('\n')
        .slice(0, -1);

    const size = 1000;
    const lines: Vector4[] = [];

    for (const line of input) {
        const [p1, p2] = line.split(' -> ');
        const [x1, y1] = p1.split(',').map((number) => Number(number));
        const [x2, y2] = p2.split(',').map((number) => Number(number));
        if (x1 === x2 || y1 == y2) {
            lines.push(
                new Vector4(Math.min(x1, x2), Math.min(y1, y2), Math.max(x2, x1), Math.max(y2, y1)),
            );
        } else {
            lines.push(new Vector4(x1, y1, x2, y2));
        }
    }
    const grid: number[][] = [];
    for (let x = 0; x < size; x++) {
        const row: number[] = [];
        for (let y = 0; y < size; y++) {
            row.push(0);
        }
        grid.push(row);
    }

    for (const line of lines) {
        //    Vertical line
        if (line.x === line.z) {
            for (let y = line.y; y <= line.w; y++) {
                grid[y][line.x] += 1;
            }
        }
        // Horizontal
        else if (line.y === line.w) {
            for (let x = line.x; x <= line.z; x++) {
                grid[line.y][x] += 1;
            }
        }
    }

    let total = 0;
    for (let x = 0; x < size; x++) {
        for (let y = 0; y < size; y++) {
            if (grid[y][x] > 1) total++;
        }
    }
    return total;
};

const part2 = () => {
    const input = getInput('2021', '5')
        .split('\n')
        .slice(0, -1);

    const size = 1000;
    const lines: Vector4[] = [];

    for (const line of input) {
        const [p1, p2] = line.split(' -> ');
        const [x1, y1] = p1.split(',').map((number) => Number(number));
        const [x2, y2] = p2.split(',').map((number) => Number(number));
        if (x1 === x2 || y1 == y2) {
            lines.push(
                new Vector4(Math.min(x1, x2), Math.min(y1, y2), Math.max(x2, x1), Math.max(y2, y1)),
            );
        } else {
            lines.push(new Vector4(x1, y1, x2, y2));
        }
    }
    const grid: number[][] = [];
    for (let x = 0; x < size; x++) {
        const row: number[] = [];
        for (let y = 0; y < size; y++) {
            row.push(0);
        }
        grid.push(row);
    }

    for (const line of lines) {
        //    Vertical line
        if (line.x === line.z) {
            for (let y = line.y; y <= line.w; y++) {
                grid[y][line.x] += 1;
            }
        }
        // Horizontal
        else if (line.y === line.w) {
            for (let x = line.x; x <= line.z; x++) {
                grid[line.y][x] += 1;
            }
        }
        // Diagonal
        else {
            if (line.x < line.z) {
                if (line.y < line.w) {
                    for (let iterator = 0; iterator <= line.z - line.x; iterator++) {
                        grid[line.y + iterator][line.x + iterator] += 1;
                        // grid[line.x + iterator][line.y + iterator] += 1;
                    }
                } else {
                    for (let iterator = 0; iterator <= line.z - line.x; iterator++) {
                        grid[line.y - iterator][line.x + iterator] += 1;
                    }
                }
            } else {
                if (line.y < line.w) {
                    for (let iterator = 0; iterator <= line.x - line.z; iterator++) {
                        grid[line.y + iterator][line.x - iterator] += 1;
                        // grid[line.x + iterator][line.y + iterator] += 1;
                    }
                } else {
                    for (let iterator = 0; iterator <= line.x - line.z; iterator++) {
                        grid[line.y - iterator][line.x - iterator] += 1;
                    }
                }
            }
        }
    }

    let total = 0;
    for (let x = 0; x < size; x++) {
        for (let y = 0; y < size; y++) {
            if (grid[y][x] > 1) total++;
        }
    }
    return total;
};

console.log(`Solution 1: ${part1()}`);
console.log(`Solution 2: ${part2()}`);
// 19830 to low
