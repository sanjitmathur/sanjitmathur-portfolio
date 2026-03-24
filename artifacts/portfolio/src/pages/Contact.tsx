import { useRevealChildren } from "../components/useReveal";
import { useMouse3D } from "../components/Mouse3DContext";

const links = [
  { label: "Email", handle: "sanjitmathur08@gmail.com", href: "mailto:sanjitmathur08@gmail.com", a: "teal" },
  { label: "LinkedIn", handle: "/in/sanjit-mathur-/", href: "https://linkedin.com/in/sanjit-mathur-/", a: "fawn" },
  { label: "GitHub", handle: "github.com/sanjitmathur", href: "https://github.com/sanjitmathur", a: "teal" },
];

export default function Contact() {
  const ref = useRevealChildren(0.06);
  const mouse = useMouse3D();

  return (
    <section id="contact" style={{ padding: "9rem 0 6rem", background: "var(--bg)", position: "relative", overflow: "hidden" }}>
      <div style={{
        position: "absolute", top: "20%", left: "10%",
        width: "400px", height: "500px",
        background: "radial-gradient(ellipse, rgba(58,112,104,0.06) 0%, transparent 65%)",
        transform: `translate(${mouse.x * 12}px, ${-mouse.y * 12}px)`,
        transition: "transform 0.14s linear", pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", top: "25%", right: "8%",
        width: "350px", height: "450px",
        background: "radial-gradient(ellipse, rgba(196,168,130,0.07) 0%, transparent 65%)",
        transform: `translate(${-mouse.x * 10}px, ${-mouse.y * 10}px)`,
        transition: "transform 0.14s linear", pointerEvents: "none",
      }} />

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 2rem" }}>
        <div ref={ref} style={{ perspective: "1400px" }}>
          {/* Header */}
          <div className="r3d" style={{ marginBottom: "5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "1.25rem" }}>
              <span className="sec-label">05 / Contact</span>
              <div className="divider" />
            </div>
            <h2 style={{ fontFamily: "var(--app-font-serif)", fontSize: "clamp(2.8rem,6vw,5rem)", fontWeight: 400, color: "var(--carbon)", letterSpacing: "-0.03em", lineHeight: 1.06, maxWidth: "600px" }}>
              Let's Build<br /><em style={{ color: "var(--fawn)" }}>Something Great</em>
            </h2>
            <p style={{ marginTop: "1.25rem", fontFamily: "var(--app-font-sans)", fontSize: "0.9rem", color: "var(--iron)", fontWeight: 300, lineHeight: 1.8, maxWidth: "400px" }}>
              I'm open to internships, part-time roles, and interesting collaborations.
            </p>
          </div>

          {/* CTA */}
          <div className="r3d-scale" style={{ marginBottom: "4rem" }}>
            <a href="mailto:sanjitmathur08@gmail.com" className="btn-dark clickable">
              <span>Send me a message</span>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
            </a>
          </div>

          {/* Links */}
          <div className="r3d" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px,1fr))", gap: "1px", background: "var(--border-dim)", border: "1px solid var(--border)" }}>
            {links.map((l, i) => {
              const c = l.a === "teal" ? "var(--teal)" : "var(--fawn-dark)";
              return (
                <a key={i} href={l.href}
                  target={l.href.startsWith("mailto") ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  className="clickable"
                  style={{ textDecoration: "none", display: "block", padding: "2rem 1.75rem", background: "var(--bg-3)", borderLeft: "2px solid transparent", transition: "all 0.35s ease" }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = l.a === "teal" ? "rgba(58,112,104,0.04)" : "rgba(196,168,130,0.05)"; el.style.borderLeftColor = c; el.style.boxShadow = "0 8px 32px rgba(15,14,13,0.06)"; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = "var(--bg-3)"; el.style.borderLeftColor = "transparent"; el.style.boxShadow = "none"; }}>
                  <div style={{ fontFamily: "var(--app-font-mono)", fontSize: "0.52rem", letterSpacing: "0.22em", color: c, textTransform: "uppercase", marginBottom: "0.6rem" }}>{l.label}</div>
                  <div style={{ fontFamily: "var(--app-font-sans)", fontSize: "0.84rem", color: "var(--carbon-2)", fontWeight: 300, marginBottom: "0.9rem" }}>{l.handle}</div>
                  <div style={{ fontFamily: "var(--app-font-mono)", fontSize: "0.58rem", color: c, letterSpacing: "0.1em" }}>↗ Open</div>
                </a>
              );
            })}
          </div>

          {/* Footer */}
          <div className="r3d" style={{ marginTop: "5rem", paddingTop: "2rem", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
            <span style={{ fontFamily: "var(--app-font-mono)", fontSize: "0.56rem", letterSpacing: "0.14em", color: "var(--iron-dim)" }}>© 2025 Sanjit Mathur · Built with precision</span>
            <span style={{ fontFamily: "var(--app-font-mono)", fontSize: "0.56rem", letterSpacing: "0.14em", color: "var(--iron-dim)" }}>UOWD · Dubai</span>
          </div>
        </div>
      </div>
    </section>
  );
}
