import type { Metadata } from "next"
import { ServicePageLayout } from "@/components/service-page-layout"

export const metadata: Metadata = {
  title: "Sanitär & Elektro in Heidelberg & Mannheim | High-End Homes",
  description: "Professionelle Sanitär- und Elektroinstallationen in Heidelberg, Mannheim und Umgebung. Jetzt Angebot einholen.",
}

export default function SanitaerPage() {
  return (
    <ServicePageLayout
      title="Sanitär & Elektro"
      subtitle="Sanitär- & Elektroinstallationen"
      description="Professionelle Sanitär- und Elektroarbeiten in Heidelberg, Mannheim und der Rhein-Neckar-Region"
      whatWeDo={[
        "Sanitärinstallationen für Bad und Küche",
        "Elektroinstallationen und Leitungsverlegung",
        "Heizungsinstallation und -wartung",
        "Smart-Home-Lösungen",
      ]}
      benefits={[
        {
          title: "Fachgerecht",
          description: "Alle Arbeiten durch zertifizierte Fachkräfte",
        },
        {
          title: "Sicher",
          description: "Einhaltung aller Sicherheitsvorschriften und Normen",
        },
        {
          title: "Komplett",
          description: "Sanitär und Elektro aus einer Hand",
        },
      ]}
      process={[
        {
          title: "Planung",
          description: "Detaillierte Planung der Installationen",
        },
        {
          title: "Angebot",
          description: "Transparentes Angebot mit Materialaufstellung",
        },
        {
          title: "Installation",
          description: "Fachgerechte Installation durch zertifizierte Fachkräfte",
        },
        {
          title: "Abnahme",
          description: "Gemeinsame Abnahme und Einweisung",
        },
      ]}
      faqs={[
        {
          question: "Sind eure Installateure zertifiziert?",
          answer: "Ja, alle unsere Sanitär- und Elektroinstallateure sind zertifizierte Fachkräfte mit entsprechenden Qualifikationen.",
        },
        {
          question: "Übernehmt ihr auch Notdienste?",
          answer: "Für Bestandskunden bieten wir einen Notdienst für dringende Reparaturen an.",
        },
        {
          question: "Könnt ihr Smart-Home-Systeme installieren?",
          answer: "Ja, wir installieren und konfigurieren moderne Smart-Home-Lösungen nach deinen Wünschen.",
        },
      ]}
      quoteTab="ausbau"
    />
  )
}
