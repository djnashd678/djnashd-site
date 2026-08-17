import { Instagram } from "lucide-react";

export default function Follow() {
  return (
    <section className="section shell">
      <div className="section-title">
        <div><span className="eyebrow">FOLLOW</span><h2>Stay connected</h2></div>
        <p>Event drops, behind-the-scenes moments and new content.</p>
      </div>
      <div className="link-grid">
        <a className="feature-link" href="https://instagram.com/djnashd" target="_blank" rel="noopener noreferrer">
          <Instagram size={24} aria-hidden="true" />
          <div><strong>Instagram</strong><span>@djnashd</span></div>
          <span>{"\u2197\uFE0E"}</span>
        </a>
      </div>
    </section>
  );
}
