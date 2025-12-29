<script>
    import { SvelteFlow, Background, SvelteFlowProvider } from "@xyflow/svelte";
    import "@xyflow/svelte/dist/style.css";
    import CircleNode from "$lib/components/CircleNode.svelte";
    import PieSliceNode from "$lib/components/PieSliceNode.svelte";
    import CameraController from "$lib/components/CameraController.svelte";
    import { backgroundNodes } from "$lib/backgroundNodes";
    import { renderSkillNodes } from "$lib/renderSkillNodes";
    import { getRingSegmentCenter } from "$lib/utils/coordinateUtils";
    import { getAllNodeData } from "$lib/skillStore";

    const nodeTypes = {
        circle: CircleNode,
        pieSlice: PieSliceNode,
    };

    let currentDependency = $state(undefined);
    
    // Calculate initial viewport to center (0,0) on screen
    let viewport = $state({
        x: typeof window !== 'undefined' ? window.innerWidth / 2 : 960,
        y: typeof window !== 'undefined' ? window.innerHeight / 2 : 540,
        zoom: 2
    });

    $effect(() => {
        console.log("currentDependency:", currentDependency);
    });

    let nodes = $derived.by(() => [
        ...renderSkillNodes(currentDependency, { start: 0, end: 360 }),
        ...backgroundNodes,
    ]);

    // Calculate camera target position when nodes change
    let cameraTarget = $derived.by(() => {
        if (currentDependency === undefined) return null;
        
        const skillNodes = renderSkillNodes(currentDependency, { start: 0, end: 360 });
        // Get only the new child nodes (nodes whose dependency is currentDependency)
        const newNodes = skillNodes.filter(n => n.data.label && 
            renderSkillNodes(currentDependency, { start: 0, end: 360 })
                .some(node => node.id !== currentDependency && node.data.innerRadius > 0)
        );
        
        // Find nodes that are children of currentDependency
        const childNodes = skillNodes.filter(n => {
            // Check if this node's parent is currentDependency by looking at the store
            const allData = Array.from(getAllNodeData());
            const nodeData = allData.find(([key]) => key === n.id);
            return nodeData && nodeData[1].dependency === currentDependency;
        });
        
        if (childNodes.length === 0) return null;
        
        // Calculate average center of all child nodes
        let sumX = 0;
        let sumY = 0;
        
        childNodes.forEach(node => {
            const center = getRingSegmentCenter(
                node.data.innerRadius,
                node.data.outerRadius,
                node.data.startAngle,
                node.data.endAngle
            );
            sumX += center.x;
            sumY += center.y;
        });
        
        return {
            x: sumX / childNodes.length,
            y: sumY / childNodes.length
        };
    });

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
        <CameraController targetCenter={cameraTarget} />
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
