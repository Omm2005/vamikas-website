import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowUpRight, RotateCcw } from "lucide-react";
import Reveal from "@/components/Reveal";

/* ───────────────────────── the six decisions ───────────────────────── */

const SILHOUETTES = {
  column: {
    label: "column",
    line: "a straight line with opinions",
    hand: "column. nothing to hide behind.",
    d: "M165,170 L235,170 L250,540 L150,540 Z",
    belt: [161, 239],
  },
  "a-line": {
    label: "a-line",
    line: "the classic, for a reason",
    hand: "a-line — it flatters everyone and knows it.",
    d: "M165,170 L235,170 L295,540 L105,540 Z",
    belt: [145, 255],
  },
  cocoon: {
    label: "cocoon",
    line: "the garment as shelter",
    hand: "cocoon. a room you can wear.",
    d: "M165,170 L235,170 C300,260 302,420 245,540 L155,540 C98,420 100,260 165,170 Z",
    belt: [112, 288],
  },
  bias: {
    label: "bias",
    line: "narrow, then suddenly not",
    hand: "cut on the bias — drama that waits until the knee.",
    d: "M165,170 L235,170 C238,300 232,380 228,420 C262,452 282,500 288,540 L112,540 C118,500 138,452 172,420 C168,380 162,300 165,170 Z",
    belt: [158, 242],
  },
};

const FABRICS = {
  cotton: { label: "cotton poplin", line: "honest, everyday, crisp", hand: "cotton. it tells the truth about your seams.", opacity: 1, overlay: null },
  silk: { label: "silk satin", line: "it drapes like water", hand: "silk — the fabric that photographs itself.", opacity: 1, overlay: "sheen" },
  organza: { label: "organza", line: "barely there, on purpose", hand: "organza. the body becomes part of the print.", opacity: 0.38, overlay: null },
  wool: { label: "wool crepe", line: "matte, heavy, serious", hand: "wool crepe — for the looks that mean it.", opacity: 1, overlay: "tex-crepe" },
};

const COLOURS = {
  ivory: { label: "ivory", line: "the canvas colour", hex: "#F7F5F0", hand: "ivory. everything reads against it.", dark: false },
  pink: { label: "soft pink", line: "playful, not sweet", hand: "pink, but the loud kind of quiet.", hex: "#F3A8BF", dark: false },
  burgundy: { label: "burgundy", line: "what red sounds like calmed down", hand: "burgundy. my whole personality, dyed.", hex: "#6B1226", dark: true },
  charcoal: { label: "charcoal", line: "the silhouette, undistracted", hex: "#2E2C2A", hand: "charcoal — let the cut do the talking.", dark: true },
  sand: { label: "sand", line: "a muted neutral to rest on", hex: "#E7E1D6", hand: "sand. the colour of a studio wall.", dark: false },
};

const PRINTS = {
  none: { label: "no print", line: "confidence", hand: "no print. brave." },
  dots: { label: "hand-blocked dots", line: "no two agree", hand: "dots — a little obsessed, me too." },
  stripes: { label: "pinstripe", line: "tailoring, borrowed", hand: "stripes never really left." },
  bloom: { label: "bloom", line: "a flower at the scale of a bruise", hand: "romantic fall agrees." },
};

const DETAILS = {
  none: { label: "clean finish", line: "restraint is a choice", hand: "nothing extra. i almost never do this." },
  puff: { label: "puff sleeve", line: "commits to the bit", hand: "a puff sleeve is a decision, not an accident." },
  bell: { label: "bell sleeve", line: "drama, but controlled", hand: "bell sleeves — movement you can hear." },
  pleats: { label: "knife pleats", line: "discipline you can wear", hand: "pleats. hours of them." },
  raw: { label: "exposed seams", line: "the construction, admitted", hand: "i left the basting in. margiela started it." },
};

const ACCESSORIES = {
  none: { label: "nothing", line: "the look is the look", hand: "unaccessorised. bold." },
  bow: { label: "oversized bow", line: "obviously", hand: "a bow. obviously." },
  belt: { label: "leather belt", line: "waist, defined", hand: "belted. the waist was always the point." },
  pearls: { label: "pearls", line: "grandmother-approved armour", hand: "pearls — inherited, or convincingly faked." },
  corsage: { label: "corsage", line: "one flower, badly behaved", hand: "a corsage, pinned slightly wrong on purpose." },
};

