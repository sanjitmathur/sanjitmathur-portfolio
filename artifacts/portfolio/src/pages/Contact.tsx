import { useRevealChildren } from "../components/useReveal";
import Scene3D from "../components/Scene3D";

const links = [
  {
    label: "Email",
    value: "sanjitmathur08@gmail.com",
    href: "mailto:sanjitmathur08@gmail.com",
    icon: "✉",
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/sanjit-mathur-/",
    href: "https://linkedin.com/in/sanjit-mathur-/",
    icon: "◈",
  },
  {
    label: "GitHub",
    value: "github.com/sanjitmathur",
    href: "https://github.com/sanjitmathur",
    icon: "◎",
  },
  {
    label: "Phone",
    value: "+971 564 613 530",
    href: "tel:+971564613530",
    icon: "◇",
  },
];

export default function Contact() {
  const containerRef = useRevealChildren(0.05);

  return (
    <section
      id="contact"
      style={{
        padding: "8rem 0 6rem",
        position: "relative",
        overflow: "hidden",
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
      }}
    >
      {/* 3D background subtle */}
      <div style={{ position: "absolute", inset: 0, opacity: 0.4 }}>
        <Scene3D />
      </div>

      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: "50%",
        background: "linear-gradient(to top, #0f0e0d, transparent)",
        pointerEvents: "none",
      }} />

      <div style={{ position: "relative", zIndex: 10, maxWidth: "1100px", margin: "0 auto", padding: "0 2rem", width: "100%" }}>
        <div ref={containerRef}>
          {/* Header */}
          <div className="reveal-up" style={{ marginBottom: "5rem", textAlign: "center" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1.5rem", marginBottom: "1rem" }}>
              <div style={{ height: "1px", width: "60px", background: "rgba(196,168,130,0.2)" }} />
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.25em", color: "rgba(196,168,130,0.5)", textTransform: "uppercase" }}>
                05 / Contact
              </span>
              <div style={{ height: "1px", width: "60px", background: "rgba(196,168,130,0.2)" }} />
            </div>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2.5rem, 7vw, 5.5rem)",
              fontWeight: 400,
              color: "#f0ebe3",
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              marginBottom: "1.5rem",
            }}>
              Let's Build<br /><em style={{ color: "var(--fawn)" }}>Something</em>
            </h2>
            <p style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "1rem",
              color: "rgba(240,235,227,0.4)",
              fontWeight: 300,
              maxWidth: "420px",
              margin: "0 auto",
              lineHeight: 1.7,
            }}>
              Currently open to opportunities in AI engineering, software development, and research roles.
            </p>
          </div>

          {/* Links grid */}
          <div className="reveal-up" style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))",
            gap: "1px",
            border: "1px solid rgba(196,168,130,0.1)",
            marginBottom: "4rem",
          }}>
            {links.map((link, i) => (
              <a
                key={i}
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="clickable"
                style={{
                  display: "block",
                  padding: "2rem 1.75rem",
                  borderRight: "1px solid rgba(196,168,130,0.08)",
                  textDecoration: "none",
                  transition: "background 0.3s ease",
                  cursor: "none",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(196,168,130,0.04)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
              >
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.9rem", color: "rgba(196,168,130,0.3)", marginBottom: "0.75rem" }}>
                  {link.icon}
                </div>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.18em", color: "rgba(196,168,130,0.45)", textTransform: "uppercase", marginBottom: "0.4rem" }}>
                  {link.label}
                </div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.82rem", color: "rgba(240,235,227,0.6)", fontWeight: 400, wordBreak: "break-all" }}>
                  {link.value}
                </div>
              </a>
            ))}
          </div>

          {/* CTA */}
          <div className="reveal-up" style={{ textAlign: "center" }}>
            <a
              href="mailto:sanjitmathur08@gmail.com"
              className="btn-primary clickable"
              style={{ fontSize: "0.8rem", letterSpacing: "0.1em" }}
            >
              <span>Get In Touch</span>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </a>
          </div>

          {/* Footer */}
          <div style={{ marginTop: "6rem", paddingTop: "2rem", borderTop: "1px solid rgba(196,168,130,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.6rem", color: "rgba(196,168,130,0.3)", letterSpacing: "0.1em" }}>
              © 2026 Sanjit Mathur
            </span>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.6rem", color: "rgba(196,168,130,0.25)", letterSpacing: "0.08em" }}>
              Designed & Built with precision
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
