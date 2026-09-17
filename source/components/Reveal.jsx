import { motion } from "framer-motion";

const Reveal = ({ children, delay = 0, y = 48, rotate = 0, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y, rotate }}
    whileInView={{ opacity: 1, y: 0, rotate: 0 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

export default Reveal;
