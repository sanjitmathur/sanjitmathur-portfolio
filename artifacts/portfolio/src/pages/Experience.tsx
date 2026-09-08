import { useEffect, useRef, useState } from "react";
import { useRevealChildren } from "../components/useReveal";
import { useLang } from "../components/LanguageContext";
import PublicisSapientWidget from "../components/widgets/PublicisSapientWidget";
import BarakaWidget from "../components/widgets/BarakaWidget";
import IndiGoWidget from "../components/widgets/IndiGoWidget";
import LabWidget from "../components/widgets/LabWidget";

type JobId = "publicis" | "baraka" | "indigo" | "lab";

const jobMeta: { id: JobId; n: string; co: string; period: string; loc: string; tags: string[]; accent: string; Widget: React.FC }[] = [
  { id: "publicis", n: "01", co: "Publicis Sapient", period: "Jul 2026 – Present", loc: "Dubai, UAE", tags: ["Node.js", "TypeScript", "PostgreSQL", "JWT", "REST APIs"], accent: "#6366f1", Widget: PublicisSapientWidget },
  { id: "baraka", n: "02", co: "Baraka Financial Ltd.", period: "Feb 2026 – Apr 2026", loc: "Dubai, UAE", tags: ["Kubernetes", "Microservices", "LLM", "Python", "TypeScript"], accent: "#d5b572", Widget: BarakaWidget },
  { id: "indigo", n: "03", co: "IndiGo InterGlobe Aviation Ltd.", period: "Aug – Sep 2025", loc: "Gurgaon, India", tags: ["Python", "Logistic Regression", "Pandas", "Feature Engineering"], accent: "#c4934a", Widget: IndiGoWidget },
  { id: "lab", n: "04", co: "Lab of Future", period: "Jun – Aug 2025", loc: "Dubai, UAE", tags: ["Node.js", "Express.js", "PostgreSQL"], accent: "#b8895a", Widget: LabWidget },
];

/**
 * PublicisPinnedJobCard:
 * Pinned 3D scroll experience where the card stays pinned in place while scrolling.
 * The scroll scrubs the 80 video frames of the 3D circuit widget and highlights each of the
 * 3 bullet points in synchronized, equal time slices (0.00-0.33, 0.33-0.67, 0.67-1.00).
 * Only when the entire widget scroll is complete does the page unpin and advance to Baraka.
 */
