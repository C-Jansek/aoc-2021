import { assert } from 'console';
import { inRange, intersection } from 'lodash';
import { Box3, InstancedInterleavedBuffer, Plane, Vector3 } from 'three';
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

const part1 = () => {};

const parseInstructions = (input: string[]) => {
    let id = 0;
    const instructions: InstructionId[] = [];

    let yMin;
    let yMax;
    let zMin;
    let zMax;

    for (const instruction of input) {
        const state = !!instruction.match('on');
        const instrs = instruction.match(/(?!=)-*\d+\.\.-*\d+/g);
        if (!instrs) throw new Error('No Coords');

        const coords = instrs.map((inst) => inst.split('..').map((value) => Number(value)));

        const start = new Vector3(...coords?.map((value) => value[0]));
        const end = new Vector3(...coords?.map((value) => value[1]));
        const box = new Box3(start, end);
        instructions.unshift({
            id,
            state,
            box,
        });
        id++;
    }
    return instructions;
};

const getAxisValues = (instructions: InstructionId[], axis: 'x' | 'y' | 'z'): number[] => {
    const values = new Set<number>();
    for (const instruction of instructions) {
        values.add(instruction.box.min[axis]);
        values.add(instruction.box.max[axis] + 1);
    }
    return [...values].sort((a, b) => a - b);
};

const part2 = () => {
    const input = getInput('2021', '22')
        .split('\n')
        .filter((line) => line !== '');

    // Initialize
    const instructions: InstructionId[] = parseInstructions(input);
    const xValues = getAxisValues(instructions, 'x');

    const yMin = Math.min(...instructions.map((instr) => instr.box.min.y));
    const yMax = Math.max(...instructions.map((instr) => instr.box.max.y));

    const zMin = Math.min(...instructions.map((instr) => instr.box.min.z));
    const zMax = Math.max(...instructions.map((instr) => instr.box.max.z));

    let totalOn = 0;

    // Check this plane of the box
    for (let xIndex = 0; xIndex < xValues.length - 1; xIndex++) {
        const rowBox = new Box3(
            new Vector3(xValues[xIndex] - 0.5, yMin, zMin),
            new Vector3(xValues[xIndex + 1] - 0.5, yMax, zMax),
        );
        const instructionsX = instructions.filter((instruction) =>
            instruction.box.intersectsBox(rowBox),
        );
        const yValues = getAxisValues(instructionsX, 'y');

        // Check the lines on this plane
        for (let yIndex = 0; yIndex < yValues.length - 1; yIndex++) {
            const colBox = new Box3(
                new Vector3(xValues[xIndex] - 0.5, yValues[yIndex] - 0.5, zMin),
                new Vector3(xValues[xIndex + 1] - 0.5, yValues[yIndex + 1] - 0.5, zMax),
            );

            const instructionsY = instructions.filter((instruction) =>
                instruction.box.intersectsBox(colBox),
            );
            const zValues = getAxisValues(instructionsY, 'z');

            // Check the blocks on this line
            for (let zIndex = 0; zIndex < zValues.length - 1; zIndex++) {
                const start = new Vector3(
                    xValues[xIndex] - 0.5,
                    yValues[yIndex] - 0.5,
                    zValues[zIndex] - 0.5,
                );
                const end = new Vector3(
                    xValues[xIndex + 1] - 0.5,
                    yValues[yIndex + 1] - 0.5,
                    zValues[zIndex + 1] - 0.5,
                );
                const box = new Box3(start, end);

                for (const instruction of instructions) {
                    if (instruction.box.intersectsBox(box)) {
                        if (instruction.state) {
                            totalOn += spaceSize(box.min, box.max);
                        }
                        break;
                    }
                }
            }
        }
    }

    return totalOn;
};

const spaceSize = (a: Vector3, b: Vector3) => {
    return Math.abs((b.x - a.x) * (b.y - a.y) * (b.z - a.z));
};

console.log(`Solution 1: ${part1()}`);
console.log(`Solution 2: ${part2()}`);
