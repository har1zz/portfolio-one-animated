"use client";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

/** Title that slides up out of its mask once the page wipe has lifted. */
export function CaseTitle({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="display" id="caseTitle">
      <span className="ln">
        <motion.span initial={{ y: "112%" }} animate={{ y: 0 }} transition={{ duration: 1, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}>
          {children}
        </motion.span>
      </span>
    </h1>
  );
}

/** Fades sections in as they scroll into view. Content is visible without JS. */
export function CaseReveals() {
  useEffect(() => {
    const els = [...document.querySelectorAll<HTMLElement>(".cs-rv")];
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      els.forEach((el) => el.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      }),
      { rootMargin: "0px 0px -8% 0px" },
    );
    els.forEach((el) => {
      if (el.getBoundingClientRect().top < innerHeight) el.classList.add("in");
      else io.observe(el);
    });
    return () => io.disconnect();
  }, []);
  return null;
}

/** Horizontally scrolling gallery with pointer dragging on desktop. */
export function Gallery({ children, label }: { children: React.ReactNode; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const g = ref.current!;
    let down = false, sx = 0, sl = 0;
    const pd = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      down = true; sx = e.clientX; sl = g.scrollLeft;
      g.classList.add("dragging");
      g.setPointerCapture(e.pointerId);
    };
    const pm = (e: PointerEvent) => { if (down) g.scrollLeft = sl - (e.clientX - sx); };
    const up = () => { down = false; g.classList.remove("dragging"); };
    g.addEventListener("pointerdown", pd);
    g.addEventListener("pointermove", pm);
    g.addEventListener("pointerup", up);
    g.addEventListener("pointercancel", up);
    return () => {
      g.removeEventListener("pointerdown", pd);
      g.removeEventListener("pointermove", pm);
      g.removeEventListener("pointerup", up);
      g.removeEventListener("pointercancel", up);
    };
  }, []);
  return (
    <div className="gal" ref={ref} tabIndex={0} role="region" aria-label={label} data-cursor="drag">
      {children}
    </div>
  );
}
