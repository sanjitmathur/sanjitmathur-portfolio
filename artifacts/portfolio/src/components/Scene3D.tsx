import { useMouse3D } from "./Mouse3DContext";

// Pure CSS 3D scene — cinematic, deep, rich
export default function Scene3D({ intensity = 1 }: { intensity?: number }) {
  const mouse = useMouse3D();
  const rx = mouse.y * 8 * intensity;
  const ry = mouse.x * 12 * intensity;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        perspective: "1200px",
        perspectiveOrigin: "50% 50%",
        overflow: "hidden",
      }}
    >
      {/* Deep star field using CSS radial gradients */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: [
          ...Array.from({ length: 80 }, (_, i) => {
            const x = ((i * 137.5) % 100).toFixed(2);
            const y = ((i * 89.3) % 100).toFixed(2);
            const s = (0.5 + (i % 3) * 0.5).toFixed(1);
            const o = (0.15 + (i % 5) * 0.1).toFixed(2);
            return `radial-gradient(circle ${s}px at ${x}% ${y}%, rgba(196,168,130,${o}) 0%, transparent 100%)`;
          }),
        ].join(", "),
        transform: `rotateX(${rx * 0.3}deg) rotateY(${ry * 0.3}deg)`,
        transition: "transform 0.1s linear",
      }} />

      {/* 3D scene container */}
      <div style={{
        position: "absolute",
        inset: 0,
        transformStyle: "preserve-3d",
        transform: `rotateX(${rx}deg) rotateY(${ry}deg)`,
        transition: "transform 0.08s linear",
      }}>
        {/* Primary ring — massive, tilted */}
        <div style={{
          position: "absolute",
          left: "50%", top: "50%",
          width: 700, height: 700,
          marginLeft: -350, marginTop: -350,
          borderRadius: "50%",
          border: "1px solid rgba(196,168,130,0.18)",
          transformStyle: "preserve-3d",
          transform: "rotateX(72deg) rotateZ(0deg)",
          animation: "ring1 18s linear infinite",
        }} />

        {/* Second ring — counter-rotate */}
        <div style={{
          position: "absolute",
          left: "50%", top: "50%",
          width: 520, height: 520,
          marginLeft: -260, marginTop: -260,
          borderRadius: "50%",
          border: "1px solid rgba(196,168,130,0.12)",
          transformStyle: "preserve-3d",
          transform: "rotateX(55deg) rotateZ(45deg)",
          animation: "ring2 25s linear infinite reverse",
        }} />

        {/* Third ring — thin and far */}
        <div style={{
          position: "absolute",
          left: "50%", top: "50%",
          width: 900, height: 900,
          marginLeft: -450, marginTop: -450,
          borderRadius: "50%",
          border: "0.5px solid rgba(196,168,130,0.07)",
          transform: "rotateX(80deg) rotateZ(20deg)",
          animation: "ring3 40s linear infinite",
        }} />

        {/* Inner wireframe dodecahedron simulation using nested rings */}
        <div style={{
          position: "absolute",
          left: "50%", top: "50%",
          width: 200, height: 200,
          marginLeft: -100, marginTop: -100,
          borderRadius: "50%",
          border: "1px solid rgba(196,168,130,0.25)",
          transform: "rotateX(0deg)",
          animation: "orb 8s ease-in-out infinite",
          boxShadow: "0 0 60px rgba(196,168,130,0.06), inset 0 0 60px rgba(196,168,130,0.04)",
        }} />
        <div style={{
          position: "absolute",
          left: "50%", top: "50%",
          width: 200, height: 200,
          marginLeft: -100, marginTop: -100,
          borderRadius: "50%",
          border: "1px solid rgba(196,168,130,0.15)",
          transform: "rotateX(60deg)",
          animation: "orb 8s ease-in-out 0.5s infinite",
        }} />
        <div style={{
          position: "absolute",
          left: "50%", top: "50%",
          width: 200, height: 200,
          marginLeft: -100, marginTop: -100,
          borderRadius: "50%",
          border: "1px solid rgba(196,168,130,0.1)",
          transform: "rotateY(60deg)",
          animation: "orb 8s ease-in-out 1s infinite",
        }} />

        {/* Floating particles */}
        {[
          { left: "15%", top: "25%", size: 3, delay: "0s", z: 60 },
          { left: "80%", top: "20%", size: 2, delay: "1s", z: 40 },
          { left: "70%", top: "70%", size: 4, delay: "2s", z: 80 },
          { left: "25%", top: "75%", size: 2, delay: "0.5s", z: 30 },
          { left: "90%", top: "50%", size: 3, delay: "1.5s", z: 50 },
          { left: "10%", top: "55%", size: 2, delay: "3s", z: 70 },
          { left: "50%", top: "15%", size: 3, delay: "2.5s", z: 45 },
          { left: "35%", top: "85%", size: 2, delay: "4s", z: 55 },
        ].map((p, i) => (
          <div key={i} style={{
            position: "absolute",
            left: p.left, top: p.top,
            width: p.size, height: p.size,
            borderRadius: "50%",
            background: "rgba(196,168,130,0.7)",
            transform: `translateZ(${p.z}px)`,
            animation: `particle 6s ease-in-out ${p.delay} infinite`,
            boxShadow: "0 0 8px rgba(196,168,130,0.5)",
          }} />
        ))}

        {/* Diagonal grid lines */}
        <div style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "linear-gradient(rgba(196,168,130,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(196,168,130,0.03) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          transform: "rotateX(85deg) translateZ(-100px) scale(4)",
          transformOrigin: "50% 100%",
        }} />

        {/* Horizon glow */}
        <div style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translateX(-50%) translateY(-50%) translateZ(-200px)",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(61,107,104,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
      </div>

      <style>{`
        @keyframes ring1 {
          from { transform: rotateX(72deg) rotateZ(0deg); }
          to { transform: rotateX(72deg) rotateZ(360deg); }
        }
        @keyframes ring2 {
          from { transform: rotateX(55deg) rotateZ(45deg); }
          to { transform: rotateX(55deg) rotateZ(405deg); }
        }
        @keyframes ring3 {
          from { transform: rotateX(80deg) rotateZ(20deg); }
          to { transform: rotateX(80deg) rotateZ(380deg); }
        }
        @keyframes orb {
          0%, 100% { transform: rotateX(0deg) scale(1); opacity: 0.6; }
          50% { transform: rotateX(180deg) scale(1.05); opacity: 1; }
        }
        @keyframes particle {
          0%, 100% { transform: translateZ(var(--pz, 50px)) translateY(0px); opacity: 0.6; }
          50% { transform: translateZ(var(--pz, 50px)) translateY(-15px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
