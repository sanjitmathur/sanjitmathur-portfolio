import { useRef, useState } from "react";
import { useRevealChildren } from "../components/useReveal";

const projects = [
  {
    num: "01",
    name: "ExamForge",
    desc: "Full-stack AI-powered exam generation platform using LLM APIs for dynamic multi-format question creation. Interactive workflows for generating, attempting, and reviewing customized assessments.",
    tags: ["LLM APIs", "React", "Node.js", "Full-Stack"],
    links: { github: "https://github.com/sanjitmathur", live: "#" },
    status: "Live",
  },
  {
    num: "02",
    name: "F1 Simulation Dashboard",
    desc: "Full-stack race simulation engine modeling tire degradation, pit strategy, safety cars, weather, and overtaking across all 24 2026 GPs using Monte Carlo probability methods. Dual-mode interface for season-wide and custom race simulations.",
    tags: ["Python", "Monte Carlo", "React", "Simulation"],
    links: { github: "https://github.com/sanjitmathur" },
    status: "Open Source",
  },
  {
    num: "03",
    name: "Orvyn ExoArm",
    desc: "Microcontroller-based rehabilitation exoskeleton interpreting sEMG signals to assist finger movement. Signal classification pipeline targeting 90%+ accuracy, differentiating intended finger movements from noise for real-time servo actuation.",
    tags: ["sEMG", "Signal Processing", "Embedded Systems", "ML"],
    links: {},
    status: "In Progress · May 2026",
  },
  {
    num: "04",
    name: "MedAir Delivery Aircraft",
    desc: "Hybrid autonomous aircraft for emergency medical delivery with embedded flight control logic and mission-based transition systems. Awarded Platinum and Gold at Dubai University Innovation Fair.",
    tags: ["Autonomous Systems", "Flight Control", "Embedded"],
    links: {},
    status: "Awarded",
    award: true,
  },
  {
    num: "05",
    name: "Spotify Song Analyzer",
    desc: "Data pipeline extracting and analyzing audio features (tempo, energy, danceability) using Python. Identified key correlations in music attributes through exploratory analysis and feature engineering.",
    tags: ["Python", "Pandas", "Data Analysis", "EDA"],
    links: { github: "https://github.com/sanjitmathur" },
    status: "Open Source",
  },
];

function ProjectCard({ project, index }: { project: typeof projects[0]; index: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="reveal-up glow"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        border: "1px solid rgba(196,168,130,0.1)",
        padding: "2.25rem",
        position: "relative",
        transition: "all 0.4s cubic-bezier(0.25,0.46,0.45,0.94)",
        background: hovered ? "rgba(196,168,130,0.03)" : "transparent",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        transitionDelay: `${index * 0.05}s`,
        overflow: "hidden",
      }}
    >
      {/* Accent line top */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "1px",
        background: `linear-gradient(to right, var(--fawn), transparent)`,
        transform: `scaleX(${hovered ? 1 : 0})`,
        transformOrigin: "left",
        transition: "transform 0.5s cubic-bezier(0.25,0.46,0.45,0.94)",
      }} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.25rem" }}>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.6rem", color: "rgba(196,168,130,0.35)", letterSpacing: "0.15em" }}>
          {project.num}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          {project.award && (
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.58rem", color: "#c9a227", letterSpacing: "0.1em", padding: "0.15rem 0.5rem", border: "1px solid rgba(201,162,39,0.3)", borderRadius: "100px" }}>
              ★ Award
            </span>
          )}
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.58rem", color: "rgba(196,168,130,0.4)", letterSpacing: "0.08em" }}>
            {project.status}
          </span>
        </div>
      </div>

      <h3 style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: "clamp(1.25rem, 2.5vw, 1.65rem)",
        fontWeight: 400,
        color: "#f0ebe3",
        marginBottom: "0.9rem",
        letterSpacing: "-0.01em",
        transition: "color 0.3s",
      }}>
        {project.name}
      </h3>

      <p style={{
        fontFamily: "'Space Grotesk', sans-serif",
        fontSize: "0.85rem",
        color: "rgba(240,235,227,0.45)",
        lineHeight: 1.7,
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
        <div style={{ display: "flex", gap: "0.75rem", marginLeft: "1rem", flexShrink: 0 }}>
          {project.links.github && (
            <a href={project.links.github} target="_blank" rel="noopener noreferrer" className="clickable link-underline" style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.65rem", color: "rgba(196,168,130,0.5)", letterSpacing: "0.08em" }}>
              GitHub ↗
            </a>
          )}
          {project.links.live && (
            <a href={project.links.live} target="_blank" rel="noopener noreferrer" className="clickable link-underline" style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.65rem", color: "var(--fawn)", letterSpacing: "0.08em" }}>
              Live ↗
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Projects() {
  const containerRef = useRevealChildren(0.05);

  return (
    <section id="projects" style={{ padding: "8rem 0", position: "relative" }}>
      {/* Background glow */}
      <div style={{
        position: "absolute", top: "20%", right: "-10%", width: "600px", height: "600px",
        background: "radial-gradient(ellipse, rgba(61,107,104,0.06) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 2rem" }}>
        <div ref={containerRef}>
          {/* Header */}
          <div className="reveal-up" style={{ marginBottom: "4rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "1rem" }}>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.25em", color: "rgba(196,168,130,0.5)", textTransform: "uppercase" }}>
                03 / Projects
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
              Selected<br /><em style={{ color: "var(--fawn)" }}>Work</em>
            </h2>
          </div>

          {/* Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 480px), 1fr))", gap: "1.5px", border: "1px solid rgba(196,168,130,0.1)" }}>
            {projects.map((p, i) => (
              <ProjectCard key={i} project={p} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
