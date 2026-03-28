import { useEffect, useState } from "react";
import { useTheme } from "./ThemeContext";

const sections = ["about", "experience", "projects", "skills", "contact"];
const labels: Record<string, string> = {
  about: "About", experience: "Experience", projects: "Projects",
  skills: "Skills", contact: "Contact",
};

function SunIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/>
      <line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/>
      <line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  );
}

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("about");
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggle } = useTheme();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
      const mid = window.scrollY + window.innerHeight / 2;
      for (const id of sections) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top + window.scrollY;
        const bot = el.getBoundingClientRect().bottom + window.scrollY;
        if (mid >= top && mid < bot) { setActive(id); break; }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const navBg = scrolled
    ? theme === "dark"
      ? "rgba(13,13,13,0.92)"
      : "rgba(247,244,239,0.92)"
    : "transparent";

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 var(--section-px)", height: "58px",
        background: navBg,
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? "1px solid var(--border)" : "none",
        transition: "background 0.4s ease, border-color 0.4s ease",
      }}>
        {/* Logo */}
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="clickable"
          style={{ background: "none", border: "none", cursor: "none", display: "flex", alignItems: "center", gap: "0.55rem" }}>
          <div style={{ width: 26, height: 26, borderRadius: "6px", background: "var(--text)", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.35s" }}>
            <span style={{ fontSize: "0.62rem", fontWeight: 700, color: "var(--bg)", letterSpacing: "0.02em", fontFamily: "var(--font-display)", transition: "color 0.35s" }}>SM</span>
          </div>
          <span className="nav-name-text" style={{ fontSize: "0.82rem", fontWeight: 400, letterSpacing: "0.05em", color: "var(--text)", opacity: scrolled ? 1 : 0, transition: "opacity 0.4s, color 0.35s", textTransform: "uppercase" }}>
            Sanjit Mathur
          </span>
        </button>

        {/* Nav links — desktop only */}
        <div className="nav-links" style={{ display: "flex", gap: "0.15rem" }}>
          {sections.map(s => (
            <button key={s} onClick={() => go(s)} className="clickable"
              style={{
                background: "none", border: "none", cursor: "none",
                padding: "0.38rem 0.75rem", borderRadius: "5px",
                fontSize: "0.75rem", fontWeight: active === s ? 700 : 400,
                letterSpacing: "0.04em", textTransform: "uppercase",
                color: active === s ? "var(--text)" : "var(--muted)",
                transition: "all 0.2s, color 0.35s",
                borderBottom: active === s ? "1px solid var(--text)" : "1px solid transparent",
              }}>
              {labels[s]}
            </button>
          ))}
        </div>

        {/* Right controls */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {/* Theme toggle */}
          <button
            onClick={toggle}
            className="clickable"
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            style={{
              display: "flex", alignItems: "center", gap: "0.4rem",
              background: "var(--surface-2)", border: "1px solid var(--border)",
              borderRadius: "100px", padding: "0.32rem 0.7rem",
              cursor: "none", color: "var(--muted)",
              fontSize: "0.72rem", fontWeight: 400, letterSpacing: "0.04em",
              transition: "all 0.3s",
            }}>
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
            <span style={{ opacity: scrolled ? 1 : 0, transition: "opacity 0.4s" }}>
              {theme === "dark" ? "Light" : "Dark"}
            </span>
          </button>

          {/* Hire Me — desktop */}
          <a href="mailto:sanjitmathur08@gmail.com" className="btn-primary clickable nav-hire"
            style={{
              fontSize: "0.72rem", padding: "0.45rem 1rem",
              opacity: scrolled ? 1 : 0, transition: "opacity 0.4s",
              pointerEvents: scrolled ? "auto" : "none",
            }}>
            Hire Me
          </a>

          {/* Hamburger — mobile only */}
          <button
            className="nav-hamburger"
            onClick={() => setMenuOpen(o => !o)}
            style={{
              display: "none", background: "none", border: "none",
              cursor: "pointer", padding: 4, color: "var(--text)",
            }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {menuOpen
                ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
                : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>
              }
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div style={{
          position: "fixed", top: 58, left: 0, right: 0, bottom: 0, zIndex: 999,
          background: theme === "dark" ? "rgba(13,13,13,0.97)" : "rgba(247,244,239,0.97)",
          backdropFilter: "blur(20px)",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1.5rem",
          animation: "fadeIn 0.25s ease",
        }}>
          {sections.map(s => (
            <button key={s} onClick={() => go(s)}
              style={{
                background: "none", border: "none", cursor: "pointer",
                fontSize: "1.1rem", fontWeight: active === s ? 700 : 400,
                letterSpacing: "0.08em", textTransform: "uppercase",
                color: active === s ? "var(--text)" : "var(--muted)",
                padding: "0.6rem 1.5rem",
              }}>
              {labels[s]}
            </button>
          ))}
          <a href="mailto:sanjitmathur08@gmail.com" className="btn-primary"
            style={{ marginTop: "1rem", fontSize: "0.85rem", cursor: "pointer" }}>
            Hire Me
          </a>
        </div>
      )}
    </>
  );
}
