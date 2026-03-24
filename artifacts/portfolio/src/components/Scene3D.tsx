import { useMouse3D } from "./Mouse3DContext";

const codeFragments = [
  "model.fit(X_train, y_train)",
  "kubectl apply -f deploy.yaml",
  "const embed = await openai.embed()",
  "torch.nn.Transformer(d_model=512)",
  "docker build -t api:latest .",
  "SELECT * FROM embeddings",
  "async def infer(prompt: str)",
  "git push origin main",
  "np.argmax(logits, axis=-1)",
  "pipeline('text-generation')",
];

const positions = [
  { left: "4%",  top: "12%", delay: "0s",   dur: "14s",  z: 28,  opacity: 0.22 },
  { left: "62%", top: "8%",  delay: "3s",   dur: "18s",  z: 14,  opacity: 0.18 },
  { left: "80%", top: "35%", delay: "1.5s", dur: "22s",  z: 36,  opacity: 0.14 },
  { left: "6%",  top: "58%", delay: "5s",   dur: "16s",  z: 20,  opacity: 0.2  },
  { left: "55%", top: "72%", delay: "2s",   dur: "20s",  z: 32,  opacity: 0.15 },
  { left: "30%", top: "88%", delay: "4s",   dur: "19s",  z: 18,  opacity: 0.17 },
  { left: "88%", top: "64%", delay: "6s",   dur: "24s",  z: 10,  opacity: 0.13 },
  { left: "22%", top: "22%", delay: "1s",   dur: "17s",  z: 44,  opacity: 0.19 },
];

