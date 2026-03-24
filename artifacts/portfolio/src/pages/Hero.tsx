import { useEffect, useRef, useState } from "react";
import Scene3D from "../components/Scene3D";
import { useMouse3D } from "../components/Mouse3DContext";

function AnimatedChar({ char, index }: { char: string; index: number }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 300 + index * 48);
    return () => clearTimeout(t);
  }, [index]);

  return (
    <span style={{
      display: "inline-block",
      opacity: visible ? 1 : 0,
      transform: visible
        ? "translateY(0) translateZ(0) rotateX(0deg)"
        : "translateY(60px) translateZ(-80px) rotateX(-45deg)",
      transition: "opacity 0.85s cubic-bezier(0.16,1,0.3,1), transform 0.85s cubic-bezier(0.16,1,0.3,1)",
      transitionDelay: `${index * 0.048}s`,
      transformOrigin: "50% 100%",
    }}>
      {char === " " ? "\u00a0" : char}
    </span>
  );
}

function TerminalBlock() {
  const lines = [
    { prefix: "→", text: "AI Engineer & Full-Stack Dev", color: "var(--teal-pale)" },
    { prefix: "$", text: "specialization = ['LLMs', 'MLOps', 'Systems']", color: "var(--iron)" },
    { prefix: "→", text: "currently @ Baraka Financial · Dubai", color: "var(--oak)" },
    { prefix: "#", text: "UOWD · Computer & Autonomous Systems Eng.", color: "var(--iron)" },
  ];
  const [shown, setShown] = useState(0);

  useEffect(() => {
    let i = 0;
    const t = setInterval(() => {
      i += 1;
      setShown(i);
      if (i >= lines.length) clearInterval(t);
    }, 420);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{
      fontFamily: "var(--app-font-mono)",
      fontSize: "clamp(0.62rem, 1.3vw, 0.75rem)",
      lineHeight: 2,
      textAlign: "left",
      maxWidth: "520px",
      margin: "0 auto",
      padding: "1.25rem 1.5rem",
      background: "rgba(20,18,16,0.7)",
      border: "1px solid rgba(74,63,56,0.3)",
      borderTop: "2px solid var(--teal)",
      backdropFilter: "blur(8px)",
      position: "relative",
    }}>
      {/* Terminal traffic lights */}
      <div style={{ display: "flex", gap: "0.35rem", marginBottom: "1rem" }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "rgba(196,168,130,0.25)" }} />
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "rgba(107,96,89,0.2)" }} />
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "rgba(58,112,104,0.3)" }} />
      </div>
      {lines.slice(0, shown).map((line, i) => (
        <div key={i} style={{ display: "flex", gap: "0.6rem", opacity: 1, animation: "fadeInLine 0.3s ease" }}>
          <span style={{ color: "var(--teal)", flexShrink: 0, width: "0.9rem", textAlign: "center" }}>{line.prefix}</span>
          <span style={{ color: line.color }}>{line.text}</span>
        </div>
      ))}
      {shown < lines.length && (
        <div style={{ display: "flex", gap: "0.6rem" }}>
          <span style={{ color: "var(--teal)" }}>→</span>
          <span style={{ color: "var(--iron)", animation: "blink 1s step-end infinite" }}>▌</span>
        </div>
      )}
      <style>{`
        @keyframes fadeInLine { from { opacity: 0; transform: translateX(-6px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
      `}</style>
    </div>
  );
}

