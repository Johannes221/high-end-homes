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
    default: "High-End Homes — Innenausbau & Sanierung in Heidelberg & Mannheim",
    template: "%s | High-End Homes",
  },
  description:
    "Innenausbau, Komplettsanierung und Renovierung in Heidelberg, Mannheim und der Rhein-Neckar-Region. Wand- und Deckenausbau, Spachtelarbeiten, Bodenverlegung, Maler- und Lackierarbeiten, Montage. Wir koordinieren Ihr Projekt von der Beratung bis zur Übergabe.",
  keywords: [
    // Brand-Varianten
    "High-End Homes",
    "High-End Homes GmbH i. G.",
    "High End Homes",
    "Highendhomes",
    "highendhomes.de",
    "High-End Homes Heidelberg",
    "High-End Homes Mannheim",
    // Kernleistungen
    "Innenausbau Heidelberg",
    "Innenausbau Mannheim",
    "Sanierung Heidelberg",
    "Sanierung Mannheim",
    "Komplettsanierung Heidelberg",
    "Komplettsanierung Rhein-Neckar",
    "Renovierung Heidelberg",
    "Renovierung Mannheim",
    "Hausrenovierung Heidelberg",
    "Wohnungsrenovierung Heidelberg",
    "Altbausanierung Heidelberg",
    // Eigenleistungen
    "Maler Heidelberg",
    "Maler Mannheim",
    "Malerbetrieb Heidelberg",
    "Wand- und Deckenausbau Heidelberg",
    "Spachtelarbeiten Heidelberg",
    "Bodenverlegung Heidelberg",
    "Bodenverleger Mannheim",
    "Laminat verlegen Heidelberg",
    "Vinyl verlegen Heidelberg",
    "Tapezieren Heidelberg",
    "Streichen Heidelberg",
    // Rückbau / Räumung
    "Entkernung Heidelberg",
    "Entkernung Mannheim",
    "Entrümpelung Heidelberg",
    "Entrümpelung Mannheim",
    "Hausauflösung Heidelberg",
    "Hausauflösung Mannheim",
    "Wohnungsauflösung Heidelberg",
    "Räumung Rhein-Neckar",
    // Generisch
    "Handwerker Rhein-Neckar",
    "Bauunternehmen Heidelberg",
    "Sanierungsbetrieb Heidelberg",
    "Innenausbau-Betrieb Rhein-Neckar",
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
    title: "High-End Homes — Innenausbau & Sanierung in Heidelberg & Mannheim",
    description:
      "Innenausbau, Komplettsanierung und Renovierung in Heidelberg, Mannheim und der Rhein-Neckar-Region. Wand- und Deckenausbau, Spachtelarbeiten, Bodenverlegung, Maler- und Lackierarbeiten — Ihr Projekt aus einer Hand.",
    images: [
      {
        url: "/logo-main.png",
        width: 1200,
        height: 630,
        alt: "High-End Homes — Innenausbau und Sanierung in Heidelberg und Mannheim",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "High-End Homes — Innenausbau & Sanierung",
    description:
      "Innenausbau, Komplettsanierung und Renovierung in Heidelberg, Mannheim und der Rhein-Neckar-Region. Ein Ansprechpartner für Ihr Projekt.",
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
