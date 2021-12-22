import { assert } from 'console';
import { inRange } from 'lodash';
import { Box3, InstancedInterleavedBuffer, Vector3 } from 'three';
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
type InstructionId = {
    state: boolean;
    box: Box3;
    id: number;
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

    const instructions: InstructionId[] = [];
    let id = 0;
    for (const instruction of input) {
        const state = !!instruction.match('on');
        const instrs = instruction.match(/(?!=)-*\d+\.\.-*\d+/g);
        if (!instrs) throw new Error('No Coords');

        const coords = instrs.map((inst) => inst.split('..').map((value) => Number(value)));
        const start = new Vector3(...coords?.map((value) => value[0]));
        const end = new Vector3(...coords?.map((value) => value[1] + 1));
        const box = new Box3(start, end);
        instructions.push({
            id,
            state,
            box,
        });
        id++;
    }

    let turnedOn: InstructionId[] = [];

    let instructionIndex = 0;
    for (const instruction of instructions) {
        console.log(instructionIndex, turnedOn.length);
        if (instruction.state) {
            let nonOverlapping = [instruction];
            for (const isOn of turnedOn) {
                nonOverlapping = checkOverlapping(isOn, nonOverlapping, true);
                if (nonOverlapping.length === 0) break;
            }
            if (nonOverlapping.length > 0) turnedOn.unshift(...nonOverlapping);
        } else {
            turnedOn = checkOverlapping(instruction, turnedOn, true);
        }
        instructionIndex++;
    }

    let totalOn = 0;
    for (const instruction of turnedOn) {
        totalOn += spaceSize(instruction.box.min, instruction.box.max);
    }

    console.log(turnedOn);
    return totalOn;
    // for (const instruction of instructions) {
    //     // console.log('handle', instruction);
    //     if (instruction.state) {
    //         for (const allreadyOn of turnedOn) {
    //             const overlapping = overlaps(instruction, allreadyOn, false);
    //             // Overlapping double??
    //             if (overlapping && overlapping !== true) {
    //                 // const overlapTrueCount = turnedOn
    //                 //     .map((inst) => !!overlaps(inst, overlapping, false))
    //                 //     .reduce((total, current) => (current ? total + 1 : total), 0);
    //                 // const overlapFalseCount = turnedOff
    //                 //     .map((inst) => !!overlaps(inst, overlapping, false))
    //                 //     .reduce((total, current) => (current ? total + 1 : total), 0);

    //                 // if (overlapTrueCount > overlapFalseCount) {
    //                 turnedOff.push(overlapping);
    //                 // }
    //             }
    //         }

    //         turnedOn.push(instruction);
    //     } else {
    //         for (const allreadyOn of turnedOn) {
    //             const overlapping = overlaps(instruction, allreadyOn, false);
    //             // Overlapping double??
    //             if (overlapping && overlapping !== true) {
    //                 turnedOff.push(overlapping);
    //                 break;
    //             }
    //         }
    //     }
    // }

    // let totalOn = 0;
    // for (const instruction of turnedOn) {
    //     totalOn += Math.abs(
    //         (instruction.end.x - instruction.start.x + 1) *
    //             (instruction.end.y - instruction.start.y + 1) *
    //             (instruction.end.z - instruction.start.z + 1),
    //     );
    //     // console.log(
    //     //     instruction,
    //     //     (instruction.end.x - instruction.start.x + 1) *
    //     //         (instruction.end.y - instruction.start.y + 1) *
    //     //         (instruction.end.z - instruction.start.z + 1),
    //     // );
    // }

    // // console.log('off ---------------------');
    // let totalOff = 0;
    // for (const instruction of turnedOff) {
    //     totalOff += Math.abs(
    //         (instruction.end.x - instruction.start.x + 1) *
    //             (instruction.end.y - instruction.start.y + 1) *
    //             (instruction.end.z - instruction.start.z + 1),
    //     );
    //     // console.log(
    //     //     instruction,
    //     //     (instruction.end.x - instruction.start.x + 1) *
    //     //         (instruction.end.y - instruction.start.y + 1) *
    //     //         (instruction.end.z - instruction.start.z + 1),
    //     // );
    // }

    // console.log('on', totalOn);
    // console.log('Off', totalOff);

    // return totalOn - totalOff;
};

const spaceSize = (a: Vector3, b: Vector3) => {
    return Math.abs((b.x - a.x) * (b.y - a.y) * (b.z - a.z));
};

const checkOverlapping = (
    allreadyOn: InstructionId,
    turnsOn: InstructionId[],
    state: boolean,
): InstructionId[] => {
    // console.log('allreadyOn', allreadyOn.box);
    // console.log(
    //     'turnsOn',
    //     turnsOn.map((inst) => inst.box),
    // );
    const nonOverlapping: InstructionId[] = [];

    let toIndex = 0;
    console.log({ toIndex }, turnsOn.length);
    for (const turnOn of turnsOn) {
        // if (toIndex % 10000 === 0) console.log({ toIndex });
        if (!turnOn.box.intersectsBox(allreadyOn.box)) {
            nonOverlapping.push(turnOn);
            continue;
        }

        const intersection = turnOn.box.clone().intersect(allreadyOn.box);

        const xValues = new Set<number>();
        const yValues = new Set<number>();
        const zValues = new Set<number>();

        xValues.add(turnOn.box.min.x);
        xValues.add(turnOn.box.max.x);
        xValues.add(intersection.min.x);
        xValues.add(intersection.max.x);

        yValues.add(turnOn.box.min.y);
        yValues.add(turnOn.box.max.y);
        yValues.add(intersection.min.y);
        yValues.add(intersection.max.y);

        zValues.add(turnOn.box.min.z);
        zValues.add(turnOn.box.max.z);
        zValues.add(intersection.min.z);
        zValues.add(intersection.max.z);

        const xValuesSorted = [...xValues].sort();
        const yValuesSorted = [...yValues].sort();
        const zValuesSorted = [...zValues].sort();

        for (let xIndex = 0; xIndex < xValues.size - 1; xIndex++) {
            for (let yIndex = 0; yIndex < yValues.size - 1; yIndex++) {
                for (let zIndex = 0; zIndex < zValues.size - 1; zIndex++) {
                    const start = new Vector3(
                        xValuesSorted[xIndex],
                        yValuesSorted[yIndex],
                        zValuesSorted[zIndex],
                    );
                    const end = new Vector3(
                        xValuesSorted[xIndex + 1],
                        yValuesSorted[yIndex + 1],
                        zValuesSorted[zIndex + 1],
                    );
                    const box = new Box3(start, end);
                    if (
                        (!box.min.equals(intersection.min) || !box.max.equals(intersection.max)) &&
                        box.intersectsBox(turnOn.box)
                    ) {
                        nonOverlapping.push({
                            id: turnOn.id,
                            state,
                            box,
                        });
                    }
                }
            }
        }
        toIndex++;
    }
    // console.log(nonOverlapping.map((no) => no.box));
    return nonOverlapping;
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
