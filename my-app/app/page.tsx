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
  title: "High-End Homes — Ihr Haus. Eine Adresse.",
  description:
    "Sanierung, Ausbau und Renovierung aus einer Hand — Maler, Trockenbau, Fliesen, Sanitär, Elektro, Fensterbau, Entrümpelung und Entkernung. Ein Ansprechpartner in Heidelberg, Mannheim und der Rhein-Neckar-Region.",
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
          "Sanierung",
          "Renovierung",
          "Innenausbau",
          "Komplettsanierung",
          "Malerarbeiten",
          "Trockenbau",
          "Fliesenarbeiten",
          "Sanitärinstallation",
          "Elektroinstallation",
          "Fensterbau",
          "Entrümpelung",
          "Hausauflösung",
          "Wohnungsauflösung",
          "Entkernung",
        ],
        description:
          "Sanierung, Ausbau und Renovierung aus einer Hand — Maler, Trockenbau, Fliesen, Sanitär, Elektro, Fensterbau, Entrümpelung und Entkernung. Ein Ansprechpartner in Heidelberg, Mannheim und der Rhein-Neckar-Region.",
      },
      {
        "@type": "Service",
        serviceType: "Sanierung, Ausbau und Renovierung aus einer Hand",
        name: "Komplettsanierung und Ausbau",
        provider: {
          "@type": "LocalBusiness",
          name: "High-End Homes",
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
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Maler & Lackierer" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Trockenbau & Stuckateur" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Fliesenleger" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Sanitär & Elektro" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Fensterbau & Gerüst" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Entrümpelung" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Hausauflösung" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Entkernung" } },
          ],
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "Welche Leistungen bietet High-End Homes in Heidelberg und Mannheim an?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Wir bieten Sanierung, Ausbau und Renovierung aus einer Hand: Maler, Trockenbau, Fliesen, Sanitär, Elektro, Fensterbau sowie Entrümpelung und Entkernung — für private und gewerbliche Objekte in Heidelberg, Mannheim und der gesamten Rhein-Neckar-Region.",
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
              text: "Ja. Wir koordinieren alle Gewerke vom Rückbau über Entkernung bis zum vollständigen Innen- und Außenausbau — Sie haben einen Ansprechpartner für das gesamte Projekt.",
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
