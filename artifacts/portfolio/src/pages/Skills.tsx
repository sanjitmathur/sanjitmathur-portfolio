import { useEffect, useRef, useState } from "react";
import { useRevealChildren } from "../components/useReveal";
import SkillOrbitScene from "../components/SkillOrbitScene";

const techStack = [
  { name: "Python",      pct: 95, cat: "Language" },
  { name: "TypeScript",  pct: 88, cat: "Language" },
  { name: "React",       pct: 90, cat: "Framework" },
  { name: "FastAPI",     pct: 82, cat: "Framework" },
  { name: "TensorFlow",  pct: 78, cat: "ML / AI" },
  { name: "OpenCV",      pct: 75, cat: "ML / AI" },
  { name: "Kubernetes",  pct: 72, cat: "DevOps" },
  { name: "Docker",      pct: 85, cat: "DevOps" },
  { name: "LLM APIs",    pct: 88, cat: "AI" },
  { name: "PostgreSQL",  pct: 80, cat: "Database" },
];

const marqueeItems = [
  "Python", "React", "TypeScript", "TensorFlow", "Kubernetes", "Docker",
  "LLM APIs", "FastAPI", "OpenCV", "PostgreSQL", "Node.js", "Next.js",
  "scikit-learn", "Pandas", "NumPy", "AWS", "GCP", "Arduino",
];

function SkillBar({ skill, i }: { skill: typeof techStack[0]; i: number }) {
  const [hovered, setHovered] = useState(false);
  const [animated, setAnimated] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ob = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setAnimated(true); ob.disconnect(); } }, { threshold: 0.3 });
    if (barRef.current) ob.observe(barRef.current);
    return () => ob.disconnect();
  }, []);

  return (
    <div
      ref={barRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="r3d"
      style={{ transitionDelay: `${i * 0.06}s`, cursor: "none" }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <span style={{ fontFamily: "var(--app-font-sans)", fontWeight: 500, fontSize: "0.8rem", color: hovered ? "var(--fawn)" : "var(--text)", transition: "color 0.3s" }}>{skill.name}</span>
          <span style={{ fontFamily: "var(--app-font-mono)", fontSize: "0.42rem", letterSpacing: "0.12em", color: "var(--text-30)", textTransform: "uppercase" }}>{skill.cat}</span>
        </div>
        <span style={{ fontFamily: "var(--app-font-mono)", fontSize: "0.55rem", color: hovered ? "var(--fawn)" : "var(--text-30)", transition: "color 0.3s" }}>{skill.pct}%</span>
      </div>
      <div style={{ height: "1px", background: "var(--text-06)", position: "relative", overflow: "visible" }}>
        <div style={{
          position: "absolute", left: 0, top: 0,
          height: "1px",
          width: animated ? `${skill.pct}%` : "0%",
          background: hovered ? `linear-gradient(to right, var(--fawn), rgba(213,181,114,0.3))` : `linear-gradient(to right, rgba(248,242,225,0.4), rgba(248,242,225,0.1))`,
          transition: `width ${0.9 + i * 0.04}s cubic-bezier(0.16,1,0.3,1) ${i * 0.05}s, background 0.3s`,
          boxShadow: hovered ? "0 0 8px rgba(213,181,114,0.6)" : "none",
        }} />
      </div>
    </div>
  );
}

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  useRevealChildren(sectionRef, ".r3d");

  return (
    <section id="skills" ref={sectionRef} style={{ background: "var(--bg-2)", position: "relative", overflow: "hidden" }}>
      {/* TOP: orbit + bars */}
      <div style={{ padding: "clamp(6rem,12vw,9rem) clamp(1.5rem,6vw,5rem)", paddingBottom: "4rem" }}>
        <div style={{ maxWidth: "1140px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: "1.2rem", marginBottom: "4rem" }}>
            <span className="r3d" style={{ fontFamily: "var(--app-font-mono)", fontSize: "0.44rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--fawn)" }}>04 / Skills</span>
            <div style={{ flex: 1, height: "1px", background: "var(--text-06)" }} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "start" }}>
            {/* Left: heading + orbit */}
            <div>
              <h2 className="r3d" style={{ fontFamily: "var(--app-font-serif)", fontSize: "clamp(2.5rem,5vw,4rem)", fontWeight: 400, color: "var(--text)", lineHeight: 0.95, letterSpacing: "-0.04em", marginBottom: "2.5rem" }}>
                My Technical<br /><em style={{ color: "var(--fawn)" }}>Universe</em>
              </h2>
              <p className="r3d" style={{ fontFamily: "var(--app-font-sans)", fontSize: "0.85rem", lineHeight: 1.9, color: "var(--text-60)", maxWidth: "380px", marginBottom: "3rem" }}>
                From low-level embedded systems to cloud-native AI pipelines — I work across the full stack with a focus on intelligent, production-grade systems.
              </p>
              {/* 3D Orbit Scene */}
              <div className="r3d" style={{ borderRadius: "4px", overflow: "hidden", border: "1px solid rgba(248,242,225,0.06)", position: "relative" }}>
                <SkillOrbitScene height={340} />
                <div style={{
                  position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
                  pointerEvents: "none",
                }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontFamily: "var(--app-font-serif)", fontSize: "1.8rem", fontStyle: "italic", color: "var(--fawn)", opacity: 0.6 }}>Orbit</div>
                    <div style={{ fontFamily: "var(--app-font-mono)", fontSize: "0.38rem", letterSpacing: "0.3em", color: "var(--text-30)", marginTop: "0.3rem" }}>INTERACTIVE</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: bars */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.8rem", paddingTop: "0.5rem" }}>
              {techStack.map((s, i) => <SkillBar key={s.name} skill={s} i={i} />)}
            </div>
          </div>
        </div>
      </div>

      {/* MARQUEE TICKER */}
      <div style={{ borderTop: "1px solid var(--text-06)", padding: "1.2rem 0", overflow: "hidden", background: "rgba(20,18,9,0.4)" }}>
        <div style={{ display: "flex", animation: "marquee 22s linear infinite", whiteSpace: "nowrap", width: "max-content" }}>
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: "1.4rem", paddingRight: "2rem" }}>
              <span style={{ fontFamily: "var(--app-font-mono)", fontSize: "0.48rem", letterSpacing: "0.22em", textTransform: "uppercase", color: i % 3 === 0 ? "var(--fawn)" : "var(--text-30)" }}>{item}</span>
              <span style={{ color: "var(--text-12)", fontSize: "0.5rem" }}>◆</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
