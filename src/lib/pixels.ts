export function hash(s: string) {
  let h = 2166136261;
  for (const c of s) {
    h ^= c.charCodeAt(0);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const SHADE = ["#E3B500", "#FFE135", "#FFF27A", "#14120D", "#7A5A00"] as const;

export interface BananaCell {
  i: number;
  j: number;
  /** index into SHADE */
  sh: number;
}

const cache = new Map<number, BananaCell[]>();

/** A crescent (one circle minus a shifted circle) sampled onto an n x n grid. */
export function bananaCells(n: number): BananaCell[] {
  const hit = cache.get(n);
  if (hit) return hit;
  const out: BananaCell[] = [];
  const rot = -0.42;
  const c = Math.cos(rot);
  const s = Math.sin(rot);
  for (let j = 0; j < n; j++) {
    for (let i = 0; i < n; i++) {
      const x = (i + 0.5) / n - 0.5;
      const y = (j + 0.5) / n - 0.5;
      const u = x * c + y * s;
      const v = -x * s + y * c + 0.14;
      const dA = Math.hypot(u, v - 0.03);
      const dB = Math.hypot(u, v + 0.19);
      if (dA <= 0.47 && dB > 0.4) {
        let sh = 1;
        if (dA > 0.43) sh = 0;
        else if (dB < 0.45) sh = 2;
        if (u > 0.385) sh = 3;
        else if (u < -0.385) sh = 4;
        out.push({ i, j, sh });
      }
    }
  }
  cache.set(n, out);
  return out;
}
