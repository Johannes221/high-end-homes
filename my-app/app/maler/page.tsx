import type { Metadata } from "next"
import { ServicePageLayout } from "@/components/service-page-layout"

export const metadata: Metadata = {
  title: "Maler & Lackierer in Heidelberg & Mannheim | High-End Homes",
  description: "Professionelle Malerarbeiten in Heidelberg, Mannheim und Umgebung. Innen und Außen. Jetzt Angebot einholen.",
}

export default function MalerPage() {
  return (
    <ServicePageLayout
      title="Maler & Lackierer"
      subtitle="Professionelle Malerarbeiten"
      description="Hochwertige Malerarbeiten für Innen und Außen in Heidelberg, Mannheim und der Rhein-Neckar-Region"
      whatWeDo={[
        "Innen- und Außenanstriche für Wohn- und Gewerbeimmobilien",
        "Tapezierarbeiten und Wandgestaltung",
        "Lackierarbeiten für Türen, Fenster und Heizkörper",
        "Fassadenanstriche und Fassadensanierung",
      ]}
      benefits={[
        {
          title: "Qualität",
          description: "Hochwertige Materialien und präzise Ausführung",
        },
        {
          title: "Erfahrung",
          description: "Jahrelange Erfahrung in allen Bereichen der Malerarbeiten",
        },
        {
          title: "Sauber",
          description: "Saubere Arbeitsweise und gründliche Endreinigung",
        },
      ]}
      process={[
        {
          title: "Beratung",
          description: "Persönliche Beratung zu Farben, Techniken und Materialien",
        },
        {
          title: "Angebot",
          description: "Detailliertes Angebot mit Materialaufstellung",
        },
        {
          title: "Vorbereitung",
          description: "Professionelle Vorbereitung der Untergründe",
        },
        {
          title: "Ausführung",
          description: "Präzise Ausführung und saubere Übergabe",
        },
      ]}
      faqs={[
        {
          question: "Welche Farben verwenden Sie?",
          answer: "Wir verwenden hochwertige Markenfarben und beraten Sie gerne bei der Auswahl. Auf Wunsch auch ökologische Farben.",
        },
        {
          question: "Wie lange dauern Malerarbeiten?",
          answer: "Die Dauer hängt vom Umfang ab. Eine Wohnung kann in 2-5 Tagen gestrichen werden.",
        },
        {
          question: "Übernehmen Sie auch Tapezierarbeiten?",
          answer: "Ja, wir übernehmen alle Arten von Tapezierarbeiten und Wandgestaltung.",
        },
      ]}
      quoteTab="ausbau"
    />
  )
}
