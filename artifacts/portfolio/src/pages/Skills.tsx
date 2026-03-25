import { useEffect, useRef, useState } from "react";
import { useRevealChildren } from "../components/useReveal";

const stack = [
  { name: "Python",       pct: 95, cat: "Language" },
  { name: "TypeScript",   pct: 88, cat: "Language" },
  { name: "React",        pct: 90, cat: "Frontend" },
  { name: "FastAPI",      pct: 82, cat: "Backend" },
  { name: "TensorFlow",   pct: 78, cat: "ML / AI" },
  { name: "OpenCV",       pct: 75, cat: "ML / AI" },
  { name: "Kubernetes",   pct: 72, cat: "DevOps" },
  { name: "Docker",       pct: 85, cat: "DevOps" },
  { name: "LLM APIs",     pct: 88, cat: "AI" },
  { name: "PostgreSQL",   pct: 80, cat: "Database" },
  { name: "Node.js",      pct: 80, cat: "Backend" },
  { name: "Next.js",      pct: 76, cat: "Frontend" },
];

const marqueeItems = ["Python", "React", "TypeScript", "TensorFlow", "Kubernetes", "Docker", "LLM APIs", "FastAPI", "OpenCV", "PostgreSQL", "Node.js", "Next.js", "scikit-learn", "Pandas", "NumPy", "Arduino", "AWS", "GCP"];

function Bar({ skill, i }: { skill: typeof stack[0]; i: number }) {
  const [animated, setAnimated] = useState(false);
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ob = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setAnimated(true); ob.disconnect(); } }, { threshold: 0.4 });
    if (ref.current) ob.observe(ref.current);
    return () => ob.disconnect();
  }, []);

  return (
    <div ref={ref} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{ cursor: "none" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.55rem" }}>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "baseline" }}>
          <span style={{ fontFamily: "var(--app-font-sans)", fontWeight: 500, fontSize: "0.82rem", color: hovered ? "var(--fawn)" : "var(--text)", transition: "color 0.25s" }}>{skill.name}</span>
          <span style={{ fontFamily: "var(--app-font-mono)", fontSize: "0.4rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-30)" }}>{skill.cat}</span>
        </div>
        <span style={{ fontFamily: "var(--app-font-mono)", fontSize: "0.6rem", color: hovered ? "var(--fawn)" : "var(--text-30)", transition: "color 0.25s" }}>{skill.pct}%</span>
      </div>
      <div style={{ height: "1px", background: "var(--text-06)", position: "relative" }}>
        <div style={{
          position: "absolute", left: 0, top: 0, height: "1px",
          width: animated ? `${skill.pct}%` : "0%",
          background: hovered ? "var(--fawn)" : "rgba(248,242,225,0.3)",
          transition: `width ${0.9 + i * 0.03}s cubic-bezier(0.16,1,0.3,1) ${i * 0.04}s, background 0.25s`,
          boxShadow: hovered ? "0 0 6px rgba(213,181,114,0.6)" : "none",
        }} />
      </div>
    </div>
  );
}

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  useRevealChildren(sectionRef, ".r3d");

  return (
    <section id="skills" ref={sectionRef} style={{ background: "var(--bg-2)" }}>
      <div style={{ padding: "clamp(6rem,12vw,9rem) clamp(1.5rem,6vw,5rem)", paddingBottom: "4rem", maxWidth: "1100px", margin: "0 auto" }}>

        <div style={{ display: "flex", alignItems: "baseline", gap: "1.5rem", marginBottom: "5rem" }}>
          <span className="r3d" style={{ fontFamily: "var(--app-font-mono)", fontSize: "0.44rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--fawn)" }}>04 / Skills</span>
          <div style={{ flex: 1, height: "1px", background: "var(--text-06)" }} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6rem", alignItems: "start" }}>
          {/* Left */}
          <div>
            <h2 className="r3d" style={{ fontFamily: "var(--app-font-serif)", fontSize: "clamp(2.8rem,5.5vw,4.5rem)", fontWeight: 400, lineHeight: 0.92, letterSpacing: "-0.04em", color: "var(--text)", marginBottom: "2rem" }}>
              Technical<br /><em style={{ color: "var(--fawn)" }}>Stack</em>
            </h2>
            <p className="r3d" style={{ fontFamily: "var(--app-font-sans)", fontSize: "0.85rem", lineHeight: 1.9, color: "var(--text-60)", maxWidth: "360px" }}>
              From embedded systems to cloud-native AI pipelines — across the full stack with a focus on intelligent, production-grade software.
            </p>

            {/* Big domain labels */}
            <div className="r3d" style={{ marginTop: "3.5rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {[["AI / ML", "TensorFlow, PyTorch, OpenCV, LLMs"], ["Full-Stack", "React, FastAPI, Node.js, PostgreSQL"], ["DevOps", "Kubernetes, Docker, AWS, GCP"], ["Languages", "Python, TypeScript, C++, SQL"]].map(([area, detail]) => (
                <div key={area} style={{ display: "flex", gap: "1.5rem", alignItems: "baseline", paddingBottom: "0.6rem", borderBottom: "1px solid var(--text-06)" }}>
                  <span style={{ fontFamily: "var(--app-font-mono)", fontSize: "0.5rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--fawn)", minWidth: "70px" }}>{area}</span>
                  <span style={{ fontFamily: "var(--app-font-sans)", fontSize: "0.76rem", color: "var(--text-60)" }}>{detail}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — bars */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.6rem" }}>
            {stack.map((s, i) => <Bar key={s.name} skill={s} i={i} />)}
          </div>
        </div>
      </div>

      {/* Marquee */}
      <div style={{ borderTop: "1px solid var(--text-06)", padding: "1.1rem 0", overflow: "hidden", background: "rgba(20,18,9,0.5)" }}>
        <div style={{ display: "flex", animation: "marquee 22s linear infinite", whiteSpace: "nowrap", width: "max-content" }}>
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: "1.2rem", paddingRight: "1.8rem" }}>
              <span style={{ fontFamily: "var(--app-font-mono)", fontSize: "0.46rem", letterSpacing: "0.22em", textTransform: "uppercase", color: i % 3 === 0 ? "var(--fawn)" : "var(--text-30)" }}>{item}</span>
              <span style={{ color: "var(--text-12)", fontSize: "0.4rem" }}>◆</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
