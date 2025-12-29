<script>
    let { data } = $props();
    
    const size = data.size || 300;
    const radius = (size / 2) - 10;
    const center = size / 2;
    const fontSize = 20;
    const perimeterFontSize = 11;
    const textOffset = 5; // Distance text sits from the circle line
    const textRadius = radius + textOffset;
</script>

<svg class="circle" width={size} height={size} style="transform: translate(-50%, -50%);">
    <circle
        r={radius}
        cx={center}
        cy={center}
        fill="transparent"
        stroke="black"
        stroke-width="1"
    />
    <text
        class="nodeText"
        text-anchor="middle"
        font-size={fontSize}
        fill="black"
        x={center}
        y={center + 5}
    >
        {data.label}
    </text>
    
    <!-- Text along the perimeter -->
    <defs>
        <path
            id="circlePath-{data.id}"
            d="M {center},{size / 2 - textRadius} A {textRadius},{textRadius} 0 1,1 {center - 0.01},{size / 2 - textRadius}"
        />
    </defs>
    <text class="perimeterText" fill="black" font-size={perimeterFontSize}>
        <textPath href="#circlePath-{data.id}" startOffset="20%" text-anchor="middle">
            {data.perimeterLabel || 'Label along perimeter'}
        </textPath>
    </text>
</svg>

<style>
    .circle {
        cursor: grab;
    }
    
    .nodeText {
        user-select: none;
        font-weight: bold;
    }
    
    .perimeterText {
        user-select: none;
        font-family: monospace;
    }
</style>
