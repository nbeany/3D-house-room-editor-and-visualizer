# Maison — 3D House Configurator

A premium, portfolio-grade 3D house configurator. Design a parametric home, pick real materials with live pricing, furnish it by drag-and-drop, measure it, walk through it in first person and export the result — all in the browser.

Built with **React 18 + TypeScript**, **Three.js / React Three Fiber**, **Zustand** and **Tailwind CSS**.

![stack](https://img.shields.io/badge/React-18-blue) ![stack](https://img.shields.io/badge/TypeScript-strict-blue) ![stack](https://img.shields.io/badge/Three.js-R3F-black) ![stack](https://img.shields.io/badge/Zustand-slices-orange) ![stack](https://img.shields.io/badge/Tailwind-3-38bdf8)

## Quick start

```bash
npm install
npm run dev      # → http://localhost:5173
npm run build    # type-check (tsc, strict) + production build
npm run preview  # serve the production build
```

No API keys, no downloaded assets — the entire scene (materials included) is procedural and works offline.

## Features

**Configurator**
- Parametric house: width, depth, 1–3 floors, floor height, rooms per floor (BSP-generated floor plan with doorways), flat/gable/hip roof, roof visibility toggle
- Material system: 6 wall, 5 floor, 4 roof finishes with procedural PBR textures and per-m² pricing
- Furniture: 14 procedural models, searchable/filterable catalog, **drag-and-drop onto the canvas** (or tap-to-add), drag to move with **0.25 m grid snapping** (Alt bypasses), rotate/scale/recolor/duplicate, snap-to-floor by construction
- Live stats: **total area · rooms · estimated cost · furniture count · selected material**
- **Measurement tool** with live preview and persistent labeled dimensions
- **Undo/redo** (60 steps, slider-drag coalescing) — `Ctrl+Z` / `Ctrl+Shift+Z`
- Auto-persistence to localStorage

**Camera & viewing**
- Smooth orbit / top / front presets (camera-controls), optional cinematic auto-rotate
- **First-person walkthrough**: WASD + mouse-look via pointer lock, run with Shift
- **Live minimap**: SVG plan generated from the *same* room-layout function as the 3D walls — house, rooms, clickable furniture dots, camera frustum arrow

**Rendering**
- Physical sky + Lightformer environment lighting (no HDRI downloads)
- Post-processing: **SSAO, bloom, depth of field, vignette** — individually toggleable, wrapped in an error boundary that degrades gracefully on exotic GPUs
- **Real-time planar reflections** on interior floors (MeshReflectorMaterial)
- 2048px soft shadows, ACES tone mapping

**Performance**
- `React.lazy` + Suspense: the three.js scene is **code-split** away from the UI shell (vendor chunks split further in `vite.config.ts`)
- **Instanced rendering** for vegetation (hundreds of trees/bushes/grass in ~4 draw calls)
- `PerformanceMonitor` auto-scales DPR under load; cheaper defaults on touch devices
- Memoized geometry with explicit GPU disposal (`useDisposable`), narrow Zustand selectors so UI state never re-renders the canvas
- **GLTF + Draco pipeline ready**: `components/three/GLTFModel.tsx` loads Draco-compressed GLBs with caching & preload (the demo itself ships zero binary assets; KTX2 texture support plugs into the same loader)

**Responsive & accessible**
- Three layouts: desktop (persistent sidebar + inspector), tablet (overlay drawer), mobile (bottom sheet + compact selection toolbar)
- Full keyboard control: camera presets, tool switching, nudge/rotate/duplicate/delete, help modal (`?`)
- ARIA roles/labels throughout, focus trap + focus restore in dialogs, visible focus rings
- **High-contrast mode** (auto-detects `prefers-contrast`), `prefers-reduced-motion` respected

**Export**
- **PNG** screenshot, **JSON** configuration (with validated re-import), **GLTF (.glb)** of the house + furniture

## Keyboard shortcuts

| Keys | Action |
| --- | --- |
| `1` / `2` / `3` / `F` | Orbit · Top · Front · Walkthrough |
| `W A S D` + `Shift` | Walk / run (first person) |
| `R` / `Shift+R` | Rotate selection ±15° |
| `←↑↓→` (+`Shift`) | Nudge selection 0.1 m (0.5 m) |
| `D` / `Del` | Duplicate / delete selection |
| `M` / `G` / `T` | Measure tool · grid · roof |
| `Ctrl+Z` / `Ctrl+Shift+Z` | Undo / redo |
| `?` / `Esc` | Shortcuts help · deselect/exit |

## Architecture

```
src/
├── components/
│   ├── layout/          # floating chrome: TopBar, Sidebar, Inspector, MiniMap, StatsBar…
│   ├── panels/          # sidebar tabs: Build, Materials, Furniture, Effects
│   ├── three/           # everything inside <Canvas>
│   │   ├── models/      # procedural furniture meshes
│   │   ├── House/Walls/Roof/Rooms   # parametric building
│   │   ├── CameraRig    # orbit presets + first-person controls
│   │   ├── Effects      # post-processing (error-bounded)
│   │   └── SceneBridge  # canvas↔DOM glue (exports, minimap, drops)
│   └── ui/              # design system: Button, Slider, Toggle, Tabs, Modal…
├── constants/           # material & furniture catalogs, shortcuts
├── hooks/               # shortcuts, media queries, theme, focus trap, disposal
├── store/               # Zustand slices: house, materials, furniture, camera, ui, history
├── types/               # shared domain types (all serializable)
└── utils/               # cost model, room BSP, export pipeline, procedural textures
```

Key decisions worth reading:

- **Single store, six slices** (`store/`): selection, drag state and undo history live beside the document but are never persisted. Mutating actions call `pushHistory()` *before* changing state; pushes within 400 ms coalesce so a slider drag is one undo step.
- **One source of truth for the floor plan** (`utils/rooms.ts`): the recursive BSP that builds the 3D interior walls also draws the minimap — they can't drift apart.
- **Procedural everything** (`utils/three/proceduralTextures.ts`): materials paint one square meter of grayscale detail into a cached CanvasTexture; geometry UVs are authored in meters so tiling is automatic at any wall size.
- **Canvas/DOM decoupling** (`SceneBridge`, `sceneRefs`): exports and the minimap read the renderer imperatively — UI interaction never re-renders the scene graph, and vice versa.

## Browser support

Evergreen browsers with WebGL2. First-person mode requires a pointer (hidden on touch). Screenshots, JSON and GLB exports are pure client-side downloads.
