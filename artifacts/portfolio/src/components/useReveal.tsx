import { useEffect, useRef } from "react";

export function useReveal(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        el.classList.add("in");
      } else {
        el.classList.remove("in");
      }
    }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return ref;
}

/**
 * Accepts either:
 *   useRevealChildren()                      → returns a ref to attach to the container
 *   useRevealChildren(externalRef, ".sel")   → uses an external ref + optional selector
 */
export function useRevealChildren(
  refOrThreshold?: React.RefObject<HTMLElement | null> | number,
  _selector?: string,
  threshold = 0.06,
) {
  const internalRef = useRef<HTMLDivElement>(null);

  const containerRef: React.RefObject<HTMLElement | null> =
    refOrThreshold && typeof refOrThreshold !== "number"
      ? refOrThreshold
      : internalRef;

  const actualThreshold =
    typeof refOrThreshold === "number" ? refOrThreshold : threshold;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const sel = _selector || ".r3d, .r3d-left, .r3d-right, .r3d-scale, .r3d-flip";
    const children = container.querySelectorAll(sel);

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).classList.add("in");
          } else {
            (entry.target as HTMLElement).classList.remove("in");
          }
        });
      },
      { threshold: actualThreshold },
    );

    children.forEach((child, i) => {
      const el = child as HTMLElement;
      if (!el.style.transitionDelay) el.style.transitionDelay = `${i * 0.12}s`;
      obs.observe(el);
    });

    return () => obs.disconnect();
  }, [actualThreshold]);

  return internalRef;
}
