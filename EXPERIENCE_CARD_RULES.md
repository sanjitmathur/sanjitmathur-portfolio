# Experience Cards Architecture & Design System Rules

> **CRITICAL INSTRUCTION FOR ASSISTANT**:
> Whenever the user says **"follow the card rule files"** (or asks to create a new experience card, refactor existing cards, or update experience content), you MUST unconditionally read and strictly adhere to every rule, token, formula, and pattern defined in this document.

---

## 1. Core Principles & Golden Rules of Consistency

1. **Strict Typography Parity Across ALL Cards**:
   - The company heading (`h2`), role title, tag pills, section label (`KEY CONTRIBUTIONS`), bullet point text, and timeline pill must share identical font families, sizes, line heights, and weights across every card (IndiGo, Baraka, Publicis, and any future cards).
   - Under no circumstances should one card have a smaller or larger heading or bullet font size than another.
2. **Scroll-Driven Video Frame Sequence (No `<video>` Elements)**:
   - Video content **must never** be rendered using a standard `<video>` HTML element. Native video scrub/seek has high latency, causes browser decoder stutter, and drops frames during scroll.
   - All videos **must be extracted into sequential `.webp` image frames** (80–120 frames) stored in `public/<id>-frames/frame_###.webp`.
   - The widget canvas binds scroll progress `0.00 -> 1.00` directly to frame index `0 -> (TOTAL_FRAMES - 1)` via an inertial lerp render loop.
3. **Seamless Middle Transition (Zero Hard Seams)**:
   - The left-side dynamic widget (3D WebGL / HTML5 Video Canvas) must dissolve seamlessly into the `#050505` background across the middle of the card (between 38% and 74% of the container width).
   - **Zero vertical cuts, zero visible canvas borders, zero opaque rect seams**.
   - For video/canvas widgets, this must be achieved using an **offscreen canvas with `globalCompositeOperation = "destination-out"`** fading alpha to `0.0`, combined with the multi-layer CSS background plate and `::after` gradient overlay.
4. **Highlighted Active Bullet Box**:
   - The active bullet must always be enclosed inside a dedicated translucent highlight card box (`background: rgba(255, 255, 255, 0.04)`, `border: 1px solid rgba(255, 255, 255, 0.08)`, `borderRadius: 8px`).
   - Active bullet text is bright white (`#ffffff`, weight 500). Inactive bullet text is muted (`#9e9e9e`, weight 400).
   - The active bullet must feature an active slice progress underline bar (`height: 2.5px`, `background: linear-gradient(90deg, ${job.accent}, #eab308)`).
5. **Horizontal Scroll Nav Meter Bar**:
   - Every card must feature the horizontal scroll progress meter bar located immediately below the tags (`height: 3px`, `borderRadius: 100px`, `width: 100%`, inner bar width proportional to `progress * 100%`).
6. **Interactive Click-To-Scroll Navigation**:
   - Clicking any bullet box must smoothly scroll the viewport to that exact bullet's active time slice.
7. **Contained Timeline Pill**:
   - The timeline pill (`period · loc`, e.g., `Aug – Sep 2025 · Gurgaon, India`) must always remain 100% inside the card on all viewports without wrapping outside or clipping.
   - The title row must use `flexWrap: "wrap"` with `gap: "0.45rem 0.75rem"` and `.text-stage` must have `max-width: clamp(610px, 55vw, 665px)`.
8. **Clean Section Headers (No Percentages / No 3D Labels)**:
   - The header above the bullets must ONLY display the clean uppercase label `KEY CONTRIBUTIONS`.
   - **Never** render `"3D SYNC"` or percentage text labels (e.g., `3D SYNC · 45%`).

---

## 2. Video-to-Frames Extraction & Scroll Animation Synchronization Pipeline

### Why Video Frames Instead of `<video>`?
Browser `<video>` elements cannot perform smooth bi-directional frame scrubbing on scroll because hardware video decoders only keyframe-seek and produce stutter, blank frames, and severe frame latency. Extracting the video into sequential WebP frames ensures **60fps instantaneous response in both forward and backward scroll**.

