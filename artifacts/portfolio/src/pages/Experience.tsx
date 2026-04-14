import { useRef } from "react";
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
  return (
    <div
      className="fade-up exp-timeline-entry"
      style={{ transitionDelay: `${idx * 0.14}s` }}
    >
      {/* Left: timeline column (hidden on mobile via CSS) */}
      <div className="exp-timeline-left">
        <div
          className="exp-timeline-dot"
          style={{ borderColor: job.accent, boxShadow: `0 0 8px ${job.accent}50` }}
        />
        <div style={{ fontSize: "0.72rem", color: "var(--muted)", textAlign: "right", lineHeight: 1.5 }}>
          {job.period.split(" - ").join(" –\n").split("\n").map((line, i) => (
            <span key={i}>{line}{i === 0 && <br />}</span>
          ))}
        </div>
        <div style={{ fontSize: "0.62rem", color: "var(--muted)", opacity: 0.5, textAlign: "right", marginTop: "0.2rem" }}>
          {job.loc}
        </div>
      </div>

      {/* Right: glass card */}
      <div className="exp-card-wrap-glass" style={{ paddingLeft: "2.5rem" }}>
        <div
          className="glass-border"
          style={{ "--card-accent": `${job.accent}59` } as React.CSSProperties}
        >
          <div className="glass-light-edge" />
          <div className="glass-glow" style={{ background: job.accent, top: "-80px", left: "-40px" }} />

          {/* Card grid: info + widget */}
          <div className="exp-card-inner">
            <div style={{
              padding: "clamp(16px, 4vw, 28px) clamp(16px, 4vw, 32px)",
              display: "flex", flexDirection: "column", justifyContent: "space-between",
              borderRight: "1px solid rgba(255,255,255,0.06)",
              background: "rgba(255,255,255,0.015)",
            }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
                  <div style={{ width: 5, height: 5, borderRadius: "50%", background: job.accent }} />
                  <span style={{ fontSize: "0.6rem", color: job.accent, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase" }}>{type}</span>
                </div>
                <div style={{
                  fontSize: "clamp(1.1rem,2vw,1.35rem)", fontWeight: 600,
                  fontFamily: "var(--font-display)", letterSpacing: "-0.01em",
                  color: "var(--text)", marginBottom: 4, lineHeight: 1.2,
                }}>{job.co}</div>
                <div style={{ fontSize: "0.82rem", color: "var(--muted)", marginBottom: 2 }}>{role}</div>
                {/* Show period/loc inline on mobile (timeline hidden) */}
                <div className="exp-mobile-meta" style={{ fontSize: "0.68rem", color: "var(--muted)", opacity: 0.5 }}>
                  {job.period} · {job.loc}
                </div>
              </div>
              <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginTop: 16 }}>
                {job.tags.map((t, i) => (
                  <span key={t} className="tag-inline">
                    {t}{i < job.tags.length - 1 && <span style={{ margin: "0 0.3rem", color: "var(--border-hover)" }}>·</span>}
                  </span>
                ))}
              </div>
            </div>

            {/* Widget */}
            <div style={{
              padding: 16, background: "rgba(0,0,0,0.25)",
              backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
              overflow: "hidden",
              contain: "size layout paint", minHeight: "clamp(180px, 26vw, 220px)", display: "flex",
              borderRadius: "0 14px 0 0",
            }}>
              <job.Widget />
            </div>
          </div>

          {/* Key contributions */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
            <div style={{
              padding: "14px clamp(16px, 4vw, 32px)",
              color: "var(--muted)", fontSize: "0.65rem", fontWeight: 500,
              letterSpacing: "0.08em", textTransform: "uppercase",
            }}>
              {keyContrib}
            </div>
            <ul style={{
              listStyle: "none", padding: "0 clamp(16px, 4vw, 32px) 24px",
              display: "flex", flexDirection: "column", gap: "0.45rem",
            }}>
              {bullets.map((b, i) => (
                <li key={i} style={{ display: "flex", gap: "0.7rem", alignItems: "flex-start" }}>
                  <span style={{
                    width: "10px", height: "1px", flexShrink: 0,
                    marginTop: "0.6em", background: job.accent, opacity: 0.4,
                  }} />
                  <span style={{ fontSize: "0.78rem", lineHeight: 1.65, color: "var(--muted)" }}>{b}</span>
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
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          {jobMeta.map((j, i) => {
            const jt = jobTranslations[j.id];
            return <JobCard key={j.n} job={j} idx={i} role={jt.role} type={jt.type} bullets={jt.bullets} keyContrib={te.keyContrib} />;
          })}
        </div>
      </div>
    </section>
  );
}
