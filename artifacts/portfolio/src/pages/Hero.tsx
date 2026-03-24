import { useEffect, useRef, useState } from "react";
import Scene3D from "../components/Scene3D";
import { useMouse3D } from "../components/Mouse3DContext";

function Char3D({ char, index, delay = 0 }: { char: string; index: number; delay?: number }) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setOn(true), delay + index * 50);
    return () => clearTimeout(t);
  }, [index, delay]);
  return (
    <span style={{
      display: "inline-block",
      opacity: on ? 1 : 0,
      transform: on
        ? "translateY(0) translateZ(0) rotateX(0)"
        : "translateY(80px) translateZ(-120px) rotateX(-55deg)",
      transition: "opacity 1s cubic-bezier(0.16,1,0.3,1), transform 1s cubic-bezier(0.16,1,0.3,1)",
      transitionDelay: `${(delay + index * 50) / 1000}s`,
      transformOrigin: "50% 100%",
    }}>{char === " " ? "\u00a0" : char}</span>
  );
}

function Terminal() {
  const lines = [
    { p: "→", t: "AI Engineer & Full-Stack Developer", c: "var(--teal)" },
    { p: "$", t: "stack = ['LLMs', 'MLOps', 'Kubernetes', 'React']", c: "var(--iron)" },
    { p: "→", t: "currently @ Baraka Financial · Dubai", c: "var(--fawn-dark)" },
    { p: "#", t: "UOWD · Computer & Autonomous Systems Eng.", c: "var(--iron)" },
  ];
  const [n, setN] = useState(0);
  useEffect(() => {
    let i = 0;
    const t = setInterval(() => { i++; setN(i); if (i >= lines.length) clearInterval(t); }, 440);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{
      fontFamily: "var(--app-font-mono)", fontSize: "clamp(0.6rem,1.2vw,0.72rem)",
      lineHeight: 2.2, textAlign: "left", maxWidth: "500px", margin: "0 auto",
      padding: "1.25rem 1.5rem",
      background: "rgba(255,255,255,0.7)",
      border: "1px solid var(--border)",
      borderTop: "2px solid var(--carbon)",
      backdropFilter: "blur(8px)",
      boxShadow: "0 20px 60px rgba(15,14,13,0.08), 0 4px 12px rgba(15,14,13,0.05)",
    }}>
      {/* dots */}
      <div style={{ display: "flex", gap: "0.35rem", marginBottom: "0.9rem" }}>
        {["rgba(15,14,13,0.15)", "rgba(15,14,13,0.1)", "rgba(58,112,104,0.3)"].map((c, i) => (
          <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: c }} />
        ))}
      </div>
      {lines.slice(0, n).map((l, i) => (
        <div key={i} style={{ display: "flex", gap: "0.65rem", animation: "fadeIn 0.3s ease" }}>
          <span style={{ color: "var(--carbon)", opacity: 0.4 }}>{l.p}</span>
          <span style={{ color: l.c }}>{l.t}</span>
        </div>
      ))}
      {n < lines.length && (
        <span style={{ color: "var(--carbon)", animation: "blink 1.1s step-end infinite", opacity: 0.5 }}>▌</span>
      )}
      <style>{`
        @keyframes fadeIn { from { opacity:0; transform:translateX(-8px); } to { opacity:1; transform:translateX(0); } }
        @keyframes blink { 0%,100%{opacity:.5} 50%{opacity:0} }
      `}</style>
    </div>
  );
}

