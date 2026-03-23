import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

function StarField() {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const count = 1800;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 20;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 20;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return arr;
  }, []);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.x += delta * 0.02;
      ref.current.rotation.y += delta * 0.015;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3}>
      <PointMaterial
        transparent
        color="#c4a882"
        size={0.018}
        sizeAttenuation
        depthWrite={false}
        opacity={0.6}
      />
    </Points>
  );
}

function FloatingRing() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime;
      ref.current.rotation.x = Math.sin(t * 0.3) * 0.4;
      ref.current.rotation.y = t * 0.15;
      ref.current.rotation.z = Math.cos(t * 0.2) * 0.2;
      ref.current.position.y = Math.sin(t * 0.4) * 0.2;
    }
  });

  return (
    <mesh ref={ref}>
      <torusGeometry args={[1.8, 0.006, 16, 200]} />
      <meshBasicMaterial color="#c4a882" transparent opacity={0.3} />
    </mesh>
  );
}

function FloatingRing2() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime;
      ref.current.rotation.x = Math.cos(t * 0.2) * 0.5 + 1.2;
      ref.current.rotation.y = -t * 0.1;
      ref.current.position.y = Math.cos(t * 0.35) * 0.15;
    }
  });

  return (
    <mesh ref={ref}>
      <torusGeometry args={[2.4, 0.004, 16, 200]} />
      <meshBasicMaterial color="#c4a882" transparent opacity={0.15} />
    </mesh>
  );
}

function GeometricOrb() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime;
      ref.current.rotation.x = t * 0.12;
      ref.current.rotation.y = t * 0.18;
      ref.current.position.y = Math.sin(t * 0.5) * 0.1;
    }
  });

  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[0.6, 1]} />
      <meshBasicMaterial color="#c4a882" transparent opacity={0.08} wireframe />
    </mesh>
  );
}

export default function Scene3D({ className = "" }: { className?: string }) {
  return (
    <div className={`three-canvas ${className}`} style={{ position: "absolute", inset: 0 }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <StarField />
        <FloatingRing />
        <FloatingRing2 />
        <GeometricOrb />
        <ambientLight intensity={0.5} />
      </Canvas>
    </div>
  );
}
