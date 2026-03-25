import { useRef, useState } from "react";
import { useRevealChildren } from "../components/useReveal";
import Magnetic from "../components/Magnetic";

const links = [
  { label: "Email",    href: "mailto:sanjitmathur08@gmail.com", handle: "sanjitmathur08@gmail.com", mono: "MAIL" },
  { label: "LinkedIn", href: "https://linkedin.com/in/sanjit-mathur-/", handle: "/sanjit-mathur-", mono: "IN" },
  { label: "GitHub",   href: "https://github.com/sanjitmathur", handle: "sanjitmathur", mono: "GH" },
];

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  useRevealChildren(sectionRef, ".r3d");

  return (
    <section id="contact" ref={sectionRef} style={{ padding: "clamp(6rem,12vw,9rem) clamp(1.5rem,6vw,5rem) clamp(5rem,8vw,7rem)", background: "var(--bg)", minHeight: "70vh", display: "flex", alignItems: "center" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", width: "100%" }}>

        <div style={{ display: "flex", alignItems: "baseline", gap: "1.5rem", marginBottom: "5rem" }}>
          <span className="r3d" style={{ fontFamily: "var(--app-font-mono)", fontSize: "0.44rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--fawn)" }}>05 / Contact</span>
          <div style={{ flex: 1, height: "1px", background: "var(--text-06)" }} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6rem", alignItems: "start" }}>
          {/* Left */}
          <div>
            <h2 className="r3d" style={{ fontFamily: "var(--app-font-serif)", fontSize: "clamp(3rem,7vw,5.5rem)", fontWeight: 400, lineHeight: 0.88, letterSpacing: "-0.045em", color: "var(--text)", marginBottom: "2.5rem" }}>
              Let's Build<br /><em style={{ color: "var(--fawn)" }}>Something<br />Together</em>
            </h2>
            <p className="r3d" style={{ fontFamily: "var(--app-font-sans)", fontSize: "0.85rem", lineHeight: 1.9, color: "var(--text-60)", maxWidth: "380px", marginBottom: "3rem" }}>
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

          {/* Right — link rows */}
          <div style={{ display: "flex", flexDirection: "column", borderTop: "1px solid var(--text-06)" }}>
            {links.map((link, i) => (
              <a
                key={link.label}
                href={link.href}
                target={link.label !== "Email" ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="r3d clickable"
                data-cursor="OPEN"
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  textDecoration: "none",
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "1.6rem 0",
                  borderBottom: "1px solid var(--text-06)",
                  transitionDelay: `${i * 0.1}s`, cursor: "none",
                  transition: "opacity 0.2s",
                  opacity: hovered !== null && hovered !== i ? 0.35 : 1,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "1.4rem" }}>
                  <span style={{ fontFamily: "var(--app-font-mono)", fontSize: "0.46rem", letterSpacing: "0.2em", color: "var(--fawn)", minWidth: "28px" }}>{link.mono}</span>
                  <div>
                    <div style={{ fontFamily: "var(--app-font-mono)", fontSize: "0.44rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--text-30)", marginBottom: "0.15rem" }}>{link.label}</div>
                    <div style={{ fontFamily: "var(--app-font-sans)", fontSize: "0.82rem", color: hovered === i ? "var(--fawn)" : "var(--text)", transition: "color 0.25s" }}>{link.handle}</div>
                  </div>
                </div>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ color: hovered === i ? "var(--fawn)" : "var(--text-30)", transition: "color 0.25s, transform 0.3s", transform: hovered === i ? "translate(3px,-3px)" : "translate(0,0)" }}>
                  <path d="M1 13L13 1M13 1H5M13 1V9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
              </a>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="r3d" style={{ marginTop: "6rem", paddingTop: "2rem", borderTop: "1px solid var(--text-06)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <span style={{ fontFamily: "var(--app-font-serif)", fontStyle: "italic", fontSize: "0.9rem", color: "var(--text-30)" }}>Sanjit Mathur — Dubai, UAE</span>
          <span style={{ fontFamily: "var(--app-font-mono)", fontSize: "0.4rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-30)" }}>© 2025 · All rights reserved</span>
        </div>
      </div>
    </section>
  );
}
