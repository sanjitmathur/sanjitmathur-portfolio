import { useEffect, useRef, useState } from "react";
import Magnetic from "../components/Magnetic";

const FULL_NAME = "Sanjit Mathur";

function TypewriterName() {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const idx = useRef(0);

  useEffect(() => {
    const delay = setTimeout(() => {
      const id = setInterval(() => {
        idx.current += 1;
        setDisplayed(FULL_NAME.slice(0, idx.current));
        if (idx.current >= FULL_NAME.length) {
          clearInterval(id);
          setTimeout(() => setDone(true), 800);
        }
      }, 90);
      return () => clearInterval(id);
    }, 600);
    return () => clearTimeout(delay);
  }, []);

  return (
    <span style={{ color: "var(--text)", position: "relative" }}>
      {displayed}
      {!done && (
        <span style={{
          display: "inline-block", width: "2px", height: "0.85em",
          background: "var(--text)", marginLeft: "2px", verticalAlign: "middle",
          animation: "blink 0.7s step-end infinite",
        }} />
      )}
    </span>
  );
}

export default function Hero() {
  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section id="about" style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      padding: `0 var(--section-px)`,
      background: "var(--bg)", position: "relative", overflow: "hidden",
      transition: "background 0.35s ease",
    }}>
      {/* Subtle grid */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: `linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)`,
        backgroundSize: "72px 72px",
        opacity: 0.5,
        maskImage: "radial-gradient(ellipse 75% 75% at 50% 50%, black 10%, transparent 100%)",
      }} />

      <div style={{ maxWidth: "var(--max-w)", margin: "0 auto", width: "100%", paddingTop: "6rem" }}>

        {/* Eyebrow label */}
        <div style={{
          display: "flex", alignItems: "center", gap: "0.75rem",
          marginBottom: "1.75rem", animation: "slideUp 0.6s 0.05s ease both",
        }}>
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--accent)", display: "inline-block", animation: "blink 2.5s ease infinite", transition: "background 0.35s" }} />
          <span style={{ fontSize: "0.72rem", fontWeight: 400, color: "var(--muted)", letterSpacing: "0.12em", textTransform: "uppercase", transition: "color 0.35s" }}>
            AI Engineer & Software Developer — Dubai, UAE
          </span>
        </div>

        {/* Heading */}
        <h1 style={{
          fontSize: "clamp(2.8rem, 7.5vw, 5.5rem)",
          fontWeight: 400,
          fontFamily: "var(--font-display)",
          letterSpacing: "0.01em",
          lineHeight: 1.1,
          color: "var(--text)",
          marginBottom: "1.5rem",
          animation: "slideUp 0.65s 0.08s ease both",
          transition: "color 0.35s",
        }}>
          <TypewriterName />
        </h1>

        {/* Thin divider */}
        <div style={{ width: "48px", height: "1px", background: "var(--accent)", marginBottom: "1.5rem", animation: "slideUp 0.5s 0.2s ease both", transition: "background 0.35s" }} />

        {/* Subtitle */}
        <p style={{
          fontSize: "clamp(0.95rem, 1.8vw, 1.1rem)", fontWeight: 300,
          color: "var(--muted)", maxWidth: "500px", lineHeight: 1.75,
          marginBottom: "2.75rem",
          animation: "slideUp 0.7s 0.25s ease both",
          transition: "color 0.35s",
        }}>
          Building intelligent systems, modern web applications, and developer tools.
          Currently at{" "}
          <span style={{ color: "var(--text)", fontWeight: 400, transition: "color 0.35s" }}>Baraka Financial</span>
          {" "}— open to new opportunities.
        </p>

        {/* CTAs */}
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "4rem", animation: "slideUp 0.7s 0.35s ease both" }}>
          <Magnetic strength={0.22}>
            <button className="btn-primary clickable" data-cursor="VIEW" onClick={() => go("projects")} style={{ cursor: "none" }}>
              View Projects
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M1 13L13 1M13 1H5M13 1V9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
            </button>
          </Magnetic>
          <Magnetic strength={0.22}>
            <button className="btn-secondary clickable" data-cursor="MAIL" onClick={() => go("contact")} style={{ cursor: "none" }}>
              Contact Me
            </button>
          </Magnetic>
        </div>

        {/* Stats row */}
        <div style={{
          display: "flex", gap: "3rem", flexWrap: "wrap",
          paddingTop: "2rem", borderTop: "1px solid var(--border)",
          animation: "slideUp 0.7s 0.45s ease both",
        }}>
          {[
            ["3+", "Internships"],
            ["500+", "Students Reached"],
            ["88%", "ML Accuracy"],
            ["UOWD", "Dubai"],
          ].map(([n, l]) => (
            <div key={l}>
              <div style={{ fontSize: "1.4rem", fontWeight: 700, fontFamily: "var(--font-display)", letterSpacing: "0.01em", color: "var(--text)", transition: "color 0.35s" }}>{n}</div>
              <div style={{ fontSize: "0.72rem", color: "var(--muted)", marginTop: "0.2rem", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 400, transition: "color 0.35s" }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll cue */}
      <div style={{ position: "absolute", bottom: "2.5rem", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", animation: "slideUp 0.6s 1.2s ease both" }}>
        <span style={{ fontSize: "0.6rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--muted)", fontWeight: 400, transition: "color 0.35s" }}>scroll</span>
        <div style={{ width: "1px", height: "44px", overflow: "hidden" }}>
          <div style={{ width: "100%", height: "100%", background: "linear-gradient(to bottom, var(--accent), transparent)", animation: "scrollLine 2s ease infinite", transition: "background 0.35s" }} />
        </div>
      </div>
    </section>
  );
}
