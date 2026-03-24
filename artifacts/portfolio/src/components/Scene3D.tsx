import { useMouse3D } from "./Mouse3DContext";

export default function Scene3D() {
  const mouse = useMouse3D();
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
      {/* Fine grid */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "linear-gradient(rgba(32,31,20,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(32,31,20,0.05) 1px, transparent 1px)",
        backgroundSize: "80px 80px",
        transform: `translate(${mouse.x * 4}px, ${-mouse.y * 4}px)`,
        transition: "transform 0.15s linear",
      }} />
      {/* Fawn glow top right */}
      <div style={{
        position: "absolute", top: "-20%", right: "-10%",
        width: "65vw", height: "65vw", borderRadius: "50%",
        background: "radial-gradient(ellipse, rgba(213,181,114,0.18) 0%, transparent 65%)",
        transform: `translate(${-mouse.x * 10}px, ${mouse.y * 10}px)`,
        transition: "transform 0.12s linear",
      }} />
      {/* Orbiting ring 1 — fawn */}
      <div style={{
        position: "absolute", left: "50%", top: "50%",
        width: "60vw", height: "60vw", maxWidth: 620, maxHeight: 620,
        marginLeft: "-30vw", marginTop: "-30vw",
        borderRadius: "50%",
        border: "1px solid rgba(213,181,114,0.18)",
        transform: "rotateX(70deg)",
        animation: "ring1 24s linear infinite",
        transformOrigin: "center center",
      }} />
      {/* Orbiting ring 2 — carbon thin */}
      <div style={{
        position: "absolute", left: "50%", top: "50%",
        width: "40vw", height: "40vw", maxWidth: 420, maxHeight: 420,
        marginLeft: "-20vw", marginTop: "-20vw",
        borderRadius: "50%",
        border: "0.5px solid rgba(32,31,20,0.08)",
        transform: "rotateX(55deg) rotateZ(35deg)",
        animation: "ring1 36s linear infinite reverse",
      }} />
      {/* Code fragment floaters — subtle */}
      {[
        { t: "model.fit(X, y)", l: "8%", top: "15%", o: 0.14, c: "rgba(213,181,114,0.9)" },
        { t: "kubectl apply", l: "70%", top: "12%", o: 0.11, c: "rgba(32,31,20,0.4)" },
        { t: "async def infer()", l: "80%", top: "55%", o: 0.1, c: "rgba(213,181,114,0.8)" },
        { t: "docker build .", l: "5%", top: "62%", o: 0.12, c: "rgba(32,31,20,0.3)" },
        { t: "pipeline('text-gen')", l: "42%", top: "80%", o: 0.1, c: "rgba(213,181,114,0.7)" },
      ].map((f, i) => (
        <span key={i} style={{
          position: "absolute", left: f.l, top: f.top,
          fontFamily: "var(--app-font-mono)", fontSize: "0.56rem",
          color: f.c, opacity: f.o, whiteSpace: "nowrap",
          animation: `codeF ${15 + i * 2.5}s ease-in-out ${i * 1.4}s infinite`,
        }}>{f.t}</span>
      ))}
      <style>{`
        @keyframes ring1 { from{transform:rotateX(70deg) rotateZ(0deg)} to{transform:rotateX(70deg) rotateZ(360deg)} }
        @keyframes codeF { 0%,100%{opacity:0;transform:translateY(0)} 10%,90%{opacity:1} 50%{transform:translateY(-10px)} }
      `}</style>
    </div>
  );
}
