import { useEffect, useState } from "react";

const LEVELS = [
  { label: "Good", color: "#22c55e", range: [0, 50] },
  { label: "Moderate", color: "#f59e0b", range: [51, 100] },
  { label: "Unhealthy", color: "#f97316", range: [101, 150] },
  { label: "Hazardous", color: "#ef4444", range: [151, 200] },
];

function getLevel(pm: number) {
  return LEVELS.find(l => pm >= l.range[0] && pm <= l.range[1]) || LEVELS[0];
}

export default function MedAirWidget() {
  const [pm, setPm] = useState(35);
  const [no2, setNo2] = useState(18);

  useEffect(() => {
    let t = 0;
    const id = setInterval(() => {
      t += 0.015;
      setPm(Math.max(10, Math.min(180, 80 + Math.sin(t) * 70 + Math.sin(t * 2.3) * 20)));
      setNo2(Math.max(5, Math.min(80, 35 + Math.sin(t * 1.5) * 30)));
    }, 80);
    return () => clearInterval(id);
  }, []);

  const level = getLevel(pm);

  // Gauge arc (270°)
  const r = 42, cx = 75, cy = 80;
  const maxAngle = 270, startDeg = 135;
  const filled = Math.min(1, pm / 200);
  const toRad = (d: number) => (d * Math.PI) / 180;
  const gaugeStart = { x: cx + r * Math.cos(toRad(startDeg)), y: cy + r * Math.sin(toRad(startDeg)) };
  const gaugeAngle = startDeg + filled * maxAngle;
  const gaugeEnd = { x: cx + r * Math.cos(toRad(gaugeAngle)), y: cy + r * Math.sin(toRad(gaugeAngle)) };
  const largeArc = filled * maxAngle > 180 ? 1 : 0;

  // Needle
  const needleDeg = startDeg + filled * maxAngle;
  const needleTip = { x: cx + (r - 6) * Math.cos(toRad(needleDeg)), y: cy + (r - 6) * Math.sin(toRad(needleDeg)) };

  return (
    <div style={{ width: "100%", height: "100%", background: "#050f08", borderRadius: 12, overflow: "hidden", fontFamily: "var(--font)", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ padding: "10px 14px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: "0.6rem", color: level.color, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700 }}>AIR QUALITY</div>
        <div style={{ fontSize: "0.5rem", color: "#4b5563", display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ color: "#f59e0b", fontSize: "0.6rem" }}>🏆</span>
          <span style={{ color: "#f59e0b" }}>Platinum + Gold</span>
        </div>
      </div>

      {/* Main gauge + readings */}
      <div style={{ flex: 1, display: "flex" }}>
        {/* Gauge */}
        <svg width="150" height="130" viewBox="0 0 150 130">
          {/* Background arc */}
          <path
            d={`M${gaugeStart.x},${gaugeStart.y} A${r},${r} 0 1 1 ${cx + r * Math.cos(toRad(startDeg + maxAngle))},${cy + r * Math.sin(toRad(startDeg + maxAngle))}`}
            fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" strokeLinecap="round"
          />
          {/* Colored arc */}
          {filled > 0.01 && (
            <path
              d={`M${gaugeStart.x},${gaugeStart.y} A${r},${r} 0 ${largeArc} 1 ${gaugeEnd.x},${gaugeEnd.y}`}
              fill="none" stroke={level.color} strokeWidth="8" strokeLinecap="round"
              style={{ transition: "stroke 0.6s ease, d 0.3s ease" }}
            />
          )}
          {/* Zone ticks */}
          {[0, 0.25, 0.5, 0.75, 1].map(frac => {
            const deg = startDeg + frac * maxAngle;
            return (
              <line key={frac}
                x1={cx + (r - 12) * Math.cos(toRad(deg))} y1={cy + (r - 12) * Math.sin(toRad(deg))}
                x2={cx + (r + 2) * Math.cos(toRad(deg))} y2={cy + (r + 2) * Math.sin(toRad(deg))}
                stroke="rgba(255,255,255,0.15)" strokeWidth="1"
              />
            );
          })}
          {/* Needle */}
          <line x1={cx} y1={cy} x2={needleTip.x} y2={needleTip.y} stroke={level.color} strokeWidth="1.5" strokeLinecap="round" style={{ transition: "all 0.3s ease" }} />
          <circle cx={cx} cy={cy} r={4} fill="#1f2937" stroke={level.color} strokeWidth="1.5" />
          {/* PM2.5 value */}
          <text x={cx} y={cy + 18} textAnchor="middle" fontSize="14" fontWeight="800" fill="#f5f5f7" style={{ transition: "fill 0.6s" }}>{Math.round(pm)}</text>
          <text x={cx} y={cy + 28} textAnchor="middle" fontSize="6" fill="#6b7280">PM2.5 μg/m³</text>
          {/* Level label */}
          <text x={cx} y={cy + 40} textAnchor="middle" fontSize="7" fontWeight="600" fill={level.color}>{level.label}</text>
        </svg>

        {/* Right side readings */}
        <div style={{ flex: 1, padding: "14px 14px 14px 0", display: "flex", flexDirection: "column", gap: 8, justifyContent: "center" }}>
          {/* NO2 */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
              <span style={{ fontSize: "0.52rem", color: "#6b7280" }}>NO₂</span>
              <span style={{ fontSize: "0.52rem", color: "#f5f5f7", fontWeight: 600 }}>{Math.round(no2)} ppb</span>
            </div>
            <div style={{ height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${(no2 / 80) * 100}%`, background: "#f59e0b", borderRadius: 2, transition: "width 0.3s" }} />
            </div>
          </div>
          {/* AQI */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
              <span style={{ fontSize: "0.52rem", color: "#6b7280" }}>AQI</span>
              <span style={{ fontSize: "0.52rem", color: level.color, fontWeight: 600 }}>{Math.round(pm * 0.85)}</span>
            </div>
            <div style={{ height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${Math.min(100, (pm / 200) * 100)}%`, background: level.color, borderRadius: 2, transition: "width 0.3s, background 0.6s" }} />
            </div>
          </div>
          {/* Raspberry Pi status */}
          <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 6, padding: "5px 8px" }}>
            <div style={{ fontSize: "0.48rem", color: "#4b5563", marginBottom: 2 }}>RASPBERRY PI · LIVE</div>
            <div style={{ display: "flex", gap: 4 }}>
              {["PM", "NO₂", "CO", "O₃"].map(g => (
                <div key={g} style={{ flex: 1, background: "rgba(255,255,255,0.04)", borderRadius: 3, padding: "2px 0", textAlign: "center" }}>
                  <div style={{ fontSize: "0.42rem", color: "#4b5563" }}>{g}</div>
                  <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#22c55e", margin: "1px auto", boxShadow: "0 0 4px #22c55e" }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
