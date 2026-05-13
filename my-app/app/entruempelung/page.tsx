import type { Metadata } from "next"
import { ServicePageLayout } from "@/components/service-page-layout"

export const metadata: Metadata = {
  title: "Entrümpelung in Heidelberg & Mannheim | High-End Homes",
  description: "Professionelle Entrümpelung in Heidelberg, Mannheim und Umgebung. Schnell, günstig und zuverlässig. Jetzt unverbindliches Angebot einholen.",
}

export default function EntruempelungPage() {
  return (
    <ServicePageLayout
      title="Entrümpelung"
      subtitle="Professionelle Entrümpelung"
      description="Schnelle und zuverlässige Entrümpelung in Heidelberg, Mannheim und der gesamten Rhein-Neckar-Region"
      whatWeDo={[
        "Komplette Entrümpelung von Wohnungen, Häusern, Kellern und Dachböden",
        "Sortierung und fachgerechte Entsorgung aller Gegenstände",
        "Besenreine Übergabe auf Wunsch",
        "Wertgegenstände-Sortierung und -Verwertung",
      ]}
      benefits={[
        {
          title: "Schnell",
          description: "Kurzfristige Termine nach Besichtigung möglich",
        },
        {
          title: "Günstig",
          description: "Faire Preise durch Verwertung von Wertgegenständen",
        },
        {
          title: "Zuverlässig",
          description: "Professionelles und erfahrenes Team",
        },
      ]}
      process={[
        {
          title: "Anfrage",
          description: "Du kontaktierst uns über das Formular oder per E-Mail",
        },
        {
          title: "Besichtigung",
          description: "Wir vereinbaren einen Termin zur Besichtigung vor Ort",
        },
        {
          title: "Angebot",
          description: "Du bekommst ein transparentes und unverbindliches Angebot",
        },
        {
          title: "Ausführung",
          description: "Unser Team entrümpelt professionell und hinterlässt besenreine Räume",
        },
      ]}
      faqs={[
        {
          question: "Wie schnell könnt ihr mit der Entrümpelung starten?",
          answer: "Je nach Verfügbarkeit können wir kurzfristige Termine vereinbaren. Nach der Besichtigung erstellen wir dir ein Angebot und können dann zeitnah starten.",
        },
        {
          question: "Was passiert mit Wertgegenständen?",
          answer: "Wertgegenstände werden sortiert und können nach Absprache verwertet werden. Dies kann die Kosten der Entrümpelung reduzieren.",
        },
        {
          question: "Übernehmt ihr auch die Entsorgung?",
          answer: "Ja, wir übernehmen die komplette fachgerechte Entsorgung aller Gegenstände und hinterlassen besenreine Räume.",
        },
      ]}
      quoteTab="entruempelung"
    />
  )
}
