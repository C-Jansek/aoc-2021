import { cloneDeep } from 'lodash';
import { Vector2 } from 'three';
import getInput from '../../../utils/getInput';

type RoomType = 'A' | 'B' | 'C' | 'D' | null;

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

    setPosition(tile: Tile) {
        tile.occupied = this;
        this.position = tile;
    }

    getPossibleMoves() {
        if (this.finished) return [];

        if (!this.movedOut) {
            return this.getPossibleOutMoves();
        }

        return this.getPossibleFinalMove();
    }

    getPossibleOutMoves() {
        const possibleMoves: Tile[] = [];
        const toCheck = [this.position];
        const seen: Set<Tile> = new Set();

        while (toCheck.length > 0) {
            const nextTileToCheck = toCheck.pop();
            if (!nextTileToCheck) throw new Error('No next tile');

            const roomType = getRoomType(nextTileToCheck.position.y, nextTileToCheck.position.x);
            for (const link of nextTileToCheck.links) {
                const linkRoomType = getRoomType(link.position.y, link.position.x);
                if (
                    !seen.has(link) &&
                    !toCheck.includes(link) &&
                    !link.occupied &&
                    (linkRoomType === null || linkRoomType === this.type)
                ) {
                    toCheck.push(link);
                }
            }

            if (nextTileToCheck.canStayOnTile(this) && roomType === null) {
                possibleMoves.push(nextTileToCheck);
            }

            seen.add(nextTileToCheck);
        }
        // console.log('out', possibleMoves.length);
        return possibleMoves;
    }

    getPossibleFinalMove() {
        const toCheck = [this.position];
        const seen: Set<Tile> = new Set();

        while (toCheck.length > 0) {
            const nextTileToCheck = toCheck.pop();
            if (!nextTileToCheck) throw new Error('No next tile');

            // TODO: Adapt to check only moves that would get better for getting closer to the rooms
            const roomType = getRoomType(nextTileToCheck.position.y, nextTileToCheck.position.x);
            for (const link of nextTileToCheck.links) {
                const linkRoomType = getRoomType(link.position.y, link.position.x);
                if (
                    !seen.has(link) &&
                    !toCheck.includes(link) &&
                    !link.occupied &&
                    (linkRoomType === null || linkRoomType === this.type)
                ) {
                    toCheck.push(link);
                }
            }

            if (
                nextTileToCheck.canStayOnTile(this) &&
                roomType === this.type &&
                nextTileToCheck.links.every((tile) => {
                    return tile.position.y > nextTileToCheck.position.y || tile.occupied;
                })
            ) {
                return [nextTileToCheck];
            }

            seen.add(nextTileToCheck);
        }

        return [];
    }

    /**
     * Move Amphipod to tile.
     *
     * @return {number} The cost of doing this move
     */
    moveToTile(tile: Tile): number {
        const distance = this.position.position.manhattanDistanceTo(tile.position);
        // console.log(distance);
        // Change position
        this.position.occupied = null;
        tile.occupied = this;
        this.position = tile;

        return distance * this.moveCost;
    }
}

class House {
    hallway: Tile[];
    amphipods: Amphipod[];
    rooms: Room[];
    totalEnergyUsed: number;

    constructor(amphipods: Amphipod[], hallway: Tile[], rooms: Room[]) {
        this.hallway = hallway;
        this.rooms = rooms;
        this.amphipods = amphipods;
        this.totalEnergyUsed = 0;
    }

    solve() {
        const toCheck: House[] = [this];
        const seen: Set<string> = new Set();
        let firstTime = true;

        while (toCheck.length > 0) {
            // console.log(toCheck.length);
            const nextToCheck = toCheck.pop();
            if (!nextToCheck) throw new Error('No more checks to do. Found no solution.');

            if (nextToCheck.isFinished()) return nextToCheck.totalEnergyUsed;

            // Should check occupied hallway tiles
            const amphipodsToCheck: Amphipod[] = [];
            for (const tile of nextToCheck.hallway) {
                if (tile.occupied) {
                    amphipodsToCheck.push(tile.occupied);
                }
            }

            // Should check topmost amphipods in rooms
            for (const amphipod of nextToCheck.rooms.map((room) => room.getUpmostAmphipod())) {
                if (amphipod) amphipodsToCheck.push(amphipod);
            }

            // console.log(nextToCheck.totalEnergyUsed);

            // Check all amphipods to check
            for (const amphipod of amphipodsToCheck) {
                const possibleMoves = amphipod.getPossibleMoves();

                if (firstTime) console.log(nextToCheck.stringify());

                const possibleStates = possibleMoves.map((toTile: Tile) => {
                    const state = nextToCheck.clone();
                    const clonedAmphipod = state.amphipods.find((a) => a.id === amphipod.id);
                    if (!clonedAmphipod) throw new Error('Amphipod non existant');

                    clonedAmphipod.moveToTile(toTile);

                    if (firstTime) console.log(clonedAmphipod.id, clonedAmphipod.position.position);
                    if (firstTime) console.log(clonedAmphipod.id, clonedAmphipod.position.position);

                    return state;
                });

                if (firstTime) console.log(possibleStates[0].hallway);
                firstTime = false;

                for (const possibleState of possibleStates) {
                    const stateInToCheck = toCheck.find(
                        (state: House) => state.stringify() === possibleState.stringify(),
                    );
                    if (
                        stateInToCheck &&
                        stateInToCheck.totalEnergyUsed > possibleState.totalEnergyUsed
                    ) {
                        stateInToCheck.totalEnergyUsed = possibleState.totalEnergyUsed;
                    } else if (!seen.has(possibleState.stringify())) {
                        toCheck.push(possibleState);
                    }
                }
            }

            seen.add(nextToCheck.stringify());
            toCheck.sort((a: House, b: House) => a.totalEnergyUsed - b.totalEnergyUsed);
        }
        return -1;
    }

