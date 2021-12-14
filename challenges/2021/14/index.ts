import getInput from '../../../utils/getInput';

const part1 = () => {
    const input = getInput('2021', '14')
        .split('\n')
        .filter((line) => line !== '');

    let template = input[0];

    const insertions = input.slice(1).map((line) => line.split(' -> '));

    const steps = 10;
    for (let step = 0; step < steps; step++) {
        let newTemplate = '';

        for (let char = 0; char < template.length - 1; char++) {
            const match = insertions.find(
                (insertion) => insertion[0] === template[char] + template[char + 1],
            );

            newTemplate += template[char];
            if (match) {
                newTemplate += match[1];
            }
        }
        newTemplate += template[template.length - 1];
        template = newTemplate;
    }

    const counts: { [key: string]: number } = {};
    for (const char of template) {
        if (counts[char]) counts[char] += 1;
        else counts[char] = 1;
    }

    console.log(counts);

    return Math.max(...Object.values(counts)) - Math.min(...Object.values(counts));
};

type insertionPair = {
    find: string;
    twoNew: { first: string; second: string };
    count: number;
};

const part2 = () => {
    const input = getInput('2021', '14')
        .split('\n')
        .filter((line) => line !== '');

    let template = input[0];

    const insertions = input.slice(1).map((line) => line.split(' -> '));
    const pairs = insertions.map((insertion) => {
        return {
            find: insertion[0],
            twoNew: {
                first: insertion[0][0] + insertion[1],
                second: insertion[1] + insertion[0][1],
            },
            count: 0,
            nextCount: 0,
        };
    });

    for (let char = 0; char < template.length - 1; char++) {
        const match = insertions.find(
            (insertion) => insertion[0] === template[char] + template[char + 1],
        );

        if (match) {
            const pair = pairs.find((pair) => pair.find === match[0]);
            if (pair) pair.count++;
        }
    }

    const steps = 40;
    for (let step = 0; step < steps; step++) {
        // console.log({ step });
        for (const pair of pairs) {
            // console.log('do', pair.find, pair.count);
            if (pair.count >= 1) {
                const pairOne = pairs.find((p) => p.find === pair.twoNew.first);
                const pairTwo = pairs.find((p) => p.find === pair.twoNew.second);
                if (pairOne) pairOne.nextCount += pair.count;
                if (pairTwo) pairTwo.nextCount += pair.count;
                pair.count = 0;
            }
        }
        for (const pair of pairs) {
            pair.count = pair.nextCount;
            pair.nextCount = 0;
        }
    }
    // console.log(pairs.map((pair) => pair.find + '  ' + pair.count).join('\n'));

    const counts: { [key: string]: number } = {};
    for (const pair of pairs) {
        const charOne = pair.find[0];
        const charTwo = pair.find[1];

        if (counts[charOne]) counts[charOne] += pair.count;
        else counts[charOne] = pair.count;
        if (counts[charTwo]) counts[charTwo] += pair.count;
        else counts[charTwo] = pair.count;
    }

    for (const [id, count] of Object.entries(counts)) {
        counts[id] = Math.ceil(count / 2);
    }
    console.log(counts);

    return Math.max(...Object.values(counts)) - Math.min(...Object.values(counts));
};

console.log(`Solution 1: ${part1()}`);
console.log(`Solution 2: ${part2()}`);
