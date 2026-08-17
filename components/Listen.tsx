import { Headphones, Youtube } from "lucide-react";

export default function Listen() {
  return (
    <section className="section shell" id="mixes">
      <div className="section-title">
        <div><span className="eyebrow">LISTEN</span><h2>My sound</h2></div>
        <p>DJ mixes and performances from NASH.D.</p>
      </div>
      <div className="link-grid">
        <a className="feature-link" href="https://www.youtube.com/@DJNASHD" target="_blank" rel="noopener noreferrer">
          <Youtube size={24} aria-hidden="true" />
          <div><strong>YouTube</strong><span>Performances and DJ content</span></div>
          <span>{"\u2197\uFE0E"}</span>
        </a>
        <a className="feature-link" href="https://www.mixcloud.com/djnashd/" target="_blank" rel="noopener noreferrer">
          <Headphones size={24} aria-hidden="true" />
          <div><strong>Mixcloud</strong><span>DJ mixes</span></div>
          <span>{"\u2197\uFE0E"}</span>
        </a>
      </div>
    </section>
  );
}
