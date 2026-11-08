import type { Metadata, Viewport } from "next";
import { Anybody, Geist, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { Cursor } from "@/components/Cursor";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { TransitionProvider } from "@/components/TransitionProvider";

const anybody = Anybody({ subsets: ["latin"], axes: ["wdth"], variable: "--font-anybody", display: "swap" });
const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
const plex = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-plex-mono", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://pixelatebanana.com"),
  title: { default: "PixelateBanana Studio", template: "%s | PixelateBanana" },
  description:
    "PixelateBanana designs, builds and automates: websites, apps, AI workflows and brands. Pixel-perfect and peel-fast.",
  openGraph: { siteName: "PixelateBanana", type: "website" },
  twitter: { card: "summary_large_image" },
};
export const viewport: Viewport = { themeColor: "#FFE135", viewportFit: "cover" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${anybody.variable} ${geist.variable} ${plex.variable}`}>
      <body>
        <TransitionProvider>
          <Nav />
          <main id="main">{children}</main>
          <Footer />
          <Cursor />
        </TransitionProvider>
      </body>
    </html>
  );
}
