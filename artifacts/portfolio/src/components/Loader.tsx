import { useEffect, useRef, useState } from "react";

export default function Loader({ onComplete }: { onComplete: () => void }) {
  const [pct, setPct] = useState(0);
  const fillRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const steps = 80, dur = 2000;
    let i = 0;
    const t = setInterval(() => {
      i++;
      setPct(i);
      if (fillRef.current) fillRef.current.style.transform = `scaleX(${i / steps})`;
      if (i >= steps) {
        clearInterval(t);
        setTimeout(() => {
          if (wrapRef.current) {
            wrapRef.current.style.opacity = "0";
            wrapRef.current.style.transform = "scale(1.04)";
          }
          setTimeout(onComplete, 650);
        }, 180);
      }
    }, dur / steps);
    return () => clearInterval(t);
  }, [onComplete]);

  return (
    <div ref={wrapRef} className="loader-wrap" style={{ transition: "opacity 0.65s ease, transform 0.65s ease" }}>
      <h1 className="loader-name">Sanjit Mathur</h1>
      <div className="loader-bar-track">
        <div ref={fillRef} className="loader-bar-fill" />
      </div>
      <span className="loader-pct">{String(Math.round((pct / 80) * 100)).padStart(3, "0")}</span>
    </div>
  );
}
