import { useRevealChildren } from "../components/useReveal";
import { useMouse3D } from "../components/Mouse3DContext";
import { useState } from "react";

const exp = [
  {
    n: "01",
    role: "AI Engineering Intern",
    co: "Baraka Financial Ltd.",
    loc: "Dubai · Feb 2026 – Present",
    type: "FinTech · AI",
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
    loc: "Gurgaon · Aug – Sep 2025",
    type: "Aviation · ML",
    bullets: [
      "Logistic Regression model to predict on-time arrival (DEL–BOM) using 1,000 flight records — 88% accuracy.",
      "Engineered features from raw operational data: one-hot encoding of aircraft types, block-hour overrun computation.",
    ],
    tags: ["Python", "scikit-learn", "Pandas", "Feature Engineering"],
  },
  {
    n: "03",
    role: "Software Engineering Intern",
    co: "Lab of Future",
    loc: "Dubai · Jun – Aug 2025",
    type: "EdTech",
    bullets: ["Built internal educational software used by 500+ students across 4 campuses."],
    tags: ["React", "Node.js", "Full-Stack"],
  },
];

function Row({ item, idx }: { item: typeof exp[0]; idx: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="r3d"
      style={{ borderTop: "1px solid var(--carbon-12)", cursor: "none", transitionDelay: `${idx * 0.1}s` }}
      onClick={() => setOpen(!open)}
    >
      {/* Header row */}
      <div style={{
        display: "grid", gridTemplateColumns: "4rem 1fr auto",
        alignItems: "center", gap: "2rem", padding: "2rem 0",
        transition: "opacity 0.2s",
      }}
        onMouseEnter={e => (e.currentTarget.style.opacity = "0.7")}
        onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
      >
        {/* Number */}
        <span style={{ fontFamily: "var(--app-font-mono)", fontSize: "0.6rem", letterSpacing: "0.2em", color: "var(--fawn)" }}>
          {item.n}
        </span>

        {/* Company + Role */}
        <div>
          <div style={{ display: "flex", alignItems: "baseline", gap: "1.25rem", flexWrap: "wrap" }}>
            <h3 style={{
              fontFamily: "var(--app-font-serif)",
              fontSize: "clamp(1.4rem, 3vw, 2.2rem)",
              fontWeight: 400, letterSpacing: "-0.025em",
              color: "var(--carbon)",
              transition: "color 0.3s",
            }}>
              {item.co}
            </h3>
            <span style={{ fontFamily: "var(--app-font-sans)", fontSize: "0.8rem", color: "var(--carbon-60)", fontWeight: 300 }}>
              {item.role}
            </span>
          </div>
          <span style={{ fontFamily: "var(--app-font-mono)", fontSize: "0.52rem", letterSpacing: "0.14em", color: "var(--fawn)", textTransform: "uppercase" }}>{item.type}</span>
          <span style={{ fontFamily: "var(--app-font-mono)", fontSize: "0.52rem", letterSpacing: "0.08em", color: "var(--carbon-30)", marginLeft: "1rem" }}>{item.loc}</span>
        </div>

        {/* Toggle */}
        <div style={{ width: 32, height: 32, border: "1px solid var(--carbon-12)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.35s ease", transform: open ? "rotate(45deg)" : "rotate(0deg)" }}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M6 1v10M1 6h10" stroke="var(--carbon)" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      {/* Expanded content */}
      <div style={{
        overflow: "hidden",
        maxHeight: open ? "600px" : "0",
        opacity: open ? 1 : 0,
        transition: "max-height 0.55s cubic-bezier(0.16,1,0.3,1), opacity 0.4s ease",
      }}>
        <div style={{ paddingBottom: "2.5rem", paddingLeft: "6rem" }}>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.65rem", marginBottom: "1.5rem" }}>
            {item.bullets.map((b, j) => (
              <li key={j} style={{ display: "flex", gap: "1rem", fontSize: "0.84rem", color: "var(--carbon-60)", lineHeight: 1.75, fontFamily: "var(--app-font-sans)", fontWeight: 300 }}>
                <span style={{ color: "var(--fawn)", flexShrink: 0 }}>—</span>{b}
              </li>
            ))}
          </ul>
          <div style={{ display: "flex", gap: "0.38rem", flexWrap: "wrap" }}>
            {item.tags.map(t => <span key={t} className="tag">{t}</span>)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Experience() {
  const ref = useRevealChildren(0.04);
  const mouse = useMouse3D();

  return (
    <section id="experience" style={{ padding: "9rem 0", background: "var(--bg-alt)", position: "relative", overflow: "hidden" }}>
      <div style={{
        position: "absolute", top: "20%", left: "-10%", width: "50vw", height: "80vh",
        background: "radial-gradient(ellipse, var(--fawn-20) 0%, transparent 65%)",
        transform: `translate(${mouse.x * 14}px, ${-mouse.y * 14}px)`,
        transition: "transform 0.15s linear", pointerEvents: "none",
      }} />

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 3rem" }}>
        <div ref={ref} style={{ perspective: "1400px" }}>
          {/* Heading */}
          <div className="r3d" style={{ marginBottom: "5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "1rem" }}>
              <span className="sec-label">02 / Experience</span>
              <div style={{ flex: 1, height: "1px", background: "var(--carbon-12)" }} />
            </div>
            <h2 style={{
              fontFamily: "var(--app-font-serif)",
              fontSize: "clamp(3rem, 7vw, 5.5rem)",
              fontWeight: 400, color: "var(--carbon)", letterSpacing: "-0.035em", lineHeight: 1.04,
            }}>
              Where I've<br /><em style={{ color: "var(--fawn)", fontStyle: "italic" }}>Worked</em>
            </h2>
          </div>

          {/* Rows — no cards */}
          {exp.map((e, i) => <Row key={i} item={e} idx={i} />)}
          <div style={{ borderTop: "1px solid var(--carbon-12)" }} />
        </div>
      </div>
    </section>
  );
}
