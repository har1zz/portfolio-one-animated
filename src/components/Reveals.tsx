"use client";
import { useEffect } from "react";
import { initGsap, prefersReducedMotion } from "@/lib/gsap";

/** Scroll reveals for any `.rv` blocks and `.mk` masked headings on the page. */
export function Reveals() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const { gsap } = initGsap();
    const ctx = gsap.context(() => {
      document.querySelectorAll(".rv").forEach((el) =>
        gsap.from(el, { y: 34, opacity: 0, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 90%", once: true } }),
      );
      document.querySelectorAll(".mk").forEach((h) =>
        gsap.from(h.querySelectorAll(".ln>span"), {
          yPercent: 115, duration: 1.05, ease: "expo.out", stagger: 0.09,
          scrollTrigger: { trigger: h, start: "top 88%", once: true },
        }),
      );
    });
    const refresh = () => import("gsap/ScrollTrigger").then((m) => m.ScrollTrigger.refresh());
    document.fonts?.ready.then(refresh);
    return () => ctx.revert();
  }, []);
  return null;
}
