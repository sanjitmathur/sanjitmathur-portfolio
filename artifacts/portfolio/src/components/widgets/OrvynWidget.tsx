import { useRef, useState, useEffect } from "react";
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

interface FingerRefs {
  p1: THREE.Group | null;
  p2: THREE.Group | null;
  p3: THREE.Group | null;
}

function Finger({ basePos, fingerRefs, delay }: { basePos: [number, number, number]; fingerRefs: React.MutableRefObject<FingerRefs>; delay: number }) {
  const p1Ref = useRef<THREE.Group>(null!);
  const p2Ref = useRef<THREE.Group>(null!);
  const p3Ref = useRef<THREE.Group>(null!);

  useEffect(() => {
    fingerRefs.current.p1 = p1Ref.current;
    fingerRefs.current.p2 = p2Ref.current;
    fingerRefs.current.p3 = p3Ref.current;
  });

  return (
    <group position={basePos}>
      {/* Knuckle sphere */}
      <mesh>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color={JOINT} roughness={0.5} />
      </mesh>
      {/* Proximal phalanx */}
      <group ref={p1Ref}>
        <mesh position={[0, 0.19, 0]}>
          <capsuleGeometry args={[0.055, 0.24, 6, 8]} />
          <meshStandardMaterial color={FAWN} roughness={0.4} metalness={0.3} />
        </mesh>
        {/* Middle joint */}
        <group position={[0, 0.38, 0]}>
          <mesh>
            <sphereGeometry args={[0.052, 8, 8]} />
            <meshStandardMaterial color={JOINT} roughness={0.5} />
          </mesh>
          {/* Middle phalanx */}
          <group ref={p2Ref}>
            <mesh position={[0, 0.15, 0]}>
              <capsuleGeometry args={[0.048, 0.18, 6, 8]} />
              <meshStandardMaterial color={FAWN} roughness={0.4} metalness={0.3} />
            </mesh>
            {/* Distal joint */}
            <group position={[0, 0.30, 0]}>
              <mesh>
                <sphereGeometry args={[0.044, 8, 8]} />
                <meshStandardMaterial color={JOINT} roughness={0.5} />
              </mesh>
              {/* Distal phalanx */}
              <group ref={p3Ref}>
                <mesh position={[0, 0.10, 0]}>
                  <capsuleGeometry args={[0.040, 0.12, 6, 8]} />
                  <meshStandardMaterial color={FAWN} roughness={0.35} metalness={0.4} />
                </mesh>
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}

function MechanicalHand({ hovered }: { hovered: boolean }) {
  const groupRef = useRef<THREE.Group>(null!);
  const curlRef = useRef(0);
  const rotRef = useRef(0);

  const fingerRefs = [
    useRef<FingerRefs>({ p1: null, p2: null, p3: null }),
    useRef<FingerRefs>({ p1: null, p2: null, p3: null }),
    useRef<FingerRefs>({ p1: null, p2: null, p3: null }),
    useRef<FingerRefs>({ p1: null, p2: null, p3: null }),
  ];

  const fingerPositions: [number, number, number][] = [
    [-0.24, 0.12, 0],
    [-0.08, 0.15, 0],
    [0.08, 0.15, 0],
    [0.24, 0.12, 0],
  ];

  useFrame((_, delta) => {
    const curlTarget = hovered ? Math.PI * 0.65 : 0;
    curlRef.current += (curlTarget - curlRef.current) * 0.06;

    const curl = curlRef.current;
    fingerRefs.forEach((fr) => {
      if (fr.current.p1) fr.current.p1.rotation.x = -curl * 0.6;
      if (fr.current.p2) fr.current.p2.rotation.x = -curl * 0.7;
      if (fr.current.p3) fr.current.p3.rotation.x = -curl * 0.5;
    });

    const rotTarget = hovered ? 0.5 : 0.3;
    rotRef.current += (rotTarget - rotRef.current) * 0.04;
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * rotRef.current;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.6, 0]}>
      {/* Palm */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.65, 0.52, 0.14]} />
        <meshStandardMaterial color={FAWN} roughness={0.4} metalness={0.25} />
      </mesh>
      {/* Palm detail lines */}
      <mesh position={[0, 0, 0.072]}>
        <boxGeometry args={[0.62, 0.48, 0.005]} />
        <meshStandardMaterial color={DARK} roughness={0.9} />
      </mesh>
      {/* Wrist */}
      <mesh position={[0, -0.35, 0]}>
        <cylinderGeometry args={[0.18, 0.22, 0.28, 10]} />
        <meshStandardMaterial color={JOINT} roughness={0.5} metalness={0.3} />
      </mesh>
      {/* Fingers */}
      {fingerPositions.map((pos, i) => (
        <Finger key={i} basePos={pos} fingerRefs={fingerRefs[i]} delay={i * 0.05} />
      ))}
      {/* Thumb */}
      <group position={[-0.36, -0.05, 0]} rotation={[0, 0, Math.PI * 0.3]}>
        <mesh>
          <sphereGeometry args={[0.062, 8, 8]} />
          <meshStandardMaterial color={JOINT} roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.17, 0]}>
          <capsuleGeometry args={[0.057, 0.20, 6, 8]} />
          <meshStandardMaterial color={FAWN} roughness={0.4} metalness={0.3} />
        </mesh>
        <mesh position={[0, 0.34, 0]}>
          <capsuleGeometry args={[0.050, 0.14, 6, 8]} />
          <meshStandardMaterial color={FAWN} roughness={0.35} metalness={0.4} />
        </mesh>
      </group>
    </group>
  );
}

