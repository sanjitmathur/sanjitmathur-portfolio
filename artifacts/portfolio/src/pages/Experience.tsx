import { useRef, useState } from "react";
import { useRevealChildren } from "../components/useReveal";
import BarakaWidget from "../components/widgets/BarakaWidget";
import IndiGoWidget from "../components/widgets/IndiGoWidget";
import LabWidget from "../components/widgets/LabWidget";

const jobs = [
  {
    n: "01", role: "AI Engineering Intern", co: "Baraka Financial Ltd.",
    type: "FinTech · AI", period: "Feb 2026 - Present", loc: "Dubai, UAE",
    bullets: [
      "Deployed containerized services to Kubernetes; built AI-powered internal tooling that automated error classification and log analysis, eliminating manual triage across support workflows.",
      "Built Position Search and Trading Account Monitor modules integrating OMS, Instruments, and Wallet microservices, reducing manual portfolio lookup time for operations teams.",
      "Unified inconsistent data schemas across distributed services into a single portfolio state model, eliminating data discrepancies in cross-market account views.",
    ],
    tags: ["Kubernetes", "Docker", "LLM APIs", "Python", "TypeScript"],
    accent: "#d5b572",
    Widget: BarakaWidget,
  },
  {
    n: "02", role: "Digital Intern", co: "IndiGo — InterGlobe Aviation",
    type: "Aviation · ML", period: "Aug - Sep 2025", loc: "Gurgaon, India",
    bullets: [
      "Built a Logistic Regression model to predict on-time arrival performance on the DEL-BOM sector using 1,000 flight records and 6 engineered features (block-hour overrun, departure delay, aircraft type, weather index, ATC congestion), achieving 88% accuracy with balanced precision/recall across both classes.",
      "Engineered features from raw operational data including one-hot encoding of 3 aircraft types (A320, A320neo, A321neo), computed block-hour overrun from scheduled vs. actual hours, and conducted correlation analysis across 10 numerical variables to inform feature selection for modeling.",
    ],
    tags: ["Python", "scikit-learn", "Pandas", "Feature Engineering"],
    accent: "#c4934a",
    Widget: IndiGoWidget,
  },
  {
    n: "03", role: "Software Engineering Intern", co: "Lab of Future",
    type: "EdTech", period: "Jun - Aug 2025", loc: "Dubai, UAE",
    bullets: [
      "Built internal educational software used by 500+ students across 4 campuses.",
    ],
    tags: ["React", "Node.js", "Full-Stack"],
    accent: "#b8895a",
    Widget: LabWidget,
  },
];

function JobCard({ job, idx }: { job: typeof jobs[0]; idx: number }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [open, setOpen] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientY - rect.top) / rect.height - 0.5;
    const y = (e.clientX - rect.left) / rect.width - 0.5;
    setTilt({ x: x * 4, y: y * 4 });
  };

  return (
    <div
      className="fade-up"
      style={{ transitionDelay: `${idx * 0.12}s` }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
    >
      <div style={{
        background: "var(--surface)", border: "1px solid var(--border)",
        borderRadius: 20, overflow: "hidden",
        transform: `perspective(1200px) rotateX(${-tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: tilt.x === 0 ? "transform 0.6s ease, box-shadow 0.3s" : "transform 0.05s linear",
        boxShadow: tilt.x !== 0 || tilt.y !== 0 ? `0 24px 60px rgba(0,0,0,0.5), 0 0 0 1px ${job.accent}22` : "none",
      }}>
        {/* Top: widget + header */}
        <div className="exp-card-inner">
          {/* Left: job info */}
          <div style={{ padding: "28px 32px", display: "flex", flexDirection: "column", justifyContent: "space-between", borderRight: "1px solid var(--border)" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: job.accent, boxShadow: `0 0 10px ${job.accent}80` }} />
                <span style={{ fontSize: "0.65rem", color: job.accent, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>{job.type}</span>
              </div>
              <div style={{ fontSize: "clamp(1.1rem,2vw,1.3rem)", fontWeight: 700, letterSpacing: "-0.025em", color: "var(--text)", marginBottom: 4, lineHeight: 1.2 }}>{job.co}</div>
              <div style={{ fontSize: "0.82rem", color: "var(--muted)", marginBottom: 2 }}>{job.role}</div>
              <div style={{ fontSize: "0.7rem", color: "var(--muted)", opacity: 0.6 }}>{job.period} · {job.loc}</div>
            </div>
            <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginTop: 16 }}>
              {job.tags.map(t => <span key={t} className="skill-pill" style={{ fontSize: "0.65rem" }}>{t}</span>)}
            </div>
          </div>

          {/* Right: interactive widget */}
          <div style={{ padding: 16, background: "rgba(0,0,0,0.3)" }}>
            <job.Widget />
          </div>
        </div>

        {/* Expandable bullets */}
        <div style={{ borderTop: "1px solid var(--border)" }}>
          <button
            onClick={() => setOpen(o => !o)}
            style={{ width: "100%", background: "none", border: "none", cursor: "none", padding: "14px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", color: "var(--muted)", fontSize: "0.78rem" }}
          >
            <span>Key contributions</span>
            <span style={{ transition: "transform 0.3s", transform: open ? "rotate(180deg)" : "rotate(0)" }}>↓</span>
          </button>
          <div style={{ overflow: "hidden", maxHeight: open ? "400px" : "0", transition: "max-height 0.5s cubic-bezier(0.16,1,0.3,1)" }}>
            <ul style={{ listStyle: "none", padding: "0 32px 24px", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {job.bullets.map((b, i) => (
                <li key={i} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                  <span style={{ color: job.accent, marginTop: "0.45em", flexShrink: 0, fontSize: "0.45rem" }}>▶</span>
                  <span style={{ fontSize: "0.82rem", lineHeight: 1.7, color: "var(--muted)" }}>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null);
  useRevealChildren(sectionRef, ".fade-up");

  return (
    <section id="experience" ref={sectionRef} style={{ padding: "var(--section-py) var(--section-px)", background: "var(--bg)" }}>
      <div style={{ maxWidth: "var(--max-w)", margin: "0 auto" }}>
        <div className="fade-up" style={{ marginBottom: "3.5rem" }}>
          <p className="section-label" style={{ marginBottom: "0.75rem" }}>Experience</p>
          <h2 style={{ fontSize: "clamp(1.8rem,4vw,2.5rem)", fontWeight: 700, letterSpacing: "-0.03em", color: "var(--text)" }}>Where I've made an impact</h2>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {jobs.map((j, i) => <JobCard key={j.n} job={j} idx={i} />)}
        </div>
      </div>
    </section>
  );
}
