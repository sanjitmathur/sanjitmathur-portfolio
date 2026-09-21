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
    const saved = localStorage.getItem("sm-scroll-animations");
    return saved !== null ? saved === "true" : true;
  });

  const setScrollAnimationsEnabled = (val: boolean) => {
    setScrollAnimationsEnabledState(val);
    localStorage.setItem("sm-scroll-animations", String(val));
  };

  const toggleScrollAnimations = () => {
    setScrollAnimationsEnabledState((prev) => {
      const next = !prev;
      localStorage.setItem("sm-scroll-animations", String(next));
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
