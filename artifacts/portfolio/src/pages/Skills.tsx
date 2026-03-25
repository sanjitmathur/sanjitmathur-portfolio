import { useEffect, useRef, useState } from "react";
import { useRevealChildren } from "../components/useReveal";

const stats = [
  { v: 3,   suffix: "+", l: "Internships" },
  { v: 500, suffix: "+", l: "Students Reached" },
  { v: 88,  suffix: "%", l: "ML Model Accuracy" },
];

const allSkills = [
  "Python", "TypeScript", "React", "Next.js", "Node.js",
  "TensorFlow", "PyTorch", "scikit-learn", "OpenAI API",
  "Kubernetes", "Docker", "FastAPI", "PostgreSQL", "LLMs",
  "Computer Vision", "Signal Processing", "ROS", "ArduPilot",
  "Raspberry Pi", "Arduino", "BLE", "Streamlit", "D3.js",
];

const groups = [
  { title: "AI & ML", skills: ["Python", "TensorFlow", "PyTorch", "scikit-learn", "OpenAI API", "LLMs", "Computer Vision", "Prompt Engineering"] },
  { title: "Full-Stack", skills: ["TypeScript", "React", "Next.js", "Node.js", "FastAPI", "PostgreSQL", "REST APIs", "WebSockets"] },
  { title: "Infrastructure", skills: ["Kubernetes", "Docker", "Linux", "CI/CD", "Git", "Microservices"] },
  { title: "Embedded", skills: ["Raspberry Pi", "Arduino", "ROS", "ArduPilot", "BLE", "Sensor Fusion"] },
];

function CountUp({ target, suffix }: { target: number; suffix: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const dur = 1800, steps = 60;
        let i = 0;
        const t = setInterval(() => {
          i++;
          setVal(Math.round(target * (i / steps)));
          if (i >= steps) clearInterval(t);
        }, dur / steps);
      }
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [target]);

  return <div ref={ref}>{val}{suffix}</div>;
}

export default function Skills() {
  const ref = useRevealChildren(0.05);

  return (
    <section id="skills" style={{ padding: "9rem 0", background: "var(--bg-alt)", position: "relative", overflow: "hidden" }}>

      {/* Infinite marquee of skills */}
      <div style={{ overflow: "hidden", marginBottom: "6rem", borderTop: "1px solid var(--carbon-12)", borderBottom: "1px solid var(--carbon-12)", padding: "1rem 0" }}>
        <div style={{ display: "flex", width: "max-content", animation: "marquee 28s linear infinite" }}>
          {[...allSkills, ...allSkills, ...allSkills].map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "2rem", paddingRight: "2rem", whiteSpace: "nowrap" }}>
              <span style={{ fontFamily: "var(--app-font-mono)", fontSize: "0.56rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--carbon-60)" }}>{s}</span>
              <span style={{ width: 3, height: 3, borderRadius: "50%", background: "var(--fawn)", display: "inline-block", flexShrink: 0 }} />
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 clamp(1.5rem, 4vw, 3rem)" }}>
        <div ref={ref} style={{ perspective: "1400px" }}>
          {/* Section heading */}
          <div className="r3d" style={{ marginBottom: "5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "1rem" }}>
              <span style={{ fontFamily: "var(--app-font-mono)", fontSize: "0.52rem", letterSpacing: "0.26em", textTransform: "uppercase", color: "var(--fawn)" }}>04 / Skills</span>
              <div style={{ flex: 1, height: "1px", background: "var(--carbon-12)" }} />
            </div>
            <h2 style={{ fontFamily: "var(--app-font-serif)", fontSize: "clamp(2.5rem, 6.5vw, 5rem)", fontWeight: 400, color: "var(--carbon)", letterSpacing: "-0.035em", lineHeight: 1.05 }}>
              What I<br /><em style={{ color: "var(--fawn)", fontStyle: "italic" }}>Work With</em>
            </h2>
          </div>

          {/* Giant stats with count-up */}
          <div className="r3d" style={{
            display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
            borderTop: "1px solid var(--carbon-12)", borderLeft: "1px solid var(--carbon-12)",
            marginBottom: "6rem",
          }}>
            {stats.map((s, i) => (
              <div key={i} style={{
                borderRight: "1px solid var(--carbon-12)", borderBottom: "1px solid var(--carbon-12)",
                padding: "3rem 2rem", textAlign: "center",
                transition: "background 0.35s ease",
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--fawn-20)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
              >
                <div style={{ fontFamily: "var(--app-font-serif)", fontSize: "clamp(2.8rem, 5.5vw, 4.5rem)", fontWeight: 400, color: i % 2 === 0 ? "var(--fawn)" : "var(--carbon)", letterSpacing: "-0.05em", lineHeight: 1, marginBottom: "0.5rem" }}>
                  <CountUp target={s.v} suffix={s.suffix} />
                </div>
                <div style={{ fontFamily: "var(--app-font-mono)", fontSize: "0.5rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--carbon-60)" }}>{s.l}</div>
              </div>
            ))}
          </div>

          {/* Skill groups */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 460px), 1fr))", gap: "4rem 3rem" }}>
            {groups.map((g, i) => (
              <div key={i} className="r3d" style={{ transitionDelay: `${i * 0.1}s` }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", marginBottom: "1.4rem" }}>
                  <div style={{ width: 20, height: 1, background: "var(--fawn)" }} />
                  <h3 style={{ fontFamily: "var(--app-font-mono)", fontSize: "0.56rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--fawn)" }}>{g.title}</h3>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.38rem" }}>
                  {g.skills.map(sk => (
                    <span key={sk} className="tag clickable"
                      onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = "var(--carbon)"; el.style.color = "var(--bg)"; el.style.borderColor = "var(--carbon)"; el.style.transform = "translateY(-2px)"; }}
                      onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = "transparent"; el.style.color = "var(--carbon-60)"; el.style.borderColor = "var(--carbon-12)"; el.style.transform = "translateY(0)"; }}
                      style={{ transition: "all 0.25s ease", cursor: "none" }}>
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(calc(-100% / 3)); }
        }
      `}</style>
    </section>
  );
}
