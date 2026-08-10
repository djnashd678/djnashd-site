import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Coming Soon | NASH.D",
  robots: { index: false, follow: false, nocache: true }
};

type GatePageProps = {
  searchParams: Promise<{ error?: string; next?: string }>;
};

function safeDestination(value?: string): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/";
  return value;
}

export default async function GatePage({ searchParams }: GatePageProps) {
  const { error, next } = await searchParams;

  return (
    <main className="gate">
      <section className="gate-panel" aria-labelledby="gate-title">
        <h1 id="gate-title">NASH.D</h1>
        <p>New site coming soon.</p>
        <form className="gate-form" action="/api/site-auth" method="post">
          <input type="hidden" name="next" value={safeDestination(next)} />
          <label className="sr-only" htmlFor="site-password">Password</label>
          <input
            id="site-password"
            name="password"
            type="password"
            placeholder="Password"
            autoComplete="current-password"
            autoFocus
            required
          />
          <button type="submit">ENTER</button>
        </form>
        <p className="gate-error" role="alert" aria-live="polite">
          {error === "1" ? "Incorrect password. Please try again." : "\u00a0"}
        </p>
      </section>
    </main>
  );
}
