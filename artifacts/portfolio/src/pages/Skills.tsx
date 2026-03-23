import { useRevealChildren } from "../components/useReveal";

const skillGroups = [
  {
    category: "Languages",
    skills: ["Python", "TypeScript", "C", "SQL"],
    icon: "{ }",
  },
  {
    category: "Backend",
    skills: ["Node.js", "Express.js", "REST APIs"],
    icon: "⚡",
  },
  {
    category: "Frontend",
    skills: ["React", "Next.js", "Vite"],
    icon: "◈",
  },
  {
    category: "Infrastructure",
    skills: ["Docker", "Kubernetes", "PostgreSQL"],
    icon: "⬡",
  },
  {
    category: "AI / ML",
    skills: ["LLM APIs", "RAG", "Prompt Engineering", "OpenCV", "scikit-learn", "Pandas", "NumPy", "Matplotlib"],
    icon: "◎",
  },
];

const stats = [
  { num: "3+", label: "Industry Internships" },
  { num: "5+", label: "Full-Stack Projects" },
  { num: "88%", label: "ML Model Accuracy" },
  { num: "500+", label: "Students Reached" },
];

export default function Skills() {
  const containerRef = useRevealChildren(0.05);

  return (
    <section id="skills" style={{ padding: "8rem 0", position: "relative" }}>
      {/* Subtle bg */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        background: "linear-gradient(180deg, transparent 0%, rgba(61,107,104,0.025) 50%, transparent 100%)",
        pointerEvents: "none",
      }} />

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 2rem" }}>
        <div ref={containerRef}>
          {/* Header */}
          <div className="reveal-up" style={{ marginBottom: "4rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "1rem" }}>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.25em", color: "rgba(196,168,130,0.5)", textTransform: "uppercase" }}>
                04 / Skills
              </span>
              <div style={{ flex: 1, height: "1px", background: "rgba(196,168,130,0.12)" }} />
            </div>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
              fontWeight: 400,
              color: "#f0ebe3",
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
            }}>
              Stack &<br /><em style={{ color: "var(--fawn)" }}>Expertise</em>
            </h2>
          </div>

          {/* Stats row */}
          <div className="reveal-up" style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: "0",
            border: "1px solid rgba(196,168,130,0.1)",
            marginBottom: "4rem",
          }}>
            {stats.map((s, i) => (
              <div key={i} style={{
                padding: "2rem 1.5rem",
                borderRight: i < stats.length - 1 ? "1px solid rgba(196,168,130,0.1)" : "none",
                textAlign: "center",
              }}>
                <div className="stat-number">{s.num}</div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.75rem", color: "rgba(240,235,227,0.4)", marginTop: "0.4rem", letterSpacing: "0.04em", fontWeight: 300 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* Skill groups */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))", gap: "1.5px", border: "1px solid rgba(196,168,130,0.1)" }}>
            {skillGroups.map((group, i) => (
              <div
                key={i}
                className="reveal-scale"
                style={{
                  padding: "2rem",
                  borderBottom: "1px solid rgba(196,168,130,0.06)",
                  borderRight: "1px solid rgba(196,168,130,0.06)",
                  position: "relative",
                  transition: "background 0.3s ease",
                  background: "transparent",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(196,168,130,0.03)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "1rem", color: "rgba(196,168,130,0.3)" }}>
                    {group.icon}
                  </span>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.2em", color: "rgba(196,168,130,0.5)", textTransform: "uppercase" }}>
                    {group.category}
                  </span>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                  {group.skills.map((skill) => (
                    <span key={skill} className="tag-pill">{skill}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Education */}
          <div className="reveal-up" style={{ marginTop: "4rem", padding: "2.5rem", border: "1px solid rgba(196,168,130,0.1)", position: "relative", overflow: "hidden" }}>
            <div style={{
              position: "absolute", top: 0, left: 0, width: "3px", height: "100%",
              background: "linear-gradient(to bottom, var(--fawn), transparent)",
            }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
              <div>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.2em", color: "rgba(196,168,130,0.5)", textTransform: "uppercase", marginBottom: "0.5rem" }}>
                  Education
                </div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", fontWeight: 400, color: "#f0ebe3", marginBottom: "0.3rem" }}>
                  University of Wollongong in Dubai
                </h3>
                <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.88rem", color: "rgba(240,235,227,0.45)", fontWeight: 300 }}>
                  Computer and Autonomous Systems Engineering
                </p>
              </div>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.65rem", color: "rgba(196,168,130,0.4)", letterSpacing: "0.08em", padding: "0.3rem 0.9rem", border: "1px solid rgba(196,168,130,0.2)", borderRadius: "100px" }}>
                Expected 2027
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
