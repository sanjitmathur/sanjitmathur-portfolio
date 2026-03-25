import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

const ROBOT_URL = "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/gltf/RobotExpressive/RobotExpressive.glb";

function checkWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(window.WebGLRenderingContext && (c.getContext("webgl") || c.getContext("experimental-webgl")));
  } catch { return false; }
}

function RobotModel({ hovered }: { hovered: boolean }) {
  const { scene, animations } = useGLTF(ROBOT_URL) as any;
  const groupRef = useRef<THREE.Group>(null!);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const actionRef = useRef<THREE.AnimationAction | null>(null);
  const rotSpeed = useRef(0.3);

  useEffect(() => {
    if (animations && animations.length > 0) {
      const mixer = new THREE.AnimationMixer(scene);
      mixerRef.current = mixer;
      const walkClip = animations.find((a: THREE.AnimationClip) => a.name === "Walking") || animations[0];
      if (walkClip) {
        const action = mixer.clipAction(walkClip);
        action.play();
        actionRef.current = action;
      }
    }
    return () => { mixerRef.current?.stopAllAction(); };
  }, [scene, animations]);

  useFrame((_, delta) => {
    mixerRef.current?.update(delta * (hovered ? 2.5 : 1));
    const target = hovered ? 1.5 : 0.35;
    rotSpeed.current += (target - rotSpeed.current) * 0.06;
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * rotSpeed.current;
    }
  });

  return (
    <group ref={groupRef} position={[0, -1.2, 0]} scale={0.55}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload(ROBOT_URL);

function OrvynFallbackSVG() {
  return (
    <svg viewBox="0 0 180 160" width="100%" height="100%" style={{ opacity: 0.85 }}>
      <rect x="75" y="10" width="30" height="25" rx="4" fill="#888060"/>
      <rect x="70" y="32" width="40" height="35" rx="6" fill="#c8a85a"/>
      {[0,1,2,3].map(i => (
        <g key={i}>
          <rect x={72+i*9} y="62" width="7" height="22" rx="3" fill="#888060"/>
          <rect x={72+i*9} y="82" width="7" height="18" rx="3" fill="#c8a85a" opacity="0.8"/>
          <rect x={72+i*9} y="98" width="7" height="14" rx="3" fill="#888060" opacity="0.7"/>
        </g>
      ))}
      <rect x="72" y="120" width="7" height="30" rx="3" fill="#c8a85a" opacity="0.6" transform="rotate(-20 75.5 120)"/>
      <line x1="60" y1="40" x2="20" y2="60" stroke="#888060" strokeWidth="5" strokeLinecap="round"/>
      <line x1="20" y1="60" x2="10" y2="85" stroke="#c8a85a" strokeWidth="4" strokeLinecap="round"/>
      <line x1="120" y1="40" x2="160" y2="60" stroke="#888060" strokeWidth="5" strokeLinecap="round"/>
      <line x1="160" y1="60" x2="170" y2="85" stroke="#c8a85a" strokeWidth="4" strokeLinecap="round"/>
    </svg>
  );
}

export default function OrvynWidget() {
  const [hovered, setHovered] = useState(false);
  const [webgl] = useState(() => checkWebGL());

  return (
    <div
      style={{ width: "100%", height: "100%", background: "#0b0d10", borderRadius: 10, overflow: "hidden", cursor: "none", position: "relative" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ position: "absolute", top: 8, left: 12, zIndex: 2, fontSize: "0.5rem", fontWeight: 700, color: "#c8a85a", letterSpacing: "0.12em", textTransform: "uppercase" }}>
        Orvyn ExoArm
      </div>
      {hovered && (
        <div style={{ position: "absolute", top: 8, right: 12, zIndex: 2, fontSize: "0.48rem", color: "rgba(200,168,90,0.6)", letterSpacing: "0.06em" }}>
          sEMG ⚡
        </div>
      )}

      {webgl ? (
        <Canvas
          camera={{ position: [0, 1.5, 4.5], fov: 50 }}
          gl={{ antialias: true, alpha: true }}
          style={{ width: "100%", height: "100%" }}
        >
          <ambientLight intensity={0.5} />
          <directionalLight position={[4, 6, 4]} intensity={1.2} color="#fff8ee" />
          <directionalLight position={[-3, 2, -3]} intensity={0.4} color="#aaccff" />
          <pointLight position={[0, 2, 3]} intensity={hovered ? 1.2 : 0.5} color="#c8a85a" />

          <Suspense fallback={null}>
            <RobotModel hovered={hovered} />
          </Suspense>

          <OrbitControls
            enableZoom={false}
            enablePan={false}
            minPolarAngle={Math.PI / 5}
            maxPolarAngle={Math.PI / 1.6}
            autoRotate={false}
            dampingFactor={0.08}
            enableDamping
          />
        </Canvas>
      ) : (
        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <OrvynFallbackSVG />
        </div>
      )}
    </div>
  );
}
