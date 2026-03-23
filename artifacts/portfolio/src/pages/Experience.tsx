import { useRevealChildren } from "../components/useReveal";

const experiences = [
  {
    role: "AI Engineering Intern",
    company: "Baraka Financial Ltd.",
    location: "Dubai",
    period: "Feb 2026 – Present",
    type: "FinTech",
    highlights: [
      "Deployed containerized services to Kubernetes; built AI-powered internal tooling that automated error classification and log analysis, eliminating manual triage across support workflows.",
      "Built Position Search and Trading Account Monitor modules integrating OMS, Instruments, and Wallet microservices, reducing manual portfolio lookup time for operations teams.",
      "Unified inconsistent data schemas across distributed services into a single portfolio state model, eliminating data discrepancies in cross-market account views.",
    ],
    tags: ["Kubernetes", "Docker", "LLM APIs", "Python", "TypeScript"],
  },
  {
    role: "Digital Intern",
    company: "IndiGo — InterGlobe Aviation",
    location: "Gurgaon",
    period: "Aug 2025 – Sep 2025",
    type: "Aviation",
    link: "https://github.com/sanjitmathur",
    highlights: [
      "Built a Logistic Regression model to predict on-time arrival performance on the DEL–BOM sector using 1,000 flight records and 6 engineered features, achieving 88% accuracy.",
      "Engineered features from raw operational data including one-hot encoding of 3 aircraft types (A320, A320neo, A321neo), computed block-hour overrun from scheduled vs. actual hours.",
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

  return (
    <section id="experience" style={{ padding: "8rem 0", position: "relative" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 2rem" }}>
        <div ref={containerRef}>
          {/* Header */}
          <div className="reveal-up" style={{ marginBottom: "5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "1rem" }}>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.25em", color: "rgba(196,168,130,0.5)", textTransform: "uppercase" }}>
                02 / Experience
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
              Where I've<br /><em style={{ color: "var(--fawn)" }}>Worked</em>
            </h2>
          </div>

          {/* Timeline */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            {experiences.map((exp, i) => (
              <div
                key={i}
                className="reveal-up work-item"
                style={{ paddingTop: "2.5rem", paddingBottom: "2.5rem", paddingRight: "1rem", transition: "all 0.4s cubic-bezier(0.25,0.46,0.45,0.94)" }}
              >
                <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "1rem", alignItems: "start", marginBottom: "1.25rem" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.4rem", flexWrap: "wrap" }}>
                      <span style={{
                        fontFamily: "'Space Mono', monospace", fontSize: "0.6rem",
                        letterSpacing: "0.15em", color: "var(--fawn)", textTransform: "uppercase",
                        padding: "0.2rem 0.6rem", border: "1px solid rgba(196,168,130,0.25)", borderRadius: "100px",
                      }}>
                        {exp.type}
                      </span>
                      <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.6rem", color: "rgba(196,168,130,0.4)", letterSpacing: "0.1em" }}>
                        {exp.period}
                      </span>
                    </div>
                    <h3 style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "clamp(1.2rem, 3vw, 1.75rem)",
                      fontWeight: 400,
                      color: "#f0ebe3",
                      marginBottom: "0.25rem",
                    }}>
                      {exp.role}
                    </h3>
                    <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.9rem", color: "rgba(240,235,227,0.45)", fontWeight: 300 }}>
                      {exp.company} · {exp.location}
                    </p>
                  </div>
                  {exp.link && (
                    <a href={exp.link} target="_blank" rel="noopener noreferrer" className="clickable link-underline" style={{ color: "rgba(196,168,130,0.5)", fontSize: "0.75rem", fontFamily: "'Space Mono', monospace", whiteSpace: "nowrap" }}>
                      View ↗
                    </a>
                  )}
                </div>

                <ul style={{ paddingLeft: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "0.6rem", marginBottom: "1.25rem" }}>
                  {exp.highlights.map((h, j) => (
                    <li key={j} style={{ display: "flex", gap: "0.75rem", fontSize: "0.88rem", color: "rgba(240,235,227,0.5)", lineHeight: 1.65, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 300 }}>
                      <span style={{ color: "var(--fawn)", opacity: 0.5, flexShrink: 0, marginTop: "0.05rem" }}>—</span>
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
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
