import { Plane, Vector2 } from 'three';
import getInput from '../../../utils/getInput';

type Room = 'A' | 'B' | 'C' | 'D' | null;

class Amphipod {
    id: number;
    type: 'A' | 'B' | 'C' | 'D';
    moveEnergy: number;
    position: Tile;

    constructor(id: number, type: 'A' | 'B' | 'C' | 'D', position: Tile) {
        this.id = id;
        this.type = type;
        this.moveEnergy = 10 ** ['A', 'B', 'C', 'D'].indexOf(type);
        this.position = position;
    }
}

class House {
    tiles: Tile[];
    amphipods: Amphipod[];

    constructor(amphipods: Amphipod[], tiles: Tile[]) {
        this.tiles = tiles;
        this.amphipods = amphipods;
    }
}

class Tile {
    position: Vector2;
    links: Tile[];
    room: Room;

    constructor(position: Vector2, room: Room = null) {
        this.position = position;
        this.links = [];
        this.room = room;
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
    let id = 0;
    for (const [lineIndex, line] of input.entries()) {
        for (const [spaceIndex, space] of line.split('').entries()) {
            if (space === 'A' || space === 'B' || space === 'C' || space == 'D') {
                const tile = tiles.find((tile) =>
                    tile.position.equals(new Vector2(spaceIndex, lineIndex)),
                );
                if (!tile) throw new Error('No tile found for amphipods');

                const amphipod = new Amphipod(id, space, tile);
                amphipods.push(amphipod);
            }
        }
    }

    return amphipods;
};

const part1 = () => {
    const input = getInput('2021', '23').split('\n');

    const tiles = parseTiles(input);

    console.log(tiles);
    const amphipods = parseAmphipods(input, tiles);

    return;
};

const part2 = () => {
    const input = getInput('2021', '23').split('\n');

    return;
};

console.log(`Solution 1: ${part1()}`);
console.log(`Solution 2: ${part2()}`);
