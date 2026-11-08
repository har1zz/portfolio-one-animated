"use client";
import { useState } from "react";
import { bananaCells, SHADE } from "@/lib/pixels";

const SERVICES = [
  {
    title: "Website design & development",
    text: "Custom websites, landing pages and web apps, designed and built together so what you approve is what ships.",
    tags: ["Custom websites", "Business sites", "Landing pages", "E-commerce", "Web applications", "Responsive development", "UI/UX design"],
  },
  {
    title: "AI & automation",
    text: "Agents and workflows that take the repetitive parts of a business off people's plates, wired into the tools already in use.",
    tags: ["AI agents", "Business workflows", "Process automation", "Integrations", "Workflow optimisation", "Custom AI solutions"],
  },
  {
    title: "Branding & digital identity",
    text: "A mark, a type system, a palette and the rules that keep them consistent, set up to work in code as well as in print.",
    tags: ["Brand identity", "Visual systems", "Digital branding", "Design systems", "UI design", "Creative direction"],
  },
  {
    title: "Software & digital products",
    text: "Internal tools, dashboards and product interfaces built around how a team actually works.",
    tags: ["Custom applications", "Internal tools", "SaaS", "Dashboards", "Product interfaces"],
  },
];

const mono = "IBM Plex Mono, monospace";

export function Services() {
  const [active, setActive] = useState(0);
  return (
    <section id="services" className="sec" style={{ paddingTop: 0 }} aria-labelledby="svcH">
      <div className="wrap">
        <p className="label rv">Services</p>
        <h2 className="display h2 mk" id="svcH" style={{ marginTop: 16 }}>
          <span className="ln"><span>What we</span></span>
          <span className="ln"><span>take on.</span></span>
        </h2>
        <div className="svc-grid">
          <div className="svc-list">
            {SERVICES.map((s, i) => {
              const open = i === active;
              return (
                <div className="svc" data-open={open} key={s.title}>
                  <h3>
                    <button className="svc-btn svc-t" aria-expanded={open} aria-controls={`svm${i}`} onClick={() => setActive(i)}>
                      {s.title} <b>{String(i + 1).padStart(2, "0")}</b>
                    </button>
                  </h3>
                  <div className="svc-more" id={`svm${i}`} inert={!open}>
                    <div>
                      <p>{s.text}</p>
                      <ul className="tags">{s.tags.map((t) => <li key={t}>{t}</li>)}</ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="svc-panel" data-active={active} aria-hidden="true">
            <div className="v v0">
              <svg viewBox="0 0 400 330">
                <rect x="24" y="40" width="250" height="170" fill="#F3EEE1" stroke="#14120D" strokeWidth="2" />
                <rect x="36" y="52" width="226" height="12" fill="#14120D" />
                <rect className="shim" x="36" y="72" width="226" height="60" fill="#FFE135" />
                <rect x="36" y="142" width="70" height="56" fill="#14120D" opacity=".15" />
                <rect x="114" y="142" width="70" height="56" fill="#14120D" opacity=".15" />
                <rect x="192" y="142" width="70" height="56" fill="#14120D" opacity=".15" />
                <path className="dash" d="M274 125H304" stroke="#14120D" strokeWidth="1.6" fill="none" />
                <rect x="304" y="70" width="70" height="140" fill="#F3EEE1" stroke="#14120D" strokeWidth="2" />
                <rect className="shim" x="312" y="96" width="54" height="40" fill="#FFE135" />
                <rect x="312" y="144" width="54" height="22" fill="#14120D" opacity=".15" />
                <rect x="312" y="172" width="54" height="22" fill="#14120D" opacity=".15" />
                <g fontFamily={mono} fontSize="11" fill="#14120D"><text x="24" y="232">1440</text><text x="304" y="232">390</text></g>
              </svg>
              <span className="cap">One build, every width</span>
            </div>
            <div className="v v1">
              <svg viewBox="0 0 400 330">
                <g fill="none" stroke="#14120D" strokeWidth="1.8">
                  <path className="dash" d="M114 60C150 60 130 150 150 150" />
                  <path className="dash" d="M240 150C262 150 250 60 276 60" />
                  <path className="dash" d="M240 150C262 150 250 250 276 250" />
                </g>
                <g fontFamily={mono} fontSize="11" textAnchor="middle">
                  <rect x="24" y="40" width="90" height="40" fill="#F3EEE1" stroke="#14120D" strokeWidth="2" /><text x="69" y="64" fill="#14120D">Trigger</text>
                  <rect x="150" y="130" width="90" height="40" fill="#14120D" /><text x="195" y="154" fill="#FFE135">Agent</text>
                  <rect x="276" y="40" width="90" height="40" fill="#F3EEE1" stroke="#14120D" strokeWidth="2" /><text x="321" y="64" fill="#14120D">Tool</text>
                  <rect x="276" y="230" width="90" height="40" fill="#FFE135" stroke="#14120D" strokeWidth="2" /><text x="321" y="254" fill="#14120D">Review</text>
                </g>
              </svg>
              <span className="cap">Connected steps, one owner each</span>
            </div>
            <div className="v v2">
              <svg viewBox="0 0 400 330">
                <rect x="24" y="40" width="70" height="70" fill="#FFE135" stroke="#14120D" strokeWidth="2" />
                <rect x="102" y="40" width="70" height="70" fill="#14120D" />
                <rect x="180" y="40" width="70" height="70" fill="#F3EEE1" stroke="#14120D" strokeWidth="2" />
                <text x="20" y="210" fontFamily="Anybody,Impact,sans-serif" fontWeight="800" fontSize="130" style={{ fontVariationSettings: "'wdth' 70" }} fill="#14120D">Aa</text>
                <g transform="translate(268 120)">{bananaCells(10).map((k) => <rect key={`${k.i}-${k.j}`} x={k.i * 12} y={k.j * 12} width="12.4" height="12.4" fill={SHADE[k.sh]} />)}</g>
                <g fontFamily={mono} fontSize="11" fill="#14120D"><text x="24" y="250">Anybody</text><text x="24" y="266">Geist</text><text x="24" y="282">IBM Plex Mono</text></g>
              </svg>
              <span className="cap">Mark, type, palette</span>
            </div>
            <div className="v v3">
              <svg viewBox="0 0 400 330">
                <rect x="24" y="30" width="60" height="240" fill="#14120D" />
                <rect x="100" y="30" width="86" height="50" fill="#F3EEE1" stroke="#14120D" strokeWidth="2" />
                <rect x="194" y="30" width="86" height="50" fill="#FFE135" stroke="#14120D" strokeWidth="2" />
                <rect x="288" y="30" width="86" height="50" fill="#F3EEE1" stroke="#14120D" strokeWidth="2" />
                <rect x="100" y="92" width="274" height="120" fill="#F3EEE1" stroke="#14120D" strokeWidth="2" />
                <path className="dash" d="M108 192L150 162L190 174L236 132L280 146L330 110L366 120" fill="none" stroke="#14120D" strokeWidth="2.4" />
                <rect x="100" y="226" width="274" height="8" fill="#14120D" opacity=".18" />
                <rect x="100" y="244" width="200" height="8" fill="#14120D" opacity=".18" />
                <rect x="100" y="262" width="240" height="8" fill="#14120D" opacity=".18" />
              </svg>
              <span className="cap">Interface sketch, no real data</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
