import { useEffect, useRef, useState } from "react";
import { useMouse3D } from "../components/Mouse3DContext";

function Char({ char, i, delay }: { char: string; i: number; delay: number }) {
  const [on, setOn] = useState(false);
  useEffect(() => { const t = setTimeout(() => setOn(true), delay + i * 48); return () => clearTimeout(t); }, [i, delay]);
  return (
    <span style={{
      display: "inline-block",
      opacity: on ? 1 : 0,
      transform: on ? "translateY(0) translateZ(0) rotateX(0)" : "translateY(90px) translateZ(-140px) rotateX(-60deg)",
      transition: "opacity 0.95s cubic-bezier(0.16,1,0.3,1), transform 0.95s cubic-bezier(0.16,1,0.3,1)",
      transitionDelay: `${(delay + i * 48) / 1000}s`,
      transformOrigin: "50% 100%",
    }}>{char === " " ? "\u00a0" : char}</span>
  );
}

export default function Hero() {
  const mouse = useMouse3D();
  const subRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const [termLines, setTermLines] = useState(0);

  // Animate subtitle and cta in after name
  useEffect(() => {
    [subRef, ctaRef].forEach((r, i) => {
      const el = r.current; if (!el) return;
      el.style.opacity = "0"; el.style.transform = "translateY(28px)";
      setTimeout(() => {
        if (!el) return;
        el.style.transition = "opacity 1s cubic-bezier(0.16,1,0.3,1), transform 1s cubic-bezier(0.16,1,0.3,1)";
        el.style.opacity = "1"; el.style.transform = "translateY(0)";
      }, 1300 + i * 160);
    });
    // Terminal lines
    let n = 0;
    const t = setInterval(() => { n++; setTermLines(n); if (n >= 4) clearInterval(t); }, 420);
    return () => clearInterval(t);
  }, []);

  const termData = [
    { p: "→", text: "AI Engineer & Full-Stack Developer", c: "var(--fawn)" },
    { p: "$", text: "stack = ['LLMs', 'MLOps', 'K8s', 'React']", c: "var(--carbon-60)" },
    { p: "→", text: "Baraka Financial · Dubai", c: "var(--carbon-60)" },
    { p: "#", text: "UOWD · Computer & Autonomous Systems Eng.", c: "var(--carbon-30)" },
  ];

  const px = mouse.x * 9, py = -mouse.y * 9;
  const px2 = mouse.x * 18, py2 = -mouse.y * 18;

  return (
    <section id="about" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", background: "var(--bg)" }}>

      {/* Subtle grid */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "linear-gradient(var(--carbon-06) 1px, transparent 1px), linear-gradient(90deg, var(--carbon-06) 1px, transparent 1px)",
        backgroundSize: "80px 80px",
        transform: `translate(${mouse.x * 4}px, ${-mouse.y * 4}px)`,
        transition: "transform 0.15s linear",
        pointerEvents: "none",
      }} />

      {/* Fawn accent — large ellipse */}
      <div style={{
        position: "absolute", top: "-30%", right: "-15%",
        width: "70vw", height: "70vw",
        borderRadius: "50%",
        background: "radial-gradient(ellipse, var(--fawn-20) 0%, transparent 65%)",
        transform: `translate(${px2}px, ${py2}px)`,
        transition: "transform 0.12s linear",
        pointerEvents: "none",
      }} />

      {/* Floating status */}
      <div style={{ position: "absolute", top: "14%", right: "6%", transform: `translate(${px2}px, ${py2}px)`, transition: "transform 0.1s linear", zIndex: 5 }}>
        <div style={{ fontFamily: "var(--app-font-mono)", fontSize: "0.5rem", letterSpacing: "0.18em", color: "var(--fawn)", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "0.45rem" }}>
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--fawn)", animation: "blink 2s ease infinite", display: "inline-block" }} />
          Open to Work
        </div>
      </div>

      {/* Coordinates */}
      <div style={{ position: "absolute", bottom: "20%", left: "4%", transform: `translate(${px * 0.5}px, ${py * 0.5}px)`, transition: "transform 0.1s linear", zIndex: 5, fontFamily: "var(--app-font-mono)", fontSize: "0.48rem", letterSpacing: "0.14em", color: "var(--carbon-30)", lineHeight: 2 }}>
        25.2°N 55.3°E<br />Dubai, UAE
      </div>

      {/* Main block */}
      <div style={{
        position: "relative", zIndex: 10, textAlign: "center",
        padding: "0 2rem", maxWidth: "900px", width: "100%",
        perspective: "1000px",
        transform: `rotateX(${mouse.y * 3}deg) rotateY(${mouse.x * 4}deg)`,
        transition: "transform 0.1s linear",
      }}>
        {/* Label */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", marginBottom: "1.75rem", transform: `translate(${px * 0.2}px, ${py * 0.2}px)`, transition: "transform 0.1s linear" }}>
          <div style={{ height: "1px", width: "40px", background: "var(--fawn-60)" }} />
          <span className="sec-label">AI Engineer / Full-Stack</span>
          <div style={{ height: "1px", width: "40px", background: "var(--fawn-60)" }} />
        </div>

        {/* Giant name */}
        <h1 style={{
          fontFamily: "var(--app-font-serif)", fontSize: "clamp(4.5rem, 13vw, 11rem)",
          fontWeight: 400, lineHeight: 0.88, letterSpacing: "-0.045em", marginBottom: "2.25rem",
          perspective: "700px",
          transform: `translate(${px * 0.12}px, ${py * 0.12}px)`,
          transition: "transform 0.1s linear",
        }}>
          <div style={{ color: "var(--carbon)" }}>{"Sanjit".split("").map((c, i) => <Char key={i} char={c} i={i} delay={180} />)}</div>
          <div style={{ color: "var(--fawn)" }}><em style={{ fontStyle: "italic" }}>{"Mathur".split("").map((c, i) => <Char key={i} char={c} i={i} delay={480} />)}</em></div>
        </h1>

        {/* Terminal */}
        <div ref={subRef} style={{ marginBottom: "2.5rem" }}>
          <div style={{
            fontFamily: "var(--app-font-mono)", fontSize: "clamp(0.6rem,1.2vw,0.7rem)",
            lineHeight: 2.2, textAlign: "left", maxWidth: "480px", margin: "0 auto",
            padding: "1.2rem 1.4rem",
            border: "1px solid var(--carbon-12)",
            borderTop: "2px solid var(--carbon)",
            background: "rgba(248,242,225,0.6)", backdropFilter: "blur(6px)",
          }}>
            <div style={{ display: "flex", gap: "0.3rem", marginBottom: "0.8rem" }}>
              {[0.15, 0.1, 0.08].map((o, i) => <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: `rgba(32,31,20,${o})` }} />)}
            </div>
            {termData.slice(0, termLines).map((l, i) => (
              <div key={i} style={{ display: "flex", gap: "0.6rem", animation: "fadeInLine 0.3s ease" }}>
                <span style={{ color: "var(--fawn)", opacity: 0.8 }}>{l.p}</span>
                <span style={{ color: l.c }}>{l.text}</span>
              </div>
            ))}
            {termLines < termData.length && <span style={{ color: "var(--fawn)", animation: "blink 1.1s step-end infinite" }}>▌</span>}
          </div>
        </div>

        {/* CTAs */}
        <div ref={ctaRef} style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
          <a href="#experience" className="btn-dark clickable" onClick={e => { e.preventDefault(); document.getElementById("experience")?.scrollIntoView({ behavior: "smooth" }); }}>
            <span>View Work</span>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M1 6.5h11M6.5 1l5.5 5.5-5.5 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
          </a>
          <a href="https://linkedin.com/in/sanjit-mathur-/" target="_blank" rel="noopener noreferrer" className="btn-outline clickable"><span>LinkedIn</span></a>
          <a href="https://github.com/sanjitmathur" target="_blank" rel="noopener noreferrer" className="btn-outline clickable"><span>GitHub</span></a>
        </div>
      </div>

      {/* Scroll */}
      <div style={{ position: "absolute", bottom: "2rem", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.4rem", zIndex: 10 }}>
        <span style={{ fontFamily: "var(--app-font-mono)", fontSize: "0.46rem", letterSpacing: "0.28em", color: "var(--carbon-30)", textTransform: "uppercase" }}>scroll</span>
        <div style={{ width: "1px", height: "50px", background: "linear-gradient(to bottom, var(--carbon-30), transparent)", animation: "pulse 2.2s ease infinite" }} />
      </div>

      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes pulse { 0%,100%{opacity:0.2} 50%{opacity:0.8} }
        @keyframes fadeInLine { from{opacity:0;transform:translateX(-6px)} to{opacity:1;transform:translateX(0)} }
      `}</style>
    </section>
  );
}
