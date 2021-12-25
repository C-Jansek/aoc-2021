import Heap from 'heap';
import { cloneDeep, uniqBy } from 'lodash';
import { Vector2 } from 'three';
import getInput from '../../../utils/getInput';

type RoomType = 'A' | 'B' | 'C' | 'D';

const moveCost = (type: RoomType) => 10 ** ['A', 'B', 'C', 'D'].indexOf(type);

type House = {
    hallway: string[];
    rooms: Room[];
};

type Room = {
    tiles: string[];
    roomType: RoomType;
};

type Amphipod = {
    type: RoomType;
    position: Vector2;
};

type Move = {
    start: Vector2;
    end: Vector2;
};

type State = {
    house: House;
    totalEnergy: number;
};

const roomMap: { [key: string]: number } = {
    A: 2,
    B: 4,
    C: 6,
    D: 8,
};

const parseInput = (input: string, roomSize: number): House => {
    const hallway: string[] = input
        .split('\n')[1]
        .slice(1, -1)
        .split('');

    const rooms: Room[] = [];

    for (const [type, index] of Object.entries(roomMap)) {
        if (type !== 'A' && type !== 'B' && type !== 'C' && type !== 'D') {
            throw new Error('No Room of type');
        }

        const tiles = input
            .split('\n')
            .map((row) => row.split('')[index + 1])
            .slice(2, 2 + roomSize);
        rooms.push({
            tiles,
            roomType: type,
        });
    }

    return {
        hallway,
        rooms,
    };
};

const stringifyHouse = (house: House): string => {
    let output = '#'.repeat(13) + '\n';

    output += '#' + house.hallway.join('') + '#' + '\n';

    for (let index = 0; index < house.rooms[0].tiles.length; index++) {
        output += '###' + house.rooms.map((room) => room.tiles[index]).join('#') + '###' + '\n';
    }
    output += '#'.repeat(13);

    return output;
};

const getTopAmphipod = (room: Room): Amphipod | null => {
    const amphipod = room.tiles.find((tile) => tile !== '.');
    if (amphipod !== 'A' && amphipod !== 'B' && amphipod !== 'C' && amphipod !== 'D') {
        return null;
    }

    const y = room.tiles.indexOf(amphipod) + 2;
    return {
        type: amphipod,
        position: new Vector2(roomMap[room.roomType], y),
    };
};

const getMoveToHallway = (amphipod: Amphipod, index: number): Move => {
    return {
        start: amphipod.position,
        end: new Vector2(index, 0),
    };
};

const getOutMoves = (house: House): Move[] => {
    const outMoves: Move[] = [];
    for (const room of house.rooms) {
        // Find topmost Amphipod
        const amphipod = getTopAmphipod(room);
        if (amphipod === null) continue;

        // Check if it can move out
        // To the left
        let moveLeftHallwayIndex = roomMap[room.roomType] - 1;
        if (house.hallway[moveLeftHallwayIndex] === '.') {
            outMoves.push(getMoveToHallway(amphipod, moveLeftHallwayIndex));

            moveLeftHallwayIndex--;
            let nextTileLeft = house.hallway[moveLeftHallwayIndex];
            while (nextTileLeft) {
                if (nextTileLeft !== '.') break;

                if (Object.values(roomMap).includes(moveLeftHallwayIndex)) {
                    moveLeftHallwayIndex--;
                    continue;
                }

                outMoves.push(getMoveToHallway(amphipod, moveLeftHallwayIndex));

                moveLeftHallwayIndex--;
                nextTileLeft = house.hallway[moveLeftHallwayIndex];
            }
        }
        // To The right
        let moveRightHallwayIndex = roomMap[room.roomType] + 1;
        if (house.hallway[moveRightHallwayIndex] === '.') {
            outMoves.push(getMoveToHallway(amphipod, moveRightHallwayIndex));

            moveRightHallwayIndex++;
            let nextTileRight = house.hallway[moveRightHallwayIndex];
            while (nextTileRight) {
                if (nextTileRight !== '.') break;

                if (Object.values(roomMap).includes(moveRightHallwayIndex)) {
                    moveRightHallwayIndex++;
                    continue;
                }

                outMoves.push(getMoveToHallway(amphipod, moveRightHallwayIndex));

                moveRightHallwayIndex++;
                nextTileRight = house.hallway[moveRightHallwayIndex];
            }
        }
    }
    return outMoves;
};

