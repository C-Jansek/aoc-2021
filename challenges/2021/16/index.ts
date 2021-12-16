import { assert } from 'console';
import getInput from '../../../utils/getInput';

type Packet = {
    version: string;
    typeId: string;
    versionSum: number;
    literalValue?: number;
    subPackets?: (Packet | null)[];
};

const parseHexadecimal = (input: string): string => {
    let output = '';
    for (const char of input) {
        output += ('0000' + Number.parseInt(char, 16).toString(2)).slice(-4);
    }
    console.log(output);
    return output;
};

const unpack = (input: string): Packet => {
    console.log('------\nunpack', input);
    const version = input.slice(0, 3);
    const typeId = input.slice(3, 6);

    if (Number.parseInt(typeId, 2) === 4) {
        console.log({ version, typeId });
        const valueBits = input.slice(6);
        const valuesArray: string[] = [];
        for (let index = 0; index - 1 < valueBits.length / 5; index++) {
            valuesArray.push(valueBits.slice(index * 5 + 1, (index + 1) * 5));
            if (valueBits[index * 5] === '0') {
                break;
            }
        }
        return {
            version,
            typeId,
            literalValue: Number.parseInt(valuesArray.join(''), 2),
            versionSum: Number.parseInt(version, 2),
        };
    }

    const dataBits = input.slice(7);
    const lengthTypeId = input[6];
    console.log({ version, typeId, lengthTypeId });

    if (lengthTypeId === '0') {
        const subPacketsTotalLength = Number.parseInt(dataBits.slice(0, 15), 2);
        const subPacketBits = dataBits.slice(15);
        const subPacketStrings = [];

        // Split subpackets
        subPacketStrings.push(subPacketBits.slice(0, subPacketsTotalLength % 16));
        for (let index = subPacketsTotalLength % 16; index < subPacketsTotalLength; index += 16) {
            subPacketStrings.push(subPacketBits.slice(index, index + 16));
        }
        console.log({ subPacketStrings });

        // Unpack subPackets
        const subPackets = subPacketStrings.map((subPacketString) => unpack(subPacketString));
        const versionSum = subPackets.reduce(
            (sum, current) => (sum += current.versionSum),
            Number.parseInt(version, 2),
        );

        return {
            version,
            typeId,
            subPackets,
            versionSum,
        };
    } else {
        assert(lengthTypeId === '1');
        if (lengthTypeId !== '1') throw new Error('Not specified lengthTypId');

        const subPacketCount = Number.parseInt(dataBits.slice(0, 11), 2);

        let subPacketBits = dataBits.slice(11);
        while (subPacketBits.slice(-subPacketCount) === '0'.repeat(subPacketCount)) {
            subPacketBits = subPacketBits.slice(0, -subPacketCount);
        }

        const subPacketLength = Math.floor(subPacketBits.length / subPacketCount);

        // Split subpackets
        const subPacketStrings = [];
        for (let index = 0; index < subPacketLength * subPacketCount; index += subPacketLength) {
            subPacketStrings.push(subPacketBits.slice(index, index + subPacketLength));
        }
        console.log({ subPacketStrings });

        // Unpack subPackets
        const subPackets = subPacketStrings.map((subPacketString) => unpack(subPacketString));
        const versionSum = subPackets.reduce(
            (sum, current) => (sum += current.versionSum),
            Number.parseInt(version, 2),
        );
        return {
            version,
            typeId,
            subPackets,
            versionSum,
        };
    }
};

const part1 = () => {
    // const input = getInput('2021', '16').split('\n')[0];
    // const input = 'D2FE28';
    const input = '620080001611562C8802118E34';

    const binaryData = parseHexadecimal(input);
    const packet = unpack(binaryData);
    console.log(packet);

    // const input2 = '38006F45291200';

    // const binaryData2 = parseHexadecimal(input2);
    // const packets2 = unpack(binaryData2);
    // console.log(packets2);

    // const input3 = '8A004A801A8002F478';

    // const binaryData3 = parseHexadecimal(input3);
    // const packets3 = unpack(binaryData3);
    // console.log(packets3);

    return packet.versionSum;
};

const part2 = () => {
    const input = getInput('2021', '16').split('\n');

    return;
};

console.log(`Solution 1: ${part1()}`);
console.log(`Solution 2: ${part2()}`);
