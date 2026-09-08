import React, { useEffect, useRef, useState } from "react";
import { useLang } from "../components/LanguageContext";

function TypewriterName({ name }: { name: string }) {
  const [displayed, setDisplayed] = useState("");
  const idx = useRef(0);

  useEffect(() => {
    idx.current = 0;
    setDisplayed("");
    const delay = setTimeout(() => {
      const id = setInterval(() => {
        idx.current += 1;
        setDisplayed(name.slice(0, idx.current));
        if (idx.current >= name.length) clearInterval(id);
      }, 85);
      return () => clearInterval(id);
    }, 250);
    return () => clearTimeout(delay);
  }, [name]);

  return (
    <span className="typewriter-text">
      {displayed}
      <span className="typewriter-caret" />
    </span>
  );
}

export default function Hero() {
  const { t } = useLang();

  const go = (id: string) => {
    const targetId =
      id === "experience" && document.getElementById("experience-transition")
        ? "experience-transition"
        : id;
    document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" });
  };

  const companies = [
    { name: "Publicis Sapient", color: "#6366f1" },
    { name: "Baraka Financial", color: "#d5b572" },
    { name: "IndiGo Airlines", color: "#c4934a" },
    { name: "Lab of Future", color: "#38bdf8" },
    { name: "Zywa", color: "#a855f7" },
  ];

  return (
    <section id="about" className="hero-section">
      <style>{`
        .hero-section {
          --hero-bg: #050505;
          --hero-text: #fafafa;
          --hero-muted: #a7a6a6;
          --hero-border: rgba(255, 255, 255, 0.12);

          /* Reference design units from comp: 1487 x 1058 */
          --u: calc(100vh / 1058);
          --uw: calc(100vw / 1487);
          --h: clamp(var(--u), calc(var(--u) * .65 + var(--uw) * .35), calc(var(--u) * 1.16));

          position: relative;
          min-height: 100vh;
          width: 100%;
          display: flex;
          align-items: center;
          background: var(--hero-bg);
          color: var(--hero-text);
          overflow: hidden;
          padding: 0 var(--section-px, 5vw);
          box-sizing: border-box;
        }

        @supports (height: 100dvh) {
          .hero-section {
            --u: calc(100dvh / 1058);
          }
        }

        /* Full-bleed looping video background matching comp geometry */
        .hero-plate {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
          z-index: 0;
        }

        .hero-video {
          position: absolute;
          left: 50%;
          top: calc(1 * var(--u));
          width: calc(1492 * var(--u));
          height: calc(1054 * var(--u));
          transform: translateX(calc(-50% - (0.5 * var(--u))));
          object-fit: cover;
          pointer-events: none;
          opacity: 1;
        }

        @media (max-aspect-ratio: 11/10) {
          .hero-video {
            inset: 0;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            transform: none;
            object-fit: cover;
            object-position: 43% center;
          }
        }

        /* Dual atmospheric fade overlays matching comp specifications */
        .hero-plate::after {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 1;
          background-image:
            /* 1) Bottom fade - transparent 78.8% so video mist & smoke are completely clear, smoothly fading to #050505 */
            linear-gradient(to bottom,
              rgba(5,5,5,0) 78.8%,
              rgba(5,5,5,.23) 79.6%,
              rgba(5,5,5,.45) 81.4%,
              rgba(5,5,5,.75) 83.3%,
              rgba(5,5,5,.84) 85.2%,
              rgba(5,5,5,.888) 88%,
              rgba(5,5,5,.905) 91%,
              rgba(5,5,5,.96) 95%,
              #050505 100%),
            /* 2) Side letterbox to seamless #050505 */
            linear-gradient(to right,
              #050505 calc(50% - (746 * var(--u))),
              transparent calc(50% - (676 * var(--u))),
              transparent calc(50% + (676 * var(--u))),
              #050505 calc(50% + (746 * var(--u)))),
            /* 3) Subtle left vignette for pristine text legibility */
            linear-gradient(to right,
              rgba(5,5,5,0.85) 0%,
              rgba(5,5,5,0.6) 22%,
              rgba(5,5,5,0.15) 38%,
              transparent 55%);
        }

        /* ==========================================================
           VOLUMETRIC ANIMATED SMOKE & GROUND FOG AT THE BOTTOM
           ========================================================== */
        .hero-smoke-atmosphere {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: clamp(200px, 34vh, 360px);
          pointer-events: none;
          overflow: hidden;
          z-index: 2;
        }

        .hero-smoke-layer {
          position: absolute;
          inset: 0;
          pointer-events: none;
          will-change: transform, opacity;
        }

        /* Rolling ground fog across the floor */
        .smoke-base-mist {
          background:
            radial-gradient(ellipse 70% 65% at 54% 96%, rgba(225, 235, 250, 0.22) 0%, rgba(175, 190, 215, 0.12) 40%, transparent 75%),
            radial-gradient(ellipse 55% 50% at 20% 92%, rgba(195, 210, 230, 0.15) 0%, transparent 62%),
            radial-gradient(ellipse 60% 55% at 85% 90%, rgba(215, 230, 250, 0.16) 0%, transparent 68%);
          filter: blur(18px);
          animation: smokeMistDrift 16s ease-in-out infinite alternate;
        }

        /* Billowing volumetric smoke clouds rising upward */
        .smoke-billow-drift {
          background:
            radial-gradient(circle 200px at 48% 80%, rgba(240, 245, 255, 0.18) 0%, rgba(185, 200, 225, 0.08) 45%, transparent 72%),
            radial-gradient(circle 240px at 64% 75%, rgba(255, 255, 255, 0.22) 0%, rgba(205, 220, 240, 0.10) 50%, transparent 76%),
            radial-gradient(circle 180px at 30% 84%, rgba(190, 205, 225, 0.14) 0%, transparent 60%),
            radial-gradient(circle 220px at 80% 82%, rgba(210, 225, 245, 0.15) 0%, transparent 68%);
          filter: blur(26px);
          animation: smokePlumeBillow 13s cubic-bezier(0.42, 0, 0.58, 1) infinite alternate;
        }

        /* Luminous scattering from the glowing doorway onto the smoke */
        .smoke-portal-illumination {
          background:
            radial-gradient(ellipse 42% 75% at 58% 86%, rgba(255, 255, 255, 0.26) 0%, rgba(230, 240, 255, 0.12) 36%, rgba(180, 195, 220, 0.04) 65%, transparent 80%);
          filter: blur(30px);
          animation: smokeLightScatter 9s ease-in-out infinite alternate;
        }

        /* Fine organic smoke wisps gliding laterally */
        .smoke-wisps {
          background:
            radial-gradient(ellipse 95% 45% at 50% 95%, rgba(255, 255, 255, 0.15) 0%, rgba(195, 215, 235, 0.07) 50%, transparent 82%);
          filter: blur(12px);
          animation: smokeWispGlide 20s ease-in-out infinite alternate;
        }

        /* Soft floor fade into solid #050505 at the bottom baseline */
        .hero-smoke-floor-fade {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 52px;
          background: linear-gradient(to bottom, transparent 0%, rgba(5,5,5,0.6) 45%, #050505 100%);
        }

        @keyframes smokeMistDrift {
          0% {
            transform: translate3d(-2.5%, 1%, 0) scale(0.97);
            opacity: 0.85;
          }
          50% {
            transform: translate3d(2.5%, -2%, 0) scale(1.04);
            opacity: 1;
          }
          100% {
            transform: translate3d(-1%, -1%, 0) scale(1.01);
            opacity: 0.88;
          }
        }

        @keyframes smokePlumeBillow {
          0% {
            transform: translate3d(3%, 2%, 0) scale(1);
            opacity: 0.78;
          }
          50% {
            transform: translate3d(-3%, -3.5%, 0) scale(1.08);
            opacity: 1;
          }
          100% {
            transform: translate3d(1.5%, 1%, 0) scale(1.02);
            opacity: 0.84;
          }
        }

        @keyframes smokeLightScatter {
          0% {
            opacity: 0.8;
            transform: scaleX(0.94) translate3d(-1%, 0, 0);
          }
          100% {
            opacity: 1;
            transform: scaleX(1.1) translate3d(1.5%, -1%, 0);
          }
        }

        @keyframes smokeWispGlide {
          0% {
            transform: translate3d(-5%, 0, 0) scaleY(0.95);
            opacity: 0.75;
          }
          100% {
            transform: translate3d(5%, -1%, 0) scaleY(1.08);
            opacity: 0.95;
          }
        }

        /* Content container */
        .hero-inner {
          position: relative;
          z-index: 5;
          max-width: var(--max-w, 1200px);
          width: 100%;
          margin: 0 auto;
          padding-top: clamp(5.5rem, 12vh, 8.5rem);
          padding-bottom: clamp(3rem, 6vh, 4.5rem);
        }

        /* Typewriter Name Headline */
        .hero-name {
          font-family: var(--font-display, 'Space Grotesk', 'Manrope', sans-serif);
          font-size: clamp(2.4rem, 5.25vw, 3.9rem);
          font-weight: 700;
          letter-spacing: -0.025em;
          line-height: 1.1;
          color: var(--hero-text);
          margin: 0 0 1.25rem 0;
          display: flex;
          align-items: center;
          flex-wrap: wrap;
        }

        .typewriter-text {
          position: relative;
          display: inline-block;
        }

        .typewriter-caret {
          display: inline-block;
          width: clamp(2px, 0.05em, 4px);
          height: 0.85em;
          background: #ffffff;
          margin-left: 4px;
          vertical-align: middle;
          animation: blinkCaret 1s step-end infinite;
        }

        @keyframes blinkCaret {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }

        /* Accent divider */
        .hero-divider {
          width: 48px;
          height: 2px;
          background: rgba(255, 255, 255, 0.28);
          margin-bottom: 1.85rem;
        }

        /* Bio description */
        .hero-bio {
          font-size: clamp(0.92rem, 1.35vw, 1.05rem);
          font-weight: 400;
          color: #b8b7b7;
          max-width: clamp(340px, 38vw, 440px);
          line-height: 1.68;
          margin: 0 0 2.5rem 0;
        }

        .hero-bio span {
          display: block;
        }

        .hero-bio strong {
          color: #ffffff;
          font-weight: 700;
        }

        /* CTA Buttons Row */
        .hero-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
          margin-bottom: 2.8rem;
        }

        .hero-btn-primary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.45rem;
          background: #ffffff;
          color: #050505;
          font-family: inherit;
          font-size: 0.85rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          padding: 0.85rem 1.85rem;
          border-radius: 999px;
          border: none;
          cursor: pointer;
          transition: transform 0.25s cubic-bezier(.22, 1, .36, 1), opacity 0.2s ease, box-shadow 0.25s ease;
          box-shadow: 0 4px 14px rgba(255, 255, 255, 0.12);
        }

        .hero-btn-primary:hover {
          transform: translateY(-2px);
          opacity: 0.94;
          box-shadow: 0 6px 20px rgba(255, 255, 255, 0.2);
        }

        .hero-btn-secondary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.06);
          color: #ffffff;
          font-family: inherit;
          font-size: 0.85rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          padding: 0.85rem 1.85rem;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.16);
          cursor: pointer;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          transition: transform 0.25s cubic-bezier(.22, 1, .36, 1), background 0.2s ease, border-color 0.2s ease;
        }

        .hero-btn-secondary:hover {
          transform: translateY(-2px);
          background: rgba(255, 255, 255, 0.12);
          border-color: rgba(255, 255, 255, 0.3);
        }

        /* Experience Trust Bar */
        .hero-exp-bar {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
          margin-bottom: 0;
          font-size: 0.8rem;
        }

        .hero-exp-label {
          font-size: 0.72rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #787777;
          margin-right: 0.25rem;
        }

        .hero-exp-list {
          display: inline-flex;
          align-items: center;
          gap: 0.65rem;
          flex-wrap: wrap;
        }

        .hero-exp-item {
          display: inline-flex;
          align-items: center;
          gap: 0.42rem;
          color: #c0bfbf;
          font-weight: 500;
          cursor: pointer;
          transition: color 0.2s ease, transform 0.2s ease;
        }

        .hero-exp-item:hover {
          color: #ffffff;
          transform: translateY(-1px);
        }

        .hero-exp-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          display: inline-block;
          flex-shrink: 0;
          box-shadow: 0 0 6px currentColor;
        }

        .hero-exp-sep {
          color: rgba(255, 255, 255, 0.22);
          margin-left: 0.4rem;
        }

        /* Responsive Mobile Layout */
        @media (max-width: 640px) {
          .hero-section {
            padding-top: 5rem;
            padding-bottom: 3rem;
            min-height: auto;
          }
          .hero-name {
            font-size: 2.1rem;
          }
          .hero-bio {
            max-width: 100%;
          }
          .hero-bio span {
            display: inline;
          }
          .hero-actions {
            width: 100%;
          }
          .hero-btn-primary, .hero-btn-secondary {
            width: 100%;
          }
        }
      `}</style>

      {/* Cinematic Looping Video Background */}
      <div className="hero-plate">
        <video className="hero-video" autoPlay muted loop playsInline preload="auto" aria-hidden="true">
          <source
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260808_112712_da9d53df-6d27-4b12-bdf6-aa9dc2622bdf.mp4"
            type="video/mp4"
          />
        </video>

        {/* Volumetric Animated Ground Smoke & Mist Layers */}
        <div className="hero-smoke-atmosphere" aria-hidden="true">
          <div className="hero-smoke-layer smoke-base-mist" />
          <div className="hero-smoke-layer smoke-billow-drift" />
          <div className="hero-smoke-layer smoke-portal-illumination" />
          <div className="hero-smoke-layer smoke-wisps" />
          <div className="hero-smoke-floor-fade" />
        </div>
      </div>

      {/* Hero Content */}
      <div className="hero-inner">
        {/* Name Headline with Typewriter */}
        <h1 className="hero-name">
          <TypewriterName name={t?.hero?.name || "Sanjit Mathur"} />
        </h1>

        {/* Thin Divider Line */}
        <div className="hero-divider" />

        {/* Subtitle Bio */}
        <p className="hero-bio">
          <span>Building intelligent systems, modern web</span>
          <span>applications, and developer tools. Currently at</span>
          <span><strong>Publicis Sapient</strong>, open to new opportunities.</span>
        </p>

        {/* CTA Buttons */}
        <div className="hero-actions">
          <button className="hero-btn-primary clickable" onClick={() => go("projects")}>
            <span>{t?.hero?.viewProjects ? t.hero.viewProjects.toUpperCase() : "VIEW PROJECTS"}</span>
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
              <path d="M1 13L13 1M13 1H5M13 1V9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <button className="hero-btn-secondary clickable" onClick={() => go("contact")}>
            {t?.hero?.contactMe ? t.hero.contactMe.toUpperCase() : "CONTACT ME"}
          </button>
        </div>

        {/* Experience Trust Bar */}
        <div className="hero-exp-bar">
          <span className="hero-exp-label">EXPERIENCE AT:</span>
          <div className="hero-exp-list">
            {companies.map((c, i) => (
              <span
                key={c.name}
                className="hero-exp-item clickable"
                onClick={() => go("experience")}
              >
                <span className="hero-exp-dot" style={{ background: c.color, color: c.color }} />
                <span>{c.name}</span>
                {i < companies.length - 1 && <span className="hero-exp-sep">·</span>}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
