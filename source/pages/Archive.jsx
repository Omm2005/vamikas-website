import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { X } from "lucide-react";
import Reveal from "@/components/Reveal";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const CATEGORIES = ["all", "garments", "sketchbook", "textiles", "art", "experiments", "editorial", "process"];

const DiaryNote = ({ text }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="pt-5">
      <button
        data-testid="diary-note-toggle"
        onClick={() => setOpen(!open)}
        className="font-hand text-2xl text-blush hover:text-burgundy-light transition-colors duration-300 -rotate-1"
      >
        {open ? "fold the note away ↑" : "a note from the diary →"}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0, rotate: -3 }}
            animate={{ height: "auto", opacity: 1, rotate: -1 }}
            exit={{ height: 0, opacity: 0, rotate: -3 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p data-testid="diary-note-content" className="tape mt-4 bg-cream text-ink font-hand text-2xl leading-snug p-5 max-w-sm shadow-[5px_5px_0px_#6B1226]">
              {text}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Archive = () => {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("all");
  const [active, setActive] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    axios
      .get(`${API}/gallery`, { params: { category: filter } })
      .then((res) => setItems(res.data.items || []))
      .catch(() => setItems([]))
      .finally(() => setLoaded(true));
  }, [filter]);

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-cream min-h-screen"
    >
      <section className="pt-32 sm:pt-40 px-5 sm:px-16">
        <Reveal>
          <p className="font-hand text-2xl text-wine -rotate-2 mb-3">everything i keep —</p>
          <h1 data-testid="archive-title" className="font-serif font-light uppercase tracking-tighter leading-[0.85] text-[14vw] sm:text-[9vw]">
            the <span className="italic text-outline">archive</span>
          </h1>
        </Reveal>

        <div className="mt-12 flex flex-wrap gap-2 sm:gap-3" data-testid="archive-filters">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              data-testid={`archive-filter-${c}`}
              onClick={() => setFilter(c)}
              className={`px-4 py-2 border text-[11px] tracking-[0.25em] uppercase font-sans transition-all duration-300 ${
                filter === c
                  ? "bg-ink text-cream border-ink"
                  : "border-ink/40 text-smoke hover:border-wine hover:text-wine"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      <section className="px-5 sm:px-16 py-16 sm:py-20">
        {loaded && items.length === 0 && (
          <div data-testid="archive-empty" className="border border-dashed border-ink/50 bg-paper/60 py-24 px-8 text-center">
            <p className="font-serif italic text-3xl sm:text-5xl text-ink/80">the archive is quiet — for now.</p>
            <p className="mt-4 font-hand text-2xl text-wine -rotate-1">first pieces being photographed…</p>
            <p className="mt-6 font-sans text-xs tracking-[0.25em] uppercase text-smoke">
              vamika can add work anytime via the <Link to="/admin" data-testid="archive-admin-link" className="underline decoration-burgundy underline-offset-4 hover:text-burgundy transition-colors">studio login</Link>
            </p>
          </div>
        )}

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 [column-fill:_balance]">
          {items.map((item, i) => (
            <motion.button
              key={item.id}
              data-testid={`archive-item-${item.id}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 6) * 0.05, duration: 0.6 }}
              onClick={() => setActive(item)}
              className="group relative mb-5 w-full break-inside-avoid border border-ink/60 bg-paper overflow-hidden text-left shadow-[4px_4px_0px_rgba(26,26,26,0.85)] hover:shadow-[7px_7px_0px_#9E4751] transition-shadow duration-300"
            >
              <img
                src={`${API}/files/${item.storage_path}`}
                alt={item.title}
                className="w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              />
              <div className="flex items-baseline justify-between px-4 py-3 border-t border-ink/40">
                <span className="font-serif italic text-lg text-ink">{item.title}</span>
                <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-wine">{item.category}</span>
              </div>
            </motion.button>
          ))}
        </div>
      </section>

      <AnimatePresence>
        {active && (
          <motion.div
            data-testid="archive-lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-ink/95 backdrop-blur-sm flex items-center justify-center p-5 sm:p-12"
            onClick={() => setActive(null)}
          >
            <button
              data-testid="lightbox-close-button"
              className="absolute top-6 right-6 text-cream hover:text-blush transition-colors"
              onClick={() => setActive(null)}
              aria-label="close"
            >
              <X size={28} strokeWidth={1.5} />
            </button>
            <motion.div
              initial={{ scale: 0.94, y: 24 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 12 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="grid lg:grid-cols-[1.4fr_1fr] gap-8 max-w-6xl w-full items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={`${API}/files/${active.storage_path}`}
                alt={active.title}
                className="w-full max-h-[75vh] object-contain border border-cream/30"
              />
              <div className="text-cream">
                <span className="font-sans text-[10px] tracking-[0.35em] uppercase text-blush">{active.category}</span>
                <h3 className="mt-3 font-serif font-light italic text-4xl sm:text-5xl tracking-tight">{active.title}</h3>
                <div className="mt-6 space-y-2 font-sans text-sm text-cream/70">
                  {active.medium && <p><span className="text-blush">medium —</span> {active.medium}</p>}
                  {active.year && <p><span className="text-blush">year —</span> {active.year}</p>}
                  {active.description && <p className="pt-3 leading-relaxed">{active.description}</p>}
                </div>
                {active.diary && <DiaryNote key={active.id} text={active.diary} />}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.main>
  );
};

export default Archive;
