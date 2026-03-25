import { Suspense, useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { useInView } from "../useInView";

const HAND_MODEL_URL = `${import.meta.env.BASE_URL}models/RobotExpressive.glb`;

function checkWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (c.getContext("webgl") || c.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

useGLTF.preload(HAND_MODEL_URL);

type AnimName = "ThumbsUp" | "Wave" | "Idle";

function RobotHandModel({ hovered }: { hovered: boolean }) {
  const { scene, animations } = useGLTF(HAND_MODEL_URL);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const currentAction = useRef<THREE.AnimationAction | null>(null);
  const clonedScene = useRef<THREE.Group | null>(null);

  useEffect(() => {
    const clone = scene.clone(true);
    clonedScene.current = clone;

    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const oldMat = mesh.material as THREE.MeshStandardMaterial;
        mesh.material = new THREE.MeshStandardMaterial({
          color: oldMat.color ? oldMat.color : new THREE.Color("#c8a85a"),
          roughness: 0.38,
          metalness: 0.55,
          envMapIntensity: 1.0,
        });
        mesh.castShadow = true;
      }
    });

    mixerRef.current = new THREE.AnimationMixer(clone);
    playAnim("Idle");

    return () => {
      mixerRef.current?.stopAllAction();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene, animations]);

  function playAnim(name: AnimName, crossFade = 0.4) {
    if (!mixerRef.current) return;
    const clip = animations.find((a) => a.name === name);
    if (!clip) return;
    const next = mixerRef.current.clipAction(clip);
    if (currentAction.current && currentAction.current !== next) {
      currentAction.current.crossFadeTo(next, crossFade, true);
    }
    next.reset().play();
    currentAction.current = next;
  }

  useEffect(() => {
    if (hovered) {
      playAnim("ThumbsUp", 0.25);
    } else {
      playAnim("Idle", 0.4);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hovered]);

  useFrame((_, delta) => {
    mixerRef.current?.update(delta);
  });

  if (!clonedScene.current) return null;

  return (
    <group position={[0.35, -1.08, 0]} scale={1.0}>
      <primitive object={clonedScene.current} />
    </group>
  );
}

function OrvynFallbackSVG() {
  const FAWN = "#c8a85a";
  const JOINT = "#888060";
  return (
    <svg viewBox="0 0 180 160" width="100%" height="100%" style={{ opacity: 0.85 }}>
      <rect x="58" y="70" width="64" height="55" rx="5" fill={FAWN} opacity="0.8" />
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect x={62 + i * 14} y="34" width="10" height="38" rx="4" fill={FAWN} opacity="0.85" />
          <rect x={63 + i * 14} y="50" width="8" height="24" rx="3" fill={FAWN} opacity="0.7" />
          <rect x={64 + i * 14} y="66" width="6" height="18" rx="2.5" fill={JOINT} opacity="0.7" />
        </g>
      ))}
      <rect x="44" y="80" width="18" height="32" rx="8" fill={FAWN} opacity="0.75" transform="rotate(-25 53 96)" />
    </svg>
  );
}

