import { useEffect, useRef, useState } from "react";
import { useInView } from "../useInView";

export default function IndiGoWidget() {
  const { ref: containerRef, inView } = useInView("200px 0px");
  const inViewRef = useRef(false);
  useEffect(() => { inViewRef.current = inView; }, [inView]);
  const [progress, setProgress] = useState(0);
  const [accuracy] = useState(88);

  useEffect(() => {
    let t = 0;
    const id = setInterval(() => {
      if (!inViewRef.current) return;
      t = (t + 0.008) % 1;
      setProgress(t);
    }, 30);
    return () => clearInterval(id);
  }, []);

  const W = 260, H = 160;
  const DEL = { x: 120, y: 45 };
  const BOM = { x: 70, y: 115 };
  const CP1 = { x: 155, y: 55 };
  const CP2 = { x: 95, y: 100 };

  function bezier(t: number) {
    const mt = 1 - t;
    return {
      x: mt * mt * mt * DEL.x + 3 * mt * mt * t * CP1.x + 3 * mt * t * t * CP2.x + t * t * t * BOM.x,
      y: mt * mt * mt * DEL.y + 3 * mt * mt * t * CP1.y + 3 * mt * t * t * CP2.y + t * t * t * BOM.y,
    };
  }

  const planePos = bezier(progress);

  // ATC data synced with flight progress
  const altitude = Math.round(progress < 0.3 ? progress / 0.3 * 36000 : progress > 0.75 ? (1 - progress) / 0.25 * 36000 : 36000);
  const altStr = altitude >= 1000 ? `FL${Math.round(altitude / 100)}` : `${altitude}ft`;
  const speed = Math.round(progress < 0.2 ? 180 + progress / 0.2 * 300 : progress > 0.8 ? 480 - (progress - 0.8) / 0.2 * 300 : 480);
  const freqs = ["119.10", "124.35", "127.90", "121.50"];
  const freqIdx = Math.min(3, Math.floor(progress * 4));
  const waypoints = ["AGREV", "BUBNA", "OSPAK", "ILS 27"];
  const wpIdx = Math.min(3, Math.floor(progress * 4));
  const squawks = ["2476", "3412", "5074", "1200"];
  const sqkIdx = Math.min(3, Math.floor(progress * 4));

  const r = 28, cx = 210, cy = 80;
  const circ = 2 * Math.PI * r;
  const dashOffset = circ * (1 - accuracy / 100);

  return (
    <div ref={containerRef} style={{ width: "100%", height: "100%", background: "#0a0b08", borderRadius: 12, padding: "14px 16px", fontFamily: "var(--font)", overflow: "hidden", position: "relative" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 2 }}>
        <div>
          <div style={{ fontSize: "0.6rem", color: "#6b7280", letterSpacing: "0.1em", textTransform: "uppercase" }}>FLIGHT PATH</div>
          <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "#f5f5f7" }}>DEL → BOM</div>
        </div>
        <div style={{ fontSize: "0.5rem", color: "#d5b572", background: "rgba(213,181,114,0.1)", padding: "2px 7px", borderRadius: 100, border: "1px solid rgba(213,181,114,0.25)" }}>
          Logistic Regression
        </div>
      </div>

      {/* ATC Strip */}
      <div style={{ display: "flex", gap: 10, padding: "4px 0 5px", borderBottom: "1px solid rgba(255,255,255,0.06)", marginBottom: 2 }}>
        {[
          { label: "FREQ", value: freqs[freqIdx], color: "#22c55e" },
          { label: "ALT", value: altStr, color: "#22c55e" },
          { label: "GS", value: `${speed}kt`, color: "#9ca3af" },
          { label: "NEXT", value: waypoints[wpIdx], color: "#22c55e" },
          { label: "SQK", value: squawks[sqkIdx], color: "#9ca3af" },
        ].map(d => (
          <div key={d.label} style={{ flex: 1 }}>
            <div style={{ fontSize: "0.5rem", color: "#4b5563", letterSpacing: "0.06em", textTransform: "uppercase", lineHeight: 1 }}>{d.label}</div>
            <div style={{ fontSize: "0.7rem", fontWeight: 600, color: d.color, fontFamily: "monospace", lineHeight: 1.5 }}>{d.value}</div>
          </div>
        ))}
      </div>

      {/* SVG Map + donut */}
      <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`}>
        {/* Grid dots */}
        {Array.from({ length: 6 }, (_, row) =>
          Array.from({ length: 9 }, (_, col) => (
            <circle key={`${row}-${col}`} cx={col * 30 + 10} cy={row * 28 + 8} r={0.8} fill="rgba(255,255,255,0.05)" />
          ))
        )}

        {/* India outline simplified */}
        <path d="M85,20 L130,15 L160,30 L165,55 L155,80 L140,100 L120,120 L100,135 L80,130 L65,110 L60,85 L65,60 L75,40 Z"
          fill="rgba(213,181,114,0.05)" stroke="rgba(213,181,114,0.2)" strokeWidth="0.8" />

        {/* Flight arc dashed */}
        <path
          d={`M${DEL.x},${DEL.y} C${CP1.x},${CP1.y} ${CP2.x},${CP2.y} ${BOM.x},${BOM.y}`}
          fill="none" stroke="rgba(213,181,114,0.3)" strokeWidth="1" strokeDasharray="4 3"
        />
        {/* Completed arc */}
        <path
          d={`M${DEL.x},${DEL.y} C${CP1.x},${CP1.y} ${CP2.x},${CP2.y} ${BOM.x},${BOM.y}`}
          fill="none" stroke="#d5b572" strokeWidth="1.5" strokeDasharray={`${progress * 200} 1000`}
          strokeLinecap="round"
        />

        {/* City dots */}
        <circle cx={DEL.x} cy={DEL.y} r={4} fill="#d5b572" />
        <circle cx={DEL.x} cy={DEL.y} r={7} fill="none" stroke="rgba(213,181,114,0.4)" strokeWidth="1" />
        <text x={DEL.x + 8} y={DEL.y + 4} fontSize="7" fill="#9ca3af">DEL</text>

        <circle cx={BOM.x} cy={BOM.y} r={4} fill="#f59e0b" />
        <circle cx={BOM.x} cy={BOM.y} r={7} fill="none" stroke="rgba(245,158,11,0.4)" strokeWidth="1" />
        <text x={BOM.x - 24} y={BOM.y + 4} fontSize="7" fill="#9ca3af">BOM</text>

        {/* Plane dot */}
        <circle cx={planePos.x} cy={planePos.y} r={7} fill="rgba(213,181,114,0.12)" />
        <circle cx={planePos.x} cy={planePos.y} r={3.5} fill="rgba(213,181,114,0.25)" />
        <circle cx={planePos.x} cy={planePos.y} r={2} fill="#fff" style={{ filter: "drop-shadow(0 0 3px rgba(255,255,255,0.8))" }} />

        {/* Accuracy donut */}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#22c55e" strokeWidth="5"
          strokeDasharray={circ} strokeDashoffset={dashOffset}
          strokeLinecap="round" transform={`rotate(-90 ${cx} ${cy})`}
          style={{ transition: "stroke-dashoffset 0.8s ease" }}
        />
        <text x={cx} y={cy - 4} textAnchor="middle" fontSize="11" fontWeight="700" fill="#f5f5f7">{accuracy}%</text>
        <text x={cx} y={cy + 10} textAnchor="middle" fontSize="6" fill="#6b7280">Accuracy</text>
        <text x={cx} y={cy + 22} textAnchor="middle" fontSize="5.5" fill="#4b5563">1K records</text>
      </svg>
    </div>
  );
}
