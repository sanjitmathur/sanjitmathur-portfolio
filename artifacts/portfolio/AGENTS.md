# Portfolio — Coding Standards & Architecture

> This file is the single source of truth for any AI editor (Claude, ChatGPT, Gemini, Copilot) working on this codebase. Read it fully before making any change.

---

## 1. Tech Stack

| Layer | Tool | Version |
|-------|------|---------|
| Framework | React | 19 |
| Language | TypeScript | strict |
| Build | Vite | 6+ |
| CSS | Tailwind CSS 4.1 + CSS variables + inline styles |
| 3D | React Three Fiber + Three.js + @react-three/drei |
| Animation | Framer Motion, GSAP (sparingly), CSS keyframes |
| Routing | Wouter (lightweight) |
| i18n | Custom `src/i18n.ts` (5 languages: en, hi, ar, de, es) |
| UI primitives | Radix UI (in `src/components/ui/`) |

---

## 2. Project Structure

```
src/
├── App.tsx                  # Root: ThemeProvider > LanguageProvider > AppInner
├── main.tsx                 # Entry point
├── index.css                # Global styles, CSS variables, keyframes, responsive rules
├── i18n.ts                  # All translatable strings (5 languages)
├── pages/
│   ├── Hero.tsx             # Landing section with 3D background
│   ├── Experience.tsx       # Work experience cards with widgets
│   ├── Projects.tsx         # Bento-grid project cards with widgets
│   ├── Skills.tsx           # Skill bars + domain cards + marquee
│   └── Contact.tsx          # Contact form
├── components/
│   ├── widgets/             # Interactive mini-apps inside cards (see §5)
│   ├── HeroScene.tsx        # R3F Canvas for hero 3D scene
│   ├── SkillOrbitScene.tsx  # R3F Canvas for skills 3D orbits
│   ├── Scene3D.tsx          # CSS-only parallax/floating elements
│   ├── Nav.tsx              # Sticky navigation
│   ├── Cursor.tsx           # Custom cursor (desktop only)
│   ├── Grain.tsx            # Film grain overlay
│   ├── Loader.tsx           # Page load animation
│   ├── ThemeContext.tsx      # Dark/light theme (localStorage)
│   ├── LanguageContext.tsx   # i18n context
│   ├── Mouse3DContext.tsx    # Mouse position for parallax
│   ├── useReveal.tsx        # IntersectionObserver reveal hooks
│   ├── useInView.ts         # Lazy-load trigger hook
│   └── ui/                  # Radix-based UI primitives (do not modify)
└── hooks/
    ├── use-mobile.tsx
    └── use-toast.ts
```

---

## 3. Design Tokens & Theming

All colors come from CSS variables defined in `src/index.css`:

```
--bg, --surface, --surface-2    # Background layers
--text, --text-secondary, --muted  # Typography
--border, --border-hover        # Borders
--accent, --accent-dim, --accent-border  # Accent colors
--font: 'Inter'                 # Body font
--font-display: 'Space Grotesk' # Headings
--max-w: 1140px                 # Content max-width
--section-px / --section-py     # Section padding (responsive clamp)
```

**Theme switching**: `data-theme="dark|light"` on `<html>`. Stored in `localStorage("sm-theme")`.

