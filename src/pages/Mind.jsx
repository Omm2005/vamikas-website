import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Shuffle } from "lucide-react";
import Placeholder from "@/components/Placeholder";
import Reveal from "@/components/Reveal";
import Marquee from "@/components/Marquee";

const ROOMS = [
  { id: "thoughts", label: "thoughts", note: "things i think at 2am" },
  { id: "memories", label: "memories", note: "half-remembered rooms" },
  { id: "emotions", label: "emotions", note: "the part you can try on" },
  { id: "inspirations", label: "inspirations", note: "who got stuck in my head" },
];

const THOUGHTS = [
  { text: "a garment is a sentence you don't have to say out loud.", tilt: -2 },
  { text: "i redraw the same sleeve until it stops being a sleeve.", tilt: 1.5 },
  { text: "unfinished is a finish. margiela said so first.", tilt: -1 },
  { text: "burgundy is what red sounds like when it calms down.", tilt: 2 },
  { text: "if it isn't a little wrong, i haven't touched it yet.", tilt: -1.5 },
  { text: "i dress the version of me i'm about to become.", tilt: 1 },
];

const MEMORIES = [
  {
    year: "2nd grade",
    title: "the brand in the living room",
    body: "My mother's best friend built a fashion label from nothing, in front of me. That was the first time clothes looked like a life instead of a wardrobe.",
    cap: "childhood photo — soon",
  },
  {
    year: "age 12",
    title: "the first bad sketchbook",
    body: "Proportions wrong, confidence absolute. I still keep it. Every good drawing since has one of its mistakes hiding inside it.",
    cap: "first sketchbook",
  },
  {
    year: "every monsoon",
    title: "the city, stained",
    body: "Billboards bleeding into wires, posters peeling in layers. Half my colour palettes are just a wall in my neighbourhood after rain.",
    cap: "the wall, after rain",
  },
];