function PublicisPinnedJobCard({
  job,
  role,
  type,
  bullets,
  keyContrib,
}: {
  job: typeof jobMeta[0];
  role: string;
  type: string;
  bullets: string[];
  keyContrib: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    const sticky = stickyRef.current;
    if (!container || !sticky) return;

    let rafId: number;

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        if (!container || !sticky) return;
        const rect = container.getBoundingClientRect();
        const stickyTop = parseFloat(window.getComputedStyle(sticky).top) || 75;
        const scrollable = container.offsetHeight - sticky.offsetHeight;

        if (scrollable <= 0) {
          setProgress(0);
          return;
        }

        const currentScroll = stickyTop - rect.top;
        const p = Math.max(0, Math.min(1, currentScroll / scrollable));
        setProgress(p);
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    onScroll();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Divide the full scroll progress into 3 strictly equal time slices
  const activeIdx = progress < 1 / 3 ? 0 : progress < 2 / 3 ? 1 : 2;

  const scrollToBullet = (idx: number) => {
    const container = containerRef.current;
    const sticky = stickyRef.current;
    if (!container || !sticky) return;
    const rect = container.getBoundingClientRect();
    const stickyTop = parseFloat(window.getComputedStyle(sticky).top) || 75;
    const scrollable = container.offsetHeight - sticky.offsetHeight;
    const targetP = (idx + 0.5) / 3;
    const targetY = window.scrollY + rect.top - stickyTop + targetP * scrollable;
    window.scrollTo({ top: targetY, behavior: "smooth" });
  };

  const phaseNames = [
    "Architecture & Data",
    "Auth & RBAC Security",
    "Reliability & Testing",
  ];

  return (
    <div ref={containerRef} className="publicis-pinned-container">
      <div ref={stickyRef} className="publicis-sticky-stage">
        <div className="fade-up exp-timeline-entry" style={{ transitionDelay: "0s" }}>
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
                  borderRight: "1px solid var(--border)",
                  background: "var(--surface)",
                }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: job.accent }} />
                      <span style={{ fontSize: "0.62rem", color: job.accent, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>{type}</span>
                    </div>
                    <div style={{
                      fontSize: "clamp(1.15rem,2vw,1.4rem)", fontWeight: 700,
                      fontFamily: "var(--font-display)", letterSpacing: "-0.01em",
                      color: "var(--text)", marginBottom: 4, lineHeight: 1.2,
                    }}>{job.co}</div>
                    <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: 4, fontWeight: 500 }}>{role}</div>
                    {/* Show period/loc inline on mobile */}
                    <div className="exp-mobile-meta" style={{ fontSize: "0.72rem", color: "var(--muted)" }}>
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

                {/* Widget with scroll progress prop */}
                <div style={{
                  padding: 16, background: "var(--surface-2)",
                  overflow: "hidden",
                  contain: "size layout paint", minHeight: "clamp(180px, 26vw, 240px)", display: "flex",
                  borderRadius: "0 14px 0 0",
                }}>
                  <PublicisSapientWidget progress={progress} />
                </div>
              </div>

              {/* Key contributions & synchronized bullet highlighting */}
              <div style={{ borderTop: "1px solid var(--border)" }}>
                <div style={{
                  padding: "12px clamp(16px, 4vw, 32px)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderBottom: "1px solid var(--border)",
                }}>
                  <div style={{
                    color: "var(--muted)", fontSize: "0.68rem", fontWeight: 600,
                    letterSpacing: "0.08em", textTransform: "uppercase",
                  }}>
                    {keyContrib}
                  </div>
                  {/* Visual 3D scroll synchronization counter */}
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontFamily: "var(--font-mono, monospace)",
                    fontSize: "0.62rem",
                    color: "#818cf8",
                  }}>
                    <span>3D SCROLL SYNC</span>
                    <div style={{
                      width: 42,
                      height: 4,
                      background: "rgba(255, 255, 255, 0.1)",
                      borderRadius: 2,
                      overflow: "hidden",
                    }}>
                      <div style={{
                        width: `${progress * 100}%`,
                        height: "100%",
                        background: "#6366f1",
                        transition: "width 0.05s linear",
                      }} />
                    </div>
                    <span style={{ minWidth: 28, textAlign: "right" }}>{Math.round(progress * 100)}%</span>
                  </div>
                </div>

                <ul style={{
                  listStyle: "none",
                  padding: "10px clamp(16px, 4vw, 32px) 20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.55rem",
                }}>
                  {bullets.map((b, i) => {
                    const isActive = activeIdx === i;
                    const sliceStart = i / 3;
                    const sliceProgress = Math.max(0, Math.min(1, (progress - sliceStart) / (1 / 3)));

                    return (
                      <li
                        key={i}
                        onClick={() => scrollToBullet(i)}
                        style={{
                          display: "flex",
                          gap: "0.85rem",
                          alignItems: "flex-start",
                          padding: "10px 14px",
                          borderRadius: 8,
                          background: isActive ? "rgba(99, 102, 241, 0.08)" : "transparent",
                          borderLeft: isActive ? "3px solid #6366f1" : "3px solid transparent",
                          boxShadow: isActive ? "0 2px 14px rgba(99, 102, 241, 0.08)" : "none",
                          opacity: isActive ? 1 : 0.38,
                          transform: isActive ? "translateX(3px)" : "none",
                          transition: "all 0.26s cubic-bezier(0.16, 1, 0.3, 1)",
                          cursor: "pointer",
                        }}
                      >
                        <div style={{
                          width: 8,
                          height: isActive ? 8 : 2,
                          borderRadius: isActive ? "50%" : 1,
                          background: isActive ? "#6366f1" : "var(--border)",
                          boxShadow: isActive ? "0 0 10px rgba(99, 102, 241, 0.85)" : "none",
                          marginTop: isActive ? "0.45rem" : "0.6rem",
                          flexShrink: 0,
                          transition: "all 0.25s ease",
                        }} />
                        <div style={{ flex: 1 }}>
                          {isActive && (
                            <div style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              marginBottom: 4,
                            }}>
                              <span style={{
                                fontSize: "0.64rem",
                                fontFamily: "var(--font-mono, monospace)",
                                fontWeight: 700,
                                letterSpacing: "0.08em",
                                color: "#818cf8",
                                textTransform: "uppercase",
                              }}>
                                {`PHASE 0${i + 1} // ${phaseNames[i]}`}
                              </span>
                              <span style={{
                                fontSize: "0.62rem",
                                fontFamily: "var(--font-mono, monospace)",
                                color: "var(--muted)",
                              }}>
                                {`${Math.round(sliceProgress * 100)}%`}
                              </span>
                            </div>
                          )}
                          <span style={{
                            fontSize: "0.82rem",
                            lineHeight: 1.6,
                            color: isActive ? "var(--text)" : "var(--text-secondary)",
                            fontWeight: isActive ? 500 : 400,
                            transition: "color 0.2s ease",
                          }}>
                            {b}
                          </span>
                          {isActive && (
                            <div style={{
                              marginTop: 7,
                              width: "100%",
                              height: 2,
                              background: "rgba(255, 255, 255, 0.08)",
                              borderRadius: 2,
                              overflow: "hidden",
                            }}>
                              <div style={{
                                width: `${sliceProgress * 100}%`,
                                height: "100%",
                                background: "linear-gradient(90deg, #6366f1, #a855f7)",
                                boxShadow: "0 0 8px rgba(99, 102, 241, 0.8)",
                                transition: "width 0.05s linear",
                              }} />
                            </div>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

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
              borderRight: "1px solid var(--border)",
              background: "var(--surface)",
            }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: job.accent }} />
                  <span style={{ fontSize: "0.62rem", color: job.accent, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>{type}</span>
                </div>
                <div style={{
                  fontSize: "clamp(1.15rem,2vw,1.4rem)", fontWeight: 700,
                  fontFamily: "var(--font-display)", letterSpacing: "-0.01em",
                  color: "var(--text)", marginBottom: 4, lineHeight: 1.2,
                }}>{job.co}</div>
                <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: 4, fontWeight: 500 }}>{role}</div>
                {/* Show period/loc inline on mobile (timeline hidden) */}
                <div className="exp-mobile-meta" style={{ fontSize: "0.72rem", color: "var(--muted)" }}>
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
              padding: 16, background: "var(--surface-2)",
              overflow: "hidden",
              contain: "size layout paint", minHeight: "clamp(180px, 26vw, 220px)", display: "flex",
              borderRadius: "0 14px 0 0",
            }}>
              <job.Widget />
            </div>
          </div>

          {/* Key contributions */}
          <div style={{ borderTop: "1px solid var(--border)" }}>
            <div style={{
              padding: "14px clamp(16px, 4vw, 32px)",
              color: "var(--muted)", fontSize: "0.68rem", fontWeight: 600,
              letterSpacing: "0.08em", textTransform: "uppercase",
            }}>
              {keyContrib}
            </div>
            <ul style={{
              listStyle: "none", padding: "0 clamp(16px, 4vw, 32px) 24px",
              display: "flex", flexDirection: "column", gap: "0.55rem",
            }}>
              {bullets.map((b, i) => (
                <li key={i} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                  <span style={{
                    width: "8px", height: "2px", flexShrink: 0,
                    marginTop: "0.6em", background: job.accent, borderRadius: 1,
                  }} />
                  <span style={{ fontSize: "0.82rem", lineHeight: 1.65, color: "var(--text-secondary)" }}>{b}</span>
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
    publicis: te.publicis,
    baraka: te.baraka,
    indigo: te.indigo,
    lab: te.lab,
  };

  const publicisTrans = jobTranslations.publicis;

  return (
    <section id="experience" ref={sectionRef} style={{ padding: "var(--section-py) var(--section-px)", background: "var(--bg)" }}>
      <div style={{ maxWidth: "var(--max-w)", margin: "0 auto" }}>
        <div className="fade-up" style={{ marginBottom: "3.5rem" }}>
          <p className="section-label" style={{ marginBottom: "0.85rem" }}>{te.label}</p>
          <h2 style={{ fontSize: "clamp(1.85rem,4vw,2.25rem)", fontWeight: 600, fontFamily: "var(--font-display)", letterSpacing: "-0.02em", color: "var(--text)" }}>{te.heading}</h2>
        </div>
        <div>
          {/* Publicis: Pinned 3D scroll experience */}
          <PublicisPinnedJobCard
            job={jobMeta[0]}
            role={publicisTrans.role}
            type={publicisTrans.type}
            bullets={publicisTrans.bullets}
            keyContrib={te.keyContrib}
          />

          {/* Remaining roles: Baraka, IndiGo, Lab */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            {jobMeta.slice(1).map((j, i) => {
              const jt = jobTranslations[j.id];
              return <JobCard key={j.n} job={j} idx={i + 1} role={jt.role} type={jt.type} bullets={jt.bullets} keyContrib={te.keyContrib} />;
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
