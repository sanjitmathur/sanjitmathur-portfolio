import { useRef, useMemo, Suspense, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Points, PointMaterial, Float, Torus, MeshDistortMaterial, Environment } from "@react-three/drei";
import * as THREE from "three";

function checkWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(window.WebGLRenderingContext && (c.getContext("webgl") || c.getContext("experimental-webgl")));
  } catch { return false; }
}

/* Drifting gold particle field */
function Particles({ count = 600 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null!);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * 18;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 18;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 18;
    }
    return arr;
  }, [count]);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.x += delta * 0.02;
      ref.current.rotation.y += delta * 0.01;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial size={0.025} color="#d5b572" sizeAttenuation transparent opacity={0.7} depthWrite={false} />
    </Points>
  );
}

/* Central abstract geometry */
function CoreGeometry() {
  const meshRef = useRef<THREE.Mesh>(null!);
  const { mouse } = useThree();

  useFrame(({ clock }, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x = clock.getElapsedTime() * 0.12;
    meshRef.current.rotation.y = clock.getElapsedTime() * 0.18;
    meshRef.current.position.x += (mouse.x * 0.6 - meshRef.current.position.x) * 0.04;
    meshRef.current.position.y += (mouse.y * 0.3 - meshRef.current.position.y) * 0.04;
  });

  return (
    <Float speed={1.4} rotationIntensity={0.3} floatIntensity={0.8}>
      <mesh ref={meshRef} scale={1.6}>
        <torusKnotGeometry args={[0.7, 0.22, 180, 24, 2, 3]} />
        <MeshDistortMaterial
          color="#d5b572"
          wireframe={false}
          metalness={0.9}
          roughness={0.08}
          distort={0.25}
          speed={2}
          emissive="#d5b572"
          emissiveIntensity={0.15}
        />
      </mesh>
    </Float>
  );
}

/* Grid plane */
function GridFloor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -4, 0]}>
      <planeGeometry args={[40, 40, 30, 30]} />
      <meshBasicMaterial color="#d5b572" wireframe transparent opacity={0.06} />
    </mesh>
  );
}

/* Camera reacts to mouse */
function CameraRig() {
  const { camera, mouse } = useThree();
  useFrame(() => {
    camera.position.x += (mouse.x * 0.8 - camera.position.x) * 0.05;
    camera.position.y += (mouse.y * 0.4 - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

/* Orbiting rings */
function OrbitRings() {
  const g1 = useRef<THREE.Mesh>(null!);
  const g2 = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    if (g1.current) g1.current.rotation.z = clock.getElapsedTime() * 0.25;
    if (g2.current) g2.current.rotation.x = clock.getElapsedTime() * 0.18;
  });
  return (
    <>
      <mesh ref={g1} position={[0, 0, 0]}>
        <torusGeometry args={[3.5, 0.006, 2, 120]} />
        <meshBasicMaterial color="#d5b572" transparent opacity={0.22} />
      </mesh>
      <mesh ref={g2} position={[0, 0, 0]} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[4.5, 0.004, 2, 120]} />
        <meshBasicMaterial color="#f8f2e1" transparent opacity={0.08} />
      </mesh>
    </>
  );
}

function Scene() {
  return (
    <>
      <color attach="background" args={["#141209"]} />
      <fog attach="fog" args={["#141209", 12, 28]} />
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={2} color="#d5b572" />
      <pointLight position={[-5, -3, -5]} intensity={0.8} color="#f8f2e1" />
      <CameraRig />
      <Particles count={500} />
      <CoreGeometry />
      <GridFloor />
      <OrbitRings />
    </>
  );
}

export default function HeroScene() {
  const [supported, setSupported] = useState<boolean | null>(null);

  useEffect(() => {
    setSupported(checkWebGL());
  }, []);

  if (supported === null) return null;

  if (!supported) {
    /* CSS-only fallback for non-WebGL environments */
    return (
      <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%,-50%)",
          width: "60vw", height: "60vw", maxWidth: 600, maxHeight: 600,
          borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(213,181,114,0.08) 0%, transparent 70%)",
          animation: "pulse 4s ease infinite",
        }} />
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%,-50%)",
          width: "50vw", height: "50vw", maxWidth: 500, maxHeight: 500,
          borderRadius: "50%", border: "1px solid rgba(213,181,114,0.15)",
          animation: "spin 20s linear infinite",
        }} />
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%,-50%)",
          width: "35vw", height: "35vw", maxWidth: 350, maxHeight: 350,
          borderRadius: "50%", border: "0.5px solid rgba(248,242,225,0.06)",
          animation: "spin 14s linear infinite reverse",
        }} />
      </div>
    );
  }

  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 60 }}
      dpr={[1, 1.5]}
      style={{ position: "absolute", inset: 0 }}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
    >
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
    </Canvas>
  );
}
