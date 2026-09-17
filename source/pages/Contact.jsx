import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { ArrowUpRight } from "lucide-react";
import Reveal from "@/components/Reveal";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const Contact = () => {
  const [links, setLinks] = useState(null);

  useEffect(() => {
    axios
      .get(`${API}/settings/links`)
      .then((res) => setLinks(res.data || {}))
      .catch(() => setLinks({}));
  }, []);

  const rows = [
    {
      label: "email",
      value: links?.email || "",
      href: links?.email ? `mailto:${links.email}` : null,
      empty: "add it in the studio",
    },
    {
      label: "instagram",
      value: links?.instagram || "",
      href: links?.instagram ? (links.instagram.startsWith("http") ? links.instagram : `https://instagram.com/${links.instagram.replace(/^@/, "")}`) : null,
      empty: "add @handle in the studio",
    },
    {
      label: "elsewhere",
      value: links?.elsewhere || "",
      href: links?.elsewhere || null,
      empty: "portfolio links, soon",
    },
  ];

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-cream min-h-screen flex flex-col"
    >
      <section className="flex-1 pt-36 sm:pt-48 px-5 sm:px-16">
        <Reveal>
          <p className="font-hand text-2xl text-wine -rotate-2 mb-6">last page of the diary —</p>
        </Reveal>
        <h1 data-testid="contact-title" className="font-serif font-light uppercase tracking-tighter leading-[0.85] text-[13vw] sm:text-[10vw]">
          <span className="block overflow-hidden">
            <motion.span initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }} className="block">
              let's make
            </motion.span>
          </span>
          <span className="block overflow-hidden">
            <motion.span initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ delay: 0.15, duration: 1, ease: [0.16, 1, 0.3, 1] }} className="block italic text-outline">
              something<span className="text-burgundy" style={{ WebkitTextStroke: "0px" }}>.</span>
            </motion.span>
          </span>
        </h1>

        <div className="mt-16 sm:mt-24 max-w-3xl border-t border-ink/60">
          {rows.map((l, i) => (
            <Reveal key={l.label} delay={i * 0.07}>
              {l.href ? (
                <a
                  href={l.href}
                  target={l.label === "email" ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  data-testid={`contact-link-${l.label}`}
                  className="group flex items-baseline justify-between border-b border-ink/60 py-6 sm:py-8 transition-colors duration-300 hover:bg-paper"
                >
                  <span className="font-sans text-[11px] tracking-[0.35em] uppercase text-smoke group-hover:text-burgundy transition-colors duration-300">
                    {l.label}
                  </span>
                  <span className="flex items-center gap-3 font-serif italic text-2xl sm:text-4xl tracking-tight text-ink group-hover:text-burgundy group-hover:translate-x-2 transition-all duration-300">
                    {l.value}
                    <ArrowUpRight size={20} className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-burgundy" />
                  </span>
                </a>
              ) : (
                <div
                  data-testid={`contact-link-${l.label}`}
                  className="flex items-baseline justify-between border-b border-ink/60 py-6 sm:py-8"
                >
                  <span className="font-sans text-[11px] tracking-[0.35em] uppercase text-smoke">
                    {l.label}
                  </span>
                  <span className="font-serif italic text-2xl sm:text-4xl tracking-tight text-ink/40">
                    {l.empty}
                  </span>
                </div>
              )}
            </Reveal>
          ))}
        </div>
        <p className="mt-8 font-hand text-xl text-smoke rotate-1">
          (vamika can set these links herself from the studio — no code needed)
        </p>
      </section>

      <footer className="px-5 sm:px-16 py-10 flex flex-col sm:flex-row justify-between gap-3 border-t border-burgundy/50 mt-16">
        <span className="font-serif italic text-lg text-ink">vamika menon</span>
        <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-smoke">
          messy · fluid · visual · personal · artistic
        </span>
      </footer>
    </motion.main>
  );
};

export default Contact;
