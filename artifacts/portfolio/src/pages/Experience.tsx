import { useRevealChildren } from "../components/useReveal";
import Tilt3DCard from "../components/Tilt3DCard";
import { useMouse3D } from "../components/Mouse3DContext";

const experiences = [
  {
    role: "AI Engineering Intern",
    company: "Baraka Financial Ltd.",
    location: "Dubai",
    period: "Feb 2026 – Present",
    type: "FinTech · AI",
    highlights: [
      "Deployed containerized services to Kubernetes; built AI-powered internal tooling that automated error classification and log analysis, eliminating manual triage across support workflows.",
      "Built Position Search and Trading Account Monitor modules integrating OMS, Instruments, and Wallet microservices, reducing manual portfolio lookup time for operations teams.",
      "Unified inconsistent data schemas across distributed services into a single portfolio state model.",
    ],
    tags: ["Kubernetes", "Docker", "LLM APIs", "Python", "TypeScript"],
  },
  {
    role: "Digital Intern",
    company: "IndiGo — InterGlobe Aviation",
    location: "Gurgaon",
    period: "Aug 2025 – Sep 2025",
    type: "Aviation · ML",
    link: "https://github.com/sanjitmathur",
    highlights: [
      "Built a Logistic Regression model to predict on-time arrival on DEL–BOM using 1,000 flight records and 6 engineered features, achieving 88% accuracy with balanced precision/recall.",
      "Engineered features from raw operational data including one-hot encoding of aircraft types (A320, A320neo, A321neo) and block-hour overrun computation.",
    ],
    tags: ["Python", "scikit-learn", "ML", "Pandas", "Feature Engineering"],
  },
  {
    role: "Software Engineering Intern",
    company: "Lab of Future",
    location: "Dubai",
    period: "Jun 2025 – Aug 2025",
    type: "EdTech",
    highlights: [
      "Built internal educational software used by 500+ students across 4 campuses.",
    ],
    tags: ["React", "Node.js", "Full-Stack"],
  },
];

export default function Experience() {
  const containerRef = useRevealChildren(0.05);
  const mouse = useMouse3D();

  return (
    <section id="experience" style={{ padding: "8rem 0", position: "relative" }}>
      {/* Teal ambient glow — left */}
      <div style={{
        position: "absolute", top: "25%", left: "-12%",
        width: "380px", height: "600px",
        background: "radial-gradient(ellipse, rgba(58,112,104,0.05) 0%, transparent 70%)",
        pointerEvents: "none",
        transform: `translate(${mouse.x * 14}px, ${-mouse.y * 14}px)`,
        transition: "transform 0.12s linear",
      }} />

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 2rem" }}>
        <div ref={containerRef}>
          {/* Header */}
          <div className="reveal-up" style={{ marginBottom: "5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "1.25rem" }}>
              <span className="section-label">02 / Experience</span>
              <div className="divider" />
            </div>
            <h2 style={{
              fontFamily: "var(--app-font-serif)",
              fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
              fontWeight: 400,
              color: "var(--ivory)",
              letterSpacing: "-0.025em",
              lineHeight: 1.08,
            }}>
              Where I've<br />
              <em style={{ color: "var(--fawn)" }}>Worked</em>
            </h2>
          </div>

          {/* Cards */}
          <div style={{ perspective: "1000px", display: "flex", flexDirection: "column", gap: "1px", border: "1px solid rgba(74,63,56,0.22)" }}>
            {experiences.map((exp, i) => (
              <Tilt3DCard
                key={i}
                className="reveal-up"
                intensity={5}
                glare
                style={{
                  borderBottom: i < experiences.length - 1 ? "1px solid rgba(74,63,56,0.2)" : "none",
                  transitionDelay: `${i * 0.09}s`,
                  cursor: "none",
                  background: "var(--carbon-2)",
                }}
              >
                <div style={{ padding: "2.5rem 2.25rem", position: "relative" }}>
                  {/* Left accent — teal → fawn gradient */}
                  <div style={{
                    position: "absolute", left: 0, top: "2rem", bottom: "2rem", width: "2px",
                    background: "linear-gradient(to bottom, var(--teal), var(--fawn))",
                    opacity: 0.6,
                  }} />

                  <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "1rem", alignItems: "start", marginBottom: "1.5rem" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", marginBottom: "0.55rem", flexWrap: "wrap" }}>
                        {/* Teal type badge */}
                        <span className="type-badge">{exp.type}</span>
                        <span style={{ fontFamily: "var(--app-font-mono)", fontSize: "0.56rem", color: "var(--iron)", letterSpacing: "0.1em" }}>
                          {exp.period}
                        </span>
                      </div>
                      <h3 style={{
                        fontFamily: "var(--app-font-serif)",
                        fontSize: "clamp(1.2rem, 2.5vw, 1.7rem)",
                        fontWeight: 400,
                        color: "var(--ivory)",
                        marginBottom: "0.25rem",
                        letterSpacing: "-0.01em",
                      }}>
                        {exp.role}
                      </h3>
                      <p style={{ fontFamily: "var(--app-font-sans)", fontSize: "0.84rem", color: "var(--iron)", fontWeight: 300 }}>
                        {exp.company} · {exp.location}
                      </p>
                    </div>
                    {exp.link && (
                      <a href={exp.link} target="_blank" rel="noopener noreferrer" className="clickable link-underline" style={{ color: "var(--teal-pale)", fontSize: "0.65rem", fontFamily: "var(--app-font-mono)", whiteSpace: "nowrap" }}>
                        View ↗
                      </a>
                    )}
                  </div>

                  <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "0.65rem", marginBottom: "1.5rem" }}>
                    {exp.highlights.map((h, j) => (
                      <li key={j} style={{ display: "flex", gap: "0.8rem", fontSize: "0.84rem", color: "var(--iron)", lineHeight: 1.72, fontFamily: "var(--app-font-sans)", fontWeight: 300 }}>
                        <span style={{ color: "var(--teal)", flexShrink: 0, marginTop: "0.06rem" }}>—</span>
                        {h}
                      </li>
                    ))}
                  </ul>

                  <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                    {exp.tags.map((t) => (
                      <span key={t} className="tag-pill">{t}</span>
                    ))}
                  </div>
                </div>
              </Tilt3DCard>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
