import getInput from '../../../utils/getInput';

type Pixel = '#' | '.';

class Image {
    grid: Pixel[][];
    imageEnhancement: Pixel[];
    state: number;

    constructor(input: string[]) {
        this.grid = this.parseImage(input[1]);
        this.imageEnhancement = input[0].split('').map((value) => (value === '#' ? '#' : '.'));
        this.state = 0;
    }

    parseImage(input: string): Pixel[][] {
        return input
            .split('\n')
            .filter((line) => line !== '')
            .map((row) =>
                row.split('').map((pixel) => {
                    return pixel === '#' ? '#' : '.';
                }),
            );
    }

    enhance() {
        const newImage: Pixel[][] = [];

        for (let row = -1; row <= this.grid.length; row++) {
            const newRow: Pixel[] = [];
            for (let col = -1; col <= this.grid[0].length; col++) {
                const enhanceIndex = Number.parseInt(
                    this.getNeighbours(row, col)
                        .flat(1)
                        .map((p) => (p === '#' ? 1 : 0))
                        .join(''),
                    2,
                );
                const enhancedPixel = this.imageEnhancement[enhanceIndex];
                newRow.push(enhancedPixel);
            }
            newImage.push(newRow);
        }

        this.grid = newImage;
        this.state++;
        return newImage;
    }

    get(row: number, col: number): Pixel {
        if (0 <= row && row < this.grid.length && 0 <= col && col < this.grid[0].length) {
            return this.grid[row][col];
        }
        return this.state % 2 === 0 ? '.' : '#';
    }

    getNeighbours(rowIndex: number, colIndex: number): Pixel[] {
        const neighbours: Pixel[] = [];
        for (let row = rowIndex - 1; row <= rowIndex + 1; row++) {
            for (let col = colIndex - 1; col <= colIndex + 1; col++) {
                neighbours.push(this.get(row, col));
            }
        }
        return neighbours;
    }

    printImage(): void {
        console.log(this.grid.map((row) => row.join('')).join('\n'));
    }

    countLightPixels(): number {
        return this.grid.flat(1).filter((pixel) => pixel === '#').length;
    }
}

const part1 = () => {
    const input = getInput('2021', '20').split('\n\n');

    const image = new Image(input);

    image.enhance();
    image.enhance();

    return image.countLightPixels();
};

const part2 = () => {
    const input = getInput('2021', '20').split('\n\n');

    const image = new Image(input);

    for (let n = 0; n < 50; n++) {
        image.enhance();
    }

    return image.countLightPixels();
};

console.log(`Solution 1: ${part1()}`);
console.log(`Solution 2: ${part2()}`);
