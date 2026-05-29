import type { Metadata } from "next"
import { ServicePageLayout } from "@/components/service-page-layout"

export const metadata: Metadata = {
  title: "Bodenverlegung in Heidelberg & Mannheim",
  description: "Bodenverlegung — Laminat, Vinyl und Bodenbeläge in Heidelberg, Mannheim und der Rhein-Neckar-Region. Jetzt Angebot einholen.",
}

export default function BodenverlegungPage() {
  return (
    <ServicePageLayout
      title="Bodenverlegung"
      subtitle="Laminat, Vinyl und Bodenbeläge"
      description="Bodenverlegung in Heidelberg, Mannheim und der Rhein-Neckar-Region. Wir verlegen Laminat, Vinyl und Bodenbeläge — sauber, schnell und präzise."
      whatWeDo={[
        "Laminat- und Vinyl-Verlegung",
        "Sockelleisten und Übergangsprofile",
        "Untergrund-Vorbereitung und Ausgleich",
        "Boden-Reparaturen und Teil-Erneuerung",
      ]}
      benefits={[
        {
          title: "Sauber",
          description: "Schutz angrenzender Bauteile, staubarme Arbeitsweise",
        },
        {
          title: "Schnell",
          description: "Effiziente Verlegung auch in bewohnten Räumen",
        },
        {
          title: "Präzise",
          description: "Saubere Schnitte, exakte Anschlüsse, perfekte Fugen",
        },
      ]}
      process={[
        {
          title: "Beratung",
          description: "Materialauswahl und Vor-Ort-Aufmaß",
        },
        {
          title: "Angebot",
          description: "Transparente Preise mit Materialaufstellung",
        },
        {
          title: "Verlegung",
          description: "Untergrund vorbereiten und Boden fachgerecht verlegen",
        },
        {
          title: "Übergabe",
          description: "Sockelleisten gesetzt, gereinigt, bezugsfertig",
        },
      ]}
      faqs={[
        {
          question: "Welche Bodenbeläge verlegen Sie?",
          answer: "Wir verlegen Laminat, Vinyl, Click-Vinyl und vergleichbare Bodenbeläge. Bei besonderen Materialien beraten wir Sie gern individuell.",
        },
        {
          question: "Muss der alte Boden raus?",
          answer: "Je nach Zustand und Aufbau — in vielen Fällen kann der neue Belag direkt auf den vorhandenen Untergrund verlegt werden. Wir prüfen das vor Ort.",
        },
        {
          question: "Kann ich während der Verlegung in der Wohnung bleiben?",
          answer: "In den meisten Fällen ja — wir arbeiten raum- oder bereichsweise, damit Sie die übrigen Räume weiter nutzen können.",
        },
      ]}
      quoteTab="ausbau"
    />
  )
}
