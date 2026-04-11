import { useEffect, useRef, useState } from "react";
import { useRevealChildren } from "../components/useReveal";
import { useLang } from "../components/LanguageContext";

const stack = [
  { name: "Python",       pct: 95, cat: "Language", color: "#3b82f6" },
  { name: "TypeScript",   pct: 88, cat: "Language", color: "#d5b572" },
  { name: "XGBoost",      pct: 85, cat: "ML / AI",  color: "#f59e0b" },
  { name: "FastAPI",      pct: 85, cat: "Backend",  color: "#22c55e" },
  { name: "Scikit-learn", pct: 85, cat: "ML / AI",  color: "#c4934a" },
  { name: "React",        pct: 90, cat: "Frontend", color: "#61dafb" },
  { name: "Kubernetes",   pct: 72, cat: "DevOps",   color: "#3b82f6" },
  { name: "Docker",       pct: 85, cat: "DevOps",   color: "#0ea5e9" },
];

const pills = [
  "Python", "TypeScript", "SQL", "C++",
  "XGBoost", "LightGBM", "Scikit-learn", "Pandas", "NumPy", "Logistic Regression", "LSTM", "SHAP",
  "FastAPI", "Node.js", "Express.js", "REST APIs", "Pydantic", "PostgreSQL",
  "Docker", "Kubernetes", "Streamlit", "Plotly", "React", "Next.js",
];

type DomainKey = "aiml" | "fullstack" | "infra" | "langs";
const domainKeys: { key: DomainKey; color: string }[] = [
  { key: "aiml", color: "#d5b572" },
  { key: "fullstack", color: "#c4934a" },
  { key: "infra", color: "#3b82f6" },
  { key: "langs", color: "#22c55e" },
];

function SkillBar({ skill, i }: { skill: typeof stack[0]; i: number }) {
  const [animated, setAnimated] = useState(false);
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ob = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setAnimated(true); ob.disconnect(); }
    }, { threshold: 0.3 });
    if (ref.current) ob.observe(ref.current);
    return () => ob.disconnect();
  }, []);

  return (
    <div ref={ref} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
        <div style={{ display: "flex", gap: "0.7rem", alignItems: "baseline" }}>
          <span style={{ fontWeight: 500, fontSize: "0.82rem", color: hovered ? skill.color : "var(--text)", transition: "color 0.25s" }}>{skill.name}</span>
          <span style={{ fontSize: "0.58rem", color: "var(--muted)", opacity: 0.6, textTransform: "uppercase", letterSpacing: "0.08em" }}>{skill.cat}</span>
        </div>
        <span style={{ fontSize: "0.65rem", color: hovered ? skill.color : "var(--muted)", transition: "color 0.25s", fontVariantNumeric: "tabular-nums" }}>{skill.pct}%</span>
      </div>
      <div style={{ height: "2px", background: "var(--border)", borderRadius: 1, overflow: "hidden" }}>
        <div style={{
          height: "100%", borderRadius: 1,
          width: animated ? `${skill.pct}%` : "0%",
          background: skill.color,
          transition: `width ${0.8 + i * 0.03}s cubic-bezier(0.16,1,0.3,1) ${i * 0.05 + 0.1}s`,
          boxShadow: hovered ? `0 0 8px ${skill.color}60` : "none",
        }} />
      </div>
    </div>
  );
}

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  useRevealChildren(sectionRef, ".fade-up");
  const { t } = useLang();

  const ts = t.skills;

  return (
    <section id="skills" ref={sectionRef} style={{ padding: "var(--section-py) var(--section-px)", background: "var(--surface)" }}>
      <div style={{ maxWidth: "var(--max-w)", margin: "0 auto" }}>
        <div className="fade-up" style={{ marginBottom: "3.5rem" }}>
          <p className="section-label" style={{ marginBottom: "0.85rem" }}>{ts.label}</p>
          <h2 style={{ fontSize: "clamp(1.85rem,4vw,2.25rem)", fontWeight: 600, fontFamily: "var(--font-display)", letterSpacing: "-0.02em", color: "var(--text)" }}>{ts.heading}</h2>
          <p style={{ fontSize: "0.9rem", color: "var(--muted)", marginTop: "0.85rem", maxWidth: "520px", lineHeight: 1.7 }}>
            {ts.subtitle}
          </p>
        </div>

        <div className="skills-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(2rem, 5vw, 4rem)", alignItems: "start" }}>
          {/* Left: skill bars */}
          <div className="fade-up" style={{ display: "flex", flexDirection: "column", gap: "1.4rem" }}>
            {stack.map((s, i) => <SkillBar key={s.name} skill={s} i={i} />)}
          </div>

          {/* Right: domains */}
          <div>
            <div className="fade-up" style={{ display: "flex", flexDirection: "column", gap: 0, marginBottom: "2.5rem" }}>
              {domainKeys.map(({ key, color }) => {
                const d = ts.domains[key];
                return (
                  <div key={key} style={{ display: "flex", gap: "1.25rem", alignItems: "flex-start", padding: "1rem 0", borderBottom: "1px solid var(--border)" }}>
                    <div style={{ width: 3, height: 36, borderRadius: 2, background: color, flexShrink: 0, marginTop: 4 }} />
                    <div>
                      <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text)", marginBottom: "0.3rem" }}>{d.area}</div>
                      <div style={{ fontSize: "0.72rem", color: "var(--muted)", lineHeight: 1.6 }}>{d.detail}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Scrolling marquee */}
      <div style={{ marginTop: "5rem", overflow: "hidden", borderTop: "1px solid var(--border)", paddingTop: "2rem" }}>
        <div className="marquee-track" style={{ display: "flex", gap: "3rem", animation: "marquee 28s linear infinite", whiteSpace: "nowrap" }}>
          {[...pills, ...pills].map((p, i) => (
            <span key={i} style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--muted)", letterSpacing: "0.08em", textTransform: "uppercase", opacity: 0.35 }}>{p}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
