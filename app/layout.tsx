import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://djnashd.com"),
  title: {
    default: "NASH.D | Singapore DJ & Performing Artist",
    template: "%s | NASH.D"
  },
  description:
    "Official website of NASH.D, a Singapore-based DJ and performing artist. Explore event information, DJ mixes and playlists.",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "NASH.D",
    title: "NASH.D | Singapore DJ & Performing Artist",
    description:
      "Official website of NASH.D, a Singapore-based DJ and performing artist. Explore event information, DJ mixes and playlists.",
    images: [
      {
        url: "/hero.jpg",
        width: 2048,
        height: 1280,
        alt: "NASH.D performing in front of a nightclub crowd"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "NASH.D | Singapore DJ & Performing Artist",
    description:
      "Official website of NASH.D, a Singapore-based DJ and performing artist. Explore event information, DJ mixes and playlists.",
    images: ["/hero.jpg"]
  },
  ...(process.env.SITE_PASSWORD
    ? { robots: { index: false, follow: false, nocache: true } }
    : {})
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
