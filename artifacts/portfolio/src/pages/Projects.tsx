import { useRef, useState } from "react";
import { useRevealChildren } from "../components/useReveal";
import { useLang } from "../components/LanguageContext";
import FraudWidget from "../components/widgets/FraudWidget";
import ForecastWidget from "../components/widgets/ForecastWidget";
import ExamForgeWidget from "../components/widgets/ExamForgeWidget";
import OrvynWidget from "../components/widgets/OrvynWidget";
import F1Widget from "../components/widgets/F1Widget";
import SpotifyWidget from "../components/widgets/SpotifyWidget";
import MedAirWidget from "../components/widgets/MedAirWidget";

type ProjectId = "fraud" | "forecast" | "examforge" | "orvyn" | "f1" | "spotify" | "medair";

const projectMeta: { id: ProjectId; year: string; tags: string[]; link: string; accent: string; span: string; Widget: React.FC }[] = [
  { id: "fraud", year: "2025", tags: ["Python", "Scikit-learn", "Streamlit", "SHAP"], link: "https://github.com/sanjitmathur/distributed-anomaly-rca", accent: "#f59e0b", span: "col-large", Widget: FraudWidget },
  { id: "forecast", year: "2025", tags: ["Python", "XGBoost", "LightGBM", "FastAPI", "Streamlit"], link: "https://github.com/sanjitmathur/multi-domain-demand-forecasting", accent: "#6366f1", span: "col-medium-tall", Widget: ForecastWidget },
  { id: "examforge", year: "2025", tags: ["Python", "OpenAI API", "React", "FastAPI"], link: "https://github.com/sanjitmathur", accent: "#d5b572", span: "col-medium", Widget: ExamForgeWidget },
  { id: "orvyn", year: "2024", tags: ["Arduino", "C++", "Signal Processing", "sEMG"], link: "https://github.com/sanjitmathur", accent: "#d5b572", span: "col-medium", Widget: OrvynWidget },
  { id: "f1", year: "2025", tags: ["React", "Monte Carlo", "TypeScript", "FastAPI"], link: "https://github.com/sanjitmathur", accent: "#ef4444", span: "col-medium", Widget: F1Widget },
  { id: "spotify", year: "2024", tags: ["Python", "Spotify API", "Pandas", "Plotly"], link: "https://github.com/sanjitmathur", accent: "#1db954", span: "col-medium", Widget: SpotifyWidget },
  { id: "medair", year: "2024", tags: ["Python", "IoT", "Flight Control", "Raspberry Pi"], link: "https://github.com/sanjitmathur", accent: "#22c55e", span: "col-medium", Widget: MedAirWidget },
];

