import { Syncopate, Inter_Tight, Geist_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/providers/SmoothScroll";
import Nav from "@/components/ui/Nav";
import Grain from "@/components/ui/Grain";
import Preloader from "@/components/ui/Preloader";
import StarDustLoader from "@/components/scene/StarDustLoader";
import { site } from "@/data/site";

// Display: wide, extended, heavy caps (closest Google match to the reference).
// Swap via /dev/fonts, or move to next/font/local if you license the exact face.
const display = Syncopate({ subsets: ["latin"], weight: ["700"], variable: "--font-display-face", display: "swap" });
const reading = Inter_Tight({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-reading-face", display: "swap" });
const mono = Geist_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono-face", display: "swap" });

export const metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Mira Technologies | Product studio for web, trading and mobile",
    template: "%s | Mira Technologies",
  },
  description: site.description,
  openGraph: {
    title: "Mira Technologies",
    description: site.description,
    url: site.url,
    siteName: "Mira Technologies",
    images: [{ url: "/space/hero-planet.2k.webp", width: 2560, height: 1440 }],
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport = {
  themeColor: "#000000",
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  url: site.url,
  email: site.email,
  description: site.description,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${display.variable} ${reading.variable} ${mono.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <SmoothScroll>
          <Preloader />
          <Nav />
          <StarDustLoader />
          {children}
          <Grain />
        </SmoothScroll>
      </body>
    </html>
  );
}
