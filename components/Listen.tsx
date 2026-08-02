import { Headphones, Music } from "lucide-react";

export default function Listen() {
  return (
    <section className="section shell">
      <div className="section-title">
        <div><span className="eyebrow">LISTEN</span><h2>My sound</h2></div>
        <p>DJ mixes and playlists for the spaces between shows.</p>
      </div>
      <div className="link-grid">
        <a className="feature-link" href="https://www.mixcloud.com/" target="_blank">
          <Headphones size={24} />
          <div><strong>Mixcloud</strong><span>Featured DJ mixes</span></div>
          <span>↗</span>
        </a>
        <a className="feature-link" href="https://open.spotify.com/" target="_blank">
          <Music size={24} />
          <div><strong>Spotify</strong><span>Curated playlists</span></div>
          <span>↗</span>
        </a>
      </div>
    </section>
  );
}
