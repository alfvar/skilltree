export interface NodeData {
    age: number;
    dependency?: string; // key of another node
}

const nodeDataStore: ReadonlyMap<string, NodeData> = new Map([
    ["Pirate", { age: 6 }],
    ["Treasure hunts", { age: 12, dependency: "Pirate" }],
    ["Boat", { age: 12, dependency: "Pirate" }],
    ["Secret base", { age: 12, dependency: "Pirate" }],
    ["Geocaching", { age: 18, dependency: "Treasure hunts" }],
    ["Metal detecting", { age: 18, dependency: "Treasure hunts" }],
    ["Sailing", { age: 18, dependency: "Boat" }],
    ["Fishing", { age: 18, dependency: "Boat" }],
    ["Treehouse building", { age: 18, dependency: "Secret base" }],
    ["Hideout design", { age: 18, dependency: "Secret base" }],
    ["Knight", { age: 6 }],
    ["Princess", { age: 6 }],
    ["Wizard", { age: 6 }],
    ["Dragon", { age: 6 }],
    ["Farmer", { age: 6 }],
    ["Builder", { age: 6 }],

]);

export function getNodeData(name: string): NodeData | undefined {
    return nodeDataStore.get(name);
}

export function getAllNodeData(): ReadonlyArray<[string, NodeData]> {
    return Array.from(nodeDataStore.entries());
}

export function getNodeDependency(name: string): NodeData | undefined {
    const node = nodeDataStore.get(name);
    if (node?.dependency) {
        return nodeDataStore.get(node.dependency);
    }
    return undefined;
}

export function getAncestorChain(name: string): string[] {
    const chain: string[] = [];
    let current = name;
    
    while (current) {
        const node = nodeDataStore.get(current);
        if (!node || !node.dependency) break;
        chain.push(node.dependency);
        current = node.dependency;
    }
    
    return chain;
}
