import Image from "next/image";

export default function Hero() {
  return (
    <section className="hero">
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
          <h1>NASH.D</h1>
          <a className="button primary" href="#next-show">
            Explore Events <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
      <a className="scroll-cue" href="#next-show" aria-label="Scroll to events">↓</a>
    </section>
  );
}