const getInMoves = (house: House): Move[] => {
    const inMoves: Move[] = [];
    for (const [tileIndex, hallwayTile] of house.hallway.entries()) {
        if (hallwayTile === '.') continue;

        const amphipod = {
            type: hallwayTile,
            position: new Vector2(tileIndex, 1),
        };

        // Find room
        const room = house.rooms.find((room) => room.roomType === amphipod.type);
        if (!room) throw new Error(`Cannot find room of type ${amphipod.type}`);

        // Find topmost Amphipod in room
        const topAmphipod = getTopAmphipod(room);
        if (topAmphipod !== null && topAmphipod.type !== amphipod.type) continue;

        const endPosition = new Vector2(roomMap[room.roomType], room.tiles.length + 1);
        if (topAmphipod) endPosition.setY(topAmphipod.position.y - 1);

        // Check if way clear
        const minX = Math.min(amphipod.position.x, endPosition.x);
        const maxX = Math.max(amphipod.position.x, endPosition.x);
        if (house.hallway.slice(minX, maxX).some((tile) => tile !== '.')) continue;

        inMoves.push({ start: amphipod.position, end: endPosition });
    }

    return inMoves;
};

const isFinished = (house: House): boolean => {
    for (const room of house.rooms) {
        for (const tile of room.tiles) {
            if (tile !== room.roomType) return false;
        }
    }
    return true;
};

const doInMove = (house: House, move: Move): number => {
    // Find amphipod type
    const type = house.hallway[move.start.x];
    if (type !== 'A' && type !== 'B' && type !== 'C' && type !== 'D') {
        throw new Error('No amphipod of type');
    }

    // Find destination
    const room = house.rooms.find((room) => room.roomType === type);
    if (!room) throw new Error(`Cannot find room with type ${type}`);

    // Move
    house.hallway[move.start.x] = '.';
    room.tiles[move.end.y - 2] = type;

    // Return move cost
    return move.start.manhattanDistanceTo(move.end) * moveCost(type);
};

const doOutMove = (house: House, move: Move): number => {
    // Find room type
    const roomType = Object.keys(roomMap).find((roomKey) => roomMap[roomKey] === move.start.x);
    if (roomType !== 'A' && roomType !== 'B' && roomType !== 'C' && roomType !== 'D') {
        throw new Error('No amphipod of type');
    }

    // Find start
    const room = house.rooms.find((room) => room.roomType === roomType);
    if (!room) throw new Error(`Cannot find room with type ${roomType}`);

    // Find amphipod type
    const type = room.tiles[move.start.y - 2];
    if (type !== 'A' && type !== 'B' && type !== 'C' && type !== 'D') {
        throw new Error('No amphipod of type');
    }

    // Move
    room.tiles[move.start.y - 2] = '.';
    house.hallway[move.end.x] = type;

    // Return move cost
    return move.start.manhattanDistanceTo(move.end) * moveCost(type);
};

const minRemainingEnergy = (house: House): number => {
    // TODO: calc min remaining energy
    let totalEnergy = 0;
    const inRooms: { [key: string]: number } = {};
    for (const room of house.rooms) {
        inRooms[room.roomType] = room.tiles.filter((tile) => tile === room.roomType).length;
    }

    for (const room of house.rooms) {
        if (room.tiles.every((tile) => tile === room.roomType || tile === '.')) continue;

        let tileIndex = 0;
        for (const tile of room.tiles) {
            if (tile === '.') continue;
            if (tile !== 'A' && tile !== 'B' && tile !== 'C' && tile !== 'D') {
                throw new Error('Not an amphipod');
            }

            const outStart = new Vector2(roomMap[room.roomType], tileIndex);
            const outEnd = new Vector2(roomMap[room.roomType], 0);

            const inEnd = new Vector2(roomMap[tile], room.tiles.length - inRooms[tile]);
            inRooms[tile]++;

            totalEnergy +=
                moveCost(tile) *
                (outStart.manhattanDistanceTo(outEnd) + outEnd.manhattanDistanceTo(inEnd));

            tileIndex++;
        }
    }

    for (const [tileIndex, tile] of house.hallway.entries()) {
        if (tile === '.') continue;
        if (tile !== 'A' && tile !== 'B' && tile !== 'C' && tile !== 'D') {
            throw new Error('Not an amphipod');
        }

        const inStart = new Vector2(tileIndex, 0);

        const inEnd = new Vector2(roomMap[tile], house.rooms[0].tiles.length - inRooms[tile]);
        inRooms[tile]++;

        totalEnergy += moveCost(tile) * inStart.manhattanDistanceTo(inEnd);
    }

    return totalEnergy;
};

