import { useEffect, useRef, useState } from "react";

const QA_POOL = [
  { q: "What is gradient descent?", a: "An optimization algorithm that iteratively adjusts parameters to minimize a loss function." },
  { q: "Explain transformer attention.", a: "A mechanism that computes weighted relationships between all input tokens simultaneously." },
  { q: "What is overfitting?", a: "When a model learns training data too well, failing to generalize to new examples." },
  { q: "Define precision vs recall.", a: "Precision = true positives / predicted positives. Recall = true positives / actual positives." },
  { q: "What is a REST API?", a: "An architectural style for networked applications using HTTP methods for stateless operations." },
];

export default function ExamForgeWidget() {
  const [qIdx, setQIdx] = useState(0);
  const [phase, setPhase] = useState<"typing-q" | "typing-a" | "done">("typing-q");
  const [qText, setQText] = useState("");
  const [aText, setAText] = useState("");
  const [blink, setBlink] = useState(true);
  const [score] = useState(Math.floor(Math.random() * 6) + 14);
  const [generating, setGenerating] = useState(true);

  const cur = QA_POOL[qIdx % QA_POOL.length];
  const taRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setPhase("typing-q");
    setQText("");
    setAText("");
    setGenerating(true);
    if (taRef.current) clearInterval(taRef.current);

    let i = 0;
    const tq = setInterval(() => {
      i++;
      setQText(cur.q.slice(0, i));
      if (i >= cur.q.length) {
        clearInterval(tq);
        setPhase("typing-a");
        let j = 0;
        taRef.current = setInterval(() => {
          j++;
          setAText(cur.a.slice(0, j));
          if (j >= cur.a.length) {
            if (taRef.current) clearInterval(taRef.current);
            setPhase("done");
            setGenerating(false);
            setTimeout(() => {
              setQIdx(prev => (prev + 1) % QA_POOL.length);
            }, 2500);
          }
        }, 18);
      }
    }, 28);
    return () => {
      clearInterval(tq);
      if (taRef.current) clearInterval(taRef.current);
    };
  }, [qIdx]);

  useEffect(() => {
    const t = setInterval(() => setBlink(b => !b), 530);
    return () => clearInterval(t);
  }, []);

  const progress = ((qIdx % QA_POOL.length) / QA_POOL.length) * 100;

  return (
    <div style={{ width: "100%", height: "100%", background: "#0e0f0a", borderRadius: 12, overflow: "hidden", fontFamily: "var(--font)", display: "flex", flexDirection: "column" }}>
      {/* Header bar */}
      <div style={{ background: "#13140e", padding: "9px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(213,181,114,0.1)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 22, height: 22, borderRadius: 6, background: "linear-gradient(135deg, #d5b572, #9c7d3a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.55rem", fontWeight: 700, color: "#1a160a" }}>EF</div>
          <div>
            <div style={{ fontSize: "0.6rem", fontWeight: 600, color: "#f5f5f7" }}>ExamForge</div>
            <div style={{ fontSize: "0.48rem", color: "#4b5563" }}>GPT-4 · Adaptive Difficulty</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          {generating && (
            <div style={{ fontSize: "0.48rem", color: "#d5b572", background: "rgba(213,181,114,0.1)", padding: "2px 7px", borderRadius: 100, border: "1px solid rgba(213,181,114,0.2)", animation: "blink 1.5s ease infinite" }}>
              AI generating…
            </div>
          )}
          <div style={{ fontSize: "0.55rem", fontWeight: 600, color: "#22c55e" }}>{score}/20</div>
        </div>
      </div>

      {/* Document area */}
      <div style={{ flex: 1, padding: "12px 16px", display: "flex", flexDirection: "column", gap: 10, overflowY: "hidden" }}>
        {/* Question card */}
        <div style={{ background: "rgba(213,181,114,0.06)", border: "1px solid rgba(213,181,114,0.2)", borderRadius: 8, padding: "10px 12px" }}>
          <div style={{ fontSize: "0.48rem", color: "#d5b572", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 5 }}>
            Question {(qIdx % QA_POOL.length) + 1} / {QA_POOL.length}
          </div>
          <div style={{ fontSize: "0.65rem", color: "#f5f5f7", lineHeight: 1.6, minHeight: 28 }}>
            {qText}
            {phase === "typing-q" && <span style={{ opacity: blink ? 1 : 0 }}>|</span>}
          </div>
        </div>

        {/* Answer area */}
        {phase !== "typing-q" && (
          <div style={{ background: "rgba(34,197,94,0.04)", border: "1px solid rgba(34,197,94,0.15)", borderRadius: 8, padding: "10px 12px", flex: 1 }}>
            <div style={{ fontSize: "0.48rem", color: "#22c55e", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 5 }}>Answer</div>
            <div style={{ fontSize: "0.62rem", color: "#9ca3af", lineHeight: 1.7, minHeight: 40 }}>
              {aText}
              {phase === "typing-a" && <span style={{ opacity: blink ? 1 : 0, color: "#22c55e" }}>|</span>}
            </div>
            {phase === "done" && (
              <div style={{ marginTop: 8, display: "flex", gap: 4, flexWrap: "wrap" }}>
                {["Conceptual", "Accurate", "Concise"].map(tag => (
                  <span key={tag} style={{ fontSize: "0.42rem", color: "#22c55e", background: "rgba(34,197,94,0.08)", padding: "1px 6px", borderRadius: 100, border: "1px solid rgba(34,197,94,0.2)" }}>✓ {tag}</span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Progress */}
      <div style={{ padding: "8px 14px", borderTop: "1px solid rgba(213,181,114,0.08)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
          <span style={{ fontSize: "0.45rem", color: "#4b5563" }}>Exam Progress</span>
          <span style={{ fontSize: "0.45rem", color: "#d5b572" }}>{Math.round(progress)}%</span>
        </div>
        <div style={{ height: 2, background: "rgba(255,255,255,0.06)", borderRadius: 1, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg, #d5b572, #9c7d3a)", borderRadius: 1, transition: "width 0.5s ease" }} />
        </div>
      </div>
    </div>
  );
}
