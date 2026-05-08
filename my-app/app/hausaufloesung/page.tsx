import type { Metadata } from "next"
import { ServicePageLayout } from "@/components/service-page-layout"

export const metadata: Metadata = {
  title: "Hausauflösung in Heidelberg & Mannheim | High-End Homes",
  description: "Professionelle Hausauflösung in Heidelberg, Mannheim und Umgebung. Diskret, sorgfältig und zuverlässig. Jetzt Angebot einholen.",
}

export default function HausaufloesungPage() {
  return (
    <ServicePageLayout
      title="Hausauflösung"
      subtitle="Komplette Hausauflösung"
      description="Diskrete und sorgfältige Hausauflösung in Heidelberg, Mannheim und der Rhein-Neckar-Region"
      whatWeDo={[
        "Komplette Auflösung von Haushalten und Wohnungen",
        "Sorgfältige Sortierung von Wertgegenständen und Erinnerungsstücken",
        "Fachgerechte Entsorgung und Verwertung",
        "Diskrete und respektvolle Abwicklung",
      ]}
      benefits={[
        {
          title: "Diskret",
          description: "Sensible und respektvolle Behandlung persönlicher Gegenstände",
        },
        {
          title: "Sorgfältig",
          description: "Professionelle Sortierung und Aufbewahrung wichtiger Dokumente",
        },
        {
          title: "Komplett",
          description: "Alles aus einer Hand – von der Sortierung bis zur Entsorgung",
        },
      ]}
      process={[
        {
          title: "Erstgespräch",
          description: "Persönliches Gespräch zur Klärung aller Details und Wünsche",
        },
        {
          title: "Besichtigung & Angebot",
          description: "Vor-Ort-Termin und Erstellung eines detaillierten Angebots",
        },
        {
          title: "Sortierung",
          description: "Sorgfältige Sortierung von Wertgegenständen, Dokumenten und Erinnerungsstücken",
        },
        {
          title: "Auflösung & Übergabe",
          description: "Komplette Auflösung und besenreine Übergabe der Immobilie",
        },
      ]}
      faqs={[
        {
          question: "Wie gehen Sie mit persönlichen Gegenständen um?",
          answer: "Wir behandeln alle persönlichen Gegenstände mit größtem Respekt. Wichtige Dokumente, Fotos und Erinnerungsstücke werden sorgfältig sortiert und nach Ihren Wünschen aufbewahrt oder übergeben.",
        },
        {
          question: "Was passiert mit Möbeln und Wertgegenständen?",
          answer: "Möbel und Wertgegenstände können nach Absprache verkauft oder gespendet werden. Der Erlös wird mit den Kosten verrechnet.",
        },
        {
          question: "Übernehmen Sie auch Hausauflösungen im Erbfall?",
          answer: "Ja, wir haben viel Erfahrung mit Hausauflösungen im Erbfall und arbeiten diskret und sensibel mit allen Beteiligten zusammen.",
        },
      ]}
      quoteTab="entruempelung"
    />
  )
}
