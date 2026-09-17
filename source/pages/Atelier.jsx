import { useState } from "react";
import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";
import Reveal from "@/components/Reveal";

const OPTIONS = {
  fabric: ["cotton", "silk", "organza"],
  texture: ["smooth", "pleated", "quilted"],
  print: ["none", "dots", "stripes", "bloom"],
  sleeve: ["sleeveless", "puff", "bell"],
  silhouette: ["column", "a-line", "cocoon"],
  embellishment: ["none", "bow", "belt", "pearls"],
};

const DEFAULTS = {
  fabric: "cotton",
  texture: "smooth",
  print: "none",
  sleeve: "sleeveless",
  silhouette: "column",
  embellishment: "none",
};

const NOTES = {
  fabric: {
    cotton: "cotton. honest and everyday.",
    silk: "silk — it drapes like water.",
    organza: "organza. barely there, on purpose.",
  },
  texture: {
    smooth: "smooth. let the cut speak.",
    pleated: "pleats — discipline you can wear.",
    quilted: "quilted. armour, but soft.",
  },
  print: {
    none: "no print. confidence.",
    dots: "dots — a little obsessed, me too.",
    stripes: "stripes never really left.",
    bloom: "a bloom print. romantic fall agrees.",
  },
  sleeve: {
    sleeveless: "sleeveless. the shoulders say enough.",
    puff: "a puff sleeve commits to the bit.",
    bell: "bell sleeves — drama, but controlled.",
  },
  silhouette: {
    column: "column. a straight line with opinions.",
    "a-line": "a-line. the classic for a reason.",
    cocoon: "cocoon — the garment as shelter.",
  },
  embellishment: {
    none: "nothing extra. restraint is also a choice.",
    bow: "a bow. obviously.",
    belt: "belted. waist, defined.",
    pearls: "pearls — grandmother-approved armour.",
  },
};

const DRESS = {
  column: "M165,170 L235,170 L250,540 L150,540 Z",
  "a-line": "M165,170 L235,170 L295,540 L105,540 Z",
  cocoon: "M165,170 L235,170 C300,260 302,420 245,540 L155,540 C98,420 100,260 165,170 Z",
};

const BELT = {
  column: [161, 239],
  "a-line": [145, 255],
  cocoon: [112, 288],
};

const FABRIC_FILL = { cotton: "#F2EFEB", silk: "url(#silk-grad)", organza: "#6B1226" };
const FABRIC_OPACITY = { cotton: 1, silk: 1, organza: 0.3 };

const Group = ({ name, values, current, onPick }) => (
  <div className="mb-9" data-testid={`atelier-group-${name}`}>
    <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-burgundy mb-3">{name}</p>
    <div className="flex flex-wrap gap-2">
      {values.map((v, i) => (
        <button
          key={v}
          data-testid={`atelier-option-${name}-${v}`}
          onClick={() => onPick(v)}
          style={{ transform: `rotate(${((i % 3) - 1) * 1.2}deg)` }}
          className={`px-4 py-2 border text-[11px] tracking-[0.2em] uppercase font-sans transition-all duration-300 ${
            current === v
              ? "bg-ink text-cream border-ink shadow-[3px_3px_0px_#6B1226]"
              : "border-ink/40 text-smoke hover:border-burgundy hover:text-burgundy hover:-translate-y-0.5"
          }`}
        >
          {v}
        </button>
      ))}
    </div>
  </div>
);

