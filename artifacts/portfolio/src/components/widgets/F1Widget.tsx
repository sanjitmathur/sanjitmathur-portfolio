import { Suspense, useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { useInView } from "../useInView";

const F1_MODEL_URL = `${import.meta.env.BASE_URL}models/f1_mercedes.glb`;

function checkWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(window.WebGLRenderingContext && (c.getContext("webgl") || c.getContext("experimental-webgl")));
  } catch { return false; }
}

const dragging = { current: false };

function F1Model() {
  const { scene } = useGLTF(F1_MODEL_URL);
  const groupRef = useRef<THREE.Group>(null!);
  const [modelScale, setModelScale] = useState(1);
  const [modelOffset, setModelOffset] = useState<[number, number, number]>([0, 0, 0]);

  // Auto-center and scale the model to fit
  useEffect(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);
    const maxDim = Math.max(size.x, size.y, size.z);
    const s = 3.2 / maxDim;
    setModelScale(s);
    setModelOffset([-center.x * s, -center.y * s, -center.z * s]);
  }, [scene]);

  useFrame((_, delta) => {
    if (!dragging.current && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.45;
    }
  });

  return (
    <group ref={groupRef} position={modelOffset} scale={modelScale}>
      <primitive object={scene} />
    </group>
  );
}

try { useGLTF.preload(F1_MODEL_URL); } catch {}

function F1FallbackSVG() {
  return (
    <svg viewBox="0 0 200 70" width="100%" height="100%" style={{ opacity: 0.85 }}>
      <rect x="28" y="28" width="144" height="16" rx="5" fill="#c8102e"/>
      <path d="M172 28 Q195 36 172 44 Z" fill="#c8102e" opacity="0.75"/>
      <path d="M28 28 L12 22 L18 36 L12 50 L28 44 Z" fill="#c8102e" opacity="0.6"/>
      <rect x="52" y="18" width="96" height="12" rx="4" fill="#c8102e" opacity="0.65"/>
      {[48,74,108,134].map(cx => (
        <g key={cx}>
          <circle cx={cx} cy="44" r="9" fill="#1c1c1c"/>
          <circle cx={cx} cy="44" r="4.5" fill="#888"/>
          <circle cx={cx} cy="20" r="9" fill="#1c1c1c"/>
          <circle cx={cx} cy="20" r="4.5" fill="#888"/>
        </g>
      ))}
    </svg>
  );
}

/* Miniature sparkline — 30 data points */
function Sparkline({ data, color, w = 60, h = 16 }: { data: number[]; color: string; w?: number; h?: number }) {
  const max = Math.max(...data), min = Math.min(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: "block" }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1" opacity="0.7" />
    </svg>
  );
}

