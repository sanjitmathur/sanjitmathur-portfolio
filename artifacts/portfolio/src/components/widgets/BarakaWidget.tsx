import { useEffect, useRef, useState } from "react";
import { useInView } from "../useInView";

const BASE = 142.5;
function rand(min: number, max: number) { return Math.random() * (max - min) + min; }

function genPoints(n = 24): number[] {
  const pts: number[] = [BASE];
  for (let i = 1; i < n; i++) pts.push(Math.max(120, Math.min(170, pts[i - 1] + rand(-3, 3.5))));
  return pts;
}

function toPath(pts: number[], w: number, h: number): string {
  const min = Math.min(...pts), max = Math.max(...pts), range = max - min || 1;
  return pts.map((v, i) => {
    const x = (i / (pts.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 10) - 5;
    return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
}

export default function BarakaWidget() {
  const { ref: containerRef, inView } = useInView("200px 0px");
  const inViewRef = useRef(false);
  useEffect(() => { inViewRef.current = inView; }, [inView]);
  const [pts, setPts] = useState(() => genPoints());
  const [price, setPrice] = useState(142.50);
  const [delta, setDelta] = useState(+2.34);
  const [portfolio, setPortfolio] = useState(24_812);
  const svgRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const t = setInterval(() => {
      if (!inViewRef.current) return;
      const d = rand(-2, 2.5);
      setPrice(p => { const n = Math.max(130, Math.min(160, p + d)); return +n.toFixed(2); });
      setDelta(p => +(p + rand(-0.1, 0.12)).toFixed(2));
      setPortfolio(p => Math.max(23000, Math.min(27000, p + Math.round(rand(-80, 100)))));
      setPts(prev => { const np = [...prev.slice(1), Math.max(120, Math.min(170, prev[prev.length - 1] + d))]; return np; });
    }, 1200);
    return () => clearInterval(t);
  }, []);

  const up = delta >= 0;
  const w = 260, h = 80;
  const linePath = toPath(pts, w, h);
  const areaPath = linePath + ` L${w},${h} L0,${h} Z`;

  const candles = Array.from({ length: 8 }, (_, i) => {
    const o = rand(0, 1), c = rand(0, 1), hi = Math.max(o, c) + rand(0.05, 0.25), lo = Math.min(o, c) - rand(0.05, 0.25);
    return { o, c, hi, lo, bull: c >= o };
  });

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        background: "#0d1117",
        borderRadius: 12,
        padding: "clamp(10px, 2vw, 14px) clamp(12px, 2.3vw, 16px)",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        fontFamily: "var(--font)",
        overflow: "hidden",
        minHeight: 0,
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, minHeight: 0 }}>
        <div>
          <div style={{ fontSize: "0.6rem", color: "#6b7280", letterSpacing: "0.1em", textTransform: "uppercase" }}>BRAK · NYSE</div>
          <div style={{ fontSize: "clamp(1rem, 2vw, 1.15rem)", fontWeight: 700, color: "#f5f5f7", letterSpacing: "-0.02em", lineHeight: 1.1 }}>${price.toFixed(2)}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2, flexShrink: 0 }}>
          <span style={{ fontSize: "0.65rem", fontWeight: 600, color: up ? "#22c55e" : "#ef4444", background: up ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)", padding: "2px 8px", borderRadius: 100, whiteSpace: "nowrap" }}>
            {up ? "▲" : "▼"} {Math.abs(delta).toFixed(2)}%
          </span>
          <span style={{ fontSize: "0.55rem", color: "#4b5563" }}>Portfolio</span>
          <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "#22c55e" }}>${portfolio.toLocaleString()}</span>
        </div>
      </div>

      {/* Line chart */}
      <div style={{ flex: 1, position: "relative", minHeight: 0 }}>
        <svg width="100%" height="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
          <defs>
            <linearGradient id="baraka-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={up ? "#22c55e" : "#ef4444"} stopOpacity="0.25" />
              <stop offset="100%" stopColor={up ? "#22c55e" : "#ef4444"} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={areaPath} fill="url(#baraka-area)" />
          <path ref={svgRef} d={linePath} fill="none" stroke={up ? "#22c55e" : "#ef4444"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          {/* Current price dot */}
          {(() => {
            const last = pts[pts.length - 1];
            const min = Math.min(...pts), max = Math.max(...pts), range = max - min || 1;
            const cy = h - ((last - min) / range) * (h - 10) - 5;
            return <circle cx={w} cy={cy} r={3} fill={up ? "#22c55e" : "#ef4444"} />;
          })()}
        </svg>
      </div>

      {/* Candlesticks */}
      <div style={{ display: "flex", gap: 3, alignItems: "flex-end", height: 20, flexShrink: 0 }}>
        {candles.map((c, i) => {
          const barH = Math.max(4, Math.abs(c.c - c.o) * 20);
          const wickH = Math.min(16, (c.hi - c.lo) * 18);
          return (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", height: "100%" }}>
              <div style={{ width: 1, height: wickH, background: c.bull ? "#22c55e" : "#ef4444", opacity: 0.5 }} />
              <div style={{ width: "100%", height: barH, background: c.bull ? "#22c55e" : "#ef4444", borderRadius: 1 }} />
            </div>
          );
        })}
        <span style={{ fontSize: "0.48rem", color: "#4b5563", letterSpacing: "0.05em", whiteSpace: "nowrap", alignSelf: "center" }}>1D</span>
      </div>
    </div>
  );
}
