import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Placeholder from "@/components/Placeholder";
import Marquee from "@/components/Marquee";
import Reveal from "@/components/Reveal";
import MindTransition from "@/components/MindTransition";

// the three signature experiences — everything else on the site stays quiet around them
const EXPERIENCES = [
  {
    n: "01",
    title: "enter my mind",
    to: "/mind",
    line: "thoughts, memories, emotions, inspirations",
    note: "start with how you feel",
    tone: "ivory",
  },
  {
    n: "02",
    title: "dress me",
    to: "/dress-me",
    line: "six decisions, one garment, made by you",
    note: "designed in vamika's world",
    tone: "burgundy",
  },
  {
    n: "03",
    title: "moodboards",
    to: "/moodboards",
    line: "the references and research behind the work",
    note: "everything i pinned up",
    tone: "ivory",
  },
];

const CHAPTERS = [
  { n: "01", title: "who is vamika?", to: "/about", note: "fragments of a mind" },
  { n: "02", title: "into a teenager's mind", to: "/project", note: "a chronicle of obsessions" },
  { n: "03", title: "thought → sketch → form", to: "/process", note: "the messy middle" },
  { n: "04", title: "the archive", to: "/archive", note: "everything i keep" },
  { n: "05", title: "the moodboards", to: "/moodboards", note: "research, pinned" },
];

// `slot` is the name the admin fills with a photo; without one the fragment
// falls back to its drawn placeholder.
const FRAGMENTS = [
  { type: "ph", slot: "home-hero-1", caption: "sketch no.04 — soon", note: "anatomy studies, 2am", cls: "left-[4%] top-[14%] w-36 sm:w-52", rotate: -6, depth: 34 },
  { type: "ph", slot: "home-hero-2", caption: "raw silk, undyed", note: "it drapes like water", cls: "right-[5%] top-[10%] w-32 sm:w-48", rotate: 5, depth: 58 },
  { type: "note", text: "2nd grade. that's where it started.", cls: "left-[34%] top-[9%] hidden sm:block", rotate: -2, depth: 84 },
  { type: "word", text: "obsessions", cls: "left-[7%] bottom-[22%]", rotate: -3, depth: 72 },
  { type: "word", text: "SCHIAPARELLI", serif: true, cls: "right-[9%] bottom-[28%] hidden md:block", rotate: 2, depth: 44 },
  { type: "ph", slot: "home-hero-3", caption: "look 02 — unfinished", note: "like me", cls: "right-[22%] top-[40%] w-28 sm:w-40 hidden md:block", rotate: 8, depth: 24 },
  { type: "note", text: "how messy my brain can be ↓", cls: "right-[4%] bottom-[10%]", rotate: 3, depth: 62 },
  { type: "word", text: "mythology", cls: "left-[24%] top-[34%] hidden lg:block", rotate: -8, depth: 40 },
];

const Drift = ({ sx, sy, depth, rotate = 0, className = "", children }) => {
  const x = useTransform(sx, (v) => v * depth);
  const y = useTransform(sy, (v) => v * depth);
  return (
    <motion.div style={{ x, y, rotate }} className={`absolute ${className}`}>
      {children}
    </motion.div>
  );
};

