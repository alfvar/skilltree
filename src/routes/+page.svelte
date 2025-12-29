<script>
    import { SvelteFlow, Background } from "@xyflow/svelte";
    import "@xyflow/svelte/dist/style.css";
    import CircleNode from "$lib/components/CircleNode.svelte";

    const nodeTypes = {
        circle: CircleNode,
    };

    let nodes = $state.raw([
        {
            id: "1",
            position: { x: 0, y: 0 },
            data: { label: "Node 1" },
        },
        {
            id: "year3",
            type: "circle",
            position: { x: 0, y: 0 },
            data: {
                id: "year3",
                perimeterLabel: "3 år",
                size: 300
            },
        },
        {
            id: "year5",
            type: "circle",
            position: { x: 0, y: 0 },
            data: {
                id: "year5",
                perimeterLabel: "5 år",
                size: 800
            },
        },
        {
            id: "alpha",
            position: { x: 100, y: 400 },
            data: { label: "Default Node" },
        },
    ]);

    let edges = $state.raw([
        { id: "e1-circle", source: "1", target: "circle" },
        { id: "e-circle-alpha", source: "circle", target: "alpha" },
    ]);
</script>

<div style="width: 100vw; height: 100vh;">
    <SvelteFlow {nodes} {edges} {nodeTypes} fitView nodesDraggable={false}>
        <Background color="#888" />
    </SvelteFlow>
</div>

<!-- break points: 3 år, 7 år, 12 år, 16 år, 20 år, 35 år, 60 år -->

<style>
    :global(html),
    :global(body) {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
    }
</style>
