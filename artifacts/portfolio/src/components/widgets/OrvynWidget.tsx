import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function checkWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(window.WebGLRenderingContext && (c.getContext("webgl") || c.getContext("experimental-webgl")));
  } catch { return false; }
}

const FAWN = "#c8a85a";
const DARK = "#2a2820";
const JOINT = "#888060";
const ACCENT = "#d5b572";

interface FingerRefs {
  p1: THREE.Group | null;
  p2: THREE.Group | null;
  p3: THREE.Group | null;
}

function MechanicalHand({ hovered }: { hovered: boolean }) {
  const group = useRef<THREE.Group>(null!);
  const curlRef = useRef(0);

  const finger1 = useRef<FingerRefs>({ p1: null, p2: null, p3: null });
  const finger2 = useRef<FingerRefs>({ p1: null, p2: null, p3: null });
  const finger3 = useRef<FingerRefs>({ p1: null, p2: null, p3: null });
  const finger4 = useRef<FingerRefs>({ p1: null, p2: null, p3: null });
  const finger5 = useRef<FingerRefs>({ p1: null, p2: null, p3: null });

  const fingerList = [finger1, finger2, finger3, finger4, finger5];

  useFrame((_, delta) => {
    if (!group.current) return;
    group.current.rotation.y += delta * 0.5;

    const target = hovered ? 1 : 0;
    curlRef.current += (target - curlRef.current) * Math.min(1, delta * 4);
    const curl = curlRef.current;

    fingerList.forEach((fRef, idx) => {
      const f = fRef.current;
      if (!f.p1 || !f.p2 || !f.p3) return;
      const localCurl = Math.max(0, curl - idx * 0.08);
      const maxAngle = idx === 0 ? 1.0 : 1.4;
      const angle = Math.min(1, localCurl) * maxAngle;
      f.p1.rotation.x = -angle * 0.5;
      f.p2.rotation.x = -angle * 0.6;
      f.p3.rotation.x = -angle * 0.5;
    });
  });

  const emissiveIntensity = hovered ? 0.5 : 0.1;

  return (
    <group ref={group} position={[0, -0.3, 0]} rotation={[0.4, 0, 0]}>
      {/* Palm body */}
      <mesh castShadow>
        <boxGeometry args={[0.42, 0.08, 0.48]} />
        <meshStandardMaterial color={DARK} roughness={0.5} metalness={0.7} />
      </mesh>
      {/* Palm top plate */}
      <mesh position={[0, 0.046, 0]}>
        <boxGeometry args={[0.38, 0.01, 0.42]} />
        <meshStandardMaterial color={FAWN} roughness={0.3} metalness={0.85} />
      </mesh>
      {/* Panel lines */}
      {[-0.1, 0, 0.1].map(x => (
        <mesh key={x} position={[x, 0.047, 0]}>
          <boxGeometry args={[0.006, 0.012, 0.38]} />
          <meshStandardMaterial color="#18160c" />
        </mesh>
      ))}
      {/* Knuckle bar */}
      <mesh position={[0, 0.054, 0.22]}>
        <boxGeometry args={[0.4, 0.022, 0.032]} />
        <meshStandardMaterial color={JOINT} roughness={0.2} metalness={0.9} />
      </mesh>

      {/* === FINGERS === */}
      {/* Index finger */}
      <group position={[-0.13, 0.04, 0.25]}>
        <group ref={r => { if (r) finger1.current.p1 = r; }}>
          <mesh position={[0, 0.1, 0]}><capsuleGeometry args={[0.044, 0.14, 8, 6]} /><meshStandardMaterial color={FAWN} roughness={0.3} metalness={0.85} /></mesh>
          <mesh position={[0, 0.175, 0]}><sphereGeometry args={[0.052, 10, 8]} /><meshStandardMaterial color={JOINT} roughness={0.2} metalness={0.9} /></mesh>
          <group position={[0, 0.2, 0]} ref={r => { if (r) finger1.current.p2 = r; }}>
            <mesh position={[0, 0.08, 0]}><capsuleGeometry args={[0.038, 0.11, 8, 6]} /><meshStandardMaterial color={FAWN} roughness={0.3} metalness={0.85} /></mesh>
            <mesh position={[0, 0.14, 0]}><sphereGeometry args={[0.045, 10, 8]} /><meshStandardMaterial color={JOINT} roughness={0.2} metalness={0.9} /></mesh>
            <group position={[0, 0.16, 0]} ref={r => { if (r) finger1.current.p3 = r; }}>
              <mesh position={[0, 0.058, 0]}><capsuleGeometry args={[0.033, 0.08, 8, 6]} /><meshStandardMaterial color={FAWN} roughness={0.3} metalness={0.85} /></mesh>
              <mesh position={[0, 0.1, 0]}><sphereGeometry args={[0.038, 10, 8]} /><meshStandardMaterial color={ACCENT} roughness={0.1} metalness={0.95} emissive={ACCENT} emissiveIntensity={emissiveIntensity} /></mesh>
            </group>
          </group>
        </group>
      </group>

      {/* Middle finger */}
      <group position={[-0.04, 0.04, 0.27]}>
        <group ref={r => { if (r) finger2.current.p1 = r; }}>
          <mesh position={[0, 0.11, 0]}><capsuleGeometry args={[0.044, 0.16, 8, 6]} /><meshStandardMaterial color={FAWN} roughness={0.3} metalness={0.85} /></mesh>
          <mesh position={[0, 0.195, 0]}><sphereGeometry args={[0.052, 10, 8]} /><meshStandardMaterial color={JOINT} roughness={0.2} metalness={0.9} /></mesh>
          <group position={[0, 0.22, 0]} ref={r => { if (r) finger2.current.p2 = r; }}>
            <mesh position={[0, 0.09, 0]}><capsuleGeometry args={[0.038, 0.13, 8, 6]} /><meshStandardMaterial color={FAWN} roughness={0.3} metalness={0.85} /></mesh>
            <mesh position={[0, 0.16, 0]}><sphereGeometry args={[0.045, 10, 8]} /><meshStandardMaterial color={JOINT} roughness={0.2} metalness={0.9} /></mesh>
            <group position={[0, 0.18, 0]} ref={r => { if (r) finger2.current.p3 = r; }}>
              <mesh position={[0, 0.065, 0]}><capsuleGeometry args={[0.033, 0.09, 8, 6]} /><meshStandardMaterial color={FAWN} roughness={0.3} metalness={0.85} /></mesh>
              <mesh position={[0, 0.11, 0]}><sphereGeometry args={[0.038, 10, 8]} /><meshStandardMaterial color={ACCENT} roughness={0.1} metalness={0.95} emissive={ACCENT} emissiveIntensity={emissiveIntensity} /></mesh>
            </group>
          </group>
        </group>
      </group>

      {/* Ring finger */}
      <group position={[0.06, 0.04, 0.26]}>
        <group ref={r => { if (r) finger3.current.p1 = r; }}>
          <mesh position={[0, 0.1, 0]}><capsuleGeometry args={[0.044, 0.14, 8, 6]} /><meshStandardMaterial color={FAWN} roughness={0.3} metalness={0.85} /></mesh>
          <mesh position={[0, 0.175, 0]}><sphereGeometry args={[0.052, 10, 8]} /><meshStandardMaterial color={JOINT} roughness={0.2} metalness={0.9} /></mesh>
          <group position={[0, 0.2, 0]} ref={r => { if (r) finger3.current.p2 = r; }}>
            <mesh position={[0, 0.08, 0]}><capsuleGeometry args={[0.038, 0.12, 8, 6]} /><meshStandardMaterial color={FAWN} roughness={0.3} metalness={0.85} /></mesh>
            <mesh position={[0, 0.145, 0]}><sphereGeometry args={[0.045, 10, 8]} /><meshStandardMaterial color={JOINT} roughness={0.2} metalness={0.9} /></mesh>
            <group position={[0, 0.165, 0]} ref={r => { if (r) finger3.current.p3 = r; }}>
              <mesh position={[0, 0.055, 0]}><capsuleGeometry args={[0.033, 0.078, 8, 6]} /><meshStandardMaterial color={FAWN} roughness={0.3} metalness={0.85} /></mesh>
              <mesh position={[0, 0.096, 0]}><sphereGeometry args={[0.038, 10, 8]} /><meshStandardMaterial color={ACCENT} roughness={0.1} metalness={0.95} emissive={ACCENT} emissiveIntensity={emissiveIntensity} /></mesh>
            </group>
          </group>
        </group>
      </group>

      {/* Pinky */}
      <group position={[0.155, 0.04, 0.23]} rotation={[0, -0.18, 0]}>
        <group ref={r => { if (r) finger4.current.p1 = r; }}>
          <mesh position={[0, 0.08, 0]}><capsuleGeometry args={[0.038, 0.11, 8, 6]} /><meshStandardMaterial color={FAWN} roughness={0.3} metalness={0.85} /></mesh>
          <mesh position={[0, 0.14, 0]}><sphereGeometry args={[0.044, 10, 8]} /><meshStandardMaterial color={JOINT} roughness={0.2} metalness={0.9} /></mesh>
          <group position={[0, 0.16, 0]} ref={r => { if (r) finger4.current.p2 = r; }}>
            <mesh position={[0, 0.065, 0]}><capsuleGeometry args={[0.032, 0.09, 8, 6]} /><meshStandardMaterial color={FAWN} roughness={0.3} metalness={0.85} /></mesh>
            <mesh position={[0, 0.115, 0]}><sphereGeometry args={[0.038, 10, 8]} /><meshStandardMaterial color={JOINT} roughness={0.2} metalness={0.9} /></mesh>
            <group position={[0, 0.13, 0]} ref={r => { if (r) finger4.current.p3 = r; }}>
              <mesh position={[0, 0.045, 0]}><capsuleGeometry args={[0.028, 0.062, 8, 6]} /><meshStandardMaterial color={FAWN} roughness={0.3} metalness={0.85} /></mesh>
              <mesh position={[0, 0.077, 0]}><sphereGeometry args={[0.032, 10, 8]} /><meshStandardMaterial color={ACCENT} roughness={0.1} metalness={0.95} emissive={ACCENT} emissiveIntensity={emissiveIntensity} /></mesh>
            </group>
          </group>
        </group>
      </group>

      {/* Thumb */}
      <group position={[-0.22, 0.02, 0.06]} rotation={[0.15, 0.4, Math.PI / 5]}>
        <group ref={r => { if (r) finger5.current.p1 = r; }}>
          <mesh position={[0, 0.075, 0]}><capsuleGeometry args={[0.042, 0.1, 8, 6]} /><meshStandardMaterial color={FAWN} roughness={0.3} metalness={0.85} /></mesh>
          <mesh position={[0, 0.13, 0]}><sphereGeometry args={[0.048, 10, 8]} /><meshStandardMaterial color={JOINT} roughness={0.2} metalness={0.9} /></mesh>
          <group position={[0, 0.15, 0]} ref={r => { if (r) finger5.current.p2 = r; }}>
            <mesh position={[0, 0.055, 0]}><capsuleGeometry args={[0.036, 0.076, 8, 6]} /><meshStandardMaterial color={FAWN} roughness={0.3} metalness={0.85} /></mesh>
            <mesh position={[0, 0.095, 0]}><sphereGeometry args={[0.042, 10, 8]} /><meshStandardMaterial color={ACCENT} roughness={0.1} metalness={0.95} emissive={ACCENT} emissiveIntensity={emissiveIntensity} /></mesh>
            <group position={[0, 0.11, 0]} ref={r => { if (r) finger5.current.p3 = r; }}>
              <mesh position={[0, 0, 0]}><sphereGeometry args={[0.01, 4, 4]} /><meshStandardMaterial color="black" /></mesh>
            </group>
          </group>
        </group>
      </group>

      {/* Wrist */}
      <mesh position={[0, 0, -0.3]}>
        <cylinderGeometry args={[0.16, 0.18, 0.1, 16]} />
        <meshStandardMaterial color={DARK} roughness={0.5} metalness={0.7} />
      </mesh>
      <mesh position={[0, 0, -0.38]}>
        <cylinderGeometry args={[0.13, 0.155, 0.09, 16]} />
        <meshStandardMaterial color={FAWN} roughness={0.3} metalness={0.85} />
      </mesh>
      {/* Wrist accent ring */}
      <mesh position={[0, 0, -0.31]}>
        <torusGeometry args={[0.165, 0.012, 8, 20]} />
        <meshStandardMaterial color={ACCENT} roughness={0.1} metalness={0.95} emissive={ACCENT} emissiveIntensity={emissiveIntensity} />
      </mesh>
    </group>
  );
}

