import { useEffect } from "react";
import { motion } from "framer-motion";

const FLASH_WORDS = ["memory", "chaos", "obsession", "identity", "emotion", "creation"];

const MindTransition = ({ onDone }) => {
  useEffect(() => {
    const t = setTimeout(onDone, 1500);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <motion.div
      data-testid="mind-transition-overlay"
      initial={{ clipPath: "inset(100% 0 0 0)" }}
      animate={{ clipPath: "inset(0% 0 0 0)" }}
      exit={{ clipPath: "inset(0 0 100% 0)" }}
      transition={{ duration: 0.6, ease: [0.83, 0, 0.17, 1] }}
      className="fixed inset-0 z-[120] bg-ink flex items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 opacity-20">
        {[...Array(14)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.3] }}
            transition={{ delay: 0.05 * i, duration: 0.8 }}
            className={`absolute border ${i % 3 === 0 ? "border-burgundy-light" : "border-pink/60"}`}
            style={{
              left: `${(i * 37) % 90}%`,
              top: `${(i * 53) % 85}%`,
              width: `${60 + ((i * 41) % 140)}px`,
              height: `${40 + ((i * 29) % 120)}px`,
              transform: `rotate(${(i * 17) % 24 - 12}deg)`,
            }}
          />
        ))}
      </div>
      <div className="relative text-center px-6">
        {FLASH_WORDS.map((w, i) => (
          <motion.span
            key={w}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ delay: 0.12 * i, duration: 0.55 }}
            className={`absolute inset-0 flex items-center justify-center font-serif italic text-4xl sm:text-6xl ${
              i % 2 ? "text-pink" : "text-cream"
            }`}
          >
            {w}
          </motion.span>
        ))}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="font-hand text-2xl text-pink"
        >
          welcome inside my head
        </motion.p>
      </div>
    </motion.div>
  );
};

export default MindTransition;