const STEPS = [
  { key: "silhouette", title: "silhouette", options: SILHOUETTES, brief: "start with the shape the body makes." },
  { key: "fabric", title: "fabric", options: FABRICS, brief: "fabric has opinions. pick who you're arguing with." },
  { key: "colour", title: "colour", options: COLOURS, brief: "colour decides the mood before anyone reads the cut." },
  { key: "print", title: "print", options: PRINTS, brief: "surface, or the deliberate absence of one." },
  { key: "detail", title: "detail", options: DETAILS, brief: "the decision people notice second." },
  { key: "accessory", title: "accessory", options: ACCESSORIES, brief: "the last word." },
];

const EMPTY = {
  silhouette: null,
  fabric: null,
  colour: null,
  print: null,
  detail: null,
  accessory: null,
};

/* ───────────────────────── the figure ───────────────────────── */

const Figure = ({ pick, small = false }) => {
  const sil = SILHOUETTES[pick.silhouette] || SILHOUETTES.column;
  const fab = FABRICS[pick.fabric] || FABRICS.cotton;
  const col = COLOURS[pick.colour] || COLOURS.ivory;
  const dressed = Boolean(pick.silhouette);
  const seamStroke = col.dark ? "#F7F5F0" : "#1A1A1A";

  return (
    <svg
      data-testid="dressme-figure"
      viewBox="0 0 400 640"
      className={small ? "h-[46vh] w-auto max-w-full" : "h-[52vh] sm:h-[60vh] w-auto max-w-full"}
      role="img"
      aria-label="your garment in progress"
    >
      <defs>
        <linearGradient id="sheen" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.45" />
          <stop offset="0.45" stopColor="#FFFFFF" stopOpacity="0.04" />
          <stop offset="0.7" stopColor="#FFFFFF" stopOpacity="0.3" />
          <stop offset="1" stopColor="#000000" stopOpacity="0.08" />
        </linearGradient>
        <pattern id="print-dots" width="36" height="36" patternUnits="userSpaceOnUse">
          <circle cx="10" cy="10" r="4" fill="#6B1226" opacity="0.7" />
          <circle cx="28" cy="28" r="4" fill="#6B1226" opacity="0.7" />
        </pattern>
        <pattern id="print-stripes" width="40" height="22" patternUnits="userSpaceOnUse">
          <rect y="0" width="40" height="3" fill="#1A1A1A" opacity="0.35" />
        </pattern>
        <pattern id="print-bloom" width="52" height="52" patternUnits="userSpaceOnUse">
          <g stroke="#9E4751" strokeWidth="1.6" fill="none" opacity="0.85">
            <path d="M26,14 C20,20 20,32 26,38 C32,32 32,20 26,14 Z" />
            <path d="M14,26 C20,20 32,20 38,26 C32,32 20,32 14,26 Z" />
          </g>
        </pattern>
        <pattern id="tex-pleats" width="14" height="10" patternUnits="userSpaceOnUse">
          <line x1="7" y1="0" x2="7" y2="10" stroke="#1A1A1A" strokeWidth="1.4" opacity="0.26" />
        </pattern>
        <pattern id="tex-crepe" width="6" height="6" patternUnits="userSpaceOnUse">
          <circle cx="1.5" cy="1.5" r="0.7" fill="#1A1A1A" opacity="0.16" />
          <circle cx="4.5" cy="4.5" r="0.7" fill="#1A1A1A" opacity="0.16" />
        </pattern>
      </defs>

      <line x1="70" y1="612" x2="330" y2="612" stroke="#1A1A1A" strokeWidth="1.5" strokeDasharray="2 7" opacity="0.6" />

      {/* the croquis */}
      <g stroke="#1A1A1A" strokeWidth="1.6" fill="#F7F5F0">
        <circle cx="200" cy="66" r="24" />
        <path d="M168,112 L232,112 L236,172 L164,172 Z" />
        <path d="M192,88 L192,112 M208,88 L208,112" fill="none" />
        <path d="M170,116 C142,180 130,260 124,344" fill="none" />
        <path d="M230,116 C258,180 270,260 276,344" fill="none" />
        <path d="M186,540 L183,606 M214,540 L217,606" fill="none" />
      </g>

      {dressed && (
        <>
          <motion.g
            key={`${pick.silhouette}-${pick.fabric}-${pick.colour}-${pick.print}-${pick.detail}`}
            initial={{ opacity: 0, scale: 0.985 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformOrigin: "200px 350px" }}
          >
            <path d={sil.d} fill={col.hex} fillOpacity={fab.opacity} stroke="#1A1A1A" strokeWidth="2" />
            {fab.overlay === "sheen" && <path d={sil.d} fill="url(#sheen)" />}
            {fab.overlay === "tex-crepe" && <path d={sil.d} fill="url(#tex-crepe)" />}
            {pick.print && pick.print !== "none" && <path d={sil.d} fill={`url(#print-${pick.print})`} />}
            {pick.detail === "pleats" && <path d={sil.d} fill="url(#tex-pleats)" />}
            {pick.detail === "raw" && (
              <g fill="none" stroke={seamStroke} strokeWidth="1.5" strokeDasharray="6 5" opacity="0.75">
                <path d="M200,172 L200,540" />
                <path d="M176,190 C172,300 170,430 168,538" />
                <path d="M224,190 C228,300 230,430 232,538" />
              </g>
            )}
          </motion.g>

          {/* sleeves */}
          <motion.g
            key={`sleeve-${pick.detail}-${pick.colour}-${pick.fabric}`}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {pick.detail === "puff" && (
              <g fill={col.hex} fillOpacity={fab.opacity} stroke="#1A1A1A" strokeWidth="2">
                <ellipse cx="148" cy="158" rx="32" ry="28" />
                <ellipse cx="252" cy="158" rx="32" ry="28" />
              </g>
            )}
            {pick.detail === "bell" && (
              <g fill={col.hex} fillOpacity={fab.opacity} stroke="#1A1A1A" strokeWidth="2">
                <path d="M162,150 C124,200 112,280 116,346 L152,340 C150,270 158,210 172,168 Z" />
                <path d="M238,150 C276,200 288,280 284,346 L248,340 C250,270 242,210 228,168 Z" />
              </g>
            )}
          </motion.g>

          {/* accessory */}
          <motion.g
            key={`acc-${pick.accessory}-${pick.silhouette}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            style={{ transformOrigin: "200px 250px" }}
          >
            {pick.accessory === "bow" && (
              <g fill="#6B1226" stroke="#1A1A1A" strokeWidth="1.5">
                <path d="M200,178 L164,160 L168,197 Z" />
                <path d="M200,178 L236,160 L232,197 Z" />
                <circle cx="200" cy="178" r="7" />
              </g>
            )}
            {pick.accessory === "belt" && (
              <rect
                x={sil.belt[0]}
                y="296"
                width={sil.belt[1] - sil.belt[0]}
                height="16"
                fill="#4A0C1B"
                stroke="#1A1A1A"
                strokeWidth="1.5"
              />
            )}
            {pick.accessory === "pearls" && (
              <g fill="#F7F5F0" stroke="#1A1A1A" strokeWidth="1.2">
                {[[172, 181], [182, 187], [193, 190], [207, 190], [218, 187], [228, 181]].map(([x, y]) => (
                  <circle key={x} cx={x} cy={y} r="3.6" />
                ))}
              </g>
            )}
            {pick.accessory === "corsage" && (
              <g transform="translate(160,168) rotate(-12)">
                <g fill="#F3A8BF" stroke="#6B1226" strokeWidth="1.3">
                  {[0, 60, 120, 180, 240, 300].map((a) => (
                    <ellipse key={a} cx="0" cy="-9" rx="6" ry="10" transform={`rotate(${a})`} />
                  ))}
                </g>
                <circle cx="0" cy="0" r="4.5" fill="#6B1226" />
              </g>
            )}
          </motion.g>
        </>
      )}
    </svg>
  );
};

/* ───────────────────────── the experience ───────────────────────── */

const DressMe = () => {
  const [step, setStep] = useState(0);
  const [pick, setPick] = useState(EMPTY);
  const [done, setDone] = useState(false);
  const [lastHand, setLastHand] = useState(null);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const current = STEPS[step];

  const choose = (key, value) => {
    clearTimeout(timer.current);
    setPick((p) => ({ ...p, [key]: value }));
    setLastHand(STEPS.find((s) => s.key === key).options[value].hand);
    // let the garment redraw before moving on — the pause is part of the pacing
    timer.current = setTimeout(() => {
      if (step === STEPS.length - 1) setDone(true);
      else setStep((s) => Math.min(s + 1, STEPS.length - 1));
    }, 620);
  };

  const restart = () => {
    clearTimeout(timer.current);
    setPick(EMPTY);
    setStep(0);
    setDone(false);
    setLastHand(null);
  };

  const chosenCount = Object.values(pick).filter(Boolean).length;
  const lookName = done
    ? `${COLOURS[pick.colour].label} ${SILHOUETTES[pick.silhouette].label}`
    : "";
  const lookNumber = done
    ? String(
        (Object.keys(SILHOUETTES).indexOf(pick.silhouette) * 37 +
          Object.keys(COLOURS).indexOf(pick.colour) * 13 +
          Object.keys(DETAILS).indexOf(pick.detail) * 7 +
          Object.keys(ACCESSORIES).indexOf(pick.accessory) * 3 +
          Object.keys(PRINTS).indexOf(pick.print) * 11 +
          Object.keys(FABRICS).indexOf(pick.fabric) * 5) %
          97 +
          1,
      ).padStart(2, "0")
    : "";

  const spec = done
    ? [
        ["silhouette", SILHOUETTES[pick.silhouette].label],
        ["fabric", FABRICS[pick.fabric].label],
        ["colour", COLOURS[pick.colour].label],
        ["print", PRINTS[pick.print].label],
        ["detail", DETAILS[pick.detail].label],
        ["accessory", ACCESSORIES[pick.accessory].label],
      ]
    : [];

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
            experience 02
          </p>
          <p className="font-hand text-2xl text-wine -rotate-2 mt-4 mb-7">a studio, miniaturised —</p>
        </Reveal>
        <h1
          data-testid="dressme-title"
          className="font-serif font-light uppercase tracking-tighter leading-[0.85] text-[15vw] sm:text-[9vw]"
        >
          <span className="block overflow-hidden">
            <motion.span
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="block"
            >
              dress
            </motion.span>
          </span>
          <span className="block overflow-hidden">
            <motion.span
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              transition={{ delay: 0.14, duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="block italic text-outline-burgundy"
            >
              me
            </motion.span>
          </span>
        </h1>
        <Reveal delay={0.25} className="mt-8 max-w-xl">
          <p className="font-sans text-sm sm:text-base leading-relaxed text-smoke">
            Six decisions stand between a thought and a garment. Take them in order, the way the
            studio does — shape first, surface last. There is no undo, only{" "}
            <span className="font-serif italic text-ink">start again</span>.
          </p>
        </Reveal>
      </section>

      {/* step rail */}
      <section className="px-5 sm:px-16 mt-14">
        <ol data-testid="dressme-rail" className="grid grid-cols-3 md:grid-cols-6 border-t border-ink/60">
          {STEPS.map((s, i) => {
            const state = done || pick[s.key] ? "done" : i === step ? "current" : "todo";
            return (
              <li key={s.key} className="border-b border-ink/60 md:border-b-0">
                <button
                  data-testid={`dressme-step-${s.key}`}
                  onClick={() => {
                    if (state === "todo") return;
                    clearTimeout(timer.current);
                    setDone(false);
                    setStep(i);
                  }}
                  disabled={state === "todo"}
                  className={`w-full text-left px-3 py-4 border-l border-ink/25 first:border-l-0 transition-colors duration-300 ${
                    state === "current"
                      ? "bg-burgundy text-cream"
                      : state === "done"
                        ? "text-ink hover:bg-paper"
                        : "text-stone cursor-default"
                  }`}
                >
                  <span
                    className={`block font-sans text-[10px] tracking-[0.3em] ${
                      state === "current" ? "text-pink" : state === "done" ? "text-burgundy" : "text-stone"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="mt-1 block font-sans text-[11px] tracking-[0.25em] uppercase">
                    {s.title}
                  </span>
                  <span
                    className={`mt-2 block truncate font-hand text-lg ${
                      state === "current" ? "text-pink-soft" : "text-smoke"
                    }`}
                  >
                    {pick[s.key] ? s.options[pick[s.key]].label : "—"}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
        <div className="mt-3 h-px bg-ink/15">
          <motion.div
            className="h-px bg-pink"
            animate={{ width: `${(chosenCount / STEPS.length) * 100}%` }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      </section>

      {/* the working table */}
      <section className="px-5 sm:px-16 mt-12 sm:mt-16 pb-28 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] items-start">
        <div className="order-1 flex flex-col items-center">
          <div className="w-full border border-ink/50 bg-ivory px-4 py-6 flex flex-col items-center shadow-[6px_6px_0px_rgba(26,26,26,0.9)]">
            <Figure pick={pick} />
            <p className="mt-4 h-8 text-center font-hand text-2xl text-wine -rotate-1">
              {lastHand || "start anywhere in the shape of a first decision."}
            </p>
          </div>
          <div className="mt-5 flex items-center gap-6">
            <button
              data-testid="dressme-restart"
              onClick={restart}
              className="flex items-center gap-2 text-[11px] tracking-[0.3em] uppercase font-sans text-smoke hover:text-burgundy transition-colors duration-300"
            >
              <RotateCcw size={13} /> start again
            </button>
            {step > 0 && !done && (
              <button
                data-testid="dressme-back"
                onClick={() => {
                  clearTimeout(timer.current);
                  setStep((s) => Math.max(0, s - 1));
                }}
                className="flex items-center gap-2 text-[11px] tracking-[0.3em] uppercase font-sans text-smoke hover:text-burgundy transition-colors duration-300"
              >
                <ArrowLeft size={13} /> previous decision
              </button>
            )}
          </div>
        </div>

        <div className="order-2">
          <AnimatePresence mode="wait">
            {!done ? (
              <motion.div
                key={current.key}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                data-testid={`dressme-panel-${current.key}`}
              >
                <div className="flex items-baseline gap-4">
                  <span className="font-serif text-4xl text-outline-burgundy">
                    {String(step + 1).padStart(2, "0")}
                  </span>
                  <h2 className="font-serif font-light uppercase tracking-tight text-3xl sm:text-5xl">
                    {current.title}
                  </h2>
                </div>
                <p className="mt-3 font-sans text-sm text-smoke max-w-md">{current.brief}</p>
                <div className="pink-rule mt-6" />

                <div className="mt-8 grid sm:grid-cols-2 gap-4">
                  {Object.entries(current.options).map(([value, opt], i) => {
                    const selected = pick[current.key] === value;
                    return (
                      <button
                        key={value}
                        data-testid={`dressme-option-${current.key}-${value}`}
                        onClick={() => choose(current.key, value)}
                        aria-pressed={selected}
                        style={{ transform: `rotate(${((i % 3) - 1) * 0.6}deg)` }}
                        className={`group flex items-start gap-4 border p-4 text-left transition-all duration-300 ${
                          selected
                            ? "border-burgundy bg-burgundy text-cream shadow-[4px_4px_0px_#1A1A1A]"
                            : "border-ink/50 bg-ivory text-ink hover:-translate-y-1 hover:border-burgundy hover:shadow-[4px_4px_0px_#F3A8BF]"
                        }`}
                      >
                        {current.key === "colour" ? (
                          <span
                            className="mt-1 h-9 w-9 shrink-0 border border-ink/60"
                            style={{ background: opt.hex }}
                            aria-hidden="true"
                          />
                        ) : (
                          <span
                            className={`mt-1 h-9 w-9 shrink-0 border flex items-center justify-center font-serif italic text-sm ${
                              selected ? "border-pink text-pink" : "border-ink/40 text-burgundy"
                            }`}
                            aria-hidden="true"
                          >
                            {String(i + 1).padStart(2, "0")}
                          </span>
                        )}
                        <span className="min-w-0">
                          <span className="block font-sans text-[11px] tracking-[0.25em] uppercase">
                            {opt.label}
                          </span>
                          <span
                            className={`mt-1 block font-hand text-lg leading-snug ${
                              selected ? "text-pink" : "text-smoke group-hover:text-wine"
                            }`}
                          >
                            {opt.line}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            ) : (
              /* ── LOOK CREATED ── */
              <motion.div
                key="created"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                data-testid="look-created"
              >
                <motion.p
                  initial={{ opacity: 0, letterSpacing: "0.8em" }}
                  animate={{ opacity: 1, letterSpacing: "0.4em" }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="font-sans text-[11px] uppercase text-burgundy"
                >
                  look created
                </motion.p>

                <article className="mt-5 border border-ink bg-ivory shadow-[8px_8px_0px_#6B1226]">
                  <header className="flex items-baseline justify-between gap-4 border-b border-ink bg-burgundy px-5 py-3 text-cream">
                    <span className="font-sans text-[10px] tracking-[0.35em] uppercase text-pink">
                      vamika menon — atelier
                    </span>
                    <span className="font-sans text-[10px] tracking-[0.35em] uppercase">
                      look {lookNumber}
                    </span>
                  </header>

                  <div className="px-5 sm:px-7 py-7">
                    <h2 className="font-serif font-light uppercase tracking-tighter text-4xl sm:text-5xl leading-[0.9] sm:leading-[0.9]">
                      {lookName.split(" ")[0]}{" "}
                      <span className="italic text-burgundy">{lookName.split(" ").slice(1).join(" ")}</span>
                    </h2>
                    <p className="mt-3 font-hand text-2xl text-wine -rotate-1">
                      {DETAILS[pick.detail].hand}
                    </p>

                    <dl className="mt-7 border-t border-ink/40">
                      {spec.map(([k, v]) => (
                        <div
                          key={k}
                          className="flex items-baseline justify-between gap-4 border-b border-ink/30 py-2.5"
                        >
                          <dt className="font-sans text-[10px] tracking-[0.3em] uppercase text-smoke">
                            {k}
                          </dt>
                          <dd className="font-serif italic text-lg sm:text-xl text-ink text-right">{v}</dd>
                        </div>
                      ))}
                    </dl>

                    <div className="mt-7 flex items-center gap-3">
                      <span
                        className="h-8 w-16 border border-ink/50"
                        style={{ background: COLOURS[pick.colour].hex }}
                        aria-hidden="true"
                      />
                      <span className="h-8 w-8 border border-ink/50 bg-ink" aria-hidden="true" />
                      <span className="h-8 w-8 border border-ink/50 bg-pink" aria-hidden="true" />
                      <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-smoke">
                        {FABRICS[pick.fabric].label} · {PRINTS[pick.print].label}
                      </span>
                    </div>
                  </div>

                  <footer className="border-t border-ink px-5 sm:px-7 py-4">
                    <p
                      data-testid="designed-in-vamikas-world"
                      className="font-sans text-[11px] tracking-[0.4em] uppercase text-burgundy"
                    >
                      designed in vamika's world.
                    </p>
                  </footer>
                </article>

                <div className="mt-8 flex flex-wrap items-center gap-6">
                  <button
                    data-testid="look-again"
                    onClick={restart}
                    className="group flex items-center gap-3 border border-ink bg-cream px-7 py-4 text-xs tracking-[0.3em] uppercase font-sans shadow-[5px_5px_0px_#1A1A1A] hover:shadow-[8px_8px_0px_#6B1226] transition-shadow duration-300"
                  >
                    <RotateCcw size={14} /> make another look
                  </button>
                  <Link
                    to="/moodboards"
                    className="group flex items-center gap-2 font-serif italic text-xl text-smoke hover:text-burgundy transition-colors duration-300"
                  >
                    see where mine came from
                    <ArrowUpRight size={18} className="transition-transform duration-300 group-hover:rotate-45" />
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </motion.main>
  );
};

export default DressMe;
