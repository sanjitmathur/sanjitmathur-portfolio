import { useState } from "react";
import { useRevealChildren } from "../components/useReveal";
import { useMouse3D } from "../components/Mouse3DContext";

const projects = [
  { n: "01", name: "ExamForge", type: "AI SaaS Platform", desc: "Full-stack SaaS that ingests syllabus PDFs and generates exam papers with worked solutions via LLMs. Schema mapping, retry logic, streaming UI.", tags: ["Next.js", "TypeScript", "OpenAI", "PostgreSQL"], featured: true },
  { n: "02", name: "F1 Sim Dashboard", type: "Data Visualisation", desc: "Real-time Formula 1 telemetry dashboard. Streams lap-by-lap data, tyre strategy models, DRS windows with animated track maps.", tags: ["React", "Python", "FastF1", "WebSockets", "D3.js"], featured: false },
  { n: "03", name: "Orvyn ExoArm", type: "Brain-Computer Interface", desc: "EMG-driven robotic arm translating muscle signals into joint actuation. CNN classifier — 94% accuracy on 8-class gestures.", tags: ["Python", "TensorFlow", "Raspberry Pi", "Arduino", "BLE"], featured: false },
  { n: "04", name: "MedAir", type: "Autonomous Drone · Award Winning", desc: "Autonomous drone for last-mile medical delivery. Computer vision landing, route optimisation, real-time telemedicine. Platinum & Gold at UAE science fairs.", tags: ["Python", "OpenCV", "ArduPilot", "ROS"], featured: true },
  { n: "05", name: "Spotify Analyzer", type: "ML / Data Science", desc: "Analyses Spotify history for mood patterns, genre drift, and listening trends via NLP sentiment + audio feature importance.", tags: ["Python", "Spotify API", "scikit-learn", "Streamlit"], featured: false },
];

function Row({ p, i }: { p: typeof projects[0]; i: number }) {
  const [h, setH] = useState(false);

  return (
    <div
      className="r3d"
      style={{ borderTop: "1px solid var(--carbon-12)", transitionDelay: `${i * 0.09}s` }}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
    >
      <a
        href="https://github.com/sanjitmathur"
        target="_blank" rel="noopener noreferrer"
        className="clickable"
        style={{ textDecoration: "none", display: "block", padding: "2.25rem 0" }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "4rem 1fr auto", alignItems: "center", gap: "2rem" }}>
          {/* Number */}
          <span style={{
            fontFamily: "var(--app-font-mono)", fontSize: "0.58rem",
            letterSpacing: "0.18em", color: "var(--fawn)",
            transition: "opacity 0.3s",
          }}>{p.n}</span>

          {/* Name + type */}
          <div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "1.25rem", flexWrap: "wrap", marginBottom: "0.3rem" }}>
              <h3 style={{
                fontFamily: "var(--app-font-serif)",
                fontSize: "clamp(1.4rem, 3vw, 2.1rem)",
                fontWeight: 400, letterSpacing: "-0.025em",
                color: h ? "var(--fawn)" : "var(--carbon)",
                transition: "color 0.35s ease",
              }}>{p.name}</h3>
              {p.featured && (
                <span style={{ fontFamily: "var(--app-font-mono)", fontSize: "0.5rem", letterSpacing: "0.14em", color: "var(--fawn)", border: "1px solid var(--fawn-60)", padding: "0.12rem 0.5rem", borderRadius: "100px", textTransform: "uppercase" }}>
                  Featured
                </span>
              )}
            </div>
            <span style={{ fontFamily: "var(--app-font-mono)", fontSize: "0.52rem", letterSpacing: "0.1em", color: "var(--fawn)", textTransform: "uppercase" }}>{p.type}</span>

            {/* Description on hover */}
            <div style={{
              overflow: "hidden",
              maxHeight: h ? "200px" : "0",
              opacity: h ? 1 : 0,
              transition: "max-height 0.5s cubic-bezier(0.16,1,0.3,1), opacity 0.4s ease",
              marginTop: h ? "0.85rem" : "0",
            }}>
              <p style={{ fontFamily: "var(--app-font-sans)", fontSize: "0.82rem", color: "var(--carbon-60)", lineHeight: 1.75, fontWeight: 300, maxWidth: "600px", marginBottom: "0.85rem" }}>
                {p.desc}
              </p>
              <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
                {p.tags.map(t => <span key={t} className="tag">{t}</span>)}
              </div>
            </div>
          </div>

          {/* Arrow */}
          <div style={{
            width: 36, height: 36,
            border: "1px solid var(--carbon-12)", borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
            background: h ? "var(--carbon)" : "transparent",
            transition: "all 0.35s ease",
            transform: h ? "translateX(4px) rotate(-45deg)" : "rotate(0deg)",
          }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M1 11L11 1M11 1H4M11 1V8" stroke={h ? "var(--bg)" : "var(--carbon)"} strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </a>
    </div>
  );
}

export default function Projects() {
  const ref = useRevealChildren(0.05);
  const mouse = useMouse3D();

  return (
    <section id="projects" style={{ padding: "9rem 0", background: "var(--bg)", position: "relative", overflow: "hidden" }}>
      <div style={{
        position: "absolute", bottom: "10%", right: "-8%", width: "55vw", height: "70vh",
        background: "radial-gradient(ellipse, var(--fawn-20) 0%, transparent 65%)",
        transform: `translate(${-mouse.x * 12}px, ${-mouse.y * 12}px)`,
        transition: "transform 0.15s linear", pointerEvents: "none",
      }} />

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 3rem" }}>
        <div ref={ref} style={{ perspective: "1400px" }}>
          <div className="r3d" style={{ marginBottom: "5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "1rem" }}>
              <span className="sec-label">03 / Projects</span>
              <div style={{ flex: 1, height: "1px", background: "var(--carbon-12)" }} />
            </div>
            <h2 style={{ fontFamily: "var(--app-font-serif)", fontSize: "clamp(3rem, 7vw, 5.5rem)", fontWeight: 400, color: "var(--carbon)", letterSpacing: "-0.035em", lineHeight: 1.04 }}>
              Things I've<br /><em style={{ color: "var(--fawn)", fontStyle: "italic" }}>Built</em>
            </h2>
          </div>

          {projects.map((p, i) => <Row key={p.n} p={p} i={i} />)}
          <div style={{ borderTop: "1px solid var(--carbon-12)" }} />
        </div>
      </div>
    </section>
  );
}
