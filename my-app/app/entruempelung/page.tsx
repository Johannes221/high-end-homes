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
          description: "Express-Service möglich – Start innerhalb 24-48h nach Besichtigung",
        },
        {
          title: "Günstig",
          description: "Faire Preise durch Verwertung von Wertgegenständen",
        },
        {
          title: "Zuverlässig",
          description: "Erfahrenes Team mit über 500 abgeschlossenen Projekten",
        },
      ]}
      process={[
        {
          title: "Anfrage & Besichtigung",
          description: "Sie kontaktieren uns, wir vereinbaren einen Besichtigungstermin vor Ort",
        },
        {
          title: "Angebot",
          description: "Sie erhalten ein transparentes, unverbindliches Angebot innerhalb 24h",
        },
        {
          title: "Durchführung",
          description: "Unser Team entrümpelt professionell und hinterlässt besenreine Räume",
        },
        {
          title: "Abnahme",
          description: "Gemeinsame Abnahme und Übergabe der Räumlichkeiten",
        },
      ]}
      faqs={[
        {
          question: "Wie schnell können Sie mit der Entrümpelung starten?",
          answer: "Je nach Verfügbarkeit können wir innerhalb von 24-48 Stunden nach der Besichtigung starten. Bei dringenden Fällen bieten wir auch Express-Service an.",
        },
        {
          question: "Was passiert mit Wertgegenständen?",
          answer: "Wertgegenstände werden sortiert und können nach Absprache verwertet werden. Dies kann die Kosten der Entrümpelung reduzieren.",
        },
        {
          question: "Übernehmen Sie auch die Entsorgung?",
          answer: "Ja, wir übernehmen die komplette fachgerechte Entsorgung aller Gegenstände und hinterlassen besenreine Räume.",
        },
      ]}
      quoteTab="entruempelung"
    />
  )
}
