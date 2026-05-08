import type { Metadata } from "next"
import { ServicePageLayout } from "@/components/service-page-layout"

export const metadata: Metadata = {
  title: "Trockenbau & Stukateur in Heidelberg & Mannheim | High-End Homes",
  description: "Professioneller Trockenbau und Stuckarbeiten in Heidelberg, Mannheim und Umgebung. Jetzt Angebot einholen.",
}

export default function TrockenbauPage() {
  return (
    <ServicePageLayout
      title="Trockenbau & Stukateur"
      subtitle="Trockenbau & Stuckarbeiten"
      description="Professioneller Trockenbau und Stuckarbeiten in Heidelberg, Mannheim und der Rhein-Neckar-Region"
      whatWeDo={[
        "Trockenbau-Wände und Trennwände",
        "Abgehängte Decken und Deckensysteme",
        "Stuckarbeiten und Zierprofile",
        "Schall- und Wärmedämmung",
      ]}
      benefits={[
        {
          title: "Flexibel",
          description: "Individuelle Raumgestaltung nach Ihren Wünschen",
        },
        {
          title: "Schnell",
          description: "Zügige Umsetzung durch erfahrenes Team",
        },
        {
          title: "Präzise",
          description: "Millimetergenaue Ausführung für perfekte Ergebnisse",
        },
      ]}
      process={[
        {
          title: "Planung",
          description: "Detaillierte Planung der Trockenbau-Konstruktion",
        },
        {
          title: "Angebot",
          description: "Transparentes Angebot mit Materialaufstellung",
        },
        {
          title: "Ausführung",
          description: "Professionelle Montage und Verspachtelung",
        },
        {
          title: "Übergabe",
          description: "Saubere Übergabe für nachfolgende Gewerke",
        },
      ]}
      faqs={[
        {
          question: "Welche Trockenbau-Systeme verwenden Sie?",
          answer: "Wir verwenden hochwertige Systeme von Markenherstellern wie Knauf und Rigips, je nach Anforderung.",
        },
        {
          question: "Können Sie auch Schallschutz-Wände bauen?",
          answer: "Ja, wir bauen Trockenbau-Wände mit verschiedenen Schallschutzklassen nach Ihren Anforderungen.",
        },
        {
          question: "Übernehmen Sie auch Stuckarbeiten?",
          answer: "Ja, wir führen alle Arten von Stuckarbeiten aus, von klassischen Profilen bis zu modernen Designs.",
        },
      ]}
      quoteTab="ausbau"
    />
  )
}
