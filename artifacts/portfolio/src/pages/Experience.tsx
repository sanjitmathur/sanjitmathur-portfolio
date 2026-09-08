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
 * Open, full-screen stage matching the About section design:
 * - NOT a card: no card borders, no card background box.
 * - Widget on LEFT: borderless high-DPI 3D canvas blending seamlessly into #050505 with atmospheric vignette.
 * - Text on RIGHT: typography on #050505, 3D scroll sync meter, and 3 synchronized bullets.
 * - No "PHASE XYZ" labels above bullets — just the clean bullet text directly.
 * - Perfectly constrained to fit 100% on the screen below the navbar without clipping.
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
    if (!container) return;

    let rafId: number;

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        if (!container) return;
        const rect = container.getBoundingClientRect();
        const totalScroll = container.offsetHeight - window.innerHeight;

        if (totalScroll <= 0) {
          setProgress(0);
          return;
        }

        const p = Math.max(0, Math.min(1, -rect.top / totalScroll));
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
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const totalScroll = container.offsetHeight - window.innerHeight;
    const targetP = (idx + 0.5) / 3;
    const targetY = window.scrollY + rect.top + targetP * totalScroll;
    window.scrollTo({ top: targetY, behavior: "smooth" });
  };

  const sliceNames = ["Architecture", "Auth & Security", "Reliability & QA"];

  return (
    <div ref={containerRef} className="publicis-pinned-container">
      <div ref={stickyRef} className="publicis-sticky-stage">
        {/* Open stage grid: Widget on LEFT, Text on RIGHT — NO CARD */}
        <div className="publicis-stage-grid">
          {/* LEFT: 3D Widget Canvas (Borderless, Atmospheric Vignette) */}
          <div className="publicis-widget-stage">
            <PublicisSapientWidget progress={progress} />
          </div>

          {/* RIGHT: Text Content, 3D Scroll Sync Meter, 3 Bullets */}
          <div className="publicis-text-stage">
            {/* Header: Company & Role */}
            <div style={{ marginBottom: 6 }}>
              <h2 style={{
                fontSize: "clamp(1.9rem, 3vw, 2.6rem)",
                fontWeight: 700,
                fontFamily: "var(--font-display, sans-serif)",
                letterSpacing: "-0.02em",
                color: "#ffffff",
                lineHeight: 1.15,
                margin: 0,
              }}>
                {job.co}
              </h2>

              <div style={{
                fontSize: "clamp(0.95rem, 1.25vw, 1.1rem)",
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
              }}>
                {job.tags.map((t, i) => (
                  <span key={t}>
                    {t}{i < job.tags.length - 1 && <span style={{ margin: "0 0.35rem", color: "rgba(255,255,255,0.2)" }}>·</span>}
                  </span>
                ))}
              </div>
            </div>

            {/* 3D Scroll Synchronization Meter */}
            <div className="publicis-sync-meter">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    background: "#6366f1",
                    boxShadow: "0 0 6px #6366f1",
                  }} />
                  <span style={{
                    fontFamily: "var(--font-mono, monospace)",
                    fontSize: "0.62rem",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    color: "#818cf8",
                    textTransform: "uppercase",
                  }}>
                    3D SCROLL SYNCHRONIZATION
                  </span>
                </div>
                <span style={{
                  fontFamily: "var(--font-mono, monospace)",
                  fontSize: "0.68rem",
                  fontWeight: 700,
                  color: "#ffffff",
                }}>
                  {Math.round(progress * 100)}%
                </span>
              </div>

              {/* Segmented progress bar */}
              <div style={{
                width: "100%",
                height: 4,
                background: "rgba(255, 255, 255, 0.08)",
                borderRadius: 2,
                overflow: "hidden",
                position: "relative",
              }}>
                <div style={{ position: "absolute", left: "33.33%", top: 0, bottom: 0, width: 1, background: "rgba(0,0,0,0.5)", zIndex: 2 }} />
                <div style={{ position: "absolute", left: "66.66%", top: 0, bottom: 0, width: 1, background: "rgba(0,0,0,0.5)", zIndex: 2 }} />
                <div style={{
                  width: `${progress * 100}%`,
                  height: "100%",
                  background: "linear-gradient(90deg, #6366f1 0%, #818cf8 50%, #a855f7 100%)",
                  boxShadow: "0 0 8px rgba(99, 102, 241, 0.8)",
                  transition: "width 0.05s linear",
                }} />
              </div>

              <div style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 4,
                fontSize: "0.56rem",
                color: "#787777",
                fontFamily: "var(--font-mono, monospace)",
              }}>
                <span>SLICES: [1] ARCH · [2] AUTH · [3] QA</span>
                <span style={{ color: "#818cf8" }}>
                  PHASE 0{activeIdx + 1}/03 // {sliceNames[activeIdx]}
                </span>
              </div>
            </div>

            {/* Key Contributions Label */}
            <div style={{
              color: "#787777",
              fontSize: "0.66rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: 8,
            }}>
              {keyContrib}
            </div>

            {/* 3 Synchronized Bullets — NO "PHASE XYZ" TEXT ABOVE THEM */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
              {bullets.map((b, i) => {
                const isActive = activeIdx === i;
                const sliceStart = i / 3;
                const sliceProgress = Math.max(0, Math.min(1, (progress - sliceStart) / (1 / 3)));

                return (
                  <div
                    key={i}
                    onClick={() => scrollToBullet(i)}
                    style={{
                      display: "flex",
                      gap: "0.75rem",
                      alignItems: "flex-start",
                      padding: "4px 0",
                      opacity: isActive ? 1 : 0.32,
                      transform: isActive ? "translateX(4px)" : "none",
                      transition: "opacity 0.25s ease, transform 0.25s ease",
                      cursor: "pointer",
                    }}
                  >
                    {/* Left Dot Indicator */}
                    <div style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: isActive ? "#6366f1" : "rgba(255, 255, 255, 0.2)",
                      boxShadow: isActive ? "0 0 8px #6366f1" : "none",
                      marginTop: "0.42rem",
                      flexShrink: 0,
                      transition: "all 0.25s ease",
                    }} />

                    {/* Direct Bullet Text — no extra labels above */}
                    <div style={{ flex: 1 }}>
                      <p style={{
                        margin: 0,
                        fontSize: "clamp(0.78rem, 0.95vw, 0.84rem)",
                        lineHeight: 1.55,
                        color: isActive ? "#ffffff" : "#a8a8a8",
                        fontWeight: isActive ? 500 : 400,
                        transition: "color 0.2s ease",
                      }}>
                        {b}
                      </p>

                      {/* Active slice progress underline bar */}
                      {isActive && (
                        <div style={{
                          marginTop: 5,
                          width: "100%",
                          maxWidth: 160,
                          height: 2,
                          background: "rgba(255, 255, 255, 0.08)",
                          borderRadius: 1,
                          overflow: "hidden",
                        }}>
                          <div style={{
                            width: `${sliceProgress * 100}%`,
                            height: "100%",
                            background: "linear-gradient(90deg, #6366f1, #a855f7)",
                            boxShadow: "0 0 6px #6366f1",
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
    <section id="experience" ref={sectionRef} style={{ background: "#050505", width: "100%", overflow: "hidden" }}>
      {/* 1. Publicis Sapient: Full-screen open stage (Widget on LEFT, Text on RIGHT) — NOT A CARD, LIKE ABOUT SECTION */}
      <PublicisPinnedJobCard
        job={jobMeta[0]}
        role={publicisTrans.role}
        type={publicisTrans.type}
        bullets={publicisTrans.bullets}
        keyContrib={te.keyContrib}
      />

      {/* 2. Remaining Commercial & Research Roles: Baraka, IndiGo, Lab */}
      <div style={{ padding: "var(--section-py) var(--section-px)", maxWidth: "var(--max-w)", margin: "0 auto" }}>
        <div className="fade-up" style={{ marginBottom: "3.5rem" }}>
          <p className="section-label" style={{ marginBottom: "0.85rem" }}>{te.label}</p>
          <h2 style={{ fontSize: "clamp(1.85rem,4vw,2.25rem)", fontWeight: 600, fontFamily: "var(--font-display)", letterSpacing: "-0.02em", color: "var(--text)" }}>
            {te.heading}
          </h2>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          {jobMeta.slice(1).map((j, i) => {
            const jt = jobTranslations[j.id];
            return <JobCard key={j.n} job={j} idx={i + 1} role={jt.role} type={jt.type} bullets={jt.bullets} keyContrib={te.keyContrib} />;
          })}
        </div>
      </div>
    </section>
  );
}
