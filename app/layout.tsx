import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap"
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap"
});

export const metadata: Metadata = {
  metadataBase: new URL("https://djnashd.com"),
  title: {
    default: "NASH.D | Singapore DJ & Performing Artist",
    template: "%s | NASH.D"
  },
  description:
    "Official website of NASH.D, a Singapore-based DJ and performing artist. Explore event information, DJ mixes and playlists.",
  formatDetection: {
    date: false,
    address: false
  },
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
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body>
        {children}
        <Script
          id="cloudflare-web-analytics"
          type="module"
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon='{"token": "2d5ad16049d34cf391cb9218f67a725c"}'
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
