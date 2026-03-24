import { useMouse3D } from "./Mouse3DContext";

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
      {/* Star field — warm fawn dots */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: [
          ...Array.from({ length: 60 }, (_, i) => {
            const x = ((i * 137.5) % 100).toFixed(2);
            const y = ((i * 89.3) % 100).toFixed(2);
            const s = (0.5 + (i % 3) * 0.4).toFixed(1);
            const o = (0.08 + (i % 5) * 0.06).toFixed(2);
            const warm = i % 3 === 0;
            const color = warm
              ? `rgba(196,168,130,${o})`      // fawn
              : `rgba(90,158,148,${Number(o) * 0.7})`; // teal-pale
            return `radial-gradient(circle ${s}px at ${x}% ${y}%, ${color} 0%, transparent 100%)`;
          }),
        ].join(", "),
        transform: `rotateX(${rx * 0.25}deg) rotateY(${ry * 0.25}deg)`,
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
        {/* Primary ring — Soft Fawn */}
        <div style={{
          position: "absolute",
          left: "50%", top: "50%",
          width: 680, height: 680,
          marginLeft: -340, marginTop: -340,
          borderRadius: "50%",
          border: "1px solid rgba(196,168,130,0.16)",
          transform: "rotateX(72deg)",
          animation: "ring1 20s linear infinite",
        }} />

        {/* Second ring — Stormy Teal */}
        <div style={{
          position: "absolute",
          left: "50%", top: "50%",
          width: 500, height: 500,
          marginLeft: -250, marginTop: -250,
          borderRadius: "50%",
          border: "1px solid rgba(58,112,104,0.22)",   /* teal */
          transform: "rotateX(55deg) rotateZ(45deg)",
          animation: "ring2 28s linear infinite reverse",
        }} />

        {/* Third ring — pale Iron */}
        <div style={{
          position: "absolute",
          left: "50%", top: "50%",
          width: 860, height: 860,
          marginLeft: -430, marginTop: -430,
          borderRadius: "50%",
          border: "0.5px solid rgba(107,96,89,0.12)",  /* iron */
          transform: "rotateX(80deg) rotateZ(20deg)",
          animation: "ring3 45s linear infinite",
        }} />

        {/* Fourth ring — Teal thin */}
        <div style={{
          position: "absolute",
          left: "50%", top: "50%",
          width: 360, height: 360,
          marginLeft: -180, marginTop: -180,
          borderRadius: "50%",
          border: "0.5px solid rgba(90,158,148,0.2)",
          transform: "rotateX(30deg) rotateZ(80deg)",
          animation: "ring4 15s linear infinite",
        }} />

        {/* Core orb — fawn glow */}
        <div style={{
          position: "absolute",
          left: "50%", top: "50%",
          width: 140, height: 140,
          marginLeft: -70, marginTop: -70,
          borderRadius: "50%",
          border: "1px solid rgba(196,168,130,0.2)",
          boxShadow: "0 0 40px rgba(196,168,130,0.05), 0 0 80px rgba(58,112,104,0.04)",
          animation: "orbFloat 9s ease-in-out infinite",
        }} />
        <div style={{
          position: "absolute",
          left: "50%", top: "50%",
          width: 140, height: 140,
          marginLeft: -70, marginTop: -70,
          borderRadius: "50%",
          border: "1px solid rgba(58,112,104,0.15)",
          transform: "rotateX(60deg)",
          animation: "orbFloat 9s ease-in-out 0.8s infinite",
        }} />
        <div style={{
          position: "absolute",
          left: "50%", top: "50%",
          width: 140, height: 140,
          marginLeft: -70, marginTop: -70,
          borderRadius: "50%",
          border: "1px solid rgba(168,146,122,0.12)",
          transform: "rotateY(60deg)",
          animation: "orbFloat 9s ease-in-out 1.6s infinite",
        }} />

        {/* Floating particles — fawn + teal mix */}
        {[
          { left: "14%",  top: "22%",  size: 2.5, delay: "0s",    z: 60,  teal: false },
          { left: "82%",  top: "18%",  size: 2,   delay: "1.2s",  z: 38,  teal: true  },
          { left: "72%",  top: "68%",  size: 3,   delay: "2.1s",  z: 75,  teal: false },
          { left: "24%",  top: "78%",  size: 2,   delay: "0.6s",  z: 28,  teal: true  },
          { left: "88%",  top: "52%",  size: 2.5, delay: "1.8s",  z: 48,  teal: false },
          { left: "9%",   top: "57%",  size: 2,   delay: "3.2s",  z: 66,  teal: true  },
          { left: "52%",  top: "12%",  size: 3,   delay: "2.6s",  z: 42,  teal: false },
          { left: "38%",  top: "88%",  size: 2,   delay: "4.1s",  z: 52,  teal: true  },
          { left: "62%",  top: "36%",  size: 1.5, delay: "0.9s",  z: 35,  teal: true  },
          { left: "28%",  top: "44%",  size: 2,   delay: "3.5s",  z: 55,  teal: false },
        ].map((p, i) => (
          <div key={i} style={{
            position: "absolute",
            left: p.left, top: p.top,
            width: p.size, height: p.size,
            borderRadius: "50%",
            background: p.teal ? "rgba(90,158,148,0.8)" : "rgba(196,168,130,0.75)",
            transform: `translateZ(${p.z}px)`,
            animation: `particle 7s ease-in-out ${p.delay} infinite`,
            boxShadow: p.teal
              ? `0 0 6px rgba(90,158,148,0.5)`
              : `0 0 6px rgba(196,168,130,0.4)`,
          }} />
        ))}

        {/* Perspective grid floor */}
        <div style={{
          position: "absolute",
          inset: 0,
          backgroundImage: [
            "linear-gradient(rgba(74,63,56,0.06) 1px, transparent 1px)",
            "linear-gradient(90deg, rgba(74,63,56,0.06) 1px, transparent 1px)",
          ].join(", "),
          backgroundSize: "72px 72px",
          transform: "rotateX(84deg) translateZ(-80px) scale(5)",
          transformOrigin: "50% 100%",
        }} />

        {/* Dual glow — teal left, fawn right */}
        <div style={{
          position: "absolute",
          left: "20%", top: "50%",
          transform: "translateY(-50%) translateZ(-150px)",
          width: 400, height: 400,
          borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(58,112,104,0.09) 0%, transparent 70%)",
        }} />
        <div style={{
          position: "absolute",
          right: "20%", top: "50%",
          transform: "translateY(-50%) translateZ(-150px)",
          width: 400, height: 400,
          borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(196,168,130,0.06) 0%, transparent 70%)",
        }} />
      </div>

      <style>{`
        @keyframes ring1 {
          from { transform: rotateX(72deg) rotateZ(0deg); }
          to   { transform: rotateX(72deg) rotateZ(360deg); }
        }
        @keyframes ring2 {
          from { transform: rotateX(55deg) rotateZ(45deg); }
          to   { transform: rotateX(55deg) rotateZ(405deg); }
        }
        @keyframes ring3 {
          from { transform: rotateX(80deg) rotateZ(20deg); }
          to   { transform: rotateX(80deg) rotateZ(380deg); }
        }
        @keyframes ring4 {
          from { transform: rotateX(30deg) rotateZ(80deg); }
          to   { transform: rotateX(30deg) rotateZ(440deg); }
        }
        @keyframes orbFloat {
          0%, 100% { transform: rotateX(0deg) scale(1);    opacity: 0.55; }
          50%       { transform: rotateX(180deg) scale(1.04); opacity: 0.9; }
        }
        @keyframes particle {
          0%, 100% { transform: translateZ(var(--pz,50px)) translateY(0px);    opacity: 0.5; }
          50%       { transform: translateZ(var(--pz,50px)) translateY(-14px);  opacity: 1;   }
        }
      `}</style>
    </div>
  );
}
