import { useEffect, useRef, useState } from "react";

export default function Loader({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const fillRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const duration = 2200;
    const steps = 90;
    const interval = duration / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += 1;
      setProgress(Math.min(current, steps));
      if (fillRef.current) {
        fillRef.current.style.transform = `scaleX(${current / steps})`;
      }
      if (current >= steps) {
        clearInterval(timer);
        setTimeout(() => {
          setDone(true);
          if (containerRef.current) {
            containerRef.current.style.opacity = "0";
            containerRef.current.style.transform = "scale(1.04)";
          }
          setTimeout(onDone, 750);
        }, 180);
      }
    }, interval);
    return () => clearInterval(timer);
  }, [onDone]);

  return (
    <div
      ref={containerRef}
      className="loader-container"
      style={{
        opacity: done ? 0 : 1,
        transform: done ? "scale(1.04)" : "scale(1)",
        transition: "opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1)",
        pointerEvents: done ? "none" : "all",
      }}
    >
      {/* Subtle grain — teal + fawn noise overlay */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse 60% 55% at 40% 50%, rgba(58,112,104,0.05) 0%, transparent 60%), radial-gradient(ellipse 50% 50% at 68% 52%, rgba(196,168,130,0.04) 0%, transparent 60%)",
        pointerEvents: "none",
      }} />

      <h1 className="loader-text">Sanjit Mathur</h1>

      <div className="loader-progress-bar">
        <div ref={fillRef} className="loader-progress-fill" />
      </div>

      <span className="loader-counter">
        {String(Math.round((progress / 90) * 100)).padStart(3, "0")}
      </span>
    </div>
  );
}
