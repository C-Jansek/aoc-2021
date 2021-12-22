import { assert } from 'console';
import { inRange, intersection } from 'lodash';
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

const part1 = () => {};

const part2 = () => {
    const input = getInput('2021', '22')
        .split('\n')
        .filter((line) => line !== '');

    const instructions: InstructionId[] = [];
    let id = 0;

    const xValues = new Set<number>();
    const yValues = new Set<number>();
    const zValues = new Set<number>();

    for (const instruction of input) {
        const state = !!instruction.match('on');
        const instrs = instruction.match(/(?!=)-*\d+\.\.-*\d+/g);
        if (!instrs) throw new Error('No Coords');

        const coords = instrs.map((inst) => inst.split('..').map((value) => Number(value)));

        xValues.add(coords[0][0]);
        xValues.add(coords[0][1] + 1);

        yValues.add(coords[1][0]);
        yValues.add(coords[1][1] + 1);

        zValues.add(coords[2][0]);
        zValues.add(coords[2][1] + 1);

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

    const xValuesSorted = [...xValues].sort((a, b) => a - b);
    const yValuesSorted = [...yValues].sort((a, b) => a - b);
    const zValuesSorted = [...zValues].sort((a, b) => a - b);

    let totalOn = 0;

    let almostDone = 0;
    for (let xIndex = 0; xIndex < xValues.size - 1; xIndex++) {
        console.log(almostDone++, xValues.size);
        for (let yIndex = 0; yIndex < yValues.size - 1; yIndex++) {
            for (let zIndex = 0; zIndex < zValues.size - 1; zIndex++) {
                const start = new Vector3(
                    xValuesSorted[xIndex] - 0.5,
                    yValuesSorted[yIndex] - 0.5,
                    zValuesSorted[zIndex] - 0.5,
                );
                const end = new Vector3(
                    xValuesSorted[xIndex + 1] - 0.5,
                    yValuesSorted[yIndex + 1] - 0.5,
                    zValuesSorted[zIndex + 1] - 0.5,
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

    console.log(xValuesSorted);
    console.log(yValuesSorted);
    console.log(zValuesSorted);
    return totalOn;
};

const spaceSize = (a: Vector3, b: Vector3) => {
    return Math.abs((b.x - a.x) * (b.y - a.y) * (b.z - a.z));
};
console.log(`Solution 1: ${part1()}`);
console.log(`Solution 2: ${part2()}`);
// 2324452019859526 to high

// 11560337735628468
// 9541398387991768
// 6958057801009488

// 2758514936282235
