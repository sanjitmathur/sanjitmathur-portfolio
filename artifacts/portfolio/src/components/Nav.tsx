import { useEffect, useState } from "react";

const sections = ["about", "experience", "projects", "skills", "contact"];

export default function Nav() {
  const [activeSection, setActiveSection] = useState("about");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 80);
      const scrollY = window.scrollY + window.innerHeight / 2;
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const absTop = el.getBoundingClientRect().top + window.scrollY;
          const absBottom = el.getBoundingClientRect().bottom + window.scrollY;
          if (scrollY >= absTop && scrollY < absBottom) setActiveSection(id);
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <>
      {/* Top nav */}
      <nav
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "1.5rem 2.5rem",
          background: visible ? "rgba(12,11,10,0.88)" : "transparent",
          backdropFilter: visible ? "blur(24px) saturate(1.3)" : "none",
          borderBottom: visible ? "1px solid rgba(74,63,56,0.3)" : "none",
          transition: "all 0.55s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="clickable"
          style={{
            background: "none", border: "none", cursor: "none",
            fontFamily: "var(--app-font-serif)",
            fontSize: "1rem",
            fontWeight: 400,
            letterSpacing: "0.06em",
            color: visible ? "var(--ivory)" : "transparent",
            transition: "color 0.5s ease",
          }}
        >
          SM
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "2.5rem" }}>
          {sections.map((s) => (
            <button
              key={s}
              onClick={() => scrollTo(s)}
              className="clickable"
              style={{
                background: "none", border: "none", cursor: "none",
                fontFamily: "var(--app-font-mono)",
                fontSize: "0.58rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: activeSection === s
                  ? "var(--fawn)"
                  : "var(--iron)",
                transition: "color 0.3s ease",
                display: visible ? "block" : "none",
              }}
            >
              {s}
            </button>
          ))}
        </div>

        <a
          href="mailto:sanjitmathur08@gmail.com"
          className="clickable"
          style={{
            fontFamily: "var(--app-font-mono)",
            fontSize: "0.58rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "var(--teal-pale)",
            textDecoration: "none",
            border: "1px solid rgba(58,112,104,0.3)",
            padding: "0.4rem 1rem",
            transition: "all 0.35s ease",
            opacity: visible ? 1 : 0,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(58,112,104,0.1)";
            e.currentTarget.style.borderColor = "var(--teal)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.borderColor = "rgba(58,112,104,0.3)";
          }}
        >
          Hire
        </a>
      </nav>

      {/* Side dot nav */}
      <div
        style={{
          position: "fixed", right: "1.5rem", top: "50%",
          zIndex: 50, display: "flex", flexDirection: "column", gap: "0.6rem",
          transform: "translateY(-50%)",
          opacity: visible ? 1 : 0,
          transition: "opacity 0.5s ease",
        }}
      >
        {sections.map((s) => (
          <button
            key={s}
            onClick={() => scrollTo(s)}
            className="clickable"
            title={s}
            style={{ background: "none", border: "none", cursor: "none", padding: "4px" }}
          >
            <div className={`nav-dot ${activeSection === s ? "active" : ""}`} />
          </button>
        ))}
      </div>
    </>
  );
}
