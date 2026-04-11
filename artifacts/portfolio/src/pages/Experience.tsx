import { useRef, useState } from "react";
import { useRevealChildren } from "../components/useReveal";
import { useLang } from "../components/LanguageContext";
import BarakaWidget from "../components/widgets/BarakaWidget";
import IndiGoWidget from "../components/widgets/IndiGoWidget";
import LabWidget from "../components/widgets/LabWidget";

type JobId = "baraka" | "indigo" | "lab";

const jobMeta: { id: JobId; n: string; co: string; period: string; loc: string; tags: string[]; accent: string; Widget: React.FC }[] = [
  { id: "baraka", n: "01", co: "Baraka Financial Ltd.", period: "Feb 2026 - Apr 2026", loc: "Dubai, UAE", tags: ["Kubernetes", "Microservices", "LLM", "Python", "TypeScript"], accent: "#d5b572", Widget: BarakaWidget },
  { id: "indigo", n: "02", co: "IndiGo InterGlobe Aviation Ltd.", period: "Aug - Sep 2025", loc: "Gurgaon, India", tags: ["Python", "Logistic Regression", "Pandas", "Feature Engineering"], accent: "#c4934a", Widget: IndiGoWidget },
  { id: "lab", n: "03", co: "Lab of Future", period: "Jun - Aug 2025", loc: "Dubai, UAE", tags: ["Node.js", "Express.js", "PostgreSQL"], accent: "#b8895a", Widget: LabWidget },
];

function JobCard({ job, idx, role, type, bullets, keyContrib }: {
  job: typeof jobMeta[0]; idx: number; role: string; type: string; bullets: string[]; keyContrib: string;
}) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isTouch] = useState(() => typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouch) return;
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
        borderRadius: 14, overflow: "hidden",
        transform: isTouch ? "none" : `perspective(1200px) rotateX(${-tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: tilt.x === 0 ? "transform 0.5s cubic-bezier(0.33,1,0.68,1), box-shadow 0.3s" : "transform 0.05s linear",
        boxShadow: isTouch ? "none" : (tilt.x !== 0 || tilt.y !== 0 ? `0 20px 48px rgba(0,0,0,0.4), 0 0 0 1px ${job.accent}18` : "none"),
      }}>
        {/* Top: widget + header */}
        <div className="exp-card-inner">
          {/* Left: job info */}
          <div style={{ padding: "clamp(16px, 4vw, 28px) clamp(16px, 4vw, 32px)", display: "flex", flexDirection: "column", justifyContent: "space-between", borderRight: "1px solid var(--border)" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: job.accent, boxShadow: `0 0 10px ${job.accent}80` }} />
                <span style={{ fontSize: "0.65rem", color: job.accent, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>{type}</span>
              </div>
              <div style={{ fontSize: "clamp(1.1rem,2vw,1.3rem)", fontWeight: 600, fontFamily: "var(--font-display)", letterSpacing: "-0.01em", color: "var(--text)", marginBottom: 4, lineHeight: 1.2 }}>{job.co}</div>
              <div style={{ fontSize: "0.82rem", color: "var(--muted)", marginBottom: 2 }}>{role}</div>
              <div style={{ fontSize: "0.7rem", color: "var(--muted)", opacity: 0.6 }}>{job.period} · {job.loc}</div>
            </div>
            <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginTop: 16 }}>
              {job.tags.map(t => <span key={t} className="skill-pill" style={{ fontSize: "0.65rem" }}>{t}</span>)}
            </div>
          </div>

          {/* Right: interactive widget */}
          <div style={{ padding: 16, background: "var(--surface-2)", overflow: "hidden", contain: "size layout paint", minHeight: 220 }}>
            <job.Widget />
          </div>
        </div>

        {/* Key contributions */}
        <div style={{ borderTop: "1px solid var(--border)" }}>
          <div style={{ padding: "14px clamp(16px, 4vw, 32px)", color: "var(--muted)", fontSize: "0.78rem" }}>
            {keyContrib}
          </div>
          <ul style={{ listStyle: "none", padding: "0 clamp(16px, 4vw, 32px) 24px", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            {bullets.map((b, i) => (
              <li key={i} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                <span style={{ color: job.accent, marginTop: "0.45em", flexShrink: 0, fontSize: "0.45rem" }}>&#9654;</span>
                <span style={{ fontSize: "0.82rem", lineHeight: 1.7, color: "var(--muted)" }}>{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null);
  useRevealChildren(sectionRef, ".fade-up");
  const { t } = useLang();

  const te = t.experience;

  const jobTranslations: Record<JobId, { role: string; type: string; bullets: string[] }> = {
    baraka: te.baraka,
    indigo: te.indigo,
    lab: te.lab,
  };

  return (
    <section id="experience" ref={sectionRef} style={{ padding: "var(--section-py) var(--section-px)", background: "var(--bg)" }}>
      <div style={{ maxWidth: "var(--max-w)", margin: "0 auto" }}>
        <div className="fade-up" style={{ marginBottom: "3.5rem" }}>
          <p className="section-label" style={{ marginBottom: "0.85rem" }}>{te.label}</p>
          <h2 style={{ fontSize: "clamp(1.85rem,4vw,2.25rem)", fontWeight: 600, fontFamily: "var(--font-display)", letterSpacing: "-0.02em", color: "var(--text)" }}>{te.heading}</h2>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {jobMeta.map((j, i) => {
            const jt = jobTranslations[j.id];
            return <JobCard key={j.n} job={j} idx={i} role={jt.role} type={jt.type} bullets={jt.bullets} keyContrib={te.keyContrib} />;
          })}
        </div>
      </div>
    </section>
  );
}
