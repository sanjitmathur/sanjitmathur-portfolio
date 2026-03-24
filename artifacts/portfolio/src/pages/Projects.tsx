import { useState } from "react";
import { useRevealChildren } from "../components/useReveal";
import Tilt3DCard from "../components/Tilt3DCard";
import { useMouse3D } from "../components/Mouse3DContext";

const projects = [
  {
    num: "01",
    name: "ExamForge",
    desc: "Full-stack AI-powered exam generation platform using LLM APIs for dynamic multi-format question creation with interactive assessment workflows.",
    tags: ["LLM APIs", "React", "Node.js", "Full-Stack"],
    links: { github: "https://github.com/sanjitmathur", live: "#" },
    status: "Live",
    color: "rgba(196,168,130,0.08)",
  },
  {
    num: "02",
    name: "F1 Simulation Dashboard",
    desc: "Race simulation engine modeling tire degradation, pit strategy, safety cars, and overtaking across all 24 2026 GPs using Monte Carlo probability methods.",
    tags: ["Python", "Monte Carlo", "React", "Simulation"],
    links: { github: "https://github.com/sanjitmathur" },
    status: "Open Source",
    color: "rgba(61,107,104,0.06)",
  },
  {
    num: "03",
    name: "Orvyn ExoArm",
    desc: "sEMG-driven rehabilitation exoskeleton. Signal classification pipeline targeting 90%+ accuracy for real-time servo-actuated finger movement assistance.",
    tags: ["sEMG", "Embedded Systems", "ML", "Signal Processing"],
    links: {},
    status: "In Progress · 2026",
    color: "rgba(92,86,82,0.08)",
  },
  {
    num: "04",
    name: "MedAir Delivery Aircraft",
    desc: "Hybrid autonomous aircraft for emergency medical delivery with embedded flight control logic. Platinum + Gold — Dubai University Innovation Fair.",
    tags: ["Autonomous Systems", "Flight Control", "Embedded"],
    links: {},
    status: "★ Award",
    award: true,
    color: "rgba(201,162,39,0.06)",
  },
  {
    num: "05",
    name: "Spotify Song Analyzer",
    desc: "Data pipeline extracting and analyzing audio features (tempo, energy, danceability). Key correlations via exploratory analysis and feature engineering.",
    tags: ["Python", "Pandas", "Data Analysis", "EDA"],
    links: { github: "https://github.com/sanjitmathur" },
    status: "Open Source",
    color: "rgba(196,168,130,0.06)",
  },
];

function ProjectCard({ project, index }: { project: typeof projects[0]; index: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Tilt3DCard
      className="reveal-up"
      intensity={10}
      glare
      style={{
        border: "1px solid rgba(196,168,130,0.1)",
        background: hovered ? project.color : "transparent",
        transitionDelay: `${index * 0.07}s`,
        cursor: "none",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ padding: "2.25rem" }}>
        {/* Animated top border */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: "1px",
          background: "linear-gradient(to right, var(--fawn), transparent)",
          transform: `scaleX(${hovered ? 1 : 0})`,
          transformOrigin: "left",
          transition: "transform 0.5s cubic-bezier(0.25,0.46,0.45,0.94)",
        }} />

        {/* 3D floating number */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "flex-start",
          marginBottom: "1.5rem",
        }}>
          <span style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(2rem, 4vw, 3rem)",
            fontWeight: 400,
            color: "rgba(196,168,130,0.1)",
            lineHeight: 1,
            transform: hovered ? "translateZ(12px) translateY(-4px)" : "translateZ(0) translateY(0)",
            transition: "transform 0.4s cubic-bezier(0.25,0.46,0.45,0.94)",
            display: "block",
            letterSpacing: "-0.03em",
          }}>
            {project.num}
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            {project.award && (
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.58rem", color: "#c9a227", letterSpacing: "0.08em", padding: "0.15rem 0.5rem", border: "1px solid rgba(201,162,39,0.3)", borderRadius: "100px" }}>
                ★ Award
              </span>
            )}
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.58rem", color: "rgba(196,168,130,0.4)", letterSpacing: "0.06em" }}>
              {project.award ? "" : project.status}
            </span>
          </div>
        </div>

        <h3 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(1.3rem, 2.5vw, 1.7rem)",
          fontWeight: 400,
          color: hovered ? "#f0ebe3" : "rgba(240,235,227,0.85)",
          marginBottom: "0.85rem",
          letterSpacing: "-0.015em",
          transform: hovered ? "translateZ(6px)" : "translateZ(0)",
          transition: "all 0.4s cubic-bezier(0.25,0.46,0.45,0.94)",
        }}>
          {project.name}
        </h3>

        <p style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: "0.84rem",
          color: "rgba(240,235,227,0.4)",
          lineHeight: 1.75,
          fontWeight: 300,
          marginBottom: "1.5rem",
        }}>
          {project.desc}
        </p>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
            {project.tags.map((t) => (
              <span key={t} className="tag-pill">{t}</span>
            ))}
          </div>
          <div style={{ display: "flex", gap: "0.75rem", marginLeft: "0.75rem", flexShrink: 0 }}>
            {project.links.github && (
              <a href={project.links.github} target="_blank" rel="noopener noreferrer" className="clickable link-underline" style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.62rem", color: "rgba(196,168,130,0.5)", letterSpacing: "0.08em" }}>
                GitHub ↗
              </a>
            )}
            {project.links.live && project.links.live !== "#" && (
              <a href={project.links.live} target="_blank" rel="noopener noreferrer" className="clickable link-underline" style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.62rem", color: "var(--fawn)", letterSpacing: "0.08em" }}>
                Live ↗
              </a>
            )}
          </div>
        </div>
      </div>
    </Tilt3DCard>
  );
}

export default function Projects() {
  const containerRef = useRevealChildren(0.05);
  const mouse = useMouse3D();

  return (
    <section id="projects" style={{ padding: "8rem 0", position: "relative" }}>
      {/* 3D depth glow */}
      <div style={{
        position: "absolute", top: "10%", right: "-15%",
        width: "500px", height: "500px",
        background: "radial-gradient(ellipse, rgba(61,107,104,0.08) 0%, transparent 70%)",
        pointerEvents: "none",
        transform: `translate(${-mouse.x * 20}px, ${-mouse.y * 20}px)`,
        transition: "transform 0.15s linear",
      }} />

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 2rem" }}>
        <div ref={containerRef}>
          {/* Header */}
          <div className="reveal-up" style={{ marginBottom: "4rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "1rem" }}>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.63rem", letterSpacing: "0.25em", color: "rgba(196,168,130,0.5)", textTransform: "uppercase" }}>
                03 / Projects
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
              perspective: "600px",
            }}>
              Selected<br />
              <em style={{ color: "var(--fawn)" }}>Work</em>
            </h2>
          </div>

          {/* 3D Grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 460px), 1fr))",
            gap: "1px",
            border: "1px solid rgba(196,168,130,0.08)",
            perspective: "1000px",
          }}>
            {projects.map((p, i) => (
              <ProjectCard key={i} project={p} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