export default function F1Widget() {
  const { ref: containerRef, inView } = useInView("200px 0px");
  const [hovered, setHovered] = useState(false);
  const [isTouch] = useState(() => typeof window !== "undefined" && ("ontouchstart" in window || navigator.maxTouchPoints > 0));
  const [webgl] = useState(() => !isTouch && checkWebGL());
  const [speed, setSpeed] = useState(0);
  const [rpm, setRpm] = useState(0);
  const [gear, setGear] = useState(1);
  const [tireFL, setTireFL] = useState(82);
  const [tireFR, setTireFR] = useState(84);
  const [tireRL, setTireRL] = useState(95);
  const [tireRR, setTireRR] = useState(97);
  const [throttle, setThrottle] = useState(0);
  const [brake, setBrake] = useState(0);
  const [drs, setDrs] = useState(false);
  const [lap, setLap] = useState("1:21.452");
  const [delta, setDelta] = useState("-0.127");
  const [fuel, setFuel] = useState(78);
  const [ersStore, setErsStore] = useState(62);
  const [speedHist, setSpeedHist] = useState<number[]>(() => Array(30).fill(180));
  const [trackPos, setTrackPos] = useState(0);
  const [sectors, setSectors] = useState([
    { time: "28.412", color: "#22c55e" },
    { time: "31.045", color: "#a855f7" },
    { time: "21.995", color: "#f59e0b" },
  ]);
  const [gForce, setGForce] = useState({ lat: 0, lon: 0 });

  useEffect(() => {
    let t = 0;
    const id = setInterval(() => {
      t += 0.018;
      const spd = Math.max(0, Math.min(330, 185 + Math.sin(t) * 120 + Math.sin(t * 1.7) * 35));
      const spdRound = Math.round(spd);
      setSpeed(spdRound);
      setRpm(Math.round(3000 + (spd / 330) * 12000 + Math.sin(t * 4) * 500));
      setGear(Math.min(8, Math.max(1, Math.round(1 + spd / 42))));
      setTireFL(Math.round(75 + Math.sin(t * 0.7) * 18));
      setTireFR(Math.round(78 + Math.sin(t * 0.8 + 0.5) * 16));
      setTireRL(Math.round(90 + Math.sin(t * 0.6 + 1) * 14));
      setTireRR(Math.round(93 + Math.sin(t * 0.5 + 1.5) * 12));
      setThrottle(Math.round(Math.max(0, Math.min(100, 60 + Math.sin(t * 2.3) * 40))));
      setBrake(Math.round(Math.max(0, Math.min(100, Math.max(0, -Math.sin(t * 2.3) * 60)))));
      setDrs(spd > 280);
      setFuel(Math.round(78 - (t * 0.02) % 20));
      setErsStore(Math.round(50 + Math.sin(t * 0.4) * 40));
      setSpeedHist(prev => [...prev.slice(-29), spdRound]);

      // Track position (0-1 loop)
      setTrackPos((t * 0.15) % 1);

      // G-force from throttle/brake (longitudinal) and speed changes (lateral)
      const lonG = (Math.sin(t * 2.3) > 0 ? Math.sin(t * 2.3) * 3.5 : Math.sin(t * 2.3) * 4.5);
      const latG = Math.sin(t * 1.1) * 2.8;
      setGForce({ lat: latG, lon: lonG });

      // Cycle sectors
      const sectorSets = [
        [{ time: "28.412", color: "#22c55e" }, { time: "31.045", color: "#a855f7" }, { time: "21.995", color: "#f59e0b" }],
        [{ time: "28.301", color: "#a855f7" }, { time: "31.224", color: "#f59e0b" }, { time: "22.112", color: "#22c55e" }],
        [{ time: "28.589", color: "#f59e0b" }, { time: "30.897", color: "#22c55e" }, { time: "21.801", color: "#a855f7" }],
      ];
      setSectors(sectorSets[Math.floor(t * 0.3) % 3]);

      // Cycle lap times
      const laps = ["1:21.452", "1:22.014", "1:21.789", "1:20.998"];
      const deltas = ["-0.127", "+0.435", "+0.210", "-0.581"];
      const li = Math.floor(t * 0.3) % 4;
      setLap(laps[li]);
      setDelta(deltas[li]);
    }, 80);
    return () => clearInterval(id);
  }, []);

  const rpmPct = Math.min(1, rpm / 15000);
  const rpmColor = rpmPct > 0.85 ? "#ef4444" : rpmPct > 0.65 ? "#f59e0b" : "#22c55e";

  function tireColor(t: number) {
    if (t > 100) return "#ef4444";
    if (t > 88) return "#f59e0b";
    return "#22c55e";
  }

  const lbl: React.CSSProperties = { fontSize: "0.38rem", color: "#4b5563", letterSpacing: "0.05em", textTransform: "uppercase", lineHeight: 1 };
  const val: React.CSSProperties = { fontSize: "0.55rem", fontWeight: 700, fontFamily: "monospace", lineHeight: 1.4 };

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", height: "100%", background: "#0a0706", borderRadius: 10, overflow: "hidden", display: "flex", flexDirection: "column" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Top bar — position, lap, delta, DRS */}
      <div style={{
        background: "rgba(0,0,0,0.6)", borderBottom: "1px solid rgba(200,16,46,0.15)",
        padding: "4px 10px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: "0.42rem", fontWeight: 700, color: "#c8102e", letterSpacing: "0.1em" }}>F1 · 2026</span>
          <span style={{ fontSize: "0.42rem", color: "#6b7280" }}>|</span>
          <span style={{ fontSize: "0.42rem", color: "#9ca3af" }}>P1</span>
          <span style={{ fontSize: "0.42rem", color: "#6b7280" }}>LAP 16/67</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: "0.48rem", fontWeight: 600, color: "#f5f5f7", fontFamily: "monospace" }}>{lap}</span>
          <span style={{ fontSize: "0.42rem", fontWeight: 600, color: delta.startsWith("-") ? "#22c55e" : "#ef4444", fontFamily: "monospace" }}>{delta}</span>
          {drs && <span style={{ fontSize: "0.38rem", fontWeight: 700, color: "#22c55e", background: "rgba(34,197,94,0.15)", padding: "1px 4px", borderRadius: 3 }}>DRS</span>}
        </div>
      </div>

      {/* Middle — 3D model + side gauges */}
      <div style={{ flex: 1, display: "flex", minHeight: 0 }}>

        {/* Left gauges */}
        <div style={{ width: 52, flexShrink: 0, padding: "6px 5px", display: "flex", flexDirection: "column", justifyContent: "space-between", borderRight: "1px solid rgba(255,255,255,0.04)" }}>
          {/* Speed */}
          <div>
            <div style={lbl}>SPD</div>
            <div style={{ ...val, fontSize: "0.85rem", color: "#f5f5f7" }}>{speed}</div>
            <div style={{ fontSize: "0.32rem", color: "#4b5563" }}>KM/H</div>
          </div>
          {/* Gear */}
          <div>
            <div style={lbl}>GEAR</div>
            <div style={{ ...val, fontSize: "0.75rem", color: "#d5b572" }}>{gear}</div>
          </div>
          {/* Throttle */}
          <div>
            <div style={lbl}>THR</div>
            <div style={{ height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 1, marginTop: 2 }}>
              <div style={{ height: "100%", width: `${throttle}%`, background: "#22c55e", borderRadius: 1, transition: "width 0.08s" }} />
            </div>
            <div style={{ ...val, fontSize: "0.42rem", color: "#22c55e" }}>{throttle}%</div>
          </div>
          {/* Brake */}
          <div>
            <div style={lbl}>BRK</div>
            <div style={{ height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 1, marginTop: 2 }}>
              <div style={{ height: "100%", width: `${brake}%`, background: "#ef4444", borderRadius: 1, transition: "width 0.08s" }} />
            </div>
            <div style={{ ...val, fontSize: "0.42rem", color: "#ef4444" }}>{brake}%</div>
          </div>
        </div>

        {/* 3D Model + HUD overlay */}
        <div
          style={{ flex: 1, position: "relative", minHeight: 0 }}
          onPointerDown={() => { dragging.current = true; }}
          onPointerUp={() => { dragging.current = false; }}
          onPointerLeave={() => { dragging.current = false; }}
        >
          {webgl && inView ? (
            <Canvas
              camera={{ position: [1.8, 0.7, 2.5], fov: 46 }}
              gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
              style={{ width: "100%", height: "100%" }}
            >
              <ambientLight intensity={0.55} />
              <directionalLight position={[5, 8, 5]} intensity={1.3} color="#fff8f0" />
              <directionalLight position={[-4, 3, -3]} intensity={0.45} color="#f0f0ff" />
              <pointLight position={[0, 1, 4]} intensity={hovered ? 1.0 : 0.5} color="#ef4444" />
              <Suspense fallback={null}>
                <F1Model />
              </Suspense>
              <OrbitControls enableZoom={false} enablePan={false} minPolarAngle={Math.PI / 5} maxPolarAngle={Math.PI / 1.7} dampingFactor={0.09} enableDamping />
            </Canvas>
          ) : (
            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: 12 }}>
              <F1FallbackSVG />
            </div>
          )}

          {/* === HUD Overlay === */}
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 3 }}>

            {/* Top-left: Sector times */}
            <div style={{ position: "absolute", top: 4, left: 4, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", borderRadius: 4, padding: "3px 5px", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ fontSize: "0.32rem", color: "#6b7280", letterSpacing: "0.06em", marginBottom: 2 }}>SECTORS</div>
              <div style={{ display: "flex", gap: 4 }}>
                {sectors.map((s, i) => (
                  <div key={i} style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "0.28rem", color: "#4b5563" }}>S{i + 1}</div>
                    <div style={{ fontSize: "0.4rem", fontWeight: 700, color: s.color, fontFamily: "monospace" }}>{s.time}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top-right: G-Force */}
            <div style={{ position: "absolute", top: 4, right: 4, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", borderRadius: 4, padding: "3px 5px", border: "1px solid rgba(255,255,255,0.06)", width: 40, height: 40 }}>
              <div style={{ fontSize: "0.28rem", color: "#6b7280", letterSpacing: "0.06em", textAlign: "center", marginBottom: 1 }}>G</div>
              <svg width="100%" height="28" viewBox="0 0 30 28">
                {/* Crosshair */}
                <line x1="15" y1="0" x2="15" y2="28" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
                <line x1="0" y1="14" x2="30" y2="14" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
                <circle cx="15" cy="14" r="10" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
                {/* G-force dot */}
                <circle
                  cx={15 + (gForce.lat / 5) * 12}
                  cy={14 - (gForce.lon / 5) * 12}
                  r="2.5"
                  fill="#c8102e"
                  style={{ filter: "drop-shadow(0 0 3px rgba(200,16,46,0.8))" }}
                />
              </svg>
            </div>

            {/* Bottom-left: Mini track map */}
            <div style={{ position: "absolute", bottom: 4, left: 4, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", borderRadius: 4, padding: "3px 5px", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ fontSize: "0.28rem", color: "#6b7280", letterSpacing: "0.06em", marginBottom: 1 }}>TRACK</div>
              <svg width="72" height="42" viewBox="0 0 48 28">
                {/* Simplified Melbourne circuit shape */}
                <path d="M8,22 L8,8 Q8,4 12,4 L36,4 Q42,4 42,8 L42,14 Q42,18 38,18 L28,18 Q24,18 24,22 Q24,26 20,26 L12,26 Q8,26 8,22 Z"
                  fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
                {/* Position dot on track */}
                {(() => {
                  const p = trackPos;
                  // Approximate position along the track path
                  const points = [
                    [8,22],[8,8],[12,4],[36,4],[42,8],[42,14],[38,18],[28,18],[24,22],[20,26],[12,26],[8,22]
                  ];
                  const idx = p * (points.length - 1);
                  const i = Math.floor(idx);
                  const f = idx - i;
                  const a = points[Math.min(i, points.length - 1)];
                  const b = points[Math.min(i + 1, points.length - 1)];
                  const cx = a[0] + (b[0] - a[0]) * f;
                  const cy = a[1] + (b[1] - a[1]) * f;
                  return (
                    <>
                      <circle cx={cx} cy={cy} r="3.5" fill="rgba(200,16,46,0.25)" />
                      <circle cx={cx} cy={cy} r="2" fill="#c8102e" style={{ filter: "drop-shadow(0 0 2px rgba(200,16,46,0.9))" }} />
                    </>
                  );
                })()}
              </svg>
            </div>

            {/* Bottom-right: Gaps */}
            <div style={{ position: "absolute", bottom: 4, right: 4, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", borderRadius: 4, padding: "3px 5px", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ fontSize: "0.28rem", color: "#6b7280", letterSpacing: "0.06em", marginBottom: 2 }}>GAP</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
                  <span style={{ fontSize: "0.32rem", color: "#9ca3af", fontFamily: "monospace" }}>P2</span>
                  <span style={{ fontSize: "0.38rem", fontWeight: 700, color: "#22c55e", fontFamily: "monospace" }}>+0.8s</span>
                  <span style={{ fontSize: "0.3rem", color: "#6b7280" }}>VER</span>
                </div>
                <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
                  <span style={{ fontSize: "0.32rem", color: "#9ca3af", fontFamily: "monospace" }}>P3</span>
                  <span style={{ fontSize: "0.38rem", fontWeight: 700, color: "#f59e0b", fontFamily: "monospace" }}>+2.1s</span>
                  <span style={{ fontSize: "0.3rem", color: "#6b7280" }}>NOR</span>
                </div>
              </div>
            </div>

            {/* Center: "DRAG TO ROTATE" hint */}
            {hovered && inView && (
              <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", fontSize: "0.36rem", color: "rgba(255,255,255,0.25)", letterSpacing: "0.08em" }}>
                DRAG TO ROTATE
              </div>
            )}
          </div>
        </div>

        {/* Right gauges — tires + fuel/ERS */}
        <div style={{ width: 56, flexShrink: 0, padding: "6px 5px", display: "flex", flexDirection: "column", justifyContent: "space-between", borderLeft: "1px solid rgba(255,255,255,0.04)" }}>
          {/* Tire temps */}
          <div>
            <div style={{ ...lbl, marginBottom: 3 }}>TYRES °C</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2px" }}>
              {[{ l: "FL", v: tireFL }, { l: "FR", v: tireFR }, { l: "RL", v: tireRL }, { l: "RR", v: tireRR }].map(({ l, v: tv }) => (
                <div key={l} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 2, padding: "1px 2px", textAlign: "center", border: `1px solid ${tireColor(tv)}25` }}>
                  <div style={{ fontSize: "0.3rem", color: "#4b5563" }}>{l}</div>
                  <div style={{ fontSize: "0.45rem", fontWeight: 700, color: tireColor(tv), fontFamily: "monospace" }}>{tv}°</div>
                </div>
              ))}
            </div>
          </div>
          {/* Fuel */}
          <div>
            <div style={lbl}>FUEL</div>
            <div style={{ height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 1, marginTop: 2 }}>
              <div style={{ height: "100%", width: `${fuel}%`, background: "#f59e0b", borderRadius: 1, transition: "width 0.3s" }} />
            </div>
            <div style={{ ...val, fontSize: "0.42rem", color: "#f59e0b" }}>{fuel}%</div>
          </div>
          {/* ERS */}
          <div>
            <div style={lbl}>ERS</div>
            <div style={{ height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 1, marginTop: 2 }}>
              <div style={{ height: "100%", width: `${ersStore}%`, background: "#3b82f6", borderRadius: 1, transition: "width 0.15s" }} />
            </div>
            <div style={{ ...val, fontSize: "0.42rem", color: "#3b82f6" }}>{ersStore}%</div>
          </div>
        </div>
      </div>

      {/* Bottom telemetry bar — RPM + speed sparkline */}
      <div style={{ background: "rgba(0,0,0,0.55)", borderTop: "1px solid rgba(200,16,46,0.15)", padding: "4px 10px", display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
        {/* RPM bar */}
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 1 }}>
            <span style={{ fontSize: "0.36rem", color: "#6b7280" }}>RPM</span>
            <span style={{ fontSize: "0.36rem", color: rpmColor, fontWeight: 600, fontFamily: "monospace" }}>{rpm.toLocaleString()}</span>
          </div>
          <div style={{ display: "flex", gap: 1 }}>
            {Array.from({ length: 15 }, (_, i) => (
              <div key={i} style={{
                flex: 1, height: 3, borderRadius: 1,
                background: i / 15 <= rpmPct
                  ? (i / 15 > 0.85 ? "#ef4444" : i / 15 > 0.65 ? "#f59e0b" : "#22c55e")
                  : "rgba(255,255,255,0.05)",
                transition: "background 0.08s",
              }} />
            ))}
          </div>
        </div>

        {/* Speed trace sparkline */}
        <div style={{ flexShrink: 0 }}>
          <div style={{ fontSize: "0.32rem", color: "#4b5563", marginBottom: 1 }}>SPEED TRACE</div>
          <Sparkline data={speedHist} color="#c8102e" w={56} h={14} />
        </div>
      </div>
    </div>
  );
}
