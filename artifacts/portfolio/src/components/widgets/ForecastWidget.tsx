import { useEffect, useRef, useState } from "react";

const DOMAINS = ["Airline Bookings", "E-Commerce Sales", "Payment Volume"];
const ACCENT = "#6366f1";

function generateWave(frame: number, offset: number): number[] {
  return Array.from({ length: 24 }, (_, i) => {
    const x = i / 23;
    const base = 0.45 + 0.18 * Math.sin(x * Math.PI * 2 + offset);
    const trend = 0.12 * x;
    const noise = 0.06 * Math.sin(frame * 0.03 + i * 0.7 + offset * 3);
    return Math.max(0.08, Math.min(0.95, base + trend + noise));
  });
}

export default function ForecastWidget() {
  const [domain, setDomain] = useState(0);
  const [points, setPoints] = useState(() => generateWave(0, 0));
  const frameRef = useRef(0);
  const rafRef = useRef(0);

  // Auto-cycle domains every 3s
  useEffect(() => {
    const interval = setInterval(() => {
      setDomain(d => (d + 1) % DOMAINS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const animate = () => {
      frameRef.current++;
      setPoints(generateWave(frameRef.current, domain * 2.1));
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [domain]);

  // Build SVG path
  const w = 280, h = 100, px = 12, py = 8;
  const iw = w - px * 2, ih = h - py * 2;
  const toX = (i: number) => px + (i / 23) * iw;
  const toY = (v: number) => py + (1 - v) * ih;

  const line = points.map((v, i) => `${i === 0 ? "M" : "L"}${toX(i).toFixed(1)},${toY(v).toFixed(1)}`).join(" ");
  const upper = points.map((v, i) => `${i === 0 ? "M" : "L"}${toX(i).toFixed(1)},${toY(Math.min(0.98, v + 0.1)).toFixed(1)}`).join(" ");
  const lower = [...points].map((v, i) => `${toX(23 - i).toFixed(1)},${toY(Math.max(0.02, points[23 - i] - 0.1)).toFixed(1)}`).join(" L");
  const band = `${upper} L${lower} Z`;

  return (
    <div style={{
      width: "100%", height: "100%", background: "#0d0d1a", borderRadius: 12,
      padding: "14px 16px", display: "flex", flexDirection: "column", gap: 8,
      fontFamily: "var(--font)", overflow: "hidden",
    }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 8, height: 8, borderRadius: "50%", background: ACCENT,
            boxShadow: `0 0 10px ${ACCENT}80`, animation: "blink 2.5s ease infinite",
          }} />
          <span style={{ fontSize: "0.68rem", fontWeight: 600, color: "#e2e2f0", letterSpacing: "0.04em" }}>
            Demand Forecast
          </span>
        </div>
        <span style={{ fontSize: "0.5rem", color: "#6b7280", letterSpacing: "0.06em", textTransform: "uppercase" }}>
          LIVE
        </span>
      </div>

      {/* Domain tabs */}
      <div style={{ display: "flex", gap: 4 }}>
        {DOMAINS.map((d, i) => (
          <button
            key={d}
            onClick={() => setDomain(i)}
            style={{
              flex: 1, padding: "4px 0", fontSize: "0.5rem", fontWeight: 600,
              background: domain === i ? `${ACCENT}22` : "transparent",
              color: domain === i ? ACCENT : "#6b7280",
              border: `1px solid ${domain === i ? `${ACCENT}44` : "transparent"}`,
              borderRadius: 6, letterSpacing: "0.04em", transition: "all 0.2s",
            }}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div style={{ flex: 1, minHeight: 0 }}>
        <svg viewBox={`0 0 ${w} ${h}`} width="100%" height="100%" preserveAspectRatio="none">
          {/* Grid lines */}
          {[0.25, 0.5, 0.75].map(v => (
            <line key={v} x1={px} x2={w - px} y1={toY(v)} y2={toY(v)} stroke="#ffffff08" strokeWidth="0.5" />
          ))}
          {/* Confidence band */}
          <path d={band} fill={`${ACCENT}15`} />
          {/* Main line */}
          <path d={line} fill="none" stroke={ACCENT} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          {/* Endpoint dot */}
          <circle cx={toX(23)} cy={toY(points[23])} r="3" fill={ACCENT}>
            <animate attributeName="opacity" values="1;0.4;1" dur="1.5s" repeatCount="indefinite" />
          </circle>
        </svg>
      </div>

      {/* Metrics row */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {[
          { label: "RMSE", value: (0.032 + domain * 0.008).toFixed(3) },
          { label: "R²", value: (0.94 - domain * 0.02).toFixed(2) },
          { label: "MAPE", value: `${(3.1 + domain * 0.7).toFixed(1)}%` },
        ].map(m => (
          <div key={m.label} style={{ textAlign: "center" }}>
            <div style={{ fontSize: "0.48rem", color: "#6b7280", letterSpacing: "0.08em", marginBottom: 2 }}>{m.label}</div>
            <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "#e2e2f0", fontVariantNumeric: "tabular-nums" }}>{m.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
