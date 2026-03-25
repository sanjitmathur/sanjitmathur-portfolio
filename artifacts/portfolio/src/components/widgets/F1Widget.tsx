import { Suspense, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, OrbitControls, Environment } from "@react-three/drei";
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
  const autoRotateSpeed = useRef(0.4);

  useFrame((_, delta) => {
    const target = hovered ? 1.8 : 0.4;
    autoRotateSpeed.current += (target - autoRotateSpeed.current) * 0.08;
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * autoRotateSpeed.current;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.3, 0]} scale={0.012}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload(F1_MODEL_URL);

function F1FallbackSVG() {
  return (
    <svg viewBox="0 0 200 90" width="100%" height="100%" style={{ opacity: 0.9 }}>
      <rect x="30" y="40" width="140" height="18" rx="6" fill="#c8102e"/>
      <path d="M170 40 Q195 49 170 58 Z" fill="#c8102e" opacity="0.8"/>
      <path d="M30 40 L15 33 L20 49 L15 65 L30 58 Z" fill="#c8102e" opacity="0.6"/>
      <rect x="55" y="28" width="90" height="14" rx="5" fill="#c8102e" opacity="0.7"/>
      {[50,75,110,135].map(cx => (
        <g key={cx}>
          <circle cx={cx} cy="58" r="10" fill="#1c1c1c"/>
          <circle cx={cx} cy="58" r="5" fill="#aaa"/>
          <circle cx={cx} cy="28" r="10" fill="#1c1c1c"/>
          <circle cx={cx} cy="28" r="5" fill="#aaa"/>
        </g>
      ))}
    </svg>
  );
}

export default function F1Widget() {
  const [hovered, setHovered] = useState(false);
  const [webgl] = useState(() => checkWebGL());

  return (
    <div
      style={{ width: "100%", height: "100%", background: "#0a0706", borderRadius: 10, overflow: "hidden", cursor: "none", position: "relative" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Subtle label */}
      <div style={{ position: "absolute", top: 8, left: 12, zIndex: 2, fontSize: "0.5rem", fontWeight: 700, color: "#c8102e", letterSpacing: "0.12em", textTransform: "uppercase" }}>
        F1 · 2026 Season
      </div>
      {hovered && (
        <div style={{ position: "absolute", top: 8, right: 12, zIndex: 2, fontSize: "0.48rem", color: "rgba(255,255,255,0.5)", letterSpacing: "0.06em" }}>
          BOOST ↑
        </div>
      )}

      {webgl ? (
        <Canvas
          camera={{ position: [2.5, 1.2, 3.5], fov: 45 }}
          gl={{ antialias: true, alpha: true }}
          style={{ width: "100%", height: "100%" }}
        >
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 8, 5]} intensity={1.4} color="#fff9f0" />
          <directionalLight position={[-4, 3, -3]} intensity={0.5} color="#f0f0ff" />
          <pointLight position={[0, 0, 4]} intensity={0.8} color={hovered ? "#ef4444" : "#c8102e"} />

          <Suspense fallback={null}>
            <FerrariModel hovered={hovered} />
          </Suspense>

          <OrbitControls
            enableZoom={false}
            enablePan={false}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 1.8}
            autoRotate={false}
            dampingFactor={0.08}
            enableDamping
          />
        </Canvas>
      ) : (
        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <F1FallbackSVG />
        </div>
      )}
    </div>
  );
}
