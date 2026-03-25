import { useState, useEffect } from "react";
import Lenis from "lenis";
import { ThemeProvider } from "./components/ThemeContext";
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
      duration: 1.1,
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
        <Loader onComplete={() => { setLoaded(true); setTimeout(() => setShow(true), 80); }} />
      )}
      <div style={{ opacity: show ? 1 : 0, transition: "opacity 0.8s ease" }}>
        <Nav />
        <main>
          <Hero />
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
      <AppInner />
    </ThemeProvider>
  );
}
