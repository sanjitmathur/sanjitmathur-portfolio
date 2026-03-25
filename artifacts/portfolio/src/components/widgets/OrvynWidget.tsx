import { useEffect, useRef, useState } from "react";

export default function OrvynWidget() {
  const [angles, setAngles] = useState({ a: -110, b: -80, c: -60 });
  const [emg, setEmg] = useState(Array(20).fill(0));
  const [signal, setSignal] = useState(0);
  const [dragging, setDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const autoRef = useRef(0);

  // Auto-animate when not dragging
  useEffect(() => {
    let frame = 0;
    const id = setInterval(() => {
      frame++;
      if (!dragging) {
        const t = frame / 60;
        setAngles({
          a: -110 + Math.sin(t * 0.8) * 25,
          b: -80 + Math.sin(t * 0.6 + 1) * 30,
          c: -60 + Math.sin(t * 1.2 + 0.5) * 20,
        });
      }
      // EMG signal
      setSignal(prev => {
        const n = prev + (Math.random() - 0.45) * 18;
        return Math.max(-30, Math.min(30, n));
      });
      setEmg(prev => {
        const next = [...prev.slice(1), Math.random() * 60 - 30 + (dragging ? 20 : 0)];
        return next;
      });
    }, 50);
    return () => clearInterval(id);
  }, [dragging]);

  // Mouse drag to control arm
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!dragging) return;
    const rect = containerRef.current!.getBoundingClientRect();
    const mx = (e.clientX - rect.left) / rect.width;
    const my = (e.clientY - rect.top) / rect.height;
    setAngles({
      a: -150 + mx * 80,
      b: -100 + my * 60,
      c: -70 + (mx + my) * 30,
    });
  };

  // Arm segment geometry
  const BASE = { x: 130, y: 150 };
  const L1 = 45, L2 = 38, L3 = 28;
  const toRad = (d: number) => (d * Math.PI) / 180;

  const p1 = {
    x: BASE.x + L1 * Math.cos(toRad(angles.a)),
    y: BASE.y + L1 * Math.sin(toRad(angles.a)),
  };
  const p2 = {
    x: p1.x + L2 * Math.cos(toRad(angles.a + angles.b)),
    y: p1.y + L2 * Math.sin(toRad(angles.a + angles.b)),
  };
  const p3 = {
    x: p2.x + L3 * Math.cos(toRad(angles.a + angles.b + angles.c)),
    y: p2.y + L3 * Math.sin(toRad(angles.a + angles.b + angles.c)),
  };

  const emgPath = emg.map((v, i) => `${i === 0 ? "M" : "L"}${(i / (emg.length - 1)) * 240},${30 + v}`).join(" ");

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseDown={() => setDragging(true)}
      onMouseUp={() => setDragging(false)}
      onMouseLeave={() => setDragging(false)}
      style={{ width: "100%", height: "100%", background: "#0c1118", borderRadius: 12, overflow: "hidden", fontFamily: "var(--font)", cursor: dragging ? "grabbing" : "grab", userSelect: "none" }}>

      {/* Header */}
      <div style={{ padding: "10px 14px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: "0.6rem", color: "#a78bfa", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700 }}>ORVYN EXOARM</div>
        <div style={{ fontSize: "0.5rem", color: "#22c55e", display: "flex", alignItems: "center", gap: 4 }}>
          <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#22c55e", animation: "blink 1.5s infinite" }} />
          {dragging ? "MANUAL" : "AUTO"}
        </div>
      </div>

      {/* Arm SVG */}
      <svg width="100%" height="155" viewBox="0 0 260 155">
        {/* Grid */}
        {Array.from({ length: 5 }, (_, row) => Array.from({ length: 8 }, (_, col) => (
          <circle key={`${row}-${col}`} cx={col * 33 + 16} cy={row * 30 + 15} r={0.6} fill="rgba(167,139,250,0.08)" />
        )))}

        {/* Base */}
        <rect x={BASE.x - 14} y={BASE.y - 4} width={28} height={10} rx={3} fill="#374151" />
        <rect x={BASE.x - 8} y={BASE.y + 6} width={16} height={4} rx={2} fill="#1f2937" />

        {/* Segment 1 */}
        <line x1={BASE.x} y1={BASE.y} x2={p1.x} y2={p1.y} stroke="#6366f1" strokeWidth="6" strokeLinecap="round" />
        <line x1={BASE.x} y1={BASE.y} x2={p1.x} y2={p1.y} stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" />

        {/* Joint 1 */}
        <circle cx={p1.x} cy={p1.y} r={5} fill="#374151" stroke="#6366f1" strokeWidth="1.5" />
        <circle cx={p1.x} cy={p1.y} r={2} fill="#a78bfa" />

        {/* Segment 2 */}
        <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#6366f1" strokeWidth="5" strokeLinecap="round" />
        <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#c4b5fd" strokeWidth="1.5" strokeLinecap="round" />

        {/* Joint 2 */}
        <circle cx={p2.x} cy={p2.y} r={4} fill="#374151" stroke="#6366f1" strokeWidth="1.5" />
        <circle cx={p2.x} cy={p2.y} r={1.5} fill="#c4b5fd" />

        {/* Segment 3 (gripper) */}
        <line x1={p2.x} y1={p2.y} x2={p3.x} y2={p3.y} stroke="#4f46e5" strokeWidth="4" strokeLinecap="round" />
        {/* Gripper fingers */}
        <line x1={p3.x} y1={p3.y} x2={p3.x + 8 * Math.cos(toRad(angles.a + angles.b + angles.c + 20))} y2={p3.y + 8 * Math.sin(toRad(angles.a + angles.b + angles.c + 20))} stroke="#c4b5fd" strokeWidth="2" strokeLinecap="round" />
        <line x1={p3.x} y1={p3.y} x2={p3.x + 8 * Math.cos(toRad(angles.a + angles.b + angles.c - 20))} y2={p3.y + 8 * Math.sin(toRad(angles.a + angles.b + angles.c - 20))} stroke="#c4b5fd" strokeWidth="2" strokeLinecap="round" />

        {/* Drag hint */}
        {!dragging && (
          <text x="130" y="148" textAnchor="middle" fontSize="6.5" fill="rgba(107,114,128,0.7)">drag to control</text>
        )}
      </svg>

      {/* EMG chart */}
      <div style={{ padding: "0 14px 10px", display: "flex", flexDirection: "column", gap: 4 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "0.5rem", color: "#4b5563", letterSpacing: "0.08em" }}>EMG SIGNAL</span>
          <span style={{ fontSize: "0.55rem", color: "#22c55e", fontWeight: 600 }}>{Math.abs(Math.round(signal))} μV</span>
        </div>
        <svg width="100%" height="30" viewBox="0 0 240 60" preserveAspectRatio="none">
          <path d={emgPath} fill="none" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
        </svg>
      </div>
    </div>
  );
}
