import { useState } from "react";
import { useRevealChildren } from "../components/useReveal";
import Tilt3DCard from "../components/Tilt3DCard";
import { useMouse3D } from "../components/Mouse3DContext";

const projects = [
  {
    id: "01",
    name: "ExamForge",
    tagline: "AI-Powered Exam Generation Platform",
    description: "Full-stack SaaS platform that ingests any syllabus PDF and generates personalised exam papers with detailed worked solutions using LLMs. Handles schema mapping, retry logic, and streaming UI.",
    tags: ["Next.js", "TypeScript", "OpenAI", "PostgreSQL", "Tailwind"],
    link: "https://github.com/sanjitmathur",
    featured: true,
    accent: "teal",
  },
  {
    id: "02",
    name: "F1 Simulation Dashboard",
    tagline: "Live Telemetry & Race Simulation",
    description: "Real-time Formula 1 race data visualisation dashboard. Streams lap-by-lap telemetry, tyre strategy models, and DRS windows with animated track maps.",
    tags: ["React", "Python", "FastF1", "WebSockets", "D3.js"],
    link: "https://github.com/sanjitmathur",
    featured: false,
    accent: "fawn",
  },
  {
    id: "03",
    name: "Orvyn ExoArm",
    tagline: "Brain-Computer Interface Exoskeleton",
    description: "EMG-driven robotic exoskeleton arm translating muscle-signal patterns into joint actuation. Custom signal preprocessing pipeline with CNN classifier (94% accuracy on 8-class gestures).",
    tags: ["Python", "TensorFlow", "Raspberry Pi", "Arduino", "BLE"],
    link: "https://github.com/sanjitmathur",
    featured: false,
    accent: "teal",
  },
  {
    id: "04",
    name: "MedAir",
    tagline: "Platinum + Gold Award — Autonomous Medical Drone",
    description: "Autonomous drone system for last-mile medical supply delivery in remote areas. Computer vision landing, route optimisation, and real-time telemedicine link. Won Platinum and Gold at UAE science fairs.",
    tags: ["Python", "OpenCV", "ArduPilot", "ROS", "Raspberry Pi"],
    link: "https://github.com/sanjitmathur",
    featured: true,
    accent: "fawn",
  },
  {
    id: "05",
    name: "Spotify Analyzer",
    tagline: "Personal Music Intelligence Engine",
    description: "Analyses Spotify listening history to surface moods, genre drift, and listening patterns over time. NLP sentiment on lyric data, feature importance on audio features.",
    tags: ["Python", "Spotify API", "Pandas", "scikit-learn", "Streamlit"],
    link: "https://github.com/sanjitmathur",
    featured: false,
    accent: "teal",
  },
];

function ProjectCard({ project }: { project: typeof projects[0] }) {
  const [hovered, setHovered] = useState(false);
  const isTeal = project.accent === "teal";
  const accentColor = isTeal ? "var(--teal)" : "var(--fawn)";
  const accentPale  = isTeal ? "var(--teal-pale)" : "var(--oak)";
  const glowColor   = isTeal ? "rgba(58,112,104,0.06)" : "rgba(196,168,130,0.05)";
  const borderActive = isTeal ? "rgba(58,112,104,0.3)" : "rgba(196,168,130,0.25)";

  return (
    <Tilt3DCard
      intensity={8}
      glare
      style={{
        background: hovered ? glowColor : "var(--carbon-2)",
        border: `1px solid ${hovered ? borderActive : "rgba(74,63,56,0.22)"}`,
        transition: "background 0.4s ease, border 0.4s ease",
        cursor: "none",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ padding: "2.25rem 2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.25rem" }}>
          <span style={{ fontFamily: "var(--app-font-mono)", fontSize: "0.6rem", letterSpacing: "0.18em", color: accentColor, opacity: 0.7 }}>
            {project.id}
          </span>
          {project.featured && (
            <span style={{
              fontFamily: "var(--app-font-mono)", fontSize: "0.5rem",
              letterSpacing: "0.14em", color: accentColor,
              border: `1px solid ${accentColor}40`,
              padding: "0.14rem 0.5rem", borderRadius: "100px",
              textTransform: "uppercase",
            }}>
              Featured
            </span>
          )}
        </div>

        <h3 style={{
          fontFamily: "var(--app-font-serif)",
          fontSize: "clamp(1.2rem, 2.5vw, 1.6rem)",
          fontWeight: 400,
          color: hovered ? accentPale : "var(--ivory)",
          letterSpacing: "-0.01em",
          marginBottom: "0.3rem",
          transition: "color 0.35s ease",
        }}>
          {project.name}
        </h3>
        <p style={{
          fontFamily: "var(--app-font-mono)", fontSize: "0.58rem",
          letterSpacing: "0.05em", color: accentColor, marginBottom: "1rem",
        }}>
          {project.tagline}
        </p>

        <p style={{
          fontFamily: "var(--app-font-sans)",
          fontSize: "0.82rem",
          lineHeight: 1.78,
          color: "var(--iron)",
          fontWeight: 300,
          marginBottom: "1.5rem",
        }}>
          {project.description}
        </p>

        <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
          {project.tags.map((t) => (
            <span key={t} className="tag-pill">{t}</span>
          ))}
        </div>

        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          className="clickable"
          style={{
            fontFamily: "var(--app-font-mono)", fontSize: "0.58rem",
            letterSpacing: "0.18em", textTransform: "uppercase",
            color: accentColor, textDecoration: "none",
            display: "inline-flex", alignItems: "center", gap: "0.35rem",
            transition: "gap 0.3s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.gap = "0.55rem")}
          onMouseLeave={(e) => (e.currentTarget.style.gap = "0.35rem")}
        >
          View Project <span>↗</span>
        </a>
      </div>
    </Tilt3DCard>
  );
}

export default function Projects() {
  const containerRef = useRevealChildren(0.08);
  const mouse = useMouse3D();

  return (
    <section id="projects" style={{ padding: "8rem 0", position: "relative" }}>
      {/* Fawn ambient — right */}
      <div style={{
        position: "absolute", top: "30%", right: "-8%",
        width: "420px", height: "600px",
        background: "radial-gradient(ellipse, rgba(196,168,130,0.04) 0%, transparent 65%)",
        pointerEvents: "none",
        transform: `translate(${mouse.x * 10}px, ${-mouse.y * 10}px)`,
        transition: "transform 0.14s linear",
      }} />

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 2rem" }}>
        <div ref={containerRef}>
          <div className="reveal-up" style={{ marginBottom: "5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "1.25rem" }}>
              <span className="section-label">03 / Projects</span>
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
              Things I've<br />
              <em style={{ color: "var(--fawn)" }}>Built</em>
            </h2>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 420px), 1fr))",
            gap: "1px",
            background: "rgba(74,63,56,0.15)",
          }}>
            {projects.map((project) => (
              <div key={project.id} className="reveal-scale" style={{ transitionDelay: `${parseInt(project.id) * 0.07}s` }}>
                <ProjectCard project={project} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
