import { createContext, useContext, useState, type ReactNode } from "react";

interface ScrollAnimationCtx {
  scrollAnimationsEnabled: boolean;
  toggleScrollAnimations: () => void;
  setScrollAnimationsEnabled: (val: boolean) => void;
}

const ScrollAnimationContext = createContext<ScrollAnimationCtx>({
  scrollAnimationsEnabled: true,
  toggleScrollAnimations: () => {},
  setScrollAnimationsEnabled: () => {},
});

export function ScrollAnimationProvider({ children }: { children: ReactNode }) {
  const [scrollAnimationsEnabled, setScrollAnimationsEnabledState] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem("sm-scroll-animations");
      return saved !== null ? saved === "true" : true;
    } catch {
      return true;
    }
  });

  const setScrollAnimationsEnabled = (val: boolean) => {
    setScrollAnimationsEnabledState(val);
    try {
      localStorage.setItem("sm-scroll-animations", String(val));
    } catch {}
  };

  const toggleScrollAnimations = () => {
    setScrollAnimationsEnabledState((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("sm-scroll-animations", String(next));
      } catch {}
      return next;
    });
  };

  return (
    <ScrollAnimationContext.Provider
      value={{
        scrollAnimationsEnabled,
        toggleScrollAnimations,
        setScrollAnimationsEnabled,
      }}
    >
      {children}
    </ScrollAnimationContext.Provider>
  );
}

export function useScrollAnimation() {
  return useContext(ScrollAnimationContext);
}
