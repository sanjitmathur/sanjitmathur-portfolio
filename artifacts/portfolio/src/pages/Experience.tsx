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
        const stickyTop = parseFloat(window.getComputedStyle(sticky).top) || (window.innerHeight / 2 - 212);
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
    const stickyTop = parseFloat(window.getComputedStyle(sticky).top) || (window.innerHeight / 2 - 212);
    const scrollable = container.offsetHeight - sticky.offsetHeight;
    const targetP = (idx + 0.5) / 3;
    const targetY = window.scrollY + rect.top - stickyTop + targetP * scrollable;
    window.scrollTo({ top: targetY, behavior: "smooth" });
  };

  return (
    <div ref={containerRef} className="publicis-pinned-container">
      <div ref={stickyRef} className="publicis-sticky-stage fade-up">
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

              {/* Title & Timeline row */}
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "0.45rem 0.75rem",
                marginBottom: 2,
              }}>
                <h2 style={{
                  fontSize: "clamp(1.75rem, 2.4vw, 2.25rem)",
                  fontWeight: 700,
                  fontFamily: "var(--font-display, sans-serif)",
                  letterSpacing: "-0.02em",
                  color: "#ffffff",
                  lineHeight: 1.15,
                  margin: 0,
                  whiteSpace: "nowrap",
                }}>
                  {job.co}
                </h2>

                {/* Timeline Pill */}
                <div style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  fontSize: "0.71rem",
                  color: "var(--muted)",
                  background: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  padding: "0.2rem 0.55rem",
                  borderRadius: "100px",
                  fontWeight: 500,
                  whiteSpace: "nowrap",
                  flexShrink: 0,
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
                  <span style={{ color: "var(--muted)", fontSize: "0.68rem" }}>{job.loc}</span>
                </div>
              </div>

              <div style={{
                fontSize: "clamp(0.88rem, 1.1vw, 0.98rem)",
                color: "#b8b7b7",
                fontWeight: 500,
                marginTop: 3,
                marginBottom: 6,
              }}>
                {role}
              </div>

              {/* Tags */}
              <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
                {job.tags.map((t) => (
                  <span
                    key={t}
                    style={{
                      fontSize: "0.68rem",
                      padding: "0.18rem 0.55rem",
                      borderRadius: "6px",
                      background: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      color: "#b0b0b0",
                      fontWeight: 500,
                      letterSpacing: "0.01em",
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Scroll Progress Meter Bar */}
            <div style={{
              margin: "12px 0 10px 0",
              background: "rgba(255, 255, 255, 0.05)",
              borderRadius: "100px",
              height: 3,
              width: "100%",
              overflow: "hidden",
            }}>
              <div style={{
                height: "100%",
                width: `${Math.round(progress * 100)}%`,
                background: "linear-gradient(90deg, #6366f1, #a855f7)",
                boxShadow: "0 0 10px rgba(99, 102, 241, 0.8)",
                transition: "width 0.06s linear",
              }} />
            </div>

            {/* Key Contributions Section Label */}
            <div style={{
              fontSize: "0.66rem",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#8e8e8e",
              marginBottom: 8,
            }}>
              {keyContrib}
            </div>

            {/* 3 Synchronized Bullets — Balanced & Filling the Stage Naturally */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
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
                      padding: "0.5rem 0.75rem",
                      borderRadius: "8px",
                      background: isActive
                        ? "rgba(255, 255, 255, 0.04)"
                        : "transparent",
                      border: isActive
                        ? "1px solid rgba(255, 255, 255, 0.08)"
                        : "1px solid transparent",
                      cursor: "pointer",
                      transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                      position: "relative",
                    }}
                  >
                    {/* Left Node Indicator */}
                    <div style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: isActive
                        ? job.accent
                        : isPast
                        ? `${job.accent}a6`
                        : "rgba(255, 255, 255, 0.22)",
                      boxShadow: isActive ? `0 0 10px ${job.accent}, 0 0 18px ${job.accent}8c` : "none",
                      marginTop: "0.4rem",
                      flexShrink: 0,
                      transition: "all 0.25s ease",
                    }} />

                    {/* Bullet Content */}
                    <div style={{ flex: 1 }}>
                      <p style={{
                        margin: 0,
                        fontSize: "clamp(0.85rem, 1.0vw, 0.94rem)",
                        lineHeight: 1.55,
                        color: isActive ? "#ffffff" : "#9e9e9e",
                        fontWeight: isActive ? 500 : 400,
                        transition: "color 0.2s ease",
                      }}>
                        {b}
                      </p>

                      {/* Active slice progress underline bar */}
                      {isActive && (
                        <div style={{
                          marginTop: 6,
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

/**
 * BarakaPinnedJobCard:
 * Open stage showcase matching Publicis Sapient:
 * - NOT a card: no card borders, no card background box.
 * - Widget on LEFT: borderless high-DPI 3D canvas rendering Baraka's video frames blending into #050505.
 * - Text on RIGHT: typography on #050505, 3D scroll sync meter, and 3 synchronized bullets.
 * - Fits 100% on the screen below the navbar without clipping.
 * - Exact scroll synchronization math matching Publicis Sapient:
 *   currentScroll = stickyTop - rect.top, divided by scrollable = container.offsetHeight - sticky.offsetHeight.
 * - 3 strictly equal time slices (0.00-0.33, 0.33-0.67, 0.67-1.00).
 * - Only unpins to IndiGo when the entire widget scroll finishes (progress = 1.0).
 */
function BarakaPinnedJobCard({
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
        const stickyTop = parseFloat(window.getComputedStyle(sticky).top) || (window.innerHeight / 2 - 212);
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
    const stickyTop = parseFloat(window.getComputedStyle(sticky).top) || (window.innerHeight / 2 - 212);
    const scrollable = container.offsetHeight - sticky.offsetHeight;
    const targetP = (idx + 0.5) / 3;
    const targetY = window.scrollY + rect.top - stickyTop + targetP * scrollable;
    window.scrollTo({ top: targetY, behavior: "smooth" });
  };

  return (
    <div ref={containerRef} id="exp-baraka" className="baraka-pinned-container">
      <div ref={stickyRef} className="baraka-sticky-stage fade-up">
        {/* Background 3D Plate Layer — Expansive, fades seamlessly into #050505 on right border */}
        <div className="baraka-bg-plate" aria-hidden="true">
          <div className="baraka-bg-widget">
            <BarakaWidget progress={progress} />
          </div>
        </div>

        {/* Foreground Content — Aligned to the Right on #050505 */}
        <div className="baraka-content-stage">
          <div className="baraka-text-stage">
            {/* Header: Company & Role with Timeline presented next to Baraka Financial on its right */}
            <div style={{ marginBottom: 6 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: job.accent }} />
                <span style={{ fontSize: "0.62rem", color: job.accent, fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase" }}>
                  {type} · {job.n}
                </span>
              </div>

              {/* Title & Timeline row — styled to keep Company & Timeline Pill side-by-side on the same line like Publicis */}
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "nowrap",
                gap: "0.75rem",
                marginBottom: 2,
              }}>
                <h2 style={{
                  fontSize: "clamp(1.75rem, 2.4vw, 2.25rem)",
                  fontWeight: 700,
                  fontFamily: "var(--font-display, sans-serif)",
                  letterSpacing: "-0.02em",
                  color: "#ffffff",
                  lineHeight: 1.15,
                  margin: 0,
                  whiteSpace: "nowrap",
                }}>
                  {job.co}
                </h2>

                {/* Timeline info */}
                <div style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.45rem",
                  fontSize: "0.74rem",
                  color: "var(--muted)",
                  background: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  padding: "0.22rem 0.6rem",
                  borderRadius: "100px",
                  fontWeight: 500,
                  whiteSpace: "nowrap",
                  flexShrink: 0,
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
                fontSize: "clamp(0.88rem, 1.1vw, 0.98rem)",
                color: "#b8b7b7",
                fontWeight: 500,
                marginTop: 3,
                marginBottom: 3,
              }}>
                {role}
              </div>

              {/* Tags */}
              <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
                {job.tags.map((t) => (
                  <span
                    key={t}
                    style={{
                      fontSize: "0.68rem",
                      padding: "0.18rem 0.55rem",
                      borderRadius: "6px",
                      background: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      color: "#b0b0b0",
                      fontWeight: 500,
                      letterSpacing: "0.01em",
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Scroll Progress Meter Bar */}
            <div style={{
              margin: "12px 0 10px 0",
              background: "rgba(255, 255, 255, 0.05)",
              borderRadius: "100px",
              height: 3,
              width: "100%",
              overflow: "hidden",
            }}>
              <div style={{
                height: "100%",
                width: `${Math.round(progress * 100)}%`,
                background: `linear-gradient(90deg, ${job.accent}, #eab308)`,
                boxShadow: `0 0 10px ${job.accent}`,
                transition: "width 0.06s linear",
              }} />
            </div>

            {/* Key Contributions Section Label */}
            <div style={{
              fontSize: "0.66rem",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#8e8e8e",
              marginBottom: 8,
            }}>
              {keyContrib}
            </div>

            {/* 3 Synchronized Bullets — Balanced & Filling the Stage Naturally */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
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
                      padding: "0.5rem 0.75rem",
                      borderRadius: "8px",
                      background: isActive
                        ? "rgba(255, 255, 255, 0.04)"
                        : "transparent",
                      border: isActive
                        ? "1px solid rgba(255, 255, 255, 0.08)"
                        : "1px solid transparent",
                      cursor: "pointer",
                      transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                      position: "relative",
                    }}
                  >
                    {/* Left Node Indicator */}
                    <div style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: isActive
                        ? job.accent
                        : isPast
                        ? `${job.accent}a6`
                        : "rgba(255, 255, 255, 0.22)",
                      boxShadow: isActive ? `0 0 10px ${job.accent}, 0 0 18px ${job.accent}8c` : "none",
                      marginTop: "0.4rem",
                      flexShrink: 0,
                      transition: "all 0.25s ease",
                    }} />

                    {/* Bullet Content */}
                    <div style={{ flex: 1 }}>
                      <p style={{
                        margin: 0,
                        fontSize: "clamp(0.85rem, 1.0vw, 0.94rem)",
                        lineHeight: 1.55,
                        color: isActive ? "#ffffff" : "#9e9e9e",
                        fontWeight: isActive ? 500 : 400,
                        transition: "color 0.2s ease",
                      }}>
                        {b}
                      </p>

                      {/* Active slice progress underline bar */}
                      {isActive && (
                        <div style={{
                          marginTop: 6,
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
                            background: `linear-gradient(90deg, ${job.accent}, #eab308)`,
                            boxShadow: `0 0 8px ${job.accent}`,
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

/**
 * IndiGoPinnedJobCard:
 * Open stage showcase matching Publicis Sapient and Baraka Financial:
 * - NOT a card: no card borders, no card background box.
 * - Widget on LEFT: borderless high-DPI 3D canvas rendering IndiGo's video frames blending into #050505.
 * - Text on RIGHT: typography on #050505, 3D scroll sync meter, and synchronized bullets.
 * - Exactly centered in viewport with 480px height (--stage-h: 480px).
 * - Exact scroll synchronization math matching Publicis & Baraka:
 *   currentScroll = stickyTop - rect.top, divided by scrollable = container.offsetHeight - sticky.offsetHeight.
 * - Equal time slices across bullets (1/N each).
 * - Clicking any bullet smoothly scrolls to that bullet's slice.
 */
function IndiGoPinnedJobCard({
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
        const stickyTop = parseFloat(window.getComputedStyle(sticky).top) || (window.innerHeight / 2 - 240);
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

  const sliceCount = bullets.length || 2;
  const activeIdx = Math.min(sliceCount - 1, Math.floor(progress * sliceCount));
  const sliceProgress = Math.max(0, Math.min(1, (progress - activeIdx / sliceCount) * sliceCount));

  const scrollToBullet = (idx: number) => {
    const container = containerRef.current;
    const sticky = stickyRef.current;
    if (!container || !sticky) return;
    const rect = container.getBoundingClientRect();
    const stickyTop = parseFloat(window.getComputedStyle(sticky).top) || (window.innerHeight / 2 - 240);
    const scrollable = container.offsetHeight - sticky.offsetHeight;
    const targetP = (idx + 0.5) / sliceCount;
    const targetY = window.scrollY + rect.top - stickyTop + targetP * scrollable;
    window.scrollTo({ top: targetY, behavior: "smooth" });
  };

  return (
    <div ref={containerRef} id="exp-indigo" className="indigo-pinned-container">
      <div ref={stickyRef} className="indigo-sticky-stage fade-up">
        {/* Background 3D Plate Layer — Expansive, fades seamlessly into #050505 on right border */}
        <div className="indigo-bg-plate" aria-hidden="true">
          <div className="indigo-bg-widget">
            <IndiGoWidget progress={progress} />
          </div>
        </div>

        {/* Foreground Content — Aligned to the Right on #050505 */}
        <div className="indigo-content-stage">
          <div className="indigo-text-stage">
            {/* Header: Company & Role with Timeline presented next to IndiGo on its right */}
            <div style={{ marginBottom: 6 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: job.accent }} />
                <span style={{ fontSize: "0.62rem", color: job.accent, fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase" }}>
                  {type} · {job.n}
                </span>
              </div>

              {/* Title & Timeline row */}
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "0.45rem 0.75rem",
                marginBottom: 2,
              }}>
                <h2 style={{
                  fontSize: "clamp(1.75rem, 2.4vw, 2.25rem)",
                  fontWeight: 700,
                  fontFamily: "var(--font-display, sans-serif)",
                  letterSpacing: "-0.02em",
                  color: "#ffffff",
                  lineHeight: 1.15,
                  margin: 0,
                  whiteSpace: "nowrap",
                }}>
                  {job.co}
                </h2>

                {/* Timeline info */}
                <div style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  fontSize: "0.71rem",
                  color: "var(--muted)",
                  background: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  padding: "0.2rem 0.55rem",
                  borderRadius: "100px",
                  fontWeight: 500,
                  whiteSpace: "nowrap",
                  flexShrink: 0,
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
                  <span style={{ color: "var(--muted)", fontSize: "0.68rem" }}>{job.loc}</span>
                </div>
              </div>

              <div style={{
                fontSize: "clamp(0.88rem, 1.1vw, 0.98rem)",
                color: "#b8b7b7",
                fontWeight: 500,
                marginBottom: 6,
              }}>
                {role}
              </div>

              {/* Tags */}
              <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
                {job.tags.map((t) => (
                  <span
                    key={t}
                    style={{
                      fontSize: "0.68rem",
                      padding: "0.18rem 0.55rem",
                      borderRadius: "6px",
                      background: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      color: "#b0b0b0",
                      fontWeight: 500,
                      letterSpacing: "0.01em",
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Scroll Progress Meter Bar */}
            <div style={{
              margin: "12px 0 10px 0",
              background: "rgba(255, 255, 255, 0.05)",
              borderRadius: "100px",
              height: 3,
              width: "100%",
              overflow: "hidden",
            }}>
              <div style={{
                height: "100%",
                width: `${Math.round(progress * 100)}%`,
                background: `linear-gradient(90deg, ${job.accent}, #eab308)`,
                boxShadow: `0 0 10px ${job.accent}`,
                transition: "width 0.06s linear",
              }} />
            </div>

            {/* Key Contributions Section Label */}
            <div style={{
              fontSize: "0.66rem",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#8e8e8e",
              marginBottom: 8,
            }}>
              {keyContrib}
            </div>

            {/* Bullet List */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
              {bullets.map((b, i) => {
                const isActive = i === activeIdx;
                const isPast = i < activeIdx;

                return (
                  <div
                    key={i}
                    onClick={() => scrollToBullet(i)}
                    style={{
                      display: "flex",
                      gap: "0.85rem",
                      alignItems: "flex-start",
                      padding: "0.5rem 0.75rem",
                      borderRadius: "8px",
                      background: isActive
                        ? "rgba(255, 255, 255, 0.04)"
                        : "transparent",
                      border: isActive
                        ? "1px solid rgba(255, 255, 255, 0.08)"
                        : "1px solid transparent",
                      cursor: "pointer",
                      transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                      position: "relative",
                    }}
                  >
                    {/* Active/Past Dot Indicator */}
                    <div style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: isActive
                        ? job.accent
                        : isPast
                        ? `${job.accent}a6`
                        : "rgba(255, 255, 255, 0.22)",
                      boxShadow: isActive ? `0 0 10px ${job.accent}, 0 0 18px ${job.accent}8c` : "none",
                      marginTop: "0.4rem",
                      flexShrink: 0,
                      transition: "all 0.25s ease",
                    }} />

                    {/* Bullet Content */}
                    <div style={{ flex: 1 }}>
                      <p style={{
                        margin: 0,
                        fontSize: "clamp(0.85rem, 1.0vw, 0.94rem)",
                        lineHeight: 1.55,
                        color: isActive ? "#ffffff" : "#9e9e9e",
                        fontWeight: isActive ? 500 : 400,
                        transition: "color 0.2s ease",
                      }}>
                        {b}
                      </p>

                      {/* Active slice progress underline bar */}
                      {isActive && (
                        <div style={{
                          marginTop: 6,
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
                            background: `linear-gradient(90deg, ${job.accent}, #eab308)`,
                            boxShadow: `0 0 8px ${job.accent}`,
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

function JobCard({
  job,
  idx,
  role,
  type,
  bullets,
  keyContrib,
}: {
  job: typeof jobMeta[0];
  idx: number;
  role: string;
  type: string;
  bullets: string[];
  keyContrib: string;
}) {
  return (
    <div
      id={`exp-${job.id}`}
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
  const barakaTrans = jobTranslations.baraka;
  const indigoTrans = jobTranslations.indigo;

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

          {/* Baraka Financial Ltd.: Open Stage Showcase (Widget on LEFT, Text on RIGHT) */}
          <BarakaPinnedJobCard
            job={jobMeta[1]}
            role={barakaTrans.role}
            type={barakaTrans.type}
            bullets={barakaTrans.bullets}
            keyContrib={te.keyContrib}
          />

          {/* IndiGo InterGlobe Aviation Ltd.: Open Stage Showcase (Widget on LEFT, Text on RIGHT) */}
          <IndiGoPinnedJobCard
            job={jobMeta[2]}
            role={indigoTrans.role}
            type={indigoTrans.type}
            bullets={indigoTrans.bullets}
            keyContrib={te.keyContrib}
          />

          {/* Remaining Commercial & Research Roles: Lab */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            {jobMeta.slice(3).map((j, i) => {
              const jt = jobTranslations[j.id];
              return <JobCard key={j.n} job={j} idx={i + 3} role={jt.role} type={jt.type} bullets={jt.bullets} keyContrib={te.keyContrib} />;
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
