import { useRef, useState } from "react";
import { useRevealChildren } from "../components/useReveal";
import { useLang } from "../components/LanguageContext";

const links = [
  { label: "Email",    href: "mailto:sanjitmathur08@gmail.com", handle: "sanjitmathur08@gmail.com", icon: "\u2709" },
  { label: "LinkedIn", href: "https://linkedin.com/in/sanjit-mathur-/",  handle: "/sanjit-mathur-", icon: "in" },
  { label: "GitHub",   href: "https://github.com/sanjitmathur",          handle: "sanjitmathur",    icon: "gh" },
];

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  useRevealChildren(sectionRef, ".fade-up");
  const { t } = useLang();

  const tc = t.contact;

  return (
    <section id="contact" ref={sectionRef} style={{
      padding: "var(--section-py) var(--section-px)",
      background: "var(--bg)", minHeight: "65vh", display: "flex", alignItems: "center",
    }}>
      <div style={{ maxWidth: "var(--max-w)", margin: "0 auto", width: "100%" }}>
        <div className="contact-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(2.5rem, 6vw, 5rem)", alignItems: "start" }}>
          {/* Left */}
          <div className="fade-up">
            <p className="section-label" style={{ marginBottom: "0.85rem" }}>{tc.label}</p>
            <h2 style={{ fontSize: "clamp(2rem,5vw,3rem)", fontWeight: 600, fontFamily: "var(--font-display)", letterSpacing: "-0.02em", lineHeight: 1.1, color: "var(--text)", marginBottom: "1.75rem" }}>
              {tc.heading1}<br />
              <span style={{ color: "var(--accent)" }}>{tc.heading2}</span><br />
              {tc.heading3}
            </h2>
            <p style={{ fontSize: "0.9rem", lineHeight: 1.8, color: "var(--muted)", maxWidth: "380px", marginBottom: "2.5rem" }}>
              {tc.subtitle}
            </p>
            <a href="mailto:sanjitmathur08@gmail.com"
              className="btn-primary clickable"
              style={{ display: "inline-flex", gap: "0.5rem", alignItems: "center" }}>
              {tc.sayHello}
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M1.5 6.5h10M6.5 1.5l5 5-5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>

          {/* Right: links */}
          <div className="fade-up" style={{ borderTop: "1px solid var(--border)" }}>
            {links.map((link, i) => (
              <a
                key={link.label}
                href={link.href}
                target={link.label !== "Email" ? "_blank" : undefined}
                rel="noopener noreferrer"
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "1.6rem 0", borderBottom: "1px solid var(--border)",
                  textDecoration: "none", transition: "all 0.2s",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: 10,
                    background: hovered === i ? "var(--text)" : "var(--surface-2)",
                    border: "1px solid var(--border)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.25s ease",
                    fontSize: "0.65rem", fontWeight: 700, color: hovered === i ? "var(--bg)" : "var(--muted)",
                    textTransform: "uppercase", letterSpacing: "0.04em",
                  }}>
                    {link.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text)", marginBottom: 2 }}>{link.label}</div>
                    <div style={{ fontSize: "0.72rem", color: "var(--muted)" }}>{link.handle}</div>
                  </div>
                </div>
                <div style={{ color: hovered === i ? "var(--accent)" : "var(--muted)", transition: "color 0.2s, transform 0.2s", transform: hovered === i ? "translate(2px, -2px)" : "none" }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M1 13L13 1M13 1H5M13 1V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
              </a>
            ))}

            {/* Location badge */}
            <div style={{ marginTop: "2rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 8px #22c55e80", animation: "blink 2s ease infinite" }} />
              <span style={{ fontSize: "0.75rem", color: "var(--muted)" }}>{tc.available}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
