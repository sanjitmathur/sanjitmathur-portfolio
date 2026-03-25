import { useState, useRef } from "react";
import { useRevealChildren } from "../components/useReveal";

const projects = [
  { n: "01", title: "ExamForge", category: "AI · EdTech", year: "2025", description: "AI-powered exam generator that creates adaptive quizzes from any uploaded content. GPT-4 question synthesis with dynamic difficulty calibration.", tags: ["Python", "OpenAI API", "React", "FastAPI"], link: "https://github.com/sanjitmathur" },
  { n: "02", title: "F1 Sim Dashboard", category: "Data Viz · Racing", year: "2025", description: "Live Formula 1 telemetry dashboard pulling real-time race data via the Ergast API. Animated lap-time comparisons, sector maps, driver-standings heat-maps.", tags: ["React", "D3.js", "WebSocket", "TypeScript"], link: "https://github.com/sanjitmathur" },
  { n: "03", title: "Orvyn ExoArm", category: "Robotics · CV", year: "2024", description: "EMG-controlled robotic exoskeleton arm prototype. Custom signal processing pipeline filters muscle electrical signals into precise motor commands via Arduino.", tags: ["Arduino", "C++", "Signal Processing"], link: "https://github.com/sanjitmathur" },
  { n: "04", title: "MedAir", category: "Health · IoT", year: "2024", description: "Smart air-quality monitor with ML-based risk prediction. Correlates PM2.5 and NO₂ with respiratory health. Platinum + Gold at Science Fair.", tags: ["Python", "IoT", "ML", "Raspberry Pi"], link: "https://github.com/sanjitmathur" },
  { n: "05", title: "Spotify Analyzer", category: "Data · Music", year: "2024", description: "Personal music taste profiler using Spotify Web API. Visualises listening patterns, genre clusters, audio-feature distributions and BPM preferences.", tags: ["Python", "Spotify API", "Pandas", "Plotly"], link: "https://github.com/sanjitmathur" },
];

function ProjectRow({ proj, i }: { proj: typeof projects[0]; i: number }) {
  const [hovered, setHovered] = useState(false);
  const [open, setOpen] = useState(false);

  return (
    <div
      className="r3d"
      style={{ borderTop: "1px solid var(--text-06)", transitionDelay: `${i * 0.07}s` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Main row */}
      <div
        onClick={() => setOpen(!open)}
        style={{ display: "grid", gridTemplateColumns: "3.5rem 1fr auto auto", alignItems: "center", gap: "1.5rem", padding: "1.8rem 0", cursor: "none", transition: "opacity 0.2s" }}
      >
        {/* Number */}
        <span style={{ fontFamily: "var(--app-font-mono)", fontSize: "0.55rem", letterSpacing: "0.18em", color: hovered ? "var(--fawn)" : "var(--text-30)", transition: "color 0.3s" }}>{proj.n}</span>

        {/* Title + category */}
        <div style={{ display: "flex", alignItems: "baseline", gap: "1.5rem", flexWrap: "wrap" }}>
          <span style={{ fontFamily: "var(--app-font-serif)", fontSize: "clamp(1.2rem,2.5vw,1.8rem)", fontWeight: 400, letterSpacing: "-0.025em", color: hovered ? "var(--fawn)" : "var(--text)", transition: "color 0.3s" }}>{proj.title}</span>
          <span style={{ fontFamily: "var(--app-font-mono)", fontSize: "0.48rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-30)" }}>{proj.category}</span>
        </div>

        {/* Year */}
        <span style={{ fontFamily: "var(--app-font-mono)", fontSize: "0.48rem", color: "var(--text-30)", letterSpacing: "0.1em", whiteSpace: "nowrap" }}>{proj.year}</span>

        {/* Arrow */}
        <a
          href={proj.link}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor="OPEN"
          className="clickable"
          onClick={e => e.stopPropagation()}
          style={{ width: 34, height: 34, border: `1px solid ${hovered ? "rgba(213,181,114,0.5)" : "var(--text-12)"}`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, textDecoration: "none", color: hovered ? "var(--fawn)" : "var(--text-30)", transition: "all 0.3s" }}
        >
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M1 10L10 1M10 1H4M10 1V7" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" /></svg>
        </a>
      </div>

      {/* Hover underline */}
      <div style={{ height: "1px", background: "var(--fawn)", transform: `scaleX(${hovered ? 1 : 0})`, transformOrigin: "left", transition: "transform 0.45s cubic-bezier(0.16,1,0.3,1)" }} />

      {/* Expanded detail */}
      <div style={{ overflow: "hidden", maxHeight: open ? "300px" : "0", transition: "max-height 0.5s cubic-bezier(0.16,1,0.3,1)", paddingLeft: "5rem" }}>
        <div style={{ padding: "1.25rem 0 2rem" }}>
          <p style={{ fontFamily: "var(--app-font-sans)", fontSize: "0.8rem", lineHeight: 1.9, color: "var(--text-60)", maxWidth: "600px", marginBottom: "1.2rem" }}>{proj.description}</p>
          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
            {proj.tags.map(t => <span key={t} className="tag">{t}</span>)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  useRevealChildren(sectionRef, ".r3d");

  return (
    <section id="projects" ref={sectionRef} style={{ padding: "clamp(6rem,12vw,9rem) clamp(1.5rem,6vw,5rem)", background: "var(--bg)" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

        <div style={{ display: "flex", alignItems: "baseline", gap: "1.5rem", marginBottom: "5rem" }}>
          <span className="r3d" style={{ fontFamily: "var(--app-font-mono)", fontSize: "0.44rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--fawn)" }}>03 / Projects</span>
          <div style={{ flex: 1, height: "1px", background: "var(--text-06)" }} />
        </div>

        <h2 className="r3d" style={{ fontFamily: "var(--app-font-serif)", fontSize: "clamp(2.8rem,6vw,4.8rem)", fontWeight: 400, lineHeight: 0.92, letterSpacing: "-0.04em", color: "var(--text)", marginBottom: "4rem" }}>
          Things I've<br /><em style={{ color: "var(--fawn)" }}>Built</em>
        </h2>

        <div style={{ borderBottom: "1px solid var(--text-06)" }}>
          {projects.map((p, i) => <ProjectRow key={p.n} proj={p} i={i} />)}
        </div>

        <div className="r3d" style={{ marginTop: "3rem", display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <a href="https://github.com/sanjitmathur" target="_blank" rel="noopener noreferrer" className="btn-outline clickable" data-cursor="OPEN" style={{ display: "inline-flex" }}>
            <span>See all on GitHub</span>
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M1 10L10 1M10 1H4M10 1V7" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" /></svg>
          </a>
        </div>
      </div>
    </section>
  );
}