### Step A: Frame Extraction Specifications
When adding a new experience card with video:
1. **Target Directory**: `artifacts/portfolio/public/<id>-frames/`
2. **File Format**: `frame_000.webp` to `frame_{N-1:03d}.webp` (e.g. `frame_000.webp` to `frame_079.webp`)
3. **Total Frame Count**: 80 to 120 frames (80 frames gives optimal visual smoothness and tiny download footprint ~2-3MB total).
4. **Resolution**: `960x540` or `1280x720` (16:9 or native video aspect ratio).
5. **Quality**: WebP quality `78`–`82` (crisp visuals, no compression artifacts).

### Python Extraction Script Template (`scripts/extract_<name>_frames.py`):
```python
import cv2
import os

def extract_frames(
    video_path="source_video.mp4",
    output_dir="artifacts/portfolio/public/<id>-frames",
    target_width=960,
    target_height=540,
    total_frames=80,
    quality=80
):
    os.makedirs(output_dir, exist_ok=True)
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        raise RuntimeError(f"Could not open video file {video_path}")
    
    total_video_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    print(f"Video opened: {total_video_frames} source frames -> extracting {total_frames} webp frames")

    for i in range(total_frames):
        frame_idx = int(round(i * (total_video_frames - 1) / (total_frames - 1)))
        cap.set(cv2.CAP_PROP_POS_FRAMES, frame_idx)
        ret, frame = cap.read()
        if not ret:
            print(f"Warning: Failed to read frame {frame_idx}")
            continue

        resized = cv2.resize(frame, (target_width, target_height), interpolation=cv2.INTER_AREA)
        out_path = os.path.join(output_dir, f"frame_{i:03d}.webp")
        cv2.imwrite(out_path, resized, [cv2.IMWRITE_WEBP_QUALITY, quality])

    cap.release()
    print(f"Successfully extracted {total_frames} frames into {output_dir}")

if __name__ == "__main__":
    extract_frames()
```

### Step B: Progressive Loading & Fallback Logic in Widget Component
In the widget React component (`src/components/widgets/<Name>Widget.tsx`):
1. **Instant Frame 0 Load**: Load `frame_000.webp` first so the canvas paints immediately on page load without waiting for other frames.
2. **Background Preload**: Preload frames `1` through `TOTAL_FRAMES - 1` in an async loop.
3. **Neighbor Fallback**: If the user scrolls rapidly before all frames finish downloading, search nearest loaded neighbor frames `d = 1 ... N` so the canvas never flickers or goes black:
   ```ts
   let img = imagesRef.current[frameIdx];
   if (!img) {
     for (let d = 1; d < TOTAL_FRAMES; d++) {
       if (frameIdx - d >= 0 && imagesRef.current[frameIdx - d]) {
         img = imagesRef.current[frameIdx - d];
         break;
       }
       if (frameIdx + d < TOTAL_FRAMES && imagesRef.current[frameIdx + d]) {
         img = imagesRef.current[frameIdx + d];
         break;
       }
     }
   }
   ```

### Step C: Scroll-to-Frame Synchronization & Lerp Inertia
Bind scroll progress to frame index inside `requestAnimationFrame`:
```ts
const loop = () => {
  const target = targetProgressRef.current;
  const isNavJump = (window as any).__isNavJump;

  // Snap instantly on click-nav jumps (> 25% delta), otherwise lerp smoothly
  if (isNavJump || Math.abs(target - currentProgressRef.current) > 0.25) {
    currentProgressRef.current = target;
  } else {
    currentProgressRef.current += (target - currentProgressRef.current) * 0.16;
    if (Math.abs(target - currentProgressRef.current) < 0.001) {
      currentProgressRef.current = target;
    }
  }

  const frameIdx = Math.min(
    TOTAL_FRAMES - 1,
    Math.max(0, Math.floor(currentProgressRef.current * (TOTAL_FRAMES - 1)))
  );

  // Redraw only when the frame changes (eliminates redundant CPU/GPU paint calls)
  if (frameIdx !== lastDrawnFrameRef.current) {
    drawFrame(frameIdx);
  }

  animRef.current = requestAnimationFrame(loop);
};
```

