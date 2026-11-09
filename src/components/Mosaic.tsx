import type { Project } from "@/data/projects";
import { hash, rng } from "@/lib/pixels";

interface Props {
  project: Project;
  cols: number;
  rows: number;
  tag?: string;
}

/** Deterministic pixel mosaic used as a placeholder until real screenshots exist. */
export function Mosaic({ project: p, cols, rows, tag = "" }: Props) {
  const r = rng(hash(p.slug + tag));
  const [c0, c1, c2] = p.palette;
  const ph = r() * 6.28;
  const cx = cols * (0.25 + r() * 0.5);
  const cy = rows * (0.25 + r() * 0.5);
  const md = Math.hypot(cols, rows);
  const cells: { x: number; y: number; fill: string }[] = [];
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let v: number;
      switch (p.pattern) {
        case "bands":
          v = (Math.sin((x / cols) * 9 + (y / rows) * 4 + ph) + 1) / 2;
          break;
        case "radial":
          v = 1 - (Math.hypot(x - cx, y - cy) / md) * 2.3;
          break;
        case "steps":
          v = (((x + y * 1.3) / (cols + rows * 1.3)) * 2.4 + ph / 6.28) % 1;
          break;
        case "split":
          v = x / cols > 0.58 ? 0.12 + r() * 0.2 : 0.78 + r() * 0.2;
          break;
        default:
          v = r() * 0.7 + (x / cols) * 0.3;
      }
      v = Math.max(0, Math.min(1, v + (r() - 0.5) * 0.38));
      if (v > 0.74 && r() < 0.2) continue;
      const fill = v < 0.36 ? c0 : v < 0.7 ? c1 : c2;
      if (fill === c1) continue;
      cells.push({ x, y, fill });
    }
  }
  return (
    <svg
      viewBox={`0 0 ${cols} ${rows}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      shapeRendering="crispEdges"
    >
      <rect width={cols} height={rows} fill={c1} />
      {cells.map((c) => (
        <rect key={`${c.x}-${c.y}`} className="px" x={c.x} y={c.y} width={1.02} height={1.02} fill={c.fill} />
      ))}
    </svg>
  );
}
