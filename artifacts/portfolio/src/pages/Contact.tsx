import { useRef } from "react";
import { useRevealChildren } from "../components/useReveal";
import Magnetic from "../components/Magnetic";

const links = [
  { label: "Email", handle: "sanjitmathur08@gmail.com", href: "mailto:sanjitmathur08@gmail.com", cursor: "WRITE" },
  { label: "LinkedIn", handle: "/in/sanjit-mathur-/", href: "https://linkedin.com/in/sanjit-mathur-/", cursor: "OPEN" },
  { label: "GitHub", handle: "github.com/sanjitmathur", href: "https://github.com/sanjitmathur", cursor: "OPEN" },
];

export default function Contact() {
  const ref = useRevealChildren(0.05);
  const headRef = useRef<HTMLHeadingElement>(null);

  return (
    <section id="contact" style={{ padding: "9rem 0 7rem", background: "var(--bg)", position: "relative", overflow: "hidden" }}>
      {/* Fawn ambient at bottom */}
      <div style={{
        position: "absolute", bottom: "-20%", left: "50%", transform: "translateX(-50%)",
        width: "90vw", height: "60vh", borderRadius: "50%",
        background: "radial-gradient(ellipse, var(--fawn-20) 0%, transparent 65%)",
        pointerEvents: "none",
      }} />

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 clamp(1.5rem, 4vw, 3rem)" }}>
        <div ref={ref} style={{ perspective: "1400px" }}>

          {/* Heading */}
          <div className="r3d" style={{ marginBottom: "4rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "1rem" }}>
              <span style={{ fontFamily: "var(--app-font-mono)", fontSize: "0.52rem", letterSpacing: "0.26em", textTransform: "uppercase", color: "var(--fawn)" }}>05 / Contact</span>
              <div style={{ flex: 1, height: "1px", background: "var(--carbon-12)" }} />
            </div>
            <h2 ref={headRef} style={{
              fontFamily: "var(--app-font-serif)",
              fontSize: "clamp(3rem, 8vw, 6.5rem)",
              fontWeight: 400, color: "var(--carbon)", letterSpacing: "-0.04em", lineHeight: 1.0,
            }}>
              Let's Build<br />
              <em style={{ color: "var(--fawn)", fontStyle: "italic" }}>Something</em><br />
              <em style={{ color: "var(--fawn)", fontStyle: "italic" }}>Together</em>
            </h2>
            <p style={{ marginTop: "1.5rem", fontFamily: "var(--app-font-sans)", fontSize: "0.88rem", color: "var(--carbon-60)", fontWeight: 300, lineHeight: 1.85, maxWidth: "380px" }}>
              Open to internships, part-time roles, and interesting collaborations. Always up for a conversation.
            </p>
          </div>

          {/* Magnetic CTA */}
          <div className="r3d" style={{ marginBottom: "5rem" }}>
            <Magnetic strength={0.22}>
              <a href="mailto:sanjitmathur08@gmail.com" className="btn-dark clickable" data-cursor="SEND"
                style={{ display: "inline-flex", alignItems: "center", gap: "0.7rem" }}>
                <span>Send a Message</span>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M1 13L13 1M13 1H5M13 1V9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
              </a>
            </Magnetic>
          </div>

          {/* Links */}
          <div style={{ borderTop: "1px solid var(--carbon-12)" }}>
            {links.map((l, i) => (
              <div key={i} className="r3d" style={{ borderBottom: "1px solid var(--carbon-12)", transitionDelay: `${i * 0.08}s` }}>
                <a
                  href={l.href}
                  target={l.href.startsWith("mailto") ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  className="clickable"
                  data-cursor={l.cursor}
                  style={{ textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.8rem 0", transition: "opacity 0.25s" }}
                  onMouseEnter={e => { e.currentTarget.style.opacity = "0.55"; }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
                >
                  <div>
                    <div style={{ fontFamily: "var(--app-font-mono)", fontSize: "0.48rem", letterSpacing: "0.26em", color: "var(--fawn)", textTransform: "uppercase", marginBottom: "0.35rem" }}>{l.label}</div>
                    <div style={{ fontFamily: "var(--app-font-serif)", fontSize: "clamp(1rem, 2.2vw, 1.6rem)", fontWeight: 400, letterSpacing: "-0.015em", color: "var(--carbon)" }}>{l.handle}</div>
                  </div>
                  <span style={{ fontFamily: "var(--app-font-serif)", fontSize: "1.2rem", color: "var(--fawn)", transition: "transform 0.3s ease" }}>↗</span>
                </a>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="r3d" style={{ marginTop: "5rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
            <span style={{ fontFamily: "var(--app-font-serif)", fontSize: "clamp(1rem, 2vw, 1.4rem)", fontWeight: 400, color: "var(--carbon-30)", letterSpacing: "-0.02em" }}>Sanjit Mathur</span>
            <span style={{ fontFamily: "var(--app-font-mono)", fontSize: "0.48rem", letterSpacing: "0.2em", color: "var(--carbon-30)" }}>© 2025 · UOWD · Dubai</span>
          </div>

        </div>
      </div>
    </section>
  );
}
