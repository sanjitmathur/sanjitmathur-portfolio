import { useEffect, useRef, useState } from "react";

interface LoaderProps {
  onComplete: () => void;
}

export default function Loader({ onComplete }: LoaderProps) {
  const fillRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fill = fillRef.current;
    const text = textRef.current;
    const counter = counterRef.current;
    const container = containerRef.current;

    if (!fill || !text || !counter || !container) return;

    // Fade in text
    setTimeout(() => {
      text.style.opacity = "1";
      text.style.transform = "translateY(0)";
      text.style.transition = "opacity 0.8s ease, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)";
    }, 100);

    // Animate progress
    let progress = 0;
    const duration = 2200;
    const start = performance.now();

    const animate = (now: number) => {
      const elapsed = now - start;
      progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      fill.style.transform = `scaleX(${eased})`;
      const displayNum = Math.round(eased * 100);
      setCount(displayNum);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Exit animation
        setTimeout(() => {
          container.style.transition = "opacity 0.8s ease, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)";
          container.style.opacity = "0";
          container.style.transform = "scale(1.03)";
          setTimeout(onComplete, 800);
        }, 300);
      }
    };

    requestAnimationFrame(animate);
  }, [onComplete]);

  return (
    <div ref={containerRef} className="loader-container">
      <div
        ref={textRef}
        className="loader-text"
        style={{ transform: "translateY(20px)", opacity: 0 }}
      >
        Sanjit Mathur
      </div>
      <div className="loader-progress-bar">
        <div ref={fillRef} className="loader-progress-fill" />
      </div>
      <div ref={counterRef} className="loader-counter">
        {String(count).padStart(3, "0")}
      </div>
    </div>
  );
}