### Rules
- NEVER hardcode colors. Always use `var(--token)`.
- Exception: widget internals (e.g., Spotify's `#1db954`) can use brand colors.
- All theme-sensitive elements need `transition: background-color 0.35s ease, color 0.35s ease`.

---

## 4. Styling Approach

Priority order:
1. **Inline styles** — primary method for component-level styling
2. **CSS variables** — for theme-aware values
3. **CSS classes in index.css** — for animations, responsive overrides, shared patterns
4. **Tailwind utilities** — sparingly, mostly in ui/ components

### Key patterns
- Use `clamp()` for responsive sizing: `fontSize: "clamp(1.85rem, 4vw, 2.25rem)"`
- Section padding: `padding: "var(--section-py) var(--section-px)"`
- Content container: `maxWidth: "var(--max-w)", margin: "0 auto"`
- Cards: `background: "var(--surface)"`, `border: "1px solid var(--border)"`, `borderRadius: 14`

---

## 5. Widget Standards (Project & Experience Cards)

Widgets live in `src/components/widgets/`. Each is a self-contained React component displayed inside a card's top panel.

### Constraints
- **Container**: The widget receives `width: 100%`, `height: 100%` from its parent.
- **Parent height**: `clamp(170px, 30vw, 210–240px)` with `overflow: hidden` and `padding: clamp(8px, 2vw, 14px)`.
- **Mobile**: On screens ≤ 900px, the parent height is `clamp(170px, 30vw, ...)` — design for ~150px usable height.

### Template

```tsx
export default function MyWidget() {
  return (
    <div style={{
      width: "100%",
      height: "100%",
      background: "#0f0f0f",        // Dark bg, use brand color
      borderRadius: 12,
      padding: "14px 16px",
      display: "flex",
      flexDirection: "column",
      gap: 10,
      fontFamily: "var(--font)",
      overflow: "hidden",            // REQUIRED — prevent bleed
    }}>
      {/* Fixed-height sections: use flexShrink: 0 */}
      <div style={{ flexShrink: 0 }}>
        {/* Header / controls */}
      </div>

      {/* Flexible content area: use flex: 1, minHeight: 0, overflow: hidden */}
      <div style={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
        {/* Charts, bars, visualizations */}
      </div>

      {/* Fixed bottom controls: use flexShrink: 0 */}
      <div style={{ flexShrink: 0 }}>
        {/* Buttons, toggles */}
      </div>
    </div>
  );
}
```

### Critical rules
1. **Always set `flexShrink: 0`** on headers and control bars — they must never collapse.
2. **Always set `flex: 1, minHeight: 0, overflow: hidden`** on the main content area — it absorbs height changes.
3. **Use `requestAnimationFrame`** for high-frequency animations (bars, particles), not React state.
4. **Font sizes**: 0.5–0.82rem range. Keep text compact.
5. **Touch handling**: Add `touchAction: "manipulation"` and `WebkitTapHighlightColor: "transparent"` on interactive elements.
6. **No external dependencies** — widgets must be self-contained (no new npm packages).

### Existing widgets
| Widget | Location | Accent |
|--------|----------|--------|
| FraudWidget | Anomaly detection dashboard | `#f59e0b` |
| ForecastWidget | Demand forecasting charts | `#6366f1` |
| ExamForgeWidget | AI exam generation | `#d5b572` |
| OrvynWidget | Prosthetics/signal processing | `#d5b572` |
| F1Widget | Monte Carlo race simulation | `#ef4444` |
| SpotifyWidget | Music player with frequency bars | `#1db954` |
| MedAirWidget | Drone / flight control | `#22c55e` |
| BarakaWidget | Financial platform (experience) | `#d5b572` |
| IndiGoWidget | Airline ML model (experience) | `#c4934a` |
| LabWidget | Backend/API work (experience) | `#b8895a` |

---

## 6. 3D Scene Standards (React Three Fiber)

### When to use 3D
- Background ambiance (hero, skills) — not primary content.
- Must have a **WebGL fallback** (CSS-only alternative).
- Must be **lazy-loaded** via `useInView` hook (don't render off-screen).

### Canvas settings

```tsx
<Canvas
  camera={{ position: [0, 0, 8], fov: 60 }}
  dpr={[1, 1.5]}            // Never exceed 1.5 — performance
  gl={{ antialias: true, powerPreference: "high-performance" }}
  style={{ position: "absolute", inset: 0 }}
>
  <Suspense fallback={null}>
    {/* Scene contents */}
  </Suspense>
</Canvas>
```

### Rules
1. **Color palette**: Gold/fawn `#d5b572` for primary meshes. Muted for secondary.
2. **Particle count**: 300–600 max. Use `Points` + `PointMaterial` from drei.
3. **Materials**: Prefer `MeshStandardMaterial` or `MeshDistortMaterial`. High metalness (0.8–0.9), low roughness (0.05–0.15).
4. **Animation**: Use `useFrame` for per-frame updates. Keep delta-based for framerate independence.
5. **Mouse interaction**: Use `Mouse3DContext` for parallax. Lerp factor ~0.05 for smooth follow.
6. **Mobile**: Disable pointer events on canvas (`canvas { pointer-events: none !important; }` already in CSS).
7. **Geometry**: Wireframes for subtle elements (`wireframe: true`). Solid for focal objects.
8. **Float**: Wrap focal meshes in `<Float speed={1.2} floatIntensity={0.5}>` for gentle hover.

### Replacing procedural scenes with .glb models
When swapping a procedural Three.js scene for a Sketchfab .glb model:
1. Place the `.glb` file in `public/models/`.
2. Use `useGLTF` from `@react-three/drei` to load it.
3. Match the existing camera position and fov.
4. Keep the same color grading (gold/fawn tones).
5. Add the WebGL fallback check (`checkWebGL()` pattern from HeroScene.tsx).

---

## 7. Reveal & Scroll Animations

### CSS classes (defined in index.css)
| Class | Effect |
|-------|--------|
| `fade-up` | Translate Y + opacity → visible |
| `r3d` | Same as fade-up |
| `r3d-left` | Slide from left |
| `r3d-right` | Slide from right |
| `r3d-scale` | Scale up from 0.95 |
| `r3d-flip` | RotateX entrance |

All get `.in` class added by IntersectionObserver to trigger.

### Usage
```tsx
// Single element
const ref = useReveal();
<div ref={ref} className="fade-up">...</div>

// Multiple children with stagger
const sectionRef = useRef<HTMLElement>(null);
useRevealChildren(sectionRef, ".fade-up");
<section ref={sectionRef}>
  <div className="fade-up">Child 1</div>
  <div className="fade-up">Child 2</div>
</section>
```

### Mobile override
On `max-width: 900px`, `translateY` is disabled (only opacity fades). On `pointer: coarse`, all CSS `animation-duration` is set to `0s` except `.marquee-track`.

---

## 8. Mobile / Responsive Rules

### Breakpoints
- `900px` — bento grid collapses to single column, experience grid stacks
- `768px` — nav hamburger, skills grid single column

### Critical CSS (index.css)
```css
@media (max-width: 900px) {
  /* Bento grids → single column, max-width: 480px, centered */
  /* No hover transforms on project cards */
  /* Canvas pointer-events disabled */
}

@media (pointer: coarse) {
  /* All CSS animation-duration: 0s (except .marquee-track) */
  /* This does NOT affect requestAnimationFrame-based animations */
}
```

### Rules for mobile-safe code
1. **Never rely on hover** for essential UI — it doesn't exist on touch.
2. **Widgets must fit ~150px usable height** on mobile.
3. **Use `flexShrink: 0`** on fixed UI elements (buttons, headers) inside flex columns.
4. **Test `overflow: hidden`** — content that grows (bars, charts) can push siblings off-screen.
5. **Touch events**: Use `touchAction: "manipulation"` on buttons. Don't rely on `:hover`.
6. **Font sizes**: Use `clamp()` for responsive text, minimum 0.5rem.

---

## 9. Internationalization (i18n)

All user-visible strings live in `src/i18n.ts`. The file exports a `translations` object keyed by language code.

### Adding new translatable content
1. Add the key to the TypeScript type at the top of `i18n.ts`.
2. Add translations for all 5 languages: `en`, `hi`, `ar`, `de`, `es`.
3. Access via `const { t } = useLang()` in the component.

### RTL support
Arabic (`ar`) uses `dir: "rtl"`. Ensure layouts don't break with reversed flow.

---

## 10. Adding a New Project

1. **Create widget**: `src/components/widgets/NewWidget.tsx` following §5 template.
2. **Add to projectMeta** in `src/pages/Projects.tsx`:
   ```tsx
   { id: "newproject", year: "2025", tags: [...], link: "https://github.com/...", accent: "#hex", span: "col-medium", Widget: NewWidget }
   ```
3. **Add translations** in `src/i18n.ts` under `projects.newproject` for all 5 languages.
4. **Place in bento grid**: Add a `<div className="bento-cell-medium">` in the appropriate row.
5. **Test on mobile**: Verify the widget doesn't overflow at 170px container height.

### Bento cell sizes
| Class | Desktop min-height |
|-------|-------------------|
| `bento-cell-large` | 500px |
| `bento-cell-medium` | 440px |
| `bento-cell-tall` | 500px |

On mobile (≤ 900px), all cells collapse to `height: auto`.

---

## 11. Adding a New Experience

1. **Create widget**: `src/components/widgets/NewCoWidget.tsx` following §5 template.
2. **Add to jobMeta** in `src/pages/Experience.tsx`.
3. **Add translations** in `src/i18n.ts` under `experience.newjob` for all 5 languages.

---

## 12. Performance Checklist

- [ ] No new npm packages unless absolutely necessary
- [ ] 3D scenes lazy-loaded with `useInView`
- [ ] Widget animations use `requestAnimationFrame`, not React re-renders
- [ ] Images use responsive sizing with `clamp()`
- [ ] No layout shifts on mobile (test with Chrome DevTools throttling)
- [ ] `contain: layout paint` on widget containers
- [ ] Bundle size stays reasonable (check `vite build` output)

---

## 13. Do NOT

- Modify files in `src/components/ui/` (Radix primitives, auto-generated).
- Add new CSS frameworks or utility libraries.
- Use `!important` in inline styles.
- Add `console.log` in production code.
- Use `useEffect` for animations that run every frame — use `requestAnimationFrame` or `useFrame` (R3F).
- Break the existing theme system by hardcoding light/dark colors.
- Remove the `checkWebGL()` fallback pattern from 3D scenes.
- Skip mobile testing — every change must work at 375px width.
