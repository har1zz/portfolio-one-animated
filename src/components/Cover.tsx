import Image from "next/image";
import type { Project } from "@/data/projects";
import { Mosaic } from "./Mosaic";

interface Props {
  project: Project;
  cols?: number;
  rows?: number;
  tag?: string;
  label?: string;
  src?: string | null;
  priority?: boolean;
  sizes?: string;
}

/** Real screenshot when provided, generated pixel mosaic otherwise. */
export function Cover({ project, cols = 32, rows = 24, tag = "c", label = "Screenshot pending", src, priority, sizes }: Props) {
  const image = src === undefined ? project.image : src;
  return (
    <>
      {image ? (
        <Image
          src={image}
          alt={`${project.name} screenshot`}
          fill
          sizes={sizes ?? "(max-width: 760px) 100vw, 60vw"}
          priority={priority}
          style={{ objectFit: "cover" }}
        />
      ) : (
        <>
          <Mosaic project={project} cols={cols} rows={rows} tag={tag} />
          <span className="tag">{label}</span>
        </>
      )}
    </>
  );
}