---

## 3. DOM Hierarchy & Layer Architecture

Every experience showcase card is an open-stage pinned section (`--stage-h: 480px`, `background: #050505`, `borderRadius: 14px`) structured with 4 distinct layers:

```html
<div id="exp-<id>" className="<name>-pinned-container">
  <div className="<name>-sticky-stage fade-up">
    <!-- Layer 1: Colored Ambient Background Plate -->
    <div className="<name>-bg-plate" aria-hidden="true">
      <!-- Layer 2: Canvas Widget (Positioned Left, Alpha Faded on Right) -->
      <div className="<name>-bg-widget">
        <<WidgetComponent> progress={progress} />
      </div>
    </div>

    <!-- Layer 3 & 4: Foreground Content & Text Stage -->
    <div className="<name>-content-stage">
      <div className="<name>-text-stage">
        <!-- 4.1 Tagline Header (Accent Dot + Type · Number) -->
        <!-- 4.2 Title Row (Company h2 + Timeline Pill) -->
        <!-- 4.3 Role Title -->
        <!-- 4.4 Tag Pills -->
        <!-- 4.5 Horizontal Scroll Progress Meter Bar -->
        <!-- 4.6 Section Label (KEY CONTRIBUTIONS) -->
        <!-- 4.7 Synchronized Bullet List with Highlighted Active Box -->
      </div>
    </div>
  </div>
</div>
```

---

## 4. CSS Tokens & Stylesheet Rules (`index.css`)

```css
/* ============================================================
   EXPERIENCE PINNED STAGE SHOWCASE RULES
   ============================================================ */

/* 1. Pinned Scroll Track */
.<name>-pinned-container {
  position: relative;
  height: 220vh;
  margin-bottom: 2.5rem;
}

/* 2. Sticky Stage Container */
.<name>-sticky-stage {
  --stage-h: 480px;
  position: sticky;
  top: max(68px, calc(50vh + 28px - (var(--stage-h) / 2)));
  z-index: 10;
  width: 100%;
  height: var(--stage-h);
  min-height: var(--stage-h);
  max-height: var(--stage-h);
  box-sizing: border-box;
  display: flex;
  align-items: center;
  background: #050505;
  border-radius: 14px;
  overflow: hidden;
}

/* 3. Ambient Background Plate (Customized by Accent Color) */
.<name>-bg-plate {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
  z-index: 1;
}

/* Examples of verified ambient color schemes:
   - Baraka (Gold):
     background: radial-gradient(ellipse 60% 70% at 20% 50%, rgba(213, 181, 114, 0.4) 0%, rgba(180, 130, 45, 0.2) 45%, transparent 75%),
                 linear-gradient(to right, #4a330e 0%, #422c0b 25%, #322006 42%, #1a1003 56%, #050505 74%, #050505 100%);
   - IndiGo (Bronze/Gold):
     background: radial-gradient(ellipse 60% 70% at 20% 50%, rgba(196, 147, 74, 0.35) 0%, rgba(150, 100, 30, 0.18) 45%, transparent 75%),
                 linear-gradient(to right, #38240a 0%, #2e1d08 25%, #221505 42%, #120b02 56%, #050505 74%, #050505 100%);
   - Publicis (Violet/Indigo):
     background: radial-gradient(ellipse 60% 70% at 20% 50%, rgba(99, 102, 241, 0.35) 0%, rgba(79, 70, 229, 0.18) 45%, transparent 75%),
                 linear-gradient(to right, #1c2254 0%, #161b42 25%, #101330 42%, #090b1c 56%, #050505 74%, #050505 100%);
*/

/* 4. Full-stage Left Widget Placement */
.<name>-bg-widget {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

/* 5. Middle Vignette Dissolve Overlay (Ensures Smooth Rightward Fade) */
.<name>-bg-plate::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 2;
  background-image: linear-gradient(
    to right,
    transparent 0%,
    transparent 40%,
    rgba(5, 5, 5, 0.4) 52%,
    rgba(5, 5, 5, 0.88) 64%,
    #050505 74%,
    #050505 100%
  );
}

/* 6. Foreground Content Stage */
.<name>-content-stage {
  position: relative;
  z-index: 3;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 1.25rem 1.75rem 1.25rem 0;
}

/* 7. Text Stage Container (Prevents Overflow & Balances Alignment) */
.<name>-text-stage {
  position: relative;
  width: 100%;
  max-width: clamp(610px, 55vw, 665px);
  margin-left: auto;
}

/* 8. Mobile Responsiveness (max-width: 900px) */
@media (max-width: 900px) {
  .<name>-pinned-container {
    height: 180vh;
    margin-bottom: 2rem;
  }
  .<name>-sticky-stage {
    top: 60px;
    display: block;
    min-height: auto;
    border-radius: 12px;
  }
  .<name>-bg-plate {
    position: relative;
    inset: auto;
    width: 100%;
    height: 240px;
    margin-bottom: 8px;
  }
  .<name>-bg-plate::after {
    background-image: linear-gradient(to bottom, transparent 0%, transparent 65%, #050505 100%);
  }
  .<name>-content-stage {
    justify-content: center;
    padding: 0 0.5rem 1.5rem;
  }
  .<name>-text-stage {
    max-width: 100%;
    margin-left: 0;
  }
}
```

