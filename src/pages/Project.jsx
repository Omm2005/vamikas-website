import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Placeholder from "@/components/Placeholder";
import Reveal from "@/components/Reveal";
import Marquee from "@/components/Marquee";

const FRAGMENTS_DATA = {
  memory: {
    label: "memory",
    note: "rooms i grew up in, half-remembered",
    body: "The collection begins where I began — small rooms, loud colours, the visual noise of the city outside the window. Memory is never accurate; neither is this.",
    caps: ["look 01 — study", "childhood texture", "the house, from memory"],
  },
  chaos: {
    label: "chaos",
    note: "contradictions stacked on contradictions",
    body: "Being a teenager is wanting to be seen and wanting to disappear in the same hour. The garments hold both impulses at once — structure fighting collapse.",
    caps: ["look 02 — unfinished", "torn seam study", "noise, translated"],
  },
  obsession: {
    label: "obsession",
    note: "a chronicle of obsessions",
    body: "This project is, honestly, a chronicle of obsessions — a sleeve I redraw forty times, a painter I cannot stop reading about, a market I keep returning to.",
    caps: ["the sleeve, attempt 31", "reference pile", "market finds"],
  },
  identity: {
    label: "identity",
    note: "dressing as a way of saying what i couldn't",
    body: "Clothes were my first language. Every stage of being a teenager had a silhouette — this section maps who I was by what I reached for.",
    caps: ["silhouette map", "self, version 4.0", "armour / costume"],
  },
  emotion: {
    label: "emotion",
    note: "feelings without words",
    body: "Watercolour for the soft days, oil for the heavy ones, embroidery for the feelings that needed to be held slowly. Each material got an emotion assigned.",
    caps: ["watercolour study", "oil on cotton", "embroidered hours"],
  },
  creation: {
    label: "creation",
    note: "what the mess became",
    body: "The final garments. Not a resolution — teenagers don't resolve — but evidence that chaos, given enough patience, turns into something you can wear.",
    caps: ["final garment — front", "final garment — detail", "the photoshoot"],
  },
};

const ORDER = ["obsession", "memory", "emotion", "chaos", "creation", "identity"];

const WALL = [
  { tag: "runway", note: "Schiaparelli — surrealism you can button up", x: "4%", y: "6%", r: -4 },
  { tag: "art", note: "Amrita Sher-Gil, always", x: "30%", y: "2%", r: 3 },
  { tag: "runway", note: "Maison Margiela — the beauty of the unfinished", x: "58%", y: "8%", r: -2 },
  { tag: "street", note: "Vivienne Westwood & every wall that talks back", x: "80%", y: "4%", r: 5 },
  { tag: "city", note: "my city — billboards, wires, monsoon stains", x: "10%", y: "40%", r: 2 },
  { tag: "mythology", note: "old epics, new silhouettes", x: "36%", y: "36%", r: -5 },
  { tag: "runway", note: "House of Masaba — colour without apology", x: "62%", y: "42%", r: 4 },
  { tag: "memory", note: "art flea markets, sunday mornings", x: "84%", y: "38%", r: -3 },
  { tag: "obsession", note: "street artists whose names i'll never know", x: "22%", y: "68%", r: 6 },
  { tag: "memory", note: "things that got stuck & never left", x: "55%", y: "72%", r: -6 },
];

const LEARNED = ["experimentation", "patience", "self-learning", "persistence", "creative freedom", "new techniques"];

