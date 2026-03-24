import { useRevealChildren } from "../components/useReveal";
import { useMouse3D } from "../components/Mouse3DContext";

const links = [
  { label: "Email", handle: "sanjitmathur08@gmail.com", href: "mailto:sanjitmathur08@gmail.com", accent: "fawn" },
  { label: "LinkedIn", handle: "/in/sanjit-mathur-/", href: "https://linkedin.com/in/sanjit-mathur-/", accent: "teal" },
  { label: "GitHub", handle: "github.com/sanjitmathur", href: "https://github.com/sanjitmathur", accent: "fawn" },
];

export default function Contact() {
  const containerRef = useRevealChildren(0.08);
  const mouse = useMouse3D();

  return (
    <section id="contact" style={{ padding: "8rem 0 6rem", position: "relative", overflow: "hidden" }}>
      {/* Dual ambient glows — mirrored palette */}
      <div style={{
        position: "absolute", top: "30%", left: "10%",
        width: "350px", height: "500px",
        background: "radial-gradient(ellipse, rgba(58,112,104,0.06) 0%, transparent 65%)",
        pointerEvents: "none",
        transform: `translate(${mouse.x * 12}px, ${-mouse.y * 12}px)`,
        transition: "transform 0.12s linear",
      }} />
      <div style={{
        position: "absolute", top: "20%", right: "10%",
        width: "320px", height: "450px",
        background: "radial-gradient(ellipse, rgba(196,168,130,0.05) 0%, transparent 65%)",
        pointerEvents: "none",
        transform: `translate(${-mouse.x * 12}px, ${-mouse.y * 12}px)`,
        transition: "transform 0.12s linear",
      }} />

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 2rem" }}>
        <div ref={containerRef}>
          {/* Header */}
          <div className="reveal-up" style={{ marginBottom: "5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "1.25rem" }}>
              <span className="section-label">05 / Contact</span>
              <div className="divider" />
            </div>
            <h2 style={{
              fontFamily: "var(--app-font-serif)",
              fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
              fontWeight: 400,
              color: "var(--ivory)",
              letterSpacing: "-0.025em",
              lineHeight: 1.08,
              maxWidth: "600px",
            }}>
              Let's Build<br />
              <em style={{ color: "var(--fawn)" }}>Something Great</em>
            </h2>
            <p style={{
              marginTop: "1.25rem",
              fontFamily: "var(--app-font-sans)",
              fontSize: "0.9rem",
              color: "var(--iron)",
              fontWeight: 300,
              lineHeight: 1.8,
              maxWidth: "420px",
            }}>
              I'm open to internships, part-time roles, and interesting project collaborations. Let's talk.
            </p>
          </div>

          {/* CTA */}
          <div className="reveal-up" style={{ marginBottom: "4rem" }}>
            <a href="mailto:sanjitmathur08@gmail.com" className="btn-primary clickable" style={{ fontSize: "0.78rem" }}>
              <span>Send me a message</span>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </a>
          </div>

          {/* Links — two-palette split */}
          <div className="reveal-up" style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1px",
            background: "rgba(74,63,56,0.15)",
            border: "1px solid rgba(74,63,56,0.18)",
          }}>
            {links.map((l, i) => {
              const isTeal  = l.accent === "teal";
              const accentC = isTeal ? "var(--teal)" : "var(--fawn)";
              const accentP = isTeal ? "var(--teal-pale)" : "var(--oak)";
              const glowBg  = isTeal ? "rgba(58,112,104,0.05)" : "rgba(196,168,130,0.04)";
              const glowBd  = isTeal ? "rgba(58,112,104,0.28)" : "rgba(196,168,130,0.2)";

              return (
                <a
                  key={i}
                  href={l.href}
                  target={l.href.startsWith("mailto") ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  className="clickable"
                  style={{
                    textDecoration: "none",
                    display: "block",
                    padding: "2rem 1.75rem",
                    background: "var(--carbon-2)",
                    borderLeft: `2px solid transparent`,
                    transition: "all 0.35s ease",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.background = glowBg;
                    el.style.borderLeftColor = accentC;
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.background = "var(--carbon-2)";
                    el.style.borderLeftColor = "transparent";
                  }}
                >
                  <div style={{ fontFamily: "var(--app-font-mono)", fontSize: "0.55rem", letterSpacing: "0.22em", color: accentP, textTransform: "uppercase", marginBottom: "0.6rem" }}>
                    {l.label}
                  </div>
                  <div style={{ fontFamily: "var(--app-font-sans)", fontSize: "0.84rem", color: "var(--ivory-dim)", fontWeight: 300 }}>
                    {l.handle}
                  </div>
                  <div style={{ marginTop: "0.9rem", fontFamily: "var(--app-font-mono)", fontSize: "0.58rem", color: accentC, letterSpacing: "0.1em" }}>
                    ↗ Open
                  </div>
                </a>
              );
            })}
          </div>

          {/* Footer */}
          <div className="reveal-up" style={{
            marginTop: "5rem",
            paddingTop: "2rem",
            borderTop: "1px solid rgba(74,63,56,0.25)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
          }}>
            <div style={{ fontFamily: "var(--app-font-mono)", fontSize: "0.58rem", letterSpacing: "0.14em", color: "var(--iron)" }}>
              © 2025 Sanjit Mathur · Built with precision
            </div>
            <div style={{ fontFamily: "var(--app-font-mono)", fontSize: "0.58rem", letterSpacing: "0.14em", color: "var(--iron)" }}>
              UOWD · Dubai
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
