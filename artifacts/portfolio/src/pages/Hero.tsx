import { useEffect, useRef, useState } from "react";
import Scene3D from "../components/Scene3D";
import { useMouse3D } from "../components/Mouse3DContext";

function AnimatedChar({ char, index }: { char: string; index: number }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 300 + index * 55);
    return () => clearTimeout(t);
  }, [index]);

  return (
    <span style={{
      display: "inline-block",
      opacity: visible ? 1 : 0,
      transform: visible
        ? "translateY(0) translateZ(0) rotateX(0deg)"
        : "translateY(60px) translateZ(-80px) rotateX(-45deg)",
      transition: `opacity 0.9s cubic-bezier(0.16,1,0.3,1), transform 0.9s cubic-bezier(0.16,1,0.3,1)`,
      transitionDelay: `${index * 0.055}s`,
      transformOrigin: "50% 100%",
    }}>
      {char === " " ? "\u00a0" : char}
    </span>
  );
}

function SplitText3D({ text, style = {}, italic = false }: { text: string; style?: React.CSSProperties; italic?: boolean }) {
  return (
    <span style={{ ...style, fontStyle: italic ? "italic" : "normal", display: "inline-block" }}>
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
  const badgeRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const items = [subtitleRef.current, ctaRef.current, badgeRef.current, scrollRef.current];
    items.forEach((el, i) => {
      if (!el) return;
      el.style.opacity = "0";
      el.style.transform = "translateY(40px) translateZ(-40px)";
      setTimeout(() => {
        if (!el) return;
        el.style.transition = "opacity 1s cubic-bezier(0.16,1,0.3,1), transform 1s cubic-bezier(0.16,1,0.3,1)";
        el.style.opacity = "1";
        el.style.transform = "translateY(0) translateZ(0)";
      }, 900 + i * 150);
    });
  }, []);

  // 3D parallax layers
  const heroTiltX = mouse.y * 6;
  const heroTiltY = mouse.x * 8;
  const layer1X = mouse.x * 18;
  const layer1Y = -mouse.y * 18;
  const layer2X = mouse.x * 10;
  const layer2Y = -mouse.y * 10;
  const layer3X = mouse.x * 28;
  const layer3Y = -mouse.y * 28;

  return (
    <section
      id="about"
      style={{
        minHeight: "100vh",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        perspective: "1200px",
      }}
    >
      {/* 3D Background */}
      <Scene3D intensity={1.2} />

      {/* Gradient overlays */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse 70% 70% at 50% 50%, rgba(61,107,104,0.1) 0%, transparent 65%)",
        pointerEvents: "none", zIndex: 1,
      }} />
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: "35%",
        background: "linear-gradient(to top, #0f0e0d, transparent)",
        pointerEvents: "none", zIndex: 2,
      }} />

      {/* Parallax floating label — deep layer */}
      <div
        ref={badgeRef}
        style={{
          position: "absolute", top: "14%", right: "8%",
          transform: `translate(${layer3X}px, ${layer3Y}px)`,
          transition: "transform 0.08s linear",
          zIndex: 5,
        }}
      >
        <div style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: "0.58rem", letterSpacing: "0.2em",
          color: "rgba(196,168,130,0.35)",
          textTransform: "uppercase",
          border: "1px solid rgba(196,168,130,0.12)",
          padding: "0.4rem 0.8rem",
          transform: "rotate(-3deg)",
        }}>
          Available for hire
        </div>
      </div>

      {/* Parallax floating coordinates */}
      <div style={{
        position: "absolute", bottom: "18%", left: "5%",
        transform: `translate(${layer3X * 0.6}px, ${layer3Y * 0.6}px)`,
        transition: "transform 0.08s linear",
        zIndex: 5,
      }}>
        <div style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: "0.55rem", letterSpacing: "0.15em",
          color: "rgba(196,168,130,0.2)",
          lineHeight: 1.8,
        }}>
          24.9°N / 67.1°E<br />Dubai, UAE
        </div>
      </div>

      {/* Main hero content — 3D tilting */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          textAlign: "center",
          padding: "0 2rem",
          maxWidth: "960px",
          transformStyle: "preserve-3d",
          transform: `rotateX(${heroTiltX}deg) rotateY(${heroTiltY}deg)`,
          transition: "transform 0.08s linear",
        }}
      >
        {/* Label */}
        <div
          style={{
            marginBottom: "1.5rem",
            display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem",
            transform: `translate(${layer1X * 0.3}px, ${layer1Y * 0.3}px) translateZ(20px)`,
            transition: "transform 0.08s linear",
          }}
        >
          <div style={{ height: "1px", width: "48px", background: "rgba(196,168,130,0.35)" }} />
          <span style={{
            fontFamily: "'Space Mono', monospace", fontSize: "0.62rem",
            letterSpacing: "0.22em", color: "rgba(196,168,130,0.55)",
            textTransform: "uppercase",
          }}>
            Computer & Autonomous Systems
          </span>
          <div style={{ height: "1px", width: "48px", background: "rgba(196,168,130,0.35)" }} />
        </div>

        {/* Title — 3D split letter animation */}
        <h1
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(4rem, 12vw, 9.5rem)",
            fontWeight: 400,
            lineHeight: 0.92,
            letterSpacing: "-0.04em",
            marginBottom: "1.25rem",
            perspective: "800px",
            transformStyle: "preserve-3d",
            transform: `translateZ(30px) translate(${layer2X * 0.2}px, ${layer2Y * 0.2}px)`,
            transition: "transform 0.08s linear",
          }}
        >
          <div style={{ color: "#f0ebe3", display: "block" }}>
            <SplitText3D text="Sanjit" />
          </div>
          <div style={{ display: "block" }}>
            <SplitText3D
              text="Mathur"
              style={{ color: "var(--fawn)" }}
              italic
            />
          </div>
        </h1>

        {/* Subtitle */}
        <div
          ref={subtitleRef}
          style={{
            transform: `translateZ(10px) translate(${layer1X * 0.15}px, ${layer1Y * 0.15}px)`,
            transition: "transform 0.08s linear",
            marginBottom: "2.5rem",
          }}
        >
          <p style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "clamp(0.9rem, 2vw, 1.05rem)",
            color: "rgba(240,235,227,0.5)",
            fontWeight: 300,
            letterSpacing: "0.02em",
            maxWidth: "500px",
            margin: "0 auto",
            lineHeight: 1.75,
          }}>
            AI Engineer & Full-Stack Developer building ML pipelines,
            LLM-powered tools, and autonomous systems at the edge of software and intelligence.
          </p>
        </div>

        {/* CTA buttons */}
        <div
          ref={ctaRef}
          style={{
            display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap",
            transform: `translateZ(5px)`,
          }}
        >
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
      <div
        ref={scrollRef}
        style={{
          position: "absolute", bottom: "2rem", left: "50%",
          transform: "translateX(-50%)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: "0.4rem",
          zIndex: 10,
        }}
      >
        <span style={{
          fontFamily: "'Space Mono', monospace", fontSize: "0.55rem",
          letterSpacing: "0.25em", color: "rgba(196,168,130,0.3)",
          textTransform: "uppercase",
        }}>
          Scroll
        </span>
        <div style={{
          width: "1px", height: "52px",
          background: "linear-gradient(to bottom, rgba(196,168,130,0.5), transparent)",
          animation: "scrollPulse 2s ease-in-out infinite",
        }} />
      </div>

      <style>{`
        @keyframes scrollPulse {
          0%, 100% { opacity: 0.3; transform: scaleY(1); }
          50% { opacity: 1; transform: scaleY(1.05); }
        }
      `}</style>
    </section>
  );
}
