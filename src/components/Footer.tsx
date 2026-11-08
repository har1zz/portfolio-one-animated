import { TLink } from "./TLink";

export function Footer() {
  return (
    <footer data-dark>
      <div className="wrap">
        <div className="foot-top">
          <div>
            <p className="label">PixelateBanana</p>
            <p style={{ marginTop: 10, maxWidth: "30ch", opacity: 0.8 }}>
              We design, build &amp; automate. Websites, apps, AI workflows and brands.
            </p>
          </div>
          <div>
            <TLink href="/#work">Work</TLink>
            <TLink href="/#services">Services</TLink>
            <TLink href="/#contact">Start a project</TLink>
          </div>
          <div>
            <a href="https://www.instagram.com/pixelatebanana" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="https://www.linkedin.com/company/pixelatebanana" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a href="https://pixelatebanana-test-2.vercel.app/privacy-policy" target="_blank" rel="noopener noreferrer">Privacy</a>
            <a href="https://pixelatebanana-test-2.vercel.app/terms-of-service" target="_blank" rel="noopener noreferrer">Terms</a>
          </div>
        </div>
        <div className="wordmark" aria-hidden="true">PixelateBanana</div>
        <div className="foot-bot">
          <span>© 2026 PixelateBanana</span>
          <span>Karachi, Pakistan</span>
          <TLink href="/" style={{ textDecoration: "none" }}>Back to top ↑</TLink>
        </div>
      </div>
    </footer>
  );
}