export default function OrvynWidget() {
  const { ref: containerRef, inView } = useInView("200px 0px");
  const [hovered, setHovered] = useState(false);
  const [webgl] = useState(() => checkWebGL());
  const [emgPoints, setEmgPoints] = useState<number[]>(() =>
    Array.from({ length: 40 }, () => 50)
  );
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
      setEmgPoints((pts) => [...pts.slice(1), Math.max(10, Math.min(90, signal))]);
      setEmgLabel(active ? "FLEX" : "IDLE");
      setConfidence(
        active
          ? Math.min(99, 88 + Math.round(Math.sin(t) * 6))
          : Math.round(10 + Math.sin(t * 0.5) * 8)
      );
    }, 50);
    return () => clearInterval(id);
  }, [hovered]);

  const pts = emgPoints;
  const svgW = 200, svgH = 38;
  const polyline = pts
    .map((v, i) => `${(i / (pts.length - 1)) * svgW},${svgH - (v / 100) * svgH}`)
    .join(" ");

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%", height: "100%",
        background: "#0b0d10", borderRadius: 10,
        overflow: "hidden", cursor: "none",
        display: "flex", flexDirection: "column",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* 3D Hand Model Viewer */}
      <div style={{ flex: 1, position: "relative", minHeight: 0 }}>
        <div style={{
          position: "absolute", top: 7, left: 10, zIndex: 2,
          fontSize: "0.48rem", fontWeight: 700, color: "#c8a85a",
          letterSpacing: "0.12em", textTransform: "uppercase",
        }}>
          Orvyn ExoArm · sEMG
        </div>
        {hovered && inView && (
          <div style={{
            position: "absolute", top: 7, right: 10, zIndex: 2,
            fontSize: "0.45rem", color: "rgba(200,168,90,0.55)", letterSpacing: "0.06em",
          }}>
            GRASP ⚡
          </div>
        )}

        {webgl && inView ? (
          <Canvas
            camera={{ position: [0, 0.5, 1.4], fov: 42 }}
            gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
            style={{ width: "100%", height: "100%" }}
          >
            <ambientLight intensity={0.55} />
            <directionalLight position={[3, 5, 4]} intensity={1.2} color="#fff8ee" />
            <directionalLight position={[-3, 2, -3]} intensity={0.3} color="#aaccff" />
            <pointLight position={[0.5, 0.8, 1.5]} intensity={hovered ? 1.2 : 0.4} color="#c8a85a" />

            <Suspense fallback={null}>
              <RobotHandModel hovered={hovered} />
            </Suspense>

            <OrbitControls
              enableZoom={true}
              minDistance={0.8}
              maxDistance={3.5}
              enablePan={false}
              minPolarAngle={Math.PI * 0.2}
              maxPolarAngle={Math.PI * 0.8}
              dampingFactor={0.09}
              enableDamping
            />
          </Canvas>
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: 12 }}>
            <OrvynFallbackSVG />
          </div>
        )}
      </div>

      {/* EMG signal chart */}
      <div style={{
        background: "rgba(0,0,0,0.55)",
        borderTop: "1px solid rgba(200,168,90,0.15)",
        padding: "7px 12px", flexShrink: 0,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{
              width: 5, height: 5, borderRadius: "50%",
              background: hovered ? "#22c55e" : "#6b7280",
              boxShadow: hovered ? "0 0 6px #22c55e" : "none",
              transition: "all 0.3s",
              animation: hovered ? "blink 0.8s ease infinite" : "none",
            }} />
            <span style={{ fontSize: "0.4rem", color: "#6b7280", letterSpacing: "0.08em" }}>sEMG CH-1</span>
            <span style={{ fontSize: "0.42rem", color: hovered ? "#22c55e" : "#6b7280", fontWeight: 600 }}>
              {emgLabel}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ fontSize: "0.4rem", color: "#6b7280" }}>Conf.</span>
            <span style={{ fontSize: "0.48rem", fontWeight: 600, color: confidence > 80 ? "#22c55e" : "#9c8f6e" }}>
              {confidence}%
            </span>
          </div>
        </div>

        <svg
          width="100%" height={svgH}
          viewBox={`0 0 ${svgW} ${svgH}`}
          preserveAspectRatio="none"
          style={{ display: "block" }}
        >
          <defs>
            <linearGradient id="emg-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={hovered ? "#22c55e" : "#c8a85a"} stopOpacity="0.22" />
              <stop offset="100%" stopColor={hovered ? "#22c55e" : "#c8a85a"} stopOpacity="0" />
            </linearGradient>
          </defs>
          <polyline points={`${polyline} ${svgW},${svgH} 0,${svgH}`} fill="url(#emg-fill)" />
          <polyline
            points={polyline} fill="none"
            stroke={hovered ? "#22c55e" : "#c8a85a"} strokeWidth="1.2"
            strokeLinecap="round" strokeLinejoin="round"
            style={{ transition: "stroke 0.3s" }}
          />
          <line x1="0" y1={svgH * 0.35} x2={svgW} y2={svgH * 0.35}
            stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" strokeDasharray="3 3" />
        </svg>
      </div>
    </div>
  );
}
