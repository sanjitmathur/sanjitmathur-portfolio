import { useEffect, useRef, useState } from "react";

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
          const { top, bottom } = el.getBoundingClientRect();
          const absTop = top + window.scrollY;
          const absBottom = bottom + window.scrollY;
          if (scrollY >= absTop && scrollY < absBottom) {
            setActiveSection(id);
          }
        }
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* Top nav */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6"
        style={{
          background: visible ? "rgba(15,14,13,0.85)" : "transparent",
          backdropFilter: visible ? "blur(20px)" : "none",
          borderBottom: visible ? "1px solid rgba(196,168,130,0.08)" : "none",
          transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <div
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="font-serif text-base tracking-wide text-amber-100 clickable"
          style={{ cursor: "none", letterSpacing: "0.12em", opacity: visible ? 1 : 0, transition: "opacity 0.5s" }}
        >
          SM
        </div>
        <div className="hidden md:flex items-center gap-8">
          {sections.map((s) => (
            <button
              key={s}
              onClick={() => scrollTo(s)}
              className="text-xs font-mono uppercase tracking-widest clickable"
              style={{
                cursor: "none",
                color: activeSection === s ? "var(--fawn)" : "rgba(240,235,227,0.4)",
                transition: "color 0.3s ease",
                background: "none",
                border: "none",
              }}
            >
              {s}
            </button>
          ))}
        </div>
        <a
          href="mailto:sanjitmathur08@gmail.com"
          className="btn-outline text-xs clickable"
          style={{ padding: "0.5rem 1.25rem", fontSize: "0.7rem" }}
        >
          <span>Contact</span>
        </a>
      </nav>

      {/* Side nav dots */}
      <div
        className="fixed right-6 top-1/2 z-50 flex flex-col gap-3 -translate-y-1/2 hidden md:flex"
        style={{ opacity: visible ? 1 : 0, transition: "opacity 0.5s" }}
      >
        {sections.map((s) => (
          <button
            key={s}
            onClick={() => scrollTo(s)}
            className="clickable"
            style={{ background: "none", border: "none", cursor: "none", padding: "4px" }}
            title={s}
          >
            <div className={`nav-dot ${activeSection === s ? "active" : ""}`} />
          </button>
        ))}
      </div>
    </>
  );
}
