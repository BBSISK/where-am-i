# ADR-001: Selection of Spatial Indexing System (Uber H3 vs Geohash vs S2 vs Rectangular Grid)

## Status
**Accepted** (Sprint 1)

## Context
"Where Am I?" partitions Ireland into discrete spatial units of approximately 1 km² to aggregate cultural heritage, archaeological monuments, placename etymology, and folklore. As a user travels by car or bicycle at varying velocities, the engine must:
1. Map arbitrary continuous GPS coordinates `(lat, lng)` to a discrete spatial ID with minimal computational latency ($O(1)$).
2. Uniformly determine adjacent neighbor cells for route corridor lookahead and pre-fetching.
3. Avoid spatial distortion and cell area variance across the island of Ireland (~51.4°N to ~55.4°N).

## Options Considered

### Option 1: Rectangular Equirectangular / Bounding Box Grid (e.g. 0.01° lat/lng)
* **Pros**: Simple arithmetic; human-readable coordinate boundaries.
* **Cons**:
  * Severe spatial distortion: Longitude degrees shrink significantly towards northern latitudes ($L = \cos(\text{latitude}) \times 111.32\text{ km}$). A 0.01° box in Cork has a different area than one in Donegal.
  * Neighbor asymmetry: Diagonal neighbors have corner singularities ($\sqrt{2} \times$ distance vs orthogonal neighbors), creating dead zones for heading detection.

### Option 2: Geohash (Base32 Morton Z-order curve)
* **Pros**: Hierarchical string prefix representation; widely supported in NoSQL databases.
* **Cons**:
  * Rectangular cells suffer from edge discontinuities and aspect-ratio skew (cells are tall and narrow at high latitudes).
  * Neighbor lookups are irregular along Z-order boundary lines.

### Option 3: Google S2 Geometry (Quadtree on Cube Projections)
* **Pros**: Minimal distortion; excellent spherical math.
* **Cons**: Square cells have 4 edge neighbors and 4 corner neighbors with different distances; corridor buffer computations require complex polygon clipping.

### Option 4: Uber H3 (Discrete Global Grid System - Hexagonal) — *Chosen*
* **Pros**:
  * **Hexagonal Equidistance**: Every hexagon has exactly 6 neighbors at identical centroid-to-centroid distances ($\Delta d$), eliminating diagonal bias.
  * **$O(1)$ Bitwise Math**: Coordinate conversion uses bit-shifting on a 64-bit unsigned integer without trigonometric polygon intersection routines.
  * **Granularity Control**: **Resolution 8** provides an average cell area of **0.737 km²** (edge length ~461m), perfectly matching our ~1 km target resolution for vehicular road speeds (50–100 km/h = 13.8–27.7 m/s, spending ~30–70 seconds per cell).
  * **Simple K-Ring Corridor Expansion**: `h3.gridDisk(h3Index, 2)` gives an exact ring buffer for route ahead caching.

## Decision
We select **Uber H3 at Resolution 8** as the foundational spatial indexing system for the "Where Am I?" platform.

## Consequences
* **Positive**: Microsecond coordinate-to-cell resolution, trivial neighbor corridor expansion, and clean visual representation on maps.
* **Negative**: Requires loading the `h3-js` library (lightweight WASM/pure-JS build) and converting hexagon vertex GeoJSON for client-side rendering.
