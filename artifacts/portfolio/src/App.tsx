import { useState } from "react";
import Loader from "./components/Loader";
import Cursor from "./components/Cursor";
import Nav from "./components/Nav";
import Hero from "./pages/Hero";
import Experience from "./pages/Experience";
import Projects from "./pages/Projects";
import Skills from "./pages/Skills";
import Contact from "./pages/Contact";
import { Mouse3DProvider } from "./components/Mouse3DContext";

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [show, setShow] = useState(false);

  return (
    <Mouse3DProvider>
      <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
        <Cursor />
        {!loaded && (
          <Loader onComplete={() => { setLoaded(true); setTimeout(() => setShow(true), 60); }} />
        )}
        <div style={{ opacity: show ? 1 : 0, transition: "opacity 0.6s ease" }}>
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
    </Mouse3DProvider>
  );
}
