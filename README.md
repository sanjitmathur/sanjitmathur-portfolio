# Sanjit Mathur — Portfolio

Personal portfolio website showcasing my work as an AI Engineer & Full-Stack Developer.

**Live:** [sanjitmathur.github.io/sanjitmathur-portfolio](https://sanjitmathur.github.io/sanjitmathur-portfolio/)

## Tech Stack

- **Framework:** React + TypeScript
- **Build:** Vite
- **Styling:** Tailwind CSS
- **3D:** Three.js / React Three Fiber (with WebGL fallback)
- **Smooth Scroll:** Lenis
- **Deploy:** GitHub Pages via Actions

## Sections

- **Hero** — 3D particle scene with interactive camera rig
- **Experience** — Work history and roles
- **Projects** — Featured project cards with details
- **Skills** — Orbital 3D visualization of technical skills
- **Contact** — Get in touch

## Features

- Dark/light theme toggle with persistence
- Custom animated cursor (desktop) with automatic touch-device detection
- Film grain overlay and parallax scroll effects
- Responsive across all devices
- WebGL detection with graceful CSS fallback

## Getting Started

```bash
cd artifacts/portfolio
npm install
npm run dev
```

## Build & Deploy

Pushing to `main` triggers the GitHub Actions workflow which builds and deploys to GitHub Pages automatically.

To build locally:

```bash
cd artifacts/portfolio
npm run build
npm run serve
```
