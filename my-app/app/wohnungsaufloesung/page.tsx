import type { Metadata } from "next"
import { ServicePageLayout } from "@/components/service-page-layout"

export const metadata: Metadata = {
  title: "Wohnungsauflösung in Heidelberg & Mannheim | High-End Homes",
  description: "Professionelle Wohnungsauflösung in Heidelberg, Mannheim und Umgebung. Schnell, diskret und zuverlässig.",
}

export default function WohnungsaufloesungPage() {
  return (
    <ServicePageLayout
      title="Wohnungsauflösung"
      subtitle="Komplette Wohnungsauflösung"
      description="Professionelle Wohnungsauflösung in Heidelberg, Mannheim und der Rhein-Neckar-Region"
      whatWeDo={[
        "Komplette Auflösung von Wohnungen jeder Größe",
        "Sortierung von Wertgegenständen und persönlichen Dingen",
        "Fachgerechte Entsorgung und Verwertung",
        "Besenreine Übergabe an Vermieter",
      ]}
      benefits={[
        {
          title: "Schnell",
          description: "Zügige Abwicklung für termingerechte Wohnungsübergabe",
        },
        {
          title: "Diskret",
          description: "Professionelle und diskrete Durchführung",
        },
        {
          title: "Komplett",
          description: "Alles aus einer Hand bis zur besenreinen Übergabe",
        },
      ]}
      process={[
        {
          title: "Besichtigung",
          description: "Kostenlose Besichtigung vor Ort zur Aufwandseinschätzung",
        },
        {
          title: "Angebot",
          description: "Transparentes Festpreisangebot innerhalb 24 Stunden",
        },
        {
          title: "Auflösung",
          description: "Professionelle Auflösung mit Sortierung und Entsorgung",
        },
        {
          title: "Übergabe",
          description: "Besenreine Übergabe der Wohnung",
        },
      ]}
      faqs={[
        {
          question: "Wie schnell kann die Wohnungsauflösung erfolgen?",
          answer: "Nach Auftragserteilung können wir in der Regel innerhalb von 2-5 Tagen starten, abhängig von unserer Auslastung und deinem Wunschtermin.",
        },
        {
          question: "Was passiert mit noch verwertbaren Gegenständen?",
          answer: "Verwertbare Gegenstände können nach Absprache verkauft oder gespendet werden. Der Erlös wird mit den Kosten verrechnet.",
        },
        {
          question: "Übernehmt ihr auch die Endreinigung?",
          answer: "Ja, wir hinterlassen die Wohnung besenrein. Eine Grundreinigung ist im Leistungsumfang enthalten.",
        },
      ]}
      quoteTab="entruempelung"
    />
  )
}
