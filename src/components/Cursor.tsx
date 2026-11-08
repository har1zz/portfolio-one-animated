"use client";
import { useEffect, useRef } from "react";
import { hasFinePointer, prefersReducedMotion } from "@/lib/gsap";

/** Square cursor with context labels, plus magnetic buttons. Desktop pointers only. */
export function Cursor() {
  const el = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!hasFinePointer() || prefersReducedMotion()) return;
    const node = el.current!;
    const html = document.documentElement;
    html.classList.add("has-cursor");
    let x = -100, y = -100, tx = -100, ty = -100, run = false;
    let mag: HTMLElement | null = null;

    const loop = () => {
      x += (tx - x) * 0.24;
      y += (ty - y) * 0.24;
      node.style.transform = `translate3d(${x}px,${y}px,0) translate(-50%,-50%)`;
      if (Math.abs(tx - x) < 0.1 && Math.abs(ty - y) < 0.1) {
        run = false;
        return;
      }
      requestAnimationFrame(loop);
    };
    const move = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      tx = e.clientX;
      ty = e.clientY;
      node.style.opacity = "1";
      if (!run) {
        run = true;
        requestAnimationFrame(loop);
      }
      const m = (e.target as Element | null)?.closest?.<HTMLElement>(".mag") ?? null;
      if (mag && mag !== m) mag.style.transform = "";
      mag = m;
      if (m) {
        const r = m.getBoundingClientRect();
        m.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.2}px,${(e.clientY - r.top - r.height / 2) * 0.3}px)`;
      }
    };
    const over = (e: PointerEvent) => {
      const t = e.target;
      if (!(t instanceof Element)) return;
      node.className = "";
      if (t.closest("input:not([type=radio]),textarea,select")) {
        node.classList.add("native");
        return;
      }
      const c = t.closest<HTMLElement>("[data-cursor]")?.dataset.cursor;
      if (c === "view") {
        node.classList.add("view");
        if (label.current) label.current.textContent = "View project";
      } else if (c === "drag") {
        node.classList.add("drag");
        if (label.current) label.current.textContent = "Drag";
      } else if (t.closest("a,button,label,.chip,[role=button]")) node.classList.add("link");
      if (t.closest("[data-dark]")) node.classList.add("dark");
    };
    const down = () => node.classList.add("down");
    const up = () => node.classList.remove("down");
    const leave = () => (node.style.opacity = "0");

    addEventListener("pointermove", move, { passive: true });
    addEventListener("pointerover", over);
    addEventListener("pointerdown", down);
    addEventListener("pointerup", up);
    document.addEventListener("mouseleave", leave);
    return () => {
      html.classList.remove("has-cursor");
      removeEventListener("pointermove", move);
      removeEventListener("pointerover", over);
      removeEventListener("pointerdown", down);
      removeEventListener("pointerup", up);
      document.removeEventListener("mouseleave", leave);
    };
  }, []);

  return (
    <div id="cursor" ref={el} aria-hidden="true">
      <span ref={label} />
    </div>
  );
}
