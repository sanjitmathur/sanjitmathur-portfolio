import { useRef, useMemo, Suspense, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Points, PointMaterial, Float } from "@react-three/drei";
import * as THREE from "three";
import { useInView } from "./useInView";

function checkWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(window.WebGLRenderingContext && (c.getContext("webgl") || c.getContext("experimental-webgl")));
  } catch { return false; }
}

const SKILLS = ["Python", "React", "TypeScript", "TensorFlow", "K8s", "LLMs", "OpenCV", "Node.js", "FastAPI", "Docker"];

/* Central glowing sphere */
function CoreSphere() {
  const meshRef = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.3;
      meshRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.2) * 0.2;
    }
  });
  return (
    <Float speed={1.2} floatIntensity={0.5}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1, 4]} />
        <meshStandardMaterial
          color="#d5b572"
          wireframe
          transparent
          opacity={0.4}
          emissive="#d5b572"
          emissiveIntensity={0.6}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.85, 32, 32]} />
        <meshStandardMaterial
          color="#d5b572"
          transparent
          opacity={0.08}
          emissive="#d5b572"
          emissiveIntensity={0.3}
        />
      </mesh>
    </Float>
  );
}

/* Orbiting skill nodes */
function SkillNodes() {
  const groupRef = useRef<THREE.Group>(null!);
  const { mouse } = useThree();

  const orbits = useMemo(() => SKILLS.map((skill, i) => {
    const inclination = (i / SKILLS.length) * Math.PI;
    const radius = 2.8 + (i % 3) * 0.5;
    const speed = 0.18 + (i % 4) * 0.06;
    const phase = (i / SKILLS.length) * Math.PI * 2;
    return { skill, inclination, radius, speed, phase };
  }), []);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    groupRef.current.rotation.y += 0.004;
    groupRef.current.rotation.x += (mouse.y * 0.3 - groupRef.current.rotation.x) * 0.03;
  });

  return (
    <group ref={groupRef}>
      {orbits.map(({ skill, inclination, radius, speed, phase }, i) => (
        <OrbitingNode key={skill} inclination={inclination} radius={radius} speed={speed} phase={phase} label={skill} index={i} />
      ))}
    </group>
  );
}

function OrbitingNode({ inclination, radius, speed, phase, label, index }: {
  inclination: number; radius: number; speed: number; phase: number; label: string; index: number;
}) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime() * speed + phase;
    const x = Math.cos(t) * radius;
    const z = Math.sin(t) * radius;
    const y = Math.sin(t * 0.7 + inclination) * radius * 0.5;
    ref.current.position.set(x, y, z);
  });

  const isHighlight = index % 3 === 0;
  return (
    <mesh ref={ref}>
      <octahedronGeometry args={[0.1, 0]} />
      <meshStandardMaterial
        color={isHighlight ? "#d5b572" : "#f8f2e1"}
        emissive={isHighlight ? "#d5b572" : "#f8f2e1"}
        emissiveIntensity={isHighlight ? 0.8 : 0.2}
        metalness={0.8}
        roughness={0.1}
      />
    </mesh>
  );
}

/* Background particles */
function BgParticles() {
  const ref = useRef<THREE.Points>(null!);
  const positions = useMemo(() => {
    const arr = new Float32Array(300 * 3);
    for (let i = 0; i < 300; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * 14;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 14;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 14;
    }
    return arr;
  }, []);
  useFrame((_, d) => { if (ref.current) ref.current.rotation.y += d * 0.02; });
  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial size={0.018} color="#d5b572" sizeAttenuation transparent opacity={0.4} depthWrite={false} />
    </Points>
  );
}

function Scene() {
  return (
    <>
      <color attach="background" args={["#201f14"]} />
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={3} color="#d5b572" />
      <pointLight position={[-5, -5, -5]} intensity={1} color="#f8f2e1" />
      <CoreSphere />
      <SkillNodes />
      <BgParticles />
    </>
  );
}

export default function SkillOrbitScene({ height = 480 }: { height?: number }) {
  const { ref: containerRef, inView } = useInView("200px 0px");
  const [supported, setSupported] = useState<boolean | null>(null);
  useEffect(() => { setSupported(checkWebGL()); }, []);

  const fallback = (
    <div style={{ height, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 200, height: 200, borderRadius: "50%", border: "1px solid rgba(213,181,114,0.3)", animation: "spin 12s linear infinite" }} />
      <div style={{ position: "absolute", width: 120, height: 120, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(213,181,114,0.2) 0%, transparent 70%)" }} />
    </div>
  );

  return (
    <div ref={containerRef} style={{ height }}>
      {supported === null || !supported || !inView ? fallback : (
        <Canvas
          camera={{ position: [0, 1, 7], fov: 55 }}
          dpr={[1, 1.5]}
          style={{ height }}
          gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        >
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </Canvas>
      )}
    </div>
  );
}
