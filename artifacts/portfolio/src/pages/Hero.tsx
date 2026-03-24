import { useEffect, useRef, useState } from "react";
import Scene3D from "../components/Scene3D";
import { useMouse3D } from "../components/Mouse3DContext";

function AnimatedChar({ char, index }: { char: string; index: number }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 300 + index * 52);
    return () => clearTimeout(t);
  }, [index]);

  return (
    <span style={{
      display: "inline-block",
      opacity: visible ? 1 : 0,
      transform: visible
        ? "translateY(0) translateZ(0) rotateX(0deg)"
        : "translateY(65px) translateZ(-90px) rotateX(-50deg)",
      transition: "opacity 0.9s cubic-bezier(0.16,1,0.3,1), transform 0.9s cubic-bezier(0.16,1,0.3,1)",
      transitionDelay: `${index * 0.052}s`,
      transformOrigin: "50% 100%",
    }}>
      {char === " " ? "\u00a0" : char}
    </span>
  );
}

function SplitText3D({ text, color, italic = false }: { text: string; color: string; italic?: boolean }) {
  return (
    <span style={{ color, fontStyle: italic ? "italic" : "normal", display: "inline-block" }}>
      {text.split("").map((char, i) => (
        <AnimatedChar key={i} char={char} index={i} />
      ))}
    </span>
  );
}

export default function Hero() {
  const mouse = useMouse3D();
  const subtitleRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const items = [subtitleRef.current, ctaRef.current, scrollRef.current];
    items.forEach((el, i) => {
      if (!el) return;
      el.style.opacity = "0";
      el.style.transform = "translateY(35px) translateZ(-30px)";
      setTimeout(() => {
        if (!el) return;
        el.style.transition = "opacity 1s cubic-bezier(0.16,1,0.3,1), transform 1s cubic-bezier(0.16,1,0.3,1)";
        el.style.opacity = "1";
        el.style.transform = "translateY(0) translateZ(0)";
      }, 950 + i * 140);
    });
  }, []);

  const heroTiltX = mouse.y * 5;
  const heroTiltY = mouse.x * 7;
  const layer1X   = mouse.x * 14;
  const layer1Y   = -mouse.y * 14;
  const layer3X   = mouse.x * 26;
  const layer3Y   = -mouse.y * 26;

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
      <Scene3D intensity={1.1} />

      {/* Dual tonal gradient: teal left, fawn right */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse 55% 55% at 25% 50%, rgba(58,112,104,0.07) 0%, transparent 60%), radial-gradient(ellipse 50% 50% at 75% 50%, rgba(196,168,130,0.05) 0%, transparent 60%)",
        pointerEvents: "none", zIndex: 1,
      }} />
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: "38%",
        background: "linear-gradient(to top, var(--carbon), transparent)",
        pointerEvents: "none", zIndex: 2,
      }} />

      {/* Floating "available" badge — teal accent */}
      <div style={{
        position: "absolute", top: "16%", right: "7%",
        transform: `translate(${layer3X}px, ${layer3Y}px)`,
        transition: "transform 0.08s linear",
        zIndex: 5,
      }}>
        <div style={{
          fontFamily: "var(--app-font-mono)", fontSize: "0.55rem",
          letterSpacing: "0.2em", color: "var(--teal-pale)",
          textTransform: "uppercase",
          border: "1px solid rgba(58,112,104,0.25)",
          padding: "0.38rem 0.75rem",
          transform: "rotate(-2deg)",
          background: "rgba(58,112,104,0.04)",
        }}>
          Available for hire
        </div>
      </div>

      {/* Floating location — iron */}
      <div style={{
        position: "absolute", bottom: "18%", left: "4%",
        transform: `translate(${layer3X * 0.55}px, ${layer3Y * 0.55}px)`,
        transition: "transform 0.08s linear",
        zIndex: 5,
      }}>
        <div style={{
          fontFamily: "var(--app-font-mono)", fontSize: "0.52rem",
          letterSpacing: "0.14em", color: "var(--iron)", lineHeight: 1.9,
        }}>
          24.9°N / 67.1°E<br />Dubai, UAE
        </div>
      </div>

      {/* Main content — 3D tilt block */}
      <div style={{
        position: "relative", zIndex: 10,
        textAlign: "center",
        padding: "0 2rem", maxWidth: "960px",
        transformStyle: "preserve-3d",
        transform: `rotateX(${heroTiltX}deg) rotateY(${heroTiltY}deg)`,
        transition: "transform 0.08s linear",
      }}>
        {/* Section tag — stormy teal */}
        <div style={{
          marginBottom: "1.75rem",
          display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem",
          transform: `translate(${layer1X * 0.28}px, ${layer1Y * 0.28}px) translateZ(22px)`,
          transition: "transform 0.08s linear",
        }}>
          <div style={{ height: "1px", width: "44px", background: "rgba(58,112,104,0.4)" }} />
          <span style={{ fontFamily: "var(--app-font-mono)", fontSize: "0.6rem", letterSpacing: "0.24em", color: "var(--teal-pale)", textTransform: "uppercase" }}>
            Computer & Autonomous Systems
          </span>
          <div style={{ height: "1px", width: "44px", background: "rgba(58,112,104,0.4)" }} />
        </div>

        {/* Split-text 3D name */}
        <h1 style={{
          fontFamily: "var(--app-font-serif)",
          fontSize: "clamp(4rem, 12vw, 9.5rem)",
          fontWeight: 400,
          lineHeight: 0.92,
          letterSpacing: "-0.04em",
          marginBottom: "1.5rem",
          perspective: "800px",
          transformStyle: "preserve-3d",
          transform: `translateZ(32px) translate(${layer1X * 0.18}px, ${layer1Y * 0.18}px)`,
          transition: "transform 0.08s linear",
        }}>
          <div style={{ display: "block" }}>
            <SplitText3D text="Sanjit" color="var(--ivory)" />
          </div>
          <div style={{ display: "block" }}>
            <SplitText3D text="Mathur" color="var(--fawn)" italic />
          </div>
        </h1>

        {/* Subtitle — oak / ivory-dim */}
        <div ref={subtitleRef} style={{ marginBottom: "2.75rem" }}>
          <p style={{
            fontFamily: "var(--app-font-sans)",
            fontSize: "clamp(0.88rem, 1.8vw, 1.05rem)",
            color: "var(--iron)",
            fontWeight: 300,
            letterSpacing: "0.02em",
            maxWidth: "480px",
            margin: "0 auto",
            lineHeight: 1.8,
          }}>
            AI Engineer & Full-Stack Developer building ML pipelines,
            LLM-powered tools, and autonomous systems at the edge of software and intelligence.
          </p>
        </div>

        {/* CTAs */}
        <div ref={ctaRef} style={{ display: "flex", gap: "0.85rem", justifyContent: "center", flexWrap: "wrap" }}>
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
        position: "absolute", bottom: "2rem", left: "50%",
        transform: "translateX(-50%)",
        display: "flex", flexDirection: "column", alignItems: "center", gap: "0.45rem",
        zIndex: 10,
      }}>
        <span style={{ fontFamily: "var(--app-font-mono)", fontSize: "0.52rem", letterSpacing: "0.26em", color: "var(--iron)", textTransform: "uppercase" }}>
          Scroll
        </span>
        <div style={{
          width: "1px", height: "52px",
          background: "linear-gradient(to bottom, var(--iron-dim), transparent)",
          animation: "scrollPulse 2.2s ease-in-out infinite",
        }} />
      </div>

      <style>{`
        @keyframes scrollPulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </section>
  );
}
