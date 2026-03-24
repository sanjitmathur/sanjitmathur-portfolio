import { useEffect, useRef } from "react";

export function useReveal(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { el.classList.add("in"); obs.unobserve(el); }
    }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return ref;
}

export function useRevealChildren(threshold = 0.06) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    const children = container.querySelectorAll(".r3d, .r3d-left, .r3d-right, .r3d-scale, .r3d-flip");
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).classList.add("in");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold });
    children.forEach((child, i) => {
      const el = child as HTMLElement;
      if (!el.style.transitionDelay) el.style.transitionDelay = `${i * 0.1}s`;
      obs.observe(el);
    });
    return () => obs.disconnect();
  }, [threshold]);
  return ref;
}
