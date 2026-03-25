import { useState, useRef } from "react";
import { useRevealChildren } from "../components/useReveal";

const COLORS = [
  { bg: "#d5b572", text: "#201f14" },
  { bg: "#201f14", text: "#f8f2e1" },
  { bg: "#f2ead5", text: "#201f14" },
  { bg: "#2a3a2e", text: "#f8f2e1" },
  { bg: "#3a2a1e", text: "#f8f2e1" },
];

const projects = [
  { n: "01", name: "ExamForge", type: "AI · SaaS", year: "2025", desc: "Full-stack SaaS that ingests syllabus PDFs and generates exam papers with worked solutions via LLMs. Schema mapping, retry logic, streaming UI.", tags: ["Next.js", "OpenAI", "PostgreSQL", "TypeScript"], href: "https://github.com/sanjitmathur" },
  { n: "02", name: "F1 Sim Dashboard", type: "Data · Telemetry", year: "2025", desc: "Real-time Formula 1 telemetry dashboard. Streams lap-by-lap data, tyre strategy models, DRS windows with animated track maps.", tags: ["React", "Python", "FastF1", "D3.js"], href: "https://github.com/sanjitmathur" },
  { n: "03", name: "Orvyn ExoArm", type: "BCI · Robotics", year: "2024", desc: "EMG-driven robotic arm translating muscle signals into joint actuation. CNN classifier achieving 94% accuracy on 8-class gestures.", tags: ["TensorFlow", "Raspberry Pi", "Arduino", "BLE"], href: "https://github.com/sanjitmathur" },
  { n: "04", name: "MedAir", type: "Autonomous · Award", year: "2024", desc: "Autonomous drone for last-mile medical delivery. Computer vision landing, route optimisation, real-time telemedicine interface. Platinum & Gold.", tags: ["Python", "OpenCV", "ArduPilot", "ROS"], href: "https://github.com/sanjitmathur" },
  { n: "05", name: "Spotify Analyzer", type: "ML · Analytics", year: "2024", desc: "Analyses Spotify history for mood patterns, genre drift, and listening trends via NLP sentiment and audio feature importance.", tags: ["Python", "Spotify API", "scikit-learn"], href: "https://github.com/sanjitmathur" },
];

