"use client";
import { useEffect, useRef } from "react";
import { initGsap, prefersReducedMotion } from "@/lib/gsap";
import { bananaCells, SHADE } from "@/lib/pixels";

const mono = "IBM Plex Mono, monospace";

function Banana({ n, cell, id }: { n: number; cell: number; id?: string }) {
  return (
    <g id={id}>
      {bananaCells(n).map((k) => (
        <rect key={`${k.i}-${k.j}`} x={k.i * cell} y={k.j * cell} width={cell + 0.4} height={cell + 0.4} fill={SHADE[k.sh]} />
      ))}
    </g>
  );
}

export function Story() {
  const root = useRef<HTMLElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const fill = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const { gsap, ScrollTrigger } = initGsap();
    const rootEl = root.current!;
    const pinEl = pin.current!;
    const q = <T extends Element = Element>(s: string, c: ParentNode = rootEl) => [...c.querySelectorAll<T>(s)];
    const ctx = gsap.context(() => {
      const [s1, s2, s3] = q<HTMLElement>(".stage", pinEl);
      const hud = q(".hud-in span[data-h]");
      const navh = document.querySelector<HTMLElement>(".nav")?.offsetHeight ?? 56;
      document.documentElement.style.setProperty("--navh", navh + "px");
      rootEl.classList.add("js-pin");

      gsap.set([s2, s3], { clipPath: "inset(100% 0% 0% 0%)" });
      gsap.set(".dr", { strokeDasharray: 1, strokeDashoffset: 1 });
      gsap.set(".sw", { scale: 0, transformBox: "fill-box", transformOrigin: "50% 50%" });
      gsap.set(".ty", { opacity: 0 });
      gsap.set("#dBan rect", { opacity: 0 });
      gsap.set(".blk", { y: 36, opacity: 0 });
      gsap.set(".cp", { opacity: 0, y: 30 });
      gsap.set(".cl", { opacity: 0 });
      gsap.set(".nd rect,.nd text", { opacity: 0 });
      gsap.set(".pulses", { opacity: 0 });
      const c2 = s2.querySelector(".st-copy"), v2 = s2.querySelector(".st-vis");
      const c3 = s3.querySelector(".st-copy"), v3 = s3.querySelector(".st-vis");
      gsap.set([c2, c3, v2, v3], { opacity: 0, y: 40 });

      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        scrollTrigger: {
          trigger: rootEl,
          start: () => "top " + navh + "px",
          end: "+=320%",
          pin: pinEl,
          scrub: 0.55,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = self.progress, i = p < 0.3 ? 0 : p < 0.66 ? 1 : 2;
            hud.forEach((h, k) => h.classList.toggle("on", k === i));
            if (fill.current) fill.current.style.transform = `scaleX(${p})`;
            pinEl.style.setProperty("--hud", i === 1 ? "#F3EEE1" : "#14120D");
          },
        },
      });
      tl.to(".s-design .dr", { strokeDashoffset: 0, duration: 1.2, stagger: 0.15 }, 0)
        .to(".s-design .ty", { opacity: 1, duration: 0.5, stagger: 0.12 }, 0.5)
        .to(".s-design .sw", { scale: 1, duration: 0.5, stagger: 0.12, ease: "back.out(2)" }, 0.6)
        .to("#dBan rect", { opacity: 1, duration: 0.1, stagger: { amount: 0.9, from: "random" } }, 0.7)
        .to(s2, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.9 }, 2)
        .to([c2, v2], { opacity: 1, y: 0, duration: 0.8, stagger: 0.1 }, 2.5)
        .to(".blk", { y: 0, opacity: 1, duration: 0.6, stagger: 0.18 }, 2.9)
        .to(".cp", { opacity: 1, y: 0, duration: 0.5 }, 3.6)
        .to(".cl", { opacity: 1, duration: 0.2, stagger: 0.14 }, 3.8)
        .to(s3, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.9 }, 5)
        .to([c3, v3], { opacity: 1, y: 0, duration: 0.8, stagger: 0.1 }, 5.5)
        .to(".nd rect,.nd text", { opacity: 1, duration: 0.3, stagger: 0.1 }, 5.9)
        .to(".s-auto .dr", { strokeDashoffset: 0, duration: 0.7, stagger: 0.12 }, 6.2)
        .to(".pulses", { opacity: 1, duration: 0.3 }, 7)
        .to({}, { duration: 0.8 }, 7.2);
      void s1;
      void ScrollTrigger;
    }, rootEl);
    return () => {
      ctx.revert();
      rootEl.classList.remove("js-pin");
    };
  }, []);

  return (
    <section id="story" className="story" ref={root} aria-labelledby="storyH">
      <h2 id="storyH" className="sr-only" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>
        Design, build, automate
      </h2>
      <div className="story-pin" ref={pin}>
        <div className="story-hud" aria-hidden="true">
          <div className="wrap hud-in">
            <span data-h="0" className="on">Design</span>
            <span data-h="1">Build</span>
            <span data-h="2">Automate</span>
            <div className="hud-bar"><i ref={fill} /></div>
          </div>
        </div>

        <article className="stage s-design">
          <div className="wrap stage-in">
            <div className="st-copy">
              <p className="label">Stage one</p>
              <h2 className="display">Design</h2>
              <p className="sd">Type, grid, colour and a point of view, settled before anyone writes a line of code.</p>
              <ul className="tags"><li>Brand identity</li><li>UI/UX</li><li>Design systems</li><li>Creative direction</li></ul>
            </div>
            <figure className="st-vis" style={{ margin: 0 }}>
              <svg viewBox="0 0 480 360" role="img" aria-label="Poster layout with guides, a type specimen, three colour swatches and a pixel banana">
                <path className="dr" pathLength={1} d="M40 24H440V336H40Z" fill="none" stroke="#14120D" strokeWidth="1.8" />
                <path className="dr" pathLength={1} d="M120 24V336M360 24V336M40 110H440M40 270H440" fill="none" stroke="#E3B500" strokeWidth="1.4" />
                <path className="dr" pathLength={1} d="M40 10V24M440 10V24M40 336V350M440 336V350M26 24H40M440 24H454M26 336H40M440 336H454" fill="none" stroke="#14120D" strokeWidth="1.5" />
                <text className="ty" x="58" y="246" fontFamily="Anybody,Impact,sans-serif" fontWeight="800" fontSize="150" style={{ fontVariationSettings: "'wdth' 70" }} fill="#14120D">Aa</text>
                <rect className="sw" x="270" y="46" width="52" height="52" fill="#FFE135" stroke="#14120D" strokeWidth="1.8" />
                <rect className="sw" x="328" y="46" width="52" height="52" fill="#14120D" />
                <rect className="sw" x="386" y="46" width="42" height="52" fill="#F3EEE1" stroke="#14120D" strokeWidth="1.8" />
                <text className="ty" x="270" y="116" fontFamily={mono} fontSize="10" fill="#14120D">#FFE135 · #14120D · #F3EEE1</text>
                <g transform="translate(262 140)"><Banana n={14} cell={8} id="dBan" /></g>
                <text className="ty" x="58" y="296" fontFamily={mono} fontSize="10.5" fill="#14120D">wdth 70 to 150 / wght 800</text>
                <text className="ty" x="58" y="314" fontFamily={mono} fontSize="10.5" fill="#14120D">12 columns / 24 gutter</text>
              </svg>
              <figcaption>Poster sketch: guides, type, palette, mark</figcaption>
            </figure>
          </div>
        </article>

        <article className="stage s-build" data-dark>
          <div className="wrap stage-in">
            <div className="st-copy">
              <p className="label">Stage two</p>
              <h2 className="display">Build</h2>
              <p className="sd">The same layout, now as components, routes and data. Fast, accessible, and ready for someone else to edit.</p>
              <ul className="tags"><li>Custom websites</li><li>Web applications</li><li>E-commerce</li><li>Landing pages</li></ul>
            </div>
            <figure className="st-vis" style={{ margin: 0 }}>
              <svg viewBox="0 0 480 360" role="img" aria-label="A browser window whose layout assembles block by block, with a code panel in front">
                <path d="M40 24H440V262H40Z" fill="none" stroke="#F3EEE1" strokeWidth="1.8" />
                <path d="M40 46H440" stroke="#F3EEE1" strokeWidth="1.2" />
                <rect x="52" y="31" width="8" height="8" fill="#FFE135" /><rect x="66" y="31" width="8" height="8" fill="#F3EEE1" /><rect x="80" y="31" width="8" height="8" fill="#F3EEE1" opacity=".5" />
                <rect className="blk" x="56" y="58" width="368" height="18" fill="#F3EEE1" opacity=".9" />
                <rect className="blk" x="56" y="86" width="368" height="76" fill="#FFE135" />
                <rect className="blk" x="56" y="174" width="114" height="76" fill="#F3EEE1" opacity=".85" />
                <rect className="blk" x="183" y="174" width="114" height="76" fill="#F3EEE1" opacity=".85" />
                <rect className="blk" x="310" y="174" width="114" height="76" fill="#F3EEE1" opacity=".85" />
                <g className="cp">
                  <rect x="130" y="208" width="318" height="136" fill="#1E1B14" stroke="#FFE135" strokeWidth="1.5" />
                  <g fontFamily={mono} fontSize="11" fill="#F3EEE1">
                    <text className="cl" x="146" y="232">export default function Work() {"{"}</text>
                    <text className="cl" x="146" y="250">{"  return ("}</text>
                    <text className="cl" x="146" y="268">{"    <Grid items={projects}>"}</text>
                    <text className="cl" x="146" y="286">{"      {p => <Card {...p} />}"}</text>
                    <text className="cl" x="146" y="304">{"    </Grid>"}</text>
                    <text className="cl" x="146" y="322" fill="#FFE135">{"  )"}</text>
                  </g>
                </g>
              </svg>
              <figcaption>Layout and code sketch</figcaption>
            </figure>
          </div>
        </article>

        <article className="stage s-auto">
          <div className="wrap stage-in">
            <div className="st-copy">
              <p className="label">Stage three</p>
              <h2 className="display">Automate</h2>
              <p className="sd">Then the repeat work moves to agents, integrations and pipelines that plug into the tools a team already uses.</p>
              <ul className="tags"><li>AI agents</li><li>Workflows</li><li>Integrations</li><li>Internal tools</li></ul>
            </div>
            <figure className="st-vis" style={{ margin: 0 }}>
              <svg viewBox="0 0 480 360" role="img" aria-label="A flow where an enquiry goes to an agent, which logs it, drafts a reply and alerts the team">
                <g fill="none" stroke="#14120D" strokeWidth="2">
                  <path className="dr" pathLength={1} id="e1" d="M124 168H190" />
                  <path className="dr" pathLength={1} id="e2" d="M290 168C324 168 322 68 356 68" />
                  <path className="dr" pathLength={1} id="e3" d="M290 168H356" />
                  <path className="dr" pathLength={1} id="e4" d="M290 168C324 168 322 268 356 268" />
                </g>
                <g className="nd" fontFamily={mono} fontSize="12" textAnchor="middle">
                  <rect x="24" y="146" width="100" height="44" fill="#F3EEE1" stroke="#14120D" strokeWidth="2" /><text x="74" y="173" fill="#14120D">Enquiry</text>
                  <rect x="190" y="146" width="100" height="44" fill="#14120D" /><text x="240" y="173" fill="#FFE135">Agent</text>
                  <rect x="356" y="46" width="100" height="44" fill="#F3EEE1" stroke="#14120D" strokeWidth="2" /><text x="406" y="73" fill="#14120D">Log it</text>
                  <rect x="356" y="146" width="100" height="44" fill="#F3EEE1" stroke="#14120D" strokeWidth="2" /><text x="406" y="173" fill="#14120D">Draft reply</text>
                  <rect x="356" y="246" width="100" height="44" fill="#F3EEE1" stroke="#14120D" strokeWidth="2" /><text x="406" y="273" fill="#14120D">Alert team</text>
                </g>
                <g className="pulses" fill="#14120D">
                  {[["e1", "1.2s", "0s"], ["e2", "2s", ".5s"], ["e3", "1.4s", ".6s"], ["e4", "2s", ".9s"]].map(([id, dur, begin]) => (
                    <rect key={id} x="-4" y="-4" width="8" height="8">
                      <animateMotion dur={dur} begin={begin} repeatCount="indefinite"><mpath href={`#${id}`} /></animateMotion>
                    </rect>
                  ))}
                </g>
              </svg>
              <figcaption>Illustration of an enquiry-handling flow</figcaption>
            </figure>
          </div>
        </article>
      </div>
    </section>
  );
}
