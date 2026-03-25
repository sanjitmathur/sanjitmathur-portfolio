import { useRef, useState } from "react";
import { useRevealChildren } from "../components/useReveal";

const jobs = [
  {
    n: "01",
    role: "AI Engineering Intern",
    co: "Baraka Financial Ltd.",
    type: "FinTech · AI",
    loc: "Dubai · Feb 2026 – Present",
    bullets: [
      "Deployed containerised services to Kubernetes; built AI tooling automating error classification and log analysis — eliminating manual triage across support workflows.",
      "Built Position Search and Trading Account Monitor integrating OMS, Instruments, and Wallet microservices.",
      "Unified inconsistent data schemas across distributed services into a single portfolio state model.",
    ],
    tags: ["Kubernetes", "Docker", "LLM APIs", "Python", "TypeScript"],
  },
  {
    n: "02",
    role: "Digital Intern",
    co: "IndiGo — InterGlobe Aviation",
    type: "Aviation · ML",
    loc: "Gurgaon · Aug – Sep 2025",
    bullets: [
      "Logistic Regression model predicting on-time arrival (DEL–BOM) using 1,000 flight records — 88% accuracy.",
      "Engineered features from raw operational data: one-hot encoding of aircraft types, block-hour overrun computation.",
    ],
    tags: ["Python", "scikit-learn", "Pandas", "Feature Engineering"],
  },
  {
    n: "03",
    role: "Software Engineering Intern",
    co: "Lab of Future",
    type: "EdTech",
    loc: "Dubai · Jun – Aug 2025",
    bullets: [
      "Built internal educational software used by 500+ students across 4 campuses.",
      "Reduced lesson-preparation time by 30% through component-driven architecture.",
    ],
    tags: ["React", "Node.js", "Full-Stack"],
  },
];

function Row({ item, idx }: { item: typeof jobs[0]; idx: number }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="r3d"
      style={{ borderTop: "1px solid var(--text-06)", transitionDelay: `${idx * 0.08}s` }}
    >
      <div
        onClick={() => setOpen(!open)}
        style={{ display: "grid", gridTemplateColumns: "3.5rem 1fr auto", alignItems: "center", gap: "2rem", padding: "2rem 0", cursor: "none" }}
        onMouseEnter={e => (e.currentTarget.style.opacity = "0.65")}
        onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
      >
        <span style={{ fontFamily: "var(--app-font-mono)", fontSize: "0.55rem", letterSpacing: "0.2em", color: "var(--fawn)" }}>{item.n}</span>
        <div>
          <div style={{ display: "flex", alignItems: "baseline", gap: "1.25rem", flexWrap: "wrap", marginBottom: "0.3rem" }}>
            <h3 style={{ fontFamily: "var(--app-font-serif)", fontSize: "clamp(1.3rem,2.8vw,2rem)", fontWeight: 400, letterSpacing: "-0.025em", color: "var(--text)" }}>{item.co}</h3>
            <span style={{ fontFamily: "var(--app-font-sans)", fontSize: "0.78rem", color: "var(--text-60)", fontWeight: 300 }}>{item.role}</span>
          </div>
          <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
            <span style={{ fontFamily: "var(--app-font-mono)", fontSize: "0.48rem", letterSpacing: "0.14em", color: "var(--fawn)", textTransform: "uppercase" }}>{item.type}</span>
            <span style={{ fontFamily: "var(--app-font-mono)", fontSize: "0.48rem", letterSpacing: "0.08em", color: "var(--text-30)" }}>{item.loc}</span>
          </div>
        </div>
        <div style={{ width: 30, height: 30, border: "1px solid var(--text-12)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "transform 0.35s cubic-bezier(0.16,1,0.3,1), border-color 0.3s", transform: open ? "rotate(45deg)" : "rotate(0)", borderColor: open ? "var(--fawn)" : undefined }}>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M5 1v8M1 5h8" stroke={open ? "var(--fawn)" : "var(--text-60)"} strokeWidth="1.1" strokeLinecap="round" /></svg>
        </div>
      </div>

      {/* Expanded */}
      <div style={{ overflow: "hidden", maxHeight: open ? "400px" : "0", transition: "max-height 0.55s cubic-bezier(0.16,1,0.3,1)", paddingLeft: "5.5rem" }}>
        <div style={{ paddingBottom: "2rem" }}>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.5rem" }}>
            {item.bullets.map((b, i) => (
              <li key={i} style={{ display: "flex", gap: "0.9rem", alignItems: "flex-start" }}>
                <span style={{ color: "var(--fawn)", marginTop: "0.35rem", flexShrink: 0, fontSize: "0.4rem" }}>◆</span>
                <span style={{ fontFamily: "var(--app-font-sans)", fontSize: "0.8rem", lineHeight: 1.85, color: "var(--text-60)" }}>{b}</span>
              </li>
            ))}
          </ul>
          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
            {item.tags.map(t => <span key={t} className="tag">{t}</span>)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null);
  useRevealChildren(sectionRef, ".r3d");

  return (
    <section id="experience" ref={sectionRef} style={{ padding: "clamp(6rem,12vw,9rem) clamp(1.5rem,6vw,5rem)", background: "var(--bg-2)" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

        <div style={{ display: "flex", alignItems: "baseline", gap: "1.5rem", marginBottom: "5rem" }}>
          <span className="r3d" style={{ fontFamily: "var(--app-font-mono)", fontSize: "0.44rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--fawn)" }}>02 / Experience</span>
          <div style={{ flex: 1, height: "1px", background: "var(--text-06)" }} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 6rem", alignItems: "start", marginBottom: "5rem" }}>
          <h2 className="r3d" style={{ fontFamily: "var(--app-font-serif)", fontSize: "clamp(2.8rem,6vw,4.8rem)", fontWeight: 400, lineHeight: 0.92, letterSpacing: "-0.04em", color: "var(--text)" }}>
            Where I've<br /><em style={{ color: "var(--fawn)" }}>Made<br />Impact</em>
          </h2>
          <div className="r3d" style={{ display: "flex", gap: "clamp(2.5rem,5vw,4rem)", alignItems: "flex-start", paddingTop: "0.5rem" }}>
            {[["3+", "Internships"], ["500+", "Students"], ["88%", "ML Accuracy"]].map(([n, l]) => (
              <div key={l}>
                <div style={{ fontFamily: "var(--app-font-serif)", fontStyle: "italic", fontSize: "clamp(2rem,4vw,3rem)", color: "var(--fawn)", lineHeight: 1 }}>{n}</div>
                <div style={{ fontFamily: "var(--app-font-mono)", fontSize: "0.42rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--text-30)", marginTop: "0.3rem" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ borderBottom: "1px solid var(--text-06)" }}>
          {jobs.map((j, i) => <Row key={j.n} item={j} idx={i} />)}
        </div>
      </div>
    </section>
  );
}
