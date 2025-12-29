<script>
    import { SvelteFlow, Background } from "@xyflow/svelte";
    import "@xyflow/svelte/dist/style.css";
    import CircleNode from "$lib/components/CircleNode.svelte";
    import PieSliceNode from "$lib/components/PieSliceNode.svelte";
    import { backgroundNodes } from "$lib/backgroundNodes";
    import { renderSkillNodes } from "$lib/renderSkillNodes";

    const nodeTypes = {
        circle: CircleNode,
        pieSlice: PieSliceNode,
    };

    let currentDependency = $state(undefined);
    let parentAngleRange = $state({ start: 0, end: 360 });
    
    // Center viewport on (0,0)
    let viewport = $state({ 
        x: typeof window !== 'undefined' ? window.innerWidth / 2 : 500, 
        y: typeof window !== 'undefined' ? window.innerHeight / 2 : 400, 
        zoom: 2
    });

    $effect(() => {
        console.log("currentDependency:", currentDependency);
    });

    let nodes = $derived.by(() => [
        ...backgroundNodes, 
        ...renderSkillNodes(currentDependency, parentAngleRange)
    ]);

    let edges = $state.raw([
        { id: "e1-circle", source: "1", target: "circle" },
        { id: "e-circle-alpha", source: "circle", target: "alpha" },
    ]);

    function handleNodeClick(event) {
        console.log("Node clicked:", event);
        const node = event.node;
        // Only update dependency if it's a skill node (not a background circle)
        if (node && node.type === "pieSlice") {
            currentDependency = node.id;
            // Store the clicked node's angle range for its children
            parentAngleRange = { 
                start: node.data.startAngle, 
                end: node.data.endAngle 
            };
        }
    }

</script>

<div style="width: 100vw; height: 100vh;">
    <SvelteFlow
        {nodes}
        {edges}
        {nodeTypes}
        nodesDraggable={false}
        {viewport}
        onnodeclick={handleNodeClick}
    >
        <Background color="#888" />
    </SvelteFlow>
</div>

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
