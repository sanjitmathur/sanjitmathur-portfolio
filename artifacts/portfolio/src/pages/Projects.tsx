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

/* ============================================================
   CINEMATIC CARD — full-bleed featured project
   ============================================================ */
function CinematicCard({ proj, title, category, description }: {
  proj: typeof projectMeta[0]; title: string; category: string; description: string;
}) {
  return (
    <div className="fade-up">
      <div
        className="proj-cinematic"
        style={{ "--card-accent": `${proj.accent}4d` } as React.CSSProperties}
      >
        {/* Widget as full background */}
        <div style={{
          position: "absolute", inset: 0,
          padding: "clamp(12px, 3vw, 20px)",
          background: "linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)",
          overflow: "hidden", contain: "layout paint",
        }}>
          <proj.Widget />
        </div>

        {/* Gradient overlay — text readable over widget */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 1,
          background: "linear-gradient(to right, rgba(10,10,10,0.92) 0%, rgba(10,10,10,0.65) 50%, rgba(10,10,10,0.15) 100%)",
        }} />

        {/* Content */}
        <div className="cine-content" style={{
          position: "relative", zIndex: 2,
          padding: "2.5rem 3rem",
          display: "flex", flexDirection: "column", justifyContent: "flex-end",
          minHeight: "440px", maxWidth: "520px",
        }}>
          <div style={{
            fontSize: "0.58rem", fontWeight: 500, color: proj.accent,
            letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.75rem",
          }}>
            {category} · {proj.year}
          </div>
          <h3 className="cine-title" style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.8rem, 3.5vw, 2.4rem)", fontWeight: 700,
            letterSpacing: "-0.02em", lineHeight: 1.1, marginBottom: "0.85rem",
            color: "#fafafa",
          }}>{title}</h3>
          <p style={{
            fontSize: "0.85rem", color: "#a1a1a1", lineHeight: 1.7, marginBottom: "1.25rem",
          }}>{description}</p>
          <div style={{ display: "flex", gap: "0.15rem", flexWrap: "wrap" }}>
            {proj.tags.map((t, i) => (
              <span key={t} style={{ fontSize: "0.62rem", color: "#717171" }}>
                {t}{i < proj.tags.length - 1 && <span style={{ margin: "0 0.25rem", color: "#444" }}>·</span>}
              </span>
            ))}
          </div>
        </div>

        {/* GitHub link */}
        <a href={proj.link} target="_blank" rel="noopener noreferrer" style={{
          position: "absolute", top: "1.5rem", right: "1.5rem", zIndex: 3,
          width: 32, height: 32,
          border: "1px solid rgba(255,255,255,0.1)", borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#717171", textDecoration: "none",
          transition: "border-color 0.25s, color 0.25s",
        }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.3)"; (e.currentTarget as HTMLElement).style.color = "#fafafa"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)"; (e.currentTarget as HTMLElement).style.color = "#717171"; }}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M1 9L9 1M9 1H4M9 1V6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
        </a>
      </div>
    </div>
  );
}

/* ============================================================
   GLASS CARD — regular project with animated border
   ============================================================ */
function GlassCard({ proj, title, category, description }: {
  proj: typeof projectMeta[0]; title: string; category: string; description: string;
}) {
  const [isTouch, setIsTouch] = useState(false);

  return (
    <div
      className="fade-up"
      onTouchStart={() => { if (!isTouch) setIsTouch(true); }}
      style={{ height: "100%" }}
    >
      <div
        className="glass-border"
        style={{
          height: "100%",
          display: "flex", flexDirection: "column",
          "--card-accent": `${proj.accent}59`,
        } as React.CSSProperties}
      >
        <div className="glass-light-edge" />
        <div className="glass-glow" style={{ background: proj.accent, top: "-60px", left: "-30px" }} />

        {/* Widget panel */}
        <div style={{
          height: "clamp(170px, 30vw, 210px)",
          background: "rgba(0,0,0,0.28)",
          backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
          flexShrink: 0, overflow: "hidden", contain: "layout paint",
          padding: "clamp(8px, 2vw, 14px)", position: "relative",
          borderRadius: "14px 14px 0 0",
        }}>
          <proj.Widget />
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0, height: "30px",
            background: "linear-gradient(to bottom, transparent, rgba(20,20,20,0.6))",
            pointerEvents: "none",
          }} />
        </div>

        {/* Info panel */}
        <div style={{
          padding: "clamp(16px, 3vw, 22px) clamp(16px, 3vw, 26px)",
          flex: 1, display: "flex", flexDirection: "column", gap: 10,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
                <span style={{ fontSize: "0.55rem", fontWeight: 500, color: proj.accent, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  {category}
                </span>
                <span style={{ fontSize: "0.52rem", color: "var(--muted)", opacity: 0.5 }}>· {proj.year}</span>
              </div>
              <h3 style={{
                fontSize: "1.1rem", fontWeight: 600,
                fontFamily: "var(--font-display)", letterSpacing: "-0.01em", color: "var(--text)",
              }}>{title}</h3>
            </div>
            <a href={proj.link} target="_blank" rel="noopener noreferrer"
              style={{
                width: 26, height: 26, border: "1px solid var(--border)", borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "var(--muted)", flexShrink: 0, textDecoration: "none",
                transition: "border-color 0.25s, color 0.25s",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = proj.accent; (e.currentTarget as HTMLElement).style.color = proj.accent; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; (e.currentTarget as HTMLElement).style.color = "var(--muted)"; }}
            >
              <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                <path d="M1 9L9 1M9 1H4M9 1V6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
            </a>
          </div>

          <p style={{ fontSize: "0.78rem", lineHeight: 1.65, color: "var(--muted)", flex: 1 }}>{description}</p>

          <div style={{ display: "flex", gap: "0.15rem", flexWrap: "wrap", paddingTop: 4, alignItems: "center" }}>
            {proj.tags.map((t, i) => (
              <span key={t} className="tag-inline">
                {t}{i < proj.tags.length - 1 && <span style={{ margin: "0 0.25rem", color: "var(--border-hover)", fontSize: "0.5rem" }}>·</span>}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   PROJECTS SECTION
   ============================================================ */
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

        {/* Featured: Cinematic cards */}
        <CinematicCard proj={fraud} title={tp.fraud.title} category={tp.fraud.cat} description={tp.fraud.desc} />
        <CinematicCard proj={forecast} title={tp.forecast.title} category={tp.forecast.cat} description={tp.forecast.desc} />

        {/* Row 2: Glass cards (3 col) */}
        <div className="proj-grid-3">
          {([
            { meta: examforge, t: tp.examforge },
            { meta: orvyn, t: tp.orvyn },
            { meta: f1, t: tp.f1 },
          ]).map(({ meta, t: pt }) => (
            <GlassCard key={meta.id} proj={meta} title={pt.title} category={pt.cat} description={pt.desc} />
          ))}
        </div>

        {/* Row 3: Glass cards (2 col) */}
        <div className="proj-grid-2">
          <GlassCard proj={spotify} title={tp.spotify.title} category={tp.spotify.cat} description={tp.spotify.desc} />
          <GlassCard proj={medair} title={tp.medair.title} category={tp.medair.cat} description={tp.medair.desc} />
        </div>
      </div>
    </section>
  );
}
