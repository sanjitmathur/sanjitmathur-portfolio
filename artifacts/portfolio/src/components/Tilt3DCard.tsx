import { useRef, type ReactNode, type MouseEvent } from "react";

interface Tilt3DCardProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  intensity?: number;
  glare?: boolean;
  onMouseEnter?: (e: MouseEvent<HTMLDivElement>) => void;
  onMouseLeave?: (e: MouseEvent<HTMLDivElement>) => void;
}

export default function Tilt3DCard({
  children,
  className = "",
  style = {},
  intensity = 12,
  glare = true,
  onMouseEnter,
  onMouseLeave,
}: Tilt3DCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const transformRef = useRef("");
  const glareRef = useRef<HTMLDivElement>(null);

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rotX = (0.5 - y) * intensity;
    const rotY = (x - 0.5) * intensity;
    const t = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(10px) scale(1.012)`;
    el.style.transform = t;
    if (glareRef.current) {
      glareRef.current.style.background = `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(255,255,255,0.1), transparent 65%)`;
      glareRef.current.style.opacity = "1";
    }
  };

  const handleLeave = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale(1)";
    if (glareRef.current) {
      glareRef.current.style.opacity = "0";
    }
    onMouseLeave?.(e);
  };

  const handleEnter = (e: MouseEvent<HTMLDivElement>) => {
    onMouseEnter?.(e);
  };

  return (
    <div
      ref={ref}
      className={className}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onMouseEnter={handleEnter}
      style={{
        ...style,
        transition: "transform 0.3s cubic-bezier(0.25,0.46,0.45,0.94)",
        transformStyle: "preserve-3d",
        position: "relative",
        overflow: "hidden",
        willChange: "transform",
      }}
    >
      {children}
      {glare && (
        <div
          ref={glareRef}
          style={{
            position: "absolute", inset: 0,
            pointerEvents: "none",
            opacity: 0,
            transition: "opacity 0.4s ease",
            borderRadius: "inherit",
            zIndex: 10,
          }}
        />
      )}
    </div>
  );
}
