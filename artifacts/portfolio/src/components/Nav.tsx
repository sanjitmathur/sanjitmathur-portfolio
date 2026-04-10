import { useEffect, useState, useRef } from "react";
import { useTheme } from "./ThemeContext";
import { useLang } from "./LanguageContext";
import { LANG_META, type Lang } from "../i18n";

const sections = ["about", "experience", "projects", "skills", "contact"];

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

function GlobeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="2" y1="12" x2="22" y2="12"/>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  );
}

const LANGS: Lang[] = ["en", "hi", "ar", "de", "es"];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("about");
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const { theme, toggle } = useTheme();
  const { lang, setLang, t } = useLang();
  const langRef = useRef<HTMLDivElement>(null);

  const labels: Record<string, string> = {
    about: t.nav.about, experience: t.nav.experience, projects: t.nav.projects,
    skills: t.nav.skills, contact: t.nav.contact,
  };

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

  // Close lang dropdown on outside click
  useEffect(() => {
    if (!langOpen) return;
    const handler = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [langOpen]);

  const go = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const navBg = scrolled
    ? theme === "dark"
      ? "rgba(10,10,10,0.92)"
      : "rgba(250,250,248,0.92)"
    : "transparent";

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 var(--section-px)", height: "56px",
        background: navBg,
        backdropFilter: scrolled ? "blur(18px) saturate(1.4)" : "none",
        borderBottom: scrolled ? "1px solid var(--border)" : "none",
        transition: "background 0.4s ease, border-color 0.4s ease",
      }}>
        {/* Logo */}
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="clickable"
          style={{ background: "none", border: "none", display: "flex", alignItems: "center", gap: "0.55rem" }}>
          <div style={{ width: 26, height: 26, borderRadius: "6px", background: "var(--text)", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.35s" }}>
            <span style={{ fontSize: "0.62rem", fontWeight: 700, color: "var(--bg)", letterSpacing: "0.02em", fontFamily: "var(--font-display)", transition: "color 0.35s" }}>SM</span>
          </div>
          <span className="nav-name-text" style={{ fontSize: "0.82rem", fontWeight: 400, letterSpacing: "0.05em", color: "var(--text)", opacity: scrolled ? 1 : 0, transition: "opacity 0.4s, color 0.35s", textTransform: "uppercase" }}>
            {t.hero.name}
          </span>
        </button>

        {/* Nav links — desktop only */}
        <div className="nav-links" style={{ display: "flex", gap: "0.15rem" }}>
          {sections.map(s => (
            <button key={s} onClick={() => go(s)} className="clickable"
              style={{
                background: "none", border: "none", padding: "0.38rem 0.75rem", borderRadius: "5px",
                fontSize: "0.72rem", fontWeight: active === s ? 500 : 400,
                letterSpacing: "0.04em", textTransform: "uppercase",
                color: active === s ? "var(--text)" : "var(--muted)",
                transition: "all 0.2s, color 0.35s",
                borderBottom: active === s ? "1.5px solid var(--text)" : "1.5px solid transparent",
              }}>
              {labels[s]}
            </button>
          ))}
        </div>

        {/* Right controls */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          {/* Language selector */}
          <div ref={langRef} style={{ position: "relative" }}>
            <button
              onClick={() => setLangOpen(o => !o)}
              className="clickable"
              title="Change language"
              style={{
                display: "flex", alignItems: "center", gap: "0.35rem",
                background: "var(--surface-2)", border: "1px solid var(--border)",
                borderRadius: "100px", padding: "0.32rem 0.6rem",
                color: "var(--muted)",
                fontSize: "0.7rem", fontWeight: 500, letterSpacing: "0.02em",
                transition: "all 0.3s",
              }}>
              <GlobeIcon />
              <span>{LANG_META[lang].native}</span>
            </button>

            {/* Dropdown */}
            {langOpen && (
              <div style={{
                position: "absolute", top: "calc(100% + 6px)", right: 0,
                background: "var(--surface)", border: "1px solid var(--border)",
                borderRadius: "10px", padding: "4px",
                minWidth: "140px",
                boxShadow: "0 8px 32px var(--shadow)",
                animation: "fadeIn 0.15s ease",
                zIndex: 1001,
              }}>
                {LANGS.map(l => (
                  <button
                    key={l}
                    onClick={() => { setLang(l); setLangOpen(false); }}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      width: "100%", padding: "0.5rem 0.75rem",
                      background: lang === l ? "var(--accent-dim)" : "transparent",
                      border: "none", borderRadius: "7px",
                      color: lang === l ? "var(--text)" : "var(--muted)",
                      fontSize: "0.78rem", fontWeight: lang === l ? 500 : 400,
                      cursor: "pointer",
                      transition: "background 0.15s, color 0.15s",
                    }}
                    onMouseEnter={e => { if (lang !== l) (e.currentTarget.style.background = "var(--accent-dim)"); }}
                    onMouseLeave={e => { if (lang !== l) (e.currentTarget.style.background = "transparent"); }}
                  >
                    <span>{LANG_META[l].label}</span>
                    <span style={{ fontSize: "0.65rem", opacity: 0.5 }}>{LANG_META[l].native}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme toggle */}
          <button
            onClick={toggle}
            className="clickable"
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            style={{
              display: "flex", alignItems: "center", gap: "0.4rem",
              background: "var(--surface-2)", border: "1px solid var(--border)",
              borderRadius: "100px", padding: "0.32rem 0.7rem",
              color: "var(--muted)",
              fontSize: "0.72rem", fontWeight: 400, letterSpacing: "0.04em",
              transition: "all 0.3s",
            }}>
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
            <span style={{ opacity: scrolled ? 1 : 0, transition: "opacity 0.4s" }}>
              {theme === "dark" ? t.nav.light : t.nav.dark}
            </span>
          </button>

          {/* Resume download — always visible, matches lang/theme pill style */}
          <a href="/Sanjit_Mathur_Resume.pdf" download className="clickable nav-resume"
            style={{
              display: "flex", alignItems: "center", gap: "0.35rem",
              background: "var(--surface-2)", border: "1px solid var(--border)",
              borderRadius: "100px", padding: "0.32rem 0.6rem",
              color: "var(--muted)",
              fontSize: "0.7rem", fontWeight: 500, letterSpacing: "0.02em",
              transition: "all 0.3s",
              textDecoration: "none",
            }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Resume</span>
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
          position: "fixed", top: 56, left: 0, right: 0, bottom: 0, zIndex: 999,
          background: theme === "dark" ? "rgba(10,10,10,0.97)" : "rgba(250,250,248,0.97)",
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

          {/* Language selector in mobile menu */}
          <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
            {LANGS.map(l => (
              <button key={l} onClick={() => { setLang(l); setMenuOpen(false); }}
                style={{
                  padding: "0.4rem 0.75rem", borderRadius: "100px",
                  background: lang === l ? "var(--text)" : "var(--surface-2)",
                  color: lang === l ? "var(--bg)" : "var(--muted)",
                  border: "1px solid var(--border)",
                  fontSize: "0.72rem", fontWeight: 500, cursor: "pointer",
                  transition: "all 0.2s",
                }}>
                {LANG_META[l].native}
              </button>
            ))}
          </div>

          <a href="/Sanjit_Mathur_Resume.pdf" download
            style={{
              marginTop: "1rem", display: "inline-flex", gap: "0.4rem", alignItems: "center",
              background: "var(--surface-2)", border: "1px solid var(--border)",
              borderRadius: "100px", padding: "0.5rem 1.2rem",
              color: "var(--muted)", fontSize: "0.85rem", fontWeight: 500,
              textDecoration: "none", cursor: "pointer",
            }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Resume
          </a>
        </div>
      )}
    </>
  );
}