const Project = () => {
  const [active, setActive] = useState("obsession");
  const wallRef = useRef(null);
  const frag = FRAGMENTS_DATA[active];

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-cream overflow-hidden"
    >
      <section className="pt-32 sm:pt-40 px-5 sm:px-16 relative">
        <Reveal>
          <p className="font-sans text-[11px] tracking-[0.35em] uppercase text-smoke">
            featured project — chapter 02
          </p>
        </Reveal>
        <h1 data-testid="project-title" className="mt-4 font-serif font-light uppercase tracking-tighter leading-[0.82] text-[13vw] sm:text-[9.5vw]">
          <span className="block overflow-hidden">
            <motion.span initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }} className="block">
              into a
            </motion.span>
          </span>
          <span className="block overflow-hidden">
            <motion.span initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ delay: 0.12, duration: 1, ease: [0.16, 1, 0.3, 1] }} className="block italic text-outline">
              teenager's
            </motion.span>
          </span>
          <span className="block overflow-hidden">
            <motion.span initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ delay: 0.24, duration: 1, ease: [0.16, 1, 0.3, 1] }} className="block">
              mind
            </motion.span>
          </span>
        </h1>
        <Reveal delay={0.3} className="mt-8 flex flex-col sm:flex-row sm:items-end gap-6 sm:gap-16">
          <p className="font-hand text-3xl text-wine -rotate-2">“how messy my brain can be.”</p>
          <p className="font-sans text-sm leading-relaxed text-smoke max-w-md">
            Artworks, garments, textiles, sketches and experiments documenting the stages of
            my teenage life. Not a case study — more like entering different rooms.
          </p>
        </Reveal>
      </section>

      <section data-testid="fragment-explorer" className="mt-20 sm:mt-28 px-5 sm:px-16">
        <Reveal>
          <h2 className="font-serif font-light uppercase tracking-tight text-3xl sm:text-5xl">
            pick a fragment
          </h2>
          <p className="font-hand text-xl text-smoke rotate-1 mt-2">(there is no correct order)</p>
        </Reveal>
        <div className="mt-10 flex flex-wrap gap-3 sm:gap-4">
          {ORDER.map((key, i) => (
            <button
              key={key}
              data-testid={`fragment-tab-${key}`}
              onClick={() => setActive(key)}
              style={{ transform: `rotate(${(i % 3) - 1}deg)` }}
              className={`px-5 py-3 border text-xs tracking-[0.25em] uppercase font-sans transition-all duration-300 ${
                active === key
                  ? "bg-ink text-cream border-ink shadow-[4px_4px_0px_#6B1226]"
                  : "border-ink/50 text-ink hover:border-wine hover:text-wine hover:-translate-y-1"
              }`}
            >
              {FRAGMENTS_DATA[key].label}
            </button>
          ))}
        </div>

        <div className="mt-12 min-h-[420px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 30, rotate: 1 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              exit={{ opacity: 0, y: -20, rotate: -1 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              data-testid={`fragment-panel-${active}`}
              className="grid md:grid-cols-2 gap-10 items-start"
            >
              <div className="order-2 md:order-1">
                <p className="font-hand text-3xl text-wine -rotate-1">{frag.note}</p>
                <p className="mt-6 font-sans text-sm sm:text-base leading-relaxed text-smoke max-w-lg">
                  {frag.body}
                </p>
                <p className="mt-6 font-sans text-[11px] tracking-[0.3em] uppercase text-smoke/70">
                  research: designers · runway shows · galleries · flea markets · the city
                </p>
              </div>
              <div className="order-1 md:order-2 grid grid-cols-2 gap-4">
                <Placeholder caption={frag.caps[0]} className={active === "chaos" ? "rotate-2" : "-rotate-2"} note="hover me" />
                <div className="flex flex-col gap-4 mt-8">
                  <Placeholder caption={frag.caps[1]} ratio="aspect-square" className="rotate-1" />
                  <Placeholder caption={frag.caps[2]} ratio="aspect-[4/3]" className="-rotate-1" />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      <Marquee items={["a chronicle of obsessions", "research", "sketch", "tear", "repeat"]} outline className="bg-paper mt-24" />

      <section data-testid="inspiration-wall" className="px-5 sm:px-16 py-24 sm:py-32">
        <Reveal>
          <h2 className="font-serif font-light uppercase tracking-tight text-4xl sm:text-6xl leading-none">
            things that got<br />
            <span className="italic text-outline">stuck in my head</span>
          </h2>
          <p className="font-hand text-2xl text-wine -rotate-1 mt-4">drag the cards around — i do</p>
        </Reveal>
        <div ref={wallRef} className="relative mt-12 h-[70vh] min-h-[520px] border border-dashed border-ink/40 bg-paper/60">
          {WALL.map((c, i) => (
            <motion.div
              key={i}
              drag
              dragConstraints={wallRef}
              dragElastic={0.2}
              whileDrag={{ scale: 1.06, zIndex: 30, rotate: 0 }}
              whileHover={{ scale: 1.04 }}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.6 }}
              data-testid={`wall-card-${c.tag}-${i}`}
              className="absolute w-40 sm:w-52 cursor-grab active:cursor-grabbing bg-cream border border-ink/70 p-4 shadow-[4px_4px_0px_rgba(26,26,26,0.85)]"
              style={{ left: c.x, top: c.y, rotate: c.r }}
            >
              <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-burgundy">{c.tag}</span>
              <p className="mt-2 font-hand text-lg leading-tight text-ink">{c.note}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section data-testid="making-section" className="px-5 sm:px-16 py-24 sm:py-32 bg-ink text-cream relative overflow-hidden border-t-4 border-burgundy">
        <div className="max-w-5xl">
          <Reveal>
            <p className="font-sans text-[11px] tracking-[0.35em] uppercase text-burgundy-light">making the garments</p>
            <h2 className="mt-6 font-serif font-light text-3xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-tight">
              I taught myself to sew. Finishing each garment was the hardest part — I wanted
              to quit, often.{" "}
              <span className="italic text-pink underline decoration-burgundy-light decoration-2 underline-offset-8">
                I kept going because I wanted to see what it would become.
              </span>
            </h2>
          </Reveal>
          <div className="mt-14 grid grid-cols-2 md:grid-cols-3 gap-5">
            <Reveal delay={0.05}><Placeholder dark caption="construction — in progress" note="3am sewing club of one" /></Reveal>
            <Reveal delay={0.12} className="md:mt-10"><Placeholder dark caption="embroidery detail" note="slow on purpose" /></Reveal>
            <Reveal delay={0.19}><Placeholder dark caption="almost finished" note="then: one more stitch" /></Reveal>
          </div>
        </div>
      </section>

      <section data-testid="learned-section" className="px-5 sm:px-16 py-24 sm:py-32">
        <Reveal>
          <h2 className="font-serif font-light uppercase tracking-tight text-4xl sm:text-6xl">what i learned</h2>
          <p className="mt-6 max-w-2xl font-sans text-sm sm:text-base leading-relaxed text-smoke">
            The project became an escape while I was doing something I genuinely loved. It
            was difficult; I kept experimenting anyway. Mostly it taught me:
          </p>
        </Reveal>
        <div className="mt-10 flex flex-wrap gap-3 sm:gap-5 max-w-4xl">
          {LEARNED.map((w, i) => (
            <Reveal key={w} delay={i * 0.05}>
              <span
                className="inline-block font-serif italic text-2xl sm:text-4xl text-ink border-b-2 border-pink hover:border-wine hover:text-wine transition-colors duration-300 cursor-default"
                style={{ transform: `rotate(${((i % 3) - 1) * 1.5}deg)` }}
              >
                {w}
              </span>
            </Reveal>
          ))}
        </div>
      </section>

      <section data-testid="proud-section" className="px-5 sm:px-16 pb-28 sm:pb-40">
        <div className="border-t-2 border-ink pt-14 grid lg:grid-cols-[1fr_1.2fr] gap-12">
          <Reveal>
            <h2 className="font-serif font-light uppercase tracking-tight text-4xl sm:text-6xl leading-none">
              what i'm<br /><span className="italic text-burgundy">proud of</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="font-sans text-sm sm:text-base leading-relaxed text-smoke">
              About <span className="text-ink font-medium">ten years</span> of holding onto
              the same dream. I grew up hearing that fashion wasn't practical, that it
              couldn't pay the bills. I never stopped believing in it anyway. What I have
              with art and fashion is deeper than the word{" "}
              <span className="font-serif italic text-ink">“passion”</span> — it is the way
              I exist in the world.
            </p>
            <p className="mt-6 font-hand text-2xl text-wine -rotate-1">still here. still making.</p>
          </Reveal>
        </div>
      </section>
    </motion.main>
  );
};

export default Project;
