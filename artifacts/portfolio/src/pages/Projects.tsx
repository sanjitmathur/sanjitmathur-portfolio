import { useRef, useState, useCallback } from "react";
import { useRevealChildren } from "../components/useReveal";
import ExamForgeWidget from "../components/widgets/ExamForgeWidget";
import F1Widget from "../components/widgets/F1Widget";
import OrvynWidget from "../components/widgets/OrvynWidget";
import MedAirWidget from "../components/widgets/MedAirWidget";
import SpotifyWidget from "../components/widgets/SpotifyWidget";

const projects = [
  {
    n: "01", title: "ExamForge", category: "AI · EdTech", year: "2025",
    description: "AI-powered exam generator that creates adaptive quizzes from any uploaded content. GPT-4 question synthesis with dynamic difficulty calibration.",
    tags: ["Python", "OpenAI API", "React", "FastAPI"],
    link: "https://github.com/sanjitmathur",
    accent: "#6366F1", large: true,
    Widget: ExamForgeWidget,
  },
  {
    n: "02", title: "F1 Sim Dashboard", category: "Data Viz · Racing", year: "2025",
    description: "Live Formula 1 telemetry dashboard pulling real-time race data via the Ergast API. Animated lap-time comparisons, sector maps, driver-standings heat-maps.",
    tags: ["React", "D3.js", "WebSocket", "TypeScript"],
    link: "https://github.com/sanjitmathur",
    accent: "#ef4444", large: false,
    Widget: F1Widget,
  },
  {
    n: "03", title: "Orvyn ExoArm", category: "Robotics · CV", year: "2024",
    description: "EMG-controlled robotic exoskeleton arm prototype. Custom signal processing pipeline filters muscle electrical signals into precise motor commands via Arduino.",
    tags: ["Arduino", "C++", "Signal Processing"],
    link: "https://github.com/sanjitmathur",
    accent: "#a78bfa", large: false,
    Widget: OrvynWidget,
  },
  {
    n: "04", title: "MedAir", category: "Health · IoT", year: "2024",
    description: "Smart air-quality monitor with ML-based risk prediction. Correlates PM2.5 and NO₂ with respiratory health. Platinum + Gold at Science Fair.",
    tags: ["Python", "IoT", "ML", "Raspberry Pi"],
    link: "https://github.com/sanjitmathur",
    accent: "#22c55e", large: false,
    Widget: MedAirWidget,
  },
  {
    n: "05", title: "Spotify Analyzer", category: "Data · Music", year: "2024",
    description: "Personal music taste profiler using Spotify Web API. Visualises listening patterns, genre clusters, audio-feature distributions and BPM preferences.",
    tags: ["Python", "Spotify API", "Pandas", "Plotly"],
    link: "https://github.com/sanjitmathur",
    accent: "#1db954", large: true,
    Widget: SpotifyWidget,
  },
];

