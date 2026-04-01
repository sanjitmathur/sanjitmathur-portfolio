import { useRef, type ReactNode, type MouseEvent } from "react";

function isTouchDevice() {
  return "ontouchstart" in window || navigator.maxTouchPoints > 0 || window.matchMedia("(pointer: coarse)").matches;
}

interface Props {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  intensity?: number;
  glare?: boolean;
  onMouseEnter?: (e: MouseEvent<HTMLDivElement>) => void;
  onMouseLeave?: (e: MouseEvent<HTMLDivElement>) => void;
}

export default function Tilt3DCard({ children, className = "", style = {}, intensity = 12, glare = true, onMouseEnter, onMouseLeave }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    if (isTouchDevice()) return;
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    const rx = (0.5 - y) * intensity;
    const ry = (x - 0.5) * intensity;
    el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(12px) scale(1.015)`;
    if (glareRef.current) {
      glareRef.current.style.background = `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(255,255,255,0.55) 0%, transparent 60%)`;
      glareRef.current.style.opacity = "1";
    }
  };

  const onLeave = (e: MouseEvent<HTMLDivElement>) => {
    if (isTouchDevice()) return;
    const el = ref.current; if (!el) return;
    el.style.transform = "perspective(900px) rotateX(0) rotateY(0) translateZ(0) scale(1)";
    if (glareRef.current) glareRef.current.style.opacity = "0";
    onMouseLeave?.(e);
  };

  return (
    <div
      ref={ref} className={className}
      onMouseMove={onMove} onMouseLeave={onLeave} onMouseEnter={onMouseEnter}
      style={{ ...style, transition: "transform 0.35s cubic-bezier(0.25,0.46,0.45,0.94)", transformStyle: "preserve-3d", position: "relative", overflow: "hidden", willChange: "transform" }}
    >
      {children}
      {glare && (
        <div ref={glareRef} style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: 0, transition: "opacity 0.4s ease", borderRadius: "inherit", zIndex: 10 }} />
      )}
    </div>
  );
}
