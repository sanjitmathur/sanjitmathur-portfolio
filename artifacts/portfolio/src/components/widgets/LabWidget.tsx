import { useEffect, useState } from "react";

const snippets = [
  ["import React from 'react';", "const App = () => {", "  return <Dashboard />;", "};"],
  ["def train_model(X, y):", "  lr = LogisticRegression()", "  lr.fit(X, y)", "  return lr"],
  ["const router = express.Router();", "router.get('/api/students',", "  async (req, res) => {", "    res.json(await db.all());"],
];

export default function LabWidget() {
  const [snip, setSnip] = useState(0);
  const [lines, setLines] = useState(0);
  const [count, setCount] = useState(0);
  const [blink, setBlink] = useState(true);

  // Typewriter: reveal lines one at a time
  useEffect(() => {
    setLines(0);
    const cur = snippets[snip];
    let l = 0;
    const t = setInterval(() => {
      l++;
      setLines(l);
      if (l >= cur.length) {
        clearInterval(t);
        setTimeout(() => setSnip(s => (s + 1) % snippets.length), 2200);
      }
    }, 500);
    return () => clearInterval(t);
  }, [snip]);

  // Cursor blink
  useEffect(() => {
    const t = setInterval(() => setBlink(b => !b), 530);
    return () => clearInterval(t);
  }, []);

  // Count up to 500
  useEffect(() => {
    let n = 0;
    const t = setInterval(() => {
      n += 7;
      if (n >= 500) { setCount(500); clearInterval(t); } else setCount(n);
    }, 25);
    return () => clearInterval(t);
  }, []);

  const colors = ["#e06c75", "#61afef", "#98c379", "#c678dd", "#e5c07b", "#61afef"];
  const cur = snippets[snip];

  return (
    <div style={{ width: "100%", height: "100%", background: "#1e2030", borderRadius: 12, overflow: "hidden", fontFamily: "'Fira Code', 'Cascadia Code', monospace", display: "flex", flexDirection: "column" }}>
      {/* Editor header */}
      <div style={{ background: "#15172a", padding: "8px 14px", display: "flex", alignItems: "center", gap: 6, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#ff5f57" }} />
        <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#febc2e" }} />
        <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#28c840" }} />
        <span style={{ fontSize: "0.55rem", color: "#4b5563", marginLeft: 6 }}>app.{snip === 1 ? "py" : snip === 0 ? "tsx" : "js"}</span>
      </div>

      {/* Code area */}
      <div style={{ flex: 1, padding: "12px 16px", display: "flex", flexDirection: "column", gap: 3, overflowY: "hidden" }}>
        {Array.from({ length: 4 }, (_, i) => (
          <div key={`${snip}-${i}`} style={{ display: "flex", gap: 10, alignItems: "center", opacity: i < lines ? 1 : 0, transform: i < lines ? "translateX(0)" : "translateX(-8px)", transition: "opacity 0.3s ease, transform 0.3s ease" }}>
            <span style={{ fontSize: "0.5rem", color: "#4b5563", userSelect: "none", width: 12, textAlign: "right" }}>{i + 1}</span>
            <span style={{ fontSize: "0.65rem", color: colors[i % colors.length], whiteSpace: "pre" }}>
              {i < lines ? cur[i] : ""}
            </span>
            {i === lines - 1 && <span style={{ width: 5, height: "0.65rem", background: "#abb2bf", opacity: blink ? 1 : 0, transition: "opacity 0.1s" }} />}
          </div>
        ))}
      </div>

      {/* Footer stat */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "10px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 6px #22c55e" }} />
          <span style={{ fontSize: "0.55rem", color: "#6b7280" }}>Lab of Future · EdTech</span>
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 3 }}>
          <span style={{ fontSize: "1rem", fontWeight: 700, color: "#22c55e", fontFamily: "var(--font)" }}>{count}+</span>
          <span style={{ fontSize: "0.5rem", color: "#4b5563" }}>students</span>
        </div>
      </div>
    </div>
  );
}
