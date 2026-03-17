# Portfolio Design Overhaul — Spec

**Date:** 2026-03-17
**Direction:** Bold creative + engineering DNA ("Award-agency meets technical showpiece")

---

## 1. Color System

### 1.1 Base Palette (warm → cool shift)

| Token | Value | Purpose |
|-------|-------|---------|
| `--bg-deep` | `#08080C` | Page background |
| `--bg-surface` | `#111118` | Cards, containers |
| `--bg-elevated` | `#1A1A24` | Hover states, raised surfaces |
| `--bg-raised` | `#22222E` | Floating elements, active cards |
| `--bg-overlay` | `rgba(8,8,12,0.85)` | Mobile menu, modals |
| `--accent-warm` | `#E8E4F0` | Primary text highlight color |
| `--accent-gold` | `#A8A3B8` | Secondary accent (silver-lavender) |
| `--text-primary` | `#EAEAF0` | Headings, body text |
| `--text-secondary` | `#8888A0` | Descriptions, secondary copy |
| `--text-muted` | `#55556A` | Labels, hints, timestamps |
| `--cool-neutral` | `#C7DDE5` | Kept as-is for contact status dot |
| `--border` | `rgba(180,180,220,0.08)` | Card/section borders |
| `--border-hover` | `rgba(180,180,220,0.18)` | Hover state borders |

### 1.2 Theme accent intensity scale

Generated via `color-mix()` from each project's `--theme-accent`:

```css
--theme-accent-5:  color-mix(in srgb, var(--theme-accent) 5%, var(--bg-deep));
--theme-accent-10: color-mix(in srgb, var(--theme-accent) 10%, var(--bg-deep));
--theme-accent-20: color-mix(in srgb, var(--theme-accent) 20%, var(--bg-deep));
--theme-accent-50: color-mix(in srgb, var(--theme-accent) 50%, var(--bg-deep));
```

Used for: tinted card backgrounds on hover, subtle glow box-shadows, section accent backgrounds. Replaces all hardcoded `rgba(...)` theme values.

### 1.3 Per-project theme colors (unchanged)

- F1: `#00D2BE` (Mercedes teal)
- ORVYN: `#00E5A0` (neural green)
- ExamForge: `#7C6AFF` (AI purple)
- Spotify: `#1DB954` (Spotify green)
- MedAir: `#38BDF8` (sky blue)

### 1.4 Selection/scrollbar/grain updates

- `::selection` background changes to `var(--theme-accent)` on project pages, falls back to `--accent-rose` on homepage.
- Scrollbar track: `--bg-deep`. Thumb: `--bg-elevated`.
- Grain overlay stays, opacity stays at 0.03.

---

## 2. Typography

### 2.1 Font stack (no changes to font families)

- Display: Clash Display
- Body: Inter
- Mono: JetBrains Mono

### 2.2 Base sizing

- Body font-size: 16px (up from 15px)
- Line-height: 1.7 (unchanged)

### 2.3 Homepage hero treatment

- `SANJIT`: Clash Display 800, current sizing
- `MATHUR`: Clash Display 200 (ultra-thin), `-webkit-text-stroke: 1.5px var(--accent-gold)`, color transparent. The weight drop from 800→200 creates dramatic contrast.

### 2.4 Section watermark numbers

The section numbers (`01`, `02`, etc.) render as a large watermark behind section titles:
- Font: Clash Display 800
- Size: `clamp(5rem, 10vw, 8rem)`
- Color: `var(--text-muted)` at 6% opacity
- Position: absolute, behind section title, offset left
- Visible only on desktop (hidden ≤768px)

### 2.5 Per-project typography personality

Applied via theme CSS files. No new fonts loaded.

**F1:**
- `.proj-hero-title`: letter-spacing `-0.02em`, text-transform uppercase
- `.tech-card-name`, `.timeline-date`: font-variant-numeric: tabular-nums
- `.case-label`: tighter letter-spacing (1.5px vs default 2.5px)

