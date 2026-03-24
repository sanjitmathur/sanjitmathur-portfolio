import { useRevealChildren } from "../components/useReveal";
import Tilt3DCard from "../components/Tilt3DCard";
import { useMouse3D } from "../components/Mouse3DContext";

const stats = [
  { value: "3+",   label: "Internships", accent: "fawn" },
  { value: "500+", label: "Students Reached", accent: "teal" },
  { value: "88%",  label: "ML Model Accuracy", accent: "fawn" },
  { value: "2",    label: "Science Fair Awards", accent: "teal" },
];

const skillGroups = [
  {
    title: "AI & Machine Learning",
    icon: "◈",
    accent: "teal",
    skills: ["Python", "TensorFlow", "scikit-learn", "OpenAI API", "LLM Fine-Tuning", "Prompt Engineering", "Signal Processing", "Computer Vision"],
  },
  {
    title: "Full-Stack Engineering",
    icon: "◇",
    accent: "fawn",
    skills: ["TypeScript", "React", "Next.js", "Node.js", "FastAPI", "PostgreSQL", "REST APIs", "WebSockets"],
  },
  {
    title: "Infrastructure & DevOps",
    icon: "◆",
    accent: "teal",
    skills: ["Kubernetes", "Docker", "Linux", "CI/CD", "Git", "Microservices"],
  },
  {
    title: "Embedded & Hardware",
    icon: "◉",
    accent: "fawn",
    skills: ["Raspberry Pi", "Arduino", "ROS", "ArduPilot", "BLE", "Sensor Fusion"],
  },
];

export default function Skills() {
  const containerRef = useRevealChildren(0.07);
  const mouse = useMouse3D();

  return (
    <section id="skills" style={{ padding: "8rem 0", position: "relative", background: "var(--carbon-2)" }}>
      {/* Teal ambient — center */}
      <div style={{
        position: "absolute", top: "20%", left: "50%",
        width: "600px", height: "500px",
        transform: `translateX(-50%) translate(${mouse.x * 8}px, ${-mouse.y * 8}px)`,
        background: "radial-gradient(ellipse, rgba(58,112,104,0.05) 0%, transparent 65%)",
        pointerEvents: "none",
        transition: "transform 0.15s linear",
      }} />

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 2rem" }}>
        <div ref={containerRef}>
          {/* Header */}
          <div className="reveal-up" style={{ marginBottom: "4.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "1.25rem" }}>
              <span className="section-label">04 / Skills</span>
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
              What I<br />
              <em style={{ color: "var(--fawn)" }}>Work With</em>
            </h2>
          </div>

          {/* Stat row */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "1px",
            background: "rgba(74,63,56,0.15)",
            marginBottom: "4rem",
          }}>
            {stats.map((stat, i) => {
              const isTeal = stat.accent === "teal";
              const color  = isTeal ? "var(--teal-pale)" : "var(--fawn)";
              const glow   = isTeal ? "rgba(58,112,104,0.06)" : "rgba(196,168,130,0.05)";
              return (
                <Tilt3DCard
                  key={i}
                  className="reveal-scale"
                  intensity={7}
                  glare
                  style={{
                    background: "var(--carbon)",
                    cursor: "none",
                    transitionDelay: `${i * 0.07}s`,
                  }}
                >
                  <div
                    style={{ padding: "2.2rem 1.75rem", textAlign: "center" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = glow; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                  >
                    <div style={{
                      fontFamily: "var(--app-font-serif)",
                      fontSize: "clamp(2.2rem, 5vw, 3.2rem)",
                      fontWeight: 400,
                      color: color,
                      letterSpacing: "-0.04em",
                      lineHeight: 1,
                      marginBottom: "0.45rem",
                    }}>
                      {stat.value}
                    </div>
                    <div style={{
                      fontFamily: "var(--app-font-mono)",
                      fontSize: "0.56rem",
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: "var(--iron)",
                    }}>
                      {stat.label}
                    </div>
                  </div>
                </Tilt3DCard>
              );
            })}
          </div>

          {/* Skill groups */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 440px), 1fr))",
            gap: "1px",
            background: "rgba(74,63,56,0.15)",
          }}>
            {skillGroups.map((group, i) => {
              const isTeal  = group.accent === "teal";
              const accentC = isTeal ? "var(--teal)" : "var(--fawn)";
              const accentP = isTeal ? "var(--teal-pale)" : "var(--oak)";
              return (
                <Tilt3DCard
                  key={i}
                  className="reveal-up"
                  intensity={6}
                  glare
                  style={{
                    background: "var(--carbon-2)",
                    cursor: "none",
                    transitionDelay: `${i * 0.08}s`,
                  }}
                >
                  <div style={{ padding: "2.25rem 2rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
                      <span style={{ fontSize: "0.9rem", color: accentC }}>{group.icon}</span>
                      <h3 style={{
                        fontFamily: "var(--app-font-sans)",
                        fontSize: "0.82rem",
                        fontWeight: 500,
                        letterSpacing: "0.04em",
                        color: "var(--ivory-dim)",
                      }}>
                        {group.title}
                      </h3>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                      {group.skills.map((skill) => (
                        <span
                          key={skill}
                          className="tag-pill"
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = isTeal ? "rgba(58,112,104,0.08)" : "rgba(196,168,130,0.06)";
                            e.currentTarget.style.borderColor = accentC;
                            e.currentTarget.style.color = accentP;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "transparent";
                            e.currentTarget.style.borderColor = "rgba(107,96,89,0.28)";
                            e.currentTarget.style.color = "var(--iron)";
                          }}
                        >
                          {skill}
                        </span>
                      ))}
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
