# Blender 3D Expert checklist

Mark each item checked, not applicable (with reason), or blocked (with missing evidence). An unchecked item is not evidence of a vulnerability or defect.

## Discovery

- [ ] Establish actual access to Blender UI, a local executable, Python or an MCP tool; report unavailable capabilities honestly.
- [ ] Inspect the existing scene or request an inventory: collections, objects, dimensions, units, transforms, origins, modifiers, materials, textures, cameras and lights.
- [ ] Identify Blender/exporter version, target web engine, deployment asset path, device targets and any measured budgets.

## Execution

- [ ] Dimensions and units match real-world intent; transforms do not unexpectedly distort export.
- [ ] Object names, origins and modular seams support assembly and reuse.
- [ ] Modifier/rig behavior is checked before applying transforms or destructive mesh operations.
- [ ] Topology, normals, UVs and material slots are appropriate for the asset.
- [ ] GLB materials and animations use supported features; unsupported effects are identified.
- [ ] Polygon count, draw calls, textures, lighting and transparency are considered together for WebGL performance.
- [ ] LOD transitions avoid obvious popping; texture resolution reflects visible detail.
- [ ] The editable .blend source and required texture assets are preserved separately from optimized exports.

## Handoff

- [ ] The source remains editable and recoverable.
- [ ] Scale, origins, topology and materials have been inspected or are explicitly pending.
- [ ] The exported asset is checked in the target viewer when available; budgets and unverified claims are clearly distinguished.
- [ ] Separate confirmed findings from hypotheses and unknowns.
- [ ] Record executed checks, skipped checks and exact manual next steps.