const solve = (house: House, upperBound: number): number => {
    const pQueue: Heap<State> = new Heap((a: State, b: State) =>
        b.totalEnergy > a.totalEnergy ? -1 : 1,
    );
    pQueue.push({ house, totalEnergy: 0 });
    const seen: Set<string> = new Set();

    // while (pQueue.size() > 0 && seen.size === 1) {
    while (pQueue.size() > 0) {
        const state = pQueue.pop();
        if (!state) throw new Error('No next State to check');

        console.log(pQueue.size(), state.totalEnergy, minRemainingEnergy(state.house));
        // console.log('\n\n');
        console.log(stringifyHouse(state.house));
        // console.log(state.house);
        // console.log(state.house.rooms);
        // console.log(getOutMoves(state.house));
        // console.log(getInMoves(state.house));

        if (isFinished(state.house)) return state.totalEnergy;

        const doMoves: Move[] = [];
        const inMoves = getInMoves(state.house);
        if (inMoves.length > 0) doMoves.push(...inMoves);
        else doMoves.push(...getOutMoves(state.house));

        for (const move of doMoves) {
            const newState = cloneDeep(state);

            newState.totalEnergy +=
                inMoves.length > 0
                    ? doInMove(newState.house, move)
                    : doOutMove(newState.house, move);

            const stringified = stringifyHouse(newState.house);
            if (
                !seen.has(stringified) &&
                state.totalEnergy + minRemainingEnergy(state.house) < upperBound
            ) {
                const allreadyIn = pQueue
                    .toArray()
                    .find(
                        (queuedState: State) => stringifyHouse(queuedState.house) === stringified,
                    );
                if (!allreadyIn) {
                    // Push to the queue if not allready in the queue
                    pQueue.push(newState);
                } else {
                    // console.log('allreadyin');

                    // set lowest energy if allready in the queue
                    if (allreadyIn.totalEnergy > newState.totalEnergy) {
                        allreadyIn.totalEnergy = newState.totalEnergy;
                    }
                }
            }
        }
        seen.add(stringifyHouse(house));
    }
    const houses = pQueue
        .toArray()
        .sort((a: State, b: State) => (a.house < b.house ? -1 : 1))
        .map((state) => state.house);

    console.log(uniqBy(houses, (house) => stringifyHouse(house)).length);
    console.log(houses.length);

    return -1;
};

const part1 = () => {
    const input = getInput('2021', '23')
        .split('\n')
        .filter((line) => line !== '')
        .join('\n');
};

const part2 = () => {
    const input = addTwoLines(
        getInput('2021', '23')
            .split('\n')
            .filter((line) => line !== ''),
    ).join('\n');

    const house = parseInput(input, 4);

    // doOutMove(house, {
    //     start: new Vector2(2, 2),
    //     end: new Vector2(1, 0),
    // });
    // doOutMove(house, {
    //     start: new Vector2(2, 3),
    //     end: new Vector2(3, 0),
    // });
    // doOutMove(house, {
    //     start: new Vector2(2, 4),
    //     end: new Vector2(5, 0),
    // });

    // solve(house, 49076);
    // solve(house, 48676);
    solve(house, 44300);

    console.log(input);

    return;
};

const addTwoLines = (input: string[]): string[] => {
    const lastLines = input.splice(-2, 2);
    if (!lastLines) throw new Error('No lastLine');

    input.push('  #D#C#B#A#', '  #D#B#A#C#', ...lastLines);
    return input;
};

console.log(`Solution 1: ${part1()}`);
console.log(`Solution 2: ${part2()}`);
