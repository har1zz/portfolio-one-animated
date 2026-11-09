export function About() {
  return (
    <section id="about" className="sec about" aria-labelledby="aboutH">
      <div className="wrap about-grid">
        <div>
          <p className="label rv">The studio</p>
          <h2 className="display mk" id="aboutH" style={{ marginTop: 16 }}>
            <span className="ln"><span>Design and</span></span>
            <span className="ln"><span>engineering in</span></span>
            <span className="ln"><span>the same room.</span></span>
          </h2>
          <p className="rv" style={{ maxWidth: "40ch", marginTop: 24, color: "var(--ink-2)" }}>
            So nothing gets lost between the mockup and the build, and the thing you launch is the thing you approved.
          </p>
        </div>
        <div>
          <div className="pr rv"><h3>Ripe, not rushed</h3><p>Clear scope, steady delivery and no surprises.</p></div>
          <div className="pr rv"><h3>Built to last</h3><p>Reusable components, documentation and a clean handover.</p></div>
          <div className="pr rv"><h3>Secure by default</h3><p>Server-side validation and secrets kept out of the browser.</p></div>
        </div>
      </div>
    </section>
  );
}
