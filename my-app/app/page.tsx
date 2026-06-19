import type { Metadata } from "next"
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
  title: "High-End Homes — Innenausbau & Sanierung in Heidelberg & Mannheim",
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
        name: "High-End Homes",
        legalName: "High-End Homes GmbH i. G.",
        alternateName: [
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
          "Trockenbau",
          "Spachtelarbeiten",
          "Fliesenarbeiten",
          "Bodenverlegung",
          "Malerarbeiten",
          "Lackierarbeiten",
          "Tapezieren",
          "Montagearbeiten",
          "Renovierung",
          "Entkernung",
          "Entrümpelung",
          "Hausauflösung",
          "Wohnungsauflösung",
          "Sanierungskoordination",
          "Projektsteuerung Bau",
        ],
        description:
          "Innenausbau und Renovierung in Heidelberg, Mannheim und der Rhein-Neckar-Region. Eigenes Team für Trockenbau, Spachtel-, Fliesen-, Boden-, Maler- und Montagearbeiten. Komplettsanierungen koordinieren wir über ein Netzwerk geprüfter Fachbetriebe — ein Ansprechpartner für Ihr Projekt.",
      },
      {
        "@type": "Service",
        serviceType: "Innenausbau und Renovierung",
        name: "Innenausbau, Renovierung und Sanierungskoordination",
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
          name: "Eigenleistungen",
          itemListElement: [
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Trockenbau" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Spachtelarbeiten" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Fliesen- und Bodenarbeiten" } },
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
            name: "Welche Leistungen führt High-End Homes selbst aus?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Unser eigenes Team übernimmt den Innenausbau: Trockenbau, Spachtelarbeiten, Fliesen- und Bodenarbeiten, Maler- und Lackierarbeiten sowie Montage. Dazu Rückbau, Entkernung, Entrümpelung und Hausauflösung. Für private und gewerbliche Objekte in Heidelberg, Mannheim und der gesamten Rhein-Neckar-Region.",
            },
          },
          {
            "@type": "Question",
            name: "Wie funktioniert eine Komplettsanierung bei Ihnen?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Bei Komplettprojekten übernehmen wir Planung, Koordination und Projektsteuerung. Die Einzelgewerke führen wir teils selbst aus, meisterpflichtige Arbeiten wie Elektro, Sanitär und Heizung über unser Netzwerk geprüfter Fachbetriebe. Für Sie bleibt es bei einem Ansprechpartner.",
            },
          },
          {
            "@type": "Question",
            name: "Welche Arbeiten laufen über Partnerbetriebe?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Genehmigungs- und meisterpflichtige Gewerke — insbesondere Elektroinstallation, Sanitär und Heizung sowie Statik — vergeben wir an konzessionierte Fachbetriebe und koordinieren deren Ausführung.",
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
