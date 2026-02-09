# Dhanu Tech Assistant Bee (Binary-Free Model)

- Primary file: `assets/dhanu-tech-assistant-bee.json`
- Format: JSON mesh bundle (`mesh-json-v1`) for maximum deployment compatibility
- Goal: avoid "binary files not supported" deployment errors
- Poly budget: low-to-mid (~8k triangles)
- Includes: body, stripes, eyes, wings, antennae meshes + color channels
- Animation metadata: `hover_loop` with wing flap + subtle body bob

Generator:
- `python3 scripts/generate_bee_glb.py`
- (Script name retained for backward compatibility, but it now outputs JSON.)

Preview locally:
- Start server from repo root: `python3 -m http.server 4173`
- Open: `http://127.0.0.1:4173/bee-model-viewer.html`
- Preview is dependency-free and does not need external CDN or binary parsing libs.
