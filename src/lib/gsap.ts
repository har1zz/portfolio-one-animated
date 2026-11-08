"use client";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let ready = false;
export function initGsap() {
  if (!ready && typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
    ready = true;
  }
  return { gsap, ScrollTrigger };
}

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
export const hasFinePointer = () =>
  typeof window !== "undefined" && window.matchMedia("(hover:hover) and (pointer:fine)").matches;
