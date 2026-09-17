import { motion } from "framer-motion";
import Placeholder from "@/components/Placeholder";
import Reveal from "@/components/Reveal";
import Marquee from "@/components/Marquee";

const STEPS = [
  { n: "01", title: "hand sketches", note: "pencil first, always", cap: "sketchbook spread — soon" },
  { n: "02", title: "anatomy studies", note: "learning the body to dress it", cap: "anatomy study — soon" },
  { n: "03", title: "digital design", note: "where sketches get serious", cap: "digital render — soon" },
  { n: "04", title: "textile experiments", note: "fabric has opinions", cap: "textile tests — soon" },
  { n: "05", title: "garment construction", note: "self-taught, seam by seam", cap: "on the machine — soon" },
  { n: "06", title: "final garment", note: "what the mess became", cap: "finished look — soon" },
];

const MATERIALS = ["cotton", "silk"];
const TECHNIQUES = [
  "watercolour", "oil painting", "acrylic", "textiles", "embroidery",
  "clay", "print", "block printing", "sewing", "digital design",
];

const Process = () => {
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
          <p className="font-hand text-2xl text-wine -rotate-2 mb-3">the messy middle —</p>
        </Reveal>
        <h1 data-testid="process-title" className="font-serif font-light uppercase tracking-tighter leading-[0.85] text-[11vw] sm:text-[8vw]">
          <span className="block overflow-hidden">
            <motion.span initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }} className="block">
              from thought <span className="text-wine not-italic">→</span>
            </motion.span>
          </span>
          <span className="block overflow-hidden">
            <motion.span initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ delay: 0.12, duration: 1, ease: [0.16, 1, 0.3, 1] }} className="block italic text-outline">
              sketch <span className="text-wine not-italic">→</span> form
            </motion.span>
          </span>
        </h1>
      </section>

      <section data-testid="process-steps" className="px-5 sm:px-16 mt-20 sm:mt-28 grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
        {STEPS.map((s, i) => (
          <Reveal key={s.n} delay={i * 0.06} className={i % 3 === 1 ? "lg:mt-14" : i % 3 === 2 ? "lg:mt-28" : ""}>
            <div className={`group ${i % 2 ? "rotate-1" : "-rotate-1"} transition-transform duration-500 hover:rotate-0`}>
              <div className="flex items-baseline gap-4 mb-4">
                <span className="font-serif italic text-4xl text-pink group-hover:text-wine transition-colors duration-300">{s.n}</span>
                <h3 className="font-serif font-light uppercase tracking-tight text-2xl sm:text-3xl">{s.title}</h3>
              </div>
              <div className="tape">
                <Placeholder caption={s.cap} note={s.note} ratio="aspect-[4/5]" />
              </div>
              <p className="mt-3 font-hand text-xl text-smoke rotate-[-1deg]">{s.note}</p>
            </div>
          </Reveal>
        ))}
      </section>

      <Marquee items={["cotton", "silk", "thread", "ink", "clay", "paint"]} outline className="bg-paper mt-24" />

      <section data-testid="materials-section" className="px-5 sm:px-16 py-24 sm:py-32">
        <Reveal>
          <h2 className="font-serif font-light uppercase tracking-tight text-4xl sm:text-6xl">
            materials <span className="italic text-outline">&</span> techniques
          </h2>
          <p className="font-hand text-2xl text-wine rotate-1 mt-3">things my hands know</p>
        </Reveal>

        <div className="mt-14 flex flex-wrap items-baseline gap-x-10 gap-y-4">
          {MATERIALS.map((m) => (
            <Reveal key={m}>
              <span className="font-serif font-light italic text-6xl sm:text-8xl tracking-tighter text-ink hover:text-wine transition-colors duration-500 cursor-default">
                {m}
              </span>
            </Reveal>
          ))}
          <span className="font-hand text-xl text-smoke -rotate-2">← the base materials</span>
        </div>

        <div className="mt-16 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {TECHNIQUES.map((t, i) => (
            <Reveal key={t} delay={i * 0.04}>
              <div
                data-testid={`technique-card-${t.replace(/\s/g, "-")}`}
                className="group border border-ink/60 bg-paper px-4 py-6 text-center transition-all duration-300 hover:bg-ink hover:-translate-y-1 hover:shadow-[5px_5px_0px_#6B1226]"
                style={{ transform: `rotate(${((i % 3) - 1) * 1.2}deg)` }}
              >
                <span className="font-hand text-2xl text-ink group-hover:text-pink transition-colors duration-300">
                  {t}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </motion.main>
  );
};

export default Process;
