"use client";
import { useEffect, useState } from "react";
import { TLink } from "./TLink";

const SECTIONS = [
  ["top", "Intro"], ["story", "Method"], ["work", "Work"], ["services", "Services"], ["about", "Studio"], ["contact", "Contact"],
] as const;

export function Rail() {
  const [on, setOn] = useState("top");
  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setOn(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    SECTIONS.forEach(([id]) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);
  return (
    <nav className="rail" aria-label="Sections">
      {SECTIONS.map(([id, label]) => (
        <TLink key={id} href={`/#${id}`} className={on === id ? "on" : ""}>
          <span>{label}</span>
          <b />
        </TLink>
      ))}
    </nav>
  );
}