export default function Scene3D({ intensity = 1 }: { intensity?: number }) {
  const mouse = useMouse3D();
  const rx = mouse.y * 5 * intensity;
  const ry = mouse.x * 7 * intensity;

  return (
    <div style={{
      position: "absolute", inset: 0,
      pointerEvents: "none",
      overflow: "hidden",
    }}>
      {/* Base grid — circuit board feel */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: [
          "linear-gradient(rgba(58,112,104,0.055) 1px, transparent 1px)",
          "linear-gradient(90deg, rgba(58,112,104,0.055) 1px, transparent 1px)",
        ].join(", "),
        backgroundSize: "72px 72px",
        transform: `translate(${mouse.x * 6}px, ${-mouse.y * 6}px)`,
        transition: "transform 0.12s linear",
      }} />

      {/* Dot intersections on grid */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "radial-gradient(circle 1.5px at center, rgba(58,112,104,0.25) 0%, transparent 100%)",
        backgroundSize: "72px 72px",
        transform: `translate(${mouse.x * 6}px, ${-mouse.y * 6}px)`,
        transition: "transform 0.12s linear",
      }} />

      {/* Diagonal circuit traces — geometric lines */}
      <svg
        style={{
          position: "absolute", inset: 0, width: "100%", height: "100%",
          transform: `translate(${mouse.x * 10}px, ${-mouse.y * 10}px)`,
          transition: "transform 0.1s linear",
        }}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Horizontal trace with junction */}
        <line x1="0" y1="30%" x2="18%" y2="30%" stroke="rgba(58,112,104,0.18)" strokeWidth="0.8" />
        <circle cx="18%" cy="30%" r="2.5" fill="rgba(58,112,104,0.25)" />
        <line x1="18%" y1="30%" x2="18%" y2="48%" stroke="rgba(58,112,104,0.14)" strokeWidth="0.8" />
        <circle cx="18%" cy="48%" r="2" fill="rgba(196,168,130,0.2)" />

        {/* Right side trace */}
        <line x1="100%" y1="22%" x2="74%" y2="22%" stroke="rgba(58,112,104,0.15)" strokeWidth="0.8" />
        <line x1="74%" y1="22%" x2="74%" y2="55%" stroke="rgba(58,112,104,0.12)" strokeWidth="0.8" />
        <circle cx="74%" cy="55%" r="2.5" fill="rgba(58,112,104,0.2)" />
        <line x1="74%" y1="55%" x2="100%" y2="55%" stroke="rgba(58,112,104,0.12)" strokeWidth="0.8" />

        {/* Bottom trace */}
        <line x1="0" y1="75%" x2="35%" y2="75%" stroke="rgba(196,168,130,0.1)" strokeWidth="0.8" />
        <circle cx="35%" cy="75%" r="2" fill="rgba(196,168,130,0.18)" />
        <line x1="35%" y1="75%" x2="35%" y2="95%" stroke="rgba(196,168,130,0.08)" strokeWidth="0.8" />

        {/* Center vertical */}
        <line x1="50%" y1="0" x2="50%" y2="18%" stroke="rgba(58,112,104,0.1)" strokeWidth="0.8" strokeDasharray="4 6" />
        <line x1="50%" y1="82%" x2="50%" y2="100%" stroke="rgba(58,112,104,0.1)" strokeWidth="0.8" strokeDasharray="4 6" />

        {/* Animated scan line */}
        <line x1="0" y1="0" x2="100%" y2="0" stroke="rgba(58,112,104,0.12)" strokeWidth="1">
          <animateTransform attributeName="transform" type="translate" from="0,0" to="0,100%" dur="8s" repeatCount="indefinite" />
        </line>
      </svg>

      {/* Floating code fragments */}
      <div style={{
        position: "absolute", inset: 0,
        perspective: "900px",
        perspectiveOrigin: "50% 50%",
        transformStyle: "preserve-3d",
        transform: `rotateX(${rx}deg) rotateY(${ry}deg)`,
        transition: "transform 0.08s linear",
      }}>
        {positions.map((pos, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: pos.left,
              top: pos.top,
              transform: `translateZ(${pos.z}px)`,
              fontFamily: "var(--app-font-mono)",
              fontSize: "0.6rem",
              letterSpacing: "0.02em",
              color: i % 3 === 0
                ? `rgba(90,158,148,${pos.opacity})`    // teal-pale
                : i % 3 === 1
                ? `rgba(196,168,130,${pos.opacity})`   // fawn
                : `rgba(107,96,89,${pos.opacity + 0.05})`,  // iron
              whiteSpace: "nowrap",
              animation: `codeFloat ${pos.dur} ease-in-out ${pos.delay} infinite`,
              pointerEvents: "none",
            }}
          >
            {codeFragments[i % codeFragments.length]}
          </div>
        ))}

        {/* Blinking node dots in 3D space */}
        {[
          { left: "15%", top: "40%", z: 55, teal: true  },
          { left: "78%", top: "25%", z: 30, teal: false },
          { left: "45%", top: "80%", z: 70, teal: true  },
          { left: "88%", top: "72%", z: 20, teal: false },
          { left: "8%",  top: "82%", z: 44, teal: true  },
        ].map((dot, i) => (
          <div key={`dot-${i}`} style={{
            position: "absolute",
            left: dot.left, top: dot.top,
            width: 4, height: 4,
            borderRadius: "50%",
            background: dot.teal ? "rgba(90,158,148,0.7)" : "rgba(196,168,130,0.6)",
            transform: `translateZ(${dot.z}px)`,
            boxShadow: dot.teal
              ? "0 0 8px rgba(90,158,148,0.5), 0 0 16px rgba(58,112,104,0.2)"
              : "0 0 8px rgba(196,168,130,0.45)",
            animation: `nodeBlink 3s ease-in-out ${i * 0.7}s infinite`,
          }} />
        ))}
      </div>

      {/* Center vignette — subtle depth */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse 70% 65% at 50% 50%, transparent 0%, rgba(12,11,10,0.35) 100%)",
        pointerEvents: "none",
      }} />

      {/* Dual tonal glow — teal left, fawn right (very subtle) */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse 50% 60% at 15% 50%, rgba(58,112,104,0.06) 0%, transparent 65%), radial-gradient(ellipse 45% 55% at 85% 50%, rgba(196,168,130,0.05) 0%, transparent 60%)",
        transform: `translate(${mouse.x * 8}px, ${-mouse.y * 8}px)`,
        transition: "transform 0.15s linear",
        pointerEvents: "none",
      }} />

      <style>{`
        @keyframes codeFloat {
          0%, 100% { opacity: 0; transform: translateY(0px) translateZ(inherit); }
          10%, 90% { opacity: 1; }
          50% { transform: translateY(-10px) translateZ(inherit); }
        }
        @keyframes nodeBlink {
          0%, 100% { opacity: 0.4; transform: translateZ(inherit) scale(1); }
          50% { opacity: 1; transform: translateZ(inherit) scale(1.5); }
        }
      `}</style>
    </div>
  );
}
