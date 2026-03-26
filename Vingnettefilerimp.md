# Vignette Filter Implementation Plan

## 1. Algorithm: Three-Zone Radial Vignette

**Zone Structure:**
```
[Inner Circle] → [Feather Ring] → [Outer Darkness]
   (Bright)        (Transition)       (Dark)
```

**Calculation per pixel:**
1. Calculate distance from `centerX/centerY`
2. **Inside innerRadius**: No effect (factor = 1.0)
3. **Between inner and feather radius**: Smooth falloff (1.0 → intensity)
4. **Between feather and outer radius**: Full vignette darkness (factor = 1 - intensity)
5. **Outside outer radius**: Constant darkness (or continue fading to black)

**Formula:**
```javascript
if (distance <= innerRadius) factor = 1.0;
else if (distance <= featherRadius) {
  const t = (distance - innerRadius) / (featherRadius - innerRadius);
  factor = 1.0 - (t * intensity);  // Smooth easing
} 
else if (distance <= outerRadius) {
  factor = 1.0 - intensity;  // Full vignette
}
else {
  factor = continueFading ? ... : (1.0 - intensity);
}
```

---

## 2. State Structure

```javascript
vignette: {
  enabled: boolean,
  centerX: number,         // In image pixel coordinates
  centerY: number,         // In image pixel coordinates
  innerRadius: number,     // Bright spot radius
  featherRadius: number,   // End of transition zone
  outerRadius: number,     // Full vignette applied
  intensity: number        // 0-1, darkness of edges
}
```

**Defaults:**
- `centerX/Y`: Image center
- `innerRadius`: Min(width, height) * 0.15
- `featherRadius`: Min(width, height) * 0.4
- `outerRadius`: Max(width, height) * 0.7
- `intensity`: 0.6 (60% darkness at edges)

---

## 3. Custom Filter Class

**File:** `frontend/src/utils/VignetteFilter.js`

**Properties:**
```javascript
type: 'Vignette'
centerX, centerY, innerRadius, featherRadius, outerRadius, intensity
```

**applyTo2d Algorithm:**
- Iterate pixels
- Calculate normalized distance from center
- Apply zone-based factor calculation
- Multiply R,G,B by factor (alpha unchanged)
- Early exit optimization for inner circle

---

## 4. Integration with `applyFabricFilter`

**Modify `applyFabricFilter(filterName, propName, value)` to support Vignette:**

```javascript
const applyFabricFilter = (filterName, propName, value) => {
  const canvas = fabricRef.current;
  const img = imgRef.current;
  if (!canvas || !img) return;

  // Handle Vignette specially (multiple properties)
  if (filterName === 'Vignette') {
    let filter = img.filters.find(f => f.type === 'Vignette');
    
    if (!filter) {
      filter = new fabric.filters.Vignette({
        centerX: value.centerX ?? img.width / 2,
        centerY: value.centerY ?? img.height / 2,
        innerRadius: value.innerRadius ?? Math.min(img.width, img.height) * 0.15,
        featherRadius: value.featherRadius ?? Math.min(img.width, img.height) * 0.4,
        outerRadius: value.outerRadius ?? Math.max(img.width, img.height) * 0.7,
        intensity: value.intensity ?? 0.6
      });
      img.filters.push(filter);
    } else {
      // Update specific property or bulk update
      Object.assign(filter, value);
    }
  } else {
    // Existing logic for Brightness, Contrast, etc.
    let filter = img.filters.find(f => f instanceof fabric.filters[filterName]);
    // ... existing code
  }
  
  img.applyFilters();
  canvas.requestRenderAll();
};
```

**State Effect Update:**
```javascript
useEffect(() => {
  if (!canvasRef.current || !imgRef.current) return;
  const states = imageStates[activeImage];
  if (!states?.vignette?.enabled) {
    // Remove vignette filter if disabled
    const img = imgRef.current;
    img.filters = img.filters.filter(f => f.type !== 'Vignette');
    img.applyFilters();
    canvasRef.current.requestRenderAll();
    return;
  }
  
  // Apply vignette with all properties
  applyFabricFilter('Vignette', null, states.vignette);
}, [imageStates, activeImage]);
```

---

## 5. Control Box (Draggable UI)

**Type:** `fabric.Circle` (represents the vignette effect area)

**Visual:**
- Center point draggable handle (small blue dot)
- Outer circle shows `outerRadius` (dashed line)
- Optional inner circle shows `innerRadius` (lighter dashed)
- Fill: radial gradient from transparent center to semi-transparent dark edge

**Behavior:**
- **Drag center**: Updates `centerX/Y` in state
- **Scale outer ring**: Updates `outerRadius` and proportionally scales `innerRadius` + `featherRadius`
- **Modifier key + Scale**: Only adjust outer radius (independent scaling)

**Event Flow:**
```
Control moved/scaled 
  → Calculate new radii/center in image coordinates
  → updateActiveImageState({ vignette: newValues })
  → useEffect triggered
  → applyFabricFilter updates filter
  → canvas renders
```

---

## 6. Intensity Control

The `intensity` property (0-1) controls edge darkness:
- `0`: No vignette effect (edges same brightness as center)
- `0.5`: Edges at 50% brightness
- `1.0`: Edges fully black

This is passed through `applyFabricFilter('Vignette', null, { intensity: 0.8 })`

---

## 7. Coordinate Conversion (Critical)

**Image Space vs Canvas Space:**
- Store all vignette params in **original image pixels** (not scaled canvas coords)
- Conversion functions needed:
  ```javascript
  canvasToImageSpace(x, y) → {x, y} in original image pixels
  imageToCanvasSpace(x, y) → {x, y} in canvas coordinates
  ```

**Why:** If user zooms image, the vignette stays correctly positioned on the image content, not the canvas.

---

## 8. File Structure & Implementation Order

```
frontend/src/
└── utils/
    └── VignetteFilter.js    # Custom filter class with 3-zone algorithm
```

**Canvas.jsx Changes:**
1. Import `VignetteFilter` and register with fabric
2. Add `toggleVignetteControl(isActive)` - creates draggable circle control
3. Add effect watching `visiblePanel === 'vignette'`
4. Add effect watching `imageStates[activeImage]?.vignette`
5. Modify `applyFabricFilter` to handle Vignette case
6. Add coordinate conversion utilities
