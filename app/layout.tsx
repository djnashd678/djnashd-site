import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NASH.D — Events, Guestlists & Music",
  description: "Upcoming NASH.D shows, guestlists, tickets, mixes and playlists."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