export default function OrvynWidget() {
  const [emg, setEmg] = useState(Array(20).fill(0));
  const [signal, setSignal] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [webgl, setWebgl] = useState(true);
  const hoveredRef = useRef(false);
  useEffect(() => { hoveredRef.current = hovered; }, [hovered]);
  useEffect(() => { setWebgl(checkWebGL()); }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setSignal(prev => {
        const n = prev + (Math.random() - 0.45) * 18;
        return Math.max(-30, Math.min(30, n));
      });
      setEmg(prev => {
        const noise = Math.random() * 60 - 30 + (hoveredRef.current ? 24 : 0);
        return [...prev.slice(1), noise];
      });
    }, 50);
    return () => clearInterval(id);
  }, []);

  const emgPath = emg.map((v, i) => `${i === 0 ? "M" : "L"}${(i / (emg.length - 1)) * 240},${30 + v}`).join(" ");

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ width: "100%", height: "100%", background: "#0c0d0a", borderRadius: 12, overflow: "hidden", fontFamily: "var(--font)", display: "flex", flexDirection: "column" }}
    >
      {/* Header */}
      <div style={{ padding: "10px 14px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: "0.6rem", color: "#d5b572", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700 }}>ORVYN EXOARM</div>
        <div style={{ fontSize: "0.5rem", color: hovered ? "#d5b572" : "#22c55e", display: "flex", alignItems: "center", gap: 4, transition: "color 0.3s" }}>
          <div style={{ width: 4, height: 4, borderRadius: "50%", background: hovered ? "#d5b572" : "#22c55e", animation: "blink 1.5s infinite", transition: "background 0.3s" }} />
          {hovered ? "GRIPPING" : "IDLE"}
        </div>
      </div>

      {/* 3D Canvas */}
      <div style={{ flex: 1, minHeight: 0, position: "relative" }}>
        {webgl ? (
          <Canvas
            camera={{ position: [0.7, 0.5, 1.35], fov: 50 }}
            gl={{ antialias: true, alpha: true }}
            style={{ background: "transparent" }}
          >
            <ambientLight intensity={0.35} />
            <directionalLight position={[4, 6, 4]} intensity={1.3} castShadow />
            <directionalLight position={[-3, 1, -2]} intensity={0.5} color="#d5b572" />
            {hovered && <pointLight position={[0, 0.6, 0.4]} intensity={3} color="#d5b572" distance={1.8} />}
            <MechanicalHand hovered={hovered} />
          </Canvas>
        ) : (
          <svg viewBox="0 0 200 130" style={{ width: "100%", height: "100%" }}>
            <rect x="80" y="70" width="40" height="30" rx="4" fill="#2a2820" />
            <rect x="79" y="69" width="42" height="4" rx="2" fill="#c8a85a" />
            {[0,1,2,3].map(i => (
              <g key={i}>
                <rect x={78 + i * 14} y="50" width="10" height="22" rx="3" fill="#c8a85a" />
                <rect x={78 + i * 14} y="36" width="9" height="16" rx="2" fill="#c8a85a" />
                <rect x={79 + i * 14} y="28" width="7" height="10" rx="2" fill="#c8a85a" />
              </g>
            ))}
            <rect x="68" y="62" width="10" height="18" rx="3" fill="#c8a85a" transform="rotate(-25 73 71)" />
            <rect x="68" y="48" width="8" height="14" rx="2" fill="#c8a85a" transform="rotate(-25 72 55)" />
            <ellipse cx="100" cy="105" rx="28" ry="8" fill="#333" opacity="0.4" />
            <rect x="86" y="98" width="28" height="8" rx="4" fill="#888060" />
            <rect x="88" y="99" width="24" height="5" rx="2" fill="#c8a85a" />
          </svg>
        )}
        {webgl && !hovered && (
          <div style={{ position: "absolute", bottom: 6, left: 0, right: 0, textAlign: "center", fontSize: "0.45rem", color: "rgba(156,143,110,0.5)", pointerEvents: "none" }}>
            hover to grip
          </div>
        )}
      </div>

      {/* EMG chart */}
      <div style={{ padding: "0 14px 10px", display: "flex", flexDirection: "column", gap: 4 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "0.5rem", color: "#4b5563", letterSpacing: "0.08em" }}>sEMG SIGNAL</span>
          <span style={{ fontSize: "0.55rem", color: hovered ? "#d5b572" : "#22c55e", fontWeight: 600, transition: "color 0.3s" }}>{Math.abs(Math.round(signal))} μV</span>
        </div>
        <svg width="100%" height="28" viewBox="0 0 240 60" preserveAspectRatio="none">
          <path d={emgPath} fill="none" stroke={hovered ? "#d5b572" : "#22c55e"} strokeWidth="1.5" strokeLinecap="round" opacity="0.8" style={{ transition: "stroke 0.3s" }} />
        </svg>
      </div>
    </div>
  );
}
