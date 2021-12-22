import { assert } from 'console';
import { inRange } from 'lodash';
import { Vector3 } from 'three';
import getInput from '../../../utils/getInput';

type Point = {
    x: number;
    y: number;
    z: number;
    value: boolean;
};

type Instruction = {
    state: boolean;
    start: Vector3;
    end: Vector3;
};

const part1 = () => {
    const input = getInput('2021', '22')
        .split('\n')
        .filter((line) => line !== '');

    const instructions: Instruction[] = [];
    for (const instruction of input) {
        const state = !!instruction.match('on');
        const instrs = instruction.match(/(?!=)-*\d+\.\.-*\d+/g);
        // console.log(instrs);
        // console.log(instruction);
        if (!instrs) throw new Error('No Coords');

        const coords = instrs.map((inst) => inst.split('..').map((value) => Number(value)));
        const start = new Vector3(...coords?.map((value) => value[0]));
        const end = new Vector3(...coords?.map((value) => value[1]));
        if (
            end.x < -50 ||
            end.y < -50 ||
            end.z < -50 ||
            start.x > 50 ||
            start.y > 50 ||
            start.z > 50
        ) {
            continue;
        }
        instructions.push({
            state,
            start: start.clamp(new Vector3(-50, -50, -50), new Vector3(50, 50, 50)),
            end: end.clamp(new Vector3(-50, -50, -50), new Vector3(50, 50, 50)),
        });
    }

    const grid: Point[][][] = [];

    for (let rowIndex = -50; rowIndex <= 50; rowIndex++) {
        const row: Point[][] = [];
        for (let colIndex = -50; colIndex <= 50; colIndex++) {
            const col: Point[] = [];
            for (let depthIndex = -50; depthIndex <= 50; depthIndex++) {
                col.push({
                    x: rowIndex,
                    y: colIndex,
                    z: depthIndex,
                    value: false,
                });
            }
            row.push(col);
        }
        grid.push(row);
    }

    const baseModdifier = 50;

    for (const instruction of instructions) {
        // let afflicted = 0;
        for (
            let rowIndex = instruction.start.x + baseModdifier;
            rowIndex <= instruction.end.x + baseModdifier;
            rowIndex++
        ) {
            for (
                let colIndex = instruction.start.y + baseModdifier;
                colIndex <= instruction.end.y + baseModdifier;
                colIndex++
            ) {
                for (
                    let depthIndex = instruction.start.z + baseModdifier;
                    depthIndex <= instruction.end.z + baseModdifier;
                    depthIndex++
                ) {
                    // assert(grid[rowIndex][colIndex][depthIndex].x >= instruction.start.x);
                    // if (grid[rowIndex][colIndex][depthIndex].value !== instruction.state) {
                    //     afflicted++;
                    // }
                    grid[rowIndex][colIndex][depthIndex].value = instruction.state;
                }
            }
        }
        // console.log(afflicted);
    }
    // console.log(instructions);

    return sumOn(grid);
};

const sumOn = (grid: Point[][][]) => {
    return grid.flat(3).reduce((total, current) => (current.value ? total + 1 : total), 0);
};

const part2 = () => {
    const input = getInput('2021', '22')
        .split('\n')
        .filter((line) => line !== '');

    const instructions: Instruction[] = [];
    for (const instruction of input) {
        const state = !!instruction.match('on');
        const instrs = instruction.match(/(?!=)-*\d+\.\.-*\d+/g);
        if (!instrs) throw new Error('No Coords');

        const coords = instrs.map((inst) => inst.split('..').map((value) => Number(value)));
        const start = new Vector3(...coords?.map((value) => value[0]));
        const end = new Vector3(...coords?.map((value) => value[1]));
        instructions.push({
            state,
            start,
            end,
        });
    }

    const turnedOn: Instruction[] = [];
    const turnedOff: Instruction[] = [];

    for (const instruction of instructions) {
        console.log('handle', instruction);
        if (instruction.state) {
            let overlapTrueCount = 0;
            let overlapFalseCount = 0;
            for (const allreadyOn of turnedOn) {
                const overlapping = overlaps(instruction, allreadyOn, false);
                // Overlapping double??
                if (overlapping && overlapping !== true) {
                    turnedOff.push(overlapping);
                }
            }

            turnedOn.push(instruction);
        } else {
            for (const allreadyOn of turnedOn) {
                const overlapping = overlaps(instruction, allreadyOn, false);
                // Overlapping double??
                if (overlapping && overlapping !== true) {
                    turnedOff.push(overlapping);
                    break;
                }
            }
        }
    }

    let totalOn = 0;
    for (const instruction of turnedOn) {
        totalOn += Math.abs(
            (instruction.end.x - instruction.start.x + 1) *
                (instruction.end.y - instruction.start.y + 1) *
                (instruction.end.z - instruction.start.z + 1),
        );
        console.log(
            instruction,
            (instruction.end.x - instruction.start.x + 1) *
                (instruction.end.y - instruction.start.y + 1) *
                (instruction.end.z - instruction.start.z + 1),
        );
    }

    console.log('off ---------------------');
    let totalOff = 0;
    for (const instruction of turnedOff) {
        totalOff += Math.abs(
            (instruction.end.x - instruction.start.x + 1) *
                (instruction.end.y - instruction.start.y + 1) *
                (instruction.end.z - instruction.start.z + 1),
        );
        console.log(
            instruction,
            (instruction.end.x - instruction.start.x + 1) *
                (instruction.end.y - instruction.start.y + 1) *
                (instruction.end.z - instruction.start.z + 1),
        );
    }

    console.log('on', totalOn);
    console.log('Off', totalOff);

    return totalOn - totalOff;
};

const overlaps = (a: Instruction, b: Instruction, state: boolean): Instruction | boolean => {
    if (smallerAThanB(b.start, a.start) && smallerAThanB(a.start, b.end)) {
        const start = a.start;
        const end = a.end.clone().clamp(b.start, b.end);
        return {
            state,
            start,
            end,
        };
    }
    if (smallerAThanB(b.start, a.end) && smallerAThanB(a.end, b.end)) {
        const start = a.start.clone().clamp(b.start, b.end);
        const end = a.end;
        return {
            state,
            start,
            end,
        };
    }

    return false;
};

const smallerAThanB = (a: Vector3, b: Vector3) => {
    return a.x <= b.x && a.y <= b.y && a.z <= b.z;
};

console.log(`Solution 1: ${part1()}`);
console.log(`Solution 2: ${part2()}`);
// 2324452019859526 to high

// 11560337735628468
// 9541398387991768
// 6958057801009488

// 2758514936282235
