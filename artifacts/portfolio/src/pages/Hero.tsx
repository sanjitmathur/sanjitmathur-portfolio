import { useEffect, useRef } from "react";
import Magnetic from "../components/Magnetic";

export default function Hero() {
  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  const lines = [
    { delay: "0.1s" }, { delay: "0.2s" }, { delay: "0.3s" },
    { delay: "0.4s" }, { delay: "0.5s" },
  ];

  return (
    <section id="about" style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      padding: `0 var(--section-px)`,
      background: "var(--bg)", position: "relative", overflow: "hidden",
    }}>
      {/* Subtle grid background */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
        backgroundSize: "80px 80px",
        maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 100%)",
      }} />

      {/* Accent glow behind */}
      <div style={{ position: "absolute", top: "30%", left: "10%", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(ellipse, rgba(99,102,241,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ maxWidth: "var(--max-w)", margin: "0 auto", width: "100%", paddingTop: "6rem" }}>
        {/* Eyebrow */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "2rem", animation: "fadeIn 0.6s 0.05s ease both" }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)", display: "inline-block", animation: "blink 2.5s ease infinite" }} />
          <span style={{ fontSize: "0.8rem", fontWeight: 500, color: "var(--muted)", letterSpacing: "0.04em" }}>
            AI Engineer & Software Developer — Dubai, UAE
          </span>
        </div>

        {/* Main heading */}
        <h1 style={{
          fontSize: "clamp(3rem, 8vw, 5rem)", fontWeight: 800,
          letterSpacing: "-0.04em", lineHeight: 1.05,
          color: "var(--text)", marginBottom: "1.75rem",
          animation: "fadeIn 0.7s 0.1s ease both",
        }}>
          Hi, I'm{" "}
          <span style={{ position: "relative", display: "inline-block" }}>
            <span style={{ color: "var(--accent)" }}>Sanjit Mathur</span>
            <span style={{
              position: "absolute", bottom: "-4px", left: 0, right: 0, height: "3px",
              background: "linear-gradient(90deg, var(--accent), transparent)",
              borderRadius: "2px", opacity: 0.7,
            }} />
          </span>
        </h1>

        {/* Subtitle */}
        <p style={{
          fontSize: "clamp(1rem,2vw,1.2rem)", fontWeight: 400,
          color: "var(--muted)", maxWidth: "560px", lineHeight: 1.7,
          marginBottom: "2.5rem",
          animation: "fadeIn 0.7s 0.2s ease both",
        }}>
          Building intelligent systems, modern web applications, and developer tools.
          Currently at{" "}
          <span style={{ color: "var(--text)", fontWeight: 500 }}>Baraka Financial</span>
          {" "}— open to new opportunities.
        </p>

        {/* CTAs */}
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "4rem", animation: "fadeIn 0.7s 0.3s ease both" }}>
          <Magnetic strength={0.25}>
            <button className="btn-primary clickable" data-cursor="VIEW" onClick={() => go("projects")} style={{ cursor: "none" }}>
              View Projects
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 13L13 1M13 1H5M13 1V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
            </button>
          </Magnetic>
          <Magnetic strength={0.25}>
            <button className="btn-secondary clickable" data-cursor="MAIL" onClick={() => go("contact")} style={{ cursor: "none" }}>
              Contact Me
            </button>
          </Magnetic>
        </div>

        {/* Quick stats row */}
        <div style={{ display: "flex", gap: "2.5rem", flexWrap: "wrap", paddingTop: "2.5rem", borderTop: "1px solid var(--border)", animation: "fadeIn 0.7s 0.4s ease both" }}>
          {[
            ["3+", "Internships"],
            ["500+", "Students Reached"],
            ["88%", "ML Accuracy"],
            ["UOWD", "Dubai"],
          ].map(([n, l]) => (
            <div key={l}>
              <div style={{ fontSize: "1.5rem", fontWeight: 700, letterSpacing: "-0.03em", color: "var(--text)" }}>{n}</div>
              <div style={{ fontSize: "0.78rem", color: "var(--muted)", marginTop: "0.2rem" }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll cue */}
      <div style={{ position: "absolute", bottom: "2.5rem", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", animation: "fadeIn 0.6s 1s ease both" }}>
        <span style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--muted)", fontWeight: 500 }}>scroll</span>
        <div style={{ width: "1px", height: "48px", overflow: "hidden" }}>
          <div style={{ width: "100%", height: "100%", background: "linear-gradient(to bottom, var(--accent), transparent)", animation: "scrollLine 2s ease infinite" }} />
        </div>
      </div>
    </section>
  );
}
