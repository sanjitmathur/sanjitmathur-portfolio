import { useRef, useState } from "react";
import { useRevealChildren } from "../components/useReveal";
import ExamForgeWidget from "../components/widgets/ExamForgeWidget";
import ForecastWidget from "../components/widgets/ForecastWidget";
import F1Widget from "../components/widgets/F1Widget";
import OrvynWidget from "../components/widgets/OrvynWidget";
import SpotifyWidget from "../components/widgets/SpotifyWidget";
import MedAirWidget from "../components/widgets/MedAirWidget";

const projects = [
  {
    id: "examforge",
    title: "ExamForge", category: "AI · EdTech", year: "2025",
    description: "Built a full-stack AI-powered exam generation platform using LLM APIs for dynamic multi-format question creation. Designed interactive workflows allowing students to generate, attempt, and review customized assessments.",
    tags: ["Python", "OpenAI API", "React", "FastAPI"],
    link: "https://github.com/sanjitmathur",
    accent: "#d5b572",
    span: "col-large",
    Widget: ExamForgeWidget,
  },
  {
    id: "forecast",
    title: "Multi-Domain Demand Forecaster", category: "ML · Forecasting", year: "2025",
    description: "Built demand forecasting engine using XGBoost + LightGBM stacking ensemble with Ridge meta-learner. Implemented Quantile Regression for 10th/90th percentile confidence intervals and engineered cyclical sine/cosine temporal encodings with domain-specific rolling statistics. Deployed via RESTful FastAPI service and interactive Streamlit dashboard.",
    tags: ["Python", "XGBoost", "LightGBM", "FastAPI", "Streamlit"],
    link: "https://github.com/sanjitmathur/multi-domain-demand-forecasting",
    accent: "#6366f1",
    span: "col-medium-tall",
    Widget: ForecastWidget,
  },
  {
    id: "f1",
    title: "F1 Simulation Dashboard", category: "Data Viz · Racing", year: "2025",
    description: "Built a full-stack race simulation engine modeling tire degradation, pit strategy, safety cars, weather, and overtaking across all 24 2026 GPs using Monte Carlo probability methods. Implemented dual-mode interface: season-wide predictions and fully configurable custom race simulations.",
    tags: ["React", "Monte Carlo", "TypeScript", "FastAPI"],
    link: "https://github.com/sanjitmathur",
    accent: "#ef4444",
    span: "col-medium",
    Widget: F1Widget,
  },
  {
    id: "orvyn",
    title: "Orvyn ExoArm", category: "Robotics · Rehab", year: "2024",
    description: "Developing signal classification pipeline to differentiate between intended finger movements and noise, targeting 90%+ accuracy for assisted rehab exercises. Designing a microcontroller-based rehabilitation exoskeleton that interprets sEMG signals to assist finger movement through real-time signal processing and controlled servo actuation.",
    tags: ["Arduino", "C++", "Signal Processing", "sEMG"],
    link: "https://github.com/sanjitmathur",
    accent: "#d5b572",
    span: "col-medium",
    Widget: OrvynWidget,
  },
  {
    id: "spotify",
    title: "Spotify Song Analyzer", category: "Data · Music", year: "2024",
    description: "Built a Spotify data analysis pipeline to extract and analyze audio features (tempo, energy, danceability) using Python. Identified key correlations in music attributes through exploratory analysis and feature engineering.",
    tags: ["Python", "Spotify API", "Pandas", "Plotly"],
    link: "https://github.com/sanjitmathur",
    accent: "#1db954",
    span: "col-medium",
    Widget: SpotifyWidget,
  },
  {
    id: "medair",
    title: "MedAir", category: "Autonomous · Medical", year: "2024",
    description: "Designed a hybrid autonomous aircraft for emergency medical delivery with embedded flight control logic and mission-based transition systems. Awarded Platinum and Gold at Dubai University Innovation Fair.",
    tags: ["Python", "IoT", "Flight Control", "Raspberry Pi"],
    link: "https://github.com/sanjitmathur",
    accent: "#22c55e",
    span: "col-medium",
    Widget: MedAirWidget,
  },
];