function OrvynFallbackSVG() {
  return (
    <svg viewBox="0 0 180 160" width="100%" height="100%" style={{ opacity: 0.85 }}>
      <rect x="58" y="70" width="64" height="55" rx="5" fill={FAWN} opacity="0.8"/>
      {[0,1,2,3].map(i => (
        <g key={i}>
          <rect x={62+i*14} y="34" width="10" height="38" rx="4" fill={FAWN} opacity="0.85"/>
          <rect x={63+i*14} y="50" width="8" height="24" rx="3" fill={FAWN} opacity="0.7"/>
          <rect x={64+i*14} y="66" width="6" height="18" rx="2.5" fill={JOINT} opacity="0.7"/>
        </g>
      ))}
      <rect x="44" y="80" width="18" height="32" rx="8" fill={FAWN} opacity="0.75" transform="rotate(-25 53 96)"/>
      <line x1="58" y1="100" x2="30" y2="120" stroke={JOINT} strokeWidth="5" strokeLinecap="round"/>
      <line x1="30" y1="120" x2="22" y2="148" stroke={FAWN} strokeWidth="4" strokeLinecap="round"/>
    </svg>
  );
}

export default function OrvynWidget() {
  const [hovered, setHovered] = useState(false);
  const [webgl] = useState(() => checkWebGL());
  const [emgPoints, setEmgPoints] = useState<number[]>(() => Array.from({ length: 40 }, () => 50));
  const [emgLabel, setEmgLabel] = useState("IDLE");
  const [confidence, setConfidence] = useState(0);

  useEffect(() => {
    let t = 0;
    const id = setInterval(() => {
      t += 0.06;
      const active = hovered;
      const signal = active
        ? 50 + Math.sin(t * 8) * 28 + Math.sin(t * 14) * 14 + (Math.random() - 0.5) * 10
        : 50 + Math.sin(t * 2) * 4 + (Math.random() - 0.5) * 3;
      setEmgPoints(pts => [...pts.slice(1), Math.max(10, Math.min(90, signal))]);
      setEmgLabel(active ? "FLEX" : "IDLE");
      setConfidence(active ? Math.min(99, 88 + Math.round(Math.sin(t) * 6)) : Math.round(10 + Math.sin(t * 0.5) * 8));
    }, 50);
    return () => clearInterval(id);
  }, [hovered]);

  const pts = emgPoints;
  const svgW = 200, svgH = 38;
  const polyline = pts.map((v, i) => `${(i / (pts.length - 1)) * svgW},${svgH - (v / 100) * svgH}`).join(" ");

  return (
    <div
      style={{ width: "100%", height: "100%", background: "#0b0d10", borderRadius: 10, overflow: "hidden", cursor: "none", display: "flex", flexDirection: "column" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* 3D Model area */}
      <div style={{ flex: 1, position: "relative", minHeight: 0 }}>
        <div style={{ position: "absolute", top: 7, left: 10, zIndex: 2, fontSize: "0.48rem", fontWeight: 700, color: "#c8a85a", letterSpacing: "0.12em", textTransform: "uppercase" }}>
          Orvyn ExoArm
        </div>
        {hovered && (
          <div style={{ position: "absolute", top: 7, right: 10, zIndex: 2, fontSize: "0.45rem", color: "rgba(200,168,90,0.55)", letterSpacing: "0.06em" }}>
            sEMG ACTIVE ⚡
          </div>
        )}

        {webgl ? (
          <Canvas
            camera={{ position: [0, 0.3, 2.4], fov: 52 }}
            gl={{ antialias: true, alpha: true }}
            style={{ width: "100%", height: "100%" }}
          >
            <ambientLight intensity={0.5} />
            <directionalLight position={[4, 6, 4]} intensity={1.2} color="#fff8ee" />
            <directionalLight position={[-3, 2, -3]} intensity={0.35} color="#aaccff" />
            <pointLight position={[0, 1, 2.5]} intensity={hovered ? 1.1 : 0.4} color="#c8a85a" />

            <MechanicalHand hovered={hovered} />
          </Canvas>
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: 12 }}>
            <OrvynFallbackSVG />
          </div>
        )}
      </div>

      {/* EMG signal chart */}
      <div style={{ background: "rgba(0,0,0,0.55)", borderTop: "1px solid rgba(200,168,90,0.15)", padding: "7px 12px", flexShrink: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: hovered ? "#22c55e" : "#6b7280", boxShadow: hovered ? "0 0 6px #22c55e" : "none", transition: "all 0.3s", animation: hovered ? "blink 0.8s ease infinite" : "none" }} />
            <span style={{ fontSize: "0.4rem", color: "#6b7280", letterSpacing: "0.08em" }}>sEMG CH-1</span>
            <span style={{ fontSize: "0.42rem", color: hovered ? "#22c55e" : "#6b7280", fontWeight: 600 }}>{emgLabel}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ fontSize: "0.4rem", color: "#6b7280" }}>Conf.</span>
            <span style={{ fontSize: "0.48rem", fontWeight: 600, color: confidence > 80 ? "#22c55e" : "#9c8f6e" }}>{confidence}%</span>
          </div>
        </div>
        <svg width="100%" height={svgH} viewBox={`0 0 ${svgW} ${svgH}`} preserveAspectRatio="none" style={{ display: "block" }}>
          <defs>
            <linearGradient id="emg-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={hovered ? "#22c55e" : "#c8a85a"} stopOpacity="0.22" />
              <stop offset="100%" stopColor={hovered ? "#22c55e" : "#c8a85a"} stopOpacity="0" />
            </linearGradient>
          </defs>
          <polyline points={`${polyline} ${svgW},${svgH} 0,${svgH}`} fill="url(#emg-fill)" />
          <polyline points={polyline} fill="none" stroke={hovered ? "#22c55e" : "#c8a85a"} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" style={{ transition: "stroke 0.3s" }} />
          {/* Threshold line */}
          <line x1="0" y1={svgH * 0.35} x2={svgW} y2={svgH * 0.35} stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" strokeDasharray="3 3" />
        </svg>
      </div>
    </div>
  );
}
