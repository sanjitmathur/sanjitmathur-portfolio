import { useEffect, useRef, useState } from "react";

export default function Loader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const fillRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const duration = 2000;
    const steps = 80;
    const interval = duration / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += 1;
      setProgress(current);
      if (fillRef.current) {
        fillRef.current.style.transform = `scaleX(${current / steps})`;
      }
      if (current >= steps) {
        clearInterval(timer);
        setTimeout(() => {
          if (containerRef.current) {
            containerRef.current.style.opacity = "0";
            containerRef.current.style.transform = "scale(1.03)";
          }
          setTimeout(onComplete, 650);
        }, 200);
      }
    }, interval);
    return () => clearInterval(timer);
  }, [onComplete]);

  const pct = Math.round((progress / 80) * 100);

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed", inset: 0,
        background: "var(--carbon)",
        zIndex: 99990,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "2.5rem",
        transition: "opacity 0.65s cubic-bezier(0.16,1,0.3,1), transform 0.65s cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      {/* Subtle grid bg */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "linear-gradient(rgba(58,112,104,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(58,112,104,0.04) 1px, transparent 1px)",
        backgroundSize: "48px 48px",
        pointerEvents: "none",
      }} />

      {/* Name */}
      <h1 style={{
        fontFamily: "var(--app-font-serif)",
        fontSize: "clamp(2.2rem, 6vw, 4rem)",
        fontWeight: 400,
        color: "var(--ivory)",
        letterSpacing: "-0.03em",
        position: "relative",
      }}>
        Sanjit Mathur
      </h1>

      {/* Progress bar */}
      <div style={{
        width: "min(280px, 75vw)",
        height: "1px",
        background: "rgba(74,63,56,0.3)",
        position: "relative", overflow: "hidden",
      }}>
        <div ref={fillRef} style={{
          height: "100%",
          background: "linear-gradient(to right, var(--teal), var(--fawn))",
          transformOrigin: "left",
          transform: "scaleX(0)",
        }} />
      </div>

      {/* Counter */}
      <span style={{
        fontFamily: "var(--app-font-mono)",
        fontSize: "0.65rem",
        letterSpacing: "0.25em",
        color: "var(--iron)",
      }}>
        {String(pct).padStart(3, "0")}
      </span>
    </div>
  );
}