**ORVYN:**
- `.inspiration-text`, `.process-step-desc`: font-family switches to JetBrains Mono at 0.82rem, line-height 1.85. Gives body text a firmware feel.
- Inline tech terms (`sEMG`, `PCA9685`, etc.) auto-styled if wrapped in `<code>`: background `--theme-accent-5`, color `--theme-accent`, border-radius 3px, padding 0.1em 0.4em.

**ExamForge:**
- `.proj-hero-title em`, `.inspiration-quote blockquote`: font-weight 300, font-style italic. Academic emphasis.
- `.case-title`: font-weight 500 (lighter than default 600). Calmer, more scholarly.

**Spotify:**
- `.proj-hero-type`, `.case-label`: text-transform lowercase, letter-spacing 3px. Breaks the uppercase convention — feels casual/musical.
- `.proj-hero-title`: letter-spacing 0.03em (looser, more breathing room).
- Line-height on body text: 1.85 (more open).

**MedAir:**
- `.tech-card-component`: format as `COMPONENT: VALUE` in monospace. Clinical data readout style.
- `.proj-hero-subtitle`: font-weight 400, slightly tighter line-height (1.6). Precise.

### 2.6 Text scramble effect

A JS function `scrambleText(element, finalText, duration)`:
- On trigger, each character cycles through `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*` at ~30ms intervals
- Characters resolve left-to-right with stagger (~40ms per character)
- Total duration: 0.6-0.8s depending on text length
- Trigger: once on page load for hero titles (homepage + project pages)
- Trigger: once on scroll-enter for contact section "something" word

Implementation: Pure JS, no library. Add to a new file `js/text-scramble.js`.

---

## 3. Layout & Spatial Design

### 3.1 Homepage hero

- `.hero-name-line` for `SANJIT`: add `margin-right: -5vw` so text bleeds past the `.wrap` container on the right. Overflow visible on the hero section.
- `.hero-card`: shift to `position: relative; top: -2rem;` so it overlaps the name area slightly from below.
- `.hero-grid`: change from `1fr 380px` to `1fr 400px`.

### 3.2 Homepage projects — featured first card

- First `.preview-card` gets class `.preview-card--featured`:
  - `grid-column: 1 / -1` (full width)
  - Internal layout: `grid-template-columns: auto 1fr auto` but horizontal with larger padding, bigger title font (1.8rem vs 1.4rem), and a left border `3px solid var(--theme-accent)` using ORVYN's green (or whichever project is first).
- Remaining 4 cards: `grid-template-columns: 1fr 1fr` as before.
- On hover, each card's background tints with its project's theme color at 5% — achieved by inline `style="--card-accent: #00E5A0"` on each card and CSS `background: var(--card-accent-5, transparent)` on hover.

### 3.3 Experience timeline stagger

- Timeline cards get `transform: translateY(var(--stagger))` where `--stagger` alternates: `0`, `1.5rem`, `0`, `1rem`. Applied via `nth-child`.
- First timeline item (most recent role): scale to 105% with `font-size` bumps on role title (+0.15rem).

### 3.4 Section diagonal dividers

Between major homepage sections, a pseudo-element `::after` on `.section`:
```css
.section::after {
  content: '';
  position: absolute;
  bottom: 0; left: 5%; right: 5%;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--theme-accent-10, var(--border)) 50%, transparent);
  transform: rotate(-1.5deg);
}
```
Subtle — barely noticeable consciously but breaks the pure horizontal rhythm.

### 3.5 Project page — inspiration quote overlap

- `.inspiration-quote`: `margin-left: -40px` to overlap into the text column's gutter.
- Add a `::before` pseudo-element with `content: '"'`, font-size `8rem`, Clash Display, color `var(--theme-accent)` at 5% opacity, positioned behind the quote. Decorative oversized quotation mark.

### 3.6 Project page — tech grid featured first card

