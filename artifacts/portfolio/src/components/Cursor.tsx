import { useEffect, useRef } from "react";

export default function Cursor() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const pos  = useRef({ x: -200, y: -200 });
  const ring = useRef({ x: -200, y: -200 });
  const raf  = useRef(0);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.left = `${e.clientX}px`;
        dotRef.current.style.top  = `${e.clientY}px`;
      }
      /* cursor label from data-cursor attribute */
      const target = document.elementFromPoint(e.clientX, e.clientY);
      const label = (target as HTMLElement)?.closest("[data-cursor]")?.getAttribute("data-cursor") || "";
      if (labelRef.current) {
        labelRef.current.textContent = label;
        labelRef.current.style.opacity = label ? "1" : "0";
      }
    };

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const tick = () => {
      ring.current.x = lerp(ring.current.x, pos.current.x, 0.12);
      ring.current.y = lerp(ring.current.y, pos.current.y, 0.12);
      if (ringRef.current) {
        ringRef.current.style.left = `${ring.current.x}px`;
        ringRef.current.style.top  = `${ring.current.y}px`;
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);

    const onEnter = (e: MouseEvent) => {
      const el = (e.target as HTMLElement);
      const isClick = el.closest(".clickable") || el.closest("a") || el.closest("button");
      if (isClick) {
        if (dotRef.current)  { dotRef.current.style.transform  = "translate(-50%,-50%) scale(3)"; dotRef.current.style.opacity = "0.3"; }
        if (ringRef.current) { ringRef.current.style.width = "60px"; ringRef.current.style.height = "60px"; ringRef.current.style.borderColor = "var(--fawn)"; ringRef.current.style.boxShadow = "0 0 20px rgba(213,181,114,0.3)"; }
      }
    };
    const onLeave = () => {
      if (dotRef.current)  { dotRef.current.style.transform  = "translate(-50%,-50%) scale(1)"; dotRef.current.style.opacity = "1"; }
      if (ringRef.current) { ringRef.current.style.width = "32px"; ringRef.current.style.height = "32px"; ringRef.current.style.borderColor = "rgba(248,242,225,0.35)"; ringRef.current.style.boxShadow = "none"; }
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover",  onEnter);
    document.addEventListener("mouseout",   onLeave);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover",  onEnter);
      document.removeEventListener("mouseout",   onLeave);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <>
      {/* Dot */}
      <div ref={dotRef} style={{
        position: "fixed", zIndex: 99999, pointerEvents: "none",
        width: 5, height: 5, borderRadius: "50%",
        background: "var(--fawn)",
        transform: "translate(-50%,-50%)",
        transition: "transform 0.25s cubic-bezier(0.16,1,0.3,1), opacity 0.25s",
        boxShadow: "0 0 10px rgba(213,181,114,0.6)",
        mixBlendMode: "normal",
      }} />

      {/* Ring */}
      <div ref={ringRef} style={{
        position: "fixed", zIndex: 99998, pointerEvents: "none",
        width: 32, height: 32, borderRadius: "50%",
        border: "1px solid rgba(248,242,225,0.35)",
        transform: "translate(-50%,-50%)",
        transition: "width 0.4s cubic-bezier(0.16,1,0.3,1), height 0.4s cubic-bezier(0.16,1,0.3,1), border-color 0.3s, box-shadow 0.3s",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {/* Label inside ring */}
        <div ref={labelRef} style={{
          fontFamily: "var(--app-font-mono)",
          fontSize: "0.36rem",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "var(--fawn)",
          opacity: 0,
          transition: "opacity 0.2s",
          whiteSpace: "nowrap",
          userSelect: "none",
        }} />
      </div>
    </>
  );
}
