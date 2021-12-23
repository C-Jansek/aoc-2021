import { Plane, Vector2 } from 'three';
import getInput from '../../../utils/getInput';

type Room = 'A' | 'B' | 'C' | 'D' | null;

class Amphipod {
    id: number;
    type: 'A' | 'B' | 'C' | 'D';
    moveCost: number;
    position: Tile;
    usedEnergy: number;
    movedOut: boolean;
    finished: boolean;

    constructor(id: number, type: 'A' | 'B' | 'C' | 'D', position: Tile) {
        this.id = id;
        this.type = type;
        this.moveCost = 10 ** ['A', 'B', 'C', 'D'].indexOf(type);
        this.position = position;
        this.usedEnergy = 0;
        this.movedOut = false;
        this.finished = false;
    }

    move(tile: Tile) {
        this.position = tile;
        this.usedEnergy += this.moveCost;
    }
}

class House {
    tiles: Tile[];
    amphipods: Amphipod[];

    constructor(amphipods: Amphipod[], tiles: Tile[]) {
        this.tiles = tiles;
        this.amphipods = amphipods;
    }

    solve() {
        for (const amphipod of this.amphipods) {
            const sameTypeAmphipod = this.amphipods.find(
                (amphi) => amphi.id !== amphipod.id && amphi.type === amphipod.type,
            );
            if (!sameTypeAmphipod) throw new Error('Only one of type');

            const moveableTiles = amphipod.position.links.filter((tile) => {
                return tile.canEnter(amphipod, sameTypeAmphipod, amphipod.position);
            });
            for (const nextTile of moveableTiles) {
            }
        }
    }
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

    canStopHere(amphipod: Amphipod, sameTypeAmphipod: Amphipod) {
        if (
            this.room &&
            amphipod.type === this.room &&
            (this.links.length === 1 || sameTypeAmphipod.finished)
        ) {
            return true;
        }

        if (!amphipod.movedOut && this.links.length < 3) {
            return true;
        }
    }

    canEnter(amphipod: Amphipod, sameTypeAmphipod: Amphipod, lastTile: Tile) {
        if (this.occupied) return false;

        if (this.room && this.room !== amphipod.type && amphipod.usedEnergy > 0) return false;

        if (
            this.links
                .filter((tile) => !tile.position.equals(lastTile.position))
                .every((tile) => !tile.canEnter(amphipod, sameTypeAmphipod, lastTile))
        ) {
            this.canStopHere(amphipod, sameTypeAmphipod);
        }

        return true;
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
                id++;
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

    house.solve();

    return amphipods.reduce((total, current) => (total += current.usedEnergy), 0);
};

const part2 = () => {
    const input = getInput('2021', '23').split('\n');

    return;
};

console.log(`Solution 1: ${part1()}`);
console.log(`Solution 2: ${part2()}`);
