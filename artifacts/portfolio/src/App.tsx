import { useState, useEffect } from "react";
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

  /* Lenis smooth scroll removed — caused visible bounce/jitter from
     scroll-position animation conflicting with layout observers */

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", transition: "background 0.35s ease" }}>
      {/* <Cursor /> */}
      <Grain />
      {!loaded && (
        <Loader onComplete={() => { setLoaded(true); document.fonts.ready.then(() => setTimeout(() => setShow(true), 80)); }} />
      )}
      <div style={{
        opacity: show ? 1 : 0,
        transform: show ? "none" : "translateY(16px)",
        transition: "opacity 1s cubic-bezier(0.16,1,0.3,1) 0.05s, transform 1s cubic-bezier(0.16,1,0.3,1) 0.05s",
      }}>
        <Nav />
        <main>
          {show && <Hero />}
          <div style={{ padding: "0 var(--section-px)" }}><hr className="section-divider" /></div>
          <Experience />
          <div style={{ padding: "0 var(--section-px)" }}><hr className="section-divider" /></div>
          <Projects />
          <div style={{ padding: "0 var(--section-px)" }}><hr className="section-divider" /></div>
          <Skills />
          <div style={{ padding: "0 var(--section-px)" }}><hr className="section-divider" /></div>
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
