import { useEffect, useRef, useState } from "react";

export default function F1Widget() {
  const [speed, setSpeed] = useState(0);
  const [gear, setGear] = useState(1);
  const [throttle, setThrottle] = useState(0);
  const [brake, setBrake] = useState(0);
  const [rpm, setRpm] = useState(0);
  const tRef = useRef(0);

  useEffect(() => {
    let frame = 0;
    const id = setInterval(() => {
      frame++;
      const t = frame / 60;
      // Simulate lap cycle (brake → accelerate → corner → brake)
      const cycle = (frame % 300) / 300;
      const s = cycle < 0.3 ? 180 + cycle * 500 :
                cycle < 0.5 ? 330 - (cycle - 0.3) * 800 :
                cycle < 0.8 ? 170 + (cycle - 0.5) * 700 : 330 - (cycle - 0.8) * 400;
      const thr = cycle < 0.3 ? 0.7 + Math.sin(frame * 0.15) * 0.2 : cycle < 0.5 ? 0.1 : 0.65 + Math.sin(frame * 0.12) * 0.25;
      const brk = cycle > 0.25 && cycle < 0.42 ? (0.42 - cycle) * 5 : 0;
      setSpeed(Math.max(60, Math.min(330, s + Math.sin(frame * 0.3) * 5)));
      setThrottle(Math.max(0, Math.min(1, thr)));
      setBrake(Math.max(0, Math.min(1, brk)));
      setGear(s < 120 ? 2 : s < 180 ? 3 : s < 240 ? 4 : s < 290 ? 5 : s < 310 ? 6 : 7);
      setRpm(Math.min(18500, (s / 330) * 18500 * (0.85 + Math.sin(frame * 0.2) * 0.15)));
    }, 50);
    return () => clearInterval(id);
  }, []);

  // Speedometer arc
  const r = 38, cx = 50, cy = 55;
  const maxAngle = 240, startAngle = -210;
  const angle = startAngle + (speed / 330) * maxAngle;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const arcEnd = {
    x: cx + r * Math.cos(toRad(angle)),
    y: cy + r * Math.sin(toRad(angle)),
  };
  const arcStart = { x: cx + r * Math.cos(toRad(startAngle)), y: cy + r * Math.sin(toRad(startAngle)) };
  const largeArc = (speed / 330) * maxAngle > 180 ? 1 : 0;

  return (
    <div style={{ width: "100%", height: "100%", background: "#0a0a0f", borderRadius: 12, padding: "10px 14px", display: "flex", flexDirection: "column", gap: 8, fontFamily: "var(--font)", overflow: "hidden" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: "0.6rem", color: "#ef4444", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700 }}>F1 TELEMETRY</div>
        <div style={{ fontSize: "0.5rem", color: "#4b5563", background: "rgba(255,255,255,0.04)", padding: "2px 8px", borderRadius: 100 }}>
          LIVE · DRS ON
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, flex: 1 }}>
        {/* Left: F1 Car SVG */}
        <div style={{ width: 100, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="90" height="120" viewBox="0 0 90 120">
            {/* Car body */}
            <path d="M38,10 L52,10 L58,20 L62,45 L62,85 L58,95 L52,105 L38,105 L32,95 L28,85 L28,45 L32,20 Z" fill="#ef4444" opacity="0.9" />
            {/* Cockpit */}
            <ellipse cx="45" cy="50" rx="8" ry="14" fill="#0a0a0f" stroke="#6b7280" strokeWidth="0.5" />
            {/* Driver helmet */}
            <ellipse cx="45" cy="42" rx="6" ry="7" fill="#f59e0b" />
            {/* Front wing */}
            <path d="M22,28 L68,28 L70,32 L20,32 Z" fill="#6b7280" />
            <path d="M18,28 L22,28 L28,42 L26,42 Z" fill="#374151" />
            <path d="M72,28 L68,28 L62,42 L64,42 Z" fill="#374151" />
            {/* Rear wing */}
            <path d="M20,90 L70,90 L68,95 L22,95 Z" fill="#6b7280" />
            {/* Side pods */}
            <path d="M20,38 L28,38 L28,75 L20,75 Z" fill="#dc2626" />
            <path d="M62,38 L70,38 L70,75 L62,75 Z" fill="#dc2626" />
            {/* Tyres - front */}
            <ellipse cx="24" cy="30" rx="7" ry="4" fill="#1f2937" stroke="#374151" strokeWidth="0.5" />
            <ellipse cx="66" cy="30" rx="7" ry="4" fill="#1f2937" stroke="#374151" strokeWidth="0.5" />
            {/* Tyres - rear */}
            <ellipse cx="22" cy="92" rx="8" ry="5" fill="#1f2937" stroke="#374151" strokeWidth="0.5" />
            <ellipse cx="68" cy="92" rx="8" ry="5" fill="#1f2937" stroke="#374151" strokeWidth="0.5" />
            {/* Exhaust glow */}
            <ellipse cx="45" cy="108" rx="5" ry="3" fill="#f97316" opacity="0.7" />
            <ellipse cx="45" cy="112" rx="3" ry="2" fill="#ef4444" opacity="0.4" />
          </svg>
        </div>

        {/* Right: gauges */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
          {/* Speedometer */}
          <svg width="100%" height="80" viewBox="0 0 100 75">
            {/* Track arc */}
            <path d={`M${arcStart.x},${arcStart.y} A${r},${r} 0 1 1 ${cx + r * Math.cos(toRad(startAngle + maxAngle))},${cy + r * Math.sin(toRad(startAngle + maxAngle))}`}
              fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" strokeLinecap="round" />
            {/* Speed arc */}
            {speed > 10 && <path d={`M${arcStart.x},${arcStart.y} A${r},${r} 0 ${largeArc} 1 ${arcEnd.x},${arcEnd.y}`}
              fill="none" stroke="#ef4444" strokeWidth="5" strokeLinecap="round" />}
            {/* Speed text */}
            <text x={cx} y={cy + 2} textAnchor="middle" fontSize="12" fontWeight="800" fill="#f5f5f7">{Math.round(speed)}</text>
            <text x={cx} y={cy + 13} textAnchor="middle" fontSize="5" fill="#6b7280">km/h</text>
            {/* Gear */}
            <text x={cx - 20} y={cy + 2} textAnchor="middle" fontSize="10" fontWeight="700" fill="#f59e0b">G{gear}</text>
          </svg>

          {/* Telemetry bars */}
          {[
            { label: "THR", val: throttle, color: "#22c55e" },
            { label: "BRK", val: brake, color: "#ef4444" },
            { label: "RPM", val: rpm / 18500, color: "#f59e0b" },
          ].map(({ label, val, color }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: "0.45rem", color: "#4b5563", width: 18 }}>{label}</span>
              <div style={{ flex: 1, height: 5, background: "rgba(255,255,255,0.06)", borderRadius: 3, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${val * 100}%`, background: color, borderRadius: 3, transition: "width 0.1s linear" }} />
              </div>
              <span style={{ fontSize: "0.45rem", color: "#4b5563", width: 24, textAlign: "right" }}>{Math.round(val * 100)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
