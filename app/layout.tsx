import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Straylight Café - Cyberspace Community Hub",
  description: "A community hub for cyberspace enthusiasts. Connect, explore, and dive into the metaverse.",
  keywords: "cyberspace, nostr, metaverse, ONOSENDAI, web3, community",
  openGraph: {
    title: "Straylight Café",
    description: "A community hub for cyberspace enthusiasts",
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
