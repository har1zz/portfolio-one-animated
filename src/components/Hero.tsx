"use client";
import { useEffect, useRef } from "react";
import { TLink } from "./TLink";
import { initGsap, hasFinePointer, prefersReducedMotion } from "@/lib/gsap";
import { bananaCells, SHADE } from "@/lib/pixels";

export const AVAILABILITY = "Open for new projects";
const LINES = ["We design,", "build &", "automate."];

function HeroCanvas() {
  const cv = useRef<HTMLCanvasElement>(null);
  const tilt = useRef<HTMLDivElement>(null);
  const coords = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const canvas = cv.current!;
    const ctx = canvas.getContext("2d")!;
    const N = 40;
    const cells = bananaCells(N).map((c) => ({ ...c, ox: 0, oy: 0, vx: 0, vy: 0 }));
    const reduce = prefersReducedMotion();
    let W = 0, cs = 0, mx = -999, my = -999, vis = true, tx = 0, ty = 0, frame = 0, raf = 0;

    const draw = () => {
      ctx.clearRect(0, 0, W, W);
      ctx.fillStyle = "rgba(20,18,13,.22)";
      for (let i = 0; i <= N; i += 4) for (let j = 0; j <= N; j += 4) ctx.fillRect(i * cs - 1, j * cs - 1, 2, 2);
      const R = cs * 5.5;
      for (const c of cells) {
        const bx = c.i * cs, by = c.j * cs;
        if (!reduce) {
          const dx = bx + cs / 2 + c.ox - mx, dy = by + cs / 2 + c.oy - my, d = Math.hypot(dx, dy);
          if (d < R && d > 0.01) {
            const f = Math.pow(1 - d / R, 2) * 3.2;
            c.vx += (dx / d) * f;
            c.vy += (dy / d) * f;
          }
          c.vx += -c.ox * 0.07; c.vy += -c.oy * 0.07;
          c.vx *= 0.84; c.vy *= 0.84;
          c.ox += c.vx; c.oy += c.vy;
        }
        const away = Math.hypot(c.ox, c.oy) / cs;
        ctx.fillStyle = away > 1.4 && c.sh < 3 ? "#14120D" : SHADE[c.sh];
        const s = cs - 1 + (away > 1.4 ? -0.6 : 0);
        ctx.fillRect(bx + c.ox + 0.5, by + c.oy + 0.5, s, s);
      }
    };
    const size = () => {
      const r = canvas.getBoundingClientRect(), d = Math.min(devicePixelRatio || 1, 2);
      W = r.width;
      canvas.width = W * d; canvas.height = W * d;
      cs = W / N;
      ctx.setTransform(d, 0, 0, d, 0, 0);
      draw();
    };
    size();
    addEventListener("resize", size);
    if (reduce) return () => removeEventListener("resize", size);

    const io = new IntersectionObserver((e) => (vis = e[0].isIntersecting));
    io.observe(canvas);
    const loop = () => {
      if (vis) {
        draw();
        tx += ((mx < 0 ? 0 : (mx / W - 0.5) * 10) - tx) * 0.08;
        ty += ((my < 0 ? 0 : (my / W - 0.5) * -10) - ty) * 0.08;
        if (tilt.current) tilt.current.style.transform = `rotateX(${ty.toFixed(2)}deg) rotateY(${tx.toFixed(2)}deg)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    const move = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const r = canvas.getBoundingClientRect();
      mx = e.clientX - r.left; my = e.clientY - r.top;
      if (mx < -60 || my < -60 || mx > W + 60 || my > W + 60) {
        mx = my = -999;
        if (coords.current) coords.current.textContent = "x 000 y 000";
      } else if (!(++frame % 3) && coords.current) {
        coords.current.textContent = `x ${String(Math.round(mx)).padStart(3, "0")} y ${String(Math.round(my)).padStart(3, "0")}`;
      }
    };
    const burst = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mx = e.clientX - r.left; my = e.clientY - r.top;
      for (const c of cells) {
        const dx = c.i * cs - mx, dy = c.j * cs - my, d = Math.hypot(dx, dy) || 1;
        if (d < cs * 10) { c.vx += (dx / d) * 12; c.vy += (dy / d) * 12; }
      }
    };
    addEventListener("pointermove", move, { passive: true });
    canvas.addEventListener("pointerdown", burst);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      removeEventListener("resize", size);
      removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerdown", burst);
    };
  }, []);

  return (
    <div className="hero-vis" id="heroVis">
      <div className="hero-tilt" ref={tilt}>
        <canvas
          ref={cv}
          id="heroCanvas"
          role="img"
          aria-label="A banana built from square pixels that scatter and settle as the pointer passes over them"
        />
      </div>
      <span className="mono corner">Grid 40 × 40</span>
      <span className="mono coords" ref={coords} aria-hidden="true">x 000 y 000</span>
    </div>
  );
}

export function Hero() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const { gsap } = initGsap();
    const el = root.current!;
    const reduce = prefersReducedMotion();
    const lines = el.querySelectorAll(".ln>span");
    const fades = el.querySelectorAll(".avail, .lede, .cta-row");
    const vis = el.querySelector(".hero-tilt");
    if (!reduce) {
      gsap.set(lines, { yPercent: 112 });
      gsap.set(fades, { opacity: 0 });
      gsap.set(vis, { opacity: 0 });
    }
    const intro = () => {
      if (reduce) return;
      gsap.fromTo(lines, { yPercent: 112 }, { yPercent: 0, duration: 1.05, ease: "expo.out", stagger: 0.09 });
      gsap.fromTo(fades, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", stagger: 0.1, delay: 0.35 });
      gsap.fromTo(vis, { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.1, ease: "expo.out", delay: 0.15 });
    };
    // Boot cover may still be running: wait for its signal, with a safety timeout.
    const boot = document.getElementById("pxwipe");
    let started = false;
    const go = () => { if (!started) { started = true; intro(); } };
    if (!boot || !boot.classList.contains("cover") && !boot.classList.contains("boot")) go();
    else {
      addEventListener("pb:ready", go, { once: true });
      setTimeout(go, 3000);
    }
    return () => removeEventListener("pb:ready", go);
  }, []);

  // Letters widen near the pointer (desktop only).
  useEffect(() => {
    if (!hasFinePointer() || prefersReducedMotion()) return;
    const h1 = root.current!.querySelector<HTMLElement>("h1")!;
    const lts = [...h1.querySelectorAll<HTMLElement>(".lt")];
    let raf = 0, px = 0, py = 0;
    const upd = () => {
      raf = 0;
      for (const l of lts) {
        const r = l.getBoundingClientRect();
        const dx = px - (r.left + r.width / 2), dy = py - (r.top + r.height / 2);
        l.style.fontVariationSettings = `"wdth" ${Math.round(72 + 48 * Math.exp(-(dx * dx + dy * dy) / (2 * 130 * 130)))}`;
      }
    };
    const move = (e: PointerEvent) => { px = e.clientX; py = e.clientY; if (!raf) raf = requestAnimationFrame(upd); };
    const leave = () => lts.forEach((l) => (l.style.fontVariationSettings = ""));
    h1.addEventListener("pointermove", move);
    h1.addEventListener("pointerleave", leave);
    return () => { h1.removeEventListener("pointermove", move); h1.removeEventListener("pointerleave", leave); };
  }, []);

  return (
    <section id="top" className="hero" ref={root}>
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <p className="avail mono">
            <i />
            <span>{AVAILABILITY}</span>
            <span>·</span>
            <span>Karachi <Clock /> PKT</span>
          </p>
          <h1 className="display" aria-label="We design, build and automate.">
            {LINES.map((line, k) => (
              <span className="ln" key={line}>
                <span>
                  {k === 2 ? <em>{letters(line)}</em> : letters(line)}
                </span>
              </span>
            ))}
          </h1>
          <p className="lede">Websites, apps, AI workflows and brands. Pixel-perfect and peel-fast.</p>
          <div className="cta-row">
            <TLink className="btn btn-yellow mag" href="/#contact">
              Start a project <span aria-hidden="true">→</span>
            </TLink>
            <TLink className="btn btn-line mag" href="/#work">
              Explore our work
            </TLink>
          </div>
        </div>
        <HeroCanvas />
      </div>
    </section>
  );
}

function letters(text: string) {
  return [...text].map((ch, i) => (
    <span className="lt" aria-hidden="true" key={i}>{ch}</span>
  ));
}

function Clock() {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Karachi", hour: "2-digit", minute: "2-digit", hour12: false });
    const tick = () => { if (ref.current) ref.current.textContent = fmt.format(new Date()); };
    tick();
    const t = setInterval(tick, 20000);
    return () => clearInterval(t);
  }, []);
  return <span ref={ref} suppressHydrationWarning>--:--</span>;
}
