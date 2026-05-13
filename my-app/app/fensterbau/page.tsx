import type { Metadata } from "next"
import { ServicePageLayout } from "@/components/service-page-layout"

export const metadata: Metadata = {
  title: "Fensterbau & Gerüstbau in Heidelberg & Mannheim | High-End Homes",
  description: "Professioneller Fensterbau und Gerüstbau in Heidelberg, Mannheim und Umgebung. Jetzt Angebot einholen.",
}

export default function FensterbauPage() {
  return (
    <ServicePageLayout
      title="Fensterbau & Gerüst"
      subtitle="Fensterbau & Gerüstbau"
      description="Professioneller Fensterbau und Gerüstbau in Heidelberg, Mannheim und der Rhein-Neckar-Region"
      whatWeDo={[
        "Fenstertausch und Fenstereinbau",
        "Türen und Haustüren",
        "Gerüstbau für alle Arbeiten",
        "Rollläden und Sonnenschutz",
      ]}
      benefits={[
        {
          title: "Energieeffizient",
          description: "Moderne Fenster für optimale Energieeffizienz",
        },
        {
          title: "Sicher",
          description: "Professioneller Gerüstbau nach Sicherheitsstandards",
        },
        {
          title: "Komplett",
          description: "Fenster und Gerüst aus einer Hand",
        },
      ]}
      process={[
        {
          title: "Beratung",
          description: "Beratung zu Fenstersystemen und Materialien",
        },
        {
          title: "Aufmaß",
          description: "Präzises Aufmaß vor Ort",
        },
        {
          title: "Gerüstbau",
          description: "Professioneller Gerüstbau für sichere Montage",
        },
        {
          title: "Montage",
          description: "Fachgerechte Montage und Abdichtung",
        },
      ]}
      faqs={[
        {
          question: "Welche Fenstersysteme bieten Sie an?",
          answer: "Wir bieten Kunststoff-, Holz- und Aluminiumfenster von führenden Herstellern an.",
        },
        {
          question: "Übernehmen Sie auch den Gerüstbau?",
          answer: "Ja, wir stellen das Gerüst für alle Arbeiten und garantieren höchste Sicherheitsstandards.",
        },
        {
          question: "Gibt es Förderungen für neue Fenster?",
          answer: "Ja, für energieeffiziente Fenster gibt es verschiedene Förderprogramme. Wir beraten Sie gerne.",
        },
      ]}
      quoteTab="ausbau"
    />
  )
}
