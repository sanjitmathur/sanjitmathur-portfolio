import { useEffect, useState } from "react";

const sections = ["about", "experience", "projects", "skills", "contact"];

export default function Nav() {
  const [active, setActive] = useState("about");
  const [vis, setVis] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVis(window.scrollY > 60);
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
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "1.5rem 3rem",
        background: vis ? "rgba(248,242,225,0.92)" : "transparent",
        backdropFilter: vis ? "blur(20px)" : "none",
        borderBottom: vis ? "1px solid rgba(32,31,20,0.08)" : "none",
        transition: "all 0.5s cubic-bezier(0.16,1,0.3,1)",
      }}>
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="clickable"
          style={{ background: "none", border: "none", cursor: "none", fontFamily: "var(--app-font-serif)", fontSize: "1rem", fontWeight: 400, color: vis ? "var(--carbon)" : "transparent", transition: "color 0.4s", letterSpacing: "0.04em" }}>
          SM
        </button>

        <div style={{ display: vis ? "flex" : "none", gap: "2.75rem" }}>
          {sections.map(s => (
            <button key={s} onClick={() => go(s)} className="clickable"
              style={{ background: "none", border: "none", cursor: "none", fontFamily: "var(--app-font-mono)", fontSize: "0.54rem", letterSpacing: "0.22em", textTransform: "uppercase", color: active === s ? "var(--carbon)" : "var(--carbon-30)", fontWeight: active === s ? 700 : 400, transition: "color 0.3s" }}>
              {s}
            </button>
          ))}
        </div>

        <a href="mailto:sanjitmathur08@gmail.com" className="clickable"
          style={{ fontFamily: "var(--app-font-mono)", fontSize: "0.54rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--fawn)", textDecoration: "none", opacity: vis ? 1 : 0, transition: "opacity 0.4s, color 0.3s" }}
          onMouseEnter={e => { e.currentTarget.style.color = "var(--carbon)"; }}
          onMouseLeave={e => { e.currentTarget.style.color = "var(--fawn)"; }}>
          Hire Me ↗
        </a>
      </nav>

      <div style={{ position: "fixed", right: "2rem", top: "50%", transform: "translateY(-50%)", zIndex: 50, display: "flex", flexDirection: "column", gap: "0.6rem", opacity: vis ? 1 : 0, transition: "opacity 0.5s" }}>
        {sections.map(s => (
          <button key={s} onClick={() => go(s)} className="clickable" title={s} style={{ background: "none", border: "none", cursor: "none", padding: "4px" }}>
            <div className={`nav-dot ${active === s ? "active" : ""}`} />
          </button>
        ))}
      </div>
    </>
  );
}
