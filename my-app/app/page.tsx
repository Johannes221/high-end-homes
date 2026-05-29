import type { Metadata } from "next"
import { Suspense } from "react"
import { Navigation } from "@/components/navigation-new"
import { Hero } from "@/components/hero-new"
import { AblaufSection } from "@/components/ablauf-section"
import { VillaInteractive } from "@/components/villa-interactive"
import { ServiceCards } from "@/components/service-cards"
import { BeforeAfterSection } from "@/components/before-after-section"
import { FAQSection } from "@/components/faq-section"
import { CTABanner } from "@/components/cta-banner"
import { Footer } from "@/components/footer-new"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://highendhomes.de"

export const metadata: Metadata = {
  title: "High-End Homes GmbH — Innenausbau & Sanierung in Heidelberg & Mannheim",
  description:
    "Innenausbau, Komplettsanierung und Renovierung in Heidelberg, Mannheim und der Rhein-Neckar-Region. Wand- und Deckenausbau, Spachtelarbeiten, Bodenverlegung, Maler- und Lackierarbeiten, Montage — Ihr Projekt aus einer Hand.",
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
        name: "High-End Homes GmbH",
        alternateName: [
          "High-End Homes",
          "High End Homes",
          "Highendhomes",
          "highendhomes.de",
        ],
        url: siteUrl,
        image: `${siteUrl}/logo-main.png`,
        email: "bennet.pfeifer@highendhomes.de",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Gerhard-Hauptmann-Straße 38",
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
          "Innenausbau",
          "Sanierung",
          "Komplettsanierung",
          "Renovierung",
          "Wand- und Deckenausbau",
          "Spachtelarbeiten",
          "Bodenverlegung",
          "Malerarbeiten",
          "Lackierarbeiten",
          "Tapezieren",
          "Montagearbeiten",
          "Entkernung",
          "Entrümpelung",
          "Hausauflösung",
          "Wohnungsauflösung",
        ],
        description:
          "Innenausbau, Komplettsanierung und Renovierung in Heidelberg, Mannheim und der Rhein-Neckar-Region. Wand- und Deckenausbau, Spachtelarbeiten, Bodenverlegung, Maler- und Lackierarbeiten, Montage — Ihr Projekt aus einer Hand.",
      },
      {
        "@type": "Service",
        serviceType: "Innenausbau, Sanierung und Renovierung",
        name: "Innenausbau und Komplettsanierung",
        provider: {
          "@type": "LocalBusiness",
          name: "High-End Homes GmbH",
        },
        areaServed: [
          "Heidelberg",
          "Mannheim",
          "Rhein-Neckar-Region",
        ],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Leistungen",
          itemListElement: [
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Komplettsanierung" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Innenausbau" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Renovierung" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Wand- und Deckenausbau" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Spachtelarbeiten" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Bodenverlegung" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Maler & Lackierer" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Montagearbeiten" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Entkernung" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Entrümpelung" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Hausauflösung" } },
          ],
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "Welche Leistungen bietet die High-End Homes GmbH in Heidelberg und Mannheim?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Wir bieten Innenausbau, Komplettsanierung und Renovierung aus einer Hand: Wand- und Deckenausbau, Spachtelarbeiten, Bodenverlegung, Maler- und Lackierarbeiten sowie Montage. Dazu Rückbau, Entrümpelung und Hausauflösung. Für private und gewerbliche Objekte in Heidelberg, Mannheim und der gesamten Rhein-Neckar-Region.",
            },
          },
          {
            "@type": "Question",
            name: "Wie schnell kann ein Projekt starten?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Je nach Umfang sind kurzfristige Besichtigungen und schnelle Termine möglich. Nach Ihrer Anfrage melden wir uns zeitnah mit einer Einschätzung zu Aufwand, Ablauf und möglichen Startterminen.",
            },
          },
          {
            "@type": "Question",
            name: "Übernehmen Sie auch Komplettsanierungen?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Ja. Wir begleiten Komplettsanierungen vom ersten Rückbau über Entkernung und Innenausbau bis zur fertigen Übergabe — Sie haben einen festen Ansprechpartner für das gesamte Projekt.",
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
        <AblaufSection />
        <VillaInteractive />
        <ServiceCards />
        <BeforeAfterSection />
        <FAQSection />
        <CTABanner />
      </main>
      <Footer />
    </div>
  )
}
