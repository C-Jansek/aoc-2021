import { assert } from 'console';
import getInput from '../../../utils/getInput';

type UnfinishedGameStates = {
    [key: string]: number;
};

type PlayerState = {
    position: number;
    score: number;
};

const parseInputToPlayers = (
    input: string[],
): { totalWins: number; unfinishedGames: UnfinishedGameStates }[] => {
    const playerStartStates = input.map((player) => {
        const startingPosition = Number(player.split(': ')[1]);
        return {
            score: 0,
            position: startingPosition,
        };
    });

    return playerStartStates.map((player, index) => {
        const totalWins = 0;
        const unfinishedGames: UnfinishedGameStates = {};
        const gameHash = hashGameState([player, playerStartStates[(index + 1) % 2]]);

        unfinishedGames[gameHash] = 1;
        return {
            totalWins,
            unfinishedGames,
        };
    });
};

/**
 * Generate all possible series of `totalRolls` dice throws
 * with lowest roll `minRoll` and highest roll `maxRoll`.
 */
const generatePossibilities = (totalRolls: number, minRoll = 1, maxRoll = 3): number[][] => {
    if (minRoll > maxRoll) throw new Error('Should have minRoll <= maxRoll');

    // Generate list with integers from minRoll to maxRoll: [minRoll, minRoll + 1 ,..., maxRoll];
    if (totalRolls === 1) {
        const rolls = [];
        for (let index = minRoll; index <= maxRoll; index++) {
            rolls.push([index]);
        }
        return rolls;
    }

    // Generate list that is one shorter, and add all possible rolls to each of the possibilities
    const rolls = generatePossibilities(totalRolls - 1, minRoll, maxRoll);
    const newRolls = [];
    for (let index = minRoll; index <= maxRoll; index++) {
        newRolls.push(...rolls.map((r) => [...r, index]));
    }
    return newRolls;
};

const hashGameState = (players: PlayerState[]): string => {
    return players.reduce((hash, p) => (hash += `${p.position}_${p.score}|`), '');
};

const decryptGameState = (gameHash: string): PlayerState[] => {
    return gameHash
        .split('|')
        .filter((p) => p !== '')
        .map((playerHash) => {
            return {
                position: Number(playerHash.split('_')[0]),
                score: Number(playerHash.split('_')[1]),
            };
        });
};

const part1 = () => {
    const input = getInput('2021', '21')
        .split('\n')
        .filter((line) => line !== '');

    const players = input.map(
        (player): PlayerState => {
            const starting = Number(player.split(': ')[1]);
            const score = 0;
            return {
                position: starting,
                score,
            };
        },
    );

    let dieRoll = 0;
    while (players.every((p) => p.score < 1000)) {
        // Roll next 3 dice
        const totalThisRound = dieRoll + 1 + dieRoll + 2 + dieRoll + 3;

        // Calculate player position
        const playerNo = (dieRoll / 3) % 2;
        let position = players[playerNo].position + totalThisRound;
        while (position > 10) position -= 10;

        // Set stats
        players[playerNo].position = position;
        players[playerNo].score += position;

        // Increment die
        dieRoll += 3;
    }
    return (players.find((p) => p.score < 1000)?.score || 0) * dieRoll;
};

const part2 = () => {
    const input = getInput('2021', '21')
        .split('\n')
        .filter((line) => line !== '');

    const possibleDieces = generatePossibilities(3, 1, 3);

    const players = parseInputToPlayers(input);

    let turn = 0;
    while (players.some((p) => Object.values(p.unfinishedGames).length > 0)) {
        // Get players
        const p1 = players[turn % 2];
        const p2 = players[(turn + 1) % 2];
        // Set new UnfinishedGameStates
        const p1ugs: UnfinishedGameStates = {};
        const p2ugs: UnfinishedGameStates = {};

        // For every possible current unfinishedGame
        for (const [gameHash, amount] of Object.entries(p1.unfinishedGames)) {
            for (const dieRoll of possibleDieces) {
                // Sum all dice throws
                const thisTotal = dieRoll.reduce((total, current) => total + current, 0);

                // Get current game state
                const gameState = decryptGameState(gameHash);
                const p1gs = gameState[0];
                const p2gs = gameState[1];

                // Move player 1 forward
                p1gs.position = p1gs.position + thisTotal;
                // Wrap around if past position 10
                if (p1gs.position > 10) p1gs.position %= 10;

                p1gs.score = p1gs.score + p1gs.position;

                // Update gameState
                if (p1gs.score >= 21) {
                    p1.totalWins += amount;
                } else if (p1ugs[hashGameState([p1gs, p2gs])]) {
                    p1ugs[hashGameState([p1gs, p2gs])] += amount;
                    p2ugs[hashGameState([p2gs, p1gs])] += amount;
                } else {
                    p1ugs[hashGameState([p1gs, p2gs])] = amount;
                    p2ugs[hashGameState([p2gs, p1gs])] = amount;
                }
            }
        }
        // Update unfinished games
        p1.unfinishedGames = p1ugs;
        p2.unfinishedGames = p2ugs;

        turn++;
    }
    // Return total wins of the player with the most wins
    return Math.max(...players.map((p) => p.totalWins));
};

console.log(`Solution 1: ${part1()}`);
console.log(`Solution 2: ${part2()}`);
