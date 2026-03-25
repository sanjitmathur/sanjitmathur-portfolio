export default function Grain() {
  return (
    <>
      <div style={{
        position: "fixed", inset: 0, zIndex: 99990, pointerEvents: "none",
        opacity: 0.055,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: "200px 200px",
        backgroundRepeat: "repeat",
        animation: "grainShift 0.4s steps(1) infinite",
      }} />
      <style>{`
        @keyframes grainShift {
          0%  { background-position: 0 0 }
          20% { background-position: -60px -20px }
          40% { background-position: 40px 60px }
          60% { background-position: -80px 30px }
          80% { background-position: 20px -50px }
          100%{ background-position: -40px 10px }
        }
      `}</style>
    </>
  );
}
