import React, { useEffect, useRef, useState } from "react";

const TOTAL_FRAMES = 120;
const FRAME_PATH = "/airplane-frames/frame_";

export default function ExperienceTransition() {
  const containerRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const textTrackRef = useRef<HTMLDivElement>(null);

  // Loaded images cache
  const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES).fill(null));
  const [initialFrameLoaded, setInitialFrameLoaded] = useState(false);

  // Progressive frame loader
  useEffect(() => {
    let isMounted = true;

    // 1. Immediately load frame 0 for instant render
    const img0 = new Image();
    img0.src = `${FRAME_PATH}000.webp`;
    img0.onload = () => {
      if (!isMounted) return;
      imagesRef.current[0] = img0;
      setInitialFrameLoaded(true);
    };

    // 2. Preload remainder of frames progressively
    for (let i = 1; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      const padded = i.toString().padStart(3, "0");
      img.src = `${FRAME_PATH}${padded}.webp`;
      img.onload = () => {
        if (!isMounted) return;
        imagesRef.current[i] = img;
      };
    }

    return () => {
      isMounted = false;
    };
  }, []);

  // Main scroll and canvas render loop
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let targetProgress = 0;
    let currentProgress = 0;
    let lastDrawnFrame = -1;

    // Handle high-DPI canvas sizing
    const resizeCanvas = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      lastDrawnFrame = -1; // force redraw
    };

    // Draw active frame to canvas with aspect-ratio cover
    const drawFrame = (frameIdx: number) => {
      if (!canvas || !ctx) return;

      // Find best available frame
      let img = imagesRef.current[frameIdx];
      if (!img) {
        // Fallback to nearest loaded frame
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

      const w = canvas.width;
      const h = canvas.height;

      // Fill deep stage black
      ctx.fillStyle = "#050505";
      ctx.fillRect(0, 0, w, h);

      if (img && img.complete && img.naturalWidth > 0) {
        const imgW = img.naturalWidth;
        const imgH = img.naturalHeight;
        const imgRatio = imgW / imgH;
        const canvasRatio = w / h;

        let renderW: number;
        let renderH: number;
        let offsetX: number;
        let offsetY: number;

        if (canvasRatio > imgRatio) {
          renderW = w;
          renderH = w / imgRatio;
          offsetX = 0;
          offsetY = (h - renderH) / 2;
        } else {
          renderH = h;
          renderW = h * imgRatio;
          offsetX = (w - renderW) / 2;
          offsetY = 0;
        }

        ctx.drawImage(img, offsetX, offsetY, renderW, renderH);
        lastDrawnFrame = frameIdx;
      }
    };

    // Calculate scroll progress within pinned container
    const handleScroll = () => {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const totalScroll = container.offsetHeight - window.innerHeight;
      if (totalScroll <= 0) return;

      const progress = -rect.top / totalScroll;
      targetProgress = Math.max(0, Math.min(1, progress));
    };

    // Lerp render loop for buttery smooth animation
    const renderLoop = () => {
      // Smooth dampening factor
      currentProgress += (targetProgress - currentProgress) * 0.14;

      if (Math.abs(targetProgress - currentProgress) < 0.0005) {
        currentProgress = targetProgress;
      }

      // Map progress to frame index
      const frameIdx = Math.min(
        TOTAL_FRAMES - 1,
        Math.max(0, Math.floor(currentProgress * (TOTAL_FRAMES - 1)))
      );

      if (frameIdx !== lastDrawnFrame) {
        drawFrame(frameIdx);
      }

      // Animate text position
      if (overlayRef.current && textTrackRef.current) {
        const containerW = overlayRef.current.clientWidth;
        const textW = textTrackRef.current.offsetWidth;

        // Start from left margin (0px), ending with 25% right space
        const startX = 0;
        const rightSpace = containerW * 0.25;
        const endX = Math.max(0, containerW - rightSpace - textW);

        const currentX = startX + currentProgress * (endX - startX);
        textTrackRef.current.style.transform = `translate3d(${currentX.toFixed(2)}px, 0, 0)`;
      }

      animId = requestAnimationFrame(renderLoop);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", () => {
      resizeCanvas();
      handleScroll();
    }, { passive: true });

    resizeCanvas();
    handleScroll();
    renderLoop();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [initialFrameLoaded]);

  return (
    <section
      ref={containerRef}
      className="exp-transition-container"
      id="experience-transition"
      aria-label="Experience Section Transition"
    >
      <style>{`
        .exp-transition-container {
          position: relative;
          width: 100%;
          height: 220vh;
          background: #050505;
          user-select: none;
        }

        .exp-transition-sticky {
          position: sticky;
          top: 0;
          width: 100%;
          height: 100vh;
          overflow: hidden;
          display: flex;
          align-items: center;
          border-top: 1px solid rgba(255, 255, 255, 0.12);
          border-bottom: 1px solid rgba(255, 255, 255, 0.12);
          background: #050505;
        }

        /* Background Video Scrub Canvas */
        .exp-transition-canvas {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
        }

        /* 4-column architectural grid column lines */
        .exp-grid-stage {
          position: absolute;
          inset: 0;
          padding: 0 var(--section-px, 5vw);
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          pointer-events: none;
          z-index: 2;
        }

        .exp-grid-line-col {
          border-right: 1px solid rgba(255, 255, 255, 0.05);
          height: 100%;
          position: relative;
        }

        .exp-grid-line-col:first-child {
          border-left: 1px solid rgba(255, 255, 255, 0.05);
        }

        /* Repositioned Typography Stage: Elevated in upper-third above flight path */
        .exp-typography-stage {
          position: absolute;
          left: 0;
          right: 0;
          top: clamp(20%, 25vh, 32%);
          padding: 0 var(--section-px, 5vw);
          pointer-events: none;
          z-index: 4;
          overflow: hidden;
        }

        .exp-scroll-track {
          display: inline-flex;
          align-items: center;
          white-space: nowrap;
          will-change: transform;
          transform: translate3d(0px, 0, 0);
        }

        .exp-typo-line {
          display: inline-flex;
          align-items: center;
          font-family: var(--font-display, 'Space Grotesk', 'Manrope', sans-serif);
          font-size: clamp(2.8rem, 6.2vw, 6.4rem);
          font-weight: 800;
          line-height: 0.92;
          letter-spacing: -0.04em;
          color: #fafafa;
          text-shadow: 0 4px 32px rgba(0, 0, 0, 0.9);
          white-space: nowrap;
        }

        .exp-circle-dot {
          display: inline-block;
          width: clamp(20px, 3.6vw, 44px);
          height: clamp(20px, 3.6vw, 44px);
          border-radius: 50%;
          background: #ffffff;
          box-shadow: 0 0 32px rgba(255, 255, 255, 0.6);
          margin-left: clamp(0.75rem, 1.8vw, 1.8rem);
          flex-shrink: 0;
        }

        @media (max-width: 768px) {
          .exp-transition-container {
            height: 180vh;
          }
          .exp-grid-stage {
            grid-template-columns: repeat(2, 1fr);
          }
          .exp-grid-line-col:nth-child(n+3) {
            display: none;
          }
          .exp-typo-line {
            font-size: clamp(2.2rem, 9vw, 3.4rem);
          }
        }
      `}</style>

      <div ref={stickyRef} className="exp-transition-sticky">
        {/* Background Canvas: Smooth Airplane Frame Scrubbing */}
        <canvas ref={canvasRef} className="exp-transition-canvas" />

        {/* 4-column architectural grid column lines */}
        <div className="exp-grid-stage">
          <div className="exp-grid-line-col" />
          <div className="exp-grid-line-col" />
          <div className="exp-grid-line-col" />
          <div className="exp-grid-line-col" />
        </div>

        {/* Monumental Typography Stage (Elevated above flight line) */}
        <div ref={overlayRef} className="exp-typography-stage">
          <div ref={textTrackRef} className="exp-scroll-track">
            <span className="exp-typo-line">
              Work Experience
              <span className="exp-circle-dot" />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
