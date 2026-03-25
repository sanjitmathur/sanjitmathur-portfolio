import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Magnetic from "../components/Magnetic";
import HeroScene from "../components/HeroScene";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLSpanElement>(null);
  const rightRef = useRef<HTMLSpanElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLDivElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const tl = gsap.timeline({
      scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: 1.4 },
    });
    tl.to(leftRef.current,  { x: "-18vw", ease: "none" }, 0)
      .to(rightRef.current, { x:  "18vw", ease: "none" }, 0)
      .to(nameRef.current,  { y: "-16vh", ease: "none" }, 0)
      .to(subRef.current,   { y: "-8vh", opacity: 0, ease: "none" }, 0)
      .to(metaRef.current,  { y: "-5vh", opacity: 0, ease: "none" }, 0);

    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  }, []);

  const go = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section ref={sectionRef} id="about" style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      position: "relative", overflow: "hidden", background: "var(--bg)",
    }}>
      {/* Three.js / CSS fallback scene */}
      <HeroScene />

      {/* Vignette overlay so text stays readable */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 30%, rgba(20,18,9,0.75) 100%)",
        zIndex: 1,
      }} />

      {/* Status badge — top right */}
      <div style={{
        position: "absolute", top: "clamp(5rem,10vw,7rem)", right: "clamp(1.5rem,4vw,4rem)",
        zIndex: 10, textAlign: "right",
        animation: "fadeUp 1s 2.2s cubic-bezier(0.16,1,0.3,1) both",
      }}>
        <div style={{ fontFamily: "var(--app-font-mono)", fontSize: "0.46rem", letterSpacing: "0.26em", color: "var(--fawn)", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "0.45rem", justifyContent: "flex-end" }}>
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--fawn)", display: "inline-block", animation: "blink 2s ease infinite", boxShadow: "0 0 8px rgba(213,181,114,0.8)" }} />
          Available for hire
        </div>
        <div style={{ fontFamily: "var(--app-font-mono)", fontSize: "0.42rem", letterSpacing: "0.14em", color: "var(--text-30)", marginTop: "0.25rem" }}>Dubai · UAE · 25.2°N</div>
      </div>

      {/* Year */}
      <div style={{
        position: "absolute", bottom: "clamp(5rem,10vw,7rem)", left: "clamp(1.5rem,4vw,4rem)",
        fontFamily: "var(--app-font-mono)", fontSize: "0.42rem", letterSpacing: "0.22em",
        color: "var(--text-30)", zIndex: 10,
        animation: "fadeUp 1s 2.4s cubic-bezier(0.16,1,0.3,1) both",
      }}>© 2025</div>

      {/* Main text block */}
      <div style={{ position: "relative", zIndex: 10, textAlign: "center", padding: "0 clamp(1rem,4vw,3rem)", width: "100%" }}>

        {/* Label */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", marginBottom: "1.75rem", animation: "fadeUp 0.9s 0.3s cubic-bezier(0.16,1,0.3,1) both" }}>
          <div style={{ height: "1px", width: "36px", background: "var(--fawn-60)" }} />
          <span style={{ fontFamily: "var(--app-font-mono)", fontSize: "0.48rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--fawn)" }}>
            AI Engineer · Full-Stack Developer
          </span>
          <div style={{ height: "1px", width: "36px", background: "var(--fawn-60)" }} />
        </div>

        {/* Giant split name */}
        <h1 ref={nameRef} style={{
          fontFamily: "var(--app-font-serif)",
          fontSize: "clamp(5rem, 15.5vw, 13.5rem)",
          fontWeight: 400, lineHeight: 0.86, letterSpacing: "-0.045em",
          marginBottom: "2.25rem", userSelect: "none",
        }}>
          <div style={{ overflow: "hidden", display: "inline-block" }}>
            <span ref={leftRef} style={{ display: "inline-block", willChange: "transform", color: "var(--text)", animation: "revealWord 1.1s 0.4s cubic-bezier(0.16,1,0.3,1) both" }}>
              Sanjit
            </span>
          </div>
          {" "}
          <div style={{ overflow: "hidden", display: "inline-block" }}>
            <span ref={rightRef} style={{ display: "inline-block", willChange: "transform", color: "var(--fawn)", fontStyle: "italic", animation: "revealWord 1.1s 0.6s cubic-bezier(0.16,1,0.3,1) both" }}>
              Mathur
            </span>
          </div>
        </h1>

        {/* Subtitle */}
        <div ref={subRef} style={{ marginBottom: "2.8rem", willChange: "transform, opacity" }}>
          <p style={{
            fontFamily: "var(--app-font-sans)", fontWeight: 300,
            fontSize: "clamp(0.85rem,1.5vw,1rem)",
            color: "var(--text-60)", maxWidth: "480px", margin: "0 auto",
            lineHeight: 1.95, letterSpacing: "0.02em",
            animation: "fadeUp 1s 0.9s cubic-bezier(0.16,1,0.3,1) both",
          }}>
            Building intelligent systems at the intersection of AI and human experience.
            Currently at <em style={{ color: "var(--fawn)", fontStyle: "normal" }}>Baraka Financial</em>, Dubai.
          </p>
        </div>

        {/* CTAs */}
        <div ref={metaRef} style={{
          display: "flex", gap: "0.85rem", justifyContent: "center", flexWrap: "wrap",
          willChange: "transform, opacity",
          animation: "fadeUp 1s 1.1s cubic-bezier(0.16,1,0.3,1) both",
        }}>
          <Magnetic strength={0.3}>
            <button className="btn-dark clickable" data-cursor="EXPLORE" onClick={() => go("experience")}>
              <span>View Work</span>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 11L11 1M11 1H4M11 1V8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>
            </button>
          </Magnetic>
          <Magnetic strength={0.3}>
            <a href="https://linkedin.com/in/sanjit-mathur-/" target="_blank" rel="noopener noreferrer" className="btn-outline clickable" data-cursor="OPEN"><span>LinkedIn</span></a>
          </Magnetic>
          <Magnetic strength={0.3}>
            <a href="https://github.com/sanjitmathur" target="_blank" rel="noopener noreferrer" className="btn-outline clickable" data-cursor="OPEN"><span>GitHub</span></a>
          </Magnetic>
        </div>
      </div>

      {/* Scroll cue */}
      <div style={{
        position: "absolute", bottom: "2.2rem", left: "50%", transform: "translateX(-50%)",
        display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem",
        animation: "fadeUp 1s 2s cubic-bezier(0.16,1,0.3,1) both", zIndex: 10,
      }}>
        <span style={{ fontFamily: "var(--app-font-mono)", fontSize: "0.4rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--text-30)" }}>scroll</span>
        <div style={{ width: 1, height: 55, overflow: "hidden" }}>
          <div style={{ width: "100%", height: "100%", background: "linear-gradient(to bottom, var(--fawn-60), transparent)", animation: "scrollLine 2s ease infinite" }} />
        </div>
      </div>

      {/* Bottom marquee */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        borderTop: "1px solid var(--text-06)", overflow: "hidden",
        padding: "0.55rem 0", background: "rgba(20,18,9,0.6)", backdropFilter: "blur(8px)",
        zIndex: 10,
        animation: "fadeUp 0.8s 2.5s cubic-bezier(0.16,1,0.3,1) both",
      }}>
        <div style={{ display: "flex", animation: "marquee 28s linear infinite", whiteSpace: "nowrap", width: "max-content" }}>
          {Array(4).fill("AI Engineering · Full-Stack · Python · TypeScript · Kubernetes · LLMs · Computer Vision · React · Dubai ·\u00a0").map((t, i) => (
            <span key={i} style={{ fontFamily: "var(--app-font-mono)", fontSize: "0.46rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--text-30)", paddingRight: "2rem" }}>{t}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
