import { useState, useEffect } from "react";
import Lenis from "lenis";
import { ThemeProvider } from "./components/ThemeContext";
import { LanguageProvider } from "./components/LanguageContext";
import Loader from "./components/Loader";
import Cursor from "./components/Cursor";
import Grain from "./components/Grain";
import Nav from "./components/Nav";
import Hero from "./pages/Hero";
import Experience from "./pages/Experience";
import Projects from "./pages/Projects";
import Skills from "./pages/Skills";
import Contact from "./pages/Contact";

function AppInner() {
  const [loaded, setLoaded] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    // ensure data-theme is applied immediately from localStorage
    const saved = localStorage.getItem("sm-theme") || "dark";
    document.documentElement.setAttribute("data-theme", saved);
  }, []);

  useEffect(() => {
    if (!show) return;
    const lenis = new Lenis({
      duration: 1.6,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    const raf = (time: number) => { lenis.raf(time); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, [show]);

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", transition: "background 0.35s ease" }}>
      <Cursor />
      <Grain />
      {!loaded && (
        <Loader onComplete={() => { setLoaded(true); document.fonts.ready.then(() => setTimeout(() => setShow(true), 80)); }} />
      )}
      <div style={{
        opacity: show ? 1 : 0,
        transform: show ? "none" : "translateY(24px)",
        transition: "opacity 0.8s cubic-bezier(0.33,1,0.68,1) 0.1s, transform 0.8s cubic-bezier(0.33,1,0.68,1) 0.1s",
      }}>
        <Nav />
        <main>
          {show && <Hero />}
          <Experience />
          <Projects />
          <Skills />
          <Contact />
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AppInner />
      </LanguageProvider>
    </ThemeProvider>
  );
}
