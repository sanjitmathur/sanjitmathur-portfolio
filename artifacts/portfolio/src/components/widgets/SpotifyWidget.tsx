import { useEffect, useRef, useState } from "react";

const TRACKS = [
  { title: "Blinding Lights", artist: "The Weeknd", bpm: 171, genre: "Pop" },
  { title: "Bohemian Rhapsody", artist: "Queen", bpm: 72, genre: "Rock" },
  { title: "Levitating", artist: "Dua Lipa", bpm: 103, genre: "Pop" },
];

const BAR_COUNT = 20;

export default function SpotifyWidget() {
  const [playing, setPlaying] = useState(false);
  const [track] = useState(0);
  const [bars, setBars] = useState(() => Array.from({ length: BAR_COUNT }, (_, i) => 0.1 + 0.06 * Math.abs(Math.sin(i * 0.8))));
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number>(0);
  const playingRef = useRef(false);
  const frameRef = useRef(0);

  useEffect(() => { playingRef.current = playing; }, [playing]);

  useEffect(() => {
    const animate = () => {
      frameRef.current++;
      const f = frameRef.current;
      const isPlaying = playingRef.current;

      setBars(Array.from({ length: BAR_COUNT }, (_, i) => {
        const phase = i * 0.45;
        const slow = Math.abs(Math.sin(f * 0.022 + phase));
        const mid  = Math.abs(Math.sin(f * 0.07  + phase * 1.3));
        const fast = Math.abs(Math.sin(f * 0.18  + phase * 0.7));

        if (isPlaying) {
          return 0.1 + slow * 0.25 + mid * 0.35 + fast * 0.30;
        } else {
          return 0.04 + slow * 0.12 + mid * 0.08;
        }
      }));

      if (isPlaying) setProgress(p => (p + 0.00065) % 1);
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const t = TRACKS[track];
  const elapsed = Math.floor(progress * 213);
  const mm = Math.floor(elapsed / 60), ss = elapsed % 60;

  return (
    <div style={{ width: "100%", height: "100%", background: "#0f1a0d", borderRadius: 12, padding: "14px 16px", display: "flex", flexDirection: "column", gap: 10, fontFamily: "var(--font)", overflow: "hidden" }}>
      {/* Top row: album + info + speaker */}
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        {/* Album art */}
        <div style={{
          width: 44, height: 44, borderRadius: 8, flexShrink: 0,
          background: "linear-gradient(135deg, #1db954 0%, #191414 100%)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: playing ? "0 0 18px rgba(29,185,84,0.5)" : "none",
          transition: "box-shadow 0.4s",
          animation: playing ? "spin 4s linear infinite" : "none",
        }}>
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
          {playing && (
            <>
              <path d="M19 10c2.5 1.5 4 4 4 6s-1.5 4.5-4 6" stroke="#1db954" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
              <path d="M21 7c4 2.5 6 5.5 6 9s-2 6.5-6 9" stroke="#1db954" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
            </>
          )}
        </svg>
      </div>

      {/* Progress bar */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: "0.5rem", color: "#4b5563", fontVariantNumeric: "tabular-nums" }}>{mm}:{String(ss).padStart(2, "0")}</span>
        <div style={{ flex: 1, height: 3, background: "rgba(255,255,255,0.08)", borderRadius: 2, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${progress * 100}%`, background: "#1db954", borderRadius: 2, transition: "width 0.1s linear" }} />
        </div>
        <span style={{ fontSize: "0.5rem", color: "#4b5563" }}>3:33</span>
      </div>

      {/* Frequency bars — always animated */}
      <div style={{ display: "flex", gap: 2, alignItems: "flex-end", height: 52, flex: 1 }}>
        {bars.map((h, i) => {
          const hue = 141 + i * 2;
          const lightness = playing ? 35 + h * 35 : 28 + h * 20;
          return (
            <div
              key={i}
              style={{
                flex: 1,
                borderRadius: "2px 2px 1px 1px",
                background: `hsl(${hue},72%,${lightness}%)`,
                height: `${Math.max(6, h * 100)}%`,
                transition: "height 0.07s ease-out",
                transformOrigin: "bottom",
              }}
            />
          );
        })}
      </div>

      {/* Controls */}
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 16 }}>
        <button style={{ background: "none", border: "none", cursor: "none", color: "#4b5563", fontSize: "0.8rem", padding: 0 }}>⏮</button>
        <button
          onClick={() => setPlaying(p => !p)}
          style={{
            width: 32, height: 32, borderRadius: "50%", background: "#1db954",
            border: "none", cursor: "none",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: playing ? "0 0 18px rgba(29,185,84,0.55)" : "none",
            transition: "box-shadow 0.3s", fontSize: "0.75rem",
          }}
        >
          {playing ? "⏸" : "▶"}
        </button>
        <button style={{ background: "none", border: "none", cursor: "none", color: "#4b5563", fontSize: "0.8rem", padding: 0 }}>⏭</button>
      </div>
    </div>
  );
}
