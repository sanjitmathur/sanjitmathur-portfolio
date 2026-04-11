import { useEffect, useRef, useState } from "react";
import Magnetic from "../components/Magnetic";
import { useLang } from "../components/LanguageContext";

function TypewriterName({ name }: { name: string }) {
  const [displayed, setDisplayed] = useState("");
  const [visible, setVisible] = useState(false);
  const idx = useRef(0);
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.3 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) {
      idx.current = 0;
      setDisplayed("");
      return;
    }
    const delay = setTimeout(() => {
      const id = setInterval(() => {
        idx.current += 1;
        setDisplayed(name.slice(0, idx.current));
        if (idx.current >= name.length) clearInterval(id);
      }, 90);
      return () => clearInterval(id);
    }, 300);
    return () => clearTimeout(delay);
  }, [visible, name]);

  // Reset when name changes (language switch)
  useEffect(() => {
    idx.current = 0;
    setDisplayed("");
    if (visible) {
      const delay = setTimeout(() => {
        const id = setInterval(() => {
          idx.current += 1;
          setDisplayed(name.slice(0, idx.current));
          if (idx.current >= name.length) clearInterval(id);
        }, 90);
        return () => clearInterval(id);
      }, 100);
      return () => clearTimeout(delay);
    }
  }, [name]);

  return (
    <span ref={containerRef} style={{ color: "var(--text)", position: "relative" }}>
      {displayed}
      <span className="typewriter-caret" style={{
        display: "inline-block", width: "2px", height: "0.85em",
        background: "var(--text)", marginLeft: "2px", verticalAlign: "middle",
        animation: "blink 1s step-end infinite",
      }} />
    </span>
  );
}

export default function Hero() {
  const { t } = useLang();
  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section id="about" style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      padding: `0 var(--section-px)`,
      background: "var(--bg)", position: "relative", overflow: "hidden",
      transition: "background 0.35s ease",
    }}>
      {/* Subtle grid */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: `linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)`,
        backgroundSize: "72px 72px",
        opacity: 0.5,
        maskImage: "radial-gradient(ellipse 75% 75% at 50% 50%, black 10%, transparent 100%)",
      }} />

      <div style={{ maxWidth: "var(--max-w)", margin: "0 auto", width: "100%", paddingTop: "clamp(3rem, 8vw, 6rem)" }}>

        {/* Eyebrow label */}
        <div style={{
          display: "flex", alignItems: "center", gap: "0.75rem",
          marginBottom: "2rem", animation: "slideUp 0.6s 0.05s ease both",
        }}>
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#22c55e", display: "inline-block", animation: "blink 2.5s ease infinite" }} />
          <span style={{ fontSize: "0.74rem", fontWeight: 400, color: "var(--muted)", letterSpacing: "0.1em", textTransform: "uppercase", transition: "color 0.35s" }}>
            {t.hero.eyebrow}
          </span>
        </div>

        {/* Heading */}
        <h1 style={{
          fontSize: "clamp(3rem, 6.5vw, 4rem)",
          fontWeight: 700,
          fontFamily: "var(--font-display)",
          letterSpacing: "-0.02em",
          lineHeight: 1.08,
          color: "var(--text)",
          marginBottom: "1.75rem",
          animation: "slideUp 0.65s 0.08s ease both",
          transition: "color 0.35s",
        }}>
          <TypewriterName name={t.hero.name} />
        </h1>

        {/* Thin divider */}
        <div style={{ width: "40px", height: "1px", background: "var(--border-hover)", marginBottom: "1.75rem", animation: "slideUp 0.5s 0.2s ease both", transition: "background 0.35s" }} />

        {/* Subtitle */}
        <p style={{
          fontSize: "clamp(1rem, 1.8vw, 1.125rem)", fontWeight: 400,
          color: "var(--muted)", maxWidth: "520px", lineHeight: 1.75,
          marginBottom: "3rem",
          animation: "slideUp 0.7s 0.25s ease both",
          transition: "color 0.35s",
        }}>
          {t.hero.subtitle}{" "}
          <span style={{ color: "var(--text)", fontWeight: 500, transition: "color 0.35s" }}>{t.hero.subtitleCompany}</span>
          {" "}{t.hero.subtitleSuffix}
        </p>

        {/* CTAs */}
        <div style={{ display: "flex", gap: "0.85rem", flexWrap: "wrap", marginBottom: "4.5rem", animation: "slideUp 0.7s 0.35s ease both" }}>
          <Magnetic strength={0.22}>
            <button className="btn-primary clickable" data-cursor="VIEW" onClick={() => go("projects")}>
              {t.hero.viewProjects}
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M1 13L13 1M13 1H5M13 1V9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
            </button>
          </Magnetic>
          <Magnetic strength={0.22}>
            <button className="btn-secondary clickable" data-cursor="MAIL" onClick={() => go("contact")}>
              {t.hero.contactMe}
            </button>
          </Magnetic>
        </div>

        {/* Stats row */}
        <div className="stats-row" style={{
          display: "flex", gap: "clamp(1.25rem, 4vw, 3rem)", flexWrap: "wrap",
          paddingTop: "2rem", borderTop: "1px solid var(--border)",
          animation: "slideUp 0.7s 0.45s ease both",
        }}>
          {[
            ["3+", t.hero.stats.internships],
            ["500+", t.hero.stats.studentsReached],
            ["88%", t.hero.stats.mlAccuracy],
            ["UOWD", t.hero.stats.dubai],
          ].map(([n, l]) => (
            <div key={n}>
              <div style={{ fontSize: "1.35rem", fontWeight: 600, fontFamily: "var(--font-display)", letterSpacing: "-0.01em", color: "var(--text)", transition: "color 0.35s" }}>{n}</div>
              <div style={{ fontSize: "0.7rem", color: "var(--muted)", marginTop: "0.25rem", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 400, transition: "color 0.35s" }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll cue */}
      <div className="scroll-cue" style={{ position: "absolute", bottom: "2.5rem", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", animation: "slideUp 0.6s 1.2s ease both" }}>
        <span style={{ fontSize: "0.6rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--muted)", fontWeight: 400, transition: "color 0.35s" }}>{t.hero.scroll}</span>
        <div style={{ width: "1px", height: "44px", overflow: "hidden" }}>
          <div className="scroll-line" style={{ width: "100%", height: "100%", background: "linear-gradient(to bottom, var(--accent), transparent)", animation: "scrollLine 2s ease infinite", transition: "background 0.35s" }} />
        </div>
      </div>
    </section>
  );
}
