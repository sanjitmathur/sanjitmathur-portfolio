import { useEffect, useState } from "react";

const sections = ["about", "experience", "projects", "skills", "contact"];
const labels: Record<string, string> = {
  about: "About", experience: "Experience", projects: "Projects",
  skills: "Skills", contact: "Contact",
};

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("about");

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
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 var(--section-px)", height: "60px",
      background: scrolled ? "rgba(32,31,20,0.92)" : "transparent",
      backdropFilter: scrolled ? "blur(16px)" : "none",
      borderBottom: scrolled ? "1px solid var(--border)" : "none",
      transition: "background 0.4s ease, border-color 0.4s ease",
    }}>
      <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="clickable"
        style={{ background: "none", border: "none", cursor: "none", display: "flex", alignItems: "center", gap: "0.6rem" }}>
        <div style={{ width: 28, height: 28, borderRadius: "7px", background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: "0.7rem", fontWeight: 800, color: "#201f14", letterSpacing: "-0.04em" }}>SM</span>
        </div>
        <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text)", opacity: scrolled ? 1 : 0, transition: "opacity 0.4s" }}>Sanjit Mathur</span>
      </button>

      <div style={{ display: "flex", gap: "0.25rem", background: scrolled ? "rgba(255,255,255,0.04)" : "transparent", padding: scrolled ? "0.3rem" : "0", borderRadius: "10px", border: scrolled ? "1px solid var(--border)" : "none", transition: "all 0.4s" }}>
        {sections.map(s => (
          <button key={s} onClick={() => go(s)} className="clickable"
            style={{ background: active === s ? "rgba(213,181,114,0.12)" : "transparent", border: "none", cursor: "none", padding: "0.35rem 0.85rem", borderRadius: "7px", fontSize: "0.82rem", fontWeight: active === s ? 600 : 400, color: active === s ? "var(--text)" : "var(--muted)", transition: "all 0.2s" }}>
            {labels[s]}
          </button>
        ))}
      </div>

      <a href="mailto:sanjitmathur08@gmail.com" className="btn-primary clickable"
        style={{ fontSize: "0.78rem", padding: "0.5rem 1.1rem", opacity: scrolled ? 1 : 0, transition: "opacity 0.4s", pointerEvents: scrolled ? "auto" : "none" }}>
        Hire Me
      </a>
    </nav>
  );
}
