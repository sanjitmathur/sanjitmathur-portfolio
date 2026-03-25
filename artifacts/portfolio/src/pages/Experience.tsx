import { useRef, useState } from "react";
import { useRevealChildren } from "../components/useReveal";

const jobs = [
  {
    company: "Baraka Financial",
    logo: "B",
    role: "AI Engineering Intern",
    period: "Feb 2026 – Present",
    location: "Dubai, UAE",
    tags: ["Kubernetes", "Docker", "LLM APIs", "Python", "TypeScript"],
    description: "Deployed containerised services to Kubernetes; built AI tooling automating error classification and log analysis. Built Position Search and Trading Account Monitor integrating OMS, Instruments, and Wallet microservices.",
    color: "#d5b572",
  },
  {
    company: "IndiGo Airlines",
    logo: "6E",
    role: "Digital & Technology Intern",
    period: "Aug – Sep 2025",
    location: "Gurgaon, India",
    tags: ["Python", "scikit-learn", "Pandas", "Feature Engineering"],
    description: "Built a Logistic Regression model predicting on-time arrival (DEL–BOM) from 1,000 flight records — 88% accuracy. Engineered features from raw operational data.",
    color: "#a89060",
  },
  {
    company: "Lab of Future",
    logo: "L",
    role: "Software Engineering Intern",
    period: "Jun – Aug 2025",
    location: "Dubai, UAE",
    tags: ["React", "Node.js", "EdTech", "STEM"],
    description: "Built internal educational software used by 500+ students across 4 campuses. Reduced lesson-preparation time by 30% through component-driven architecture.",
    color: "#7a6a42",
  },
];

function GlassJobCard({ job, i }: { job: typeof jobs[0]; i: number }) {
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 2;
    if (cardRef.current) {
      cardRef.current.style.transform = `perspective(1200px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg) translateZ(10px)`;
    }
  };

  const resetTransform = () => {
    if (cardRef.current) cardRef.current.style.transform = "perspective(1200px) rotateY(0) rotateX(0) translateZ(0)";
    setHovered(false);
  };

  return (
    <div
      ref={cardRef}
      className={`r3d ${hovered ? "glass-gold glow-box" : "glass"}`}
      onMouseEnter={() => setHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={resetTransform}
      style={{
        padding: "clamp(1.6rem,3vw,2.4rem)", borderRadius: "2px",
        transition: "transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s, background 0.4s, border-color 0.4s",
        transitionDelay: `${i * 0.1}s`, transformStyle: "preserve-3d",
        willChange: "transform", cursor: "none", position: "relative", overflow: "hidden",
      }}
    >
      <div style={{
        position: "absolute", top: 0, right: 0, width: 160, height: 160, borderRadius: "50%",
        background: `radial-gradient(ellipse, ${job.color}28 0%, transparent 70%)`,
        pointerEvents: "none", opacity: hovered ? 1 : 0, transition: "opacity 0.5s",
      }} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.4rem", flexWrap: "wrap", gap: "0.75rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1.1rem" }}>
          <div style={{
            width: 44, height: 44, borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center",
            background: `${job.color}18`, border: `1px solid ${job.color}40`,
            fontFamily: "var(--app-font-mono)", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.06em", color: job.color,
          }}>{job.logo}</div>
          <div>
            <h3 style={{ fontFamily: "var(--app-font-serif)", fontSize: "clamp(1.1rem,2vw,1.3rem)", fontWeight: 400, color: "var(--text)", marginBottom: "0.15rem" }}>{job.company}</h3>
            <p style={{ fontFamily: "var(--app-font-mono)", fontSize: "0.48rem", letterSpacing: "0.16em", color: "var(--fawn)", textTransform: "uppercase" }}>{job.role}</p>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ fontFamily: "var(--app-font-mono)", fontSize: "0.48rem", letterSpacing: "0.1em", color: "var(--text-30)", textTransform: "uppercase" }}>{job.period}</p>
          <p style={{ fontFamily: "var(--app-font-mono)", fontSize: "0.44rem", color: "var(--text-30)", marginTop: "0.2rem" }}>{job.location}</p>
        </div>
      </div>

      <p style={{ fontFamily: "var(--app-font-sans)", fontSize: "0.82rem", lineHeight: 1.85, color: "var(--text-60)", marginBottom: "1.4rem" }}>{job.description}</p>

      <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
        {job.tags.map(t => <span key={t} className="tag">{t}</span>)}
      </div>
    </div>
  );
}

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null);
  useRevealChildren(sectionRef, ".r3d");

  return (
    <section id="experience" ref={sectionRef} style={{ padding: "clamp(6rem,12vw,9rem) clamp(1.5rem,6vw,5rem)", background: "var(--bg-2)", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "10%", right: "-5%", width: "35vw", height: "35vw", borderRadius: "50%", background: "radial-gradient(ellipse, rgba(213,181,114,0.04) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ maxWidth: "1140px", margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "1.2rem", marginBottom: "4rem" }}>
          <span className="r3d" style={{ fontFamily: "var(--app-font-mono)", fontSize: "0.44rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--fawn)" }}>02 / Experience</span>
          <div style={{ flex: 1, height: "1px", background: "var(--text-06)" }} />
        </div>
        <h2 className="r3d" style={{ fontFamily: "var(--app-font-serif)", fontSize: "clamp(2.5rem,6vw,4.5rem)", fontWeight: 400, color: "var(--text)", lineHeight: 0.95, letterSpacing: "-0.04em", marginBottom: "3.5rem", maxWidth: "560px" }}>
          Where I've<br /><em style={{ color: "var(--fawn)" }}>Made Impact</em>
        </h2>
        <div className="r3d" style={{ display: "flex", gap: "clamp(2rem,5vw,4rem)", marginBottom: "4rem", paddingBottom: "3rem", borderBottom: "1px solid var(--text-06)", flexWrap: "wrap" }}>
          {[["3+", "Internships"], ["500+", "Students Reached"], ["88%", "ML Accuracy"]].map(([num, label]) => (
            <div key={label}>
              <div style={{ fontFamily: "var(--app-font-serif)", fontStyle: "italic", fontSize: "clamp(2rem,4vw,2.8rem)", color: "var(--fawn)", lineHeight: 1, marginBottom: "0.3rem" }}>{num}</div>
              <div style={{ fontFamily: "var(--app-font-mono)", fontSize: "0.46rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-30)" }}>{label}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%,320px),1fr))", gap: "1.2rem" }}>
          {jobs.map((job, i) => <GlassJobCard key={job.company} job={job} i={i} />)}
        </div>
      </div>
    </section>
  );
}
