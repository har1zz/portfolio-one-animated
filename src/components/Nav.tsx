"use client";
import { useEffect, useRef, useState } from "react";
import { BananaMark } from "./BananaMark";
import { TLink } from "./TLink";

const LINKS = [
  { href: "/#story", label: "Method" },
  { href: "/#work", label: "Work" },
  { href: "/#services", label: "Services" },
  { href: "/#contact", label: "Contact" },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const max = document.documentElement.scrollHeight - innerHeight;
        if (bar.current) bar.current.style.transform = `scaleX(${max > 0 ? Math.min(1, scrollY / max) : 0})`;
      });
    };
    addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <header className="nav">
        <div className="wrap nav-in">
          <TLink className="brand" href="/" aria-label="PixelateBanana, home">
            <BananaMark n={12} />
            <span>PixelateBanana</span>
          </TLink>
          <nav className="links" aria-label="Main">
            {LINKS.map((l) => (
              <TLink key={l.href} href={l.href}>
                {l.label}
              </TLink>
            ))}
          </nav>
          <div className="nav-r">
            <TLink className="btn btn-yellow btn-sm mag" href="/#contact">
              Start a project
            </TLink>
            <button
              className="menu-btn"
              aria-expanded={open}
              aria-controls="menu"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? "Close" : "Menu"}
            </button>
          </div>
        </div>
        <div id="progress" ref={bar} />
      </header>
      <nav id="menu" className={open ? "open" : ""} data-dark aria-label="Mobile">
        {LINKS.map((l) => (
          <TLink key={l.href} href={l.href} onClick={() => setOpen(false)}>
            {l.label}
          </TLink>
        ))}
      </nav>
    </>
  );
}