function ProjectCard({ proj, title, category, description }: {
  proj: typeof projectMeta[0]; title: string; category: string; description: string;
}) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouch) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientY - rect.top) / rect.height - 0.5;
    const y = (e.clientX - rect.left) / rect.width - 0.5;
    setTilt({ x: x * 5, y: y * 5 });
  };

  const isLarge = proj.span === "col-large";
  const isTall  = proj.span === "col-medium-tall";

  return (
    <div
      className="fade-up"
      onTouchStart={() => { if (!isTouch) setIsTouch(true); }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => { if (!isTouch) setHovered(true); }}
      onMouseLeave={() => { setTilt({ x: 0, y: 0 }); setHovered(false); }}
      style={{ height: "100%" }}
    >
      <div style={{
        height: "100%",
        background: "var(--surface)",
        border: `1px solid ${hovered ? `${proj.accent}33` : "var(--border)"}`,
        borderRadius: 14, overflow: "hidden",
        display: "flex", flexDirection: "column",
        transform: isTouch ? "none" : `perspective(1100px) rotateX(${-tilt.x}deg) rotateY(${tilt.y}deg) translateY(${hovered ? -4 : 0}px)`,
        transition: tilt.x === 0 && !hovered
          ? "transform 0.5s cubic-bezier(0.33,1,0.68,1), box-shadow 0.3s, border-color 0.25s"
          : "transform 0.06s linear, border-color 0.25s",
        boxShadow: hovered
          ? `0 24px 56px rgba(0,0,0,0.45), 0 0 0 1px ${proj.accent}18`
          : "none",
      }}>
        {/* Widget panel */}
        <div style={{
          height: "clamp(170px, 30vw, " + (isLarge ? "230px" : isTall ? "240px" : "210px") + ")",
          background: "rgba(0,0,0,0.3)",
          borderBottom: "1px solid var(--border)",
          flexShrink: 0,
          overflow: "hidden",
          contain: "layout paint",
          padding: "clamp(8px, 2vw, 14px)",
        }}>
          <proj.Widget />
        </div>

        {/* Info panel */}
        <div style={{ padding: "clamp(16px, 3vw, 24px) clamp(16px, 3vw, 26px)", flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
                <span style={{ fontSize: "0.6rem", fontWeight: 500, color: proj.accent, letterSpacing: "0.08em", textTransform: "uppercase" }}>{category}</span>
                <span style={{ fontSize: "0.55rem", color: "var(--muted)", opacity: 0.5 }}>· {proj.year}</span>
              </div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 600, fontFamily: "var(--font-display)", letterSpacing: "-0.01em", color: "var(--text)" }}>{title}</h3>
            </div>
            <a href={proj.link} target="_blank" rel="noopener noreferrer"
              style={{
                width: 30, height: 30, border: "1px solid var(--border)", borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "var(--muted)", flexShrink: 0, textDecoration: "none",
                transition: "border-color 0.2s, color 0.2s",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = proj.accent; (e.currentTarget as HTMLElement).style.color = proj.accent; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; (e.currentTarget as HTMLElement).style.color = "var(--muted)"; }}
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M1 9L9 1M9 1H4M9 1V6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
            </a>
          </div>

          <p style={{ fontSize: "0.82rem", lineHeight: 1.7, color: "var(--muted)", flex: 1 }}>{description}</p>

          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", paddingTop: 4 }}>
            {proj.tags.map(t => (
              <span key={t} className="skill-pill" style={{ fontSize: "0.65rem", padding: "0.25rem 0.7rem" }}>{t}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  useRevealChildren(sectionRef, ".fade-up");
  const { t } = useLang();

  const [fraud, forecast, examforge, orvyn, f1, spotify, medair] = projectMeta;

  const tp = t.projects;

  return (
    <section id="projects" ref={sectionRef} style={{ padding: "var(--section-py) var(--section-px)", background: "var(--bg)" }}>
      <div style={{ maxWidth: "var(--max-w)", margin: "0 auto" }}>

        {/* Header */}
        <div className="fade-up" style={{ marginBottom: "3.5rem" }}>
          <p className="section-label" style={{ marginBottom: "0.85rem" }}>{tp.label}</p>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
            <h2 style={{ fontSize: "clamp(1.85rem,4vw,2.25rem)", fontWeight: 600, fontFamily: "var(--font-display)", letterSpacing: "-0.02em", color: "var(--text)" }}>{tp.heading}</h2>
            <a href="https://github.com/sanjitmathur" target="_blank" rel="noopener noreferrer"
              className="btn-secondary clickable" style={{ fontSize: "0.8rem" }}>
              {tp.allGithub}
            </a>
          </div>
        </div>

        {/* Bento Row 1 */}
        <div className="bento-row-1">
          <div className="bento-cell-large"><ProjectCard proj={fraud} title={tp.fraud.title} category={tp.fraud.cat} description={tp.fraud.desc} /></div>
          <div className="bento-cell-tall"><ProjectCard proj={forecast} title={tp.forecast.title} category={tp.forecast.cat} description={tp.forecast.desc} /></div>
        </div>

        {/* Bento Row 2 */}
        <div className="bento-row-2">
          {([
            { meta: examforge, t: tp.examforge },
            { meta: orvyn, t: tp.orvyn },
            { meta: f1, t: tp.f1 },
          ]).map(({ meta, t: pt }) => (
            <div key={meta.id} className="bento-cell-medium">
              <ProjectCard proj={meta} title={pt.title} category={pt.cat} description={pt.desc} />
            </div>
          ))}
        </div>

        {/* Bento Row 3 */}
        <div className="bento-row-3">
          <div className="bento-cell-medium"><ProjectCard proj={spotify} title={tp.spotify.title} category={tp.spotify.cat} description={tp.spotify.desc} /></div>
          <div className="bento-cell-medium"><ProjectCard proj={medair} title={tp.medair.title} category={tp.medair.cat} description={tp.medair.desc} /></div>
        </div>

      </div>
    </section>
  );
}
