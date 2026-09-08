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
        const imgRatio = (img.naturalWidth && img.naturalHeight)
          ? (img.naturalWidth / img.naturalHeight)
          : (16 / 9);

        // Scale image to fill 100% of canvas height so widget length matches text length
        const renderH = h;
        const renderW = Math.round(h * imgRatio);
        const offsetX = 0;
        const offsetY = 0;

        ctx.drawImage(img, offsetX, offsetY, renderW, renderH);

        // Right side smooth fade to solid #050505 so text on the right is 100% visible
        // ONLY right side is faded — left side, top, and bottom have ZERO fade
        const fadeStart = Math.round(Math.min(w, renderW) * 0.38);
        const fadeEnd = Math.max(w, renderW);
        const rightG = ctx.createLinearGradient(fadeStart, 0, fadeEnd, 0);
        rightG.addColorStop(0, "rgba(5, 5, 5, 0)");
        rightG.addColorStop(0.22, "rgba(5, 5, 5, 0.4)");
        rightG.addColorStop(0.55, "rgba(5, 5, 5, 0.88)");
        rightG.addColorStop(0.82, "#050505");
        rightG.addColorStop(1, "#050505");
        ctx.fillStyle = rightG;
        ctx.fillRect(fadeStart, 0, fadeEnd - fadeStart, h);

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

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined" && container) {
      ro = new ResizeObserver(() => {
        resizeCanvas();
      });
      ro.observe(container);
    }

    animRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resizeCanvas);
      if (ro) ro.disconnect();
    };
  }, [initialFrameLoaded]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        background: "transparent",
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
    </div>
  );
}
