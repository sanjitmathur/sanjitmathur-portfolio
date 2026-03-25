import { useRef, useState } from "react";
import { useRevealChildren } from "../components/useReveal";
import Magnetic from "../components/Magnetic";

const links = [
  { label: "Email",    href: "mailto:sanjitmathur08@gmail.com", icon: "✉", handle: "sanjitmathur08@gmail.com" },
  { label: "LinkedIn", href: "https://linkedin.com/in/sanjit-mathur-/", icon: "in", handle: "/sanjit-mathur-" },
  { label: "GitHub",   href: "https://github.com/sanjitmathur", icon: "gh", handle: "sanjitmathur" },
];

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  useRevealChildren(sectionRef, ".r3d");

  return (
    <section id="contact" ref={sectionRef} style={{
      padding: "clamp(6rem,12vw,9rem) clamp(1.5rem,6vw,5rem) clamp(4rem,8vw,6rem)",
      background: "var(--bg)", position: "relative", overflow: "hidden", minHeight: "70vh",
      display: "flex", alignItems: "center",
    }}>
      {/* Background ambient glow */}
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "60vw", height: "60vw", borderRadius: "50%", background: "radial-gradient(ellipse, rgba(213,181,114,0.05) 0%, transparent 65%)", pointerEvents: "none" }} />

      <div style={{ maxWidth: "1140px", margin: "0 auto", width: "100%", position: "relative", zIndex: 1 }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "baseline", gap: "1.2rem", marginBottom: "4rem" }}>
          <span className="r3d" style={{ fontFamily: "var(--app-font-mono)", fontSize: "0.44rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--fawn)" }}>05 / Contact</span>
          <div style={{ flex: 1, height: "1px", background: "var(--text-06)" }} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6rem", alignItems: "center" }}>
          {/* Left */}
          <div>
            <h2 className="r3d" style={{ fontFamily: "var(--app-font-serif)", fontSize: "clamp(2.8rem,7vw,5.5rem)", fontWeight: 400, color: "var(--text)", lineHeight: 0.92, letterSpacing: "-0.045em", marginBottom: "2.2rem" }}>
              Let's Build<br /><em style={{ color: "var(--fawn)" }}>Something<br />Together</em>
            </h2>
            <p className="r3d" style={{ fontFamily: "var(--app-font-sans)", fontSize: "0.85rem", lineHeight: 1.9, color: "var(--text-60)", maxWidth: "400px", marginBottom: "2.8rem" }}>
              Open to internships, collaborations, and ambitious projects. Based in Dubai — available globally.
            </p>
            <div className="r3d">
              <Magnetic strength={0.35}>
                <a href="mailto:sanjitmathur08@gmail.com" className="btn-dark clickable" data-cursor="WRITE" style={{ display: "inline-flex" }}>
                  <span>Say Hello</span>
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M1.5 6.5h10M6.5 1.5l5 5-5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </a>
              </Magnetic>
            </div>
          </div>

          {/* Right: glass link cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
            {links.map((link, i) => (
              <a
                key={link.label}
                href={link.href}
                target={link.label !== "Email" ? "_blank" : undefined}
                rel="noopener noreferrer"
                className={`r3d clickable ${hovered === i ? "glass-gold" : "glass"}`}
                data-cursor="OPEN"
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  textDecoration: "none", padding: "1.4rem 1.8rem",
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  transitionDelay: `${i * 0.1}s`,
                  transition: "background 0.3s, border-color 0.3s, transform 0.35s cubic-bezier(0.16,1,0.3,1)",
                  transform: hovered === i ? "translateX(6px)" : "translateX(0)",
                  borderRadius: "2px", cursor: "none",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "1.2rem" }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: "6px",
                    background: hovered === i ? "rgba(213,181,114,0.15)" : "rgba(248,242,225,0.05)",
                    border: `1px solid ${hovered === i ? "rgba(213,181,114,0.4)" : "rgba(248,242,225,0.1)"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "var(--app-font-mono)", fontSize: "0.55rem",
                    color: hovered === i ? "var(--fawn)" : "var(--text-30)",
                    transition: "all 0.3s", fontWeight: 700,
                  }}>{link.icon}</div>
                  <div>
                    <div style={{ fontFamily: "var(--app-font-mono)", fontSize: "0.44rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--text-30)", marginBottom: "0.2rem" }}>{link.label}</div>
                    <div style={{ fontFamily: "var(--app-font-sans)", fontSize: "0.78rem", color: hovered === i ? "var(--fawn)" : "var(--text-60)", transition: "color 0.3s" }}>{link.handle}</div>
                  </div>
                </div>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ opacity: hovered === i ? 1 : 0.2, transition: "opacity 0.3s", color: "var(--fawn)" }}>
                  <path d="M1 13L13 1M13 1H5M13 1V9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
              </a>
            ))}
          </div>
        </div>

        {/* Footer bar */}
        <div className="r3d" style={{ marginTop: "6rem", paddingTop: "2rem", borderTop: "1px solid var(--text-06)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <span style={{ fontFamily: "var(--app-font-serif)", fontSize: "0.9rem", fontStyle: "italic", color: "var(--text-30)" }}>Sanjit Mathur — Dubai, UAE</span>
          <span style={{ fontFamily: "var(--app-font-mono)", fontSize: "0.42rem", letterSpacing: "0.2em", color: "var(--text-30)", textTransform: "uppercase" }}>© 2025 · All rights reserved</span>
        </div>
      </div>
    </section>
  );
}