function ProjectCard({ proj }: { proj: typeof projects[0] }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouch) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientY - rect.top) / rect.height - 0.5;
    const y = (e.clientX - rect.left) / rect.width - 0.5;
    setTilt({ x: x * 5, y: y * 5 });
  };

  const isLarge = proj.span === "col-large";
  const isTall  = proj.span === "col-medium-tall";

  return (
    <div
      className="fade-up"
      onTouchStart={() => { if (!isTouch) setIsTouch(true); }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => { if (!isTouch) setHovered(true); }}
      onMouseLeave={() => { setTilt({ x: 0, y: 0 }); setHovered(false); }}
      style={{ height: "100%" }}
    >
      <div style={{
        height: "100%",
        background: "var(--surface)",
        border: `1px solid ${hovered ? `${proj.accent}33` : "var(--border)"}`,
        borderRadius: 20, overflow: "hidden",
        display: "flex", flexDirection: "column",
        transform: isTouch ? "none" : `perspective(1100px) rotateX(${-tilt.x}deg) rotateY(${tilt.y}deg) translateY(${hovered ? -4 : 0}px)`,
        transition: tilt.x === 0 && !hovered
          ? "transform 0.55s ease, box-shadow 0.3s, border-color 0.3s"
          : "transform 0.06s linear, border-color 0.3s",
        boxShadow: hovered
          ? `0 24px 60px rgba(0,0,0,0.55), 0 0 0 1px ${proj.accent}22`
          : "none",
              }}>
        {/* Widget panel */}
        <div style={{
          height: "clamp(170px, 30vw, " + (isLarge ? "230px" : isTall ? "240px" : "210px") + ")",
          background: "rgba(0,0,0,0.35)",
          borderBottom: "1px solid var(--border)",
          flexShrink: 0,
          padding: "clamp(8px, 2vw, 14px)",
        }}>
          <proj.Widget />
        </div>

        {/* Info panel */}
        <div style={{ padding: "clamp(14px, 3vw, 20px) clamp(14px, 3vw, 24px)", flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                <span style={{ fontSize: "0.58rem", fontWeight: 600, color: proj.accent, letterSpacing: "0.08em", textTransform: "uppercase" }}>{proj.category}</span>
                <span style={{ fontSize: "0.52rem", color: "var(--muted)", opacity: 0.5 }}>· {proj.year}</span>
              </div>
              <h3 style={{ fontSize: "1.05rem", fontWeight: 700, fontFamily: "var(--font-display)", letterSpacing: "0.02em", color: "var(--text)" }}>{proj.title}</h3>
            </div>
            <a href={proj.link} target="_blank" rel="noopener noreferrer"
              style={{
                width: 30, height: 30, border: "1px solid var(--border)", borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "var(--muted)", flexShrink: 0, textDecoration: "none",
                transition: "border-color 0.2s, color 0.2s",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = proj.accent; (e.currentTarget as HTMLElement).style.color = proj.accent; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; (e.currentTarget as HTMLElement).style.color = "var(--muted)"; }}
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M1 9L9 1M9 1H4M9 1V6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
            </a>
          </div>

          <p style={{ fontSize: "0.78rem", lineHeight: 1.7, color: "var(--muted)", flex: 1 }}>{proj.description}</p>

          <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
            {proj.tags.map(t => (
              <span key={t} className="skill-pill" style={{ fontSize: "0.62rem", padding: "0.25rem 0.7rem" }}>{t}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  useRevealChildren(sectionRef, ".fade-up");

  const [examForge, forecast, f1, orvyn, spotify, medair] = projects;

  return (
    <section id="projects" ref={sectionRef} style={{ padding: "var(--section-py) var(--section-px)", background: "var(--bg)" }}>
      <div style={{ maxWidth: "var(--max-w)", margin: "0 auto" }}>

        {/* Header */}
        <div className="fade-up" style={{ marginBottom: "3rem" }}>
          <p className="section-label" style={{ marginBottom: "0.75rem" }}>Projects</p>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
            <h2 style={{ fontSize: "clamp(1.8rem,4vw,2.5rem)", fontWeight: 600, fontFamily: "var(--font-display)", letterSpacing: "0.01em", color: "var(--text)" }}>Things I've built</h2>
            <a href="https://github.com/sanjitmathur" target="_blank" rel="noopener noreferrer"
              className="btn-secondary clickable" style={{ fontSize: "0.8rem" }}>
              All on GitHub →
            </a>
          </div>
        </div>

        {/* Bento Row 1: ExamForge (large) + Forecast (tall) */}
        <div className="bento-row-1">
          <div className="bento-cell-large"><ProjectCard proj={examForge} /></div>
          <div className="bento-cell-tall"><ProjectCard proj={forecast} /></div>
        </div>

        {/* Bento Row 2: F1 + Orvyn + Spotify (equal thirds) */}
        <div className="bento-row-2">
          {[f1, orvyn, spotify].map(p => (
            <div key={p.id} className="bento-cell-medium"><ProjectCard proj={p} /></div>
          ))}
        </div>

        {/* Bento Row 3: MedAir (full-width) */}
        <div className="bento-row-3">
          <div className="bento-cell-medium"><ProjectCard proj={medair} /></div>
        </div>

      </div>
    </section>
  );
}
