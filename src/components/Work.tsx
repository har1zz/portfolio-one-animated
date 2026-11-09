"use client";
import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CATEGORIES, PROJECTS, type Project } from "@/data/projects";
import { Cover } from "./Cover";
import { TLink } from "./TLink";

type Filter = "All" | (typeof CATEGORIES)[number];

function Card({ project, slot }: { project: Project; slot: number }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const dim = (on: boolean) => {
    if (!window.matchMedia("(hover:hover)").matches) return;
    ref.current?.querySelectorAll(".px").forEach((r) => r.classList.toggle("dim", on && Math.random() < 0.28));
  };
  return (
    <motion.div
      layout="position"
      className={`proj-wrap slot-${slot % 6}`}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.5, ease: [0.2, 0.7, 0.1, 1] }}
    >
      <TLink
        ref={ref}
        href={`/work/${project.slug}`}
        className="proj"
        data-cursor="view"
        onMouseEnter={() => dim(true)}
        onMouseLeave={() => dim(false)}
      >
        <div className="cover">
          <Cover project={project} cols={32} rows={24} tag="c" />
          <span className="go" aria-hidden="true">View →</span>
        </div>
        <div className="proj-meta">
          <h3>{project.name}</h3>
          <div className="proj-side">
            <span className="mono">{project.kind}</span>
            <span className="mono proj-cats">{project.categories.join(" / ")}</span>
          </div>
        </div>
      </TLink>
    </motion.div>
  );
}

export function Work() {
  const [filter, setFilter] = useState<Filter>("All");
  const shown = PROJECTS.filter((p) => filter === "All" || p.categories.includes(filter));
  const options: Filter[] = ["All", ...CATEGORIES];
  const count = (c: Filter) => (c === "All" ? PROJECTS.length : PROJECTS.filter((p) => p.categories.includes(c)).length);

  return (
    <section id="work" className="sec" aria-labelledby="workH">
      <div className="wrap">
        <div className="work-head">
          <div>
            <p className="label rv">Selected work</p>
            <h2 className="display h2 mk" id="workH" style={{ marginTop: 16 }}>
              <span className="ln"><span>Things we&apos;ve</span></span>
              <span className="ln"><span>made, so far.</span></span>
            </h2>
          </div>
          <p className="sd rv">
            A mix of client-style builds, internal tools and experiments. Screenshots are being added; tiles without
            one show a generated placeholder.
          </p>
        </div>
        <div className="filters rv" role="group" aria-label="Filter projects by category">
          {options.map((c) => (
            <button
              key={c}
              type="button"
              className="flt"
              data-n={String(count(c)).padStart(2, "0")}
              aria-pressed={filter === c}
              onClick={() => setFilter(c)}
            >
              {c}
            </button>
          ))}
        </div>
        <motion.div layout className="work-grid">
          <AnimatePresence mode="popLayout">
            {shown.map((p, i) => (
              <Card key={p.slug} project={p} slot={i} />
            ))}
          </AnimatePresence>
          {shown.length === 0 && (
            <div className="empty">
              <p className="label">Nothing here yet</p>
              <p style={{ marginTop: 12 }}>
                No project is filed under this category. Add one in <code>src/data/projects.ts</code> and it appears here.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
