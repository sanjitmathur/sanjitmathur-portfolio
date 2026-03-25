import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Magnetic from "../components/Magnetic";

gsap.registerPlugin(ScrollTrigger);

function SplitWord({ word, delay = 0, color = "var(--carbon)" }: { word: string; delay?: number; color?: string }) {
  return (
    <span style={{ display: "inline-block", overflow: "hidden", verticalAlign: "bottom" }}>
      <span className="split-word" style={{
        display: "inline-block",
        color,
        animationDelay: `${delay}ms`,
        animationFillMode: "both",
      }}>
        {word}
      </span>
    </span>
  );
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLDivElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const scrollLineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    // Scroll-driven parallax: name halves split apart
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: "top top",
        end: "bottom top",
        scrub: 1.2,
      },
    });

    tl.to(leftRef.current, { x: "-14vw", ease: "none" }, 0)
      .to(rightRef.current, { x: "14vw", ease: "none" }, 0)
      .to(nameRef.current, { y: "-12vh", ease: "none" }, 0)
      .to(subRef.current, { y: "-6vh", opacity: 0, ease: "none" }, 0)
      .to(metaRef.current, { y: "-4vh", opacity: 0, ease: "none" }, 0);

    return () => { ScrollTrigger.getAll().forEach(t => t.kill()); };
  }, []);

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  const colors = [
    { bg: "var(--fawn-20)", pos: "20% 15%" },
    { bg: "var(--carbon-06)", pos: "75% 70%" },
  ];

  return (
    <section ref={sectionRef} id="about" style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center", position: "relative", overflow: "hidden",
      background: "var(--bg)",
    }}>
      {/* Fine grid background */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: "linear-gradient(var(--carbon-06) 1px, transparent 1px), linear-gradient(90deg, var(--carbon-06) 1px, transparent 1px)",
        backgroundSize: "100px 100px",
      }} />

      {/* Ambient glows */}
      {colors.map((c, i) => (
        <div key={i} style={{
          position: "absolute", width: "55vw", height: "55vw", borderRadius: "50%",
          background: `radial-gradient(ellipse, ${c.bg} 0%, transparent 70%)`,
          left: c.pos.split(" ")[0], top: c.pos.split(" ")[1],
          transform: "translate(-50%,-50%)", pointerEvents: "none",
        }} />
      ))}

      {/* Floating meta — top right */}
      <div style={{
        position: "absolute", top: "clamp(5rem, 10vw, 7rem)", right: "clamp(1.5rem, 4vw, 4rem)",
        textAlign: "right", zIndex: 5,
        animation: "fadeUp 1s 2.2s cubic-bezier(0.16,1,0.3,1) both",
      }}>
        <div style={{ fontFamily: "var(--app-font-mono)", fontSize: "0.48rem", letterSpacing: "0.24em", color: "var(--fawn)", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "0.45rem", justifyContent: "flex-end" }}>
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--fawn)", display: "inline-block", animation: "blink 2.2s ease infinite" }} />
          Available for hire
        </div>
        <div style={{ fontFamily: "var(--app-font-mono)", fontSize: "0.44rem", letterSpacing: "0.14em", color: "var(--carbon-30)", marginTop: "0.25rem" }}>
          Dubai · UAE
        </div>
      </div>

      {/* Year — bottom left */}
      <div style={{
        position: "absolute", bottom: "clamp(5rem, 10vw, 7rem)", left: "clamp(1.5rem, 4vw, 4rem)",
        fontFamily: "var(--app-font-mono)", fontSize: "0.44rem", letterSpacing: "0.22em",
        color: "var(--carbon-30)", zIndex: 5,
        animation: "fadeUp 1s 2.4s cubic-bezier(0.16,1,0.3,1) both",
      }}>© 2025</div>

      {/* Main name block */}
      <div ref={nameRef} style={{
        position: "relative", zIndex: 10, textAlign: "center",
        padding: "0 clamp(1rem, 4vw, 3rem)", width: "100%",
      }}>
        {/* Label */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          gap: "1.2rem", marginBottom: "1.5rem",
          animation: "fadeUp 0.9s 0.4s cubic-bezier(0.16,1,0.3,1) both",
        }}>
          <div style={{ height: "1px", width: "40px", background: "var(--fawn-60)" }} />
          <span style={{ fontFamily: "var(--app-font-mono)", fontSize: "0.5rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--fawn)" }}>
            AI Engineer · Full-Stack Developer
          </span>
          <div style={{ height: "1px", width: "40px", background: "var(--fawn-60)" }} />
        </div>

        {/* Giant split name with scroll parallax */}
        <h1 style={{
          fontFamily: "var(--app-font-serif)",
          fontSize: "clamp(5rem, 15vw, 13rem)",
          fontWeight: 400, lineHeight: 0.86, letterSpacing: "-0.045em",
          marginBottom: "2.5rem", userSelect: "none",
        }}>
          <div ref={leftRef} style={{ display: "inline-block", willChange: "transform" }}>
            <SplitWord word="Sanjit" delay={200} />
          </div>
          {" "}
          <div ref={rightRef} style={{ display: "inline-block", willChange: "transform" }}>
            <SplitWord word="Mathur" delay={380} color="var(--fawn)" />
          </div>
        </h1>

        {/* Subtitle */}
        <div ref={subRef} style={{ marginBottom: "3rem", willChange: "transform, opacity" }}>
          <p style={{
            fontFamily: "var(--app-font-sans)", fontWeight: 300,
            fontSize: "clamp(0.85rem, 1.6vw, 1rem)",
            color: "var(--carbon-60)", maxWidth: "500px", margin: "0 auto",
            lineHeight: 1.9, letterSpacing: "0.02em",
            animation: "fadeUp 1s 0.9s cubic-bezier(0.16,1,0.3,1) both",
          }}>
            Building intelligent systems at the intersection of AI and human experience.
            Currently at <em style={{ color: "var(--fawn)", fontStyle: "normal" }}>Baraka Financial</em>, Dubai.
          </p>
        </div>

        {/* CTAs */}
        <div ref={metaRef} style={{
          display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap",
          animation: "fadeUp 1s 1.2s cubic-bezier(0.16,1,0.3,1) both",
          willChange: "transform, opacity",
        }}>
          <Magnetic strength={0.3}>
            <button
              className="btn-dark clickable"
              data-cursor="EXPLORE"
              onClick={() => scrollTo("experience")}
            >
              <span>View Work</span>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M1 11L11 1M11 1H4M11 1V8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
            </button>
          </Magnetic>
          <Magnetic strength={0.3}>
            <a href="https://linkedin.com/in/sanjit-mathur-/" target="_blank" rel="noopener noreferrer"
              className="btn-outline clickable" data-cursor="OPEN">
              <span>LinkedIn</span>
            </a>
          </Magnetic>
          <Magnetic strength={0.3}>
            <a href="https://github.com/sanjitmathur" target="_blank" rel="noopener noreferrer"
              className="btn-outline clickable" data-cursor="OPEN">
              <span>GitHub</span>
            </a>
          </Magnetic>
        </div>
      </div>

      {/* Scroll indicator */}
      <div ref={scrollLineRef} style={{
        position: "absolute", bottom: "2rem", left: "50%", transform: "translateX(-50%)",
        display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem",
        animation: "fadeUp 1s 2s cubic-bezier(0.16,1,0.3,1) both",
        zIndex: 10,
      }}>
        <span style={{ fontFamily: "var(--app-font-mono)", fontSize: "0.42rem", letterSpacing: "0.32em", textTransform: "uppercase", color: "var(--carbon-30)" }}>
          scroll
        </span>
        <div style={{ width: 1, height: 60, overflow: "hidden", position: "relative" }}>
          <div style={{
            width: "100%", height: "100%",
            background: "linear-gradient(to bottom, var(--carbon-30), transparent)",
            animation: "scrollLine 2s ease infinite",
          }} />
        </div>
      </div>

      {/* Marquee strip */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        borderTop: "1px solid var(--carbon-12)", overflow: "hidden",
        padding: "0.6rem 0", background: "var(--bg)",
        animation: "fadeUp 1s 2.5s cubic-bezier(0.16,1,0.3,1) both",
      }}>
        <div style={{ display: "flex", animation: "marquee 24s linear infinite", whiteSpace: "nowrap", width: "max-content" }}>
          {Array(4).fill("AI Engineering · Full-Stack · Python · TypeScript · Kubernetes · LLMs · Computer Vision · React · Dubai ·\u00a0").map((t, i) => (
            <span key={i} style={{ fontFamily: "var(--app-font-mono)", fontSize: "0.48rem", letterSpacing: "0.24em", textTransform: "uppercase", color: "var(--carbon-30)", paddingRight: "2rem" }}>{t}</span>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.2} }
        @keyframes scrollLine {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(200%); }
        }
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .split-word {
          animation: revealWord 1.1s cubic-bezier(0.16,1,0.3,1) both;
        }
        @keyframes revealWord {
          from { transform: translateY(110%) skewY(6deg); opacity: 0; }
          to   { transform: translateY(0) skewY(0deg); opacity: 1; }
        }
      `}</style>
    </section>
  );
}
