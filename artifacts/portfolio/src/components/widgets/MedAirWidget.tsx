import { useEffect, useRef, useState } from "react";
import { useInView } from "../useInView";

const MODES = ["STANDBY", "TAKEOFF", "CRUISE", "APPROACH", "DELIVER", "RTH"] as const;
type Mode = typeof MODES[number];

const MODE_COLOR: Record<Mode, string> = {
  STANDBY:  "#6b7280",
  TAKEOFF:  "#f59e0b",
  CRUISE:   "#3b82f6",
  APPROACH: "#8b5cf6",
  DELIVER:  "#22c55e",
  RTH:      "#ef4444",
};

// Altitude profile for the glowing dot (0=ground, 1=top)
const MODE_ALT_PCT: Record<Mode, number> = {
  STANDBY: 0.05,
  TAKEOFF: 0.45,
  CRUISE:  0.85,
  APPROACH: 0.55,
  DELIVER: 0.1,
  RTH:     0.4,
};

export default function MedAirWidget() {
  const { ref: containerRef, inView } = useInView("200px 0px");
  const inViewRef = useRef(false);
  useEffect(() => { inViewRef.current = inView; }, [inView]);
  const [modeIdx, setModeIdx] = useState(0);
  const [alt, setAlt]   = useState(0);
  const [spd, setSpd]   = useState(0);
  const [bat, setBat]   = useState(87);
  const [gps, setGps]   = useState(12);
  const [tick, setTick] = useState(0);

  const mode = MODES[modeIdx];
  const mColor = MODE_COLOR[mode];

  useEffect(() => {
    const id = setInterval(() => {
      if (!inViewRef.current) return;
      setTick(prev => {
        const next = prev + 1;
        const phase = Math.floor(next / 28) % MODES.length;
        setModeIdx(phase);
        const altMap: Record<number, number> = { 0: 0, 1: 35 + (next % 28) * 2.1, 2: 120, 3: 60, 4: 8, 5: 30 };
        const spdMap: Record<number, number> = { 0: 0, 1: 4 + (next % 28) * 0.5, 2: 22, 3: 12, 4: 2, 5: 18 };
        setAlt(Math.round(altMap[phase] ?? 0));
        setSpd(Math.round(spdMap[phase] ?? 0));
        setBat(b => Math.max(62, b - 0.04));
        setGps(10 + Math.round(Math.sin(next * 0.3) * 2));
        return next;
      });
    }, 120);
    return () => clearInterval(id);
  }, []);

  const missionPct = ((modeIdx + 1) / MODES.length) * 100;
  const batColor = bat > 70 ? "#22c55e" : bat > 40 ? "#f59e0b" : "#ef4444";
  const dotY = MODE_ALT_PCT[mode];
  // Horizontal sway based on tick
  const dotX = 0.5 + Math.sin(tick * 0.04) * 0.2;

  return (
    <div ref={containerRef} style={{ width: "100%", height: "100%", background: "#080c10", borderRadius: 12, overflow: "hidden", fontFamily: "var(--font)", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ padding: "9px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L4 8v4l8 2 8-2V8L12 2Z" fill={mColor} opacity="0.9"/>
            <path d="M4 12v6l8 4 8-4v-6" stroke={mColor} strokeWidth="1.2" fill="none" opacity="0.5"/>
          </svg>
          <span style={{ fontSize: "0.58rem", fontWeight: 700, color: "#e5e7eb", letterSpacing: "0.06em" }}>MEDAIR VTOL</span>
        </div>
        <span style={{ fontSize: "0.42rem", color: "#f59e0b", fontWeight: 600 }}>🏆 Platinum · Gold — DUIF</span>
      </div>

      {/* Mode strip */}
      <div style={{ padding: "6px 14px", display: "flex", gap: 3, background: "rgba(255,255,255,0.02)" }}>
        {MODES.map((m, i) => (
          <div key={m} style={{
            flex: 1, textAlign: "center", padding: "3px 0", borderRadius: 4,
            background: i === modeIdx ? mColor : "rgba(255,255,255,0.04)",
            border: `1px solid ${i === modeIdx ? mColor : "rgba(255,255,255,0.06)"}`,
            fontSize: "0.38rem", fontWeight: 700, color: i === modeIdx ? "#fff" : "#4b5563",
            letterSpacing: "0.04em", transition: "all 0.4s",
          }}>{m}</div>
        ))}
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", gap: 0, minHeight: 0 }}>
        {/* Left: altitude viz with glowing dot */}
        <div style={{ width: "44%", display: "flex", flexDirection: "column", borderRight: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ flex: 1, position: "relative", minHeight: 0 }}>
            <svg width="100%" height="100%" viewBox="0 0 50 50" preserveAspectRatio="xMidYMid meet" style={{ position: "absolute", inset: 0 }}>
              {/* Ground line */}
              <line x1="5" y1="45" x2="45" y2="45" stroke="rgba(255,255,255,0.1)" strokeWidth="0.4" />
              <text x="25" y="49" textAnchor="middle" fontSize="3" fill="#4b5563" letterSpacing="0.05em">GND</text>

              {/* Altitude scale lines */}
              {[0.25, 0.5, 0.75].map(p => (
                <line key={p} x1="5" y1={45 - p * 38} x2="45" y2={45 - p * 38} stroke="rgba(255,255,255,0.04)" strokeWidth="0.25" strokeDasharray="1.5 1.5" />
              ))}

              {/* Dashed altitude line from dot to ground */}
              <line
                x1={dotX * 36 + 7} y1={45 - dotY * 38}
                x2={dotX * 36 + 7} y2={45}
                stroke={mColor} strokeWidth="0.4" strokeDasharray="1 1" opacity="0.35"
              />

              {/* Glow rings */}
              <circle cx={dotX * 36 + 7} cy={45 - dotY * 38} r="7" fill={mColor} opacity="0.07" style={{ transition: "cx 0.3s, cy 0.8s ease" }} />
              <circle cx={dotX * 36 + 7} cy={45 - dotY * 38} r="4.5" fill={mColor} opacity="0.15" style={{ transition: "cx 0.3s, cy 0.8s ease" }} />
              <circle cx={dotX * 36 + 7} cy={45 - dotY * 38} r="2.5" fill={mColor} opacity="0.4" style={{ transition: "cx 0.3s, cy 0.8s ease" }} />
              <circle cx={dotX * 36 + 7} cy={45 - dotY * 38} r="1.5" fill="#fff" style={{ transition: "cx 0.3s, cy 0.8s ease", filter: `drop-shadow(0 0 3px ${mColor})` }} />

              {/* Mode label above dot */}
              <text x={dotX * 36 + 7} y={45 - dotY * 38 - 5} textAnchor="middle" fontSize="3.5" fontWeight="700" fill={mColor} style={{ transition: "x 0.3s, y 0.8s ease" }}>{mode}</text>

              {/* Alt readout below dot */}
              <text x={dotX * 36 + 7} y={45 - dotY * 38 + 5.5} textAnchor="middle" fontSize="2.8" fill="#9ca3af" fontFamily="monospace" style={{ transition: "x 0.3s, y 0.8s ease" }}>{alt}m</text>
            </svg>
          </div>

          {/* Metrics row */}
          <div style={{ display: "flex", gap: 12, justifyContent: "center", padding: "6px 6px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "#f1f5f9", letterSpacing: "-0.03em", lineHeight: 1 }}>{alt}</div>
              <div style={{ fontSize: "0.38rem", color: "#6b7280", letterSpacing: "0.06em", marginTop: 1 }}>ALT m</div>
            </div>
            <div style={{ width: 1, background: "rgba(255,255,255,0.07)" }} />
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "#f1f5f9", letterSpacing: "-0.03em", lineHeight: 1 }}>{spd}</div>
              <div style={{ fontSize: "0.38rem", color: "#6b7280", letterSpacing: "0.06em", marginTop: 1 }}>SPD m/s</div>
            </div>
          </div>
        </div>

        {/* Right: status */}
        <div style={{ flex: 1, padding: "10px 12px", display: "flex", flexDirection: "column", gap: 7 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.45rem", color: "#6b7280" }}>GPS SATS</span>
            <span style={{ fontSize: "0.5rem", color: "#22c55e", fontWeight: 600 }}>{gps} · FIX</span>
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
              <span style={{ fontSize: "0.45rem", color: "#6b7280" }}>BATTERY</span>
              <span style={{ fontSize: "0.5rem", color: batColor, fontWeight: 600 }}>{Math.round(bat)}%</span>
            </div>
            <div style={{ height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${bat}%`, background: batColor, borderRadius: 2, transition: "width 0.5s, background 0.5s" }} />
            </div>
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
              <span style={{ fontSize: "0.45rem", color: "#6b7280" }}>MISSION</span>
              <span style={{ fontSize: "0.5rem", color: mColor, fontWeight: 600 }}>{Math.round(missionPct)}%</span>
            </div>
            <div style={{ height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${missionPct}%`, background: mColor, borderRadius: 2, transition: "width 0.6s, background 0.6s" }} />
            </div>
          </div>

          <div style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${mColor}30`, borderRadius: 6, padding: "5px 8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: "0.38rem", color: "#4b5563", letterSpacing: "0.08em" }}>FLIGHT MODE</div>
              <div style={{ fontSize: "0.58rem", fontWeight: 700, color: mColor, letterSpacing: "0.04em", marginTop: 1 }}>{mode}</div>
            </div>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: mColor, boxShadow: `0 0 6px ${mColor}`, animation: "blink 1.5s ease infinite" }} />
          </div>

          <div style={{ display: "flex", gap: 3 }}>
            {["IMU", "BARO", "LIDAR", "CAM"].map(s => (
              <div key={s} style={{ flex: 1, background: "rgba(255,255,255,0.03)", borderRadius: 3, padding: "2px 0", textAlign: "center", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ fontSize: "0.36rem", color: "#4b5563" }}>{s}</div>
                <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#22c55e", margin: "1px auto", boxShadow: "0 0 4px #22c55e" }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
