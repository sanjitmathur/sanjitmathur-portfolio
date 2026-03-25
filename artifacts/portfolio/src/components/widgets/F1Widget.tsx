import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function checkWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(window.WebGLRenderingContext && (c.getContext("webgl") || c.getContext("experimental-webgl")));
  } catch { return false; }
}

function F1Car({ hovered }: { hovered: boolean }) {
  const group = useRef<THREE.Group>(null!);

  useFrame((_, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * (hovered ? 2.2 : 0.7);
    }
  });

  const bodyColor = "#c8102e";
  const darkColor = "#111";
  const silverColor = "#888888";
  const carbonColor = "#1a1a1a";
  const tireColor = "#1c1c1c";
  const rimColor = "#aaaaaa";

  return (
    <group ref={group} position={[0, 0, 0]}>
      {/* === MAIN CHASSIS === */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[0.52, 0.14, 2.0]} />
        <meshStandardMaterial color={bodyColor} roughness={0.25} metalness={0.7} />
      </mesh>

      {/* Nose cone */}
      <mesh position={[0, 0.01, 1.18]}>
        <boxGeometry args={[0.28, 0.1, 0.32]} />
        <meshStandardMaterial color={bodyColor} roughness={0.25} metalness={0.7} />
      </mesh>
      <mesh position={[0, 0.01, 1.32]}>
        <boxGeometry args={[0.16, 0.07, 0.1]} />
        <meshStandardMaterial color={carbonColor} roughness={0.3} metalness={0.5} />
      </mesh>

      {/* Engine cover / hump */}
      <mesh position={[0, 0.14, -0.1]}>
        <boxGeometry args={[0.38, 0.16, 0.9]} />
        <meshStandardMaterial color={bodyColor} roughness={0.2} metalness={0.75} />
      </mesh>

      {/* Cockpit opening */}
      <mesh position={[0, 0.17, 0.2]}>
        <boxGeometry args={[0.26, 0.08, 0.42]} />
        <meshStandardMaterial color={carbonColor} roughness={0.6} metalness={0.2} />
      </mesh>

      {/* Driver helmet */}
      <mesh position={[0, 0.235, 0.18]}>
        <sphereGeometry args={[0.1, 16, 12]} />
        <meshStandardMaterial color="#f5f5f5" roughness={0.3} metalness={0.4} />
      </mesh>
      <mesh position={[0, 0.235, 0.24]}>
        <boxGeometry args={[0.09, 0.055, 0.04]} />
        <meshStandardMaterial color="#1db954" roughness={0.1} metalness={0.1} />
      </mesh>

      {/* === SIDEPODS === */}
      {[-1, 1].map(side => (
        <group key={side}>
          <mesh position={[side * 0.36, -0.01, -0.1]}>
            <boxGeometry args={[0.2, 0.12, 1.0]} />
            <meshStandardMaterial color={bodyColor} roughness={0.25} metalness={0.7} />
          </mesh>
          {/* Radiator intake */}
          <mesh position={[side * 0.46, 0.0, 0.18]}>
            <boxGeometry args={[0.04, 0.09, 0.22]} />
            <meshStandardMaterial color={carbonColor} roughness={0.5} />
          </mesh>
        </group>
      ))}

      {/* === FRONT WING === */}
      <mesh position={[0, -0.075, 1.38]}>
        <boxGeometry args={[1.15, 0.025, 0.18]} />
        <meshStandardMaterial color={carbonColor} roughness={0.3} metalness={0.5} />
      </mesh>
      <mesh position={[0, -0.04, 1.3]}>
        <boxGeometry args={[0.95, 0.03, 0.1]} />
        <meshStandardMaterial color={bodyColor} roughness={0.2} metalness={0.8} />
      </mesh>
      {/* Wing endplates */}
      {[-1, 1].map(s => (
        <mesh key={s} position={[s * 0.575, -0.055, 1.36]}>
          <boxGeometry args={[0.02, 0.06, 0.2]} />
          <meshStandardMaterial color={carbonColor} roughness={0.3} />
        </mesh>
      ))}

      {/* === REAR WING === */}
      <mesh position={[0, 0.38, -1.05]}>
        <boxGeometry args={[1.0, 0.04, 0.22]} />
        <meshStandardMaterial color={bodyColor} roughness={0.2} metalness={0.8} />
      </mesh>
      <mesh position={[0, 0.32, -1.05]}>
        <boxGeometry args={[0.9, 0.035, 0.15]} />
        <meshStandardMaterial color={bodyColor} roughness={0.2} metalness={0.8} />
      </mesh>
      {/* Wing pillars */}
      {[-1, 1].map(s => (
        <mesh key={s} position={[s * 0.46, 0.22, -1.06]}>
          <boxGeometry args={[0.03, 0.22, 0.06]} />
          <meshStandardMaterial color={carbonColor} roughness={0.3} />
        </mesh>
      ))}
      {/* Wing endplates */}
      {[-1, 1].map(s => (
        <mesh key={s} position={[s * 0.5, 0.34, -1.04]}>
          <boxGeometry args={[0.025, 0.14, 0.28]} />
          <meshStandardMaterial color={carbonColor} roughness={0.3} />
        </mesh>
      ))}

      {/* === DIFFUSER === */}
      <mesh position={[0, -0.09, -1.12]}>
        <boxGeometry args={[0.5, 0.04, 0.2]} />
        <meshStandardMaterial color={carbonColor} roughness={0.4} />
      </mesh>

      {/* === WHEELS (4) === */}
      {/* Front-left */}
      <group position={[-0.66, -0.075, 0.78]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.2, 0.2, 0.18, 20]} />
          <meshStandardMaterial color={tireColor} roughness={0.9} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.12, 0.12, 0.19, 8]} />
          <meshStandardMaterial color={rimColor} roughness={0.1} metalness={0.9} />
        </mesh>
        {/* Brake disc glow */}
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.09, 0.09, 0.2, 16]} />
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={hovered ? 0.8 : 0.2} roughness={0.4} />
        </mesh>
        {/* Suspension arm */}
        <mesh position={[0.28, 0.03, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.015, 0.015, 0.52, 6]} />
          <meshStandardMaterial color={silverColor} metalness={0.8} />
        </mesh>
      </group>
      {/* Front-right */}
      <group position={[0.66, -0.075, 0.78]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.2, 0.2, 0.18, 20]} />
          <meshStandardMaterial color={tireColor} roughness={0.9} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.12, 0.12, 0.19, 8]} />
          <meshStandardMaterial color={rimColor} roughness={0.1} metalness={0.9} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.09, 0.09, 0.2, 16]} />
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={hovered ? 0.8 : 0.2} roughness={0.4} />
        </mesh>
        <mesh position={[-0.28, 0.03, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.015, 0.015, 0.52, 6]} />
          <meshStandardMaterial color={silverColor} metalness={0.8} />
        </mesh>
      </group>
      {/* Rear-left */}
      <group position={[-0.72, -0.055, -0.82]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.24, 0.24, 0.22, 20]} />
          <meshStandardMaterial color={tireColor} roughness={0.9} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.14, 0.14, 0.23, 8]} />
          <meshStandardMaterial color={rimColor} roughness={0.1} metalness={0.9} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.1, 0.1, 0.24, 16]} />
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={hovered ? 0.8 : 0.2} roughness={0.4} />
        </mesh>
      </group>
      {/* Rear-right */}
      <group position={[0.72, -0.055, -0.82]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.24, 0.24, 0.22, 20]} />
          <meshStandardMaterial color={tireColor} roughness={0.9} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.14, 0.14, 0.23, 8]} />
          <meshStandardMaterial color={rimColor} roughness={0.1} metalness={0.9} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.1, 0.1, 0.24, 16]} />
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={hovered ? 0.8 : 0.2} roughness={0.4} />
        </mesh>
      </group>

      {/* === EXHAUST === */}
      <mesh position={[0.12, 0.04, -1.04]} rotation={[Math.PI / 12, 0, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.12, 8]} />
        <meshStandardMaterial color={silverColor} metalness={0.9} roughness={0.1}
          emissive="#f97316" emissiveIntensity={hovered ? 1.5 : 0.4} />
      </mesh>
    </group>
  );
}