export default function Hero() {
  const mouse = useMouse3D();
  const subRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    [subRef, ctaRef].forEach((r, i) => {
      const el = r.current; if (!el) return;
      el.style.opacity = "0"; el.style.transform = "translateY(30px) translateZ(-40px)";
      setTimeout(() => {
        if (!el) return;
        el.style.transition = "opacity 1s cubic-bezier(0.16,1,0.3,1), transform 1s cubic-bezier(0.16,1,0.3,1)";
        el.style.opacity = "1"; el.style.transform = "translateY(0) translateZ(0)";
      }, 1200 + i * 150);
    });
  }, []);

  const tx = mouse.x * 8, ty = -mouse.y * 8;
  const tx2 = mouse.x * 16, ty2 = -mouse.y * 16;

  return (
    <section id="about" style={{ minHeight: "100vh", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", background: "var(--bg)" }}>
      <Scene3D />

      {/* Scroll-down gradient */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "25%", background: "linear-gradient(to top, var(--bg), transparent)", zIndex: 2, pointerEvents: "none" }} />

      {/* Floating badges */}
      <div style={{ position: "absolute", top: "14%", right: "6%", transform: `translate(${tx2}px,${ty2}px)`, transition: "transform 0.1s linear", zIndex: 5 }}>
        <div style={{ fontFamily: "var(--app-font-mono)", fontSize: "0.52rem", letterSpacing: "0.18em", color: "var(--teal)", textTransform: "uppercase", border: "1px solid rgba(58,112,104,0.25)", padding: "0.3rem 0.65rem", background: "rgba(240,235,227,0.8)", display: "flex", alignItems: "center", gap: "0.4rem", backdropFilter: "blur(8px)" }}>
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--teal)", animation: "blink2 2s ease infinite" }} />
          Open to Work
        </div>
      </div>

      <div style={{ position: "absolute", bottom: "18%", left: "4%", transform: `translate(${tx * 0.5}px,${ty * 0.5}px)`, transition: "transform 0.1s linear", zIndex: 5, fontFamily: "var(--app-font-mono)", fontSize: "0.5rem", letterSpacing: "0.14em", color: "var(--iron-dim)", lineHeight: 2 }}>
        25.2°N / 55.3°E<br />Dubai, UAE
      </div>

      {/* Name block — 3D tilt */}
      <div style={{
        position: "relative", zIndex: 10, textAlign: "center",
        padding: "0 2rem", maxWidth: "860px", width: "100%",
        perspective: "900px",
        transform: `rotateX(${mouse.y * 3}deg) rotateY(${mouse.x * 4}deg)`,
        transition: "transform 0.1s linear",
      }}>
        {/* Label */}
        <div style={{ marginBottom: "1.5rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", transform: `translate(${tx * 0.2}px,${ty * 0.2}px)`, transition: "transform 0.1s linear" }}>
          <div style={{ height: "1px", width: "36px", background: "rgba(58,112,104,0.4)" }} />
          <span className="sec-label">AI Engineer / Full-Stack Developer</span>
          <div style={{ height: "1px", width: "36px", background: "rgba(58,112,104,0.4)" }} />
        </div>

        {/* 3D letter name */}
        <h1 style={{
          fontFamily: "var(--app-font-serif)",
          fontSize: "clamp(4rem, 12vw, 10rem)",
          fontWeight: 400, lineHeight: 0.9, letterSpacing: "-0.04em",
          marginBottom: "2rem", perspective: "700px",
          transform: `translate(${tx * 0.15}px,${ty * 0.15}px)`,
          transition: "transform 0.1s linear",
        }}>
          <div>{"Sanjit".split("").map((c, i) => <Char3D key={i} char={c} index={i} delay={200} />)}</div>
          <div style={{ color: "var(--fawn)" }}><em style={{ fontStyle: "italic" }}>{"Mathur".split("").map((c, i) => <Char3D key={i} char={c} index={i} delay={520} />)}</em></div>
        </h1>

        {/* Terminal */}
        <div ref={subRef} style={{ marginBottom: "2.25rem" }}><Terminal /></div>

        {/* CTAs */}
        <div ref={ctaRef} style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
          <a href="#experience" className="btn-dark clickable" onClick={e => { e.preventDefault(); document.getElementById("experience")?.scrollIntoView({ behavior: "smooth" }); }}>
            <span>View Work</span>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M1 6.5h11M6.5 1l5.5 5.5-5.5 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
          </a>
          <a href="https://linkedin.com/in/sanjit-mathur-/" target="_blank" rel="noopener noreferrer" className="btn-ghost clickable"><span>LinkedIn</span></a>
          <a href="https://github.com/sanjitmathur" target="_blank" rel="noopener noreferrer" className="btn-ghost clickable"><span>GitHub</span></a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{ position: "absolute", bottom: "2rem", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.4rem", zIndex: 10 }}>
        <span style={{ fontFamily: "var(--app-font-mono)", fontSize: "0.48rem", letterSpacing: "0.28em", color: "var(--iron-dim)", textTransform: "uppercase" }}>scroll</span>
        <div style={{ width: "1px", height: "50px", background: "linear-gradient(to bottom, var(--carbon), transparent)", animation: "pulse 2.2s ease infinite" }} />
      </div>

      <style>{`
        @keyframes blink2 { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes pulse { 0%,100%{opacity:0.2} 50%{opacity:0.7} }
      `}</style>
    </section>
  );
}