- First `.tech-card`: `grid-column: span 2`. Wider, more prominent.
- Remaining cards fill naturally in the 3-column grid.

---

## 4. Micro-interactions

### 4.1 Refined defaults

**Card hover — themed glow:**
```css
.preview-card:hover {
  border-color: var(--theme-accent-20);
  box-shadow: 0 8px 40px var(--theme-accent-5);
  transform: perspective(1000px) rotateX(var(--tiltX)) rotateY(var(--tiltY)) scale(1.02);
}
```

**Button magnetic pull:**
Extend the existing magnetic nav logic in `shared.js` to also apply to `.btn` elements. When cursor is within 60px, button translates toward cursor by `distance * 0.15`. On mouseleave, spring back.

**Nav underline center-out:**
```css
.nav-links a::after {
  left: 50%; right: 50%; /* start centered, zero width */
}
.nav-links a:hover::after {
  left: 0; right: 0; /* expand outward from center */
}
```
This is actually already the current behavior. Confirmed — no change needed.

**Contact arrow spring:**
Replace the linear `translateX(6px)` on `.contact-link:hover .arrow` and `.proj-ext-link:hover .arrow` with a GSAP spring-like overshoot:
```css
transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
transform: translateX(8px);
```
The `1.56` overshoot creates a spring bounce.

**Section label number pulse:**
On scroll-enter (via GSAP ScrollTrigger), the `.num` span gets a brief color flash:
```js
gsap.fromTo(numEl, { color: 'var(--theme-accent)' }, { color: 'var(--text-muted)', duration: 0.8 });
```
Pulses with accent color then settles back to muted. One-shot.

### 4.2 Theatrical moments

**4.2.1 Text scramble** — See Section 2.6.

**4.2.2 Cursor theme trail:**

In `shared.js`, on project pages (`body[data-project]`):
- Cursor ring border-color becomes `var(--theme-accent)` at 30% opacity.
- Track mouse velocity. When velocity > 400px/s, spawn small dots (4px circles) at cursor position. Max 3 active dots. Each fades out over 0.4s. Color: `var(--theme-accent)`.
- Implementation: small pool of 3 DOM elements, recycled. No canvas needed.

**4.2.3 Card-to-fullscreen page transition:**

When clicking a `.preview-card` on the homepage:
1. Card's `getBoundingClientRect()` captured
2. A clone/overlay is created at that position
3. GSAP animates it to fill the viewport (`position: fixed, inset: 0`) over 0.5s with `ease: power3.inOut`
4. Background color of the overlay matches the project's theme accent at 10%
5. At animation end, `window.location.href` fires
6. Implementation: in `home.js`, replaces the existing page-exit logic.

**4.2.4 Scroll-velocity 3D response:**

In `three-scene.js`, expose a `scrollVelocity` value calculated as delta of `window.scrollY` between frames. Pass to each scene's onFrame callback. Each scene uses it:
- F1: car tilts forward more when scrolling fast
- ORVYN: fingers curl speed multiplied by velocity
- Spotify: vinyl spin rate multiplied by velocity
- ExamForge: paper scatter/organize speed scales with velocity
- MedAir: drone banking angle increases with velocity
- Capped at a max multiplier of 2.5x to prevent chaos.

**4.2.5 Counter animation:**

The `2027` graduation year and any large mono number in the about section:
- On scroll-enter, `gsap.from(el, { textContent: 2000, duration: 0.6, snap: { textContent: 1 } })`
- Counts up rapidly from 2000 to 2027
- One-shot, not reversible

### 4.3 Animated border on current role

The first `.timeline-card` (most recent experience) gets a rotating gradient border:

