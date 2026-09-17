import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Lenis from "lenis";
import { AnimatePresence } from "framer-motion";
import Nav from "@/components/Nav";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Mind from "@/pages/Mind";
import Project from "@/pages/Project";
import Process from "@/pages/Process";
import Moodboards from "@/pages/Moodboards";
import Archive from "@/pages/Archive";
import DressMe from "@/pages/DressMe";
import Contact from "@/pages/Contact";
import Admin from "@/pages/Admin";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    if (window.__lenis) {
      window.__lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname]);
  return null;
};

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/mind" element={<Mind />} />
        <Route path="/project" element={<Project />} />
        <Route path="/process" element={<Process />} />
        <Route path="/moodboards" element={<Moodboards />} />
        <Route path="/archive" element={<Archive />} />
        <Route path="/dress-me" element={<DressMe />} />
        {/* the atelier was the earlier name for Dress Me — the route still works */}
        <Route path="/atelier" element={<DressMe />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    window.__lenis = lenis;
    let rafId;
    const raf = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      window.__lenis = null;
    };
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <ScrollToTop />
        <Nav />
        <AnimatedRoutes />
      </BrowserRouter>
    </div>
  );
}

export default App;
