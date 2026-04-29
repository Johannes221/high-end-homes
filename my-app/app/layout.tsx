import type { Metadata } from "next";
import "./globals.css";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";

export const metadata: Metadata = {
  title: "High-End Homes | Professionelle Entrümpelung & Entkernung",
  description: "Schnell, günstig, einfach, sauber und präzise. Ihr Experte für Entrümpelung, Entkernung und Kernsanierung in der Region.",
  keywords: ["Entrümpelung", "Entkernung", "Kernsanierung", "Gerüstbau", "Fensterbau", "Fliesenleger"],
  icons: {
    icon: "/logo-favicon.webp",
    apple: "/logo-favicon.webp",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#0a0a0a] text-[#fafafa]">
        <SessionProviderWrapper>{children}</SessionProviderWrapper>
      </body>
    </html>
  );
}