---

## 5. Widget Canvas Alpha Transition Pipeline

To eliminate any visual seam between the canvas and the background:

1. **Clear Main Canvas**:
   ```ts
   ctx.clearRect(0, 0, w, h);
   ```
   Do NOT fill the canvas with solid `#050505` if the background plate has an ambient gradient glow, as doing so cuts the gradient.
2. **Offscreen Canvas Processing (`offCtx`)**:
   - Draw raw video/render frame to offscreen canvas.
   - Apply color tinting using `globalCompositeOperation = "color"`.
   - Apply neon ambient glow using `globalCompositeOperation = "screen"`.
3. **Smooth Alpha Dissolve (`destination-out`)**:
   On desktop viewports, erase the right 35%–38% of the video canvas so it dissolves to `0.0` alpha:
   ```ts
   if (!isMobile) {
     offCtx.save();
     offCtx.globalCompositeOperation = "destination-out";
     const fadeW = Math.round(renderW * 0.38);
     const fadeStart = renderW - fadeW;
     const maskG = offCtx.createLinearGradient(fadeStart, 0, renderW, 0);
     maskG.addColorStop(0, "rgba(0, 0, 0, 0)");
     maskG.addColorStop(0.35, "rgba(0, 0, 0, 0.25)");
     maskG.addColorStop(0.7, "rgba(0, 0, 0, 0.75)");
     maskG.addColorStop(1, "rgba(0, 0, 0, 1)");
     offCtx.fillStyle = maskG;
     offCtx.fillRect(fadeStart, 0, fadeW, renderH);
     offCtx.restore();
   }
   ```
4. **Composite to Main Canvas**:
   ```ts
   ctx.drawImage(offCanvas, offsetX, offsetY);
   ```

---

## 6. Typography & UI Specification Tokens

All experience cards must strictly use these inline style tokens:

### A. Tagline Header
```tsx
<div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
  <span style={{ width: 6, height: 6, borderRadius: "50%", background: job.accent }} />
  <span style={{
    fontSize: "0.62rem",
    color: job.accent,
    fontWeight: 700,
    letterSpacing: "0.09em",
    textTransform: "uppercase",
  }}>
    {type} · {job.n}
  </span>
</div>
```

