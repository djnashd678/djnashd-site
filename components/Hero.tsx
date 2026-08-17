import Image from "next/image";

export default function Hero() {
  return (
    <section className="hero">
      <header className="hero-nav">
        <div className="hero-nav-inner shell">
          <a className="hero-nav-brand" href="/">NASH.D</a>
          <nav aria-label="Primary navigation">
            <a className="hero-nav-desktop-link" href="#next-show">EVENTS</a>
            <a className="hero-nav-desktop-link" href="#mixes">MIXES</a>
            <a href="#book">BOOK</a>
          </nav>
        </div>
      </header>
      <Image
        src="/hero.jpg"
        alt="NASH.D performing in front of a nightclub crowd"
        fill
        priority
        className="hero-image"
        sizes="100vw"
      />
      <div className="hero-overlay" />
      <div className="hero-content shell">
        <div>
          <p className="hero-eyebrow">DJ &amp; PERFORMING ARTIST</p>
          <h1>NASH.D</h1>
          <a className="button primary" href="#next-show">
            View Upcoming Shows <span aria-hidden="true">{"\u2197\uFE0E"}</span>
          </a>
        </div>
      </div>
      <a className="scroll-cue" href="#next-show" aria-label="Scroll to events">
        SCROLL <span aria-hidden="true">{"\u2193\uFE0E"}</span>
      </a>
    </section>
  );
}
