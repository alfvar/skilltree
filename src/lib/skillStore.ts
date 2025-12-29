export interface NodeData {
    age: number;
    dependency?: string; // key of another node
}

const nodeDataStore: ReadonlyMap<string, NodeData> = new Map([
    ["Pirat", { age: 6 }],
    ["Treasure hunts", { age: 12, dependency: "Pirat" }],
    ["Boat", { age: 12, dependency: "Pirat" }],
    ["Secret base", { age: 12, dependency: "Pirat" }],
    ["Geocaching", { age: 18, dependency: "Treasure hunts" }],
    ["Metal detecting", { age: 18, dependency: "Treasure hunts" }],
    ["Sailing", { age: 18, dependency: "Boat" }],
    ["Fishing", { age: 18, dependency: "Boat" }],
    ["Treehouse building", { age: 18, dependency: "Secret base" }],
    ["Hideout design", { age: 18, dependency: "Secret base" }],
    ["Riddare", { age: 6 }],
    ["Slåss med pinnar", { age: 12, dependency: "Riddare" }],
    ["Prinsessa", { age: 6 }],
    ["Trollkarl", { age: 6 }],
    ["Drake", { age: 6 }],
    ["Polis", { age: 6 }],
    ["Uppfinnare", { age: 6 }],

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