export default function F1Widget() {
  const [speed, setSpeed] = useState(0);
  const [gear, setGear] = useState(1);
  const [throttle, setThrottle] = useState(0);
  const [brake, setBrake] = useState(0);
  const [rpm, setRpm] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [webgl, setWebgl] = useState(true);

  useEffect(() => { setWebgl(checkWebGL()); }, []);

  useEffect(() => {
    let frame = 0;
    const id = setInterval(() => {
      frame++;
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

  const r = 38, cx = 50, cy = 55;
  const maxAngle = 240, startAngle = -210;
  const angle = startAngle + (speed / 330) * maxAngle;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const arcEnd = { x: cx + r * Math.cos(toRad(angle)), y: cy + r * Math.sin(toRad(angle)) };
  const arcStart = { x: cx + r * Math.cos(toRad(startAngle)), y: cy + r * Math.sin(toRad(startAngle)) };
  const largeArc = (speed / 330) * maxAngle > 180 ? 1 : 0;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ width: "100%", height: "100%", background: "#0a0a0f", borderRadius: 12, display: "flex", flexDirection: "column", gap: 0, fontFamily: "var(--font)", overflow: "hidden" }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px 0" }}>
        <div style={{ fontSize: "0.58rem", color: "#ef4444", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700 }}>F1 TELEMETRY</div>
        <div style={{ fontSize: "0.5rem", color: "#4b5563", background: "rgba(255,255,255,0.04)", padding: "2px 8px", borderRadius: 100 }}>
          {hovered ? "⚡ BOOST" : "LIVE · DRS ON"}
        </div>
      </div>

      {/* 3D Canvas */}
      <div style={{ flex: 1, minHeight: 0 }}>
        {webgl ? (
          <Canvas
            camera={{ position: [2.2, 1.2, 2.5], fov: 45 }}
            gl={{ antialias: true, alpha: true }}
            style={{ background: "transparent" }}
          >
            <ambientLight intensity={0.4} />
            <directionalLight position={[5, 8, 5]} intensity={1.4} castShadow />
            <directionalLight position={[-4, 2, -3]} intensity={0.5} color="#d5b572" />
            <pointLight position={[0, 3, 0]} intensity={0.6} color="#ff6644" />
            {hovered && <pointLight position={[0, -0.5, -1]} intensity={2} color="#ef4444" distance={3} />}
            <F1Car hovered={hovered} />
          </Canvas>
        ) : (
          <svg viewBox="0 0 200 110" style={{ width: "100%", height: "100%" }}>
            <rect x="30" y="48" width="140" height="18" rx="4" fill="#c8102e" />
            <rect x="70" y="36" width="60" height="16" rx="4" fill="#c8102e" />
            <rect x="5" y="52" width="55" height="8" rx="2" fill="#aaa" />
            <rect x="140" y="52" width="55" height="8" rx="2" fill="#aaa" />
            <ellipse cx="55" cy="66" rx="13" ry="12" fill="#222" /><ellipse cx="55" cy="66" rx="7" ry="7" fill="#777" />
            <ellipse cx="145" cy="66" rx="13" ry="12" fill="#222" /><ellipse cx="145" cy="66" rx="7" ry="7" fill="#777" />
            <ellipse cx="75" cy="66" rx="10" ry="9" fill="#222" /><ellipse cx="75" cy="66" rx="5" ry="5" fill="#777" />
            <ellipse cx="125" cy="66" rx="10" ry="9" fill="#222" /><ellipse cx="125" cy="66" rx="5" ry="5" fill="#777" />
            <rect x="0" y="56" width="35" height="4" rx="2" fill="#888" />
            <rect x="165" y="56" width="35" height="4" rx="2" fill="#888" />
            <rect x="70" y="36" width="60" height="4" rx="2" fill="#ef4444" opacity="0.5" />
            <rect x="80" y="78" width="40" height="6" rx="2" fill="#aaa" />
            <rect x="75" y="34" width="50" height="6" rx="2" fill="#555" />
          </svg>
        )}
      </div>

      {/* Gauges row */}
      <div style={{ padding: "0 10px 8px", display: "flex", gap: 8 }}>
        {/* Mini speedometer */}
        <svg width="70" height="55" viewBox="0 0 100 75" style={{ flexShrink: 0 }}>
          <path d={`M${arcStart.x},${arcStart.y} A${r},${r} 0 1 1 ${cx + r * Math.cos(toRad(startAngle + maxAngle))},${cy + r * Math.sin(toRad(startAngle + maxAngle))}`}
            fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" strokeLinecap="round" />
          {speed > 10 && <path d={`M${arcStart.x},${arcStart.y} A${r},${r} 0 ${largeArc} 1 ${arcEnd.x},${arcEnd.y}`}
            fill="none" stroke="#ef4444" strokeWidth="5" strokeLinecap="round" />}
          <text x={cx} y={cy + 2} textAnchor="middle" fontSize="12" fontWeight="800" fill="#f5f5f7">{Math.round(speed)}</text>
          <text x={cx} y={cy + 13} textAnchor="middle" fontSize="5" fill="#6b7280">km/h</text>
          <text x={cx - 20} y={cy + 2} textAnchor="middle" fontSize="10" fontWeight="700" fill="#f59e0b">G{gear}</text>
        </svg>

        {/* Telemetry bars */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 5, justifyContent: "center" }}>
          {[
            { label: "THR", val: throttle, color: "#22c55e" },
            { label: "BRK", val: brake, color: "#ef4444" },
            { label: "RPM", val: rpm / 18500, color: "#f59e0b" },
          ].map(({ label, val, color }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ fontSize: "0.42rem", color: "#4b5563", width: 16 }}>{label}</span>
              <div style={{ flex: 1, height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${val * 100}%`, background: color, borderRadius: 2, transition: "width 0.1s linear" }} />
              </div>
              <span style={{ fontSize: "0.42rem", color: "#4b5563", width: 22, textAlign: "right" }}>{Math.round(val * 100)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
