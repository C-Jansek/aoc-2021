import getInput from '../../../utils/getInput';

type insertionPair = {
    pair: string;
    newPairs: string[];
    count: number;
    nextCount: number;
};

type countMap = {
    [key: string]: number;
};

class PolymerFormula {
    insertionRules: insertionPair[];
    template: string;

    constructor(input: string[]) {
        this.template = input[0];
        this.insertionRules = this.parseInput(input.slice(1));
    }

    private parseInput(input: string[]): insertionPair[] {
        return input
            .map((line) => line.split(' -> '))
            .map((insertion) => {
                return {
                    pair: insertion[0],
                    newPairs: [insertion[0][0] + insertion[1], insertion[1] + insertion[0][1]],
                    count: 0,
                    nextCount: 0,
                };
            });
    }

    calculateOptimal(steps: number): countMap {
        this.setInitialOccurences();

        for (let step = 0; step < steps; step++) {
            this.performStep();
        }

        return this.castToCountMap();
    }

    private castToCountMap(): countMap {
        const counts: { [key: string]: number } = {};
        for (const pair of this.insertionRules) {
            for (const char of pair.pair) {
                if (counts[char]) counts[char] += pair.count;
                else counts[char] = pair.count;
            }
        }

        // Every entry is doubly counted due to being in two pairs.
        for (const [id, count] of Object.entries(counts)) {
            counts[id] = Math.ceil(count / 2);
        }
        return counts;
    }

    private performStep(): void {
        for (const pair of this.insertionRules) {
            if (pair.count > 0) {
                for (const newPair of pair.newPairs) {
                    const p = this.insertionRules.find((p) => p.pair === newPair);
                    if (p) p.nextCount += pair.count;
                }
                pair.count = 0;
            }
        }

        // Reset
        for (const pair of this.insertionRules) {
            pair.count = pair.nextCount;
            pair.nextCount = 0;
        }
    }

    private setInitialOccurences(): void {
        for (let charIndex = 0; charIndex < this.template.length - 1; charIndex++) {
            for (const rule of this.insertionRules) {
                if (rule.pair === this.template[charIndex] + this.template[charIndex + 1]) {
                    rule.count++;
                }
            }
        }
    }
}

const part1 = () => {
    const input = getInput('2021', '14')
        .split('\n')
        .filter((line) => line !== '');

    const polymer = new PolymerFormula(input);
    const counts = polymer.calculateOptimal(10);

    const mostCommonCount = Math.max(...Object.values(counts));
    const leastCommonCount = Math.min(...Object.values(counts));

    return mostCommonCount - leastCommonCount;
};

const part2 = () => {
    const input = getInput('2021', '14')
        .split('\n')
        .filter((line) => line !== '');

    const polymer = new PolymerFormula(input);
    const counts = polymer.calculateOptimal(40);

    const mostCommonCount = Math.max(...Object.values(counts));
    const leastCommonCount = Math.min(...Object.values(counts));

    return mostCommonCount - leastCommonCount;
};

console.log(`Solution 1: ${part1()}`);
console.log(`Solution 2: ${part2()}`);
