import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Straylight Café - Cyberspace Community Hub",
  description: "The cyberspace community hub: live stats from cyberspace, and the way in to ONOSENDAI, snocrash, the spec and AI agents.",
  keywords: "cyberspace, nostr, metaverse, ONOSENDAI, web3, community",
  openGraph: {
    title: "Straylight Café",
    description: "Live from cyberspace: avatars, bags, shards and hyperspace rides, as they happen.",
    url: "https://straylight.cafe",
    siteName: "Straylight Café",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <div className="scanlines">
          {children}
        </div>
      </body>
    </html>
  );
}
