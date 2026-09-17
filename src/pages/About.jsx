import { motion } from "framer-motion";
import Placeholder from "@/components/Placeholder";
import Reveal from "@/components/Reveal";
import Marquee from "@/components/Marquee";

const FRAGMENT_CARDS = [
  { caption: "childhood photo — soon", note: "2nd grade. a brand being built in front of me.", rotate: "-rotate-2", offset: "sm:mt-0" },
  { caption: "my first sketchbook", note: "bad drawings. unlimited belief.", rotate: "rotate-3", offset: "sm:mt-16" },
  { caption: "teenage years, archived", note: "chaos, but make it fashion", rotate: "-rotate-1", offset: "sm:mt-6" },
  { caption: "mythology marginalia", note: "old stories, new silhouettes", rotate: "rotate-2", offset: "sm:mt-24" },
];

const WHY = [
  { n: "i", text: "It is identity. The way I understand the world is through what people choose to wear." },
  { n: "ii", text: "It is art you live inside. A garment moves, creases, ages — no painting does that." },
  { n: "iii", text: "It is emotion without vocabulary. I say things with fabric that I cannot say out loud." },
  { n: "iv", text: "It is history. Mythology, memory, the city — all of it ends up in a hemline eventually." },
];

const About = () => {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-cream overflow-hidden"
    >
      <section className="pt-32 sm:pt-40 px-5 sm:px-16">
        <Reveal>
          <p className="font-hand text-2xl text-wine -rotate-2 mb-3">not a biography —</p>
        </Reveal>
        <h1 data-testid="about-title" className="font-serif font-light uppercase tracking-tighter leading-[0.85] text-[14vw] sm:text-[10vw]">
          <span className="block overflow-hidden">
            <motion.span
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="block"
            >
              who is
            </motion.span>
          </span>
          <span className="block overflow-hidden">
            <motion.span
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              transition={{ delay: 0.15, duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="block italic text-outline"
            >
              vamika?
            </motion.span>
          </span>
        </h1>
        <Reveal delay={0.25} className="mt-10 max-w-2xl">
          <p className="font-sans text-sm sm:text-base leading-relaxed text-smoke">
            In <span className="text-ink font-medium">2nd grade</span>, Vamika watched her
            mother's best friend build a fashion brand from nothing. That was the moment
            fashion stopped being clothes and became a career she could imagine. She wants
            to study <span className="scribble-underline text-ink">everything within fashion</span> —
            beginning with design — with one long-term goal:{" "}
            <span className="font-serif italic text-ink text-lg">creative director.</span>
          </p>
        </Reveal>
      </section>

      <section className="px-5 sm:px-16 mt-20 sm:mt-28 relative">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-8">
          {FRAGMENT_CARDS.map((c, i) => (
            <Reveal key={i} delay={i * 0.08} className={c.offset}>
              <div className={`tape ${c.rotate} transition-transform duration-500 hover:rotate-0 hover:scale-[1.03]`}>
                <Placeholder caption={c.caption} note={c.note} />
              </div>
            </Reveal>
          ))}
        </div>
        <p className="font-hand text-xl text-smoke rotate-1 mt-8 text-right">
          fragments — childhood, teenage years, art, mythology, street, memory
        </p>
      </section>

      <section data-testid="philosophy-section" className="px-5 sm:px-16 py-24 sm:py-36">
        <Reveal>
          <blockquote className="font-serif font-light text-3xl sm:text-5xl lg:text-6xl leading-[1.1] tracking-tight max-w-5xl">
            “Fashion is expressing your{" "}
            <span className="italic text-wine">emotions</span> without words. Some people
            write, sing or dance to show what they feel.{" "}
            <span className="relative inline-block group">
              <span className="scribble-underline">For me, it has always been dressing.</span>
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 font-hand text-xl text-wine opacity-0 group-hover:opacity-100 transition-opacity duration-300 rotate-[-3deg] whitespace-nowrap">
                always.
              </span>
            </span>
            ”
          </blockquote>
        </Reveal>
      </section>

      <Marquee items={["identity", "art", "emotion", "history", "mythology"]} outline className="bg-paper" />

      <section data-testid="why-fashion-section" className="px-5 sm:px-16 py-24 sm:py-36">
        <Reveal>
          <h2 className="font-serif font-light uppercase tracking-tight text-4xl sm:text-6xl">
            why fashion?
          </h2>
          <p className="font-hand text-2xl text-wine -rotate-1 mt-3">
            (more than a career. more than a passion.)
          </p>
        </Reveal>
        <div className="mt-14 grid md:grid-cols-2 gap-x-16 gap-y-12 max-w-5xl">
          {WHY.map((w, i) => (
            <Reveal key={w.n} delay={i * 0.07}>
              <div className="border-l-2 border-burgundy/60 pl-6 group">
                <span className="font-serif italic text-3xl text-pink group-hover:text-burgundy transition-colors duration-300">
                  {w.n}.
                </span>
                <p className="mt-2 font-sans text-sm sm:text-base leading-relaxed text-smoke group-hover:text-ink transition-colors duration-300">
                  {w.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.15} className="mt-16 max-w-2xl">
          <p className="font-sans text-sm leading-relaxed text-smoke">
            Outside the studio: <span className="text-ink">history, particularly mythology</span> —
            old epics, half-remembered gods, the way stories survive by being retold. It all
            leaks into the work.
          </p>
        </Reveal>
      </section>
    </motion.main>
  );
};

export default About;
