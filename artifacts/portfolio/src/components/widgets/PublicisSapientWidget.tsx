import React, { useEffect, useRef, useState } from "react";

const TOTAL_FRAMES = 80;
const BASE_URL = import.meta.env.BASE_URL || "/";
const FRAME_PATH = `${BASE_URL.replace(/\/$/, "")}/publicis-frames/frame_`;

interface PublicisSapientWidgetProps {
  progress?: number;
}

export default function PublicisSapientWidget({ progress = 0 }: PublicisSapientWidgetProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES).fill(null));
  const [initialFrameLoaded, setInitialFrameLoaded] = useState(false);
  const animRef = useRef<number>(0);
  const targetProgressRef = useRef<number>(0);
  const currentProgressRef = useRef<number>(0);
  const lastDrawnFrameRef = useRef<number>(-1);

  // Synchronize target progress
  useEffect(() => {
    targetProgressRef.current = Math.max(0, Math.min(1, progress));
  }, [progress]);

  // Progressive frame loading
  useEffect(() => {
    let isMounted = true;

    // Load frame 0 immediately
    const img0 = new Image();
    img0.src = `${FRAME_PATH}000.webp`;
    img0.onload = () => {
      if (!isMounted) return;
      imagesRef.current[0] = img0;
      setInitialFrameLoaded(true);
    };
    img0.onerror = () => {
      console.warn("Could not load Publicis initial frame:", img0.src);
    };

    // Preload remaining frames
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

  // Canvas draw loop
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      if (!canvas || !container) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) return;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      lastDrawnFrameRef.current = -1;
    };

    const drawFrame = (frameIdx: number) => {
      if (!canvas || !ctx) return;

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

      const w = canvas.width;
      const h = canvas.height;

      // Background matching page background #050505
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
        lastDrawnFrameRef.current = frameIdx;
      }
    };

    const loop = () => {
      const target = targetProgressRef.current;
      currentProgressRef.current += (target - currentProgressRef.current) * 0.16;
      if (Math.abs(target - currentProgressRef.current) < 0.001) {
        currentProgressRef.current = target;
      }

      const frameIdx = Math.min(
        TOTAL_FRAMES - 1,
        Math.max(0, Math.floor(currentProgressRef.current * (TOTAL_FRAMES - 1)))
      );

      if (frameIdx !== lastDrawnFrameRef.current) {
        drawFrame(frameIdx);
      }

      animRef.current = requestAnimationFrame(loop);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    animRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [initialFrameLoaded]);

  const currentFrameNum = Math.min(TOTAL_FRAMES, Math.max(1, Math.floor(progress * (TOTAL_FRAMES - 1)) + 1));

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        maxHeight: "100%",
        overflow: "hidden",
        background: "#050505",
        border: "none",
        boxShadow: "none",
        borderRadius: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "100%",
          display: "block",
          objectFit: "contain",
        }}
      />

      {/* Seamless atmospheric vignette blending visual into page background #050505 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: `
            radial-gradient(ellipse 85% 85% at 50% 50%, transparent 55%, rgba(5, 5, 5, 0.5) 80%, #050505 100%),
            linear-gradient(to right, #050505 0%, transparent 12%, transparent 82%, #050505 100%),
            linear-gradient(to bottom, #050505 0%, transparent 10%, transparent 88%, #050505 100%)
          `,
        }}
      />

      {/* Top Left: HUD Spec badge */}
      <div
        style={{
          position: "absolute",
          top: 12,
          left: 14,
          background: "rgba(8, 12, 20, 0.75)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: 100,
          padding: "3px 10px",
          display: "flex",
          alignItems: "center",
          gap: 6,
          pointerEvents: "none",
          fontFamily: "var(--font-mono, monospace)",
          fontSize: "0.6rem",
          color: "rgba(255, 255, 255, 0.7)",
          letterSpacing: "0.06em",
        }}
      >
        <span style={{ color: "#6366f1", fontWeight: 700 }}>01</span>
        <span>// CAD ARCHITECTURE</span>
      </div>

      {/* Top Right: Live sync badge */}
      <div
        style={{
          position: "absolute",
          top: 12,
          right: 14,
          background: "rgba(8, 12, 20, 0.75)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          border: "1px solid rgba(99, 102, 241, 0.3)",
          borderRadius: 100,
          padding: "3px 10px",
          display: "flex",
          alignItems: "center",
          gap: 6,
          pointerEvents: "none",
          fontFamily: "var(--font-mono, monospace)",
          fontSize: "0.6rem",
          color: "#98c379",
          letterSpacing: "0.06em",
        }}
      >
        <span
          style={{
            width: 5,
            height: 5,
            borderRadius: "50%",
            background: "#98c379",
            boxShadow: "0 0 6px #98c379",
          }}
        />
        <span>3D LIVE ARCHITECTURE</span>
      </div>

      {/* Bottom Left: Tech watermark */}
      <div
        style={{
          position: "absolute",
          bottom: 12,
          left: 14,
          pointerEvents: "none",
          fontFamily: "var(--font-mono, monospace)",
          fontSize: "0.58rem",
          color: "rgba(255, 255, 255, 0.45)",
          letterSpacing: "0.08em",
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <span>NODE.JS</span>
        <span>·</span>
        <span>POSTGRESQL</span>
        <span>·</span>
        <span>PRISMA</span>
      </div>

      {/* Bottom Right: Frame counter */}
      <div
        style={{
          position: "absolute",
          bottom: 12,
          right: 14,
          background: "rgba(8, 12, 20, 0.75)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: 6,
          padding: "2px 8px",
          pointerEvents: "none",
          fontFamily: "var(--font-mono, monospace)",
          fontSize: "0.58rem",
          color: "rgba(255, 255, 255, 0.6)",
          letterSpacing: "0.05em",
        }}
      >
        FRAME {String(currentFrameNum).padStart(2, "0")} / {TOTAL_FRAMES}
      </div>
    </div>
  );
}
