import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "High-End Homes | BauPreis – Preisvergleich Rhein-Neckar",
  description: "Professionelle Entrümpelung & Entkernung. BauPreis: Baumarkt-Preisvergleich für Mannheim, Heidelberg und Ludwigshafen.",
  keywords: ["Entrümpelung", "Entkernung", "Kernsanierung", "Baumarkt", "Preisvergleich", "Rhein-Neckar"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="de"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0a0a0a] text-[#fafafa]">
        <SessionProviderWrapper>{children}</SessionProviderWrapper>
      </body>
    </html>
  );
}
