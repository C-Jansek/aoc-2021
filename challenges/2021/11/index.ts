import getInput from '../../../utils/getInput';

type Octopuss = {
    row: number;
    col: number;
    energyLevel: number;
    flashed: boolean;
};

class Cavern {
    octopusses: Octopuss[][];
    step: number;

    constructor(input: string[]) {
        this.octopusses = this._parseInput(input);
        this.step = 0;
    }

    _parseInput(input: string[]): Octopuss[][] {
        return input.map((row, rowIndex) => {
            return row.split('').map((col, colIndex) => {
                return {
                    row: rowIndex,
                    col: colIndex,
                    energyLevel: Number(col),
                    flashed: false,
                };
            });
        });
    }

    doStep() {
        // Increase by One
        for (const octopuss of this.octopusses.flat(2)) {
            octopuss.energyLevel += 1;
            octopuss.flashed = false;
        }

        // Flash
        while (this.toFlash().length > 0) {
            for (const octopuss of this.toFlash()) {
                this.flash(octopuss);
            }
        }

        // Reset
        for (const octopuss of this.octopusses.flat(2)) {
            if (octopuss.flashed) {
                octopuss.energyLevel = 0;
            }
        }

        this.step++;
    }

    toFlash() {
        return this.octopusses
            .flat(2)
            .filter((octopuss) => octopuss.energyLevel > 9 && !octopuss.flashed);
    }

    findNeighbours(octopuss: Octopuss): Octopuss[] {
        const neighbours: Octopuss[] = [];
        for (let row = -1; row <= 1; row++) {
            for (let col = -1; col <= 1; col++) {
                neighbours.push(this.get(octopuss.row - row, octopuss.col - col));
            }
        }
        return neighbours;
    }

    get(row: number, col: number): Octopuss {
        if (
            0 <= row &&
            row < this.octopusses.length &&
            0 <= col &&
            col < this.octopusses[row].length
        ) {
            return this.octopusses[row][col];
        }
        return {
            col: col,
            row: row,
            energyLevel: Number.NEGATIVE_INFINITY,
            flashed: false,
        };
    }

    flash(octopuss: Octopuss): void {
        octopuss.flashed = true;
        for (const neighbour of this.findNeighbours(octopuss)) {
            neighbour.energyLevel += 1;
        }
    }

    countFlashed(): number {
        return this.octopusses
            .flat(2)
            .reduce((total, octopuss) => (octopuss.flashed ? total + 1 : total), 0);
    }

    allFlashed(): boolean {
        return this.octopusses.flat(2).length === this.countFlashed();
    }
}

const part1 = () => {
    const input = getInput('2021', '11')
        .split('\n')
        .filter((row) => row != '');

    const cavern = new Cavern(input);

    let flashes = 0;
    while (cavern.step < 100) {
        cavern.doStep();
        flashes += cavern.countFlashed();
    }

    return flashes;
};

const part2 = () => {
    const input = getInput('2021', '11')
        .split('\n')
        .filter((row) => row != '');

    const cavern = new Cavern(input);

    while (!cavern.allFlashed()) {
        cavern.doStep();
    }
    return cavern.step;
};

console.log(`Solution 1: ${part1()}`);
console.log(`Solution 2: ${part2()}`);
