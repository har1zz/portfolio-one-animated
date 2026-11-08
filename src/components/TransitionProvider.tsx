"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { BananaMark } from "./BananaMark";
import { initGsap, prefersReducedMotion } from "@/lib/gsap";
import { rng } from "@/lib/pixels";

interface Ctx {
  navigate: (href: string) => void;
}
const TransitionCtx = createContext<Ctx>({ navigate: () => {} });
export const usePageTransition = () => useContext(TransitionCtx);

/** Pixel-grid wipe between routes, plus a short branded boot cover on the first visit of a session. */
export function TransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const wipeRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<HTMLDivElement>(null);
  const cells = useRef<HTMLElement[]>([]);
  const pending = useRef(false);
  const lastPath = useRef(pathname);

  const build = useCallback(() => {
    const el = wipeRef.current;
    if (!el) return;
    const cols = Math.ceil(window.innerWidth / 72);
    const rows = Math.ceil(window.innerHeight / 72);
    el.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    el.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
    el.replaceChildren();
    const r = rng(3);
    for (let i = 0; i < cols * rows; i++) {
      const d = document.createElement("div");
      d.className = "c" + (r() < 0.1 ? " y" : "");
      el.appendChild(d);
    }
    cells.current = [...el.children] as HTMLElement[];
  }, []);

  const wipeIn = useCallback(() => {
    const { gsap } = initGsap();
    const el = wipeRef.current;
    if (!el || prefersReducedMotion()) return Promise.resolve();
    build();
    el.classList.add("cover");
    return new Promise<void>((res) => {
      gsap.fromTo(
        cells.current,
        { scale: 0 },
        { scale: 1.04, duration: 0.2, ease: "power2.out", stagger: { amount: 0.32, from: "random" }, onComplete: () => res() },
      );
    });
  }, [build]);

  const wipeOut = useCallback(() => {
    const { gsap } = initGsap();
    const el = wipeRef.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      el.classList.remove("cover");
      return;
    }
    gsap.to(cells.current, {
      scale: 0,
      duration: 0.2,
      ease: "power2.in",
      stagger: { amount: 0.32, from: "random" },
      onComplete: () => el.classList.remove("cover"),
    });
  }, []);

  const navigate = useCallback(
    async (href: string) => {
      const url = new URL(href, window.location.href);
      if (url.pathname === window.location.pathname) {
        // same page: just scroll to the hash
        const target = url.hash ? document.getElementById(url.hash.slice(1)) : null;
        if (url.hash) history.pushState(null, "", url.hash);
        if (target) target.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth" });
        else window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      if (pending.current) return;
      pending.current = true;
      await wipeIn();
      router.push(href);
    },
    [router, wipeIn],
  );

  // When the new route has rendered, lift the wipe.
  useEffect(() => {
    if (pathname !== lastPath.current) {
      lastPath.current = pathname;
      if (pending.current) {
        pending.current = false;
        requestAnimationFrame(() => wipeOut());
      }
    }
  }, [pathname, wipeOut]);

  // Boot cover, once per session.
  useEffect(() => {
    const el = wipeRef.current;
    const mark = markRef.current;
    if (!el) return;
    let seen = false;
    try {
      seen = sessionStorage.getItem("pb-boot") === "1";
      sessionStorage.setItem("pb-boot", "1");
    } catch {}
    const finish = () => {
      el.classList.remove("boot", "cover");
      el.style.animation = "none";
      mark?.remove();
      window.dispatchEvent(new Event("pb:ready"));
    };
    build();
    if (seen || prefersReducedMotion()) {
      finish();
      return;
    }
    const { gsap } = initGsap();
    gsap.set(cells.current, { scale: 1.04 });
    el.classList.remove("boot");
    el.classList.add("cover");
    const rects = mark ? [...mark.querySelectorAll("rect")] : [];
    gsap.fromTo(rects, { opacity: 0 }, { opacity: 1, duration: 0.05, stagger: { amount: 0.55, from: "random" } });
    const t = gsap.delayedCall(0.85, () => {
      if (mark) gsap.to(mark, { opacity: 0, duration: 0.2 });
      gsap.to(cells.current, {
        scale: 0,
        duration: 0.22,
        ease: "power2.in",
        stagger: { amount: 0.4, from: "random" },
        onComplete: finish,
      });
    });
    return () => {
      t.kill();
    };
  }, [build]);

  const value = useMemo(() => ({ navigate }), [navigate]);
  return (
    <TransitionCtx.Provider value={value}>
      <div id="pxwipe" ref={wipeRef} className="boot" aria-hidden="true" />
      <div id="bootmark" ref={markRef} aria-hidden="true">
        <BananaMark n={14} />
      </div>
      {children}
    </TransitionCtx.Provider>
  );
}
