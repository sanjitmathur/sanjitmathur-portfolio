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
      {/* Ambient left glow */}
      <div style={{
        position: "absolute", top: "30%", left: "-10%",
        width: "400px", height: "600px",
        background: "radial-gradient(ellipse, rgba(196,168,130,0.04) 0%, transparent 70%)",
        pointerEvents: "none",
        transform: `translate(${mouse.x * 15}px, ${-mouse.y * 15}px)`,
        transition: "transform 0.12s linear",
      }} />

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 2rem" }}>
        <div ref={containerRef}>
          {/* Header */}
          <div className="reveal-up" style={{ marginBottom: "5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "1rem" }}>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.63rem", letterSpacing: "0.25em", color: "rgba(196,168,130,0.5)", textTransform: "uppercase" }}>
                02 / Experience
              </span>
              <div style={{ flex: 1, height: "1px", background: "rgba(196,168,130,0.12)" }} />
            </div>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
              fontWeight: 400,
              color: "#f0ebe3",
              letterSpacing: "-0.025em",
              lineHeight: 1.08,
            }}>
              Where I've<br />
              <em style={{ color: "var(--fawn)" }}>Worked</em>
            </h2>
          </div>

          {/* Experience cards with 3D tilt */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5px", border: "1px solid rgba(196,168,130,0.08)", perspective: "1000px" }}>
            {experiences.map((exp, i) => (
              <Tilt3DCard
                key={i}
                className="reveal-up"
                intensity={6}
                glare
                style={{
                  borderBottom: i < experiences.length - 1 ? "1px solid rgba(196,168,130,0.08)" : "none",
                  transitionDelay: `${i * 0.1}s`,
                  cursor: "none",
                }}
              >
                <div style={{ padding: "2.5rem 2.25rem", position: "relative" }}>
                  {/* Left accent */}
                  <div style={{
                    position: "absolute", left: 0, top: 0, bottom: 0, width: "2px",
                    background: "linear-gradient(to bottom, var(--fawn), transparent)",
                    opacity: 0,
                    transition: "opacity 0.4s ease",
                  }}
                    className="exp-accent"
                  />

                  <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "1rem", alignItems: "start", marginBottom: "1.5rem" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.7rem", marginBottom: "0.5rem", flexWrap: "wrap" }}>
                        <span style={{
                          fontFamily: "'Space Mono', monospace", fontSize: "0.58rem",
                          letterSpacing: "0.15em", color: "var(--fawn)", textTransform: "uppercase",
                          padding: "0.18rem 0.6rem", border: "1px solid rgba(196,168,130,0.2)", borderRadius: "100px",
                        }}>
                          {exp.type}
                        </span>
                        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.58rem", color: "rgba(196,168,130,0.35)", letterSpacing: "0.1em" }}>
                          {exp.period}
                        </span>
                      </div>
                      <h3 style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: "clamp(1.2rem, 2.5vw, 1.7rem)",
                        fontWeight: 400,
                        color: "#f0ebe3",
                        marginBottom: "0.2rem",
                        letterSpacing: "-0.01em",
                      }}>
                        {exp.role}
                      </h3>
                      <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.85rem", color: "rgba(240,235,227,0.38)", fontWeight: 300 }}>
                        {exp.company} · {exp.location}
                      </p>
                    </div>
                    {exp.link && (
                      <a href={exp.link} target="_blank" rel="noopener noreferrer" className="clickable link-underline" style={{ color: "rgba(196,168,130,0.45)", fontSize: "0.68rem", fontFamily: "'Space Mono', monospace", whiteSpace: "nowrap" }}>
                        View ↗
                      </a>
                    )}
                  </div>

                  <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "0.65rem", marginBottom: "1.5rem" }}>
                    {exp.highlights.map((h, j) => (
                      <li key={j} style={{ display: "flex", gap: "0.8rem", fontSize: "0.85rem", color: "rgba(240,235,227,0.45)", lineHeight: 1.7, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 300 }}>
                        <span style={{ color: "var(--fawn)", opacity: 0.45, flexShrink: 0, marginTop: "0.05rem" }}>—</span>
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