```css
.timeline-card--current {
  border: 2px solid transparent;
  background-origin: border-box;
  background-clip: padding-box, border-box;
  background-image:
    linear-gradient(var(--bg-surface), var(--bg-surface)),
    conic-gradient(from var(--border-angle), var(--theme-accent), transparent 40%, var(--theme-accent));
}
@property --border-angle {
  syntax: '<angle>';
  initial-value: 0deg;
  inherits: false;
}
@keyframes rotateBorder {
  to { --border-angle: 360deg; }
}
.timeline-card--current {
  animation: rotateBorder 6s linear infinite;
}
```
Slow, elegant rotation. Signals "this is my current position" without a badge.

---

## 5. Component Details

### 5.1 Stack section chip shimmer

Each `.stack-col-title` gets a gradient underline that slowly shimmers:
```css
.stack-col-title::after {
  content: '';
  display: block;
  height: 2px;
  margin-top: 0.5rem;
  background: linear-gradient(90deg, transparent, var(--theme-accent, var(--accent-warm)) 50%, transparent);
  background-size: 200% 100%;
  animation: shimmer 3s ease-in-out infinite;
}
@keyframes shimmer {
  0%, 100% { background-position: -100% 0; }
  50% { background-position: 100% 0; }
}
```

### 5.2 Contact section word scramble

The word "something" in "Let's build *something* together." gets wrapped in a `<span id="contactScramble">`. On scroll-enter, it scrambles through: `"cool" → "wild" → "real" → "great" → "something"`. Each word holds for ~200ms before scrambling to the next. Total: ~2s. One-shot.

### 5.3 Footer gradient top border

```css
.site-footer {
  border-top: 1px solid transparent;
  border-image: linear-gradient(90deg, transparent, var(--theme-accent, var(--border)) 50%, transparent) 1;
}
```

---

## 6. Performance & Mobile

### 6.1 Mobile (≤1024px or pointer: coarse)

- Three.js scenes: already skip-loaded. No changes.
- Text scramble: still runs (lightweight, no DOM pressure).
- Cursor trail: disabled (cursor hidden on mobile already).
- Card-to-fullscreen transition: falls back to simple opacity fade.
- Scroll-velocity 3D: N/A (no 3D on mobile).
- Counter animation: still runs.
- Animated border: still runs (CSS-only, no perf impact).
- Diagonal dividers: angle reduced to 0.5deg on mobile.
- Grid-breaking bleeds: disabled. Hero text stays within container. Quote overlap removed.

### 6.2 Performance budget

- No new font files loaded.
- No new libraries. All new interactions are vanilla JS + GSAP (already loaded).
- Cursor trail: 3 pooled DOM elements, recycled. No GC pressure.
- Text scramble: `requestAnimationFrame` based, self-terminates.
- `@property` for border animation: GPU-composited, no layout thrash.

---

## 7. Files to Create

| File | Purpose |
|------|---------|
| `js/text-scramble.js` | Text scramble decode effect |
| `js/cursor-trail.js` | Themed cursor trail on project pages |

## 8. Files to Modify

| File | Changes |
|------|---------|
| `css/shared.css` | New color tokens, border/selection updates, `@property` for animated border, shimmer keyframe |
| `css/home.css` | Hero bleed, featured card, timeline stagger, section dividers, watermark numbers, counter target |
| `css/project.css` | Quote overlap, tech grid span, themed selection |
| `css/three.css` | Update gradient fallback colors to match new cool palette |
| `css/themes/*.css` | Per-project typography personality rules + accent scale |
| `js/shared.js` | Magnetic button pull, cursor theme color on project pages, cursor trail init |
| `js/home.js` | Card-to-fullscreen transition, counter animation, text scramble trigger |
| `js/project.js` | Text scramble trigger, word scramble for contact |
| `js/gsap-animations.js` | Section label number pulse, scroll-velocity passthrough |
| `js/three-scene.js` | Expose scrollVelocity in onFrame callback |
| `js/scenes/*.js` | Consume scrollVelocity for responsive 3D |
| `index.html` | Featured card class, watermark number markup, `--stagger` vars on timeline, `--card-accent` inline vars, contact scramble span |
| `projects/*.html` | No structural HTML changes needed (CSS handles type personality) |
