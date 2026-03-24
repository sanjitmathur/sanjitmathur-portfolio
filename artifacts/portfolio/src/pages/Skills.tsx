import { useRevealChildren } from "../components/useReveal";
import { useMouse3D } from "../components/Mouse3DContext";

// "2 Science Fair Awards" removed per user request
const stats = [
  { v: "3+",   l: "Internships",           c: "var(--fawn)"   },
  { v: "500+", l: "Students Reached",      c: "var(--carbon)" },
  { v: "88%",  l: "ML Model Accuracy",     c: "var(--fawn)"   },
];

const groups = [
  {
    title: "AI & Machine Learning",
    skills: ["Python", "TensorFlow", "PyTorch", "scikit-learn", "OpenAI API", "LLM Fine-Tuning", "Prompt Engineering", "Computer Vision", "Signal Processing"],
  },
  {
    title: "Full-Stack Engineering",
    skills: ["TypeScript", "React", "Next.js", "Node.js", "FastAPI", "PostgreSQL", "REST APIs", "WebSockets", "Streamlit"],
  },
  {
    title: "Infrastructure & DevOps",
    skills: ["Kubernetes", "Docker", "Linux", "CI/CD", "Git", "Microservices"],
  },
  {
    title: "Embedded & Hardware",
    skills: ["Raspberry Pi", "Arduino", "ROS", "ArduPilot", "BLE", "Sensor Fusion"],
  },
];

export default function Skills() {
  const ref = useRevealChildren(0.05);
  const mouse = useMouse3D();

  return (
    <section id="skills" style={{ padding: "9rem 0", background: "var(--bg-alt)", position: "relative", overflow: "hidden" }}>
      <div style={{
        position: "absolute", top: "25%", left: "50%",
        transform: `translateX(-50%) translate(${mouse.x * 10}px, ${-mouse.y * 10}px)`,
        width: "80vw", height: "60vh",
        background: "radial-gradient(ellipse, var(--fawn-20) 0%, transparent 65%)",
        transition: "transform 0.15s linear", pointerEvents: "none",
      }} />

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 3rem" }}>
        <div ref={ref} style={{ perspective: "1400px" }}>
          {/* Heading */}
          <div className="r3d" style={{ marginBottom: "5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "1rem" }}>
              <span className="sec-label">04 / Skills</span>
              <div style={{ flex: 1, height: "1px", background: "var(--carbon-12)" }} />
            </div>
            <h2 style={{ fontFamily: "var(--app-font-serif)", fontSize: "clamp(3rem, 7vw, 5.5rem)", fontWeight: 400, color: "var(--carbon)", letterSpacing: "-0.035em", lineHeight: 1.04 }}>
              What I<br /><em style={{ color: "var(--fawn)", fontStyle: "italic" }}>Work With</em>
            </h2>
          </div>

          {/* Stats — giant numbers directly on the page */}
          <div className="r3d" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0", borderTop: "1px solid var(--carbon-12)", borderLeft: "1px solid var(--carbon-12)", marginBottom: "6rem" }}>
            {stats.map((s, i) => (
              <div key={i} style={{
                borderRight: "1px solid var(--carbon-12)",
                borderBottom: "1px solid var(--carbon-12)",
                padding: "2.75rem 2rem",
                textAlign: "center",
                transition: "background 0.3s ease",
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(213,181,114,0.06)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
              >
                <div style={{ fontFamily: "var(--app-font-serif)", fontSize: "clamp(3rem, 6vw, 5rem)", fontWeight: 400, color: s.c, letterSpacing: "-0.05em", lineHeight: 1, marginBottom: "0.5rem" }}>
                  {s.v}
                </div>
                <div style={{ fontFamily: "var(--app-font-mono)", fontSize: "0.54rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--carbon-60)" }}>
                  {s.l}
                </div>
              </div>
            ))}
          </div>

          {/* Skill groups — no cards, just columns with title + floating tags */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%,480px), 1fr))", gap: "4rem 3rem" }}>
            {groups.map((g, i) => (
              <div key={i} className="r3d" style={{ transitionDelay: `${i * 0.1}s` }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
                  <div style={{ width: "24px", height: "1px", background: "var(--fawn)" }} />
                  <h3 style={{ fontFamily: "var(--app-font-mono)", fontSize: "0.6rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--fawn)" }}>
                    {g.title}
                  </h3>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                  {g.skills.map(sk => (
                    <span key={sk} className="tag"
                      onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = "var(--carbon)"; el.style.color = "var(--bg)"; el.style.borderColor = "var(--carbon)"; }}
                      onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = "transparent"; el.style.color = "var(--carbon-60)"; el.style.borderColor = "var(--carbon-12)"; }}>
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