### B. Company Heading (`h2`) & Contained Timeline Pill
```tsx
<div style={{
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexWrap: "wrap",
  gap: "0.45rem 0.75rem",
  marginBottom: 2,
}}>
  <h2 style={{
    fontSize: "clamp(1.75rem, 2.4vw, 2.25rem)",
    fontWeight: 700,
    fontFamily: "var(--font-display, sans-serif)",
    letterSpacing: "-0.02em",
    color: "#ffffff",
    lineHeight: 1.15,
    margin: 0,
    whiteSpace: "nowrap",
  }}>
    {job.co}
  </h2>

  {/* Timeline Pill */}
  <div style={{
    display: "inline-flex",
    alignItems: "center",
    gap: "0.4rem",
    fontSize: "0.71rem",
    color: "var(--muted)",
    background: "rgba(255, 255, 255, 0.04)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    padding: "0.2rem 0.55rem",
    borderRadius: "100px",
    fontWeight: 500,
    whiteSpace: "nowrap",
    flexShrink: 0,
  }}>
    <span style={{
      width: 6,
      height: 6,
      borderRadius: "50%",
      background: job.accent,
      boxShadow: `0 0 6px ${job.accent}`,
    }} />
    <span style={{ color: "#d1d5db" }}>{job.period}</span>
    <span style={{ color: "rgba(255, 255, 255, 0.25)" }}>·</span>
    <span style={{ color: "var(--muted)", fontSize: "0.68rem" }}>{job.loc}</span>
  </div>
</div>
```

### C. Role Title
```tsx
<div style={{
  fontSize: "clamp(0.88rem, 1.1vw, 0.98rem)",
  color: "#b8b7b7",
  fontWeight: 500,
  marginTop: 3,
  marginBottom: 6,
}}>
  {role}
</div>
```

### D. Tag Pills
```tsx
<div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
  {job.tags.map((t) => (
    <span
      key={t}
      style={{
        fontSize: "0.68rem",
        padding: "0.18rem 0.55rem",
        borderRadius: "6px",
        background: "rgba(255, 255, 255, 0.05)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        color: "#b0b0b0",
        fontWeight: 500,
        letterSpacing: "0.01em",
      }}
    >
      {t}
    </span>
  ))}
</div>
```

### E. Horizontal Scroll Progress Meter Bar
```tsx
<div style={{
  margin: "12px 0 10px 0",
  background: "rgba(255, 255, 255, 0.05)",
  borderRadius: "100px",
  height: 3,
  width: "100%",
  overflow: "hidden",
}}>
  <div style={{
    height: "100%",
    width: `${Math.round(progress * 100)}%`,
    background: `linear-gradient(90deg, ${job.accent}, #eab308)`,
    boxShadow: `0 0 10px ${job.accent}`,
    transition: "width 0.06s linear",
  }} />
</div>
```

### F. Section Label
```tsx
<div style={{
  fontSize: "0.66rem",
  fontWeight: 700,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: "#8e8e8e",
  marginBottom: 8,
}}>
  {keyContrib}
</div>
```
*(Clean label only — NO percentage indicators, NO 3D text labels).*

### G. Synchronized Bullets with Highlighted Active Box
```tsx
<div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
  {bullets.map((b, i) => {
    const isActive = activeIdx === i;
    const isPast = activeIdx > i;
    const sliceCount = bullets.length;
    const sliceStart = i / sliceCount;
    const sliceProgress = Math.max(0, Math.min(1, (progress - sliceStart) / (1 / sliceCount)));

    return (
      <div
        key={i}
        onClick={() => scrollToBullet(i)}
        style={{
          display: "flex",
          gap: "0.85rem",
          alignItems: "flex-start",
          padding: "0.5rem 0.75rem",
          borderRadius: "8px",
          background: isActive ? "rgba(255, 255, 255, 0.04)" : "transparent",
          border: isActive ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid transparent",
          cursor: "pointer",
          transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
          position: "relative",
        }}
      >
        {/* Node Dot Indicator */}
        <div style={{
          width: 7,
          height: 7,
          borderRadius: "50%",
          background: isActive
            ? job.accent
            : isPast
            ? `${job.accent}a6`
            : "rgba(255, 255, 255, 0.22)",
          boxShadow: isActive ? `0 0 10px ${job.accent}, 0 0 18px ${job.accent}8c` : "none",
          marginTop: "0.4rem",
          flexShrink: 0,
          transition: "all 0.25s ease",
        }} />

        {/* Bullet Text */}
        <div style={{ flex: 1 }}>
          <p style={{
            margin: 0,
            fontSize: "clamp(0.85rem, 1.0vw, 0.94rem)",
            lineHeight: 1.55,
            color: isActive ? "#ffffff" : "#9e9e9e",
            fontWeight: isActive ? 500 : 400,
            transition: "color 0.2s ease",
          }}>
            {b}
          </p>

          {/* Underline Progress Bar for Active Bullet */}
          {isActive && (
            <div style={{
              marginTop: 6,
              width: "100%",
              maxWidth: 220,
              height: 2.5,
              background: "rgba(255, 255, 255, 0.08)",
              borderRadius: 2,
              overflow: "hidden",
            }}>
              <div style={{
                width: `${sliceProgress * 100}%`,
                height: "100%",
                background: `linear-gradient(90deg, ${job.accent}, #eab308)`,
                boxShadow: `0 0 8px ${job.accent}`,
                transition: "width 0.05s linear",
              }} />
            </div>
          )}
        </div>
      </div>
    );
  })}
