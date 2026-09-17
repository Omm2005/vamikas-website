import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

// Small translucent thoughts that trail the cursor and collect at the corner
// of whatever the visitor is looking at.
//
// The whole point is restraint, so three rules hold it back: they only surface
// once the pointer has wandered a little, they dissolve when it goes still,
// and they let go entirely when it moves fast — a flick across the page is
// travelling, not looking. Everything moves by transform and opacity on a
// single rAF loop, and no frame touches React state.

const ENTER = 92; // px from a frame before the thoughts gather
const LEAVE = 172; // and how far before they let go — hysteresis, so edges don't flicker
const STILL = 1500; // ms of stillness before they dissolve
const WANDER = 46; // px of drift before they appear at all
const FAST = 1.45; // px/ms — above this the pointer is travelling

// pink, blush, wine and burgundy, at a whisper
const SPECKS = [
  { size: 9, rgb: "243, 168, 191", alpha: 0.55, ease: 0.075, orbit: 15, spin: 0.00046, phase: 0.0 },
  { size: 6, rgb: "217, 165, 179", alpha: 0.47, ease: 0.055, orbit: 24, spin: -0.00038, phase: 1.1 },
  { size: 11, rgb: "243, 168, 191", alpha: 0.37, ease: 0.041, orbit: 31, spin: 0.00029, phase: 2.3 },
  { size: 5, rgb: "158, 71, 81", alpha: 0.42, ease: 0.064, orbit: 19, spin: -0.00052, phase: 3.4 },
  { size: 7, rgb: "250, 221, 228", alpha: 0.62, ease: 0.048, orbit: 27, spin: 0.00034, phase: 4.2 },
  { size: 4, rgb: "107, 18, 38", alpha: 0.34, ease: 0.07, orbit: 21, spin: 0.00058, phase: 5.0 },
  { size: 8, rgb: "217, 165, 179", alpha: 0.29, ease: 0.036, orbit: 35, spin: -0.00026, phase: 5.8 },
];

// Distance from a point to the nearest edge of a rect — 0 when inside it.
const distanceTo = (r, x, y) =>
  Math.hypot(Math.max(r.left - x, 0, x - r.right), Math.max(r.top - y, 0, y - r.bottom));

// What the cluster has to say about a frame, in order of how worth saying it
// is. `note` is the handwritten line; `meta` is the catalogue line under it.
const annotationOf = (el) => {
  const { bubbleNote, bubbleTitle, bubbleMeta, bubbleHref } = el.dataset;
  if (!bubbleNote && !bubbleTitle) return null;
  return {
    note: bubbleNote || "",
    title: bubbleTitle || "",
    meta: bubbleMeta || "",
    href: bubbleHref || "",
  };
};

