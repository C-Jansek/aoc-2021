import { Vector2 } from 'three';
import getInput from '../../../utils/getInput';

type Room = 'A' | 'B' | 'C' | 'D' | null;

class Amphipod {
    id: string;
    type: 'A' | 'B' | 'C' | 'D';
    moveCost: number;
    position: Tile;
    movedOut: boolean;
    finished: boolean;

    constructor(id: string, type: 'A' | 'B' | 'C' | 'D', position: Tile) {
        this.id = id;
        this.type = type;
        this.moveCost = 10 ** ['A', 'B', 'C', 'D'].indexOf(type);
        this.position = position;
        this.movedOut = false;
        this.finished = false;
    }

    moveOut(tile: Tile) {
        this.position = tile;
        this.movedOut = true;
    }
}

class House {
    tiles: Tile[];
    amphipods: Amphipod[];

    constructor(amphipods: Amphipod[], tiles: Tile[]) {
        this.tiles = tiles;
        this.amphipods = amphipods;
    }

    solve() {}
}

class Tile {
    position: Vector2;
    links: Tile[];
    room: Room;
    occupied: boolean;

    constructor(position: Vector2, room: Room = null) {
        this.position = position;
        this.links = [];
        this.room = room;
        this.occupied = !!room;
    }

    addLink(tile: Tile): void {
        this.links.push(tile);
    }
}

const getNeighbours = (tile: Tile, tiles: Tile[]): Tile[] => {
    const neighbours: Tile[] = [];
    for (const candidate of tiles) {
        if (candidate.position.manhattanDistanceTo(tile.position) === 1) {
            neighbours.push(candidate);
        }
    }
    return neighbours;
};

const getRoom = (row: number, col: number): Room => {
    if (row !== 2 && row !== 3) return null;

    if (col === 3) return 'A';
    if (col === 5) return 'B';
    if (col === 7) return 'C';
    if (col === 9) return 'D';
    return null;
};

const parseTiles = (input: string[]): Tile[] => {
    const tiles: Tile[] = [];
    for (const [lineIndex, line] of input.entries()) {
        for (const [spaceIndex, space] of line.split('').entries()) {
            if (['A', 'B', 'C', 'D', '.'].includes(space)) {
                const room =
                    space === 'A' || space === 'B' || space === 'C' || space == 'D'
                        ? getRoom(lineIndex, spaceIndex)
                        : null;

                const tile = new Tile(new Vector2(spaceIndex, lineIndex), room);
                tiles.push(tile);
            }
        }
    }

    for (const tile of tiles) {
        for (const neighbour of getNeighbours(tile, tiles)) {
            tile.addLink(neighbour);
        }
    }

    return tiles;
};

const parseAmphipods = (input: string[], tiles: Tile[]): Amphipod[] => {
    const amphipods: Amphipod[] = [];
    const typeCounts = {
        A: 0,
        B: 0,
        C: 0,
        D: 0,
    };
    for (const [lineIndex, line] of input.entries()) {
        for (const [spaceIndex, space] of line.split('').entries()) {
            if (space === 'A' || space === 'B' || space === 'C' || space == 'D') {
                const tile = tiles.find((tile) =>
                    tile.position.equals(new Vector2(spaceIndex, lineIndex)),
                );
                if (!tile) throw new Error('No tile found for amphipods');

                typeCounts[space]++;
                const id = `${space}${typeCounts[space]}`;

                const amphipod = new Amphipod(id, space, tile);
                amphipods.push(amphipod);
            }
        }
    }

    for (const type of ['A', 'B', 'C', 'D']) {
        const typeAmphipods = amphipods.filter((amphipod) => amphipod.type === type);
        if (typeAmphipods.every((amphipod) => amphipod.position.room === amphipod.type)) {
            for (const amphipod of typeAmphipods) {
                amphipod.finished = true;
            }
        } else {
            for (const amphipod of typeAmphipods) {
                if (
                    amphipod.type === amphipod.position.room &&
                    amphipod.position.position.y === 3
                ) {
                    amphipod.finished = true;
                }
            }
        }
    }

    return amphipods;
};

const part1 = () => {
    const input = getInput('2021', '23').split('\n');

    const tiles = parseTiles(input);

    const amphipods = parseAmphipods(input, tiles);

    const house = new House(amphipods, tiles);

    console.log(amphipods);

    return house.solve();
};

const part2 = () => {
    const input = getInput('2021', '23')
        .split('\n')
        .filter((line) => line !== '');

    const lastLine = input.pop();
    if (!lastLine) throw new Error('No lastLine');

    input.push('#D#C#B#A#', '#D#B#A#C#', lastLine);

    const tiles = parseTiles(input);

    const amphipods = parseAmphipods(input, tiles);

    const house = new House(amphipods, tiles);

    return house.solve();
};

console.log(`Solution 1: ${part1()}`);
console.log(`Solution 2: ${part2()}`);
