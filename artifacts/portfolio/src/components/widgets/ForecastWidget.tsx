import { useEffect, useRef, useState } from "react";
import { useInView } from "../useInView";

const DOMAINS = ["Airline Bookings", "E-Commerce", "Payments"];
const ACCENT = "#6366f1";
const DOMAIN_COLORS = ["#6366f1", "#8b5cf6", "#a78bfa"];

const METRICS: Record<number, { rmse: string; r2: string; mape: string; mae: string }> = {
  0: { rmse: "0.032", r2: "0.94", mape: "3.1%", mae: "0.024" },
  1: { rmse: "0.040", r2: "0.92", mape: "3.8%", mae: "0.031" },
  2: { rmse: "0.048", r2: "0.90", mape: "4.5%", mae: "0.038" },
};

function smoothPath(points: number[], w: number, h: number, px: number, py: number): string {
  const iw = w - px * 2, ih = h - py * 2;
  const toX = (i: number) => px + (i / (points.length - 1)) * iw;
  const toY = (v: number) => py + (1 - v) * ih;
  if (points.length < 2) return "";
  let d = `M${toX(0).toFixed(1)},${toY(points[0]).toFixed(1)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const x0 = toX(i), y0 = toY(points[i]);
    const x1 = toX(i + 1), y1 = toY(points[i + 1]);
    const cpx = (x0 + x1) / 2;
    d += ` C${cpx.toFixed(1)},${y0.toFixed(1)} ${cpx.toFixed(1)},${y1.toFixed(1)} ${x1.toFixed(1)},${y1.toFixed(1)}`;
  }
  return d;
}

function generateWave(frame: number, offset: number): number[] {
  return Array.from({ length: 30 }, (_, i) => {
    const x = i / 29;
    const base = 0.45 + 0.18 * Math.sin(x * Math.PI * 2 + offset);
    const trend = 0.12 * x;
    const noise = 0.06 * Math.sin(frame * 0.025 + i * 0.7 + offset * 3);
    return Math.max(0.06, Math.min(0.96, base + trend + noise));
  });
}

function generateBand(points: number[], spread: number): { upper: number[]; lower: number[] } {
  return {
    upper: points.map(v => Math.min(0.99, v + spread + Math.random() * 0.02)),
    lower: points.map(v => Math.max(0.01, v - spread - Math.random() * 0.02)),
  };
}

export default function ForecastWidget() {
  const { ref: containerRef, inView } = useInView("200px 0px");
  const [domain, setDomain] = useState(0);
  const [actual, setActual] = useState(() => generateWave(0, 0));
  const [predicted, setPredicted] = useState(() => generateWave(0, 0.3));
  const [confidence, setConfidence] = useState(() => generateBand(generateWave(0, 0.3), 0.1));
  const [forecastIdx] = useState(20); // index where forecast begins
  const frameRef = useRef(0);
  const rafRef = useRef(0);
  const inViewRef = useRef(false);
  useEffect(() => { inViewRef.current = inView; }, [inView]);

  // Auto-cycle domains
  useEffect(() => {
    const interval = setInterval(() => {
      setDomain(d => (d + 1) % DOMAINS.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  // Animation loop
  useEffect(() => {
    let accum = 0;
    const animate = () => {
      rafRef.current = requestAnimationFrame(animate);
      if (!inViewRef.current) return;
      frameRef.current++;
      accum++;
      if (accum >= 3) {
        accum = 0;
        const f = frameRef.current;
        const act = generateWave(f, domain * 2.1);
        const pred = generateWave(f, domain * 2.1 + 0.3);
        setActual(act);
        setPredicted(pred);
        setConfidence(generateBand(pred, 0.08 + domain * 0.015));
      }
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [domain]);

  const w = 260, h = 80, px = 14, py = 6;
  const iw = w - px * 2, ih = h - py * 2;
  const toX = (i: number) => px + (i / 29) * iw;
  const toY = (v: number) => py + (1 - v) * ih;

  const actualLine = smoothPath(actual, w, h, px, py);
  const predLine = smoothPath(predicted, w, h, px, py);

  // Confidence band as a filled area
  const upperPath = smoothPath(confidence.upper, w, h, px, py);
  const lowerPoints = [...confidence.lower].reverse();
  const lowerPath = smoothPath(lowerPoints.reverse(), w, h, px, py);
  // Build band polygon
  const bandUpper = confidence.upper.map((v, i) => `${toX(i).toFixed(1)},${toY(v).toFixed(1)}`);
  const bandLower = [...confidence.lower].reverse().map((v, i) => `${toX(29 - i).toFixed(1)},${toY(v).toFixed(1)}`);
  const bandPath = `M${bandUpper.join(" L")} L${bandLower.join(" L")} Z`;

  // Forecast divider position
  const dividerX = toX(forecastIdx);

  const m = METRICS[domain];
  const domainColor = DOMAIN_COLORS[domain];
  const lbl: React.CSSProperties = { fontSize: "0.36rem", color: "#4b5563", letterSpacing: "0.06em", textTransform: "uppercase", lineHeight: 1 };

  return (
    <div ref={containerRef} style={{
      width: "100%", height: "100%", background: "#0c0c18", borderRadius: 10,
      overflow: "hidden", fontFamily: "var(--font)", display: "flex", flexDirection: "column",
    }}>
      {/* Top bar */}
      <div style={{
        background: "rgba(0,0,0,0.5)", borderBottom: `1px solid ${ACCENT}18`,
        padding: "4px 10px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 7, height: 7, borderRadius: "50%", background: domainColor,
            boxShadow: `0 0 8px ${domainColor}90`, animation: "blink 2.5s ease infinite",
            transition: "background 0.3s, box-shadow 0.3s",
          }} />
          <span style={{ fontSize: "0.45rem", fontWeight: 700, color: domainColor, letterSpacing: "0.08em", transition: "color 0.3s" }}>DEMAND FORECAST</span>
          <span style={{ fontSize: "0.38rem", color: "#6b7280" }}>|</span>
          <span style={{ fontSize: "0.38rem", color: "#9ca3af" }}>XGBoost + LightGBM</span>
        </div>
        <span style={{ fontSize: "0.36rem", fontWeight: 700, color: "#22c55e", background: "rgba(34,197,94,0.12)", padding: "1px 5px", borderRadius: 3 }}>LIVE</span>
      </div>

      {/* Middle — chart + side stats */}
      <div style={{ flex: 1, display: "flex", minHeight: 0 }}>

        {/* Chart area */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>

          {/* Domain tabs */}
          <div style={{ display: "flex", gap: 3, padding: "6px 8px 0" }}>
            {DOMAINS.map((d, i) => (
              <button
                key={d}
                onClick={() => setDomain(i)}
                style={{
                  padding: "3px 8px", fontSize: "0.42rem", fontWeight: 600,
                  background: domain === i ? `${DOMAIN_COLORS[i]}18` : "transparent",
                  color: domain === i ? DOMAIN_COLORS[i] : "#4b5563",
                  border: `1px solid ${domain === i ? `${DOMAIN_COLORS[i]}35` : "transparent"}`,
                  borderRadius: 5, letterSpacing: "0.03em", transition: "all 0.25s",
                  cursor: "pointer",
                }}
              >
                {d}
              </button>
            ))}
          </div>

          {/* SVG Chart */}
          <div style={{ flex: 1, padding: "2px 4px", minHeight: 0 }}>
            <svg viewBox={`0 0 ${w} ${h}`} width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
              <defs>
                <linearGradient id="forecastBandGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={domainColor} stopOpacity="0.18" />
                  <stop offset="100%" stopColor={domainColor} stopOpacity="0.02" />
                </linearGradient>
                <linearGradient id="actualLineGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#9ca3af" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#e2e2f0" stopOpacity="0.9" />
                </linearGradient>
                <linearGradient id="predLineGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor={domainColor} stopOpacity="0.4" />
                  <stop offset="70%" stopColor={domainColor} stopOpacity="0.9" />
                  <stop offset="100%" stopColor={domainColor} stopOpacity="1" />
                </linearGradient>
                <filter id="predGlow">
                  <feGaussianBlur stdDeviation="1.2" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Grid */}
              {[0.2, 0.4, 0.6, 0.8].map(v => (
                <line key={v} x1={px} x2={w - px} y1={toY(v)} y2={toY(v)} stroke="#ffffff06" strokeWidth="0.4" />
              ))}
              {[0.2, 0.4, 0.6, 0.8].map(v => (
                <text key={`l${v}`} x={px - 1} y={toY(v) + 1.5} textAnchor="end" fill="#4b5563" fontSize="3">{v.toFixed(1)}</text>
              ))}

              {/* Forecast zone shading */}
              <rect x={dividerX} y={py} width={w - px - dividerX} height={ih} fill={`${domainColor}06`} />

              {/* Forecast divider */}
              <line x1={dividerX} x2={dividerX} y1={py} y2={h - py}
                stroke={domainColor} strokeWidth="0.5" strokeDasharray="2,2" opacity="0.35" />
              <text x={dividerX + 2} y={py + 5} fill={domainColor} fontSize="3" opacity="0.5">FORECAST</text>
              <text x={dividerX - 2} y={py + 5} textAnchor="end" fill="#6b7280" fontSize="3" opacity="0.5">ACTUAL</text>

              {/* Confidence band */}
              <path d={bandPath} fill="url(#forecastBandGrad)" />

              {/* Actual data line */}
              <path d={actualLine} fill="none" stroke="url(#actualLineGrad)" strokeWidth="1.2"
                strokeLinecap="round" strokeLinejoin="round" />

              {/* Predicted line with glow */}
              <path d={predLine} fill="none" stroke="url(#predLineGrad)" strokeWidth="1.5"
                strokeLinecap="round" strokeLinejoin="round" filter="url(#predGlow)" />

              {/* Data points on actual line (sparse) */}
              {actual.filter((_, i) => i % 4 === 0 && i <= forecastIdx).map((v, idx) => {
                const i = idx * 4;
                return (
                  <circle key={`a${i}`} cx={toX(i)} cy={toY(v)} r="1.3" fill="#e2e2f0" opacity="0.5" />
                );
              })}

              {/* Prediction endpoint */}
              {(() => {
                const last = predicted[predicted.length - 1];
                const cx = toX(29), cy = toY(last);
                return (
                  <g>
                    <circle cx={cx} cy={cy} r="6" fill={domainColor} opacity="0.08">
                      <animate attributeName="r" values="4;8;4" dur="2s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.12;0.03;0.12" dur="2s" repeatCount="indefinite" />
                    </circle>
                    <circle cx={cx} cy={cy} r="2" fill={domainColor}>
                      <animate attributeName="opacity" values="1;0.5;1" dur="1.2s" repeatCount="indefinite" />
                    </circle>
                  </g>
                );
              })()}

              {/* Legend */}
              <line x1={px} x2={px + 12} y1={h - 2} y2={h - 2} stroke="#9ca3af" strokeWidth="1" opacity="0.5" />
              <text x={px + 14} y={h - 0.5} fill="#6b7280" fontSize="3">Actual</text>
              <line x1={px + 38} x2={px + 50} y1={h - 2} y2={h - 2} stroke={domainColor} strokeWidth="1.2" />
              <text x={px + 52} y={h - 0.5} fill="#6b7280" fontSize="3">Predicted</text>
              <rect x={px + 78} y={h - 4} width={8} height={3} fill={domainColor} opacity="0.15" rx="0.5" />
              <text x={px + 88} y={h - 0.5} fill="#6b7280" fontSize="3">90% CI</text>
            </svg>
          </div>
        </div>

        {/* Right panel — model info */}
        <div style={{
          width: 82, flexShrink: 0, padding: "6px 6px", display: "flex", flexDirection: "column",
          borderLeft: "1px solid rgba(255,255,255,0.04)", gap: 6, overflow: "hidden",
        }}>
          <div style={{ ...lbl, marginBottom: 0 }}>ENSEMBLE</div>

          {/* Stacking diagram */}
          <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {["XGBoost", "LightGBM"].map((name, i) => (
              <div key={name} style={{
                background: `${domainColor}0a`, border: `1px solid ${domainColor}20`,
                borderRadius: 4, padding: "3px 5px",
              }}>
                <div style={{ fontSize: "0.36rem", color: domainColor, fontWeight: 600 }}>{name}</div>
                <div style={{ fontSize: "0.32rem", color: "#4b5563" }}>Base learner {i + 1}</div>
              </div>
            ))}
            <div style={{ textAlign: "center", fontSize: "0.32rem", color: "#4b5563" }}>↓ stacking</div>
            <div style={{
              background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.2)",
              borderRadius: 4, padding: "3px 5px",
            }}>
              <div style={{ fontSize: "0.36rem", color: "#22c55e", fontWeight: 600 }}>Ridge</div>
              <div style={{ fontSize: "0.32rem", color: "#4b5563" }}>Meta-learner</div>
            </div>
          </div>

          {/* Feature engineering */}
          <div>
            <div style={{ ...lbl, marginBottom: 3 }}>FEATURES</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              {["Cyclical", "Rolling μ", "Lag-7", "Trend"].map(f => (
                <span key={f} style={{
                  fontSize: "0.32rem", color: "#9ca3af", background: "rgba(255,255,255,0.04)",
                  padding: "1px 4px", borderRadius: 3, border: "1px solid rgba(255,255,255,0.06)",
                }}>{f}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom metrics bar */}
      <div style={{
        background: "rgba(0,0,0,0.45)", borderTop: `1px solid ${ACCENT}12`,
        padding: "5px 10px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0,
      }}>
        {[
          { label: "RMSE", value: m.rmse },
          { label: "R²", value: m.r2 },
          { label: "MAPE", value: m.mape },
          { label: "MAE", value: m.mae },
        ].map(metric => (
          <div key={metric.label} style={{ textAlign: "center" }}>
            <div style={{ fontSize: "0.34rem", color: "#4b5563", letterSpacing: "0.08em", marginBottom: 1 }}>{metric.label}</div>
            <div style={{ fontSize: "0.58rem", fontWeight: 700, color: "#e2e2f0", fontVariantNumeric: "tabular-nums", fontFamily: "monospace" }}>{metric.value}</div>
          </div>
        ))}
        {/* Confidence level */}
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "0.34rem", color: "#4b5563", letterSpacing: "0.08em", marginBottom: 1 }}>CONF.</div>
          <div style={{ fontSize: "0.58rem", fontWeight: 700, color: domainColor, fontVariantNumeric: "tabular-nums", fontFamily: "monospace", transition: "color 0.3s" }}>90%</div>
        </div>
      </div>
    </div>
  );
}