const Atelier = () => {
  const [pick, setPick] = useState(DEFAULTS);
  const [last, setLast] = useState(null);

  const choose = (cat, val) => {
    setPick((p) => ({ ...p, [cat]: val }));
    setLast(cat);
  };

  const dress = DRESS[pick.silhouette];

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-cream min-h-screen overflow-hidden"
    >
      <section className="pt-32 sm:pt-40 px-5 sm:px-16 text-left">
        <Reveal>
          <p className="font-hand text-2xl text-wine -rotate-2 mb-3">a miniature studio —</p>
        </Reveal>
        <h1 data-testid="atelier-heading" className="font-serif font-light uppercase tracking-tighter leading-[0.85] text-[10vw] sm:text-[6.2vw]">
          <span className="block overflow-hidden">
            <motion.span initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }} className="block">
              what would
            </motion.span>
          </span>
          <span className="block overflow-hidden">
            <motion.span initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ delay: 0.15, duration: 1, ease: [0.16, 1, 0.3, 1] }} className="block italic text-outline">
              you make?
            </motion.span>
          </span>
        </h1>
        <Reveal delay={0.3} className="mt-6 max-w-md">
          <p className="font-sans text-sm leading-relaxed text-smoke">
            Six decisions stand between a thought and a garment. Make them.
          </p>
        </Reveal>
      </section>

      <section className="px-5 sm:px-16 mt-14 sm:mt-20 pb-28 grid gap-10 lg:grid-cols-[1fr_auto_1fr] items-start">
        <div className="order-2 lg:order-1 lg:pt-8">
          <Group name="fabric" values={OPTIONS.fabric} current={pick.fabric} onPick={(v) => choose("fabric", v)} />
          <Group name="texture" values={OPTIONS.texture} current={pick.texture} onPick={(v) => choose("texture", v)} />
          <Group name="print" values={OPTIONS.print} current={pick.print} onPick={(v) => choose("print", v)} />
        </div>

        <div className="order-1 lg:order-2 flex flex-col items-center">
          <svg
            data-testid="atelier-figure"
            viewBox="0 0 400 640"
            className="h-[54vh] sm:h-[64vh] w-auto max-w-full"
          >
            <defs>
              <linearGradient id="silk-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#EFD3DA" />
                <stop offset="0.5" stopColor="#D9A5B3" />
                <stop offset="1" stopColor="#F2E4E8" />
              </linearGradient>
              <pattern id="print-dots" width="36" height="36" patternUnits="userSpaceOnUse">
                <circle cx="10" cy="10" r="4" fill="#6B1226" opacity="0.7" />
                <circle cx="28" cy="28" r="4" fill="#6B1226" opacity="0.7" />
              </pattern>
              <pattern id="print-stripes" width="40" height="22" patternUnits="userSpaceOnUse">
                <rect y="0" width="40" height="3" fill="#1A1A1A" opacity="0.35" />
              </pattern>
              <pattern id="print-bloom" width="52" height="52" patternUnits="userSpaceOnUse">
                <g stroke="#9E4751" strokeWidth="1.6" fill="none" opacity="0.8">
                  <path d="M26,14 C20,20 20,32 26,38 C32,32 32,20 26,14 Z" />
                  <path d="M14,26 C20,20 32,20 38,26 C32,32 20,32 14,26 Z" />
                </g>
              </pattern>
              <pattern id="tex-pleated" width="14" height="10" patternUnits="userSpaceOnUse">
                <line x1="7" y1="0" x2="7" y2="10" stroke="#1A1A1A" strokeWidth="1.4" opacity="0.28" />
              </pattern>
              <pattern id="tex-quilted" width="30" height="30" patternUnits="userSpaceOnUse">
                <path d="M0,15 L15,0 L30,15 L15,30 Z" fill="none" stroke="#1A1A1A" strokeWidth="1.2" opacity="0.25" />
              </pattern>
            </defs>

            <line x1="70" y1="612" x2="330" y2="612" stroke="#1A1A1A" strokeWidth="1.5" strokeDasharray="2 7" opacity="0.6" />

            {/* figure */}
            <g stroke="#1A1A1A" strokeWidth="1.6" fill="#F7F5F0">
              <circle cx="200" cy="66" r="24" />
              <path d="M168,112 L232,112 L236,172 L164,172 Z" />
              <path d="M192,88 L192,112 M208,88 L208,112" fill="none" />
              <path d="M170,116 C142,180 130,260 124,344" fill="none" />
              <path d="M230,116 C258,180 270,260 276,344" fill="none" />
              <path d="M186,540 L183,606 M214,540 L217,606" fill="none" />
            </g>

            {/* garment */}
            <motion.g
              key={`${pick.silhouette}-${pick.fabric}-${pick.print}-${pick.texture}`}
              initial={{ opacity: 0, scale: 0.985 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformOrigin: "200px 350px" }}
            >
              <path d={dress} fill={FABRIC_FILL[pick.fabric]} fillOpacity={FABRIC_OPACITY[pick.fabric]} stroke="#1A1A1A" strokeWidth="2" />
              {pick.print !== "none" && <path d={dress} fill={`url(#print-${pick.print})`} />}
              {pick.texture !== "smooth" && <path d={dress} fill={`url(#tex-${pick.texture})`} />}
            </motion.g>

            {/* sleeves */}
            <motion.g
              key={pick.sleeve}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {pick.sleeve === "puff" && (
                <g fill={FABRIC_FILL[pick.fabric]} fillOpacity={FABRIC_OPACITY[pick.fabric]} stroke="#1A1A1A" strokeWidth="2">
                  <ellipse cx="148" cy="158" rx="32" ry="28" />
                  <ellipse cx="252" cy="158" rx="32" ry="28" />
                </g>
              )}
              {pick.sleeve === "bell" && (
                <g fill={FABRIC_FILL[pick.fabric]} fillOpacity={FABRIC_OPACITY[pick.fabric]} stroke="#1A1A1A" strokeWidth="2">
                  <path d="M162,150 C124,200 112,280 116,346 L152,340 C150,270 158,210 172,168 Z" />
                  <path d="M238,150 C276,200 288,280 284,346 L248,340 C250,270 242,210 228,168 Z" />
                </g>
              )}
            </motion.g>

            {/* embellishment */}
            <motion.g
              key={pick.embellishment}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              style={{ transformOrigin: "200px 250px" }}
            >
              {pick.embellishment === "bow" && (
                <g fill="#6B1226" stroke="#1A1A1A" strokeWidth="1.5">
                  <path d="M200,178 L170,163 L173,194 Z" />
                  <path d="M200,178 L230,163 L227,194 Z" />
                  <circle cx="200" cy="178" r="6" />
                </g>
              )}
              {pick.embellishment === "belt" && (
                <rect
                  x={BELT[pick.silhouette][0]}
                  y="296"
                  width={BELT[pick.silhouette][1] - BELT[pick.silhouette][0]}
                  height="16"
                  fill="#6B1226"
                  stroke="#1A1A1A"
                  strokeWidth="1.5"
                />
              )}
              {pick.embellishment === "pearls" && (
                <g fill="#F7F5F0" stroke="#1A1A1A" strokeWidth="1.2">
                  {[[172, 181], [182, 187], [193, 190], [207, 190], [218, 187], [228, 181]].map(([x, y]) => (
                    <circle key={x} cx={x} cy={y} r="3.6" />
                  ))}
                </g>
              )}
            </motion.g>
          </svg>

          <div className="mt-4 text-center min-h-[64px]">
            <p data-testid="atelier-note" className="font-hand text-2xl text-wine -rotate-1">
              {last ? NOTES[last][pick[last]] : "start anywhere. there is no wrong answer."}
            </p>
            <p data-testid="atelier-look" className="mt-2 font-serif italic text-lg text-smoke">
              {Object.values(pick).join(" · ")}
            </p>
          </div>
          <button
            data-testid="atelier-reset-button"
            onClick={() => { setPick(DEFAULTS); setLast(null); }}
            className="mt-4 flex items-center gap-2 text-[11px] tracking-[0.3em] uppercase font-sans text-smoke hover:text-burgundy transition-colors duration-300"
          >
            <RotateCcw size={13} /> start over
          </button>
        </div>

        <div className="order-3 lg:pt-8 lg:text-right">
          <Group name="sleeve" values={OPTIONS.sleeve} current={pick.sleeve} onPick={(v) => choose("sleeve", v)} />
          <Group name="silhouette" values={OPTIONS.silhouette} current={pick.silhouette} onPick={(v) => choose("silhouette", v)} />
          <Group name="embellishment" values={OPTIONS.embellishment} current={pick.embellishment} onPick={(v) => choose("embellishment", v)} />
        </div>
      </section>
    </motion.main>
  );
};

export default Atelier;
