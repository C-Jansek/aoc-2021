import getInput from '../../../utils/getInput';

interface Node {
    id: string;
    edges: Edge[];
    smallCave: boolean;
}

interface Edge {
    id: string;
    nodes: Node[];
}

type Path = {
    path: Node[];
    hasDouble: boolean;
};

/**
 * A Network of Caves.
 */
class Network {
    nodes: Node[];
    edges: Edge[];

    constructor(input: string[]) {
        this.nodes = [];
        this.edges = [];
        this.parseInput(input);
    }

    /**
     * Parse edges to new Nodes and Edges.
     *
     * Used for constructing the network on creation.
     */
    parseInput(input: string[]) {
        for (const line of input) {
            const [from, to] = line.split('-');
            const fromNode = this.findNodeOrNew(from);
            const toNode = this.findNodeOrNew(to);

            const edge = { id: line, nodes: [fromNode, toNode] };

            fromNode.edges.push(edge);
            toNode.edges.push(edge);

            this.nodes.push(fromNode, toNode);
            this.edges.push(edge);
        }
    }

    /**
     * Find node by `id`.
     *
     * If node is not present, create new node.
     */
    findNodeOrNew(id: string): Node {
        const node = this.nodes.find((node) => node.id === id);
        if (!node) {
            let smallCave = false;
            if (/[a-z]/.test(id)) {
                smallCave = true;
            }
            return {
                id,
                edges: [],
                smallCave,
            };
        }
        return node;
    }

    /**
     * Find node by `id`.
     */
    findNode(id: string): Node {
        const node = this.nodes.find((node) => node.id === id);
        if (!node) throw new Error(`No node with id ${id}`);
        return node;
    }

    /**
     * Find all paths from `fromId` to `toId`.
     *
     * Small Caves can only be visited once, except if `oneSmallDouble` is true,
     * then one small caven in every path can be visited (at most) twice.
     */
    allPaths(fromId: string, toId: string, oneSmallDouble = false): Path[] {
        // Find starting and ending nodes
        const startNode = this.findNode(fromId);
        const endNode = this.findNode(toId);

        // Start from the start
        const partialPaths: Path[] = [{ path: [startNode], hasDouble: !oneSmallDouble }];
        const finishedPaths: Path[] = [];

        // While there are unfinished paths not explored
        while (partialPaths.length > 0) {
            // Start exploring a path, or finished
            const path = partialPaths.pop();
            if (!path) return finishedPaths;

            const processed = this.processPartialPath(path, startNode, endNode);

            // Update partial and finished
            if (processed.partial) partialPaths.push(...processed.partial);
            if (processed.finished) finishedPaths.push(processed.finished);
        }

        return finishedPaths;
    }

    /**
     * Continue the Partial path.
     *
     * If it is already complete, return as finished.
     *
     * Else, return all possible partial paths continuing from the last node
     */
    processPartialPath(
        partialPath: Path,
        startNode: Node,
        endNode: Node,
    ): { partial: Path[] | null; finished: Path | null } {
        const lastNode = partialPath.path[partialPath.path.length - 1];
        if (lastNode === endNode) {
            return { partial: null, finished: partialPath };
        }

        // Next nodes are all neighbours of lastNode
        const fromEdges = lastNode.edges;
        const partialPaths: Path[] = [];

        for (const edge of fromEdges) {
            const toNode = edge.nodes.find((node: Node) => node !== lastNode);
            if (!toNode) throw new Error(`Edge with no end Node`);

            // Can visit the node if:
            //      A big cave
            //      Not in path already
            //      There is no double yet, and it's not the starting node
            if (
                !toNode.smallCave ||
                !partialPath.path.includes(toNode) ||
                (!partialPath.hasDouble && toNode !== startNode)
            ) {
                const hasDouble =
                    partialPath.hasDouble ||
                    (toNode.smallCave && partialPath.path.includes(toNode));
                partialPaths.push({ path: [...partialPath.path, toNode], hasDouble });
            }
        }
        return { partial: partialPaths, finished: null };
    }
}

const part1 = () => {
    const input = getInput('2021', '12')
        .split('\n')
        .filter((line) => line !== '');

    const network = new Network(input);

    const paths = network.allPaths('start', 'end', false);

    return paths.length;
};

const part2 = () => {
    const input = getInput('2021', '12')
        .split('\n')
        .filter((line) => line !== '');

    const network = new Network(input);

    const paths = network.allPaths('start', 'end', true);

    return paths.length;
};

console.log(`Solution 1: ${part1()}`);
console.log(`Solution 2: ${part2()}`);
