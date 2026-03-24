import { useEffect, useRef } from "react";

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current, ring = ringRef.current;
    if (!dot || !ring) return;
    let mx = 0, my = 0, rx = 0, ry = 0, raf: number;
    const onMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; dot.style.left = mx + "px"; dot.style.top = my + "px"; };
    const loop = () => {
      rx += (mx - rx) * 0.1; ry += (my - ry) * 0.1;
      ring.style.left = rx + "px"; ring.style.top = ry + "px";
      raf = requestAnimationFrame(loop);
    };
    const onOver = (e: MouseEvent) => {
      const t = (e.target as HTMLElement).closest("a, button, [role=button], .clickable");
      if (t) {
        dot.style.transform = "translate(-50%,-50%) scale(3)";
        dot.style.background = "var(--fawn)";
        ring.style.width = "48px"; ring.style.height = "48px";
        ring.style.borderColor = "var(--fawn-60)";
      } else {
        dot.style.transform = "translate(-50%,-50%) scale(1)";
        dot.style.background = "var(--carbon)";
        ring.style.width = "32px"; ring.style.height = "32px";
        ring.style.borderColor = "var(--carbon-30)";
      }
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    raf = requestAnimationFrame(loop);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseover", onOver); cancelAnimationFrame(raf); };
  }, []);

  return (<><div ref={dotRef} className="cursor-dot" /><div ref={ringRef} className="cursor-ring" /></>);
}
