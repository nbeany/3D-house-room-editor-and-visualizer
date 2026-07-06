# Project Overview

## Purpose
This project is a browser-based 3D house/room editor and visualizer. It provides tools to create, edit, and preview house layouts, place furniture, and adjust materials and lighting in an interactive 3D scene.

## Primary Uses
- Design and arrange rooms and furniture interactively
- Preview materials, lighting and effects in real time
- Export scenes or assets for further use
- Serve as a foundation for architectural visualization or interior-design tooling

## Tech Stack
- Framework: React + TypeScript
- Bundler / Dev server: Vite
- Styling: Tailwind CSS + PostCSS
- 3D: three.js, via React integration (e.g. `@react-three/fiber`, `@react-three/drei`)
- State management: Redux Toolkit (`store/slices`) for application state
- Build tooling: TypeScript, PostCSS, and Vite configuration files included

## Key Project Structure
- `src/` — Main source
  - `components/` — UI and layout components (TopBar, Sidebar, Inspector, etc.)
  - `components/three/` — 3D scene components (CameraRig, Lights, House, Rooms, Models)
  - `store/` — Redux slices and persistence
  - `utils/` — helpers (export, format, three helpers)
  - `constants/`, `hooks/`, `types/` — supporting code

## How to run (development)
1. Install dependencies

```bash
npm install
```

2. Start dev server

```bash
npm run dev
```

3. Open the local URL shown by Vite in your browser.

## Notes / Next steps
- Check `package.json` for exact dependency names and scripts.
- Consider adding screenshots, example exports, or a quick walkthrough in the main `README.md`.
