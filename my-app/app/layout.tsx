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
    default: "High-End Homes — Ihr Haus. Eine Adresse. | Sanierung & Ausbau in Heidelberg & Mannheim",
    template: "%s | High-End Homes",
  },
  description:
    "Alles aus einer Hand: Sanierung, Ausbau, Renovierung. Maler, Trockenbau, Fliesen, Sanitär, Elektro und Fensterbau — plus Entrümpelung und Entkernung. Ein Ansprechpartner für Heidelberg, Mannheim und die Rhein-Neckar-Region.",
  keywords: [
    "Sanierung Heidelberg",
    "Sanierung Mannheim",
    "Ausbau Heidelberg",
    "Ausbau Mannheim",
    "Renovierung Heidelberg",
    "Renovierung Mannheim",
    "Komplettsanierung Rhein-Neckar",
    "Maler Heidelberg",
    "Trockenbau Heidelberg",
    "Fliesenleger Heidelberg",
    "Sanitär Elektro Heidelberg",
    "Fensterbau Mannheim",
    "Entrümpelung Heidelberg",
    "Hausauflösung Heidelberg",
    "Entkernung Heidelberg",
    "Handwerker Rhein-Neckar",
    "Bauunternehmen Heidelberg",
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
    title: "High-End Homes — Ihr Haus. Eine Adresse.",
    description:
      "Sanierung, Ausbau und Renovierung aus einer Hand — Maler, Trockenbau, Fliesen, Sanitär, Elektro, Fensterbau, Entrümpelung und Entkernung. Heidelberg · Mannheim · Rhein-Neckar.",
    images: [
      {
        url: "/logo-main.png",
        width: 1200,
        height: 630,
        alt: "High-End Homes — Sanierung und Ausbau aus einer Hand in Heidelberg und Mannheim",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "High-End Homes — Ihr Haus. Eine Adresse.",
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
