import Heap from 'heap';
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
        this.movedOut = position.position.y < 2;
        this.finished = false;
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
                // const linkRoomType = getRoomType(link.position.y, link.position.x);
                if (
                    !seen.has(link) &&
                    !toCheck.includes(link) &&
                    !link.occupied
                    // (linkRoomType === null || linkRoomType === this.type)
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

            console.log(
                nextTileToCheck.canStayOnTile(this),
                roomType === this.type,
                nextTileToCheck.links.every((tile) => {
                    return tile.position.y > nextTileToCheck.position.y || tile.occupied;
                }),
            );
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

    constructor(amphipods: Amphipod[], hallway: Tile[], rooms: Room[], startingEnergy = 0) {
        this.hallway = hallway;
        this.rooms = rooms;
        this.amphipods = amphipods;
        this.totalEnergyUsed = startingEnergy;
    }

    solve() {
        const pQueue = new Heap((a: House, b: House) =>
            b.totalEnergyUsed > a.totalEnergyUsed ? -1 : 1,
        );
        pQueue.push(this);
        const seen: Set<string> = new Set();

        while (pQueue.size() > 0) {
            console.log(pQueue.size());
            const nextToCheck = pQueue.pop();
            if (!nextToCheck) throw new Error('No more checks to do. Found no solution.');

            if (nextToCheck.isFinished()) return nextToCheck.totalEnergyUsed;

            // Should check occupied hallway tiles
            const amphipodsFromHallway: Amphipod[] = [];
            for (const tile of nextToCheck.hallway) {
                if (tile.occupied) {
                    amphipodsFromHallway.push(tile.occupied);
                }
            }
            const amphipodsFromRooms: Amphipod[] = [];
            // Should check topmost amphipods in rooms
            for (const amphipod of nextToCheck.rooms.map((room) => room.getUpmostAmphipod())) {
                if (amphipod) amphipodsFromRooms.push(amphipod);
            }

            console.log('check next', amphipodsFromHallway.length, amphipodsFromRooms.length);
            console.log(
                'amphipodsFromHallway',
                amphipodsFromHallway.map((amp) => amp.position.position),
            );
            console.log(
                'amphipodsFromRooms',
                amphipodsFromRooms.map((amp) => amp.position.position),
            );
            console.log('end check =======================');
            const amphipodsToCheck = [...amphipodsFromHallway, ...amphipodsFromRooms];
            // Check all amphipods to check
            for (const amphipod of amphipodsToCheck) {
                const possibleMoves = amphipod.getPossibleMoves();

                if (possibleMoves.length === 0 && amphipod.movedOut) {
                    console.log(nextToCheck.stringify());
                    console.log(amphipod.position);
                }

                const possibleStates = possibleMoves.map((toTile: Tile) => {
                    const stateString = nextToCheck.stringify().split('\n');

                    const { tiles, rooms, hallway } = parseTiles(stateString);
                    const amphipods = parseAmphipods(stateString, tiles);
                    const state = new House(amphipods, hallway, rooms, nextToCheck.totalEnergyUsed);

                    const clonedAmphipod = state.amphipods.find((a) =>
                        a.position.position.equals(amphipod.position.position),
                    );
                    if (!clonedAmphipod) throw new Error('Amphipod non existant');

                    const clonedTiles = [...state.hallway];
                    for (const room of state.rooms) {
                        clonedTiles.push(...room.tiles);
                    }

                    const clonedToTile = clonedTiles.find((candidate: Tile) =>
                        candidate.position.equals(toTile.position),
                    );
                    if (!clonedToTile) throw new Error('To Tile non existant');

                    state.totalEnergyUsed += clonedAmphipod.moveToTile(clonedToTile);

                    return state;
                });

                for (const possibleState of possibleStates) {
                    //     const stateInToCheck = pQueue
                    //     .toArray()
                    //     .find((state: House) => state.stringify() === possibleState.stringify());
                    // if (
                    //     stateInToCheck &&
                    //     stateInToCheck.totalEnergyUsed > possibleState.totalEnergyUsed
                    // ) {
                    //     stateInToCheck.totalEnergyUsed = possibleState.totalEnergyUsed;
                    // } else
                    if (
                        !seen.has(possibleState.stringify()) &&
                        !pQueue
                            .toArray()
                            .find((state) => state.stringify() === possibleState.stringify())
                    ) {
                        pQueue.push(possibleState);
                    }
                }
            }

            console.log('energy', nextToCheck.totalEnergyUsed);
            seen.add(nextToCheck.stringify());
        }
        return -1;
    }

    isFinished() {
        if (this.rooms.every((room: Room) => room.isFinished())) return true;
        return false;
    }

    stringify() {
        let output = '#############\n';

        output += '#' + this.hallway.map((tile: Tile) => tile.stringify()).join('') + '#\n';

        for (const tileIndex of this.rooms[0].tiles.keys()) {
            output +=
                '###' +
                this.rooms.map((room) => room.tiles[tileIndex].stringify()).join('#') +
                '###\n';
        }

        output += '#############\n';

        return output;
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
