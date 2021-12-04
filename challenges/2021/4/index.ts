import getInput from '../../../utils/getInput';

type parsedInput = {
    drawString: number[];
    boards: Board[];
};

class Board {
    numbers: number[][];
    drawn: boolean[][];

    constructor(input: number[][]) {
        this.numbers = input;
        this.drawn = input.map((row) => row.map(() => false));
    }

    hasWon(): boolean {
        for (let index = 0; index < this.drawn.length; index++) {
            // Check horizontal all drawn
            if (this.drawn[index].reduce((a, b) => bothTrue(a, b), true)) {
                return true;
            }

            // Check vertical all drawn
            if (this.drawn.map((row) => row[index]).reduce((a, b) => bothTrue(a, b), true)) {
                return true;
            }
        }
        return false;
    }

    drawNumber(number: number): void {
        for (let row = 0; row < this.numbers.length; row++) {
            for (let col = 0; col < this.numbers[row].length; col++) {
                if (this.numbers[row][col] === number) {
                    this.drawn[row][col] = true;
                    break;
                }
            }
        }
    }

    remainingUnmarked(): number {
        let totalUnmarked = 0;

        for (let row = 0; row < this.numbers.length; row++) {
            for (let col = 0; col < this.numbers[row].length; col++) {
                if (this.drawn[row][col] === false) {
                    totalUnmarked += this.numbers[row][col];
                }
            }
        }
        return totalUnmarked;
    }
}

const bothTrue = (a: boolean, b: boolean) => a && b;

/**
 * Parse the boards from `input` to Board objects
 * @param {string[]} input boards in strings, separated by newlines
 * @return {parsedInput}
 */
function parseInput(input: string[]): parsedInput {
    const drawString = input[0].split(',').map((string) => Number(string));
    const boards: Board[] = [];
    let board: number[][] = [];
    for (const line of input.slice(2)) {
        if (line === '') continue;

        const row = line
            .split(' ')
            .filter((number) => number !== '')
            .map((number) => Number(number));

        board.push(row);

        if (board.length === 5) {
            boards.push(new Board(board));
            board = [];
        }
    }
    return { boards, drawString };
}

const part1 = () => {
    const input = getInput('2021', '4').split('\n');

    const { drawString, boards } = parseInput(input);

    for (const drawNumber of drawString) {
        for (const board of boards) {
            board.drawNumber(drawNumber);
            if (board.hasWon()) {
                return drawNumber * board.remainingUnmarked();
            }
        }
    }

    throw new Error('Nobody won');
};

const part2 = () => {
    const input = getInput('2021', '4').split('\n');

    let { drawString, boards } = parseInput(input);

    for (const drawNumber of drawString) {
        boards = boards.filter((board) => !board.hasWon());
        for (const board of boards) {
            board.drawNumber(drawNumber);
            if (board.hasWon() && boards.length === 1) {
                return drawNumber * board.remainingUnmarked();
            }
        }
    }

    throw new Error('Nobody won');
};

console.log(`Solution 1: ${part1()}`);
console.log(`Solution 2: ${part2()}`);