    isFinished() {
        if (this.rooms.every((room: Room) => room.isFinished())) return true;
        return false;
    }

    stringify() {
        const hallwayString = this.hallway.map((tile: Tile) => tile.stringify());

        const roomString = this.rooms.map((room) =>
            room.tiles.map((tile: Tile) => tile.stringify()).join('_'),
        );

        return `${hallwayString}\n${roomString}`;
    }

    clone() {
        return cloneDeep(this);
    }
}

// class Move {
//     fromTile: Tile;
//     toTile: Tile;

//     constructor(fromTile: Tile, toTile: Tile) {
//         this.fromTile = fromTile;
//         this.toTile = toTile;
//     }
// }

class Room {
    tiles: Tile[];
    type: RoomType;

    constructor(tiles: Tile[], type: RoomType) {
        this.tiles = tiles.sort((a: Tile, b: Tile) => b.position.y - a.position.y);
        this.type = type;
    }

    getUpmostAmphipod() {
        for (const tile of this.tiles) {
            if (tile.occupied) return tile.occupied;
        }
        return null;
    }

    isFinished() {
        for (const tile of this.tiles) {
            if (!tile.occupied || tile.occupied.type !== this.type) return false;
        }
        return true;
    }
}

class Tile {
    position: Vector2;
    links: Tile[];
    occupied: Amphipod | null;

    constructor(position: Vector2) {
        this.position = position;
        this.links = [];
        this.occupied = null;
    }

    addLink(tile: Tile): void {
        this.links.push(tile);
    }

    stringify() {
        return this.occupied ? this.occupied.type : '.';
    }

    canStayOnTile(amphipod: Amphipod) {
        if (this.links.length === 3) return false;

        const roomType = getRoomType(this.position.y, this.position.x);
        if (roomType && roomType !== amphipod.type) return false;

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

const getRoomType = (row: number, col: number): RoomType => {
    if (row < 2) return null;

    if (col === 3) return 'A';
    if (col === 5) return 'B';
    if (col === 7) return 'C';
    if (col === 9) return 'D';
    return null;
};

const parseTiles = (input: string[]): { tiles: Tile[]; rooms: Room[]; hallway: Tile[] } => {
    const tiles: Tile[] = [];
    const hallway: Tile[] = [];
    const rooms: Room[] = [
        new Room([], 'A'),
        new Room([], 'B'),
        new Room([], 'C'),
        new Room([], 'D'),
    ];

    // Construct tiles and add to room or hallway
    for (const [lineIndex, line] of input.entries()) {
        for (const [spaceIndex, space] of line.split('').entries()) {
            if (['A', 'B', 'C', 'D', '.'].includes(space)) {
                const tile = new Tile(new Vector2(spaceIndex, lineIndex));
                tiles.push(tile);

                const tileRoom = rooms.find(
                    (room) => room.type === getRoomType(lineIndex, spaceIndex),
                );

                if (tileRoom) {
                    tileRoom.tiles.push(tile);
                } else {
                    hallway.push(tile);
                }
            }
        }
    }

    // Link tiles
    for (const tile of tiles) {
        for (const neighbour of getNeighbours(tile, tiles)) {
            tile.addLink(neighbour);
        }
    }

    return { tiles, rooms, hallway };
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

                amphipod.setPosition(tile);
                amphipods.push(amphipod);
            }
        }
    }

    return amphipods;
};

const part1 = () => {};

const part2 = () => {
    const input = getInput('2021', '23')
        .split('\n')
        .filter((line) => line !== '');

    const lastLines = input.splice(-2, 2);
    if (!lastLines) throw new Error('No lastLine');

    input.push('  #D#C#B#A#', '  #D#B#A#C#', ...lastLines);

    console.log(input.join('\n'));
    const { tiles, rooms, hallway } = parseTiles(input);
    const amphipods = parseAmphipods(input, tiles);

    const house = new House(amphipods, hallway, rooms);

    return house.solve();
};

console.log(`Solution 1: ${part1()}`);
console.log(`Solution 2: ${part2()}`);
