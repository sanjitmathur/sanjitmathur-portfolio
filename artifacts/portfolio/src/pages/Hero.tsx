import { useEffect, useRef } from "react";
import Scene3D from "../components/Scene3D";

export default function Hero() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const els = [titleRef.current, subRef.current, lineRef.current, ctaRef.current, scrollRef.current];
    els.forEach((el, i) => {
      if (!el) return;
      el.style.opacity = "0";
      el.style.transform = "translateY(30px)";
      setTimeout(() => {
        if (!el) return;
        el.style.transition = `opacity 1s cubic-bezier(0.16, 1, 0.3, 1), transform 1s cubic-bezier(0.16, 1, 0.3, 1)`;
        el.style.transitionDelay = `${0.2 + i * 0.15}s`;
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      }, 50);
    });
  }, []);

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
      }}
    >
      {/* 3D Background */}
      <Scene3D />

      {/* Gradient overlays */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(61,107,104,0.08) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: "30%",
        background: "linear-gradient(to top, #0f0e0d, transparent)",
        pointerEvents: "none",
      }} />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 10, textAlign: "center", padding: "0 2rem", maxWidth: "900px" }}>
        <div ref={lineRef} style={{ marginBottom: "2rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
          <div style={{ height: "1px", width: "60px", background: "rgba(196,168,130,0.4)" }} />
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.68rem", letterSpacing: "0.25em", color: "rgba(196,168,130,0.6)", textTransform: "uppercase" }}>
            Computer & Autonomous Systems
          </span>
          <div style={{ height: "1px", width: "60px", background: "rgba(196,168,130,0.4)" }} />
        </div>

        <h1
          ref={titleRef}
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(3.5rem, 10vw, 8rem)",
            fontWeight: 400,
            lineHeight: 0.95,
            letterSpacing: "-0.03em",
            color: "#f0ebe3",
            marginBottom: "1.5rem",
          }}
        >
          Sanjit
          <br />
          <em style={{ fontStyle: "italic", color: "var(--fawn)" }}>Mathur</em>
        </h1>

        <p
          ref={subRef}
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "clamp(0.9rem, 2vw, 1.1rem)",
            color: "rgba(240,235,227,0.55)",
            fontWeight: 300,
            letterSpacing: "0.03em",
            maxWidth: "520px",
            margin: "0 auto 2.5rem",
            lineHeight: 1.7,
          }}
        >
          AI Engineer & Full-Stack Developer building ML pipelines,
          LLM-powered tools, and autonomous systems at the intersection
          of software and intelligence.
        </p>

        <div ref={ctaRef} style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <a
            href="#experience"
            className="btn-primary clickable"
            onClick={(e) => { e.preventDefault(); document.getElementById("experience")?.scrollIntoView({ behavior: "smooth" }); }}
          >
            <span>View Work</span>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </a>
          <a
            href="https://github.com/sanjitmathur"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline clickable"
          >
            <span>GitHub</span>
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollRef}
        style={{
          position: "absolute", bottom: "2.5rem", left: "50%", transform: "translateX(-50%)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem",
        }}
      >
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.2em", color: "rgba(196,168,130,0.4)", textTransform: "uppercase" }}>
          Scroll
        </span>
        <div style={{ width: "1px", height: "48px", background: "linear-gradient(to bottom, rgba(196,168,130,0.4), transparent)", animation: "pulse 2s ease-in-out infinite" }} />
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
      `}</style>
    </section>
  );
}
