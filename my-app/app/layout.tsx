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

 const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://high-end-homes.de";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "High-End Homes | Entrümpelung, Hausauflösung & Entkernung in Heidelberg",
    template: "%s | High-End Homes",
  },
  description: "High-End Homes ist Ihr Ansprechpartner für professionelle Entrümpelung, Hausauflösung und Entkernung in Heidelberg, Mannheim, Dossenheim und der gesamten Rhein-Neckar-Region.",
  keywords: [
    "Entrümpelung Heidelberg",
    "Entrümpelung Mannheim",
    "Hausauflösung Heidelberg",
    "Hausauflösung Mannheim",
    "Entkernung Heidelberg",
    "Entkernung Mannheim",
    "Wohnungsauflösung Heidelberg",
    "Räumung Rhein-Neckar",
    "Entsorgung Dossenheim",
    "Entrümpelung Umgebung Heidelberg",
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
    title: "Entrümpelung, Hausauflösung & Entkernung in Heidelberg und Mannheim",
    description: "Professionelle Entrümpelung, Hausauflösung und Entkernung in Heidelberg, Mannheim und Umgebung. Schnell vor Ort, transparent kalkuliert und besenrein ausgeführt.",
    images: [
      {
        url: "/logo-main.png",
        width: 1200,
        height: 630,
        alt: "High-End Homes Entrümpelung und Entkernung in Heidelberg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Entrümpelung, Hausauflösung & Entkernung in Heidelberg und Mannheim",
    description: "High-End Homes übernimmt Entrümpelung, Hausauflösung und Entkernung in Heidelberg, Mannheim und Umgebung.",
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