// selecting a feeling surfaces the garment or artwork that came out of it
const FEELINGS = {
  messy: {
    line: "nothing is folded in here.",
    swatches: ["#1A1A1A", "#9E4751", "#F3A8BF"],
    pieces: [
      {
        title: "look 02 — unfinished",
        medium: "raw cotton, exposed seams, hand-basted",
        year: "2026",
        cap: "look 02 — unfinished",
        body: "Left deliberately mid-construction. The basting threads stayed in because taking them out felt like lying about how it was made.",
        hand: "i stopped when it was honest, not when it was done.",
      },
      {
        title: "torn seam study",
        medium: "calico, thread, scissors, regret",
        year: "2025",
        cap: "torn seam study",
        body: "I cut a finished bodice open to see how it failed. The study is more useful than the bodice ever was.",
        hand: "destruction, but research-shaped.",
      },
    ],
  },
  romantic: {
    line: "soft, but with a spine.",
    swatches: ["#F3A8BF", "#6B1226", "#F7F5F0"],
    pieces: [
      {
        title: "bloom, in burgundy",
        medium: "silk organza, hand-painted print",
        year: "2026",
        cap: "bloom — hand-painted",
        body: "A flower print painted at the scale of a bruise. Romance that has clearly survived something.",
        hand: "pretty is allowed to have a past.",
      },
      {
        title: "the letter dress",
        medium: "cotton lawn, embroidered text",
        year: "2025",
        cap: "embroidered hours",
        body: "Six lines I never sent, stitched into the lining where only the wearer can read them.",
        hand: "the seam knows what i didn't say.",
      },
    ],
  },
  angry: {
    line: "red, but darker than you expected.",
    swatches: ["#4A0C1B", "#6B1226", "#1A1A1A"],
    pieces: [
      {
        title: "armour / costume",
        medium: "quilted cotton, oxblood dye",
        year: "2026",
        cap: "armour / costume",
        body: "Quilted until it could stand up without me. Anger makes excellent structure and terrible decisions.",
        hand: "i sewed instead of shouting.",
      },
      {
        title: "oil on cotton no.3",
        medium: "oil paint on stretched cotton",
        year: "2025",
        cap: "oil on cotton",
        body: "Painted in one sitting with a palette knife. The canvas has a tear in it. The tear stayed.",
        hand: "heavy days get oil, not watercolour.",
      },
    ],
  },
  nostalgic: {
    line: "an old room, rebuilt from memory.",
    swatches: ["#E7E1D6", "#B8B0A4", "#9E4751"],
    pieces: [
      {
        title: "the house, from memory",
        medium: "watercolour on paper, faded intentionally",
        year: "2025",
        cap: "the house, from memory",
        body: "Painted without reference, so it is wrong in all the places that matter most to me.",
        hand: "memory is a bad archivist. i like that.",
      },
      {
        title: "market finds, catalogued",
        medium: "found textiles, cotton backing",
        year: "2026",
        cap: "market finds",
        body: "Sunday flea-market scraps stitched into one length of fabric. Somebody else's Sunday, now mine.",
        hand: "second-hand, second life.",
      },
    ],
  },
  playful: {
    line: "a little obsessed. a little silly.",
    swatches: ["#F3A8BF", "#FADDE4", "#1A1A1A"],
    pieces: [
      {
        title: "dots, obviously",
        medium: "cotton poplin, block-printed dots",
        year: "2026",
        cap: "the sleeve, attempt 31",
        body: "Block-printed by hand, so no two dots agree. The puff sleeve commits entirely to the bit.",
        hand: "dots — a little obsessed, me too.",
      },
      {
        title: "bow study",
        medium: "silk, wire, too much ribbon",
        year: "2025",
        cap: "bow study",
        body: "Seven bows, each one a different argument about how big a bow is allowed to be.",
        hand: "a bow. obviously.",
      },
    ],
  },
  dreamy: {
    line: "barely there, on purpose.",
    swatches: ["#FCFAF4", "#FADDE4", "#D9A5B3"],
    pieces: [
      {
        title: "organza, floating",
        medium: "three layers of organza, no lining",
        year: "2026",
        cap: "look 01 — study",
        body: "Transparent enough that the body is part of the print. It photographs like a thought.",
        hand: "it drapes like water.",
      },
      {
        title: "watercolour study",
        medium: "watercolour on cold-press paper",
        year: "2025",
        cap: "watercolour study",
        body: "Wet on wet, no drawing underneath. Whatever the water decided is what the garment became.",
        hand: "soft days get watercolour.",
      },
    ],
  },
  chaotic: {
    line: "contradictions stacked on contradictions.",
    swatches: ["#6B1226", "#F3A8BF", "#1A1A1A"],
    pieces: [
      {
        title: "noise, translated",
        medium: "mixed textiles, patchwork, print over print",
        year: "2026",
        cap: "noise, translated",
        body: "Four prints that should not be in the same room. Being a teenager is wanting to be seen and to disappear in the same hour.",
        hand: "structure fighting collapse.",
      },
      {
        title: "self, version 4.0",
        medium: "reconstructed garments, clay buttons",
        year: "2025",
        cap: "self, version 4.0",
        body: "Three old pieces of mine cut up and rebuilt into one. Nothing is wasted, everything is unrecognisable.",
        hand: "i keep rewriting the same outfit.",
      },
    ],
  },
};

const ORDER = ["messy", "romantic", "angry", "nostalgic", "playful", "dreamy", "chaotic"];

const INSPIRATIONS = [
  { name: "Schiaparelli", note: "surrealism you can button up" },
  { name: "Maison Margiela", note: "the beauty of the unfinished" },
  { name: "Amrita Sher-Gil", note: "colour that refuses to perform" },
  { name: "House of Masaba", note: "colour without apology" },
  { name: "Vivienne Westwood", note: "and every wall that talks back" },
  { name: "old epics", note: "mythology, retold in a hemline" },
];

