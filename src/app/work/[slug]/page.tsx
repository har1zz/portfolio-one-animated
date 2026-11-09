import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CaseReveals, CaseTitle, Gallery } from "@/components/CaseClient";
import { Cover } from "@/components/Cover";
import { Mosaic } from "@/components/Mosaic";
import { TLink } from "@/components/TLink";
import { PROJECTS, getProject, nextProject } from "@/data/projects";

export const dynamicParams = false;
export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = getProject((await params).slug);
  return p ? { title: p.name, description: p.intro } : {};
}

const Todo = ({ children }: { children: React.ReactNode }) => <span className="todo">To add: {children}</span>;

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="cs-sec cs-rv">
      <div className="wrap cs-grid">
        <h2 className="cs-label">{label}</h2>
        <div className="cs-body">{children}</div>
      </div>
    </section>
  );
}

export default async function CasePage({ params }: { params: Promise<{ slug: string }> }) {
  const p = getProject((await params).slug);
  if (!p) notFound();
  const next = nextProject(p.slug);
  const index = PROJECTS.indexOf(p);

  return (
    <article className="case-wrap">
      <header className="wrap case-head">
        <TLink href="/#work" className="back mag">← Back to work</TLink>
        <p className="label" style={{ marginTop: 18 }}>{p.categories.join(" / ")}</p>
        <CaseTitle>{p.name}</CaseTitle>
        <p className="lead">{p.intro}</p>
        <dl className="meta-grid">
          <div><dt>Type</dt><dd>{p.kind}</dd></div>
          <div><dt>Status</dt><dd>{p.status}</dd></div>
          <div>
            <dt>Stack</dt>
            <dd>{p.stack.join(", ")} {p.stackIncomplete && <Todo>full stack</Todo>}</dd>
          </div>
        </dl>
        <p className="mono" style={{ marginTop: 16, color: "var(--muted)" }}>{index + 1} / {PROJECTS.length}</p>
      </header>

      <div className="wrap case-hero cs-rv">
        <div className="cover">
          <Cover project={p} cols={60} rows={26} tag="h" label="Hero screenshot pending" priority sizes="100vw" />
        </div>
      </div>

      <Section label="Challenge"><p>{p.challenge}</p></Section>
      <Section label="Creative direction">
        {p.direction ? <p>{p.direction}</p> : <p><Todo>a few lines on the look and feel</Todo></p>}
      </Section>
      <Section label="Development process"><ul>{p.process.map((x) => <li key={x}>{x}</li>)}</ul></Section>
      <Section label="Technologies">
        <p>{p.stack.join(" · ")}</p>
        {p.stackIncomplete && <p style={{ marginTop: 8 }}><Todo>remaining stack</Todo></p>}
      </Section>
      <Section label="Final implementation"><p>{p.implementation}</p></Section>

      <section className="gal-sec cs-rv">
        <div className="wrap" style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
          <h2 className="cs-label">Visual gallery</h2>
          <span className="mono" style={{ color: "var(--muted)" }}>Drag or scroll →</span>
        </div>
        <Gallery label="Project gallery, scrolls horizontally">
          {p.gallery.length
            ? p.gallery.map((src, k) => (
                <figure key={src}>
                  <div className="cover">
                    <Image src={src} alt={`${p.name} screenshot ${k + 1}`} fill sizes="(max-width: 760px) 80vw, 760px" style={{ objectFit: "cover" }} />
                  </div>
                  <figcaption>{p.name} / {String(k + 1).padStart(2, "0")}</figcaption>
                </figure>
              ))
            : [1, 2, 3, 4].map((k) => (
                <figure key={k}>
                  <div className="cover">
                    <Mosaic project={p} cols={24} rows={15} tag={`g${k}`} />
                    <span className="tag">Screenshot {String(k).padStart(2, "0")} pending</span>
                  </div>
                  <figcaption>{p.name} / {String(k).padStart(2, "0")}</figcaption>
                </figure>
              ))}
        </Gallery>
      </section>

      <Section label="Outcomes">
        {p.outcome ? <p>{p.outcome}</p> : <p><Todo>a real result: a metric, a quote, or what changed for the client</Todo></p>}
      </Section>

      <TLink href={`/work/${next.slug}`} className="next" data-dark data-cursor="view">
        <div className="wrap">
          <p className="label">Next project</p>
          <p className="display">{next.name}</p>
        </div>
      </TLink>
      <CaseReveals />
    </article>
  );
}
