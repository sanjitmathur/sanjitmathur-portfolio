# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Structure

```text
artifacts-monorepo/
├── artifacts/              # Deployable applications
│   ├── api-server/         # Express API server
│   ├── mockup-sandbox/     # Component preview server
│   └── portfolio/          # Sanjit Mathur's portfolio website
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts (single workspace package)
│   └── src/                # Individual .ts scripts
├── pnpm-workspace.yaml     # pnpm workspace
├── tsconfig.base.json      # Shared TS options
├── tsconfig.json           # Root TS project references
└── package.json            # Root package with hoisted devDeps
```

## Portfolio (artifacts/portfolio)

Award-worthy 3D cinematic portfolio for Sanjit Mathur. Built with React + Vite.

### Design System
- **Color palette**: Soft Fawn (#c4a882) + Carbon Black (#0f0e0d) + Ivory Mist (#f0ebe3)
- **Fonts**: Playfair Display (serif/italic headings) + Space Grotesk (body) + Space Mono (mono accents)

### Features
- **Cinematic loader**: Progress bar + counter animation, ~2.2s
- **Custom cursor**: Dot + lagging ring, scales on hover over clickable elements
- **3D background**: React Three Fiber with floating rings, icosahedron, and star field (gracefully degrades to CSS fallback)
- **Parallax effects**: Sections shift at different speeds on scroll
- **Entrance reveals**: Every section element animates in via IntersectionObserver
- **Micro-interactions**: Card tilt, link underline animation, work item left-border reveal
- **Navigation**: Transparent → frosted on scroll, side dot nav
- **Sections**: Hero, Experience (Baraka, IndiGo, Lab of Future), Projects (5 projects), Skills + Stats, Contact

### Key Components
- `src/components/Cursor.tsx` — custom cursor with magnetic effect
- `src/components/Loader.tsx` — cinematic progress loader
- `src/components/Scene3D.tsx` — Three.js 3D scene with WebGL fallback
- `src/components/Nav.tsx` — sticky nav with section tracking
- `src/components/useReveal.tsx` — IntersectionObserver reveal hooks
- `src/components/ParallaxSection.tsx` — scroll parallax wrapper
- `src/pages/Hero.tsx` — hero with 3D background
- `src/pages/Experience.tsx` — work timeline
- `src/pages/Projects.tsx` — project cards grid
- `src/pages/Skills.tsx` — skill groups + stats
- `src/pages/Contact.tsx` — contact links + CTA

### Packages added
- `@react-three/fiber` — React renderer for Three.js
- `@react-three/drei` — Three.js helpers (Points, PointMaterial)
- `three` + `@types/three` — 3D engine
