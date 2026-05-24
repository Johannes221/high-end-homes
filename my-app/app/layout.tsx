import type { Metadata } from "next";
import "./globals.css";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

 const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://highendhomes.de";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "High-End Homes (High End Homes) — Sanierung, Ausbau & Renovierung in Heidelberg & Mannheim",
    template: "%s | High-End Homes",
  },
  description:
    "High-End Homes (auch: High End Homes, Highendhomes) — Sanierung, Ausbau und Renovierung aus einer Hand in Heidelberg, Mannheim und der Rhein-Neckar-Region. Maler, Trockenbau, Fliesen, Sanitär, Elektro, Fensterbau plus Entrümpelung und Entkernung. Ein Ansprechpartner für alles.",
  keywords: [
    // Brand-Varianten
    "High-End Homes",
    "High End Homes",
    "Highendhomes",
    "HighEndHomes",
    "highendhomes.de",
    "High-End Homes Heidelberg",
    "High End Homes Heidelberg",
    "High-End Homes Mannheim",
    "Bennet Pfeifer Heidelberg",
    // Kernleistungen
    "Sanierung Heidelberg",
    "Sanierung Mannheim",
    "Komplettsanierung Heidelberg",
    "Ausbau Heidelberg",
    "Ausbau Mannheim",
    "Innenausbau Heidelberg",
    "Renovierung Heidelberg",
    "Renovierung Mannheim",
    "Komplettsanierung Rhein-Neckar",
    "Hausrenovierung Heidelberg",
    "Wohnungsrenovierung Heidelberg",
    "Altbausanierung Heidelberg",
    // Einzel-Gewerke
    "Maler Heidelberg",
    "Maler Mannheim",
    "Malerbetrieb Heidelberg",
    "Trockenbau Heidelberg",
    "Trockenbau Mannheim",
    "Fliesenleger Heidelberg",
    "Fliesenleger Mannheim",
    "Sanitär Heidelberg",
    "Sanitärinstallateur Heidelberg",
    "Elektriker Heidelberg",
    "Elektroinstallation Heidelberg",
    "Fensterbau Heidelberg",
    "Fensterbau Mannheim",
    "Gerüstbau Heidelberg",
    // Rückbau / Räumung
    "Entrümpelung Heidelberg",
    "Entrümpelung Mannheim",
    "Hausauflösung Heidelberg",
    "Hausauflösung Mannheim",
    "Wohnungsauflösung Heidelberg",
    "Entkernung Heidelberg",
    "Entkernung Mannheim",
    "Räumung Rhein-Neckar",
    // Generisch
    "Handwerker Rhein-Neckar",
    "Bauunternehmen Heidelberg",
    "Sanierungsbetrieb Heidelberg",
    "Komplettanbieter Bau Rhein-Neckar",
    "alles aus einer Hand Heidelberg",
  ],
  applicationName: "High-End Homes",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: siteUrl,
    siteName: "High-End Homes",
    title: "High-End Homes — Sanierung, Ausbau & Renovierung | Heidelberg · Mannheim",
    description:
      "Sanierung, Ausbau und Renovierung aus einer Hand. Maler, Trockenbau, Fliesen, Sanitär, Elektro, Fensterbau, Entrümpelung und Entkernung — High-End Homes in Heidelberg, Mannheim und der Rhein-Neckar-Region.",
    images: [
      {
        url: "/logo-main.png",
        width: 1200,
        height: 630,
        alt: "High-End Homes (High End Homes) — Sanierung und Ausbau aus einer Hand in Heidelberg und Mannheim",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "High-End Homes — Sanierung, Ausbau & Renovierung | Heidelberg · Mannheim",
    description:
      "Sanierung, Ausbau und Renovierung aus einer Hand. Maler, Trockenbau, Fliesen, Sanitär, Elektro, Fensterbau. Heidelberg · Mannheim · Rhein-Neckar.",
    images: ["/logo-main.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/favicon.webp",
    apple: "/icon-192.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={cn("h-full antialiased", "font-sans", geist.variable)}>
      <body className="min-h-full flex flex-col bg-[#0a0a0a] text-white">
        <SessionProviderWrapper>{children}</SessionProviderWrapper>
      </body>
    </html>
  );
}
