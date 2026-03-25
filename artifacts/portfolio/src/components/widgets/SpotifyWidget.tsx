import { useEffect, useRef, useState } from "react";

const TRACKS = [
  { title: "Blinding Lights", artist: "The Weeknd", bpm: 171, genre: "Pop" },
  { title: "Bohemian Rhapsody", artist: "Queen", bpm: 72, genre: "Rock" },
  { title: "Levitating", artist: "Dua Lipa", bpm: 103, genre: "Pop" },
];

const BAR_COUNT = 12;

export default function SpotifyWidget() {
  const [playing, setPlaying] = useState(false);
  const [track] = useState(0);
  const [bars, setBars] = useState(Array(BAR_COUNT).fill(0.2));
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number>(0);
  const playingRef = useRef(false);

  useEffect(() => { playingRef.current = playing; }, [playing]);

  useEffect(() => {
    let frame = 0;
    const animate = () => {
      frame++;
      if (playingRef.current) {
        setBars(prev => prev.map((_, i) => {
          const base = 0.15 + 0.1 * Math.sin(frame * 0.05 + i * 0.7);
          const spike = 0.5 + 0.45 * Math.abs(Math.sin(frame * 0.12 + i * 1.1 + Math.sin(frame * 0.03)));
          return base + spike * 0.7;
        }));
        setProgress(p => (p + 0.0008) % 1);
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const t = TRACKS[track];
  const elapsed = Math.floor(progress * 213); // ~3:33
  const mm = Math.floor(elapsed / 60), ss = elapsed % 60;

  // Speaker SVG paths
  return (
    <div style={{ width: "100%", height: "100%", background: "#0f1420", borderRadius: 12, padding: "14px 16px", display: "flex", flexDirection: "column", gap: 10, fontFamily: "var(--font)", overflow: "hidden" }}>
      {/* Top row: album + info + speaker */}
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        {/* Album art */}
        <div style={{ width: 44, height: 44, borderRadius: 8, background: "linear-gradient(135deg, #1db954 0%, #191414 100%)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: playing ? "0 0 16px rgba(29,185,84,0.4)" : "none", transition: "box-shadow 0.4s", transform: playing ? "rotate(0deg)" : undefined, animation: playing ? "spin 4s linear infinite" : "none" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#1db954">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
          </svg>
        </div>

        {/* Track info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "#f5f5f7", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.title}</div>
          <div style={{ fontSize: "0.6rem", color: "#6b7280" }}>{t.artist}</div>
          <div style={{ fontSize: "0.5rem", color: "#1db954", marginTop: 1 }}>♩ {t.bpm} BPM · {t.genre}</div>
        </div>

        {/* Speaker SVG */}
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <path d="M6 11h5l6-6v22l-6-6H6V11z" fill="#1db954" opacity="0.9" />
          {playing && <>
            <path d="M19 10c2.5 1.5 4 4 4 6s-1.5 4.5-4 6" stroke="#1db954" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
            <path d="M21 7c4 2.5 6 5.5 6 9s-2 6.5-6 9" stroke="#1db954" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
          </>}
        </svg>
      </div>

      {/* Progress bar */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: "0.5rem", color: "#4b5563", fontVariantNumeric: "tabular-nums" }}>{mm}:{String(ss).padStart(2,"0")}</span>
        <div style={{ flex: 1, height: 3, background: "rgba(255,255,255,0.08)", borderRadius: 2, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${progress * 100}%`, background: "#1db954", borderRadius: 2, transition: "width 0.1s linear" }} />
        </div>
        <span style={{ fontSize: "0.5rem", color: "#4b5563" }}>3:33</span>
      </div>

      {/* Frequency bars */}
      <div style={{ display: "flex", gap: 3, alignItems: "flex-end", height: 44 }}>
        {bars.map((h, i) => (
          <div key={i} style={{ flex: 1, borderRadius: 2, background: playing ? `hsl(${141 + i * 3},72%,${35 + h * 30}%)` : "rgba(255,255,255,0.08)", height: `${playing ? h * 100 : 20}%`, transition: playing ? "height 0.06s ease, background 0.3s" : "height 0.4s ease, background 0.4s" }} />
        ))}
      </div>

      {/* Controls */}
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 16 }}>
        <button onClick={() => {}} style={{ background: "none", border: "none", cursor: "pointer", color: "#4b5563", fontSize: "0.8rem", padding: 0 }}>⏮</button>
        <button
          onClick={() => setPlaying(p => !p)}
          style={{ width: 32, height: 32, borderRadius: "50%", background: "#1db954", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: playing ? "0 0 16px rgba(29,185,84,0.5)" : "none", transition: "box-shadow 0.3s", fontSize: "0.75rem" }}
        >
          {playing ? "⏸" : "▶"}
        </button>
        <button onClick={() => {}} style={{ background: "none", border: "none", cursor: "pointer", color: "#4b5563", fontSize: "0.8rem", padding: 0 }}>⏭</button>
      </div>
    </div>
  );
}
