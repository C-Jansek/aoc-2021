import getInput from '../../../utils/getInput';

const part1 = () => {
    const input = getInput('2021', '8')
        .split('\n')
        .slice(0, -1);

    // const input = [
    //     'be cfbegad cbdgef fgaecd cgeb fdcge agebfd fecdb fabcd edb | fdgacbe cefdb cefbgd gcbe',
    //     'edbfga begcd cbg gc gcadebf fbgde acbgfd abcde gfcbed gfec | fcgedb cgb dgebacf gc',
    //     'fgaebd cg bdaec gdafb agbcfd gdcbef bgcad gfac gcb cdgabef | cg cg fdcagb cbg',
    //     'fbegcd cbd adcefb dageb afcb bc aefdc ecdab fgdeca fcdbega | efabcd cedba gadfec cb',
    //     'aecbfdg fbg gf bafeg dbefa fcge gcbea fcaegb dgceab fcbdga | gecf egdcabf bgf bfgea',
    //     'fgeab ca afcebg bdacfeg cfaedg gcfdb baec bfadeg bafgc acf | gebdcfa ecba ca fadegcb',
    //     'dbcfg fgd bdegcaf fgec aegbdf ecdfab fbedc dacgb gdcebf gf | cefg dcbef fcge gbcadfe',
    //     'bdfegc cbegaf gecbf dfcage bdacg ed bedf ced adcbefg gebcd | ed bcgafe cdgba cbgef',
    //     'egadfb cdbfeg cegd fecab cgb gbdefca cg fgcdab egfdb bfceg | gbdfcae bgc cg cgb',
    //     'gcafb gcf dcaebfg ecagb gf abcdeg gaef cafbge fdbac fegbdc | fgae cfgab fg bagce',
    // ];

    let total = 0;
    for (const line of input) {
        const outputs = line.split(' | ')[1].split(' ');
        for (const out of outputs) {
            if ([2, 3, 4, 7].includes(out.length)) total++;
        }
    }

    return total;
};

const part2 = () => {
    const input = getInput('2021', '8')
        .split('\n')
        .slice(0, -1);

    // const input = [
    //     'be cfbegad cbdgef fgaecd cgeb fdcge agebfd fecdb fabcd edb | fdgacbe cefdb cefbgd gcbe',
    //     'edbfga begcd cbg gc gcadebf fbgde acbgfd abcde gfcbed gfec | fcgedb cgb dgebacf gc',
    //     'fgaebd cg bdaec gdafb agbcfd gdcbef bgcad gfac gcb cdgabef | cg cg fdcagb cbg',
    //     'fbegcd cbd adcefb dageb afcb bc aefdc ecdab fgdeca fcdbega | efabcd cedba gadfec cb',
    //     'aecbfdg fbg gf bafeg dbefa fcge gcbea fcaegb dgceab fcbdga | gecf egdcabf bgf bfgea',
    //     'fgeab ca afcebg bdacfeg cfaedg gcfdb baec bfadeg bafgc acf | gebdcfa ecba ca fadegcb',
    //     'dbcfg fgd bdegcaf fgec aegbdf ecdfab fbedc dacgb gdcebf gf | cefg dcbef fcge gbcadfe',
    //     'bdfegc cbegaf gecbf dfcage bdacg ed bedf ced adcbefg gebcd | ed bcgafe cdgba cbgef',
    //     'egadfb cdbfeg cegd fecab cgb gbdefca cg fgcdab egfdb bfceg | gbdfcae bgc cg cgb',
    //     'gcafb gcf dcaebfg ecagb gf abcdeg gaef cafbge fdbac fegbdc | fgae cfgab fg bagce',
    // ];

    let total = 0;
    for (const line of input) {
        total += processLine(line);
    }
    return total;
};

const processLine = (line: string): number => {
    const [input, output] = line.split(' | ').map((part) => part.split(' '));
    // console.log(input, output);

    const one = [...input].find((inputValue) => inputValue.length === 2)?.split('');
    const four = [...input].find((inputValue) => inputValue.length === 4)?.split('');
    const seven = [...input].find((inputValue) => inputValue.length === 3)?.split('');
    const eight = [...input].find((inputValue) => inputValue.length === 7)?.split('');

    if (!(one && four && seven && eight)) {
        throw new Error('Not one or four or seven or eight');
    }

    const three = [...input]
        .find((inputValue) => {
            if (inputValue.length === 5 && one.every((part) => inputValue.includes(part))) {
                return inputValue;
            }
        })
        ?.split('');

    const nine = [...input]
        .find((inputValue) => {
            if (inputValue.length === 6 && three?.every((part) => inputValue.includes(part))) {
                return inputValue;
            }
        })
        ?.split('');

    const zero = [...input]
        .find((inputValue) => {
            if (
                inputValue.length === 6 &&
                inputValue.split('').some((part) => !nine?.includes(part)) &&
                one?.every((part) => inputValue.includes(part))
            ) {
                return inputValue;
            }
        })
        ?.split('');

    const six = [...input]
        .find((inputValue) => {
            if (
                inputValue.length === 6 &&
                inputValue.split('').some((part) => !nine?.includes(part)) &&
                inputValue.split('').some((part) => !zero?.includes(part))
            ) {
                return inputValue;
            }
        })
        ?.split('');

    const five = [...input]
        .find((inputValue) => {
            if (
                inputValue.length === 5 &&
                inputValue.split('').every((part) => six?.includes(part))
            ) {
                return inputValue;
            }
        })
        ?.split('');

    const two = [...input]
        .find((inputValue) => {
            if (
                inputValue.length === 5 &&
                inputValue.split('').some((part) => !five?.includes(part) && !three?.includes(part))
            ) {
                return inputValue;
            }
        })
        ?.split('');

    const digits = {
        0: zero,
        1: one,
        2: two,
        3: three,
        4: four,
        5: five,
        6: six,
        7: seven,
        8: eight,
        9: nine,
    };

    // ----------------------------------------------------------

    let outputValue = '';
    for (const out of output) {
        // console.log(out, 'is', digits);
        for (const [digit, digitParts] of Object.entries(digits)) {
            if (
                digitParts?.length === out.length &&
                digitParts.every((part) => out.split('').includes(part))
            ) {
                // console.log('Yep!', digit);
                outputValue += String(digit);
                break;
            }
        }
    }
    // console.log(outputValue);

    if (Object.values(digits).includes(undefined)) {
        throw new Error('something undef');
    }
    return Number(outputValue);
};

console.log(`Solution 1: ${part1()}`);
console.log(`Solution 2: ${part2()}`);
