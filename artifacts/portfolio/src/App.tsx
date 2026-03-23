import { useState, useEffect } from "react";
import Loader from "./components/Loader";
import Cursor from "./components/Cursor";
import Nav from "./components/Nav";
import Hero from "./pages/Hero";
import Experience from "./pages/Experience";
import Projects from "./pages/Projects";
import Skills from "./pages/Skills";
import Contact from "./pages/Contact";

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [showContent, setShowContent] = useState(false);

  const handleLoaderComplete = () => {
    setLoaded(true);
    setTimeout(() => setShowContent(true), 50);
  };

  return (
    <div className="noise" style={{ background: "#0f0e0d", minHeight: "100vh", position: "relative" }}>
      {/* Custom cursor */}
      <Cursor />

      {/* Loader */}
      {!loaded && <Loader onComplete={handleLoaderComplete} />}

      {/* Main content */}
      <div
        style={{
          opacity: showContent ? 1 : 0,
          transition: "opacity 0.6s ease",
        }}
      >
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
