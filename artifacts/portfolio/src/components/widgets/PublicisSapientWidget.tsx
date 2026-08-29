import { useEffect, useRef, useState } from "react";
import { useInView } from "../useInView";

const ENDPOINTS = [
  { method: "POST", path: "/api/auth/login", status: 200 },
  { method: "GET",  path: "/api/tasks?page=1&limit=20", status: 200 },
  { method: "POST", path: "/api/tasks", status: 201 },
  { method: "PUT",  path: "/api/tasks/42", status: 200 },
  { method: "GET",  path: "/api/users/me", status: 200 },
  { method: "DELETE", path: "/api/tasks/17", status: 200 },
  { method: "POST", path: "/api/auth/refresh", status: 201 },
  { method: "GET",  path: "/api/tasks?filter=active", status: 200 },
  { method: "GET",  path: "/api/admin/users", status: 200 },
  { method: "PUT",  path: "/api/tasks/55", status: 200 },
];

const METHOD_COLOR: Record<string, string> = {
  GET:    "#61afef",
  POST:   "#98c379",
  PUT:    "#e5c07b",
  DELETE: "#e06c75",
};

const STATUS_COLOR: Record<number, string> = {
  200: "#98c379",
  201: "#56b6c2",
  401: "#e06c75",
};

const ACCENT = "#6366f1";

export default function PublicisSapientWidget() {
  const { ref: containerRef, inView } = useInView("200px 0px");
  const inViewRef = useRef(false);
  useEffect(() => { inViewRef.current = inView; }, [inView]);

  const [logs, setLogs] = useState<typeof ENDPOINTS>([]);
  const [reqCount, setReqCount] = useState(1_238);
  const idxRef = useRef(0);

  // Animate total request counter
  useEffect(() => {
    const t = setInterval(() => {
      if (!inViewRef.current) return;
      setReqCount(n => n + Math.floor(Math.random() * 3) + 1);
    }, 900);
    return () => clearInterval(t);
  }, []);

  // Stream request log entries
  useEffect(() => {
    const t = setInterval(() => {
      if (!inViewRef.current) return;
      const entry = ENDPOINTS[idxRef.current % ENDPOINTS.length];
      idxRef.current++;
      setLogs(prev => [...prev.slice(-4), entry]);
    }, 1_300);
    return () => clearInterval(t);
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%", height: "100%",
        background: "#0d1117",
        borderRadius: 12,
        padding: "clamp(10px,2vw,14px) clamp(12px,2.3vw,16px)",
        display: "flex", flexDirection: "column", gap: 8,
        fontFamily: "'Fira Code','Cascadia Code',monospace",
        overflow: "hidden", minHeight: 0,
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 22, height: 22, borderRadius: 6,
            background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "0.65rem", fontWeight: 800, color: ACCENT,
          }}>
            PS
          </div>
          <div>
            <div style={{ fontSize: "0.58rem", color: "#6b7280", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Publicis Sapient · AI Backend
            </div>
            <div style={{ fontSize: "clamp(0.88rem,1.8vw,1.05rem)", fontWeight: 700, color: "#f5f5f7", letterSpacing: "-0.01em", lineHeight: 1.1 }}>
              REST API Server
            </div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2 }}>
          <span style={{
            fontSize: "0.55rem", fontWeight: 600, color: "#98c379",
            background: "rgba(152,195,121,0.12)",
            padding: "2px 7px", borderRadius: 100,
            display: "flex", alignItems: "center", gap: 4,
          }}>
            <span style={{
              width: 5, height: 5, borderRadius: "50%",
              background: "#98c379",
              animation: "blink 2.5s ease infinite",
              display: "inline-block",
            }} />
            LIVE · 24ms
          </span>
          <span style={{ fontSize: "0.52rem", color: "#4b5563" }}>req / session</span>
          <span style={{ fontSize: "clamp(0.85rem,1.6vw,1rem)", fontWeight: 700, color: ACCENT, letterSpacing: "-0.02em" }}>
            {reqCount.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Request log stream */}
      <div style={{
        flex: 1, minHeight: 0,
        display: "flex", flexDirection: "column", gap: 4,
        justifyContent: "flex-end",
        overflow: "hidden",
      }}>
        {logs.length === 0 && (
          <div style={{ fontSize: "0.55rem", color: "#4b5563" }}>Awaiting requests…</div>
        )}
        {logs.map((log, i) => (
          <div
            key={`${i}-${log.path}`}
            style={{
              display: "flex", gap: 6, alignItems: "center",
              opacity: 0.3 + (i / logs.length) * 0.7,
              transition: "opacity 0.4s ease",
            }}
          >
            <span style={{
              fontSize: "0.55rem", fontWeight: 700, minWidth: 36,
              color: METHOD_COLOR[log.method] ?? "#abb2bf",
            }}>
              {log.method}
            </span>
            <span style={{
              fontSize: "0.55rem", color: "#6b7280",
              flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>
              {log.path}
            </span>
            <span style={{
              fontSize: "0.55rem", fontWeight: 600, flexShrink: 0,
              color: STATUS_COLOR[log.status] ?? "#abb2bf",
            }}>
              {log.status}
            </span>
          </div>
        ))}
      </div>

      {/* Footer: tech badges */}
      <div style={{
        borderTop: `1px solid rgba(99,102,241,0.12)`,
        paddingTop: 8, flexShrink: 0,
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div style={{ display: "flex", gap: 10 }}>
          {[
            { label: "Auth", value: "JWT · RBAC", color: "#98c379" },
            { label: "ORM",  value: "Prisma",     color: ACCENT },
          ].map(({ label, value, color }) => (
            <div key={label}>
              <div style={{ fontSize: "0.45rem", color: "#4b5563", textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</div>
              <div style={{ fontSize: "0.68rem", fontWeight: 600, color }}>{value}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <div style={{ width: 5, height: 5, borderRadius: "50%", background: ACCENT, boxShadow: `0 0 6px ${ACCENT}80` }} />
          <span style={{ fontSize: "0.5rem", color: "#6b7280" }}>Node.js · Express 5</span>
        </div>
      </div>
    </div>
  );
}
