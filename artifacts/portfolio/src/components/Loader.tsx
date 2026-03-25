import { useEffect, useRef, useState } from "react";

export default function Loader({ onComplete }: { onComplete: () => void }) {
  const [pct, setPct] = useState(0);
  const fillRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const steps = 60, dur = 1400;
    let i = 0;
    const t = setInterval(() => {
      i++;
      setPct(Math.round((i / steps) * 100));
      if (fillRef.current) fillRef.current.style.transform = `scaleX(${i / steps})`;
      if (i >= steps) {
        clearInterval(t);
        setTimeout(() => {
          if (wrapRef.current) { wrapRef.current.style.opacity = "0"; wrapRef.current.style.transform = "scale(1.03)"; }
          setTimeout(onComplete, 500);
        }, 150);
      }
    }, dur / steps);
    return () => clearInterval(t);
  }, [onComplete]);

  return (
    <div ref={wrapRef} className="loader-wrap" style={{ transition: "opacity 0.5s ease, transform 0.5s ease" }}>
      <div className="loader-name">Sanjit Mathur</div>
      <div className="loader-bar-track">
        <div ref={fillRef} className="loader-bar-fill" />
      </div>
      <span className="loader-pct">{String(pct).padStart(3, "0")}</span>
    </div>
  );
}
