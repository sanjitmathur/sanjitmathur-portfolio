import { useEffect, useRef, useState } from "react";
import { useInView } from "../useInView";

const MODELS = ["Isolation Forest", "Autoencoder", "One-Class SVM"];
const ACCENT = "#f59e0b";

const METRICS: Record<number, { precision: string; recall: string; f1: string; auc: string }> = {
  0: { precision: "0.94", recall: "0.89", f1: "0.91", auc: "0.97" },
  1: { precision: "0.96", recall: "0.85", f1: "0.90", auc: "0.95" },
  2: { precision: "0.91", recall: "0.92", f1: "0.91", auc: "0.96" },
};

function smoothPath(points: number[], w: number, h: number, px: number, py: number): string {
  const iw = w - px * 2, ih = h - py * 2;
  const toX = (i: number) => px + (i / (points.length - 1)) * iw;
  const toY = (v: number) => py + (1 - v) * ih;
  if (points.length < 2) return "";
  let d = `M${toX(0).toFixed(1)},${toY(points[0]).toFixed(1)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const x0 = toX(i), y0 = toY(points[i]);
    const x1 = toX(i + 1), y1 = toY(points[i + 1]);
    const cpx = (x0 + x1) / 2;
    d += ` C${cpx.toFixed(1)},${y0.toFixed(1)} ${cpx.toFixed(1)},${y1.toFixed(1)} ${x1.toFixed(1)},${y1.toFixed(1)}`;
  }
  return d;
}

export default function FraudWidget() {
  const { ref: containerRef, inView } = useInView("200px 0px");
  const [model, setModel] = useState(0);
  const [anomalyScores, setAnomalyScores] = useState<number[]>(() =>
    Array.from({ length: 40 }, () => 0.15 + Math.random() * 0.25)
  );
  const [flaggedCount, setFlaggedCount] = useState(247);
  const [totalScanned, setTotalScanned] = useState(18432);
  const [recentTxns, setRecentTxns] = useState([
    { id: "TX-8A2F", amount: "$2,340", score: 0.92, flagged: true },
    { id: "TX-1D7C", amount: "$45", score: 0.12, flagged: false },
    { id: "TX-9E3B", amount: "$189", score: 0.08, flagged: false },
    { id: "TX-4F1A", amount: "$5,670", score: 0.87, flagged: true },
  ]);
  const frameRef = useRef(0);
  const rafRef = useRef(0);
  const inViewRef = useRef(false);
  useEffect(() => { inViewRef.current = inView; }, [inView]);

  // Auto-cycle models
  useEffect(() => {
    const interval = setInterval(() => {
      setModel(m => (m + 1) % MODELS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Animation loop
  useEffect(() => {
    let accum = 0;
    const animate = () => {
      rafRef.current = requestAnimationFrame(animate);
      if (!inViewRef.current) return;
      frameRef.current++;
      accum++;

      // Update anomaly score wave every 3 frames
      if (accum >= 3) {
        accum = 0;
        setAnomalyScores(prev => {
          const next = [...prev.slice(1)];
          const t = frameRef.current * 0.02;
          // Mostly low scores with occasional spikes
          const base = 0.12 + 0.1 * Math.sin(t * 0.7) + 0.05 * Math.sin(t * 1.3);
          const spike = Math.random() < 0.08 ? 0.4 + Math.random() * 0.5 : 0;
          next.push(Math.max(0.02, Math.min(0.98, base + spike + Math.random() * 0.08)));
          return next;
        });
      }

      // Cycle transaction feed every 90 frames
      if (frameRef.current % 90 === 0) {
        const ids = ["TX-8A2F", "TX-1D7C", "TX-9E3B", "TX-4F1A", "TX-6C9D", "TX-3E8A", "TX-7B2F", "TX-0D4E"];
        const amounts = ["$2,340", "$45", "$189", "$5,670", "$12", "$890", "$3,200", "$67"];
        const newTxn = {
          id: ids[Math.floor(Math.random() * ids.length)],
          amount: amounts[Math.floor(Math.random() * amounts.length)],
          score: Math.random(),
          flagged: false,
        };
        newTxn.flagged = newTxn.score > 0.65;
        setRecentTxns(prev => [newTxn, ...prev.slice(0, 3)]);
        setTotalScanned(p => p + Math.floor(Math.random() * 12) + 3);
        if (newTxn.flagged) setFlaggedCount(p => p + 1);
      }

    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const w = 280, h = 80, px = 8, py = 6;
  const iw = w - px * 2, ih = h - py * 2;
  const toY = (v: number) => py + (1 - v) * ih;

  const mainLine = smoothPath(anomalyScores, w, h, px, py);
  // Area fill path
  const areaPath = mainLine + ` L${(w - px).toFixed(1)},${(h - py).toFixed(1)} L${px.toFixed(1)},${(h - py).toFixed(1)} Z`;
  const thresholdY = toY(0.65);

  const m = METRICS[model];
  const lbl: React.CSSProperties = { fontSize: "0.36rem", color: "#4b5563", letterSpacing: "0.06em", textTransform: "uppercase", lineHeight: 1 };
  const vl: React.CSSProperties = { fontSize: "0.55rem", fontWeight: 700, fontFamily: "monospace", lineHeight: 1.3, color: "#e2e2f0" };

  return (
    <div ref={containerRef} style={{
      width: "100%", height: "100%", background: "#0a0a12", borderRadius: 10,
      overflow: "hidden", fontFamily: "var(--font)", display: "flex", flexDirection: "column",
    }}>
      {/* Top bar */}
      <div style={{
        background: "rgba(0,0,0,0.5)", borderBottom: `1px solid ${ACCENT}18`,
        padding: "4px 10px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 7, height: 7, borderRadius: "50%", background: ACCENT,
            boxShadow: `0 0 8px ${ACCENT}90`, animation: "blink 2.5s ease infinite",
          }} />
          <span style={{ fontSize: "0.45rem", fontWeight: 700, color: ACCENT, letterSpacing: "0.08em" }}>FRAUD DETECTION</span>
          <span style={{ fontSize: "0.38rem", color: "#6b7280" }}>|</span>
          <span style={{ fontSize: "0.38rem", color: "#9ca3af", fontFamily: "monospace" }}>{totalScanned.toLocaleString()} scanned</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: "0.38rem", color: "#ef4444", fontWeight: 600, fontFamily: "monospace" }}>{flaggedCount} flagged</span>
          <span style={{ fontSize: "0.36rem", fontWeight: 700, color: "#22c55e", background: "rgba(34,197,94,0.12)", padding: "1px 5px", borderRadius: 3 }}>LIVE</span>
        </div>
      </div>

      {/* Middle — chart + side panel */}
      <div style={{ flex: 1, display: "flex", minHeight: 0 }}>

        {/* Main chart area */}
        <div style={{ flex: 1, position: "relative", minHeight: 0, display: "flex", flexDirection: "column" }}>

          {/* Model tabs */}
          <div style={{ display: "flex", gap: 3, padding: "6px 8px 0" }}>
            {MODELS.map((d, i) => (
              <button
                key={d}
                onClick={() => setModel(i)}
                style={{
                  padding: "3px 8px", fontSize: "0.42rem", fontWeight: 600,
                  background: model === i ? `${ACCENT}18` : "transparent",
                  color: model === i ? ACCENT : "#4b5563",
                  border: `1px solid ${model === i ? `${ACCENT}35` : "transparent"}`,
                  borderRadius: 5, letterSpacing: "0.03em", transition: "all 0.25s",
                  cursor: "pointer",
                }}
              >
                {d}
              </button>
            ))}
          </div>

          {/* SVG Chart */}
          <div style={{ flex: 1, padding: "2px 4px", minHeight: 0 }}>
            <svg viewBox={`0 0 ${w} ${h}`} width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
              <defs>
                <linearGradient id="fraudAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={ACCENT} stopOpacity="0.3" />
                  <stop offset="50%" stopColor={ACCENT} stopOpacity="0.08" />
                  <stop offset="100%" stopColor={ACCENT} stopOpacity="0" />
                </linearGradient>
                <linearGradient id="fraudLineGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor={ACCENT} stopOpacity="0.3" />
                  <stop offset="70%" stopColor={ACCENT} stopOpacity="0.9" />
                  <stop offset="100%" stopColor={ACCENT} stopOpacity="1" />
                </linearGradient>
                <filter id="glowLine">
                  <feGaussianBlur stdDeviation="1.5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="spikePulse">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Subtle grid */}
              {[0.2, 0.4, 0.6, 0.8].map(v => (
                <line key={v} x1={px} x2={w - px} y1={toY(v)} y2={toY(v)} stroke="#ffffff06" strokeWidth="0.4" />
              ))}
              {/* Y-axis labels */}
              {[0.2, 0.4, 0.6, 0.8].map(v => (
                <text key={`l${v}`} x={px - 1} y={toY(v) + 1.5} textAnchor="end" fill="#4b5563" fontSize="3">{v.toFixed(1)}</text>
              ))}

              {/* Danger zone above threshold */}
              <rect x={px} y={py} width={iw} height={thresholdY - py} fill="#ef444406" />

              {/* Threshold line */}
              <line x1={px} x2={w - px} y1={thresholdY} y2={thresholdY}
                stroke="#ef4444" strokeWidth="0.5" strokeDasharray="3,2" opacity="0.45" />
              <text x={w - px - 1} y={thresholdY - 2.5} textAnchor="end" fill="#ef4444" fontSize="3.2" opacity="0.6">
                ANOMALY THRESHOLD
              </text>

              {/* Area fill */}
              <path d={areaPath} fill="url(#fraudAreaGrad)" />

              {/* Main score line with glow */}
              <path d={mainLine} fill="none" stroke="url(#fraudLineGrad)" strokeWidth="1.5"
                strokeLinecap="round" strokeLinejoin="round" filter="url(#glowLine)" />

              {/* Spike indicators — circles on high-score points */}
              {anomalyScores.map((score, i) => {
                if (score < 0.65) return null;
                const cx = px + (i / (anomalyScores.length - 1)) * iw;
                const cy = toY(score);
                return (
                  <g key={i}>
                    <circle cx={cx} cy={cy} r="5" fill={ACCENT} opacity="0.12" filter="url(#spikePulse)" />
                    <circle cx={cx} cy={cy} r="2.5" fill="none" stroke="#ef4444" strokeWidth="0.6" opacity="0.6">
                      <animate attributeName="r" values="2.5;5;2.5" dur="2s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.6;0.15;0.6" dur="2s" repeatCount="indefinite" />
                    </circle>
                    <circle cx={cx} cy={cy} r="1.5" fill="#ef4444">
                      <animate attributeName="opacity" values="1;0.5;1" dur="1.5s" repeatCount="indefinite" />
                    </circle>
                  </g>
                );
              })}

              {/* Latest point highlight */}
              {(() => {
                const last = anomalyScores[anomalyScores.length - 1];
                const cx = w - px;
                const cy = toY(last);
                const c = last > 0.65 ? "#ef4444" : ACCENT;
                return (
                  <g>
                    <circle cx={cx} cy={cy} r="6" fill={c} opacity="0.1">
                      <animate attributeName="r" values="4;8;4" dur="2s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.15;0.03;0.15" dur="2s" repeatCount="indefinite" />
                    </circle>
                    <circle cx={cx} cy={cy} r="2" fill={c}>
                      <animate attributeName="opacity" values="1;0.6;1" dur="1.2s" repeatCount="indefinite" />
                    </circle>
                  </g>
                );
              })()}
            </svg>
          </div>
        </div>

        {/* Right side panel — transaction feed */}
        <div style={{
          width: 90, flexShrink: 0, padding: "6px 6px", display: "flex", flexDirection: "column",
          borderLeft: "1px solid rgba(255,255,255,0.04)", gap: 4, overflow: "hidden",
        }}>
          <div style={{ ...lbl, marginBottom: 1 }}>RECENT TRANSACTIONS</div>
          {recentTxns.map((txn, i) => (
            <div key={`${txn.id}-${i}`} style={{
              background: txn.flagged ? "rgba(239,68,68,0.08)" : "rgba(255,255,255,0.02)",
              border: `1px solid ${txn.flagged ? "rgba(239,68,68,0.2)" : "rgba(255,255,255,0.04)"}`,
              borderRadius: 4, padding: "3px 5px",
              transition: "all 0.3s",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.38rem", color: "#9ca3af", fontFamily: "monospace" }}>{txn.id}</span>
                {txn.flagged && (
                  <span style={{ fontSize: "0.3rem", fontWeight: 700, color: "#ef4444", background: "rgba(239,68,68,0.15)", padding: "0px 3px", borderRadius: 2 }}>FRAUD</span>
                )}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 1 }}>
                <span style={{ fontSize: "0.42rem", fontWeight: 600, color: "#e2e2f0", fontFamily: "monospace" }}>{txn.amount}</span>
                <span style={{
                  fontSize: "0.36rem", fontWeight: 600, fontFamily: "monospace",
                  color: txn.score > 0.65 ? "#ef4444" : txn.score > 0.3 ? ACCENT : "#22c55e",
                }}>{txn.score.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom metrics bar */}
      <div style={{
        background: "rgba(0,0,0,0.45)", borderTop: `1px solid ${ACCENT}12`,
        padding: "5px 10px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0,
      }}>
        {[
          { label: "PRECISION", value: m.precision },
          { label: "RECALL", value: m.recall },
          { label: "F1", value: m.f1 },
          { label: "AUC", value: m.auc },
        ].map(metric => (
          <div key={metric.label} style={{ textAlign: "center" }}>
            <div style={{ fontSize: "0.34rem", color: "#4b5563", letterSpacing: "0.08em", marginBottom: 1 }}>{metric.label}</div>
            <div style={{ fontSize: "0.58rem", fontWeight: 700, color: "#e2e2f0", fontVariantNumeric: "tabular-nums", fontFamily: "monospace" }}>{metric.value}</div>
          </div>
        ))}
        {/* Mini anomaly rate indicator */}
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "0.34rem", color: "#4b5563", letterSpacing: "0.08em", marginBottom: 1 }}>ANOMALY RATE</div>
          <div style={{ fontSize: "0.58rem", fontWeight: 700, color: "#ef4444", fontVariantNumeric: "tabular-nums", fontFamily: "monospace" }}>
            {(flaggedCount / totalScanned * 100).toFixed(1)}%
          </div>
        </div>
      </div>
    </div>
  );
}