const Bubbles = () => {
  // Pointer-driven and animated, so neither touch nor a reduced-motion
  // preference gets any of it.
  const [enabled, setEnabled] = useState(false);
  const [cluster, setCluster] = useState(null); // the annotation within reach
  const [open, setOpen] = useState(null); // the one being read

  const { pathname } = useLocation();
  const dots = useRef([]);
  const clusterEl = useRef(null);
  const cardEl = useRef(null);
  const openRef = useRef(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const decide = () => setEnabled(fine.matches && !calm.matches);
    decide();
    fine.addEventListener("change", decide);
    calm.addEventListener("change", decide);
    return () => {
      fine.removeEventListener("change", decide);
      calm.removeEventListener("change", decide);
    };
  }, []);

  // The card is read inside the loop; a ref keeps the loop off the state.
  useEffect(() => {
    openRef.current = open;
  }, [open]);

  // A route change replaces the whole page under the cursor.
  useEffect(() => {
    setOpen(null);
    setCluster(null);
  }, [pathname]);

  // The studio is a tool, not part of the site's voice — no thoughts there.
  const active = enabled && pathname !== "/admin";

  useEffect(() => {
    if (!active) return;

    const state = {
      px: -9999,
      py: -9999,
      lastMove: 0,
      wandered: 0,
      awake: false,
      presence: 0,
      target: null,
      hotEl: null,
      anchor: { x: -9999, y: -9999 },
      measuredAt: 0,
      stale: true,
      trail: SPECKS.map(() => ({ x: -9999, y: -9999 })),
    };

    let frames = [];

    const scan = () => {
      frames = Array.from(document.querySelectorAll("[data-bubble]")).map((el) => ({ el, rect: null }));
      state.stale = true;
    };

    const measure = (now) => {
      const vh = window.innerHeight;
      const vw = window.innerWidth;
      for (const frame of frames) {
        const r = frame.el.getBoundingClientRect();
        // Off-screen frames cannot be looked at, so they are not candidates.
        const off = r.bottom < -40 || r.top > vh + 40 || r.right < -40 || r.left > vw + 40;
        frame.rect = off || !r.width ? null : r;
      }
      state.measuredAt = now;
      state.stale = false;
    };

    const onMove = (event) => {
      const now = performance.now();
      const dx = event.clientX - state.px;
      const dy = event.clientY - state.py;
      const gap = now - state.lastMove;
      const speed = gap > 0 && state.lastMove ? Math.hypot(dx, dy) / gap : 0;

      state.px = event.clientX;
      state.py = event.clientY;
      state.lastMove = now;
      state.stale = true;

      if (speed > FAST) {
        // Travelling across the page — the thoughts stay behind.
        state.awake = false;
        state.wandered = 0;
        return;
      }
      state.wandered += Math.hypot(dx, dy);
      if (state.wandered > WANDER) state.awake = true;
    };

    const markStale = () => {
      state.stale = true;
    };

    let raf = 0;
    const tick = (now) => {
      raf = requestAnimationFrame(tick);
      if (state.stale && now - state.measuredAt > 90) measure(now);

      const reading = openRef.current;

      // --- which frame, if any, the cursor is dwelling near ---------------
      if (reading) {
        // Hold the frame being read so its card stays anchored to it.
        state.target = frames.find((f) => f.el === reading.el) || state.target;
        if (state.target && !state.target.rect) setOpen(null);
      } else {
        if (state.target && (!state.target.rect || distanceTo(state.target.rect, state.px, state.py) > LEAVE)) {
          state.target = null;
        }
        if (!state.target) {
          let best = null;
          let bestDistance = ENTER;
          for (const frame of frames) {
            if (!frame.rect) continue;
            const d = distanceTo(frame.rect, state.px, state.py);
            if (d < bestDistance) {
              bestDistance = d;
              best = frame;
            }
          }
          state.target = best;
        }
      }

      if (state.target?.rect) {
        const r = state.target.rect;
        // The top-right inside corner, like a note pinned to a photograph —
        // clamped so a frame at the edge of the screen still has one.
        state.anchor.x = Math.min(Math.max(r.right - 17, 30), window.innerWidth - 30);
        state.anchor.y = Math.min(Math.max(r.top + 17, 30), window.innerHeight - 30);
      }

      // --- how present they are ------------------------------------------
      const still = now - state.lastMove > STILL;
      if (still) {
        state.awake = false;
        state.wandered = 0;
      }
      const want = reading ? 1 : state.target ? 0.96 : state.awake ? 0.78 : 0;
      state.presence += (want - state.presence) * 0.055;

      // --- the specks -----------------------------------------------------
      const gathered = Boolean(state.target);
      for (let i = 0; i < SPECKS.length; i += 1) {
        const speck = SPECKS[i];
        const dot = state.trail[i];
        const el = dots.current[i];
        if (!el) continue;

        const baseX = gathered ? state.anchor.x : state.px;
        const baseY = gathered ? state.anchor.y : state.py;
        // Gathered, they draw in tight; loose, they trail wider.
        const radius = speck.orbit * (gathered ? 0.52 : 1);
        const angle = now * speck.spin + speck.phase;
        const ease = speck.ease * (gathered ? 1.45 : 1);

        dot.x += (baseX + Math.cos(angle) * radius - dot.x) * ease;
        dot.y += (baseY + Math.sin(angle * 1.19) * radius * 0.82 - dot.y) * ease;

        el.style.transform = `translate3d(${(dot.x - speck.size / 2).toFixed(2)}px, ${(
          dot.y -
          speck.size / 2
        ).toFixed(2)}px, 0)`;
        el.style.opacity = (state.presence * speck.alpha).toFixed(3);
      }

      // --- the clickable cluster, and the card it opens --------------------
      if (clusterEl.current) {
        clusterEl.current.style.transform = `translate3d(${(state.anchor.x - 17).toFixed(2)}px, ${(
          state.anchor.y - 17
        ).toFixed(2)}px, 0)`;
        clusterEl.current.style.opacity = (state.presence * (reading ? 0 : 1)).toFixed(3);
      }
      if (cardEl.current) {
        const width = cardEl.current.offsetWidth;
        const height = cardEl.current.offsetHeight;
        // Opens away from the nearest edge, so it is never half off-screen.
        const flip = state.anchor.x + 26 + width > window.innerWidth - 14;
        const x = flip ? state.anchor.x - 26 - width : state.anchor.x + 26;
        // 78px keeps it clear of the fixed nav rather than tucking under it.
        const y = Math.min(Math.max(state.anchor.y - 18, 78), Math.max(window.innerHeight - height - 14, 78));
        cardEl.current.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
      }

      // Mounting the cluster costs a render, so this is the one place the
      // loop talks to React — and only when the frame under it changes.
      const hot = reading ? null : state.target?.el || null;
      if (hot !== state.hotEl) {
        state.hotEl = hot;
        const note = hot ? annotationOf(hot) : null;
        setCluster(note ? { ...note, el: hot } : null);
      }
    };

    scan();
    raf = requestAnimationFrame(tick);

    // Photos arrive after the first paint, so the list is rebuilt when the
    // page changes shape — debounced, since this fires in bursts.
    let debounce = 0;
    const observer = new MutationObserver(() => {
      clearTimeout(debounce);
      debounce = setTimeout(scan, 220);
    });
    observer.observe(document.body, { childList: true, subtree: true });

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", markStale, { passive: true });
    window.addEventListener("resize", markStale);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(debounce);
      observer.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", markStale);
      window.removeEventListener("resize", markStale);
    };
  }, [active]);

  // Escape closes, and so does a click anywhere that is not the card.
  useEffect(() => {
    if (!open) return;
    const onKey = (event) => event.key === "Escape" && setOpen(null);
    const onDown = (event) => {
      if (!cardEl.current?.contains(event.target)) setOpen(null);
    };
    window.addEventListener("keydown", onKey);
    // Deferred, or the click that opened the card closes it again.
    const id = setTimeout(() => window.addEventListener("pointerdown", onDown), 0);
    return () => {
      clearTimeout(id);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  if (!active) return null;

  return (
    <div data-testid="bubbles" aria-hidden="true" className="pointer-events-none fixed inset-0 z-[70] overflow-hidden">
      {SPECKS.map((speck, i) => (
        <span
          key={i}
          ref={(el) => {
            dots.current[i] = el;
          }}
          className="absolute left-0 top-0 rounded-full"
          style={{
            width: speck.size,
            height: speck.size,
            opacity: 0,
            background: `radial-gradient(circle at 34% 30%, rgba(255,255,255,0.55), rgba(${speck.rgb}, 0.95) 62%)`,
            boxShadow: `0 0 6px rgba(${speck.rgb}, 0.35)`,
            willChange: "transform, opacity",
          }}
        />
      ))}

      {/* The only part that takes a click. It sits in this fixed layer rather
          than inside the frame, so it never swallows a click meant for the
          photo underneath. */}
      {cluster && (
        <button
          ref={clusterEl}
          data-testid="bubble-cluster"
          type="button"
          title="a thought about this"
          aria-label="reveal the note about this piece"
          onClick={() => setOpen(cluster)}
          className="pointer-events-auto absolute left-0 top-0 h-[34px] w-[34px] rounded-full"
          style={{ opacity: 0, willChange: "transform, opacity" }}
        />
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            ref={cardEl}
            data-testid="bubble-note"
            initial={{ opacity: 0, scale: 0.94, rotate: -3 }}
            animate={{ opacity: 1, scale: 1, rotate: -1.2 }}
            exit={{ opacity: 0, scale: 0.96, rotate: -3 }}
            transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
            className="tape pointer-events-auto absolute left-0 top-0 z-[95] max-w-[17rem] border border-ink/15 bg-cream p-5 shadow-[5px_5px_0px_#6B1226]"
            style={{ willChange: "transform" }}
          >
            {open.note && <p className="font-hand text-2xl leading-snug text-ink">{open.note}</p>}
            {open.title && (
              <p className={`font-serif italic text-lg text-wine ${open.note ? "mt-3" : ""}`}>{open.title}</p>
            )}
            {open.meta && (
              <p className="mt-1 font-sans text-[10px] uppercase tracking-[0.25em] text-smoke">{open.meta}</p>
            )}
            {open.href && (
              <a
                href={open.href}
                className="mt-3 inline-block font-sans text-[10px] uppercase tracking-[0.25em] text-burgundy underline decoration-pink underline-offset-4"
              >
                see the piece →
              </a>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Bubbles;
