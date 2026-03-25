import { Suspense, useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

const F1_MODEL_URL = "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/gltf/ferrari.glb";

function checkWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(window.WebGLRenderingContext && (c.getContext("webgl") || c.getContext("experimental-webgl")));
  } catch { return false; }
}

function FerrariModel({ hovered }: { hovered: boolean }) {
  const { scene } = useGLTF(F1_MODEL_URL);
  const groupRef = useRef<THREE.Group>(null!);
  const rotSpeed = useRef(0.4);

  useFrame((_, delta) => {
    const target = hovered ? 2.0 : 0.45;
    rotSpeed.current += (target - rotSpeed.current) * 0.07;
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * rotSpeed.current;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.28, 0]} scale={0.011}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload(F1_MODEL_URL);

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

export default function F1Widget() {
  const [hovered, setHovered] = useState(false);
  const [webgl] = useState(() => checkWebGL());
  const [speed, setSpeed] = useState(0);
  const [rpm, setRpm] = useState(0);
  const [gear, setGear] = useState(1);
  const [tireFL, setTireFL] = useState(82);
  const [tireFR, setTireFR] = useState(84);
  const [tireRL, setTireRL] = useState(95);
  const [tireRR, setTireRR] = useState(97);

  useEffect(() => {
    let t = 0;
    const id = setInterval(() => {
      t += 0.018;
      const spd = Math.max(0, Math.min(330, 185 + Math.sin(t) * 120 + Math.sin(t * 1.7) * 35));
      setSpeed(Math.round(spd));
      setRpm(Math.round(3000 + (spd / 330) * 12000 + Math.sin(t * 4) * 500));
      setGear(Math.min(8, Math.max(1, Math.round(1 + spd / 42))));
      setTireFL(Math.round(75 + Math.sin(t * 0.7) * 18));
      setTireFR(Math.round(78 + Math.sin(t * 0.8 + 0.5) * 16));
      setTireRL(Math.round(90 + Math.sin(t * 0.6 + 1) * 14));
      setTireRR(Math.round(93 + Math.sin(t * 0.5 + 1.5) * 12));
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

  return (
    <div
      style={{ width: "100%", height: "100%", background: "#0a0706", borderRadius: 10, overflow: "hidden", cursor: "none", display: "flex", flexDirection: "column" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* 3D Model area */}
      <div style={{ flex: 1, position: "relative", minHeight: 0 }}>
        <div style={{ position: "absolute", top: 7, left: 10, zIndex: 2, fontSize: "0.48rem", fontWeight: 700, color: "#c8102e", letterSpacing: "0.12em", textTransform: "uppercase" }}>
          F1 · 2026 Season
        </div>
        {hovered && (
          <div style={{ position: "absolute", top: 7, right: 10, zIndex: 2, fontSize: "0.45rem", color: "rgba(255,255,255,0.4)", letterSpacing: "0.06em" }}>
            DRAG TO ROTATE
          </div>
        )}

        {webgl ? (
          <Canvas
            camera={{ position: [2.2, 0.9, 3.2], fov: 46 }}
            gl={{ antialias: true, alpha: true }}
            style={{ width: "100%", height: "100%" }}
          >
            <ambientLight intensity={0.55} />
            <directionalLight position={[5, 8, 5]} intensity={1.3} color="#fff8f0" />
            <directionalLight position={[-4, 3, -3]} intensity={0.45} color="#f0f0ff" />
            <pointLight position={[0, 1, 4]} intensity={hovered ? 1.0 : 0.5} color="#ef4444" />

            <Suspense fallback={null}>
              <FerrariModel hovered={hovered} />
            </Suspense>

            <OrbitControls
              enableZoom={false}
              enablePan={false}
              minPolarAngle={Math.PI / 4}
              maxPolarAngle={Math.PI / 1.8}
              dampingFactor={0.08}
              enableDamping
            />
          </Canvas>
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: 12 }}>
            <F1FallbackSVG />
          </div>
        )}
      </div>

      {/* Telemetry gauges */}
      <div style={{ background: "rgba(0,0,0,0.55)", borderTop: "1px solid rgba(200,16,46,0.2)", padding: "8px 12px", display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
        {/* Speedometer */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 44 }}>
          <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#f5f5f7", letterSpacing: "-0.04em", lineHeight: 1 }}>{speed}</div>
          <div style={{ fontSize: "0.38rem", color: "#6b7280", letterSpacing: "0.06em" }}>KM/H</div>
        </div>

        {/* RPM bar */}
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
            <span style={{ fontSize: "0.4rem", color: "#6b7280" }}>RPM</span>
            <span style={{ fontSize: "0.4rem", color: rpmColor, fontWeight: 600 }}>{rpm.toLocaleString()}</span>
          </div>
          <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${rpmPct * 100}%`, background: rpmColor, borderRadius: 2, transition: "width 0.08s, background 0.3s" }} />
          </div>
          {/* RPM segments */}
          <div style={{ display: "flex", gap: 1, marginTop: 2 }}>
            {Array.from({ length: 12 }, (_, i) => (
              <div key={i} style={{ flex: 1, height: 3, borderRadius: 1, background: i / 12 <= rpmPct ? rpmColor : "rgba(255,255,255,0.06)", transition: "background 0.08s" }} />
            ))}
          </div>
        </div>

        {/* Gear */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 28 }}>
          <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#d5b572", lineHeight: 1 }}>{gear}</div>
          <div style={{ fontSize: "0.38rem", color: "#6b7280", letterSpacing: "0.06em" }}>GEAR</div>
        </div>

        {/* Tire temps */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2px 4px", minWidth: 52 }}>
          {[{ l: "FL", v: tireFL }, { l: "FR", v: tireFR }, { l: "RL", v: tireRL }, { l: "RR", v: tireRR }].map(({ l, v }) => (
            <div key={l} style={{ background: "rgba(255,255,255,0.05)", borderRadius: 3, padding: "1px 4px", textAlign: "center", border: `1px solid ${tireColor(v)}30` }}>
              <div style={{ fontSize: "0.38rem", color: "#4b5563" }}>{l}</div>
              <div style={{ fontSize: "0.5rem", fontWeight: 600, color: tireColor(v) }}>{v}°</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
