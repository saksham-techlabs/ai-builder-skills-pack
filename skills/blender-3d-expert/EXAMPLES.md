# Blender 3D Expert examples

These are illustrative inputs and expected procedures, not fabricated audit results or claims that a project was tested. Populate evidence only after inspecting the real project.

## Example 1 — Web product viewer asset

### Input

> Optimize my Blender product model for a Three.js viewer.

### Expected behavior

1. Inspect the actual scene, viewer and target devices before selecting a budget.
2. Preserve the source and identify whether geometry, draw calls or texture memory dominates.
3. Prepare an export copy, export GLB with available tools and test material/scale/animation behavior in the viewer.

### Expected output structure

Scene/access inventory → measured budget → source/export changes → actual export/viewer results → pending checks.

### Boundary

Do not guarantee frame rate from a triangle count or assume a Blender MCP server is connected.

## Example 2 — No Blender tools available

### Input

> Create a modular room kit in my Blender scene.

### Expected behavior

1. Check tool availability; if absent, request a scene inventory and provide a user-run plan.
2. Specify dimensions, names, origins, snapping rules and non-destructive construction steps.
3. Provide verification steps for seams, scale, materials and export, labeled as not executed.

### Expected output structure

Capability limitation → required scene context → dimensioned module plan → exact user procedure → unverified checks.

### Boundary

Do not claim to have created objects or saved a .blend file when no Blender operation ran.

