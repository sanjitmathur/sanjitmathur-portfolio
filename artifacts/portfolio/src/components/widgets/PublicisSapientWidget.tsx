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
  const offscreenRef = useRef<HTMLCanvasElement | null>(null);

  // Synchronize target progress
  useEffect(() => {
    targetProgressRef.current = Math.max(0, Math.min(1, progress));
  }, [progress]);

  // Progressive frame loading: frame 0 immediately, rest in background
  useEffect(() => {
    let isMounted = true;

    // Load frame 0 immediately
    const img0 = new Image();
    img0.src = `${FRAME_PATH}000.webp?v=tech-icons-v1`;
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
      img.src = `${FRAME_PATH}${padded}.webp?v=tech-icons-v1`;
      img.onload = () => {
        if (!isMounted) return;
        imagesRef.current[i] = img;
      };
    }

    return () => {
      isMounted = false;
    };
  }, []);

  // Canvas draw loop following Experience Card Rule Book
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
      // Nearest loaded neighbor fallback so canvas never flickers or goes blank
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
      const cssW = container.clientWidth;
      const isMobile = cssW <= 900;

      // Clear main canvas so the ambient plate (.publicis-bg-plate) shines through without cut seams
      ctx.clearRect(0, 0, w, h);

      if (img && img.complete && img.naturalWidth > 0) {
        const imgRatio = (img.naturalWidth && img.naturalHeight)
          ? (img.naturalWidth / img.naturalHeight)
          : (16 / 9);

        let renderW: number;
        let renderH: number;
        let offsetX = 0;
        let offsetY = 0;

        if (isMobile) {
          renderH = h;
          renderW = Math.round(h * imgRatio);
          offsetX = Math.round((w - renderW) / 2);
          offsetY = 0;
        } else {
          // Desktop: scale comfortably to ground visuals and span towards middle
          renderH = Math.round(h * 1.06);
          renderW = Math.round(renderH * imgRatio);
          offsetX = 0;
          offsetY = Math.round((h - renderH) / 2);
        }

        // Setup offscreen canvas to process video frame with alpha dissolve
        if (!offscreenRef.current) {
          offscreenRef.current = document.createElement("canvas");
        }
        const offCanvas = offscreenRef.current;
        if (offCanvas.width !== renderW || offCanvas.height !== renderH) {
          offCanvas.width = renderW;
          offCanvas.height = renderH;
        }
        const offCtx = offCanvas.getContext("2d");

        if (offCtx) {
          offCtx.clearRect(0, 0, renderW, renderH);

          // 1. Draw raw 3D video frame
          offCtx.drawImage(img, 0, 0, renderW, renderH);

          // 2. Seamless alpha dissolve on right side (only on desktop where it blends into background plate)
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

          // Composite processed frame to main canvas
          ctx.drawImage(offCanvas, offsetX, offsetY);
        }

        lastDrawnFrameRef.current = frameIdx;
      }
    };

    const loop = () => {
      const target = targetProgressRef.current;
      const isNavJump = (window as any).__isNavJump;

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
