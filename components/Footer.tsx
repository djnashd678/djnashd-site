import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer shell">
      <strong>NASH<span>.</span>D</strong>
      <p>© {new Date().getFullYear()} NASH.D</p>
      <div className="footer-links">
        <Link href="/privacy">Privacy</Link>
        <a href="mailto:hello@djnashd.com">Bookings ↗</a>
      </div>
    </footer>
  );
}
