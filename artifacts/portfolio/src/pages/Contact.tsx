import React, { useRef, useState } from "react";
import { useRevealChildren } from "../components/useReveal";
import { useLang } from "../components/LanguageContext";

function MailIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.6 1.6 0 0 0-1.6 1.6 1.6 1.6 0 0 0 1.6 1.6 1.6 1.6 0 0 0 1.6-1.6 1.6 1.6 0 0 0-1.6-1.6Z"/>
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/>
    </svg>
  );
}

const links = [
  { label: "Email",    href: "mailto:sanjitmathur08@gmail.com", handle: "sanjitmathur08@gmail.com", Icon: MailIcon },
  { label: "LinkedIn", href: "https://linkedin.com/in/sanjit-mathur-/",  handle: "/sanjit-mathur-", Icon: LinkedInIcon },
  { label: "GitHub",   href: "https://github.com/sanjitmathur",          handle: "sanjitmathur",    Icon: GitHubIcon },
];

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  useRevealChildren(sectionRef, ".fade-up");
  const { t } = useLang();

  const tc = t.contact;

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText("sanjitmathur08@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="contact" ref={sectionRef} style={{
      padding: "var(--section-py) var(--section-px) 2rem",
      background: "var(--bg)", minHeight: "65vh", display: "flex", flexDirection: "column", justifyContent: "space-between",
      transition: "background 0.35s ease",
    }}>
      <div style={{ maxWidth: "var(--max-w)", margin: "0 auto", width: "100%", flex: 1 }}>
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
            <div style={{ display: "flex", gap: "0.85rem", flexWrap: "wrap", alignItems: "center" }}>
              <a href="mailto:sanjitmathur08@gmail.com"
                className="btn-primary clickable"
                style={{ display: "inline-flex", gap: "0.5rem", alignItems: "center" }}>
                {tc.sayHello}
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <path d="M1.5 6.5h10M6.5 1.5l5 5-5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
              <button
                onClick={handleCopyEmail}
                className="btn-secondary clickable"
                style={{ display: "inline-flex", gap: "0.4rem", alignItems: "center", fontSize: "0.78rem" }}
              >
                <span>{copied ? "✓ Copied Email" : "Copy Email"}</span>
              </button>
            </div>
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
                    <link.Icon />
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

      {/* Footer bar */}
      <div style={{
        maxWidth: "var(--max-w)", margin: "4rem auto 0", width: "100%",
        paddingTop: "1.5rem", borderTop: "1px solid var(--border)",
        display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem",
      }}>
        <div style={{ fontSize: "0.72rem", color: "var(--muted)" }}>
          © {new Date().getFullYear()} Sanjit Mathur · Built with React & TypeScript
        </div>
        <button
          onClick={() => {
            (window as any).__isNavJump = true;
            document.documentElement.style.scrollBehavior = "auto";
            window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
            setTimeout(() => {
              (window as any).__isNavJump = false;
            }, 120);
          }}
          className="clickable"
          style={{ background: "none", border: "none", fontSize: "0.72rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em", cursor: "pointer" }}
        >
          Back to Top ↑
        </button>
      </div>
    </section>
  );
}
