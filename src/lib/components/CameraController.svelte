<script>
    import { useSvelteFlow } from "@xyflow/svelte";
    import { untrack } from "svelte";
    import { CAMERA_TRANSITION_DURATION_MS } from "$lib/utils/coordinateUtils";

    let { targetCenter } = $props();

    const { setCenter, getViewport } = useSvelteFlow();

    $effect(() => {
        if (targetCenter) {
            untrack(() => {
                const currentZoom = getViewport().zoom;
                setCenter(targetCenter.x, targetCenter.y, { 
                    zoom: currentZoom, 
                    duration: CAMERA_TRANSITION_DURATION_MS 
                });
            });
        }
    });
</script>
