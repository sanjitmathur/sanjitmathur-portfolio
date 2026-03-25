import { useRef, useState } from "react";
import { useRevealChildren } from "../components/useReveal";

const jobs = [
  {
    n: "01",
    role: "AI Engineering Intern",
    co: "Baraka Financial Ltd.",
    type: "FinTech · AI",
    period: "Feb 2026 – Present",
    loc: "Dubai, UAE",
    bullets: [
      "Deployed containerised services to Kubernetes; built AI tooling automating error classification and log analysis — eliminating manual triage across support workflows.",
      "Built Position Search and Trading Account Monitor integrating OMS, Instruments, and Wallet microservices.",
      "Unified inconsistent data schemas across distributed services into a single portfolio state model.",
    ],
    tags: ["Kubernetes", "Docker", "LLM APIs", "Python", "TypeScript"],
    accent: "#6366F1",
  },
  {
    n: "02",
    role: "Digital Intern",
    co: "IndiGo — InterGlobe Aviation",
    type: "Aviation · ML",
    period: "Aug – Sep 2025",
    loc: "Gurgaon, India",
    bullets: [
      "Built Logistic Regression model predicting on-time arrival (DEL–BOM) using 1,000 flight records — 88% accuracy.",
      "Engineered features from raw operational data: one-hot encoding of aircraft types, block-hour overrun computation.",
    ],
    tags: ["Python", "scikit-learn", "Pandas", "Feature Engineering"],
    accent: "#8B5CF6",
  },
  {
    n: "03",
    role: "Software Engineering Intern",
    co: "Lab of Future",
    type: "EdTech",
    period: "Jun – Aug 2025",
    loc: "Dubai, UAE",
    bullets: [
      "Built internal educational software used by 500+ students across 4 campuses.",
      "Reduced lesson-preparation time by 30% through component-driven architecture.",
    ],
    tags: ["React", "Node.js", "Full-Stack"],
    accent: "#A78BFA",
  },
];

function JobRow({ job, idx }: { job: typeof jobs[0]; idx: number }) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <div className="fade-up" style={{ borderBottom: "1px solid var(--border)", transitionDelay: `${idx * 0.08}s` }}>
      <div
        onClick={() => setOpen(!open)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: "grid", gridTemplateColumns: "auto 1fr auto auto", gap: "1.5rem", alignItems: "center",
          padding: "1.75rem 0", cursor: "none",
        }}
      >
        {/* Accent dot */}
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: job.accent, flexShrink: 0, boxShadow: hovered ? `0 0 10px ${job.accent}80` : "none", transition: "box-shadow 0.3s" }} />

        {/* Info */}
        <div>
          <div style={{ display: "flex", alignItems: "baseline", gap: "1rem", flexWrap: "wrap", marginBottom: "0.3rem" }}>
            <span style={{ fontSize: "clamp(1rem,2vw,1.15rem)", fontWeight: 600, color: hovered ? "var(--text)" : "var(--text)", letterSpacing: "-0.02em" }}>{job.co}</span>
            <span style={{ fontSize: "0.82rem", color: "var(--muted)" }}>{job.role}</span>
          </div>
          <div style={{ display: "flex", gap: "1rem" }}>
            <span style={{ fontSize: "0.72rem", fontWeight: 600, color: job.accent, letterSpacing: "0.06em", textTransform: "uppercase" }}>{job.type}</span>
            <span style={{ fontSize: "0.72rem", color: "var(--muted)" }}>{job.period} · {job.loc}</span>
          </div>
        </div>

        {/* Year */}
        <span style={{ fontSize: "0.78rem", color: "var(--muted)", whiteSpace: "nowrap" }}>{job.n}</span>

        {/* Toggle */}
        <div style={{
          width: 28, height: 28, borderRadius: "50%", border: "1px solid var(--border)",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          transition: "transform 0.3s ease, border-color 0.3s",
          transform: open ? "rotate(45deg)" : "rotate(0)",
          borderColor: open ? "rgba(99,102,241,0.5)" : undefined,
        }}>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M5 1v8M1 5h8" stroke={open ? "var(--accent)" : "var(--muted)"} strokeWidth="1.2" strokeLinecap="round" /></svg>
        </div>
      </div>

      {/* Expanded */}
      <div style={{ overflow: "hidden", maxHeight: open ? "350px" : "0", transition: "max-height 0.5s cubic-bezier(0.16,1,0.3,1)", paddingLeft: "2rem" }}>
        <div style={{ paddingBottom: "1.75rem" }}>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.65rem", marginBottom: "1.2rem" }}>
            {job.bullets.map((b, i) => (
              <li key={i} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                <span style={{ color: job.accent, marginTop: "0.5em", flexShrink: 0, fontSize: "0.5rem" }}>▶</span>
                <span style={{ fontSize: "0.875rem", lineHeight: 1.7, color: "var(--muted)" }}>{b}</span>
              </li>
            ))}
          </ul>
          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
            {job.tags.map(t => <span key={t} className="skill-pill" style={{ fontSize: "0.72rem" }}>{t}</span>)}
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
        <div style={{ borderTop: "1px solid var(--border)" }}>
          {jobs.map((j, i) => <JobRow key={j.n} job={j} idx={i} />)}
        </div>
      </div>
    </section>
  );
}
