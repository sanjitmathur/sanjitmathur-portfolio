import { useRef, useMemo, Suspense, Component, ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

// WebGL support check
function isWebGLSupported(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

// Error boundary for the canvas
class CanvasErrorBoundary extends Component<{ children: ReactNode; fallback?: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode; fallback?: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) return this.props.fallback ?? null;
    return this.props.children;
  }
}

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
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.x = Math.sin(t * 0.3) * 0.4;
    ref.current.rotation.y = t * 0.15;
    ref.current.rotation.z = Math.cos(t * 0.2) * 0.2;
    ref.current.position.y = Math.sin(t * 0.4) * 0.2;
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
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.x = Math.cos(t * 0.2) * 0.5 + 1.2;
    ref.current.rotation.y = -t * 0.1;
    ref.current.position.y = Math.cos(t * 0.35) * 0.15;
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
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.x = t * 0.12;
    ref.current.rotation.y = t * 0.18;
    ref.current.position.y = Math.sin(t * 0.5) * 0.1;
  });
  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[0.6, 1]} />
      <meshBasicMaterial color="#c4a882" transparent opacity={0.08} wireframe />
    </mesh>
  );
}

function Scene() {
  return (
    <>
      <StarField />
      <FloatingRing />
      <FloatingRing2 />
      <GeometricOrb />
      <ambientLight intensity={0.5} />
    </>
  );
}

// CSS fallback background using radial gradients + animated dots
function CSSFallbackBackground() {
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {/* Subtle grain overlay */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "radial-gradient(circle at 1px 1px, rgba(196,168,130,0.08) 1px, transparent 0)",
        backgroundSize: "48px 48px",
        opacity: 0.5,
      }} />
      {/* Floating orbs via CSS */}
      {[
        { left: "15%", top: "20%", w: 320, delay: "0s" },
        { left: "65%", top: "60%", w: 220, delay: "3s" },
        { left: "80%", top: "15%", w: 180, delay: "1.5s" },
        { left: "35%", top: "75%", w: 260, delay: "4s" },
      ].map((orb, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: orb.left,
            top: orb.top,
            width: orb.w,
            height: orb.w,
            borderRadius: "50%",
            border: "1px solid rgba(196,168,130,0.08)",
            animation: `floatOrb 8s ease-in-out ${orb.delay} infinite`,
          }}
        />
      ))}
      {/* Animated ring */}
      <div style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        width: 500,
        height: 500,
        borderRadius: "50%",
        border: "1px solid rgba(196,168,130,0.06)",
        animation: "spinRing 20s linear infinite",
      }} />
      <div style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        width: 700,
        height: 700,
        borderRadius: "50%",
        border: "1px solid rgba(196,168,130,0.04)",
        animation: "spinRing 30s linear infinite reverse",
      }} />
      <style>{`
        @keyframes floatOrb {
          0%, 100% { transform: translateY(0px) scale(1); opacity: 0.5; }
          50% { transform: translateY(-20px) scale(1.02); opacity: 0.8; }
        }
        @keyframes spinRing {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default function Scene3D({ className = "" }: { className?: string }) {
  const webglSupported = isWebGLSupported();

  if (!webglSupported) {
    return <CSSFallbackBackground />;
  }

  return (
    <div className={className} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      <CanvasErrorBoundary fallback={<CSSFallbackBackground />}>
        <Canvas
          camera={{ position: [0, 0, 5], fov: 60 }}
          gl={{ antialias: true, alpha: true, failIfMajorPerformanceCaveat: false }}
          style={{ background: "transparent" }}
        >
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </Canvas>
      </CanvasErrorBoundary>
    </div>
  );
}
