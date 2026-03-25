import { useEffect, useRef } from "react";

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!dot || !ring || !label) return;

    let mx = 0, my = 0, rx = 0, ry = 0, raf: number;
    let isHovering = false;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.left = mx + "px";
      dot.style.top = my + "px";
    };

    const loop = () => {
      // snappier lerp: 0.22 vs old 0.1
      rx += (mx - rx) * 0.22;
      ry += (my - ry) * 0.22;
      ring.style.left = rx + "px";
      ring.style.top = ry + "px";
      label.style.left = rx + "px";
      label.style.top = ry + "px";
      raf = requestAnimationFrame(loop);
    };

    const onOver = (e: MouseEvent) => {
      const t = (e.target as HTMLElement).closest("a, button, [role=button], .clickable, .magnetic");
      if (t) {
        isHovering = true;
        dot.style.opacity = "0";
        ring.style.width = "64px";
        ring.style.height = "64px";
        ring.style.background = "var(--carbon)";
        ring.style.borderColor = "var(--carbon)";
        ring.style.mixBlendMode = "difference";
        const txt = (t as HTMLElement).dataset.cursor || "";
        label.textContent = txt;
        label.style.opacity = txt ? "1" : "0";
      } else {
        isHovering = false;
        dot.style.opacity = "1";
        ring.style.width = "28px";
        ring.style.height = "28px";
        ring.style.background = "transparent";
        ring.style.borderColor = "rgba(32,31,20,0.35)";
        ring.style.mixBlendMode = "normal";
        label.style.opacity = "0";
        label.textContent = "";
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} style={{
        position: "fixed", zIndex: 99999, pointerEvents: "none",
        width: 5, height: 5, background: "var(--carbon)", borderRadius: "50%",
        transform: "translate(-50%,-50%)",
        transition: "opacity 0.2s ease, transform 0.2s ease",
        willChange: "left, top",
      }} />
      <div ref={ringRef} style={{
        position: "fixed", zIndex: 99998, pointerEvents: "none",
        width: 28, height: 28, border: "1px solid rgba(32,31,20,0.35)", borderRadius: "50%",
        transform: "translate(-50%,-50%)",
        transition: "width 0.35s cubic-bezier(0.16,1,0.3,1), height 0.35s cubic-bezier(0.16,1,0.3,1), background 0.35s ease, border-color 0.35s ease",
        willChange: "left, top",
        display: "flex", alignItems: "center", justifyContent: "center",
      }} />
      <div ref={labelRef} style={{
        position: "fixed", zIndex: 99997, pointerEvents: "none",
        transform: "translate(-50%,-50%)",
        fontFamily: "var(--app-font-mono)", fontSize: "0.38rem",
        letterSpacing: "0.2em", textTransform: "uppercase",
        color: "var(--bg)", opacity: 0,
        transition: "opacity 0.2s ease",
        whiteSpace: "nowrap",
      }} />
    </>
  );
}
