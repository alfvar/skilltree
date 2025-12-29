<script>
    let { data } = $props();
    
    const size = data.size || 300;
    const outerRadius = (data.outerRadius || size / 2) - 10;
    const innerRadius = data.innerRadius || 0;
    const center = size / 2;
    const startAngle = data.startAngle || 0;
    const endAngle = data.endAngle || 0;
    const fontSize = 12;
    
    // Convert angles to radians
    const startRad = (startAngle - 90) * Math.PI / 180;
    const endRad = (endAngle - 90) * Math.PI / 180;
    
    // Calculate outer arc points
    const x1Outer = center + outerRadius * Math.cos(startRad);
    const y1Outer = center + outerRadius * Math.sin(startRad);
    const x2Outer = center + outerRadius * Math.cos(endRad);
    const y2Outer = center + outerRadius * Math.sin(endRad);
    
    // Calculate inner arc points
    const x1Inner = center + innerRadius * Math.cos(startRad);
    const y1Inner = center + innerRadius * Math.sin(startRad);
    const x2Inner = center + innerRadius * Math.cos(endRad);
    const y2Inner = center + innerRadius * Math.sin(endRad);
    
    const largeArc = (endAngle - startAngle) > 180 ? 1 : 0;
    
    // Create donut segment path
    const pathData = innerRadius > 0
        ? `M ${x1Outer} ${y1Outer} A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x2Outer} ${y2Outer} L ${x2Inner} ${y2Inner} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x1Inner} ${y1Inner} Z`
        : `M ${center} ${center} L ${x1Outer} ${y1Outer} A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x2Outer} ${y2Outer} Z`;
    
    // Calculate text position (middle of the arc and radius)
    const midAngle = (startAngle + endAngle) / 2;
    const midRad = (midAngle - 90) * Math.PI / 180;
    const textRadius = (outerRadius + innerRadius) / 2;
    const textX = center + textRadius * Math.cos(midRad);
    const textY = center + textRadius * Math.sin(midRad);
</script>

<svg class="pie-slice" width={size} height={size} style="transform: translate(-50%, -50%); pointer-events: none;">
    <path
        d={pathData}
        fill="lightblue"
        stroke="black"
        stroke-width="2"
        style="pointer-events: auto;"
    />
    <text
        class="sliceText"
        text-anchor="middle"
        dominant-baseline="middle"
        font-size={fontSize}
        fill="black"
        x={textX}
        y={textY}
    >
        {data.label}
    </text>
</svg>

<style>
    .pie-slice {
        cursor: pointer;
    }
    
    .sliceText {
        user-select: none;
        font-weight: bold;
        pointer-events: none;
    }
</style>
