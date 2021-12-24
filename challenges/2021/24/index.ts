import { unset } from 'lodash';
import getInput from '../../../utils/getInput';

type CommandInput = number | 'w' | 'x' | 'y' | 'z';

class ALU {
    variables: {
        [key: string]: number;
    };
    input: number[];

    constructor(input: number[]) {
        this.variables = {
            w: 0,
            x: 0,
            y: 0,
            z: 0,
        };
        this.input = input;
    }

    process(commands: string[]): { [key: string]: number } {
        for (const command of commands) {
            const [com, a, b] = command.split(' ');
            const inpA = getCommandInput(a);
            const inpB = getCommandInput(b);

            this.runCommand(com, inpA, inpB);
        }
        return this.variables;
    }

    runCommand(command: string, a: CommandInput | null, b: CommandInput | null) {
        if (a === null) throw new Error(`At least one argument expected`);

        if (command === 'inp') {
            console.log(this.variables['z']);
            this.inp(a);
        } else if (b === null) throw new Error(`Two arguments expected to function ${command}!`);
        else if (command === 'add') this.add(a, b);
        else if (command === 'mul') this.mul(a, b);
        else if (command === 'div') this.div(a, b);
        else if (command === 'mod') this.mod(a, b);
        else if (command === 'eql') this.eql(a, b);
    }

    // inp a - Read an input value and write it to variable a.
    inp(a: CommandInput): void {
        const input = this.input.shift();
        if (!input) throw new Error('Not enough input provided!');

        this.variables[a] = input;
    }

    // add a b - Add the value of a to the value of b, then store the result in variable a.
    add(a: CommandInput, b: CommandInput): void {
        if (typeof b === 'string') {
            this.variables[a] = this.variables[a] + this.variables[b];
            return;
        }
        this.variables[a] = this.variables[a] + b;
    }

    // mul a b - Multiply the value of a by the value of b, then store the result in variable a.
    mul(a: CommandInput, b: CommandInput): void {
        if (typeof b === 'string') {
            this.variables[a] = this.variables[a] * this.variables[b];
            return;
        }
        this.variables[a] = this.variables[a] * b;
    }

    // div a b - Divide the value of a by the value of b, truncate the result to an integer, then store the result in variable a. (Here, "truncate" means to round the value toward zero.)
    div(a: CommandInput, b: CommandInput): void {
        if (typeof b === 'string') {
            this.variables[a] = Math.trunc(this.variables[a] / this.variables[b]);
            return;
        }
        this.variables[a] = Math.trunc(this.variables[a] / b);
    }

    // mod a b - Divide the value of a by the value of b, then store the remainder in variable a. (This is also called the modulo operation.)
    mod(a: CommandInput, b: CommandInput): void {
        if (typeof b === 'string') {
            this.variables[a] = this.variables[a] % this.variables[b];
            return;
        }
        this.variables[a] = this.variables[a] % b;
    }

    // eql a b - If the value of a and b are equal, then store the value 1 in variable a. Otherwise, store the value 0 in variable a.
    eql(a: CommandInput, b: CommandInput): void {
        if (typeof b === 'string') {
            this.variables[a] = this.variables[a] === this.variables[b] ? 1 : 0;
            return;
        }
        this.variables[a] = this.variables[a] === b ? 1 : 0;
    }
}

const getCommandInput = (a: any): CommandInput | null => {
    if (a === null) return null;
    if (a === 'w' || a === 'x' || a === 'y' || a === 'z') {
        return a;
    }
    return Number(a);
};

const calculateNextZ = (w: number, previousZ: number, d: number, a: number, b: number): number => {
    let x = (previousZ % 26) + a;
    x = x === w ? 0 : 1;

    let z = Math.trunc(previousZ / d);
    z = z * (25 * x + 1) + (w + b) * x;
    return z;
};

const part1 = () => {
    const input = getInput('2021', '24')
        .split('\n')
        .filter((line) => line !== '');

    // inp w
    // mul x 0
    // add x z
    // mod x 26
    // div z 1
    // add x 12
    // eql x w
    // eql x 0
    // mul y 0
    // add y 25
    // mul y x
    // add y 1
    // mul z y
    // mul y 0
    // add y w
    // add y 4
    // mul y x
    // add z y

    const variables: { [key: number]: { [key: string]: number } } = {};

    for (let digitIndex = 0; digitIndex < 14; digitIndex++) {
        variables[digitIndex] = {};
        variables[digitIndex]['D'] = Number(input[digitIndex * 18 + 4].split(' ')[2]);
        variables[digitIndex]['A'] = Number(input[digitIndex * 18 + 5].split(' ')[2]);
        variables[digitIndex]['B'] = Number(input[digitIndex * 18 + 15].split(' ')[2]);
    }

    console.log(variables);
    const modelNo = 99_818_949_911_191;

    const modelNoDigits = modelNo
        .toString()
        .split('')
        .map((digit, index) => {
            return {
                digit: Number(digit),
                index,
            };
        });

    let states: { [key: string]: GameState } = {
        '0|0': {
            z: 0,
            currentDigit: 0,
            digits: [],
        },
    };

    let weShouldContinue = true;
    while (weShouldContinue) {
        const currentStates: { [key: string]: GameState } = {};
        for (const state of Object.values(states)) {
            const digit = modelNoDigits[state.currentDigit];

            for (let nextDigit = 1; nextDigit <= 9; nextDigit++) {
                let z = state.z;
                z = calculateNextZ(
                    nextDigit,
                    z,
                    variables[digit['index']]['D'],
                    variables[digit['index']]['A'],
                    variables[digit['index']]['B'],
                );

                const newState = {
                    z,
                    currentDigit: digit.index + 1,
                    digits: [...state.digits, nextDigit],
                };
                const stringifiedState = stringifyState(newState);

                if (currentStates[stringifiedState]) {
                    if (
                        Number(newState.digits.join('')) >
                        Number(currentStates[stringifiedState].digits.join(''))
                    ) {
                        currentStates[stringifiedState] = newState;
                    }
                } else {
                    currentStates[stringifiedState] = newState;
                }
                // console.log(z);
            }
        }
        states = currentStates;
        if (Object.values(states)[0].currentDigit === 14) weShouldContinue = false;
        console.log(Object.values(states)[0].currentDigit);
        // console.log(Object.values(states).map((state) => stringifyState(state)));

        for (const stringifiedGameState in states) {
            if (Object.prototype.hasOwnProperty.call(states, stringifiedGameState)) {
                const gameState = states[stringifiedGameState];
                if (gameState.z > 1000000) {
                    unset(states, stringifiedGameState);
                }
            }
        }
        // console.log();
        // console.log(states);
    }

    const zeroDigits = Object.values(states).filter((state) => state.z === 0);
    console.log(zeroDigits[0].digits.join(''));

    console.log(zeroDigits);

    const alu = new ALU(zeroDigits[0].digits);

    alu.process(input);

    console.log(alu.variables['z']);

    return zeroDigits[0].digits.join('');
};

type GameState = {
    z: number;
    currentDigit: number;
    digits: number[];
};

const stringifyState = (gameState: GameState) => {
    return `${gameState.currentDigit}|${gameState.z}`;
};

const part2 = () => {
    const input = getInput('2021', '24').split('\n');

    return;
};

console.log(`Solution 1: ${part1()}`);
console.log(`Solution 2: ${part2()}`);
