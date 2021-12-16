import { assert } from 'console';
import getInput from '../../../utils/getInput';

type Packet = {
    version: string;
    typeId: string;
    length: number;
    versionSum: number;
    literalValue?: number;
    subPackets?: (Packet | null)[];
};

const parseHexadecimal = (input: string): string => {
    let output = '';
    for (const char of input) {
        output += ('0000' + Number.parseInt(char, 16).toString(2)).slice(-4);
    }
    // console.log(output);
    return output;
};

const unpack = (input: string): Packet | null => {
    if (Number.parseInt(input) === 0) return null;
    // console.log(`------unpack\n${input}`);
    const version = input.slice(0, 3);
    const typeId = input.slice(3, 6);

    if (Number.parseInt(typeId, 2) === 4) {
        // console.log({ version, typeId });
        // console.log('\t\tV');

        const valueBits = input.slice(6);
        const valuesArray: string[] = [];
        for (let index = 0; index - 1 < valueBits.length / 5; index++) {
            valuesArray.push(valueBits.slice(index * 5 + 1, (index + 1) * 5));
            if (valueBits[index * 5] === '0') {
                break;
            }
        }

        const length =
            valuesArray.join('').length + valuesArray.length + version.length + typeId.length;
        // console.log(valuesArray.join('').length, version.length, typeId.length);
        // console.log({
        //     version,
        //     typeId,
        //     length,
        //     literalValue: Number.parseInt(valuesArray.join(''), 2),
        //     versionSum: Number.parseInt(version, 2),
        // });
        return {
            version,
            typeId,
            length,
            literalValue: Number.parseInt(valuesArray.join(''), 2),
            versionSum: Number.parseInt(version, 2),
        };
    }

    const dataBits = input.slice(7);
    const lengthTypeId = input[6];

    if (lengthTypeId === '0') {
        const lengthTypeIdLength = 15;
        const subPacketsTotalLength = Number.parseInt(dataBits.slice(0, lengthTypeIdLength), 2);
        // console.log({ version, typeId, lengthTypeId, subPacketsTotalLength });

        const subPacketBits = dataBits.slice(lengthTypeIdLength);
        const subPackets: Packet[] = [];

        // Split subpackets
        let index = 0;
        while (index < subPacketsTotalLength) {
            const subPacket = unpack(subPacketBits.slice(index, subPacketsTotalLength));
            if (!subPacket) break;
            subPackets.push(subPacket);
            index += subPacket.length;
        }
        const versionSum = subPackets.reduce(
            (sum, current) => (sum += current.versionSum),
            Number.parseInt(version, 2),
        );

        const length =
            index + version.length + typeId.length + lengthTypeId.length + lengthTypeIdLength;

        return {
            version,
            typeId,
            length,
            subPackets,
            versionSum,
        };
    } else {
        assert(lengthTypeId === '1');
        if (lengthTypeId !== '1') throw new Error('Not specified lengthTypId');

        const lengthTypeIdLength = 11;
        const subPacketCount = Number.parseInt(dataBits.slice(0, lengthTypeIdLength), 2);
        // console.log({ version, typeId, lengthTypeId, subPacketCount });

        const subPacketBits = dataBits.slice(lengthTypeIdLength);
        const subPackets: Packet[] = [];

        // while (subPacketBits.slice(-subPacketCount) === '0'.repeat(subPacketCount)) {
        //     subPacketBits = subPacketBits.slice(0, -subPacketCount);
        // }

        // Split subpackets
        let index = 0;
        let subPacketIndex = 0;
        while (subPacketIndex < subPacketCount) {
            const subPacket = unpack(subPacketBits.slice(index));
            if (!subPacket) break;
            subPackets.push(subPacket);
            index += subPacket.length;
            subPacketIndex++;
        }

        // Unpack subPackets
        const versionSum = subPackets.reduce(
            (sum, current) => (sum += current.versionSum),
            Number.parseInt(version, 2),
        );
        const length =
            index + version.length + typeId.length + lengthTypeId.length + lengthTypeIdLength;

        return {
            version,
            typeId,
            length,
            subPackets,
            versionSum,
        };
    }
};

const part1 = () => {
    const input = getInput('2021', '16').split('\n')[0];
    // const input = 'D2FE28';
    // const input = 'A0016C880162017C3686B18A3D4780';

    const binaryData = parseHexadecimal(input);
    const packet = unpack(binaryData);
    // console.log(packet);

    // const input2 = '38006F45291200';

    // const binaryData2 = parseHexadecimal(input2);
    // const packets2 = unpack(binaryData2);
    // console.log(packets2);

    // const input3 = '8A004A801A8002F478';

    // const binaryData3 = parseHexadecimal(input3);
    // const packets3 = unpack(binaryData3);
    // console.log(packets3);

    return packet?.versionSum ?? -1;
};

const part2 = () => {
    const input = getInput('2021', '16').split('\n');

    return;
};

console.log(`Solution 1: ${part1()}`);
console.log(`Solution 2: ${part2()}`);
