import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const LINKS = [
  { to: "/", label: "HOME" },
  { to: "/about", label: "ABOUT" },
  { to: "/project", label: "PROJECTS" },
  { to: "/process", label: "PROCESS" },
  { to: "/archive", label: "ARCHIVE" },
  { to: "/atelier", label: "ATELIER" },
  { to: "/contact", label: "CONTACT" },
];

const Nav = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

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
          <nav className="hidden md:flex items-center gap-7" data-testid="nav-desktop">
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
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-burgundy transition-[width] duration-300 group-hover:w-full" />
              </NavLink>
            ))}
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
                className="text-cream hover:text-blush transition-colors duration-300"
                aria-label="close menu"
              >
                <X size={24} strokeWidth={1.5} />
              </button>
            </div>
            <nav className="flex-1 flex flex-col justify-center px-8 gap-2">
              {LINKS.map((l, i) => (
                <motion.div
                  key={l.to}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.08 * i, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <NavLink
                    to={l.to}
                    data-testid={`nav-mobile-link-${l.label.toLowerCase()}`}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `block font-serif text-5xl py-2 tracking-tight transition-colors duration-300 ${
                        isActive ? "text-blush italic" : "text-cream hover:text-blush"
                      }`
                    }
                  >
                    {l.label.toLowerCase()}
                  </NavLink>
                </motion.div>
              ))}
            </nav>
            <p className="px-8 pb-8 font-hand text-xl text-blush -rotate-1">
              fashion designer / artist / future creative director
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Nav;
