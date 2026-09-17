import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const LINKS = [
  { to: "/about", label: "ABOUT" },
  { to: "/mind", label: "MIND" },
  { to: "/project", label: "PROJECT" },
  { to: "/process", label: "PROCESS" },
  { to: "/moodboards", label: "MOODBOARDS" },
  { to: "/archive", label: "ARCHIVE" },
  { to: "/contact", label: "CONTACT" },
];

const Nav = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[80] mix-blend-multiply">
        <div className="flex items-center justify-between px-5 sm:px-10 py-5">
          <Link
            to="/"
            data-testid="nav-logo"
            className="font-serif italic text-xl sm:text-2xl tracking-tight text-ink hover:text-burgundy transition-colors duration-300"
          >
            vamika menon
          </Link>
          <nav className="hidden md:flex items-center gap-6 lg:gap-7" data-testid="nav-desktop">
            {LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                data-testid={`nav-link-${l.label.toLowerCase()}`}
                className={({ isActive }) =>
                  `group relative text-[11px] tracking-[0.25em] font-sans transition-colors duration-300 ${
                    isActive ? "text-burgundy" : "text-ink hover:text-burgundy"
                  }`
                }
              >
                {l.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-pink transition-[width] duration-300 group-hover:w-full" />
              </NavLink>
            ))}
            {/* the one nav item allowed to shout */}
            <NavLink
              to="/dress-me"
              data-testid="nav-link-dress-me"
              className={({ isActive }) =>
                `border px-4 py-2 text-[11px] tracking-[0.25em] font-sans transition-all duration-300 ${
                  isActive
                    ? "border-burgundy bg-burgundy text-cream"
                    : "border-burgundy text-burgundy hover:bg-burgundy hover:text-cream"
                }`
              }
            >
              DRESS ME
            </NavLink>
          </nav>
          <button
            data-testid="nav-menu-button"
            onClick={() => setOpen(true)}
            className="md:hidden text-ink hover:text-burgundy transition-colors duration-300"
            aria-label="open menu"
          >
            <Menu size={22} strokeWidth={1.5} />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            data-testid="nav-mobile-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] bg-ink text-cream flex flex-col"
          >
            <div className="flex items-center justify-between px-5 py-5">
              <span className="font-serif italic text-xl">vamika menon</span>
              <button
                data-testid="nav-close-button"
                onClick={() => setOpen(false)}
                className="text-cream hover:text-pink transition-colors duration-300"
                aria-label="close menu"
              >
                <X size={24} strokeWidth={1.5} />
              </button>
            </div>
            <nav className="flex-1 flex flex-col justify-center px-8 gap-1 overflow-y-auto py-6">
              {[{ to: "/", label: "HOME" }, ...LINKS, { to: "/dress-me", label: "DRESS ME" }].map(
                (l, i) => (
                  <motion.div
                    key={l.to}
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.06 * i, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <NavLink
                      to={l.to}
                      data-testid={`nav-mobile-link-${l.label.toLowerCase().replace(/\s/g, "-")}`}
                      onClick={() => setOpen(false)}
                      className={({ isActive }) =>
                        `block font-serif text-4xl sm:text-5xl py-1.5 tracking-tight transition-colors duration-300 ${
                          isActive ? "text-pink italic" : "text-cream hover:text-pink"
                        }`
                      }
                    >
                      {l.label.toLowerCase()}
                    </NavLink>
                  </motion.div>
                ),
              )}
            </nav>
            <p className="px-8 pb-8 font-hand text-xl text-pink -rotate-1">
              fashion designer / artist / future creative director
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Nav;