const MaskedLine = ({ children, delay = 0, className = "" }) => (
  <span className="block overflow-hidden">
    <motion.span
      initial={{ y: "110%" }}
      animate={{ y: 0 }}
      transition={{ delay, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
      className={`block ${className}`}
    >
      {children}
    </motion.span>
  </span>
);

const Home = () => {
  const [entering, setEntering] = useState(false);
  const navigate = useNavigate();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 45, damping: 18 });
  const sy = useSpring(my, { stiffness: 45, damping: 18 });

  const onMove = (e) => {
    mx.set(e.clientX / window.innerWidth - 0.5);
    my.set(e.clientY / window.innerHeight - 0.5);
  };

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-cream"
    >
      <AnimatePresence>
        {entering && (
          <MindTransition
            onDone={() => {
              setEntering(false);
              navigate("/mind");
            }}
          />
        )}
      </AnimatePresence>

      <section
        data-testid="hero-section"
        onMouseMove={onMove}
        className="relative min-h-screen overflow-hidden flex items-center"
      >
        {FRAGMENTS.map((f, i) => (
          <Drift key={i} sx={sx} sy={sy} depth={f.depth} rotate={f.rotate} className={f.cls}>
            {f.type === "ph" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.08, duration: 0.8 }}
              >
                <Placeholder slot={f.slot} caption={f.caption} note={f.note} />
              </motion.div>
            )}
            {f.type === "note" && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 + i * 0.08 }}
                className="font-hand text-xl sm:text-2xl text-wine max-w-[180px]"
              >
                {f.text}
              </motion.p>
            )}
            {f.type === "word" && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.55 + i * 0.08 }}
                className={`${
                  f.serif
                    ? "font-serif italic text-2xl sm:text-4xl text-outline"
                    : "font-sans text-[11px] tracking-[0.4em] uppercase text-smoke"
                }`}
              >
                {f.text}
              </motion.span>
            )}
          </Drift>
        ))}

        <div className="relative z-10 px-5 sm:px-16 w-full">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="font-hand text-2xl text-wine -rotate-2 mb-4"
          >
            a portfolio, sort of —
          </motion.p>
          <h1
            data-testid="hero-title"
            className="font-serif font-light uppercase tracking-tighter leading-[0.85] text-[17vw] sm:text-[13vw] lg:text-[11vw]"
          >
            <MaskedLine delay={0.25}>Vamika</MaskedLine>
            <MaskedLine delay={0.4} className="text-outline-burgundy italic">
              Menon
            </MaskedLine>
          </h1>
          <div className="mt-6 flex flex-col sm:flex-row sm:items-end gap-6 sm:gap-14">
            <MaskedLine
              delay={0.65}
              className="font-sans text-[11px] sm:text-xs tracking-[0.35em] uppercase text-smoke"
            >
              fashion designer / artist / future creative director
            </MaskedLine>
            <motion.button
              data-testid="enter-my-mind-button"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.7 }}
              whileHover={{ x: 4, y: -4 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setEntering(true)}
              className="group w-max border border-ink bg-cream px-7 py-4 text-xs tracking-[0.3em] uppercase font-sans shadow-[5px_5px_0px_#1A1A1A] hover:shadow-[8px_8px_0px_#6B1226] transition-shadow duration-300 flex items-center gap-3"
            >
              enter my mind
              <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
            </motion.button>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="absolute bottom-6 left-5 sm:left-16 font-hand text-lg text-smoke -rotate-1"
        >
          scroll — things hide below
        </motion.div>
      </section>

      <Marquee items={["messy", "fluid", "visual", "personal", "artistic"]} outline className="bg-paper" />

      <section data-testid="experiences-section" className="px-5 sm:px-16 py-24 sm:py-36">
        <Reveal>
          <p className="font-sans text-[11px] tracking-[0.4em] uppercase text-burgundy">
            three ways in
          </p>
          <h2 className="mt-4 font-serif font-light uppercase tracking-tight text-4xl sm:text-6xl leading-none">
            you can read a portfolio.<br />
            <span className="italic text-outline-burgundy">or you can walk through one.</span>
          </h2>
        </Reveal>

        <div className="mt-16 grid md:grid-cols-3 gap-6 lg:gap-8">
          {EXPERIENCES.map((e, i) => (
            <Reveal key={e.n} delay={i * 0.08} className={i === 1 ? "md:-mt-6" : i === 2 ? "md:mt-8" : ""}>
              <Link
                to={e.to}
                data-testid={`experience-link-${e.n}`}
                className={`group relative flex h-full flex-col justify-between border p-7 sm:p-9 min-h-[300px] transition-all duration-500 hover:-translate-y-1 ${
                  e.tone === "burgundy"
                    ? "border-burgundy bg-burgundy text-cream shadow-[6px_6px_0px_#1A1A1A] hover:shadow-[10px_10px_0px_#1A1A1A]"
                    : "border-ink bg-ivory text-ink shadow-[6px_6px_0px_rgba(26,26,26,0.9)] hover:shadow-[10px_10px_0px_#6B1226]"
                }`}
              >
                <div className="flex items-start justify-between">
                  <span
                    className={`font-serif text-5xl sm:text-6xl leading-none ${
                      e.tone === "burgundy" ? "text-pink" : "text-outline-burgundy"
                    }`}
                  >
                    {e.n}
                  </span>
                  <ArrowUpRight
                    size={22}
                    className={`shrink-0 transition-transform duration-500 group-hover:rotate-45 ${
                      e.tone === "burgundy" ? "text-pink" : "text-burgundy"
                    }`}
                  />
                </div>
                <div className="mt-14">
                  <h3 className="font-serif font-light uppercase tracking-tight text-3xl sm:text-[2.6rem] leading-[0.95]">
                    {e.title}
                  </h3>
                  <span
                    className={`mt-4 block h-px w-0 transition-[width] duration-500 group-hover:w-full ${
                      e.tone === "burgundy" ? "bg-pink" : "bg-pink"
                    }`}
                  />
                  <p
                    className={`mt-4 font-sans text-[11px] tracking-[0.25em] uppercase ${
                      e.tone === "burgundy" ? "text-pink-soft/80" : "text-smoke"
                    }`}
                  >
                    {e.line}
                  </p>
                  <p
                    className={`mt-3 font-hand text-xl -rotate-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                      e.tone === "burgundy" ? "text-pink" : "text-wine"
                    }`}
                  >
                    {e.note}
                  </p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section data-testid="chapters-section" className="px-5 sm:px-16 pb-24 sm:pb-36">
        <Reveal>
          <p className="font-hand text-2xl text-wine rotate-[-1.5deg] mb-2">the manifesto, in chapters</p>
          <h2 className="font-serif font-light uppercase tracking-tight text-4xl sm:text-6xl leading-none">
            not a resume.<br />
            <span className="italic text-outline">a mind.</span>
          </h2>
        </Reveal>
        <div className="mt-16 border-t border-ink/60">
          {CHAPTERS.map((c, i) => (
            <Reveal key={c.n} delay={i * 0.06}>
              <Link
                to={c.to}
                data-testid={`chapter-link-${c.n}`}
                className="group relative flex items-baseline gap-5 sm:gap-10 border-b border-ink/60 py-7 sm:py-9 transition-colors duration-300 hover:bg-paper"
              >
                <span className="font-sans text-xs tracking-[0.3em] text-burgundy">{c.n}</span>
                <span className="font-serif font-light text-3xl sm:text-5xl lg:text-6xl tracking-tight transition-[transform,color] duration-500 group-hover:translate-x-4 group-hover:italic group-hover:text-burgundy">
                  {c.title}
                </span>
                <span className="ml-auto hidden md:block font-hand text-xl text-smoke opacity-0 group-hover:opacity-100 transition-opacity duration-300 -rotate-2">
                  {c.note}
                </span>
                <ArrowUpRight
                  size={22}
                  className="shrink-0 self-center text-ink/40 transition-all duration-300 group-hover:text-burgundy group-hover:rotate-45"
                />
              </Link>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.1} className="mt-14">
          <p className="font-sans text-sm leading-relaxed text-smoke max-w-xl">
            Fashion is expressing your emotions without words. Some people write, sing or dance to
            show what they feel —{" "}
            <span className="font-serif italic text-ink text-base">
              for me, it has always been dressing.
            </span>
          </p>
        </Reveal>
      </section>
    </motion.main>
  );
};

export default Home;
