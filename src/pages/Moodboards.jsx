import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";
import Placeholder from "@/components/Placeholder";
import Reveal from "@/components/Reveal";
import Marquee from "@/components/Marquee";

const BOARDS = [
  {
    id: "romantic-decay",
    n: "01",
    title: "romantic decay",
    sub: "flowers, three days late",
    thesis:
      "Everything beautiful here is slightly past it. Dried bouquets, a wall that has been repainted four times, silk that has creased in the same place for a year. The board exists to stop me making anything that looks brand new.",
    swatches: ["#6B1226", "#9E4751", "#D9A5B3", "#E7E1D6"],
    refs: [
      "dried peonies, kept too long",
      "peeling paint — the third layer down",
      "Sher-Gil's browns",
      "velvet, rubbed bald at the elbow",
      "candle wax on a tablecloth",
    ],
    caps: ["bouquet, day 9", "wall study", "creased silk"],
    notes: ["let it age first", "not pretty. weathered."],
    became: "the bloom print, and every burgundy in the collection",
  },
  {
    id: "mythology",
    n: "02",
    title: "mythology, retold",
    sub: "old epics, new hemlines",
    thesis:
      "Old stories survive by being retold badly. I read them for the costume descriptions and ignore the plot — drapes, armour, things worn by people who were about to lose an argument with a god.",
    swatches: ["#4A0C1B", "#B8B0A4", "#F7F5F0", "#1A1A1A"],
    refs: [
      "epic marginalia, borrowed edition",
      "temple relief drapery",
      "armour as costume, not protection",
      "gold, but tarnished",
      "gods who dressed for the occasion",
    ],
    caps: ["drape study", "relief, traced", "armour sketch"],
    notes: ["retold = redesigned", "the plot is not the point"],
    became: "armour / costume, and the quilted bodice",
  },
  {
    id: "city-noise",
    n: "03",
    title: "city noise",
    sub: "billboards, wires, monsoon stains",
    thesis:
      "My whole sense of colour is a wall in my neighbourhood after rain. Posters layered over posters until the newest one is the least interesting. Print over print over print.",
    swatches: ["#1A1A1A", "#F3A8BF", "#9E4751", "#B8B0A4"],
    refs: [
      "torn poster layers",
      "wires against a white sky",
      "market tarpaulin blue",
      "hand-painted shop signage",
      "monsoon stain, second floor",
    ],
    caps: ["poster layers", "wires, 6pm", "signage study"],
    notes: ["chaos is a layout", "four prints, one garment"],
    became: "noise, translated — the patchwork look",
  },
  {
    id: "surreal-tailoring",
    n: "04",
    title: "surreal tailoring",
    sub: "surrealism you can button up",
    thesis:
      "Schiaparelli made a joke and then tailored it perfectly, which is the only way a joke survives. Strict construction, one impossible idea. The discipline is what makes the strangeness readable.",
    swatches: ["#F7F5F0", "#6B1226", "#F3A8BF", "#2E2C2A"],
    refs: [
      "Schiaparelli — the whole argument",
      "Margiela's exposed linings",
      "trompe l'oeil embroidery",
      "a sleeve where a sleeve shouldn't be",
      "tailoring textbooks, ignored selectively",
    ],
    caps: ["the sleeve, attempt 31", "lining, exposed", "trompe l'oeil"],
    notes: ["strange, but finished properly", "one impossible idea per look"],
    became: "the bow, the corsage, the exposed seams",
  },
  {
    id: "texture",
    n: "05",
    title: "texture study",
    sub: "what the hand knows first",
    thesis:
      "A board with almost no images on it — mostly swatches, stapled. Organza against wool crepe against a quilted square. If I cannot describe how it feels, I have not finished looking at it.",
    swatches: ["#FCFAF4", "#E7E1D6", "#B8B0A4", "#D9A5B3"],
    refs: [
      "organza, three layers deep",
      "wool crepe — matte and unbothered",
      "hand-quilting, uneven on purpose",
      "raw edges, left raw",
      "thread count as a mood",
    ],
    caps: ["swatch wall", "quilt sample", "raw edge test"],
    notes: ["touch it before you draw it", "staples, not glue"],
    became: "the fabric list for every piece",
  },
  {
    id: "burgundy",
    n: "06",
    title: "the colour burgundy",
    sub: "an entire board for one colour",
    thesis:
      "Burgundy is what red sounds like when it calms down. It photographs as black in low light and as blood in daylight, which means a garment made in it is two garments. That is efficient and also dramatic.",
    swatches: ["#4A0C1B", "#6B1226", "#9E4751", "#B04A5C"],
    refs: [
      "wine at the bottom of the glass",
      "oxblood leather, scuffed",
      "pomegranate, cut open",
      "stage curtains",
      "the inside of a fig",
    ],
    caps: ["dye test 01–06", "oxblood swatch", "stage curtain"],
    notes: ["one colour is a whole collection", "black in low light, blood in daylight"],
    became: "the house colour. obviously.",
  },
];

