"use client";
import { useRef, useState } from "react";
import { animate } from "framer-motion";
import { BUDGETS, PROJECT_TYPES, TIMELINES, briefSchema, briefText, type Brief } from "@/lib/brief";

const EMAIL = "hello@pixelatebanana.com";
type Errors = Partial<Record<"name" | "email" | "ptype" | "desc" | "links", string>>;
type Done = { sent: boolean; reason: "" | "not_configured" | "failed"; brief: Brief };

async function copy(text: string, node?: HTMLElement | null) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    if (node) {
      const r = document.createRange();
      r.selectNodeContents(node);
      const s = getSelection();
      s?.removeAllRanges();
      s?.addRange(r);
    }
    return false;
  }
}

export function Contact() {
  const formRef = useRef<HTMLFormElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [done, setDone] = useState<Done | null>(null);
  const [copied, setCopied] = useState("");

  const read = () => {
    const f = new FormData(formRef.current!);
    const o: Record<string, string> = {};
    f.forEach((v, k) => (o[k] = String(v)));
    return o;
  };
  const validate = (o: Record<string, string>) => {
    const r = briefSchema.safeParse(o);
    if (r.success) return { brief: r.data, errors: {} as Errors };
    const errs: Errors = {};
    for (const i of r.error.issues) {
      const k = String(i.path[0]) as keyof Errors;
      if (!errs[k]) errs[k] = i.message;
    }
    return { brief: null, errors: errs };
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    const o = read();
    if (o.site) return;
    const { brief, errors: errs } = validate(o);
    setErrors(errs);
    const keys = Object.keys(errs) as (keyof Errors)[];
    if (!brief) {
      setMsg("A few things need fixing above.");
      const k = keys[0];
      (k === "ptype" ? formRef.current!.querySelector<HTMLElement>("input[name=ptype]") : document.getElementById(`f-${k}`))?.focus();
      return;
    }
    setBusy(true);
    let result: Done = { sent: false, reason: "failed", brief };
    try {
      const res = await fetch("/api/brief", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(brief) });
      if (res.ok) result = { sent: true, reason: "", brief };
      else if (res.status === 503) result = { sent: false, reason: "not_configured", brief };
      else if (res.status === 400) {
        const data = await res.json().catch(() => ({}));
        setErrors((data.fields ?? {}) as Errors);
        setMsg("A few things need fixing above.");
        setBusy(false);
        return;
      }
    } catch {
      /* network failure: fall through to the copy-and-email path */
    }
    await new Promise((r) => setTimeout(r, 500));
    setBusy(false);
    const form = formRef.current;
    if (form) await animate(form, { opacity: 0 }, { duration: 0.25 }).finished;
    setDone(result);
    requestAnimationFrame(() => {
      const el = doneRef.current;
      if (el) {
        animate(el, { clipPath: ["inset(0 100% 0 0)", "inset(0 0% 0 0)"] }, { duration: 0.7, ease: [0.2, 0.7, 0.1, 1] });
        el.focus({ preventScroll: true });
      }
    });
  }

  const err = (k: keyof Errors) => ({ "aria-invalid": errors[k] ? true : false, "aria-describedby": `e-${k}` }) as const;

  return (
    <section id="contact" className="sec contact" data-dark aria-labelledby="contactH">
      <div className="wrap contact-grid">
        <div>
          <p className="label rv">Start a project</p>
          <h2 className="display mk" id="contactH" style={{ marginTop: 16 }}>
            <span className="ln"><span>Got something</span></span>
            <span className="ln"><span>good <em>brewing?</em></span></span>
          </h2>
          <p className="contact-note rv">
            Tell us what you&apos;re building, roughly when, and what it should do. The more specific, the better the first reply.
          </p>
          <div className="mailrow rv">
            <code id="mailTxt">{EMAIL}</code>
            <button
              className="copy"
              type="button"
              onClick={async () => {
                const ok = await copy(EMAIL, document.getElementById("mailTxt"));
                setCopied(ok ? "mail" : "");
                setTimeout(() => setCopied(""), 1400);
              }}
            >
              {copied === "mail" ? "Copied" : "Copy"}
            </button>
          </div>
        </div>
        <div>
          {!done && (
            <form id="brief" ref={formRef} noValidate onSubmit={onSubmit}>
              <div className="fld">
                <label htmlFor="f-name">Name</label>
                <input className="fi" id="f-name" name="name" autoComplete="name" required {...err("name")} />
                <div className="err" id="e-name" role="alert">{errors.name}</div>
              </div>
              <div className="fld">
                <label htmlFor="f-email">Email</label>
                <input className="fi" id="f-email" name="email" type="email" autoComplete="email" required {...err("email")} />
                <div className="err" id="e-email" role="alert">{errors.email}</div>
              </div>
              <div className="fld">
                <label htmlFor="f-company">Company <span className="opt">optional</span></label>
                <input className="fi" id="f-company" name="company" autoComplete="organization" />
              </div>
              <div className="fld">
                <label htmlFor="f-time">Timeline <span className="opt">optional</span></label>
                <select className="fi" id="f-time" name="timeline" defaultValue="">
                  <option value="">Not sure yet</option>
                  {TIMELINES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <fieldset className="fld full">
                <legend>Project type</legend>
                <div className="chips">
                  {PROJECT_TYPES.map((v) => (
                    <label className="chip" key={v}><input type="radio" name="ptype" value={v} /><span>{v}</span></label>
                  ))}
                </div>
                <div className="err" id="e-ptype" role="alert">{errors.ptype}</div>
              </fieldset>
              <fieldset className="fld full">
                <legend>Budget <span className="opt">optional, in USD</span></legend>
                <div className="chips">
                  {BUDGETS.map((v) => (
                    <label className="chip" key={v}><input type="radio" name="budget" value={v} /><span>{v}</span></label>
                  ))}
                </div>
              </fieldset>
              <div className="fld full">
                <label htmlFor="f-desc">What are we making?</label>
                <textarea className="fi" id="f-desc" name="desc" required {...err("desc")} />
                <div className="err" id="e-desc" role="alert">{errors.desc}</div>
              </div>
              <div className="fld full">
                <label htmlFor="f-links">Reference links <span className="opt">optional, one per line</span></label>
                <textarea className="fi" id="f-links" name="links" style={{ minHeight: 70 }} {...err("links")} />
                <div className="err" id="e-links" role="alert">{errors.links}</div>
              </div>
              <div className="hp" aria-hidden="true">
                <label htmlFor="f-site">Leave this empty</label>
                <input id="f-site" name="site" tabIndex={-1} autoComplete="off" />
              </div>
              <div className="submit-row">
                <button className={`btn mag${busy ? " is-busy" : ""}`} type="submit" disabled={busy}>
                  <span>{busy ? "Peeling" : "Send brief"}</span>
                  <span className="pxbar" aria-hidden="true"><i /><i /><i /><i /><i /></span>
                </button>
                <span className="form-msg" role="alert">{msg}</span>
              </div>
            </form>
          )}
          {done && (
            <div id="done" ref={doneRef} tabIndex={-1}>
              <h3>{done.sent ? "Brief sent." : "Brief ready."}</h3>
              {done.sent ? (
                <p>We&apos;ll reply to <strong>{done.brief.email}</strong>.</p>
              ) : (
                <>
                  <p>
                    {done.reason === "not_configured"
                      ? "Email sending is not set up on this deployment yet, so nothing was sent."
                      : "The form could not reach the server just now, so nothing was sent."}{" "}
                    Copy the brief and email it to <code>{EMAIL}</code>.
                  </p>
                  <pre ref={preRef}>{briefText(done.brief)}</pre>
                  <div className="mailrow">
                    <button
                      className="copy"
                      type="button"
                      onClick={async () => {
                        const ok = await copy(briefText(done.brief), preRef.current);
                        setCopied(ok ? "brief" : "");
                        setTimeout(() => setCopied(""), 1400);
                      }}
                    >
                      {copied === "brief" ? "Copied" : "Copy brief"}
                    </button>
                    <a
                      className="copy"
                      style={{ textDecoration: "none" }}
                      href={`mailto:${EMAIL}?subject=${encodeURIComponent("Project brief from " + done.brief.name)}&body=${encodeURIComponent(briefText(done.brief))}`}
                    >
                      Open in email app
                    </a>
                    <button className="copy" type="button" onClick={() => setDone(null)}>Edit brief</button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
