import { useState, useEffect, useRef } from "react";
import { useInView } from "../useInView";

export default function OrvynWidget() {
  const { ref: containerRef, inView } = useInView("200px 0px");
  const [hovered, setHovered] = useState(false);
  const [emgPoints, setEmgPoints] = useState<number[]>(() =>
    Array.from({ length: 40 }, () => 50)
  );
  const [emgLabel, setEmgLabel] = useState("IDLE");
  const [confidence, setConfidence] = useState(0);

  const inViewRef = useRef(false);
  useEffect(() => { inViewRef.current = inView; }, [inView]);

  useEffect(() => {
    let t = 0;
    const id = setInterval(() => {
      if (!inViewRef.current) return;
      t += 0.06;
      const active = hovered;
      const signal = active
        ? 50 + Math.sin(t * 8) * 28 + Math.sin(t * 14) * 14 + (Math.random() - 0.5) * 10
        : 50 + Math.sin(t * 2) * 4 + (Math.random() - 0.5) * 3;
      setEmgPoints((pts) => [...pts.slice(1), Math.max(10, Math.min(90, signal))]);
      setEmgLabel(active ? "FLEX" : "IDLE");
      setConfidence(
        active
          ? Math.min(99, 88 + Math.round(Math.sin(t) * 6))
          : Math.round(10 + Math.sin(t * 0.5) * 8)
      );
    }, 50);
    return () => clearInterval(id);
  }, [hovered]);

  const pts = emgPoints;
  const svgW = 200, svgH = 38;
  const polyline = pts
    .map((v, i) => `${(i / (pts.length - 1)) * svgW},${svgH - (v / 100) * svgH}`)
    .join(" ");

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%", height: "100%",
        background: "#0b0d10", borderRadius: 10,
        overflow: "hidden",
        display: "flex", flexDirection: "column",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onTouchStart={() => setHovered(true)}
      onTouchEnd={() => setHovered(false)}
    >
      {/* Header area (replaces 3D model) */}
      <div style={{ flex: 1, position: "relative", minHeight: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{
          position: "absolute", top: 7, left: 10, zIndex: 2,
          fontSize: "0.48rem", fontWeight: 700, color: "#c8a85a",
          letterSpacing: "0.12em", textTransform: "uppercase",
        }}>
          Orvyn ExoArm · sEMG
        </div>
        {hovered && inView && (
          <div style={{
            position: "absolute", top: 7, right: 10, zIndex: 2,
            fontSize: "0.45rem", color: "rgba(200,168,90,0.55)", letterSpacing: "0.06em",
          }}>
            GRASP ⚡
          </div>
        )}
        {/* Animated signal visualization */}
        <svg width="80%" height="60%" viewBox="0 0 200 80" preserveAspectRatio="none" style={{ opacity: 0.3 }}>
          <defs>
            <linearGradient id="orvyn-bg-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#c8a85a" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#c8a85a" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[0, 1, 2].map(i => {
            const wavePoints = pts
              .map((v, j) => `${(j / (pts.length - 1)) * 200},${80 - ((v + i * 12) / 120) * 80}`)
              .join(" ");
            return (
              <polyline key={i} points={wavePoints} fill="none"
                stroke="#c8a85a" strokeWidth="0.8" strokeLinecap="round"
                opacity={1 - i * 0.3}
              />
            );
          })}
        </svg>
      </div>

      {/* EMG signal chart */}
      <div style={{
        background: "rgba(0,0,0,0.55)",
        borderTop: "1px solid rgba(200,168,90,0.15)",
        padding: "7px 12px", flexShrink: 0,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{
              width: 5, height: 5, borderRadius: "50%",
              background: hovered ? "#22c55e" : "#6b7280",
              boxShadow: hovered ? "0 0 6px #22c55e" : "none",
              transition: "all 0.3s",
              animation: hovered ? "blink 0.8s ease infinite" : "none",
            }} />
            <span style={{ fontSize: "0.4rem", color: "#6b7280", letterSpacing: "0.08em" }}>sEMG CH-1</span>
            <span style={{ fontSize: "0.42rem", color: hovered ? "#22c55e" : "#6b7280", fontWeight: 600 }}>
              {emgLabel}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ fontSize: "0.4rem", color: "#6b7280" }}>Conf.</span>
            <span style={{ fontSize: "0.48rem", fontWeight: 600, color: confidence > 80 ? "#22c55e" : "#9c8f6e" }}>
              {confidence}%
            </span>
          </div>
        </div>

        <svg
          width="100%" height={svgH}
          viewBox={`0 0 ${svgW} ${svgH}`}
          preserveAspectRatio="none"
          style={{ display: "block" }}
        >
          <defs>
            <linearGradient id="emg-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={hovered ? "#22c55e" : "#c8a85a"} stopOpacity="0.22" />
              <stop offset="100%" stopColor={hovered ? "#22c55e" : "#c8a85a"} stopOpacity="0" />
            </linearGradient>
          </defs>
          <polyline points={`${polyline} ${svgW},${svgH} 0,${svgH}`} fill="url(#emg-fill)" />
          <polyline
            points={polyline} fill="none"
            stroke={hovered ? "#22c55e" : "#c8a85a"} strokeWidth="1.2"
            strokeLinecap="round" strokeLinejoin="round"
            style={{ transition: "stroke 0.3s" }}
          />
          <line x1="0" y1={svgH * 0.35} x2={svgW} y2={svgH * 0.35}
            stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" strokeDasharray="3 3" />
        </svg>
      </div>
    </div>
  );
}
