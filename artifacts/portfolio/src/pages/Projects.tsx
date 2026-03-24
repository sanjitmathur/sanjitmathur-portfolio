import { useState } from "react";
import { useRevealChildren } from "../components/useReveal";
import Tilt3DCard from "../components/Tilt3DCard";
import { useMouse3D } from "../components/Mouse3DContext";

const projects = [
  { id: "01", name: "ExamForge", line: "AI-Powered Exam Generation Platform", desc: "Full-stack SaaS that ingests syllabus PDFs and generates exam papers with worked solutions via LLMs. Schema mapping, retry logic, streaming UI.", tags: ["Next.js", "TypeScript", "OpenAI", "PostgreSQL"], featured: true, accent: "teal" },
  { id: "02", name: "F1 Sim Dashboard", line: "Live Telemetry & Race Simulation", desc: "Real-time Formula 1 race data dashboard. Streams lap-by-lap telemetry, tyre strategy models, DRS windows with animated track maps.", tags: ["React", "Python", "FastF1", "WebSockets", "D3.js"], featured: false, accent: "fawn" },
  { id: "03", name: "Orvyn ExoArm", line: "Brain-Computer Interface Exoskeleton", desc: "EMG-driven robotic arm translating muscle-signal patterns into joint actuation. CNN classifier at 94% accuracy on 8-class gestures.", tags: ["Python", "TensorFlow", "Raspberry Pi", "Arduino", "BLE"], featured: false, accent: "teal" },
  { id: "04", name: "MedAir", line: "Platinum + Gold Award — Autonomous Medical Drone", desc: "Autonomous drone for last-mile medical delivery. CV landing, route optimisation, real-time telemedicine. Won Platinum & Gold at UAE science fairs.", tags: ["Python", "OpenCV", "ArduPilot", "ROS"], featured: true, accent: "fawn" },
  { id: "05", name: "Spotify Analyzer", line: "Personal Music Intelligence Engine", desc: "Analyses Spotify history for mood patterns, genre drift, and listening trends. NLP sentiment on lyrics + audio feature importance.", tags: ["Python", "Spotify API", "Pandas", "scikit-learn", "Streamlit"], featured: false, accent: "teal" },
];

function Card({ p }: { p: typeof projects[0] }) {
  const [h, setH] = useState(false);
  const tc = p.accent === "teal" ? "var(--teal)" : "var(--fawn-dark)";
  const tp = p.accent === "teal" ? "var(--teal-pale)" : "var(--fawn)";
  return (
    <Tilt3DCard intensity={9} glare
      style={{ background: h ? (p.accent === "teal" ? "rgba(58,112,104,0.04)" : "rgba(196,168,130,0.05)") : "var(--bg-3)", border: `1px solid ${h ? (p.accent === "teal" ? "rgba(58,112,104,0.2)" : "rgba(196,168,130,0.3)") : "var(--border)"}`, cursor: "none", transition: "background 0.35s, border 0.35s, box-shadow 0.35s", boxShadow: h ? "0 24px 60px rgba(15,14,13,0.1)" : "0 2px 8px rgba(15,14,13,0.04)" }}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}>
      <div style={{ padding: "2.25rem 2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.25rem" }}>
          <span style={{ fontFamily: "var(--app-font-mono)", fontSize: "0.58rem", letterSpacing: "0.18em", color: tc, opacity: 0.7 }}>{p.id}</span>
          {p.featured && <span style={{ fontFamily: "var(--app-font-mono)", fontSize: "0.5rem", letterSpacing: "0.14em", color: tc, border: `1px solid ${tc}40`, padding: "0.14rem 0.55rem", borderRadius: "100px", textTransform: "uppercase" }}>Featured</span>}
        </div>
        <h3 style={{ fontFamily: "var(--app-font-serif)", fontSize: "clamp(1.2rem,2.5vw,1.6rem)", fontWeight: 400, color: h ? tc : "var(--carbon)", letterSpacing: "-0.01em", marginBottom: "0.3rem", transition: "color 0.3s" }}>{p.name}</h3>
        <p style={{ fontFamily: "var(--app-font-mono)", fontSize: "0.58rem", letterSpacing: "0.05em", color: tc, marginBottom: "1rem" }}>{p.line}</p>
        <p style={{ fontFamily: "var(--app-font-sans)", fontSize: "0.82rem", lineHeight: 1.78, color: "var(--iron)", fontWeight: 300, marginBottom: "1.4rem" }}>{p.desc}</p>
        <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap", marginBottom: "1.4rem" }}>
          {p.tags.map(t => <span key={t} className="tag">{t}</span>)}
        </div>
        <a href="https://github.com/sanjitmathur" target="_blank" rel="noopener noreferrer" className="clickable"
          style={{ fontFamily: "var(--app-font-mono)", fontSize: "0.58rem", letterSpacing: "0.16em", textTransform: "uppercase", color: tc, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.35rem" }}
          onMouseEnter={e => (e.currentTarget.style.gap = "0.55rem")}
          onMouseLeave={e => (e.currentTarget.style.gap = "0.35rem")}>
          View ↗
        </a>
      </div>
    </Tilt3DCard>
  );
}

export default function Projects() {
  const ref = useRevealChildren(0.06);
  const mouse = useMouse3D();

  return (
    <section id="projects" style={{ padding: "9rem 0", background: "var(--bg)", position: "relative", overflow: "hidden" }}>
      <div style={{
        position: "absolute", top: "20%", right: "-6%", width: "480px", height: "600px",
        background: "radial-gradient(ellipse, rgba(196,168,130,0.08) 0%, transparent 65%)",
        transform: `translate(${-mouse.x * 14}px, ${-mouse.y * 14}px)`,
        transition: "transform 0.14s linear", pointerEvents: "none",
      }} />

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 2rem" }}>
        <div ref={ref} style={{ perspective: "1400px" }}>
          <div className="r3d" style={{ marginBottom: "5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "1.25rem" }}>
              <span className="sec-label">03 / Projects</span>
              <div className="divider" />
            </div>
            <h2 style={{ fontFamily: "var(--app-font-serif)", fontSize: "clamp(2.8rem,6vw,5rem)", fontWeight: 400, color: "var(--carbon)", letterSpacing: "-0.03em", lineHeight: 1.06 }}>
              Things I've<br /><em style={{ color: "var(--fawn)" }}>Built</em>
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%,420px),1fr))", gap: "1px", background: "var(--border-dim)" }}>
            {projects.map((p, i) => (
              <div key={p.id} className="r3d-scale" style={{ transitionDelay: `${i * 0.09}s` }}>
                <Card p={p} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
