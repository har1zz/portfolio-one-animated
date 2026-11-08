"use client";
import { useEffect, useRef } from "react";
import { rng } from "@/lib/pixels";

const ITEMS = ["Websites", "Web apps", "AI automation", "Workflows", "Brand identity", "UI/UX", "Software"];

/** Pixel dissolve edge into a ticker strip. */
export function Strip() {
  const cv = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = cv.current!;
    const draw = () => {
      const w = c.clientWidth, h = c.clientHeight, d = Math.min(devicePixelRatio || 1, 2);
      if (!w) return;
      c.width = w * d; c.height = h * d;
      const x = c.getContext("2d")!;
      x.setTransform(d, 0, 0, d, 0, 0);
      x.clearRect(0, 0, w, h);
      const cs = 14, cols = Math.ceil(w / cs), rows = Math.ceil(h / cs), r = rng(7);
      x.fillStyle = "#14120D";
      for (let i = 0; i < cols; i++)
        for (let j = 0; j < rows; j++) {
          const t = (j + 1) / rows;
          if (r() < Math.pow(t, 1.6) * 1.05) x.fillRect(i * cs, h - (rows - j) * cs + (rows * cs - h), cs - 1, cs - 1);
        }
    };
    draw();
    let t: ReturnType<typeof setTimeout>;
    const onResize = () => { clearTimeout(t); t = setTimeout(draw, 150); };
    addEventListener("resize", onResize);
    return () => removeEventListener("resize", onResize);
  }, []);
  const row = ITEMS.map((t) => <span key={t}>{t}</span>);
  return (
    <>
      <canvas className="edge" ref={cv} aria-hidden="true" />
      <div className="strip" aria-hidden="true">
        <div className="strip-in">{row}{row}{row}{row}</div>
      </div>
    </>
  );
}
