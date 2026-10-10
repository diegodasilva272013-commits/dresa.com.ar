import type { Metadata, Viewport } from "next";
import { Cinzel, Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";
import { PwaRegister } from "@/components/site/pwa-register";

const cinzel = Cinzel({ variable: "--font-cinzel", subsets: ["latin"], weight: ["400", "700"] });
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});
const jost = Jost({ variable: "--font-jost", subsets: ["latin"], weight: ["300", "400", "500"] });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: "DRESA · Belleza y estilo a domicilio", template: "%s · DRESA" },
  description: site.tagline,
  applicationName: "DRESA",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "DRESA", statusBarStyle: "black-translucent" },
  icons: { apple: "/icons/apple-touch-icon.png" },
  openGraph: {
    title: "DRESA · Belleza y estilo a domicilio",
    description: site.tagline,
    url: site.url,
    siteName: "DRESA",
    locale: "es_AR",
    type: "website",
    images: [{ url: "/brand/og.jpg", width: 1200, height: 1200, alt: "DRESA" }],
  },
  twitter: { card: "summary_large_image", images: ["/brand/og.jpg"] },
};

export const viewport: Viewport = {
  themeColor: "#0a0709",
  viewportFit: "cover",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-AR" className={`${cinzel.variable} ${cormorant.variable} ${jost.variable}`}>
      <body>
        {children}
        <PwaRegister />
      </body>
    </html>
  );
}
