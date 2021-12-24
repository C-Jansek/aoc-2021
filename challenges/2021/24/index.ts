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

        if (command === 'inp') this.inp(a);
        else if (b === null) throw new Error(`Two arguments expected to function ${command}!`);
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

const generateModelNos = (length: number): number[][] => {
    if (length === 1) return [[1], [2], [3], [4], [5], [6], [7], [8], [9]];

    const totalModelNos: number[][] = [];
    for (let index = 1; index <= 9; index++) {
        totalModelNos.push(
            ...generateModelNos(length - 1).map((modelNo: number[]) => [...modelNo, index]),
        );
    }
    return totalModelNos;
};

const part1 = () => {
    const input = getInput('2021', '24')
        .split('\n')
        .filter((line) => line !== '');

    // const modelNos = generateModelNos(14);

    let highestModelNo = 0;
    for (let modelNo = 11_111_111_111_111; modelNo < 100_000_000_000_000; modelNo++) {
        if (
            modelNo
                .toString()
                .split('')
                .map((digit) => Number(digit))
                .includes(0)
        ) {
            continue;
        }

        if (modelNo % 10000 === 1111) console.log(modelNo);
        const alu = new ALU(
            modelNo
                .toString()
                .split('')
                .map((digit) => Number(digit)),
        );
        const variables = alu.process(input);
        if (variables['z'] === 0 && highestModelNo < modelNo) {
            highestModelNo = modelNo;
            console.log({ highestModelNo });
        }
    }

    return highestModelNo;
};

const part2 = () => {
    const input = getInput('2021', '24').split('\n');

    return;
};

console.log(`Solution 1: ${part1()}`);
console.log(`Solution 2: ${part2()}`);
