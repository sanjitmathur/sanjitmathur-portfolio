import { useMouse3D } from "./Mouse3DContext";

export default function Scene3D() {
  const mouse = useMouse3D();
  const rx = mouse.y * 4;
  const ry = mouse.x * 6;

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
      {/* Minimal grid — very light on ivory bg */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "linear-gradient(rgba(15,14,13,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(15,14,13,0.04) 1px, transparent 1px)",
        backgroundSize: "80px 80px",
        transform: `translate(${mouse.x * 5}px, ${-mouse.y * 5}px)`,
        transition: "transform 0.15s linear",
      }} />

      {/* 3D floating rings — very subtle on light bg */}
      <div style={{
        position: "absolute", inset: 0,
        perspective: "1000px", perspectiveOrigin: "50% 50%",
        transformStyle: "preserve-3d",
        transform: `rotateX(${rx}deg) rotateY(${ry}deg)`,
        transition: "transform 0.1s linear",
      }}>
        <div style={{
          position: "absolute", left: "50%", top: "50%",
          width: 600, height: 600, marginLeft: -300, marginTop: -300,
          borderRadius: "50%",
          border: "1px solid rgba(196,168,130,0.2)",
          transform: "rotateX(72deg)",
          animation: "r1 22s linear infinite",
        }} />
        <div style={{
          position: "absolute", left: "50%", top: "50%",
          width: 420, height: 420, marginLeft: -210, marginTop: -210,
          borderRadius: "50%",
          border: "0.5px solid rgba(58,112,104,0.18)",
          transform: "rotateX(50deg) rotateZ(40deg)",
          animation: "r1 30s linear infinite reverse",
        }} />
        <div style={{
          position: "absolute", left: "50%", top: "50%",
          width: 780, height: 780, marginLeft: -390, marginTop: -390,
          borderRadius: "50%",
          border: "0.5px solid rgba(15,14,13,0.06)",
          transform: "rotateX(78deg) rotateZ(15deg)",
          animation: "r1 48s linear infinite",
        }} />

        {/* Floating code / text fragments */}
        {[
          { t: "model.fit(X, y)", x: "10%", top: "18%", z: 50, c: "var(--teal)", o: 0.18 },
          { t: "kubectl apply", x: "72%", top: "14%", z: 32, c: "var(--fawn-dark)", o: 0.15 },
          { t: "async def infer()", x: "82%", top: "60%", z: 24, c: "var(--teal)", o: 0.14 },
          { t: "torch.nn.Linear", x: "6%",  top: "65%", z: 44, c: "var(--fawn-dark)", o: 0.16 },
          { t: "pipeline('text-gen')", x: "44%", top: "82%", z: 60, c: "var(--teal)", o: 0.13 },
          { t: "docker build .", x: "20%", top: "84%", z: 28, c: "var(--iron-dim)", o: 0.18 },
        ].map((f, i) => (
          <span key={i} style={{
            position: "absolute", left: f.x, top: f.top,
            fontFamily: "var(--app-font-mono)", fontSize: "0.58rem",
            color: f.c, opacity: f.o, whiteSpace: "nowrap",
            transform: `translateZ(${f.z}px)`,
            animation: `codeFloat ${14 + i * 3}s ease-in-out ${i * 1.2}s infinite`,
          }}>{f.t}</span>
        ))}
      </div>

      {/* Warm fawn glow — bottom center */}
      <div style={{
        position: "absolute", bottom: "-10%", left: "50%", transform: "translateX(-50%)",
        width: "60%", height: "40%",
        background: "radial-gradient(ellipse, rgba(196,168,130,0.12) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <style>{`
        @keyframes r1 {
          from { transform: rotateX(72deg) rotateZ(0deg); }
          to   { transform: rotateX(72deg) rotateZ(360deg); }
        }
        @keyframes codeFloat {
          0%, 100% { transform: translateY(0) translateZ(inherit); opacity: 0; }
          8%, 92%  { opacity: 1; }
          50% { transform: translateY(-12px) translateZ(inherit); }
        }
      `}</style>
    </div>
  );
}