</div>
```

---

## 7. Scroll Mathematics & Slicing Logic

```ts
// 1. Calculate overall progress (0.00 to 1.00)
const rect = container.getBoundingClientRect();
const stickyTop = parseFloat(window.getComputedStyle(sticky).top) || (window.innerHeight / 2 - 240);
const scrollable = container.offsetHeight - sticky.offsetHeight;

if (scrollable <= 0) {
  setProgress(0);
  return;
}

const currentScroll = stickyTop - rect.top;
const p = Math.max(0, Math.min(1, currentScroll / scrollable));
setProgress(p);

// 2. Derive active slice
const sliceCount = bullets.length || 3;
const activeIdx = Math.min(sliceCount - 1, Math.floor(progress * sliceCount));
const sliceProgress = Math.max(0, Math.min(1, (progress - activeIdx / sliceCount) * sliceCount));

// 3. Smooth Click-To-Scroll formula
const scrollToBullet = (idx: number) => {
  const targetP = (idx + 0.5) / sliceCount;
  const targetY = window.scrollY + rect.top - stickyTop + targetP * scrollable;
  window.scrollTo({ top: targetY, behavior: "smooth" });
};
```

---

## 8. Pre-Flight Checklist for New or Modified Cards

Before declaring any card work complete, verify every item:

- [ ] **Video Broken Into Frames**: Source video is extracted to `public/<id>-frames/frame_###.webp` (80–120 WebP frames at quality 78–82).
- [ ] **Frame 0 Instant Load**: `frame_000.webp` is loaded first, rest preloaded in background with neighbor fallback.
- [ ] **Scroll-to-Frame Sync**: Canvas lerps current progress to frame index smoothly in `requestAnimationFrame`.
- [ ] **Exact Heading Parity**: `h2` uses `fontSize: "clamp(1.75rem, 2.4vw, 2.25rem)"`, `lineHeight: 1.15`, `fontFamily: "var(--font-display, sans-serif)"`.
- [ ] **Contained Timeline**: Timeline pill does not clip or wrap outside the card on narrow or desktop screens.
- [ ] **Zero Hard Canvas Seams**: Video/3D widget fades smoothly into `#050505` across 38%–74% via offscreen `destination-out`.
- [ ] **Active Bullet Highlight Box**: Active bullet is enclosed in `background: rgba(255, 255, 255, 0.04)` with `1px solid rgba(255, 255, 255, 0.08)`.
- [ ] **Horizontal Scroll Meter**: Progress bar right beneath tags reflects current scroll progress (`0%` to `100%`).
- [ ] **Click-To-Scroll Functional**: Clicking any bullet scrolls directly to that slice.
- [ ] **No Percentage / 3D Labels**: Only the clean uppercase `KEY CONTRIBUTIONS` label is present.
- [ ] **Clean Production Build**: `npm run build` succeeds with 0 errors.
