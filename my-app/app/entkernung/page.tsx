import type { Metadata } from "next"
import { ServicePageLayout } from "@/components/service-page-layout"

export const metadata: Metadata = {
  title: "Entkernung in Heidelberg & Mannheim | High-End Homes",
  description: "Professionelle Entkernung für Sanierungen in Heidelberg, Mannheim und Umgebung. Schnell, sauber und präzise. Jetzt Angebot einholen.",
}

export default function EntkernungPage() {
  return (
    <ServicePageLayout
      title="Entkernung"
      subtitle="Professionelle Entkernung"
      description="Schnelle und präzise Entkernung für deine Sanierung in Heidelberg, Mannheim und der Rhein-Neckar-Region"
      whatWeDo={[
        "Komplette Entkernung von Wohnungen, Häusern und Gewerbeeinheiten",
        "Entfernung von Böden, Wänden, Decken, Sanitär und Elektro",
        "Fachgerechte Entsorgung aller Materialien",
        "Vorbereitung für nachfolgende Sanierungsarbeiten",
      ]}
      benefits={[
        {
          title: "Schnell",
          description: "Zügige Durchführung für minimale Projektunterbrechung",
        },
        {
          title: "Sauber",
          description: "Professionelle Entsorgung und besenreine Übergabe",
        },
        {
          title: "Präzise",
          description: "Fachgerechte Entkernung nach deinen Vorgaben",
        },
      ]}
      process={[
        {
          title: "Planung",
          description: "Detaillierte Besprechung des Entkernungsumfangs und der Anforderungen",
        },
        {
          title: "Angebot",
          description: "Transparentes Angebot mit genauer Aufschlüsselung aller Positionen",
        },
        {
          title: "Durchführung",
          description: "Professionelle Entkernung durch erfahrenes Fachpersonal",
        },
        {
          title: "Entsorgung & Übergabe",
          description: "Fachgerechte Entsorgung und Übergabe für die nächsten Gewerke",
        },
      ]}
      faqs={[
        {
          question: "Was genau wird bei einer Entkernung entfernt?",
          answer: "Bei einer Entkernung werden je nach Umfang Böden, Wandverkleidungen, Decken, Sanitäranlagen, Elektroinstallationen, Fenster, Türen und Trennwände entfernt. Der genaue Umfang wird individuell abgestimmt.",
        },
        {
          question: "Wie lange dauert eine Entkernung?",
          answer: "Die Dauer hängt von der Größe und dem Umfang ab. Eine Wohnung kann in 1-3 Tagen entkernt werden, größere Objekte benötigen entsprechend mehr Zeit.",
        },
        {
          question: "Übernehmt ihr auch Asbest-Sanierung?",
          answer: "Asbest-Sanierung erfordert spezielle Zertifizierungen. Wir arbeiten mit zertifizierten Partnern zusammen und koordinieren die Arbeiten für dich.",
        },
      ]}
      quoteTab="entkernung"
    />
  )
}
