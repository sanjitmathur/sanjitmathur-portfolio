import { useState, useRef } from "react";
import { useRevealChildren } from "../components/useReveal";

const projects = [
  {
    id: "examforge",
    num: "01",
    title: "ExamForge",
    category: "AI · EdTech",
    description: "AI-powered exam generator that creates adaptive quizzes from any uploaded content. Built with GPT-4 for question synthesis and dynamic difficulty calibration.",
    tags: ["Python", "OpenAI API", "React", "FastAPI"],
    link: "https://github.com/sanjitmathur",
    accent: "#d5b572",
    year: "2025",
  },
  {
    id: "f1-dashboard",
    num: "02",
    title: "F1 Sim Dashboard",
    category: "Data Viz · Racing",
    description: "Live Formula 1 telemetry dashboard pulling real-time race data via the Ergast API. Features animated lap-time comparisons, sector maps and driver-standings heat-maps.",
    tags: ["React", "D3.js", "WebSocket", "TypeScript"],
    link: "https://github.com/sanjitmathur",
    accent: "#c0a055",
    year: "2025",
  },
  {
    id: "orvyn",
    num: "03",
    title: "Orvyn ExoArm",
    category: "Robotics · CV",
    description: "EMG-controlled robotic exoskeleton arm prototype. Custom signal processing pipeline filters muscle electrical signals into precise motor commands via Arduino.",
    tags: ["Arduino", "C++", "Signal Processing", "3D Printing"],
    link: "https://github.com/sanjitmathur",
    accent: "#b09048",
    year: "2024",
  },
  {
    id: "medair",
    num: "04",
    title: "MedAir",
    category: "Health · IoT",
    description: "Smart air-quality monitor with ML-based risk prediction. Correlates PM2.5 and NO₂ readings with respiratory health indicators. Awarded Platinum + Gold at Science Fair.",
    tags: ["Python", "IoT", "ML", "Raspberry Pi"],
    link: "https://github.com/sanjitmathur",
    accent: "#a08040",
    year: "2024",
  },
  {
    id: "spotify",
    num: "05",
    title: "Spotify Analyzer",
    category: "Data · Music",
    description: "Personal music taste profiler using the Spotify Web API. Visualises listening patterns, genre clusters, audio-feature distributions and BPM preferences over time.",
    tags: ["Python", "Spotify API", "Pandas", "Plotly"],
    link: "https://github.com/sanjitmathur",
    accent: "#908038",
    year: "2024",
  },
];

function ProjectCard({ proj, i }: { proj: typeof projects[0]; i: number }) {
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 2;
    if (cardRef.current) {
      cardRef.current.style.transform = `perspective(1200px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateZ(14px)`;
    }
  };

  const resetTransform = () => {
    if (cardRef.current) cardRef.current.style.transform = "perspective(1200px) rotateY(0) rotateX(0) translateZ(0)";
    setHovered(false);
  };

  return (
    <div
      ref={cardRef}
      className={`r3d ${hovered ? "glass-gold glow-box" : "glass"}`}
      onMouseEnter={() => setHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={resetTransform}
      style={{
        padding: "clamp(1.5rem,2.5vw,2.2rem)", borderRadius: "2px",
        transition: "transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s, background 0.4s",
        transitionDelay: `${(i % 3) * 0.08}s`, transformStyle: "preserve-3d",
        willChange: "transform", cursor: "none", position: "relative", overflow: "hidden",
        display: "flex", flexDirection: "column",
      }}
    >
      {/* Glow blob */}
      <div style={{
        position: "absolute", bottom: "-30%", right: "-15%", width: "180px", height: "180px", borderRadius: "50%",
        background: `radial-gradient(ellipse, ${proj.accent}20 0%, transparent 70%)`,
        pointerEvents: "none", opacity: hovered ? 1 : 0.3, transition: "opacity 0.5s",
      }} />

      {/* Top row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.6rem" }}>
        <span style={{ fontFamily: "var(--app-font-mono)", fontSize: "0.5rem", letterSpacing: "0.2em", color: "var(--fawn)", opacity: 0.7 }}>{proj.num}</span>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <span style={{ fontFamily: "var(--app-font-mono)", fontSize: "0.44rem", letterSpacing: "0.1em", color: "var(--text-30)" }}>{proj.year}</span>
          <a href={proj.link} target="_blank" rel="noopener noreferrer" className="clickable" data-cursor="OPEN"
            style={{
              width: 32, height: 32, borderRadius: "50%",
              border: `1px solid ${hovered ? proj.accent + "60" : "rgba(248,242,225,0.12)"}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: hovered ? proj.accent : "var(--text-30)", textDecoration: "none",
              transition: "all 0.3s", flexShrink: 0,
            }}>
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M1 11L11 1M11 1H4M11 1V8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>
          </a>
        </div>
      </div>

      {/* Category */}
      <div style={{ fontFamily: "var(--app-font-mono)", fontSize: "0.42rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--fawn)", marginBottom: "0.6rem", opacity: 0.8 }}>{proj.category}</div>

      {/* Title */}
      <h3 style={{ fontFamily: "var(--app-font-serif)", fontSize: "clamp(1.2rem,2.5vw,1.6rem)", fontWeight: 400, color: "var(--text)", letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: "1rem" }}>{proj.title}</h3>

      {/* Description */}
      <p style={{ fontFamily: "var(--app-font-sans)", fontSize: "0.78rem", lineHeight: 1.9, color: "var(--text-60)", flex: 1, marginBottom: "1.5rem" }}>{proj.description}</p>

      {/* Tags */}
      <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
        {proj.tags.map(t => <span key={t} className="tag">{t}</span>)}
      </div>
    </div>
  );
}

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  useRevealChildren(sectionRef, ".r3d");

  return (
    <section id="projects" ref={sectionRef} style={{ padding: "clamp(6rem,12vw,9rem) clamp(1.5rem,6vw,5rem)", background: "var(--bg)", position: "relative", overflow: "hidden" }}>
      {/* Ambient glow */}
      <div style={{ position: "absolute", top: "30%", left: "-10%", width: "40vw", height: "40vw", borderRadius: "50%", background: "radial-gradient(ellipse, rgba(213,181,114,0.04) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ maxWidth: "1140px", margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "1.2rem", marginBottom: "4rem" }}>
          <span className="r3d" style={{ fontFamily: "var(--app-font-mono)", fontSize: "0.44rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--fawn)" }}>03 / Projects</span>
          <div style={{ flex: 1, height: "1px", background: "var(--text-06)" }} />
        </div>

        <h2 className="r3d" style={{ fontFamily: "var(--app-font-serif)", fontSize: "clamp(2.5rem,6vw,4.5rem)", fontWeight: 400, color: "var(--text)", lineHeight: 0.95, letterSpacing: "-0.04em", marginBottom: "3.5rem" }}>
          Things I've<br /><em style={{ color: "var(--fawn)" }}>Built</em>
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%,300px),1fr))", gap: "1rem" }}>
          {projects.map((proj, i) => <ProjectCard key={proj.id} proj={proj} i={i} />)}
        </div>
      </div>
    </section>
  );
}
