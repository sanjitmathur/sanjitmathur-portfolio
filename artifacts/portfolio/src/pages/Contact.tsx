import { useRevealChildren } from "../components/useReveal";
import { useMouse3D } from "../components/Mouse3DContext";

const links = [
  { label: "Email", handle: "sanjitmathur08@gmail.com", href: "mailto:sanjitmathur08@gmail.com" },
  { label: "LinkedIn", handle: "/in/sanjit-mathur-/", href: "https://linkedin.com/in/sanjit-mathur-/" },
  { label: "GitHub", handle: "github.com/sanjitmathur", href: "https://github.com/sanjitmathur" },
];

export default function Contact() {
  const ref = useRevealChildren(0.05);
  const mouse = useMouse3D();

  return (
    <section id="contact" style={{ padding: "9rem 0 7rem", background: "var(--bg)", position: "relative", overflow: "hidden" }}>
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse 80% 60% at 50% 100%, var(--fawn-20) 0%, transparent 70%)",
        transform: `translate(${mouse.x * 8}px, ${-mouse.y * 8}px)`,
        transition: "transform 0.15s linear", pointerEvents: "none",
      }} />

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 3rem" }}>
        <div ref={ref} style={{ perspective: "1400px" }}>
          {/* Heading */}
          <div className="r3d" style={{ marginBottom: "5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "1rem" }}>
              <span className="sec-label">05 / Contact</span>
              <div style={{ flex: 1, height: "1px", background: "var(--carbon-12)" }} />
            </div>
            <h2 style={{ fontFamily: "var(--app-font-serif)", fontSize: "clamp(3rem, 7vw, 5.5rem)", fontWeight: 400, color: "var(--carbon)", letterSpacing: "-0.035em", lineHeight: 1.04, maxWidth: "700px" }}>
              Let's Build<br /><em style={{ color: "var(--fawn)", fontStyle: "italic" }}>Something Great</em>
            </h2>
            <p style={{ marginTop: "1.5rem", fontFamily: "var(--app-font-sans)", fontSize: "0.9rem", color: "var(--carbon-60)", fontWeight: 300, lineHeight: 1.8, maxWidth: "400px" }}>
              Open to internships, part-time roles, and interesting collaborations.
            </p>
          </div>

          {/* CTA */}
          <div className="r3d" style={{ marginBottom: "5rem" }}>
            <a href="mailto:sanjitmathur08@gmail.com" className="btn-dark clickable">
              <span>Send a message</span>
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M1 6.5h11M6.5 1l5.5 5.5-5.5 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
            </a>
          </div>

          {/* Link rows — no cards */}
          <div style={{ borderTop: "1px solid var(--carbon-12)" }}>
            {links.map((l, i) => (
              <div key={i} className="r3d" style={{ borderBottom: "1px solid var(--carbon-12)", transitionDelay: `${i * 0.09}s` }}>
                <a
                  href={l.href}
                  target={l.href.startsWith("mailto") ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  className="clickable"
                  style={{ textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "2rem 0", transition: "opacity 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.opacity = "0.65"; }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
                >
                  <div>
                    <div style={{ fontFamily: "var(--app-font-mono)", fontSize: "0.52rem", letterSpacing: "0.22em", color: "var(--fawn)", textTransform: "uppercase", marginBottom: "0.4rem" }}>{l.label}</div>
                    <div style={{ fontFamily: "var(--app-font-serif)", fontSize: "clamp(1.1rem, 2.5vw, 1.7rem)", fontWeight: 400, letterSpacing: "-0.015em", color: "var(--carbon)" }}>{l.handle}</div>
                  </div>
                  <div style={{ fontFamily: "var(--app-font-mono)", fontSize: "0.65rem", color: "var(--fawn)" }}>↗</div>
                </a>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="r3d" style={{ marginTop: "5rem", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
            <span style={{ fontFamily: "var(--app-font-mono)", fontSize: "0.54rem", letterSpacing: "0.14em", color: "var(--carbon-30)" }}>© 2025 Sanjit Mathur</span>
            <span style={{ fontFamily: "var(--app-font-mono)", fontSize: "0.54rem", letterSpacing: "0.14em", color: "var(--carbon-30)" }}>UOWD · Dubai</span>
          </div>
        </div>
      </div>
    </section>
  );
}