const METHOD = [
  { n: "i", t: "collect badly", b: "Photograph everything, save nothing in folders. The mess is a filter — whatever I remember two weeks later earns a place on a board." },
  { n: "ii", t: "print it out", b: "A reference on a screen is a tab. A reference on the wall is an argument I have to walk past every day." },
  { n: "iii", t: "put enemies together", b: "A temple relief next to a torn bus poster. If the pairing makes me uncomfortable, it usually makes the garment." },
  { n: "iv", t: "take it down late", b: "A board comes down when the garment exists. Whatever is still pinned up is the next collection." },
];

const Moodboards = () => {
  const [open, setOpen] = useState(null);
  const board = BOARDS.find((b) => b.id === open) || null;

  useEffect(() => {
    if (!board) return undefined;
    const onKey = (e) => e.key === "Escape" && setOpen(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [board]);

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-cream min-h-screen overflow-hidden"
    >
      <section className="pt-32 sm:pt-40 px-5 sm:px-16">
        <Reveal>
          <p className="font-sans text-[11px] tracking-[0.4em] uppercase text-burgundy">
            experience 03
          </p>
          <p className="font-hand text-2xl text-wine -rotate-2 mt-4 mb-7">the wall, photographed —</p>
        </Reveal>
        <h1
          data-testid="moodboards-title"
          className="font-serif font-light uppercase tracking-tighter leading-[0.85] text-[14vw] sm:text-[9vw]"
        >
          <span className="block overflow-hidden">
            <motion.span
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="block"
            >
              mood
            </motion.span>
          </span>
          <span className="block overflow-hidden">
            <motion.span
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              transition={{ delay: 0.14, duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="block italic text-outline-burgundy"
            >
              boards
            </motion.span>
          </span>
        </h1>
        <Reveal delay={0.25} className="mt-8 max-w-2xl">
          <p className="font-sans text-sm sm:text-base leading-relaxed text-smoke">
            Six walls of research, pinned before anything was cut. Nothing here is mine — these are
            the references, the colours and the arguments the garments came out of.{" "}
            <span className="font-serif italic text-ink">Open one.</span>
          </p>
        </Reveal>
      </section>

      <section data-testid="moodboard-grid" className="px-5 sm:px-16 mt-16 sm:mt-24 grid sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
        {BOARDS.map((b, i) => (
          <Reveal key={b.id} delay={i * 0.06} className={i % 3 === 1 ? "lg:mt-10" : i % 3 === 2 ? "lg:mt-20" : ""}>
            <button
              data-testid={`moodboard-card-${b.id}`}
              onClick={() => setOpen(b.id)}
              style={{ transform: `rotate(${((i % 3) - 1) * 1.1}deg)` }}
              className="tape group w-full text-left border border-ink/60 bg-ivory p-5 shadow-[5px_5px_0px_rgba(26,26,26,0.9)] transition-all duration-500 hover:rotate-0 hover:-translate-y-1 hover:shadow-[9px_9px_0px_#6B1226]"
            >
              <div className="flex items-baseline justify-between">
                <span className="font-sans text-[10px] tracking-[0.35em] uppercase text-burgundy">
                  board {b.n}
                </span>
                <ArrowUpRight
                  size={18}
                  className="text-ink/40 transition-all duration-300 group-hover:text-burgundy group-hover:rotate-45"
                />
              </div>
              <h2 className="mt-4 font-serif font-light uppercase tracking-tight text-2xl sm:text-3xl leading-none">
                {b.title}
              </h2>
              <p className="mt-2 font-hand text-xl text-wine -rotate-1">{b.sub}</p>

              <div className="mt-5 grid grid-cols-3 gap-2">
                {b.caps.map((c, k) => (
                  <div key={c} className={k === 1 ? "mt-3" : ""}>
                    <Placeholder caption={c} ratio="aspect-[3/4]" />
                  </div>
                ))}
              </div>

              <div className="mt-5 flex items-center gap-1.5">
                {b.swatches.map((s) => (
                  <span
                    key={s}
                    className="h-5 flex-1 border border-ink/30"
                    style={{ background: s }}
                    aria-hidden="true"
                  />
                ))}
              </div>
              <p className="mt-4 font-sans text-[10px] tracking-[0.3em] uppercase text-smoke">
                {b.refs.length} references · pinned
              </p>
            </button>
          </Reveal>
        ))}
      </section>

      <Marquee
        items={["research", "pin", "argue", "cut", "repeat"]}
        outline
        className="bg-paper mt-24 sm:mt-32"
      />

      <section data-testid="method-section" className="px-5 sm:px-16 py-24 sm:py-36">
        <Reveal>
          <h2 className="font-serif font-light uppercase tracking-tight text-4xl sm:text-6xl">
            how a board <span className="italic text-outline">gets made</span>
          </h2>
          <p className="font-hand text-2xl text-wine rotate-1 mt-3">(badly, then usefully)</p>
        </Reveal>
        <div className="mt-14 grid md:grid-cols-2 gap-x-16 gap-y-12 max-w-5xl">
          {METHOD.map((m, i) => (
            <Reveal key={m.n} delay={i * 0.07}>
              <div className="border-l-2 border-pink pl-6 group">
                <span className="font-serif italic text-3xl text-burgundy">{m.n}.</span>
                <h3 className="mt-2 font-sans text-[11px] tracking-[0.3em] uppercase text-ink">{m.t}</h3>
                <p className="mt-3 font-sans text-sm leading-relaxed text-smoke group-hover:text-ink transition-colors duration-300">
                  {m.b}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.1}>
          <Link
            to="/dress-me"
            className="group mt-16 inline-flex items-center gap-3 border border-burgundy bg-burgundy text-cream px-7 py-4 text-xs tracking-[0.3em] uppercase font-sans shadow-[5px_5px_0px_#1A1A1A] hover:shadow-[8px_8px_0px_#1A1A1A] transition-shadow duration-300"
          >
            now build a look from them
            <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:rotate-45" />
          </Link>
        </Reveal>
      </section>

      {/* ── the board, opened ── */}
      <AnimatePresence>
        {board && (
          <motion.div
            data-testid="moodboard-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setOpen(null)}
            className="fixed inset-0 z-[110] bg-ink/95 backdrop-blur-sm overflow-y-auto p-4 sm:p-10"
          >
            <button
              data-testid="moodboard-close"
              onClick={() => setOpen(null)}
              aria-label="close board"
              className="fixed top-6 right-6 z-10 text-cream hover:text-pink transition-colors"
            >
              <X size={28} strokeWidth={1.5} />
            </button>

            <motion.article
              initial={{ scale: 0.95, y: 28, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.97, y: 12, opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              data-testid={`moodboard-spread-${board.id}`}
              className="mx-auto max-w-6xl border border-cream/25 bg-cream text-ink"
            >
              <header className="flex flex-wrap items-baseline justify-between gap-4 border-b border-ink bg-burgundy px-5 sm:px-8 py-4 text-cream">
                <span className="font-sans text-[10px] tracking-[0.35em] uppercase text-pink">
                  board {board.n} — research
                </span>
                <span className="font-sans text-[10px] tracking-[0.35em] uppercase">
                  vamika menon
                </span>
              </header>

              <div className="px-5 sm:px-8 py-8 sm:py-12">
                <h2 className="font-serif font-light uppercase tracking-tighter text-4xl sm:text-7xl leading-[0.9] sm:leading-[0.9]">
                  {board.title}
                </h2>
                <p className="mt-3 font-hand text-2xl text-wine -rotate-1">{board.sub}</p>

                <div className="mt-10 grid lg:grid-cols-[1.25fr_1fr] gap-10 lg:gap-16">
                  <div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {board.caps.map((c, k) => (
                        <div
                          key={c}
                          className={k === 1 ? "sm:mt-8 rotate-1" : k === 2 ? "sm:mt-4 -rotate-1" : "-rotate-2"}
                        >
                          <Placeholder caption={c} note={board.notes[k % board.notes.length]} />
                        </div>
                      ))}
                    </div>
                    <div className="mt-8 flex items-stretch gap-2">
                      {board.swatches.map((s) => (
                        <div key={s} className="flex-1">
                          <span
                            className="block h-16 border border-ink/40"
                            style={{ background: s }}
                            aria-hidden="true"
                          />
                          <span className="mt-1 block font-sans text-[9px] tracking-[0.2em] uppercase text-smoke">
                            {s}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="font-sans text-sm sm:text-base leading-relaxed text-smoke">
                      {board.thesis}
                    </p>

                    <h3 className="mt-10 font-sans text-[10px] tracking-[0.35em] uppercase text-burgundy">
                      pinned
                    </h3>
                    <ul className="mt-4 border-t border-ink/40">
                      {board.refs.map((r) => (
                        <li
                          key={r}
                          className="flex items-baseline gap-3 border-b border-ink/25 py-2.5 font-serif italic text-lg sm:text-xl"
                        >
                          <span className="text-pink not-italic">✳</span>
                          {r}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-10 border border-dashed border-burgundy/60 bg-paper/70 p-5">
                      <p className="font-sans text-[10px] tracking-[0.35em] uppercase text-burgundy">
                        what it became
                      </p>
                      <p className="mt-2 font-hand text-2xl text-ink -rotate-1">{board.became}</p>
                    </div>
                  </div>
                </div>
              </div>

              <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-ink px-5 sm:px-8 py-4">
                <span className="font-sans text-[10px] tracking-[0.35em] uppercase text-smoke">
                  research → sketch → form
                </span>
                <Link
                  to="/dress-me"
                  className="group flex items-center gap-2 font-sans text-[10px] tracking-[0.35em] uppercase text-burgundy"
                >
                  build a look from this board
                  <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:rotate-45" />
                </Link>
              </footer>
            </motion.article>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.main>
  );
};

export default Moodboards;