export default function Hero() {
  const mouse = useMouse3D();
  const subtitleRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    [subtitleRef, ctaRef, scrollRef].forEach((ref, i) => {
      const el = ref.current;
      if (!el) return;
      el.style.opacity = "0";
      el.style.transform = "translateY(28px)";
      setTimeout(() => {
        if (!el) return;
        el.style.transition = "opacity 1s cubic-bezier(0.16,1,0.3,1), transform 1s cubic-bezier(0.16,1,0.3,1)";
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      }, 1100 + i * 130);
    });
  }, []);

  const heroTiltX = mouse.y * 4;
  const heroTiltY = mouse.x * 5;
  const layer1X   = mouse.x * 12;
  const layer1Y   = -mouse.y * 12;
  const layer3X   = mouse.x * 22;
  const layer3Y   = -mouse.y * 22;

  return (
    <section id="about" style={{
      minHeight: "100vh",
      position: "relative",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      perspective: "1200px",
    }}>
      <Scene3D intensity={1.0} />

      {/* Bottom fade to next section */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: "30%",
        background: "linear-gradient(to top, var(--carbon), transparent)",
        pointerEvents: "none", zIndex: 2,
      }} />

      {/* Floating status badge — top right */}
      <div style={{
        position: "absolute", top: "15%", right: "6%",
        transform: `translate(${layer3X}px, ${layer3Y}px)`,
        transition: "transform 0.08s linear",
        zIndex: 5,
      }}>
        <div style={{
          fontFamily: "var(--app-font-mono)", fontSize: "0.52rem",
          letterSpacing: "0.18em", color: "var(--teal-pale)",
          textTransform: "uppercase",
          border: "1px solid rgba(58,112,104,0.3)",
          padding: "0.3rem 0.65rem",
          background: "rgba(58,112,104,0.04)",
          display: "flex", alignItems: "center", gap: "0.4rem",
        }}>
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--teal-pale)", display: "inline-block", animation: "blink 2s ease-in-out infinite" }} />
          Open to Work
        </div>
      </div>

      {/* Floating coordinates — bottom left */}
      <div style={{
        position: "absolute", bottom: "18%", left: "4%",
        transform: `translate(${layer3X * 0.45}px, ${layer3Y * 0.45}px)`,
        transition: "transform 0.08s linear",
        zIndex: 5,
        fontFamily: "var(--app-font-mono)", fontSize: "0.5rem",
        letterSpacing: "0.14em", color: "var(--iron)", lineHeight: 2,
      }}>
        25.2°N / 55.3°E<br />Dubai, UAE
      </div>

      {/* Main 3D tilt block */}
      <div style={{
        position: "relative", zIndex: 10,
        textAlign: "center",
        padding: "0 2rem", maxWidth: "820px", width: "100%",
        transformStyle: "preserve-3d",
        transform: `rotateX(${heroTiltX}deg) rotateY(${heroTiltY}deg)`,
        transition: "transform 0.08s linear",
      }}>
        {/* Section tag */}
        <div style={{
          marginBottom: "1.5rem",
          display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem",
          transform: `translate(${layer1X * 0.24}px, ${layer1Y * 0.24}px) translateZ(18px)`,
          transition: "transform 0.08s linear",
        }}>
          <div style={{ height: "1px", width: "36px", background: "rgba(58,112,104,0.45)" }} />
          <span style={{ fontFamily: "var(--app-font-mono)", fontSize: "0.58rem", letterSpacing: "0.22em", color: "var(--teal-pale)", textTransform: "uppercase" }}>
            AI Engineer / Full-Stack Developer
          </span>
          <div style={{ height: "1px", width: "36px", background: "rgba(58,112,104,0.45)" }} />
        </div>

        {/* Name — 3D letter-by-letter */}
        <h1 style={{
          fontFamily: "var(--app-font-serif)",
          fontSize: "clamp(3.8rem, 11vw, 9rem)",
          fontWeight: 400,
          lineHeight: 0.92,
          letterSpacing: "-0.04em",
          marginBottom: "2rem",
          perspective: "700px",
          transformStyle: "preserve-3d",
          transform: `translateZ(28px) translate(${layer1X * 0.14}px, ${layer1Y * 0.14}px)`,
          transition: "transform 0.08s linear",
        }}>
          <div style={{ display: "block" }}>
            {"Sanjit".split("").map((c, i) => (
              <AnimatedChar key={i} char={c} index={i} />
            ))}
          </div>
          <div style={{ display: "block" }}>
            <em style={{ fontStyle: "italic", color: "var(--fawn)" }}>
              {"Mathur".split("").map((c, i) => (
                <AnimatedChar key={i} char={c} index={i + 7} />
              ))}
            </em>
          </div>
        </h1>

        {/* Terminal block */}
        <div ref={subtitleRef} style={{ marginBottom: "2rem" }}>
          <TerminalBlock />
        </div>

        {/* CTAs */}
        <div ref={ctaRef} style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
          <a
            href="#experience"
            className="btn-primary clickable"
            onClick={(e) => { e.preventDefault(); document.getElementById("experience")?.scrollIntoView({ behavior: "smooth" }); }}
          >
            <span>View Work</span>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M1 6.5h11M6.5 1l5.5 5.5-5.5 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </a>
          <a href="https://linkedin.com/in/sanjit-mathur-/" target="_blank" rel="noopener noreferrer" className="btn-outline clickable">
            <span>LinkedIn</span>
          </a>
          <a href="https://github.com/sanjitmathur" target="_blank" rel="noopener noreferrer" className="btn-outline clickable">
            <span>GitHub</span>
          </a>
        </div>
      </div>

      {/* Scroll cue */}
      <div ref={scrollRef} style={{
        position: "absolute", bottom: "1.8rem", left: "50%",
        transform: "translateX(-50%)",
        display: "flex", flexDirection: "column", alignItems: "center", gap: "0.4rem",
        zIndex: 10,
      }}>
        <span style={{ fontFamily: "var(--app-font-mono)", fontSize: "0.5rem", letterSpacing: "0.24em", color: "var(--iron)", textTransform: "uppercase" }}>
          scroll
        </span>
        <div style={{
          width: "1px", height: "48px",
          background: "linear-gradient(to bottom, rgba(58,112,104,0.5), transparent)",
          animation: "scrollPulse 2s ease-in-out infinite",
        }} />
      </div>

      <style>{`
        @keyframes scrollPulse {
          0%, 100% { opacity: 0.25; }
          50% { opacity: 0.8; }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </section>
  );
}
