import { useEffect, useRef, useState } from "react";
import { useInView } from "../useInView";

type EchoMap = Record<string, number>;

const STATIC_CONTACTS = [
  { angle: 28, radius: 34, size: 2.2, id: "AI317" },
  { angle: 64, radius: 19, size: 2.1, id: "UK971" },
  { angle: 104, radius: 30, size: 1.9, id: "6E214" },
  { angle: 155, radius: 22, size: 2.4, id: "IX442" },
  { angle: 208, radius: 33, size: 2.1, id: "SG801" },
  { angle: 264, radius: 26, size: 1.8, id: "QP128" },
  { angle: 314, radius: 36, size: 2.3, id: "AK604" },
] as const;

function angleDiff(a: number, b: number) {
  const diff = Math.abs(a - b) % 360;
  return diff > 180 ? 360 - diff : diff;
}

export default function IndiGoWidget() {
  const { ref: containerRef, inView } = useInView("200px 0px");
  const inViewRef = useRef(false);
  useEffect(() => { inViewRef.current = inView; }, [inView]);

  const [progress, setProgress] = useState(0.18);
  const [heading, setHeading] = useState(124);
  const [scanPhase, setScanPhase] = useState(0);
  const [bank, setBank] = useState(0);
  const [pitch, setPitch] = useState(0);
  const [deviation, setDeviation] = useState(0);
  const [groundspeed, setGroundspeed] = useState(468);
  const [linkStrength, setLinkStrength] = useState(78);
  const [echoes, setEchoes] = useState<EchoMap>({});

  useEffect(() => {
    let t = 0;
    const id = setInterval(() => {
      if (!inViewRef.current) return;

      t += 0.065;
      const phase = (Math.sin(t * 0.42) + 1) * 0.5;
      const flightProgress = 0.14 + phase * 0.72;
      const nextHeading = 124 + Math.round(Math.sin(t * 0.6) * 11);
      const nextScanPhase = (t * 0.24) % 1;
      const nextSweepDeg = nextScanPhase * 360;
      const trackedAngle = 220 - flightProgress * 150;
      const trackedRadius = 14 + flightProgress * 15;
      const contacts = [
        ...STATIC_CONTACTS,
        { angle: trackedAngle, radius: trackedRadius, size: 2.8, id: "6E211", tracked: true as const },
      ];

      setProgress(flightProgress);
      setHeading(nextHeading);
      setScanPhase(nextScanPhase);
      setBank(Math.sin(t * 1.15) * 13);
      setPitch(Math.cos(t * 0.95) * 5);
      setDeviation(Math.sin(t * 1.45) * 9);
      setGroundspeed(Math.round(458 + Math.sin(t * 1.1) * 18 + Math.cos(t * 0.5) * 10));
      setLinkStrength(Math.round(78 + Math.sin(t * 1.8) * 7));

      setEchoes((prev) => {
        const next: EchoMap = {};

        contacts.forEach((contact) => {
          const proximity = angleDiff(nextSweepDeg, contact.angle);
          let intensity = (prev[contact.id] ?? 0) * 0.82;

          if (proximity < 16 && Math.random() > (contact.tracked ? 0.06 : 0.34)) {
            intensity = Math.max(intensity, contact.tracked ? 0.96 : 0.46 + Math.random() * 0.34);
          } else if (!contact.tracked && Math.random() < 0.012) {
            intensity = Math.max(intensity, 0.12 + Math.random() * 0.16);
          }

          if (intensity < 0.05) intensity = 0;
          next[contact.id] = intensity;
        });

        return next;
      });
    }, 90);

    return () => clearInterval(id);
  }, []);

  const confidence = 88;
  const altitude = Math.round(progress < 0.3 ? 18000 + (progress / 0.3) * 18000 : progress > 0.74 ? 36000 - ((progress - 0.74) / 0.26) * 25000 : 36000);
  const altitudeDisplay = altitude >= 18000 ? `FL${Math.round(altitude / 100)}` : `${altitude}ft`;
  const verticalSpeed = Math.round(progress < 0.3 ? 1800 - progress * 1800 : progress > 0.74 ? -900 - (progress - 0.74) * 3500 : 120 + Math.sin(progress * 8) * 140);
  const wind = `${Math.round(18 + Math.cos(progress * 9) * 6)}kt`;
  const etaMins = 44 - Math.round(progress * 26);
  const distanceNm = 693 - Math.round(progress * 532);
  const nextWaypoint = progress < 0.33 ? "BUBNA" : progress < 0.68 ? "OSPAK" : "VEMBO";
  const phaseLabel = progress < 0.28 ? "Climb Corridor" : progress < 0.74 ? "Cruise Monitor" : "Arrival Window";
  const squawk = progress < 0.5 ? "3412" : "5074";
  const sector = progress < 0.38 ? "Delhi FIR" : progress < 0.72 ? "Central Corridor" : "Mumbai Approach";

  const W = 300;
  const H = 116;
  const radar = { cx: 110, cy: 60, r: 43 };
  const sweepDeg = scanPhase * 360;
  const sweepRad = (sweepDeg * Math.PI) / 180;
  const sweepX = radar.cx + Math.cos(sweepRad) * radar.r;
  const sweepY = radar.cy + Math.sin(sweepRad) * radar.r;
  const trackedContact = {
    angle: 220 - progress * 150,
    radius: 14 + progress * 15,
    size: 2.8,
    id: "6E211",
  };
  const returnsCount = Object.values(echoes).filter((value) => value > 0.12).length;
  const gaugeR = 18;
  const gaugeC = 2 * Math.PI * gaugeR;
  const gaugeOffset = gaugeC * (1 - confidence / 100);

  const toPoint = (angleDeg: number, radius: number) => {
    const angle = (angleDeg * Math.PI) / 180;
    return {
      x: radar.cx + Math.cos(angle) * radius,
      y: radar.cy + Math.sin(angle) * radius,
    };
  };

  const labelStyle: React.CSSProperties = {
    fontSize: "0.34rem",
    color: "#4f5a5f",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    lineHeight: 1,
  };

  const valueStyle: React.CSSProperties = {
    fontSize: "0.62rem",
    color: "#edf2f7",
    fontWeight: 700,
    fontFamily: "monospace",
    lineHeight: 1.25,
  };

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        background: "linear-gradient(180deg, #090d0f 0%, #07090b 100%)",
        borderRadius: 12,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        fontFamily: "var(--font)",
        border: "1px solid rgba(120, 138, 146, 0.08)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.02)",
      }}
    >
      <div
        style={{
          padding: "5px 10px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(4, 8, 10, 0.72)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: "0.42rem", color: "#7f8a8f", letterSpacing: "0.12em", textTransform: "uppercase" }}>ATC Radar</span>
          <span
            style={{
              fontSize: "0.39rem",
              fontWeight: 500,
              color: "#c4cdd1",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            {sector}
          </span>
          <span style={{ fontSize: "0.38rem", color: "#1fd06f", background: "rgba(31,208,111,0.12)", padding: "1px 5px", borderRadius: 999 }}>Scan Live</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <span style={{ fontSize: "0.38rem", color: "#d3a95b", background: "rgba(211,169,91,0.12)", padding: "1px 6px", borderRadius: 999, border: "1px solid rgba(211,169,91,0.18)" }}>
            Logistic Regression
          </span>
          <span style={{ fontSize: "0.4rem", color: "#95a3a9", fontFamily: "monospace" }}>ETA {etaMins}m</span>
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
        <div
          style={{
            width: 58,
            flexShrink: 0,
            borderRight: "1px solid rgba(255,255,255,0.05)",
            padding: "8px 6px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            background: "linear-gradient(180deg, rgba(8,12,15,0.85), rgba(6,9,11,0.72))",
          }}
        >
          <div>
            <div style={labelStyle}>Freq</div>
            <div style={{ ...valueStyle, color: "#1fd06f" }}>124.35</div>
          </div>
          <div>
            <div style={labelStyle}>Alt</div>
            <div style={{ ...valueStyle, color: "#1fd06f" }}>{altitudeDisplay}</div>
          </div>
          <div>
            <div style={labelStyle}>GS</div>
            <div style={valueStyle}>{groundspeed}kt</div>
          </div>
          <div>
            <div style={labelStyle}>VS</div>
            <div style={{ ...valueStyle, color: verticalSpeed >= 0 ? "#d3a95b" : "#f97362" }}>
              {verticalSpeed > 0 ? "+" : ""}
              {verticalSpeed}
            </div>
          </div>
        </div>

        <div style={{ flex: 1, minWidth: 0, position: "relative", background: "radial-gradient(circle at 50% 30%, rgba(23,46,58,0.18), transparent 55%)" }}>
          <div
            style={{
              position: "absolute",
              top: 6,
              left: 8,
              right: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 6,
              zIndex: 2,
              pointerEvents: "none",
            }}
          >
            <div style={{ fontSize: "0.34rem", color: "#738087", letterSpacing: "0.14em", textTransform: "uppercase" }}>{phaseLabel}</div>
            <div style={{ fontSize: "0.38rem", color: "#95a3a9", fontFamily: "monospace" }}>
              LOCK <span style={{ color: echoes[trackedContact.id] ? "#d8ff73" : "#6f7a6f" }}>6E 211</span>
            </div>
          </div>

          <svg
            width="100%"
            height="100%"
            viewBox={`0 0 ${W} ${H}`}
            preserveAspectRatio="none"
            style={{ shapeRendering: "geometricPrecision", textRendering: "optimizeLegibility" }}
          >
            <defs>
              <radialGradient id="radar-scope-glow" cx="50%" cy="50%" r="68%">
                <stop offset="0%" stopColor="rgba(34, 185, 110, 0.14)" />
                <stop offset="75%" stopColor="rgba(16, 46, 31, 0.18)" />
                <stop offset="100%" stopColor="rgba(4, 11, 8, 0)" />
              </radialGradient>
              <linearGradient id="radar-sweep" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="rgba(34, 197, 94, 0)" />
                <stop offset="55%" stopColor="rgba(34, 197, 94, 0.08)" />
                <stop offset="100%" stopColor="rgba(34, 197, 94, 0.28)" />
              </linearGradient>
              <filter id="radar-dot-glow" x="-200%" y="-200%" width="400%" height="400%">
                <feGaussianBlur stdDeviation="1.7" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="radar-track-glow" x="-250%" y="-250%" width="500%" height="500%">
                <feGaussianBlur stdDeviation="2.4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <clipPath id="radar-clip">
                <circle cx={radar.cx} cy={radar.cy} r={radar.r} />
              </clipPath>
            </defs>

            {Array.from({ length: 9 }, (_, i) => (
              <line key={`v-${i}`} x1={20 + i * 28} y1="18" x2={20 + i * 28} y2="104" stroke="rgba(255,255,255,0.03)" strokeWidth="0.8" />
            ))}
            {Array.from({ length: 5 }, (_, i) => (
              <line key={`h-${i}`} x1="18" y1={24 + i * 18} x2="214" y2={24 + i * 18} stroke="rgba(255,255,255,0.03)" strokeWidth="0.8" />
            ))}

            <circle cx={radar.cx} cy={radar.cy} r={radar.r + 3} fill="rgba(7, 17, 13, 0.52)" stroke="rgba(34,197,94,0.05)" />
            <circle cx={radar.cx} cy={radar.cy} r={radar.r} fill="url(#radar-scope-glow)" stroke="rgba(34,197,94,0.18)" strokeWidth="1.1" />

            {Array.from({ length: 4 }, (_, i) => (
              <circle
                key={`ring-${i}`}
                cx={radar.cx}
                cy={radar.cy}
                r={((i + 1) / 4) * radar.r}
                fill="none"
                stroke={i === 3 ? "rgba(34,197,94,0.18)" : "rgba(34,197,94,0.1)"}
                strokeWidth={i === 3 ? 1.1 : 0.9}
              />
            ))}

            {Array.from({ length: 8 }, (_, i) => {
              const angle = i * 45;
              const point = toPoint(angle, radar.r);
              return (
                <line
                  key={`spoke-${angle}`}
                  x1={radar.cx}
                  y1={radar.cy}
                  x2={point.x}
                  y2={point.y}
                  stroke="rgba(34,197,94,0.08)"
                  strokeWidth="0.85"
                />
              );
            })}

            <g clipPath="url(#radar-clip)">
              <path
                d={`M ${radar.cx} ${radar.cy} L ${sweepX} ${sweepY} A ${radar.r} ${radar.r} 0 0 1 ${radar.cx + Math.cos(sweepRad - 0.5) * radar.r} ${radar.cy + Math.sin(sweepRad - 0.5) * radar.r} Z`}
                fill="url(#radar-sweep)"
              />
              <line x1={radar.cx} y1={radar.cy} x2={sweepX} y2={sweepY} stroke="rgba(88,255,150,0.38)" strokeWidth="1.2" />
              {Array.from({ length: 48 }, (_, i) => {
                const angle = i * 7.5;
                const radius = (i % 6) * 6 + 8;
                const point = toPoint(angle, radius);
                return (
                  <circle
                    key={`noise-${i}`}
                    cx={point.x}
                    cy={point.y}
                    r="0.55"
                    fill={`rgba(94,255,154,${0.02 + ((i % 5) * 0.008)})`}
                  />
                );
              })}
            </g>

            {STATIC_CONTACTS.map((blip) => {
              const point = toPoint(blip.angle, blip.radius);
              const intensity = echoes[blip.id] ?? 0;
              if (intensity <= 0.05) return null;

              return (
                <g key={blip.id}>
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r={blip.size + intensity * 1.5}
                    fill="#73f0a5"
                    opacity={0.3 + intensity * 0.7}
                    filter="url(#radar-dot-glow)"
                  />
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r={blip.size + 2.3 + intensity * 2}
                    fill="none"
                    stroke={`rgba(115,240,165,${0.08 + intensity * 0.24})`}
                    strokeWidth="0.7"
                  />
                </g>
              );
            })}

            {(() => {
              const point = toPoint(trackedContact.angle, trackedContact.radius);
              const intensity = echoes[trackedContact.id] ?? 0;
              return (
                <g opacity={0.18 + intensity * 0.82}>
                  <circle cx={point.x} cy={point.y} r={trackedContact.size + intensity * 1.2} fill="#d8ff73" filter="url(#radar-track-glow)" />
                  {intensity > 0.18 && (
                    <>
                      <circle cx={point.x} cy={point.y} r={7.6 + intensity * 2.6} fill="none" stroke="rgba(216,255,115,0.34)" strokeWidth="0.9" />
                      <circle cx={point.x} cy={point.y} r={11.3 + intensity * 3.2} fill="none" stroke="rgba(216,255,115,0.14)" strokeWidth="0.8" />
                      <line x1={point.x + 7} y1={point.y - 7} x2="196" y2="21" stroke={`rgba(216,255,115,${0.08 + intensity * 0.18})`} strokeWidth="0.8" />
                      <rect x="196" y="13" width="44" height="14" rx="7" fill="rgba(9,16,12,0.84)" stroke={`rgba(216,255,115,${0.1 + intensity * 0.18})`} />
                      <text x="202" y="22" fontSize="5.2" fill="#d8ff73">6E211</text>
                    </>
                  )}
                </g>
              );
            })()}

            <circle cx={radar.cx} cy={radar.cy} r="1.9" fill="#58e08f" />
            <line x1={radar.cx - 6} y1={radar.cy} x2={radar.cx + 6} y2={radar.cy} stroke="rgba(88,224,143,0.3)" strokeWidth="0.8" />
            <line x1={radar.cx} y1={radar.cy - 6} x2={radar.cx} y2={radar.cy + 6} stroke="rgba(88,224,143,0.3)" strokeWidth="0.8" />

            <text x="24" y="18" fontSize="6" fill="rgba(88,224,143,0.34)">60NM</text>
            <text x="88" y="18" fontSize="6" fill="rgba(88,224,143,0.26)">30NM</text>
            <text x="150" y="18" fontSize="6" fill="rgba(88,224,143,0.26)">15NM</text>

            <g transform="translate(250, 60)">
              <circle cx="0" cy="0" r="25" fill="rgba(5,10,12,0.66)" stroke="rgba(255,255,255,0.05)" />
              <circle cx="0" cy="0" r={gaugeR} fill="none" stroke="rgba(255,255,255,0.045)" strokeWidth="2.8" />
              <circle
                cx="0"
                cy="0"
                r={gaugeR}
                fill="none"
                stroke="#1fd06f"
                strokeWidth="2.9"
                strokeDasharray={gaugeC}
                strokeDashoffset={gaugeOffset}
                strokeLinecap="round"
                transform="rotate(-90 0 0)"
                opacity="0.9"
              />
              <text x="0" y="-1" textAnchor="middle" fontSize="11" fontWeight="700" fill="#edf2f7">88%</text>
              <text x="0" y="9" textAnchor="middle" fontSize="5.8" fontWeight="500" fill="#9ba9ae">Track Score</text>
            </g>
          </svg>
        </div>

        <div
          style={{
            width: 62,
            flexShrink: 0,
            borderLeft: "1px solid rgba(255,255,255,0.05)",
            padding: "8px 6px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            background: "linear-gradient(180deg, rgba(8,12,15,0.78), rgba(6,9,11,0.7))",
          }}
        >
          <div>
            <div style={labelStyle}>HDG</div>
            <div style={{ ...valueStyle, color: "#d3a95b" }}>{heading}</div>
          </div>
          <div>
            <div style={labelStyle}>Track</div>
            <div style={valueStyle}>{nextWaypoint}</div>
          </div>
          <div>
            <div style={labelStyle}>SQK</div>
            <div style={valueStyle}>{squawk}</div>
          </div>
          <div>
            <div style={labelStyle}>NM Left</div>
            <div style={{ ...valueStyle, color: "#1fd06f" }}>{distanceNm}</div>
          </div>
        </div>
      </div>

      <div
        style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(4, 8, 10, 0.74)",
          padding: "5px 10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
          <div>
            <div style={labelStyle}>Bank</div>
            <div style={{ ...valueStyle, fontSize: "0.5rem", color: "#d3a95b" }}>{bank >= 0 ? "+" : ""}{bank.toFixed(1)}°</div>
          </div>
          <div>
            <div style={labelStyle}>Pitch</div>
            <div style={{ ...valueStyle, fontSize: "0.5rem", color: "#95a3a9" }}>{pitch >= 0 ? "+" : ""}{pitch.toFixed(1)}°</div>
          </div>
          <div>
            <div style={labelStyle}>XTK</div>
            <div style={{ ...valueStyle, fontSize: "0.5rem", color: Math.abs(deviation) > 5 ? "#f97362" : "#1fd06f" }}>
              {deviation >= 0 ? "R" : "L"} {Math.abs(deviation).toFixed(1)}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <div>
            <div style={labelStyle}>Link</div>
            <div style={{ ...valueStyle, fontSize: "0.5rem", color: "#1fd06f" }}>{linkStrength}%</div>
          </div>
          <div>
            <div style={labelStyle}>Returns</div>
            <div style={{ ...valueStyle, fontSize: "0.5rem", color: "#73f0a5" }}>{returnsCount}</div>
          </div>
          <div>
            <div style={labelStyle}>SSR</div>
            <div style={{ ...valueStyle, fontSize: "0.5rem", color: "#95a3a9" }}>{squawk}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
