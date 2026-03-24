import { useRevealChildren } from "../components/useReveal";
import Tilt3DCard from "../components/Tilt3DCard";
import { useMouse3D } from "../components/Mouse3DContext";
import { useState } from "react";

const skillGroups = [
  { category: "Languages", skills: ["Python", "TypeScript", "C", "SQL"], icon: "{ }" },
  { category: "Backend", skills: ["Node.js", "Express.js", "REST APIs"], icon: "⚡" },
  { category: "Frontend", skills: ["React", "Next.js", "Vite"], icon: "◈" },
  { category: "Infrastructure", skills: ["Docker", "Kubernetes", "PostgreSQL"], icon: "⬡" },
  { category: "AI / ML", skills: ["LLM APIs", "RAG", "Prompt Eng.", "OpenCV", "scikit-learn", "Pandas", "NumPy"], icon: "◎" },
];

const stats = [
  { num: "3+", label: "Industry Internships" },
  { num: "5+", label: "Full-Stack Projects" },
  { num: "88%", label: "ML Model Accuracy" },
  { num: "500+", label: "Students Reached" },
];

function StatCard({ stat, index }: { stat: typeof stats[0]; index: number }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Tilt3DCard
      key={index}
      intensity={8}
      style={{
        textAlign: "center",
        padding: "2rem 1.25rem",
        borderRight: index < stats.length - 1 ? "1px solid rgba(196,168,130,0.08)" : "none",
        cursor: "none",
        background: hovered ? "rgba(196,168,130,0.03)" : "transparent",
        transition: "background 0.3s ease",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{
        fontFamily: "'Playfair Display', serif",
        fontWeight: 600,
        fontSize: "clamp(2.2rem, 4vw, 3.5rem)",
        color: hovered ? "#f0ebe3" : "var(--fawn)",
        lineHeight: 1,
        letterSpacing: "-0.03em",
        transform: hovered ? "translateZ(10px) translateY(-3px)" : "translateZ(0)",
        transition: "all 0.4s cubic-bezier(0.25,0.46,0.45,0.94)",
      }}>
        {stat.num}
      </div>
      <div style={{
        fontFamily: "'Space Grotesk', sans-serif",
        fontSize: "0.72rem",
        color: "rgba(240,235,227,0.35)",
        marginTop: "0.4rem",
        letterSpacing: "0.04em",
        fontWeight: 300,
      }}>
        {stat.label}
      </div>
    </Tilt3DCard>
  );
}

export default function Skills() {
  const containerRef = useRevealChildren(0.05);
  const mouse = useMouse3D();

  return (
    <section id="skills" style={{ padding: "8rem 0", position: "relative" }}>
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(180deg, transparent, rgba(61,107,104,0.03) 50%, transparent)",
        pointerEvents: "none",
      }} />

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 2rem" }}>
        <div ref={containerRef}>
          {/* Header */}
          <div className="reveal-up" style={{ marginBottom: "4rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "1rem" }}>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.63rem", letterSpacing: "0.25em", color: "rgba(196,168,130,0.5)", textTransform: "uppercase" }}>
                04 / Skills
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
              Stack &<br /><em style={{ color: "var(--fawn)" }}>Expertise</em>
            </h2>
          </div>

          {/* Stats — 3D tilt row */}
          <div className="reveal-up" style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
            border: "1px solid rgba(196,168,130,0.1)",
            marginBottom: "4rem",
            perspective: "800px",
          }}>
            {stats.map((s, i) => (
              <StatCard key={i} stat={s} index={i} />
            ))}
          </div>

          {/* Skills grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
            gap: "1px",
            border: "1px solid rgba(196,168,130,0.08)",
            perspective: "800px",
            marginBottom: "4rem",
          }}>
            {skillGroups.map((group, i) => (
              <Tilt3DCard
                key={i}
                className="reveal-scale"
                intensity={7}
                glare
                style={{
                  padding: "2rem",
                  borderRight: "1px solid rgba(196,168,130,0.06)",
                  borderBottom: "1px solid rgba(196,168,130,0.06)",
                  cursor: "none",
                  transitionDelay: `${i * 0.06}s`,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "1rem", color: "rgba(196,168,130,0.3)" }}>
                    {group.icon}
                  </span>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.2em", color: "rgba(196,168,130,0.5)", textTransform: "uppercase" }}>
                    {group.category}
                  </span>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                  {group.skills.map((skill) => (
                    <span key={skill} className="tag-pill">{skill}</span>
                  ))}
                </div>
              </Tilt3DCard>
            ))}
          </div>

          {/* Education card */}
          <Tilt3DCard
            className="reveal-up"
            intensity={5}
            glare
            style={{
              border: "1px solid rgba(196,168,130,0.1)",
              position: "relative",
              overflow: "hidden",
              cursor: "none",
            }}
          >
            <div style={{ padding: "2.5rem" }}>
              <div style={{
                position: "absolute", top: 0, left: 0, width: "3px", height: "100%",
                background: "linear-gradient(to bottom, var(--fawn), transparent)",
              }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
                <div>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.2em", color: "rgba(196,168,130,0.5)", textTransform: "uppercase", marginBottom: "0.5rem" }}>
                    Education
                  </div>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.45rem", fontWeight: 400, color: "#f0ebe3", marginBottom: "0.3rem" }}>
                    University of Wollongong in Dubai
                  </h3>
                  <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.88rem", color: "rgba(240,235,227,0.4)", fontWeight: 300 }}>
                    Computer and Autonomous Systems Engineering
                  </p>
                </div>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.62rem", color: "rgba(196,168,130,0.4)", letterSpacing: "0.08em", padding: "0.3rem 0.9rem", border: "1px solid rgba(196,168,130,0.18)", borderRadius: "100px" }}>
                  Expected 2027
                </span>
              </div>
            </div>
          </Tilt3DCard>
        </div>
      </div>
    </section>
  );
}
