import { useEffect, useRef, useState } from "react";

const NAME_VARIANTS = [
  "サンジット・マトゥール",  // Japanese
  "سانجیت ماتھر",        // Urdu
  "산짓 마투르",            // Korean
  "Санжит Матхур",       // Russian
  "সঞ্জিৎ মাথুর",          // Bengali
  "Σάνζιτ Μαθούρ",       // Greek
  "ซันจิต มาทูร์",         // Thai
  "סנג׳יט מאטור",        // Hebrew
  "سنجیت ماتور",         // Arabic
  "சஞ்சித் மாதுர்",         // Tamil
  "ସଞ୍ଜିତ ମାଥୁର",        // Odia
  "સંજિત માથુર",          // Gujarati
  "سنجیت ماتھور",        // Persian
  "สัญจิต มาธูร์",          // Thai alt
  "산지트 마투르",           // Korean alt
  "Сanjит Матур",        // Serbian
  "संजित माथुर",           // Hindi (penultimate)
  "Sanjit Mathur",       // English (final — slow settle)
];

const LAST = NAME_VARIANTS.length - 1;
const HINDI = LAST - 1;

export default function Loader({ onComplete }: { onComplete: () => void }) {
  const [pct, setPct] = useState(0);
  const [nameIdx, setNameIdx] = useState(0);
  const [nameOpacity, setNameOpacity] = useState(1);
  const [nameY, setNameY] = useState(0);
  const [phase, setPhase] = useState<"cycling" | "settling" | "done">("cycling");
  const fillRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Progress bar — runs independently, waits for name settle before exit
  useEffect(() => {
    const steps = 60, dur = 2200;
    let i = 0;
    const t = setInterval(() => {
      i++;
      setPct(Math.round((i / steps) * 100));
      if (fillRef.current) fillRef.current.style.transform = `scaleX(${i / steps})`;
      if (i >= steps) clearInterval(t);
    }, dur / steps);
    return () => clearInterval(t);
  }, []);

  // Exit: triggered when phase becomes "done"
  useEffect(() => {
    if (phase !== "done") return;
    const timer = setTimeout(() => {
      if (wrapRef.current) {
        wrapRef.current.style.opacity = "0";
        wrapRef.current.style.transform = "translateY(-20px)";
      }
      setTimeout(onComplete, 600);
    }, 400);
    return () => clearTimeout(timer);
  }, [phase, onComplete]);

  // Cycle through name variants
  useEffect(() => {
    if (phase !== "cycling") return;
    if (nameIdx >= HINDI) {
      // Reached Hindi — pause, then slow transition to English
      setPhase("settling");
      return;
    }
    const delay = 90;
    const timer = setTimeout(() => {
      setNameOpacity(0);
      setTimeout(() => {
        setNameIdx(prev => prev + 1);
        setNameOpacity(1);
      }, 60);
    }, delay);
    return () => clearTimeout(timer);
  }, [nameIdx, phase]);

  // Settling phase: Hindi holds, then slowly reveals English
  useEffect(() => {
    if (phase !== "settling") return;
    const timer = setTimeout(() => {
      // Fade out Hindi + slide up
      setNameOpacity(0);
      setNameY(-12);
      setTimeout(() => {
        setNameIdx(LAST);
        setNameY(12);
        // Small pause, then reveal English sliding into place
        requestAnimationFrame(() => {
          setTimeout(() => {
            setNameOpacity(1);
            setNameY(0);
            // Mark done after the settle animation completes
            setTimeout(() => setPhase("done"), 700);
          }, 60);
        });
      }, 350);
    }, 600);
    return () => clearTimeout(timer);
  }, [phase]);

  const isSettleTransition = phase === "settling" || phase === "done";

  return (
    <div ref={wrapRef} className="loader-wrap" style={{
      transition: "opacity 0.6s cubic-bezier(0.33,1,0.68,1), transform 0.6s cubic-bezier(0.33,1,0.68,1)",
    }}>
      <div className="loader-name" style={{
        opacity: nameOpacity,
        transform: `translateY(${nameY}px)`,
        transition: isSettleTransition
          ? "opacity 0.4s cubic-bezier(0.33,1,0.68,1), transform 0.5s cubic-bezier(0.33,1,0.68,1)"
          : "opacity 0.06s ease",
        minWidth: "12em",
        textAlign: "center",
      }}>
        {NAME_VARIANTS[nameIdx]}
      </div>
      <div className="loader-bar-track">
        <div ref={fillRef} className="loader-bar-fill" />
      </div>
      <span className="loader-pct">{String(pct).padStart(3, "0")}</span>
    </div>
  );
}