function ProjectCard({ proj, style }: { proj: typeof projects[0]; style?: React.CSSProperties }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientY - rect.top) / rect.height - 0.5;
    const y = (e.clientX - rect.left) / rect.width - 0.5;
    setTilt({ x: x * 5, y: y * 5 });
  };

  return (
    <div
      className="fade-up"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setTilt({ x: 0, y: 0 }); setHovered(false); }}
      style={{ height: "100%", ...style }}
    >
      <div style={{
        height: "100%", background: "var(--surface)", border: "1px solid var(--border)",
        borderRadius: 20, overflow: "hidden", display: "flex", flexDirection: "column",
        transform: `perspective(1100px) rotateX(${-tilt.x}deg) rotateY(${tilt.y}deg) translateY(${hovered ? -4 : 0}px)`,
        transition: tilt.x === 0 && !hovered ? "transform 0.5s ease, box-shadow 0.3s" : "transform 0.05s linear, box-shadow 0.3s",
        boxShadow: hovered ? `0 20px 50px rgba(0,0,0,0.5), 0 0 0 1px ${proj.accent}33` : "none",
        borderColor: hovered ? `${proj.accent}33` : "var(--border)",
        cursor: "none",
      }}>
        {/* Widget area */}
        <div style={{ height: proj.large ? 220 : 190, background: "rgba(0,0,0,0.35)", borderBottom: "1px solid var(--border)", flexShrink: 0, padding: 14 }}>
          <proj.Widget />
        </div>

        {/* Info */}
        <div style={{ padding: "20px 24px", flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                <span style={{ fontSize: "0.58rem", fontWeight: 600, color: proj.accent, letterSpacing: "0.08em", textTransform: "uppercase" }}>{proj.category}</span>
                <span style={{ fontSize: "0.52rem", color: "var(--muted)", opacity: 0.5 }}>· {proj.year}</span>
              </div>
              <h3 style={{ fontSize: "1.05rem", fontWeight: 700, letterSpacing: "-0.02em", color: "var(--text)" }}>{proj.title}</h3>
            </div>
            <a href={proj.link} target="_blank" rel="noopener noreferrer"
              style={{ width: 30, height: 30, border: "1px solid var(--border)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--muted)", flexShrink: 0, transition: "border-color 0.2s, color 0.2s", textDecoration: "none" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = proj.accent; (e.currentTarget as HTMLElement).style.color = proj.accent; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; (e.currentTarget as HTMLElement).style.color = "var(--muted)"; }}
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1 9L9 1M9 1H4M9 1V6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
            </a>
          </div>
          <p style={{ fontSize: "0.78rem", lineHeight: 1.7, color: "var(--muted)", flex: 1 }}>{proj.description}</p>
          <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
            {proj.tags.map(t => <span key={t} className="skill-pill" style={{ fontSize: "0.62rem", padding: "0.25rem 0.7rem" }}>{t}</span>)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef(0);
  const scrollStart = useRef(0);
  useRevealChildren(sectionRef, ".fade-up");

  // Carousel scroll to card
  const scrollTo = useCallback((idx: number) => {
    if (!trackRef.current) return;
    const clamped = Math.max(0, Math.min(projects.length - 1, idx));
    setActiveIdx(clamped);
    const card = trackRef.current.children[clamped] as HTMLElement;
    if (card) card.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, []);

  const onDragStart = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStart.current = e.clientX;
    scrollStart.current = trackRef.current?.scrollLeft || 0;
  };
  const onDragMove = (e: React.MouseEvent) => {
    if (!isDragging || !trackRef.current) return;
    trackRef.current.scrollLeft = scrollStart.current - (e.clientX - dragStart.current);
  };
  const onDragEnd = () => {
    setIsDragging(false);
    if (!trackRef.current) return;
    const cardW = trackRef.current.scrollWidth / projects.length;
    const idx = Math.round(trackRef.current.scrollLeft / cardW);
    setActiveIdx(Math.max(0, Math.min(projects.length - 1, idx)));
  };

  return (
    <section id="projects" ref={sectionRef} style={{ padding: "var(--section-py) 0", background: "var(--bg)", overflow: "hidden" }}>
      {/* Section header */}
      <div style={{ maxWidth: "var(--max-w)", margin: "0 auto", padding: "0 var(--section-px)", marginBottom: "3rem" }}>
        <div className="fade-up">
          <p className="section-label" style={{ marginBottom: "0.75rem" }}>Projects</p>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
            <h2 style={{ fontSize: "clamp(1.8rem,4vw,2.5rem)", fontWeight: 700, letterSpacing: "-0.03em", color: "var(--text)" }}>Things I've built</h2>
            <a href="https://github.com/sanjitmathur" target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ fontSize: "0.8rem" }}>
              All on GitHub →
            </a>
          </div>
        </div>
      </div>

      {/* Carousel track */}
      <div
        ref={trackRef}
        onMouseDown={onDragStart}
        onMouseMove={onDragMove}
        onMouseUp={onDragEnd}
        onMouseLeave={onDragEnd}
        style={{
          display: "flex", gap: "1.25rem",
          paddingLeft: "var(--section-px)", paddingRight: "var(--section-px)",
          overflowX: "auto", scrollSnapType: "x mandatory",
          cursor: isDragging ? "grabbing" : "grab",
          scrollbarWidth: "none", msOverflowStyle: "none",
          paddingBottom: "1rem",
        }}
      >
        {projects.map((p) => (
          <div key={p.n}
            style={{
              flexShrink: 0,
              width: p.large ? "min(460px, 80vw)" : "min(360px, 75vw)",
              height: p.large ? 520 : 470,
              scrollSnapAlign: "start",
            }}
          >
            <ProjectCard proj={p} />
          </div>
        ))}
      </div>

      {/* Carousel dots + arrows */}
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "1.5rem", marginTop: "2rem" }}>
        <button onClick={() => scrollTo(activeIdx - 1)}
          style={{ width: 32, height: 32, borderRadius: "50%", border: "1px solid var(--border)", background: "none", cursor: "none", color: "var(--muted)", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--accent)"; (e.currentTarget as HTMLElement).style.color = "var(--accent)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; (e.currentTarget as HTMLElement).style.color = "var(--muted)"; }}
        >
          ←
        </button>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          {projects.map((_, i) => (
            <button key={i} onClick={() => scrollTo(i)}
              style={{ width: i === activeIdx ? 20 : 6, height: 6, borderRadius: 3, background: i === activeIdx ? "var(--accent)" : "rgba(255,255,255,0.15)", border: "none", cursor: "none", transition: "all 0.3s ease", padding: 0 }}
            />
          ))}
        </div>
        <button onClick={() => scrollTo(activeIdx + 1)}
          style={{ width: 32, height: 32, borderRadius: "50%", border: "1px solid var(--border)", background: "none", cursor: "none", color: "var(--muted)", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--accent)"; (e.currentTarget as HTMLElement).style.color = "var(--accent)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; (e.currentTarget as HTMLElement).style.color = "var(--muted)"; }}
        >
          →
        </button>
      </div>
    </section>
  );
}
