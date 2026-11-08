import { bananaCells, SHADE } from "@/lib/pixels";

export function BananaMark({ n = 12, className }: { n?: number; className?: string }) {
  return (
    <svg viewBox={`0 0 ${n} ${n}`} className={className} shapeRendering="crispEdges" aria-hidden="true">
      {bananaCells(n).map((k) => (
        <rect key={`${k.i}-${k.j}`} x={k.i} y={k.j} width={1.04} height={1.04} fill={SHADE[k.sh]} />
      ))}
    </svg>
  );
}
