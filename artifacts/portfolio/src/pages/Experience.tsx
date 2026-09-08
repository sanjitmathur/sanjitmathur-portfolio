import React, { useEffect, useRef, useState } from "react";
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
 * Open stage showcase matching the About section:
 * - NOT a card: no card borders, no card background box.
 * - Widget on LEFT: borderless high-DPI 3D canvas blending into #050505.
 * - Text on RIGHT: typography on #050505, 3D scroll sync meter, and 3 synchronized bullets.
 * - No "PHASE XYZ" labels above bullets — just the clean bullet text directly.
 * - Fits 100% on the screen below the navbar without clipping.
 * - Exact scroll synchronization math restored from commit 59f9c6d:
 *   currentScroll = stickyTop - rect.top, divided by scrollable = container.offsetHeight - sticky.offsetHeight.
 * - 3 strictly equal time slices (0.00-0.33, 0.33-0.67, 0.67-1.00).
 * - Only unpins to Baraka when the entire widget scroll finishes (progress = 1.0).
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
        const stickyTop = parseFloat(window.getComputedStyle(sticky).top) || (window.innerHeight / 2 - 250);
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

  // Divide into 3 strictly equal time slices (1/3 each)
  const activeIdx = progress < 1 / 3 ? 0 : progress < 2 / 3 ? 1 : 2;

  const scrollToBullet = (idx: number) => {
    const container = containerRef.current;
    const sticky = stickyRef.current;
    if (!container || !sticky) return;
    const rect = container.getBoundingClientRect();
    const stickyTop = parseFloat(window.getComputedStyle(sticky).top) || (window.innerHeight / 2 - 250);
    const scrollable = container.offsetHeight - sticky.offsetHeight;
    const targetP = (idx + 0.5) / 3;
    const targetY = window.scrollY + rect.top - stickyTop + targetP * scrollable;
    window.scrollTo({ top: targetY, behavior: "smooth" });
  };

  return (
    <div ref={containerRef} className="publicis-pinned-container">
      <div ref={stickyRef} className="publicis-sticky-stage">
        {/* Background 3D Plate Layer — Expansive, fades seamlessly into #050505 on right border */}
        <div className="publicis-bg-plate" aria-hidden="true">
          <div className="publicis-bg-widget">
            <PublicisSapientWidget progress={progress} />
          </div>
        </div>

        {/* Foreground Content — Aligned to the Right on #050505 */}
        <div className="publicis-content-stage">
          <div className="publicis-text-stage">
            {/* Header: Company & Role with Timeline presented next to Publicis Sapient on its right */}
            <div style={{ marginBottom: 6 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: job.accent }} />
                <span style={{ fontSize: "0.62rem", color: job.accent, fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase" }}>
                  {type} · {job.n}
                </span>
              </div>

              {/* Title & Timeline row: Timeline is placed directly next to the heading on its right */}
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "0.75rem",
                marginBottom: 4,
              }}>
                <h2 style={{
                  fontSize: "clamp(1.85rem, 2.8vw, 2.5rem)",
                  fontWeight: 700,
                  fontFamily: "var(--font-display, sans-serif)",
                  letterSpacing: "-0.02em",
                  color: "#ffffff",
                  lineHeight: 1.15,
                  margin: 0,
                }}>
                  {job.co}
                </h2>

                {/* Timeline info presented next to the heading on its right */}
                <div style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.45rem",
                  fontSize: "0.76rem",
                  color: "var(--muted)",
                  background: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  padding: "0.24rem 0.65rem",
                  borderRadius: "100px",
                  fontWeight: 500,
                  whiteSpace: "nowrap",
                }}>
                  <span style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: job.accent,
                    boxShadow: `0 0 6px ${job.accent}`,
                  }} />
                  <span style={{ color: "#d1d5db" }}>{job.period}</span>
                  <span style={{ color: "rgba(255, 255, 255, 0.25)" }}>·</span>
                  <span style={{ color: "var(--muted)", fontSize: "0.72rem" }}>{job.loc}</span>
                </div>
              </div>

              <div style={{
                fontSize: "clamp(0.92rem, 1.2vw, 1.05rem)",
                color: "#b8b7b7",
                fontWeight: 500,
                marginTop: 4,
                marginBottom: 4,
              }}>
                {role}
              </div>

              {/* Tags */}
              <div style={{
                display: "flex",
                gap: "0.4rem",
                flexWrap: "wrap",
                fontSize: "0.76rem",
                color: "#787777",
                marginBottom: 6,
              }}>
                {job.tags.map((t, i) => (
                  <span key={t}>
                    {t}{i < job.tags.length - 1 && <span style={{ margin: "0 0.35rem", color: "rgba(255,255,255,0.2)" }}>·</span>}
                  </span>
                ))}
              </div>
            </div>

            {/* Key Contributions & Synchronized Progress Header */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "1.1rem",
              marginBottom: "1rem",
              paddingBottom: "0.5rem",
              borderBottom: "1px solid rgba(255, 255, 255, 0.07)",
            }}>
              <span style={{
                color: "#8e8e8e",
                fontSize: "0.68rem",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}>
                {keyContrib}
              </span>

              {/* Minimalist 3D Sync Indicator */}
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontFamily: "var(--font-mono, monospace)",
                fontSize: "0.68rem",
                color: "#818cf8",
                letterSpacing: "0.06em",
              }}>
                <span style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#6366f1",
                  boxShadow: "0 0 8px #6366f1",
                  display: "inline-block",
                }} />
                <span>3D SYNC · {Math.round(progress * 100)}%</span>
              </div>
            </div>

            {/* 3 Synchronized Bullets — Larger Font Size & Integrated Progress */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.05rem" }}>
              {bullets.map((b, i) => {
                const isActive = activeIdx === i;
                const isPast = activeIdx > i;
                const sliceStart = i / 3;
                const sliceProgress = Math.max(0, Math.min(1, (progress - sliceStart) / (1 / 3)));

                return (
                  <div
                    key={i}
                    onClick={() => scrollToBullet(i)}
                    style={{
                      display: "flex",
                      gap: "0.85rem",
                      alignItems: "flex-start",
                      padding: "2px 0",
                      opacity: isActive ? 1 : 0.38,
                      transform: isActive ? "translateX(5px)" : "none",
                      transition: "opacity 0.25s ease, transform 0.25s ease",
                      cursor: "pointer",
                    }}
                  >
                    {/* Left Node Indicator */}
                    <div style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: isActive
                        ? "#6366f1"
                        : isPast
                        ? "rgba(99, 102, 241, 0.65)"
                        : "rgba(255, 255, 255, 0.22)",
                      boxShadow: isActive ? "0 0 10px #6366f1, 0 0 18px rgba(99, 102, 241, 0.55)" : "none",
                      marginTop: "0.48rem",
                      flexShrink: 0,
                      transition: "all 0.25s ease",
                    }} />

                    {/* Bullet Content with Increased Font Size */}
                    <div style={{ flex: 1 }}>
                      <p style={{
                        margin: 0,
                        fontSize: "clamp(0.92rem, 1.12vw, 1.02rem)",
                        lineHeight: 1.62,
                        color: isActive ? "#ffffff" : "#9e9e9e",
                        fontWeight: isActive ? 500 : 400,
                        transition: "color 0.2s ease",
                      }}>
                        {b}
                      </p>

                      {/* Active slice progress underline bar */}
                      {isActive && (
                        <div style={{
                          marginTop: 7,
                          width: "100%",
                          maxWidth: 220,
                          height: 2.5,
                          background: "rgba(255, 255, 255, 0.08)",
                          borderRadius: 2,
                          overflow: "hidden",
                        }}>
                          <div style={{
                            width: `${sliceProgress * 100}%`,
                            height: "100%",
                            background: "linear-gradient(90deg, #6366f1, #a855f7)",
                            boxShadow: "0 0 8px rgba(99, 102, 241, 0.9)",
                            transition: "width 0.05s linear",
                          }} />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
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
          <h2 style={{ fontSize: "clamp(1.85rem,4vw,2.25rem)", fontWeight: 600, fontFamily: "var(--font-display)", letterSpacing: "-0.02em", color: "var(--text)" }}>
            {te.heading}
          </h2>
        </div>
        <div>
          {/* Publicis Sapient: Open Stage Showcase (Widget on LEFT, Text on RIGHT) */}
          <PublicisPinnedJobCard
            job={jobMeta[0]}
            role={publicisTrans.role}
            type={publicisTrans.type}
            bullets={publicisTrans.bullets}
            keyContrib={te.keyContrib}
          />

          {/* Remaining Commercial & Research Roles: Baraka, IndiGo, Lab */}
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