function Row({ p, idx }: { p: typeof projects[0]; idx: number }) {
  const [hovered, setHovered] = useState(false);
  const rowRef = useRef<HTMLDivElement>(null);
  const c = COLORS[idx % COLORS.length];

  return (
    <div
      ref={rowRef}
      className="r3d"
      style={{ borderTop: "1px solid var(--carbon-12)", position: "relative", transitionDelay: `${idx * 0.08}s` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Color fill reveal from right */}
      <div style={{
        position: "absolute", inset: 0, right: 0,
        background: c.bg,
        transformOrigin: "right",
        transform: hovered ? "scaleX(1)" : "scaleX(0)",
        transition: "transform 0.65s cubic-bezier(0.16,1,0.3,1)",
        zIndex: 0,
      }} />

      <a
        href={p.href}
        target="_blank" rel="noopener noreferrer"
        className="clickable"
        data-cursor="VIEW"
        style={{ textDecoration: "none", display: "block", padding: "1.8rem 0", position: "relative", zIndex: 1 }}
      >
        <div style={{
          display: "grid",
          gridTemplateColumns: "4rem 1fr auto",
          alignItems: "center", gap: "1.5rem",
        }}>
          {/* Number */}
          <span style={{
            fontFamily: "var(--app-font-mono)", fontSize: "0.58rem",
            letterSpacing: "0.2em",
            color: hovered ? c.text + "99" : "var(--fawn)",
            transition: "color 0.4s ease",
          }}>{p.n}</span>

          {/* Content */}
          <div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "1rem", flexWrap: "wrap", marginBottom: "0.3rem" }}>
              <h3 style={{
                fontFamily: "var(--app-font-serif)",
                fontSize: "clamp(1.4rem, 2.8vw, 2rem)",
                fontWeight: 400, letterSpacing: "-0.025em",
                color: hovered ? c.text : "var(--carbon)",
                transition: "color 0.4s ease",
              }}>{p.name}</h3>
              <span style={{
                fontFamily: "var(--app-font-mono)", fontSize: "0.5rem",
                letterSpacing: "0.12em", textTransform: "uppercase",
                color: hovered ? c.text + "88" : "var(--fawn)",
                transition: "color 0.4s ease",
              }}>{p.type}</span>
            </div>

            {/* Tags + desc on hover */}
            <div style={{
              overflow: "hidden",
              maxHeight: hovered ? "120px" : "0",
              opacity: hovered ? 1 : 0,
              transition: "max-height 0.5s cubic-bezier(0.16,1,0.3,1), opacity 0.35s ease",
            }}>
              <p style={{
                fontFamily: "var(--app-font-sans)", fontSize: "0.78rem",
                color: hovered ? c.text + "bb" : "var(--carbon-60)",
                lineHeight: 1.7, fontWeight: 300, maxWidth: "540px",
                marginBottom: "0.6rem", marginTop: "0.3rem",
                transition: "color 0.4s ease",
              }}>{p.desc}</p>
              <div style={{ display: "flex", gap: "0.3rem", flexWrap: "wrap" }}>
                {p.tags.map(t => (
                  <span key={t} style={{
                    fontFamily: "var(--app-font-mono)", fontSize: "0.5rem",
                    letterSpacing: "0.08em", padding: "0.15rem 0.5rem",
                    border: `1px solid ${hovered ? c.text + "33" : "var(--carbon-12)"}`,
                    color: hovered ? c.text + "99" : "var(--carbon-60)",
                    borderRadius: "100px",
                    transition: "all 0.4s ease",
                  }}>{t}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Year + arrow */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.5rem", flexShrink: 0 }}>
            <span style={{
              fontFamily: "var(--app-font-mono)", fontSize: "0.5rem",
              letterSpacing: "0.12em", color: hovered ? c.text + "66" : "var(--carbon-30)",
              transition: "color 0.4s ease",
            }}>{p.year}</span>
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              border: `1px solid ${hovered ? c.text + "33" : "var(--carbon-12)"}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              background: hovered ? c.text + "11" : "transparent",
              transform: hovered ? "rotate(-45deg) scale(1.1)" : "rotate(0deg) scale(1)",
              transition: "all 0.45s cubic-bezier(0.16,1,0.3,1)",
            }}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M1 11L11 1M11 1H4M11 1V8" stroke={hovered ? c.text : "var(--carbon)"} strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </div>
      </a>
    </div>
  );
}

export default function Projects() {
  const ref = useRevealChildren(0.05);

  return (
    <section id="projects" style={{ padding: "9rem 0", background: "var(--bg)", position: "relative", overflow: "hidden" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 clamp(1.5rem, 4vw, 3rem)" }}>
        <div ref={ref} style={{ perspective: "1400px" }}>
          <div className="r3d" style={{ marginBottom: "4.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "1rem" }}>
              <span style={{ fontFamily: "var(--app-font-mono)", fontSize: "0.52rem", letterSpacing: "0.26em", textTransform: "uppercase", color: "var(--fawn)" }}>03 / Projects</span>
              <div style={{ flex: 1, height: "1px", background: "var(--carbon-12)" }} />
            </div>
            <h2 style={{
              fontFamily: "var(--app-font-serif)",
              fontSize: "clamp(2.5rem, 6.5vw, 5rem)",
              fontWeight: 400, color: "var(--carbon)", letterSpacing: "-0.035em", lineHeight: 1.05,
            }}>
              Things I've<br /><em style={{ color: "var(--fawn)", fontStyle: "italic" }}>Built</em>
            </h2>
          </div>

          {projects.map((p, i) => <Row key={p.n} p={p} idx={i} />)}
          <div style={{ borderTop: "1px solid var(--carbon-12)" }} />
        </div>
      </div>
    </section>
  );
}
