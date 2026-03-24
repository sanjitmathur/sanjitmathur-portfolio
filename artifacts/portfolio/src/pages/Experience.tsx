import { useRevealChildren } from "../components/useReveal";
import Tilt3DCard from "../components/Tilt3DCard";
import { useMouse3D } from "../components/Mouse3DContext";

const exp = [
  {
    role: "AI Engineering Intern",
    co: "Baraka Financial Ltd.",
    loc: "Dubai",
    period: "Feb 2026 – Present",
    type: "FinTech · AI",
    bullets: [
      "Deployed containerised services to Kubernetes; built AI-powered tooling that automated error classification and log analysis, eliminating manual triage across support workflows.",
      "Built Position Search and Trading Account Monitor modules integrating OMS, Instruments, and Wallet microservices — cutting manual portfolio lookup time for operations teams.",
      "Unified inconsistent data schemas across distributed services into a single portfolio state model.",
    ],
    tags: ["Kubernetes", "Docker", "LLM APIs", "Python", "TypeScript"],
    accent: "teal",
  },
  {
    role: "Digital Intern",
    co: "IndiGo — InterGlobe Aviation",
    loc: "Gurgaon",
    period: "Aug 2025 – Sep 2025",
    type: "Aviation · ML",
    bullets: [
      "Built a Logistic Regression model to predict on-time arrival on DEL–BOM using 1,000 flight records and 6 engineered features, achieving 88% accuracy.",
      "Engineered features from raw operational data including one-hot encoding of aircraft types and block-hour overrun computation.",
    ],
    tags: ["Python", "scikit-learn", "Pandas", "Feature Engineering"],
    accent: "fawn",
  },
  {
    role: "Software Engineering Intern",
    co: "Lab of Future",
    loc: "Dubai",
    period: "Jun 2025 – Aug 2025",
    type: "EdTech",
    bullets: ["Built internal educational software used by 500+ students across 4 campuses."],
    tags: ["React", "Node.js", "Full-Stack"],
    accent: "teal",
  },
];

export default function Experience() {
  const ref = useRevealChildren(0.05);
  const mouse = useMouse3D();

  return (
    <section id="experience" style={{ padding: "9rem 0", background: "var(--bg-2)", position: "relative", overflow: "hidden" }}>
      {/* 3D perspective depth glow */}
      <div style={{
        position: "absolute", top: "30%", left: "-8%",
        width: "500px", height: "700px",
        background: "radial-gradient(ellipse, rgba(58,112,104,0.06) 0%, transparent 65%)",
        transform: `translate(${mouse.x * 16}px, ${-mouse.y * 16}px)`,
        transition: "transform 0.14s linear", pointerEvents: "none",
      }} />

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 2rem" }}>
        <div ref={ref} style={{ perspective: "1400px" }}>
          {/* Header */}
          <div className="r3d" style={{ marginBottom: "5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "1.25rem" }}>
              <span className="sec-label">02 / Experience</span>
              <div className="divider" />
            </div>
            <h2 style={{ fontFamily: "var(--app-font-serif)", fontSize: "clamp(2.8rem,6vw,5rem)", fontWeight: 400, color: "var(--carbon)", letterSpacing: "-0.03em", lineHeight: 1.06 }}>
              Where I've<br /><em style={{ color: "var(--fawn)" }}>Worked</em>
            </h2>
          </div>

          {/* Cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "var(--border-dim)" }}>
            {exp.map((e, i) => {
              const tc = e.accent === "teal" ? "var(--teal)" : "var(--fawn-dark)";
              const tp = e.accent === "teal" ? "var(--teal-pale)" : "var(--fawn)";
              return (
                <Tilt3DCard key={i} className="r3d" intensity={6} glare style={{ background: "var(--bg-3)", cursor: "none", transitionDelay: `${i * 0.1}s` }}>
                  <div style={{ padding: "2.75rem 2.5rem", position: "relative" }}>
                    {/* Left accent bar */}
                    <div style={{ position: "absolute", left: 0, top: "2rem", bottom: "2rem", width: "2px", background: `linear-gradient(to bottom, ${tc}, transparent)` }} />

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
                      <div>
                        <div style={{ display: "flex", gap: "0.6rem", alignItems: "center", marginBottom: "0.55rem", flexWrap: "wrap" }}>
                          <span style={{ fontFamily: "var(--app-font-mono)", fontSize: "0.52rem", letterSpacing: "0.15em", color: tc, border: `1px solid ${tc}30`, padding: "0.15rem 0.55rem", borderRadius: "100px", textTransform: "uppercase" }}>{e.type}</span>
                          <span style={{ fontFamily: "var(--app-font-mono)", fontSize: "0.52rem", letterSpacing: "0.1em", color: "var(--iron-dim)" }}>{e.period}</span>
                        </div>
                        <h3 style={{ fontFamily: "var(--app-font-serif)", fontSize: "clamp(1.3rem,2.5vw,1.8rem)", fontWeight: 400, color: "var(--carbon)", letterSpacing: "-0.01em", marginBottom: "0.2rem" }}>{e.role}</h3>
                        <p style={{ fontFamily: "var(--app-font-sans)", fontSize: "0.82rem", color: "var(--iron)", fontWeight: 300 }}>{e.co} · {e.loc}</p>
                      </div>
                    </div>

                    <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "0.6rem", marginBottom: "1.5rem" }}>
                      {e.bullets.map((b, j) => (
                        <li key={j} style={{ display: "flex", gap: "0.8rem", fontSize: "0.83rem", color: "var(--iron)", lineHeight: 1.75, fontFamily: "var(--app-font-sans)", fontWeight: 300 }}>
                          <span style={{ color: tc, flexShrink: 0 }}>—</span>{b}
                        </li>
                      ))}
                    </ul>

                    <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
                      {e.tags.map(t => <span key={t} className="tag">{t}</span>)}
                    </div>
                  </div>
                </Tilt3DCard>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
