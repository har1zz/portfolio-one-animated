import { TLink } from "@/components/TLink";

export default function NotFound() {
  return (
    <section className="sec wrap" style={{ minHeight: "70svh", paddingTop: 140 }}>
      <p className="label">404</p>
      <h1 className="display h2" style={{ marginTop: 16 }}>Page not found.</h1>
      <p className="lede">That page does not exist, or it moved.</p>
      <div className="cta-row"><TLink className="btn btn-yellow" href="/">Back home</TLink></div>
    </section>
  );
}
