import { useRevealChildren } from "../components/useReveal";
import Tilt3DCard from "../components/Tilt3DCard";
import { useMouse3D } from "../components/Mouse3DContext";

const stats = [
  { v: "3+",   l: "Internships",         a: "fawn" },
  { v: "500+", l: "Students Reached",    a: "teal" },
  { v: "88%",  l: "ML Accuracy Achieved",a: "fawn" },
  { v: "2",    l: "Science Fair Awards", a: "teal" },
];

const groups = [
  { title: "AI & Machine Learning", icon: "◈", a: "teal", skills: ["Python", "TensorFlow", "PyTorch", "scikit-learn", "OpenAI API", "LLM Fine-Tuning", "Computer Vision", "Signal Processing"] },
  { title: "Full-Stack Engineering", icon: "◇", a: "fawn", skills: ["TypeScript", "React", "Next.js", "Node.js", "FastAPI", "PostgreSQL", "REST APIs", "WebSockets"] },
  { title: "Infrastructure & DevOps", icon: "◆", a: "teal", skills: ["Kubernetes", "Docker", "Linux", "CI/CD", "Git", "Microservices"] },
  { title: "Embedded & Hardware", icon: "◉", a: "fawn", skills: ["Raspberry Pi", "Arduino", "ROS", "ArduPilot", "BLE", "Sensor Fusion"] },
];

export default function Skills() {
  const ref = useRevealChildren(0.06);
  const mouse = useMouse3D();

  return (
    <section id="skills" style={{ padding: "9rem 0", background: "var(--bg-2)", position: "relative", overflow: "hidden" }}>
      <div style={{
        position: "absolute", top: "15%", left: "50%", transform: `translateX(-50%) translate(${mouse.x * 10}px, ${-mouse.y * 10}px)`,
        width: "700px", height: "500px",
        background: "radial-gradient(ellipse, rgba(196,168,130,0.07) 0%, transparent 65%)",
        transition: "transform 0.15s linear", pointerEvents: "none",
      }} />

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 2rem" }}>
        <div ref={ref} style={{ perspective: "1400px" }}>
          <div className="r3d" style={{ marginBottom: "4.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "1.25rem" }}>
              <span className="sec-label">04 / Skills</span>
              <div className="divider" />
            </div>
            <h2 style={{ fontFamily: "var(--app-font-serif)", fontSize: "clamp(2.8rem,6vw,5rem)", fontWeight: 400, color: "var(--carbon)", letterSpacing: "-0.03em", lineHeight: 1.06 }}>
              What I<br /><em style={{ color: "var(--fawn)" }}>Work With</em>
            </h2>
          </div>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1px", background: "var(--border-dim)", marginBottom: "4rem" }}>
            {stats.map((s, i) => {
              const c = s.a === "teal" ? "var(--teal)" : "var(--fawn-dark)";
              return (
                <Tilt3DCard key={i} className="r3d-flip" intensity={8} glare style={{ background: "var(--bg-3)", cursor: "none", transitionDelay: `${i * 0.08}s` }}>
                  <div style={{ padding: "2.25rem 1.75rem", textAlign: "center" }}>
                    <div style={{ fontFamily: "var(--app-font-serif)", fontSize: "clamp(2.5rem,5vw,3.5rem)", fontWeight: 400, color: c, letterSpacing: "-0.04em", lineHeight: 1, marginBottom: "0.45rem" }}>{s.v}</div>
                    <div style={{ fontFamily: "var(--app-font-mono)", fontSize: "0.54rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--iron)" }}>{s.l}</div>
                  </div>
                </Tilt3DCard>
              );
            })}
          </div>

          {/* Skill groups */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%,440px),1fr))", gap: "1px", background: "var(--border-dim)" }}>
            {groups.map((g, i) => {
              const c = g.a === "teal" ? "var(--teal)" : "var(--fawn-dark)";
              const cp = g.a === "teal" ? "var(--teal-pale)" : "var(--fawn)";
              return (
                <Tilt3DCard key={i} className="r3d" intensity={6} glare style={{ background: "var(--bg-3)", cursor: "none", transitionDelay: `${i * 0.09}s` }}>
                  <div style={{ padding: "2.25rem 2rem" }}>
                    <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", marginBottom: "1.5rem" }}>
                      <span style={{ fontSize: "0.9rem", color: c }}>{g.icon}</span>
                      <h3 style={{ fontFamily: "var(--app-font-sans)", fontSize: "0.84rem", fontWeight: 500, color: "var(--carbon-2)", letterSpacing: "0.02em" }}>{g.title}</h3>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.38rem" }}>
                      {g.skills.map(sk => (
                        <span key={sk} className="tag"
                          onMouseEnter={e => { e.currentTarget.style.background = "var(--carbon)"; e.currentTarget.style.color = "var(--bg)"; }}
                          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--iron)"; }}>
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                </Tilt3DCard>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
