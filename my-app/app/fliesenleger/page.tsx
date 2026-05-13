import type { Metadata } from "next"
import { ServicePageLayout } from "@/components/service-page-layout"

export const metadata: Metadata = {
  title: "Fliesenleger in Heidelberg & Mannheim | High-End Homes",
  description: "Professionelle Fliesenverlegung in Heidelberg, Mannheim und Umgebung. Bad, Küche und mehr. Jetzt Angebot einholen.",
}

export default function FliesenlegerPage() {
  return (
    <ServicePageLayout
      title="Fliesenleger"
      subtitle="Professionelle Fliesenverlegung"
      description="Präzise Fliesenverlegung für Bad, Küche und mehr in Heidelberg, Mannheim und der Rhein-Neckar-Region"
      whatWeDo={[
        "Fliesenverlegung für Bad, Küche und Wohnbereiche",
        "Naturstein- und Mosaikverlegung",
        "Abdichtungsarbeiten nach DIN-Norm",
        "Fugenarbeiten und Silikonfugen",
      ]}
      benefits={[
        {
          title: "Präzise",
          description: "Millimetergenaue Verlegung für perfekte Ergebnisse",
        },
        {
          title: "Erfahren",
          description: "Jahrelange Erfahrung mit allen Fliesenarten",
        },
        {
          title: "Sauber",
          description: "Saubere Arbeitsweise und gründliche Endreinigung",
        },
      ]}
      process={[
        {
          title: "Beratung",
          description: "Beratung zu Fliesenauswahl und Verlegemuster",
        },
        {
          title: "Angebot",
          description: "Detailliertes Angebot mit Materialberechnung",
        },
        {
          title: "Vorbereitung",
          description: "Professionelle Untergrundvorbereitung und Abdichtung",
        },
        {
          title: "Verlegung",
          description: "Präzise Verlegung und saubere Verfugung",
        },
      ]}
      faqs={[
        {
          question: "Welche Fliesen können Sie verlegen?",
          answer: "Wir verlegen alle Arten von Fliesen: Keramik, Feinsteinzeug, Naturstein, Mosaik und Großformatfliesen.",
        },
        {
          question: "Übernehmen Sie auch die Abdichtung?",
          answer: "Ja, wir führen alle Abdichtungsarbeiten nach aktueller DIN-Norm durch, besonders wichtig in Nassbereichen.",
        },
        {
          question: "Wie lange dauert eine Badsanierung?",
          answer: "Eine komplette Badsanierung mit Fliesenverlegung dauert je nach Größe 5-10 Tage.",
        },
      ]}
      quoteTab="ausbau"
    />
  )
}
