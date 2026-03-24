import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";

interface MousePos {
  x: number; // -1 to 1
  y: number; // -1 to 1
  rawX: number;
  rawY: number;
}

const Mouse3DContext = createContext<MousePos>({ x: 0, y: 0, rawX: 0, rawY: 0 });

export function Mouse3DProvider({ children }: { children: ReactNode }) {
  const [pos, setPos] = useState<MousePos>({ x: 0, y: 0, rawX: 0, rawY: 0 });
  const rafRef = useRef<number | null>(null);
  const targetRef = useRef({ x: 0, y: 0, rawX: 0, rawY: 0 });
  const currentRef = useRef({ x: 0, y: 0, rawX: 0, rawY: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      targetRef.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -((e.clientY / window.innerHeight) * 2 - 1),
        rawX: e.clientX,
        rawY: e.clientY,
      };
    };

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const animate = () => {
      const t = 0.06;
      currentRef.current.x = lerp(currentRef.current.x, targetRef.current.x, t);
      currentRef.current.y = lerp(currentRef.current.y, targetRef.current.y, t);
      currentRef.current.rawX = lerp(currentRef.current.rawX, targetRef.current.rawX, t);
      currentRef.current.rawY = lerp(currentRef.current.rawY, targetRef.current.rawY, t);
      setPos({ ...currentRef.current });
      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return <Mouse3DContext.Provider value={pos}>{children}</Mouse3DContext.Provider>;
}

export const useMouse3D = () => useContext(Mouse3DContext);
