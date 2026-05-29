import type { Metadata } from "next"
import { ServicePageLayout } from "@/components/service-page-layout"

export const metadata: Metadata = {
  title: "Innenausbau in Heidelberg & Mannheim",
  description: "Innenausbau, Wand- und Deckenausbau, Spachtelarbeiten und Montage in Heidelberg, Mannheim und der Rhein-Neckar-Region. Jetzt Angebot einholen.",
}

export default function InnenausbauPage() {
  return (
    <ServicePageLayout
      title="Innenausbau"
      subtitle="Wand- & Deckenausbau, Spachtel- und Montagearbeiten"
      description="Innenausbau, Wand- und Deckenausbau, Spachtelarbeiten sowie Montagearbeiten in Heidelberg, Mannheim und der Rhein-Neckar-Region."
      whatWeDo={[
        "Wand- und Deckenausbau (Ständerwerk, Gipsplatten, abgehängte Decken)",
        "Spachtelarbeiten und Untergrundvorbereitung (Q1–Q4)",
        "Schall- und Wärmedämmung",
        "Montagearbeiten (Türen, Zargen, Möbel, Trennwände)",
      ]}
      benefits={[
        {
          title: "Flexibel",
          description: "Individuelle Raumgestaltung nach Ihren Wünschen",
        },
        {
          title: "Schnell",
          description: "Zügige Umsetzung durch erfahrenes Team",
        },
        {
          title: "Präzise",
          description: "Millimetergenaue Ausführung für perfekte Ergebnisse",
        },
      ]}
      process={[
        {
          title: "Planung",
          description: "Detaillierte Aufnahme vor Ort, Material- und Konstruktionsplanung",
        },
        {
          title: "Angebot",
          description: "Transparentes Angebot mit Materialaufstellung",
        },
        {
          title: "Ausführung",
          description: "Sauberer Aufbau, Spachtelung und Übergabe-Vorbereitung",
        },
        {
          title: "Übergabe",
          description: "Saubere Übergabe für Folgegewerke wie Maler",
        },
      ]}
      faqs={[
        {
          question: "Welche Wand- und Deckensysteme setzen Sie ein?",
          answer: "Wir arbeiten mit hochwertigen Systemen von Markenherstellern wie Knauf und Rigips, je nach Anforderung (Schallschutz, Brandschutz, Feuchtraum etc.).",
        },
        {
          question: "Übernehmen Sie auch Spachtelarbeiten in höchster Qualitätsstufe?",
          answer: "Ja, wir spachteln je nach Vorgabe in den Qualitätsstufen Q1 bis Q4 — von einfacher Verspachtelung bis zur höchsten Anforderung für glatte Wände und Streiflicht.",
        },
        {
          question: "Machen Sie auch reine Montagearbeiten?",
          answer: "Ja, Tür- und Zargenmontagen, Möbelaufbau, Trennwände und ähnliche Montagearbeiten übernehmen wir auch ohne Komplettsanierung.",
        },
      ]}
      quoteTab="ausbau"
    />
  )
}
