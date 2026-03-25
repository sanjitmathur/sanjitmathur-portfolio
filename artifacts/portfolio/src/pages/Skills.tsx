import { useEffect, useRef, useState } from "react";
import { useRevealChildren } from "../components/useReveal";

const stack = [
  { name: "Python",       pct: 95, cat: "Language", color: "#3b82f6" },
  { name: "TypeScript",   pct: 88, cat: "Language", color: "#d5b572" },
  { name: "React",        pct: 90, cat: "Frontend", color: "#61dafb" },
  { name: "FastAPI",      pct: 82, cat: "Backend",  color: "#22c55e" },
  { name: "TensorFlow",   pct: 78, cat: "ML / AI",  color: "#f59e0b" },
  { name: "LLM APIs",     pct: 88, cat: "AI",       color: "#c4934a" },
  { name: "Kubernetes",   pct: 72, cat: "DevOps",   color: "#3b82f6" },
  { name: "Docker",       pct: 85, cat: "DevOps",   color: "#0ea5e9" },
];

const pills = [
  "Python", "React", "TypeScript", "TensorFlow", "Kubernetes", "Docker",
  "LLM APIs", "FastAPI", "OpenCV", "PostgreSQL", "Node.js", "Next.js",
  "scikit-learn", "Pandas", "NumPy", "Arduino", "AWS", "C++", "D3.js", "Plotly",
];

const domains = [
  { area: "AI / ML", detail: "TensorFlow, PyTorch, OpenCV, LLMs, scikit-learn", color: "#d5b572" },
  { area: "Full-Stack", detail: "React, FastAPI, Node.js, PostgreSQL, Next.js", color: "#c4934a" },
  { area: "DevOps", detail: "Kubernetes, Docker, AWS, GCP", color: "#3b82f6" },
  { area: "Languages", detail: "Python, TypeScript, C++, SQL", color: "#22c55e" },
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
    <div ref={ref} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{ cursor: "none" }}>
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

  return (
    <section id="skills" ref={sectionRef} style={{ padding: "var(--section-py) var(--section-px)", background: "var(--surface)" }}>
      <div style={{ maxWidth: "var(--max-w)", margin: "0 auto" }}>
        <div className="fade-up" style={{ marginBottom: "3.5rem" }}>
          <p className="section-label" style={{ marginBottom: "0.75rem" }}>Skills</p>
          <h2 style={{ fontSize: "clamp(1.8rem,4vw,2.5rem)", fontWeight: 700, letterSpacing: "-0.03em", color: "var(--text)" }}>Technical Stack</h2>
          <p style={{ fontSize: "0.88rem", color: "var(--muted)", marginTop: "0.75rem", maxWidth: "500px", lineHeight: 1.7 }}>
            From embedded systems to cloud-native AI pipelines — across the full stack with a focus on intelligent, production-grade software.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "start" }}>
          {/* Left: skill bars */}
          <div className="fade-up" style={{ display: "flex", flexDirection: "column", gap: "1.4rem" }}>
            {stack.map((s, i) => <SkillBar key={s.name} skill={s} i={i} />)}
          </div>

          {/* Right: domains + pills */}
          <div>
            <div className="fade-up" style={{ display: "flex", flexDirection: "column", gap: 0, marginBottom: "2.5rem" }}>
              {domains.map(d => (
                <div key={d.area} style={{ display: "flex", gap: "1.25rem", alignItems: "flex-start", padding: "1rem 0", borderBottom: "1px solid var(--border)" }}>
                  <div style={{ width: 3, height: 36, borderRadius: 2, background: d.color, flexShrink: 0, marginTop: 4 }} />
                  <div>
                    <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text)", marginBottom: "0.3rem" }}>{d.area}</div>
                    <div style={{ fontSize: "0.72rem", color: "var(--muted)", lineHeight: 1.6 }}>{d.detail}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="fade-up">
              <div style={{ fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "1rem" }}>Also comfortable with</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                {pills.map(p => <span key={p} className="skill-pill">{p}</span>)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scrolling marquee */}
      <div style={{ marginTop: "5rem", overflow: "hidden", borderTop: "1px solid var(--border)", paddingTop: "2rem" }}>
        <div style={{ display: "flex", gap: "3rem", animation: "marquee 28s linear infinite", whiteSpace: "nowrap" }}>
          {[...pills, ...pills].map((p, i) => (
            <span key={i} style={{ fontSize: "0.75rem", fontWeight: 600, color: "rgba(255,255,255,0.15)", letterSpacing: "0.05em", textTransform: "uppercase" }}>{p}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