const Mind = () => {
  const [feeling, setFeeling] = useState(null);
  const [variant, setVariant] = useState(0);

  const pick = (key) => {
    setFeeling(key);
    setVariant(0);
  };

  const data = feeling ? FEELINGS[feeling] : null;
  const piece = data ? data.pieces[variant % data.pieces.length] : null;

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
          <p className="font-sans text-[11px] tracking-[0.4em] uppercase text-burgundy">
            experience 01
          </p>
          <p className="font-hand text-2xl text-wine -rotate-2 mt-4 mb-7">mind the mess —</p>
        </Reveal>
        <h1
          data-testid="mind-title"
          className="font-serif font-light uppercase tracking-tighter leading-[0.85] text-[15vw] sm:text-[10vw]"
        >
          <span className="block overflow-hidden">
            <motion.span
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="block"
            >
              enter my
            </motion.span>
          </span>
          <span className="block overflow-hidden">
            <motion.span
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              transition={{ delay: 0.14, duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="block italic text-outline-burgundy"
            >
              mind
            </motion.span>
          </span>
        </h1>

        <Reveal delay={0.25} className="mt-10 grid lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-20">
          <p className="font-sans text-sm sm:text-base leading-relaxed text-smoke max-w-xl">
            Four rooms. None of them are tidy. Thoughts written down before they made sense,
            memories that have been edited by being remembered, emotions that became garments, and
            the people whose work I cannot stop looking at.
          </p>
          <ul className="border-t border-ink/50">
            {ROOMS.map((r) => (
              <li key={r.id}>
                <a
                  href={`#${r.id}`}
                  data-testid={`mind-room-${r.id}`}
                  className="group flex items-baseline justify-between border-b border-ink/50 py-4 transition-colors duration-300 hover:bg-paper"
                >
                  <span className="font-serif italic text-2xl sm:text-3xl group-hover:text-burgundy group-hover:translate-x-2 transition-all duration-300">
                    {r.label}
                  </span>
                  <span className="font-hand text-lg text-smoke opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {r.note}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      {/* ── quiet room: thoughts ───────────────────────────────── */}
      <section id="thoughts" data-testid="mind-thoughts" className="px-5 sm:px-16 pt-24 sm:pt-36 scroll-mt-24">
        <Reveal>
          <div className="flex items-baseline gap-5">
            <span className="font-sans text-[11px] tracking-[0.35em] uppercase text-burgundy">i</span>
            <h2 className="font-serif font-light uppercase tracking-tight text-4xl sm:text-6xl">
              thoughts
            </h2>
          </div>
          <div className="pink-rule mt-6 max-w-xl" />
        </Reveal>
        <div className="mt-12 columns-1 sm:columns-2 lg:columns-3 gap-6 [column-fill:_balance]">
          {THOUGHTS.map((t, i) => (
            <Reveal key={i} delay={i * 0.05}>
              <p
                className="mb-6 break-inside-avoid border-l-2 border-pink pl-5 font-hand text-2xl leading-snug text-ink"
                style={{ transform: `rotate(${t.tilt}deg)` }}
              >
                {t.text}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── quiet room: memories ───────────────────────────────── */}
      <section id="memories" data-testid="mind-memories" className="px-5 sm:px-16 pt-24 sm:pt-36 scroll-mt-24">
        <Reveal>
          <div className="flex items-baseline gap-5">
            <span className="font-sans text-[11px] tracking-[0.35em] uppercase text-burgundy">ii</span>
            <h2 className="font-serif font-light uppercase tracking-tight text-4xl sm:text-6xl">
              memories
            </h2>
          </div>
          <div className="pink-rule mt-6 max-w-xl" />
        </Reveal>
        <div className="mt-14 space-y-16">
          {MEMORIES.map((m, i) => (
            <Reveal key={m.title} delay={i * 0.06}>
              <article
                className={`grid md:grid-cols-[180px_1fr_260px] gap-6 md:gap-10 items-start border-t border-ink/40 pt-8 ${
                  i % 2 ? "md:pl-10" : ""
                }`}
              >
                <p className="font-sans text-[11px] tracking-[0.3em] uppercase text-wine">{m.year}</p>
                <div>
                  <h3 className="font-serif font-light text-2xl sm:text-4xl tracking-tight">
                    {m.title}
                  </h3>
                  <p className="mt-4 font-sans text-sm leading-relaxed text-smoke max-w-xl">
                    {m.body}
                  </p>
                </div>
                <div className={i % 2 ? "rotate-1" : "-rotate-1"}>
                  <Placeholder caption={m.cap} ratio="aspect-[4/3]" />
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <Marquee
        items={["messy", "romantic", "angry", "nostalgic", "playful", "dreamy", "chaotic"]}
        outline
        className="bg-paper mt-24 sm:mt-36"
      />

      {/* ── the interactive moment: emotions ───────────────────── */}
      <section
        id="emotions"
        data-testid="mind-emotions"
        className="bg-ink text-cream px-5 sm:px-16 py-24 sm:py-32 border-y-4 border-burgundy scroll-mt-24"
      >
        <Reveal>
          <div className="flex items-baseline gap-5">
            <span className="font-sans text-[11px] tracking-[0.35em] uppercase text-pink">iii</span>
            <h2 className="font-serif font-light uppercase tracking-tight text-4xl sm:text-6xl">
              emotions
            </h2>
          </div>
          <p className="mt-8 font-serif font-light text-2xl sm:text-4xl lg:text-5xl leading-[1.3] sm:leading-[1.25] lg:leading-[1.2] max-w-4xl">
            Fashion is expressing your emotions without words.{" "}
            <span className="italic text-pink">So — what are you feeling today?</span>
          </p>
          <p className="mt-4 font-hand text-2xl text-pink -rotate-1">
            pick one. i'll show you what it looked like when i felt it.
          </p>
        </Reveal>

        <div
          data-testid="feeling-options"
          className="mt-12 flex flex-wrap gap-3 sm:gap-4"
          role="group"
          aria-label="what are you feeling today?"
        >
          {ORDER.map((key, i) => (
            <button
              key={key}
              data-testid={`feeling-${key}`}
              onClick={() => pick(key)}
              aria-pressed={feeling === key}
              style={{ transform: `rotate(${((i % 3) - 1) * 1.1}deg)` }}
              className={`px-5 py-3 border text-[11px] sm:text-xs tracking-[0.3em] uppercase font-sans transition-all duration-300 ${
                feeling === key
                  ? "bg-burgundy text-cream border-burgundy shadow-[4px_4px_0px_#F3A8BF]"
                  : "border-cream/40 text-cream/80 hover:border-pink hover:text-pink hover:-translate-y-1"
              }`}
            >
              {key}
            </button>
          ))}
        </div>

        <div className="mt-14 min-h-[420px]">
          <AnimatePresence mode="wait">
            {!feeling && (
              <motion.p
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                data-testid="feeling-empty"
                className="font-serif italic text-2xl sm:text-3xl text-cream/40 max-w-xl"
              >
                nothing selected yet — the wardrobe is still closed.
              </motion.p>
            )}

            {feeling && piece && (
              <motion.div
                key={`${feeling}-${variant}`}
                initial={{ opacity: 0, y: 30, rotate: 0.6 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                exit={{ opacity: 0, y: -20, rotate: -0.6 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                data-testid={`feeling-panel-${feeling}`}
                className="grid lg:grid-cols-[minmax(0,420px)_1fr] gap-10 lg:gap-16 items-start"
              >
                <div className="relative">
                  <div className="absolute -top-3 -left-1 font-serif italic text-5xl sm:text-6xl text-outline-pink select-none pointer-events-none">
                    {feeling}
                  </div>
                  <div className="pt-14 -rotate-1">
                    <Placeholder dark caption={piece.cap} note={piece.hand} />
                  </div>
                </div>

                <div>
                  <p className="font-hand text-2xl text-pink -rotate-1">{data.line}</p>
                  <h3 className="mt-4 font-serif font-light italic text-4xl sm:text-6xl tracking-tight">
                    {piece.title}
                  </h3>
                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    {data.swatches.map((s) => (
                      <span
                        key={s}
                        className="h-7 w-14 border border-cream/40"
                        style={{ background: s }}
                        aria-hidden="true"
                      />
                    ))}
                    <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-cream/50">
                      the palette it came out of
                    </span>
                  </div>
                  <dl className="mt-8 grid sm:grid-cols-2 gap-x-10 gap-y-3 font-sans text-sm text-cream/70 max-w-xl">
                    <div>
                      <dt className="text-[10px] tracking-[0.3em] uppercase text-pink">medium</dt>
                      <dd className="mt-1">{piece.medium}</dd>
                    </div>
                    <div>
                      <dt className="text-[10px] tracking-[0.3em] uppercase text-pink">year</dt>
                      <dd className="mt-1">{piece.year}</dd>
                    </div>
                  </dl>
                  <p className="mt-6 font-sans text-sm sm:text-base leading-relaxed text-cream/80 max-w-xl">
                    {piece.body}
                  </p>

                  <div className="mt-10 flex flex-wrap items-center gap-6">
                    <button
                      data-testid="feeling-another"
                      onClick={() => setVariant((v) => v + 1)}
                      className="group flex items-center gap-3 border border-pink px-6 py-3 text-[11px] tracking-[0.3em] uppercase font-sans text-pink hover:bg-pink hover:text-ink transition-colors duration-300"
                    >
                      <Shuffle size={13} className="transition-transform duration-300 group-hover:rotate-12" />
                      another piece in this feeling
                    </button>
                    <Link
                      to="/dress-me"
                      data-testid="feeling-to-dress-me"
                      className="group flex items-center gap-2 font-serif italic text-xl text-cream/70 hover:text-pink transition-colors duration-300"
                    >
                      now make one yourself
                      <ArrowUpRight size={18} className="transition-transform duration-300 group-hover:rotate-45" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ── quiet room: inspirations ───────────────────────────── */}
      <section
        id="inspirations"
        data-testid="mind-inspirations"
        className="px-5 sm:px-16 py-24 sm:py-36 scroll-mt-24"
      >
        <Reveal>
          <div className="flex items-baseline gap-5">
            <span className="font-sans text-[11px] tracking-[0.35em] uppercase text-burgundy">iv</span>
            <h2 className="font-serif font-light uppercase tracking-tight text-4xl sm:text-6xl">
              inspirations
            </h2>
          </div>
          <div className="pink-rule mt-6 max-w-xl" />
        </Reveal>
        <div className="mt-12 border-t border-ink/50 max-w-4xl">
          {INSPIRATIONS.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.04}>
              <div className="group flex items-baseline justify-between gap-6 border-b border-ink/50 py-5 transition-colors duration-300 hover:bg-paper">
                <span className="font-serif font-light text-2xl sm:text-4xl tracking-tight group-hover:text-burgundy transition-colors duration-300">
                  {p.name}
                </span>
                <span className="font-sans text-[11px] tracking-[0.25em] uppercase text-smoke text-right">
                  {p.note}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.1}>
          <Link
            to="/moodboards"
            data-testid="mind-to-moodboards"
            className="group mt-12 inline-flex items-center gap-3 border border-ink bg-ivory px-7 py-4 text-xs tracking-[0.3em] uppercase font-sans shadow-[5px_5px_0px_#1A1A1A] hover:shadow-[8px_8px_0px_#6B1226] transition-shadow duration-300"
          >
            see the moodboards
            <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:rotate-45" />
          </Link>
        </Reveal>
      </section>
    </motion.main>
  );
};

export default Mind;
