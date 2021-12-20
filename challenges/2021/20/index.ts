import getInput from '../../../utils/getInput';

type Pixel = '#' | '.';

class Image {
    grid: Pixel[][];
    imageEnhancement: Pixel[];

    constructor(input: string[]) {
        this.grid = this.parseImage(input[1]);
        this.imageEnhancement = input[0].split('').map((value) => (value === '#' ? '#' : '.'));
    }

    parseImage(input: string): Pixel[][] {
        return input
            .split('\n')
            .filter((line) => line !== '')
            .map((row) =>
                row.split('').map((pixel) => {
                    if (pixel !== '#' && pixel != '.') throw new Error('Not a pixel');
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
                        .map((pixel) => (pixel === '#' ? 1 : 0))
                        .join(''),
                    2,
                );
                const enhancedPixel = this.imageEnhancement[enhanceIndex];
                // if (row === 2 - 1 && col === 4 - 1) {
                //     console.log(
                //         'Middle:',
                //         this.getNeighbours(row, col).flat(1),
                //         this.getNeighbours(row, col)
                //             .flat(1)
                //             .map((pixel) => (pixel === '#' ? 1 : 0))
                //             .join(''),
                //         enhanceIndex,
                //         enhancedPixel,
                //     );
                // }
                // console.log(this.imageEnhancement.slice(enhanceIndex - 2, enhanceIndex + 3));
                // if (this.imageEnhancement.slice(enhanceIndex - 2, enhanceIndex + 3).length == 0) {
                //     console.log(row, col, enhanceIndex, enhancedPixel);
                // }
                newRow.push(enhancedPixel);
            }
            newImage.push(newRow);
        }

        this.grid = newImage;
        return newImage;
    }

    get(row: number, col: number): Pixel {
        if (0 <= row && row < this.grid.length && 0 <= col && col < this.grid[0].length) {
            return this.grid[row][col];
        }
        return '.';
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
    // image.printImage();
    console.log('\n---------------');
    image.enhance();

    image.printImage();

    return image.countLightPixels();
};

const part2 = () => {
    const input = getInput('2021', '20').split('\n');

    return;
};

console.log(`Solution 1: ${part1()}`);
// 5705 wrong

console.log(`Solution 2: ${part2()}`);
