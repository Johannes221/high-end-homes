"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation-new"
import { Footer } from "@/components/footer-new"
import { ChevronDown } from "lucide-react"

const generalFaqs = [
  {
    question: "Welche Leistungen führt High-End Homes selbst aus?",
    answer: "Unser eigenes Team übernimmt Renovierungs- und Innenausbauarbeiten: Maler- und Lackierarbeiten, Bodenverlegung, Wand- und Deckenausbau, Spachtelarbeiten und Montage. Dazu Entrümpelung, Hausauflösung und Rückbau. Für private und gewerbliche Objekte in der Rhein-Neckar-Region.",
  },
  {
    question: "Bieten Sie auch komplette Sanierungsprojekte an?",
    answer: "Ja. Bei Komplettprojekten übernehmen wir die Planung, Koordination und Projektsteuerung. Die Ausbau- und Renovierungsgewerke führen wir teils selbst aus, meisterpflichtige Arbeiten über unser Netzwerk geprüfter Fachbetriebe. Für Sie bleibt es bei einem Ansprechpartner.",
  },
  {
    question: "Welche Arbeiten laufen über Partnerbetriebe?",
    answer: "Genehmigungs- und meisterpflichtige Gewerke — insbesondere Elektroinstallation, Sanitär und Heizung sowie Statik — führen wir nicht selbst aus. Wir vergeben sie an konzessionierte Fachbetriebe und koordinieren deren Einsatz, damit jedes Gewerk fachgerecht abgedeckt ist.",
  },
  {
    question: "Wie schnell kann ein Projekt starten?",
    answer: "Je nach Umfang sind kurzfristige Besichtigungen und schnelle Termine möglich. Nach Ihrer Anfrage melden wir uns zeitnah mit einer Einschätzung zu Aufwand und möglichen Startterminen.",
  },
  {
    question: "Übernehmen Sie auch Entkernung und Rückbau?",
    answer: "Ja. Wir übernehmen Entkernung und Rückbau für Wohnungen, Häuser und Gewerbe und bereiten das Objekt für die anschließenden Renovierungs- und Ausbauarbeiten vor — inklusive fachgerechter Entsorgung.",
  },
  {
    question: "In welchen Regionen sind Sie tätig?",
    answer: "Wir sind in der gesamten Rhein-Neckar-Region tätig, insbesondere in Heidelberg, Mannheim, Dossenheim, Schriesheim, Weinheim, Leimen, Eppelheim, Schwetzingen, Ladenburg und Hockenheim. Kontaktieren Sie uns gerne, wenn Ihr Standort nicht aufgelistet ist.",
  },
  {
    question: "Wie läuft eine Anfrage ab?",
    answer: "Sie füllen unser Anfrageformular aus oder kontaktieren uns direkt. Wir melden uns zeitnah für eine Besichtigung vor Ort. Nach der Besichtigung erhalten Sie ein transparentes, unverbindliches Angebot. Bei Beauftragung vereinbaren wir einen Termin und führen die Arbeiten professionell aus.",
  },
  {
    question: "Was kostet ein Innenausbau- oder Renovierungsprojekt?",
    answer: "Die Kosten hängen von Umfang, Größe und Material ab. Nach Ihrer Anfrage und einer Besichtigung erhalten Sie ein transparentes, unverbindliches Angebot.",
  },
]

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="min-h-screen bg-[#050A20]">
      <Navigation />
      <main className="pt-32 pb-16">
        <div className="section-padding">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6" style={{ fontFamily: 'var(--font-headline)', fontWeight: 300 }}>
                Häufig gestellte Fragen
              </h1>
              <p className="text-xl text-white/70" style={{ fontFamily: 'var(--font-body)', fontWeight: 300 }}>
                Hier finden Sie Antworten auf die wichtigsten Fragen zu unseren Leistungen.
              </p>
            </div>

            <div className="space-y-0">
              {generalFaqs.map((faq, index) => (
                <div
                  key={index}
                  className="border-b border-[rgba(255,255,255,0.08)] overflow-hidden"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full flex items-center justify-between py-5 text-left transition-all duration-300"
                  >
                    <h3 className="text-[15px] font-semibold text-white pr-4" style={{ fontFamily: 'var(--font-headline)' }}>
                      {faq.question}
                    </h3>
                    <ChevronDown
                      className={`w-5 h-5 text-white flex-shrink-0 transition-transform duration-400 ${
                        openIndex === index ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-400 ${
                      openIndex === index ? "max-h-96 pb-5" : "max-h-0"
                    }`}
                    style={{ transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}
                  >
                    <p className="text-white/60 leading-relaxed" style={{ fontFamily: 'var(--font-body)', fontWeight: 300 }}>
                      {faq.answer}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
