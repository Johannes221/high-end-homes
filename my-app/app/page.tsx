import type { Metadata } from "next"
import { Suspense } from "react"
import { Navigation } from "@/components/navigation-new"
import { Hero } from "@/components/hero-new"
import { VillaInteractive } from "@/components/villa-interactive"
import { ServiceCards } from "@/components/service-cards"
import { FAQSection } from "@/components/faq-section"
import { CTABanner } from "@/components/cta-banner"
import { Footer } from "@/components/footer-new"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://high-end-homes.de"

export const metadata: Metadata = {
  title: "Entrümpelung, Hausauflösung & Entkernung in Heidelberg und Mannheim",
  description:
    "Professionelle Entrümpelung, Hausauflösung, Wohnungsauflösung und Entkernung in Heidelberg, Mannheim und Umgebung. Schnell vor Ort, transparent kalkuliert und sauber umgesetzt.",
  alternates: {
    canonical: "/",
  },
}

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        name: "High-End Homes",
        url: siteUrl,
        image: `${siteUrl}/logo-main.png`,
        email: "bennet.pfeifer@highendhomes.de",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Gerhard-Hauptmann Straße 38",
          postalCode: "69221",
          addressLocality: "Dossenheim",
          addressCountry: "DE",
        },
        areaServed: [
          "Heidelberg",
          "Mannheim",
          "Dossenheim",
          "Schriesheim",
          "Weinheim",
          "Leimen",
          "Eppelheim",
          "Schwetzingen",
          "Ladenburg",
          "Hockenheim",
          "Rhein-Neckar-Kreis",
        ],
        knowsAbout: [
          "Entrümpelung",
          "Hausauflösung",
          "Wohnungsauflösung",
          "Entkernung",
        ],
      },
      {
        "@type": "Service",
        serviceType: "Entrümpelung, Hausauflösung und Entkernung",
        provider: {
          "@type": "LocalBusiness",
          name: "High-End Homes",
        },
        areaServed: [
          "Heidelberg",
          "Mannheim",
          "Rhein-Neckar-Region",
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "Welche Leistungen bieten Sie in Heidelberg und Mannheim an?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Wir bieten Entrümpelung, Hausauflösung, Wohnungsauflösung und Entkernung für private und gewerbliche Objekte in Heidelberg, Mannheim und der gesamten Rhein-Neckar-Region an.",
            },
          },
          {
            "@type": "Question",
            name: "Wie schnell kann eine Entrümpelung oder Hausauflösung starten?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Je nach Umfang sind kurzfristige Besichtigungen und schnelle Termine möglich. Nach Ihrer Anfrage melden wir uns zeitnah mit einer Einschätzung zum Aufwand und möglichen Startterminen.",
            },
          },
          {
            "@type": "Question",
            name: "Übernehmen Sie auch Entkernungen vor Sanierungen?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Ja. Wir übernehmen Entkernungen für Wohnungen, Häuser, Büros und Gewerbeeinheiten und bereiten das Objekt strukturiert auf die nächsten Bau- oder Sanierungsschritte vor.",
            },
          },
        ],
      },
    ],
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navigation />
      <main>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <Hero />
        <VillaInteractive />
        <ServiceCards />
        <FAQSection />
        <CTABanner />
      </main>
      <Footer />
    </div>
  )
}
