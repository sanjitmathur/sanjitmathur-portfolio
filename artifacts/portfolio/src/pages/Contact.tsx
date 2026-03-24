import { useRevealChildren } from "../components/useReveal";
import Scene3D from "../components/Scene3D";
import Tilt3DCard from "../components/Tilt3DCard";
import { useMouse3D } from "../components/Mouse3DContext";

const links = [
  { label: "Email", value: "sanjitmathur08@gmail.com", href: "mailto:sanjitmathur08@gmail.com", icon: "✉" },
  { label: "LinkedIn", value: "linkedin.com/in/sanjit-mathur-/", href: "https://linkedin.com/in/sanjit-mathur-/", icon: "◈" },
  { label: "GitHub", value: "github.com/sanjitmathur", href: "https://github.com/sanjitmathur", icon: "◎" },
  { label: "Phone", value: "+971 564 613 530", href: "tel:+971564613530", icon: "◇" },
];

export default function Contact() {
  const containerRef = useRevealChildren(0.05);
  const mouse = useMouse3D();

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
      <div style={{ position: "absolute", inset: 0, opacity: 0.35 }}>
        <Scene3D intensity={0.7} />
      </div>
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: "50%",
        background: "linear-gradient(to top, #0f0e0d, transparent)",
        pointerEvents: "none", zIndex: 2,
      }} />

      <div style={{ position: "relative", zIndex: 10, maxWidth: "1100px", margin: "0 auto", padding: "0 2rem", width: "100%" }}>
        <div ref={containerRef}>
          {/* Header */}
          <div className="reveal-up" style={{ marginBottom: "4.5rem", textAlign: "center" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1.5rem", marginBottom: "1rem" }}>
              <div style={{ height: "1px", width: "50px", background: "rgba(196,168,130,0.2)" }} />
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.63rem", letterSpacing: "0.25em", color: "rgba(196,168,130,0.5)", textTransform: "uppercase" }}>
                05 / Contact
              </span>
              <div style={{ height: "1px", width: "50px", background: "rgba(196,168,130,0.2)" }} />
            </div>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2.8rem, 8vw, 6rem)",
              fontWeight: 400,
              color: "#f0ebe3",
              letterSpacing: "-0.035em",
              lineHeight: 1.0,
              marginBottom: "1.5rem",
              transform: `translate(${mouse.x * 8}px, ${-mouse.y * 8}px)`,
              transition: "transform 0.1s linear",
            }}>
              Let's Build<br /><em style={{ color: "var(--fawn)" }}>Something</em>
            </h2>
            <p style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "0.95rem",
              color: "rgba(240,235,227,0.38)",
              fontWeight: 300,
              maxWidth: "400px",
              margin: "0 auto",
              lineHeight: 1.75,
            }}>
              Currently open to opportunities in AI engineering, software development, and research.
            </p>
          </div>

          {/* Contact cards */}
          <div className="reveal-up" style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))",
            gap: "1px",
            border: "1px solid rgba(196,168,130,0.1)",
            marginBottom: "3.5rem",
            perspective: "800px",
          }}>
            {links.map((link, i) => (
              <Tilt3DCard
                key={i}
                intensity={8}
                glare
                style={{
                  borderRight: "1px solid rgba(196,168,130,0.06)",
                  cursor: "none",
                }}
              >
                <a
                  href={link.href}
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="clickable"
                  style={{ display: "block", padding: "2rem 1.75rem", textDecoration: "none", cursor: "none" }}
                >
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "1rem", color: "rgba(196,168,130,0.3)", marginBottom: "0.75rem" }}>
                    {link.icon}
                  </div>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.18em", color: "rgba(196,168,130,0.4)", textTransform: "uppercase", marginBottom: "0.4rem" }}>
                    {link.label}
                  </div>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.8rem", color: "rgba(240,235,227,0.55)", fontWeight: 400, wordBreak: "break-all" }}>
                    {link.value}
                  </div>
                </a>
              </Tilt3DCard>
            ))}
          </div>

          {/* CTA */}
          <div className="reveal-up" style={{ textAlign: "center" }}>
            <a href="mailto:sanjitmathur08@gmail.com" className="btn-primary clickable" style={{ fontSize: "0.8rem", letterSpacing: "0.1em" }}>
              <span>Get In Touch</span>
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M1 6.5h11M6.5 1l5.5 5.5-5.5 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </a>
          </div>

          {/* Footer */}
          <div style={{ marginTop: "6rem", paddingTop: "2rem", borderTop: "1px solid rgba(196,168,130,0.07)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.58rem", color: "rgba(196,168,130,0.25)", letterSpacing: "0.1em" }}>
              © 2026 Sanjit Mathur
            </span>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.58rem", color: "rgba(196,168,130,0.2)", letterSpacing: "0.06em" }}>
              Designed & Built with precision
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
