"use client"

import { useState } from "react"

const faqs = [
  {
    question: "Welche Leistungen führt High-End Homes selbst aus?",
    answer: "Unser eigenes Team übernimmt Renovierungs- und Innenausbauarbeiten: Maler- und Lackierarbeiten, Bodenverlegung, Wand- und Deckenausbau, Spachtelarbeiten und Montage. Dazu Entrümpelung, Hausauflösung und Rückbau. Für private und gewerbliche Objekte.",
  },
  {
    question: "Bieten Sie auch komplette Sanierungsprojekte an?",
    answer: "Ja. Bei Komplettprojekten übernehmen wir die Planung, Koordination und Projektsteuerung. Die Ausbau- und Renovierungsgewerke führen wir teils selbst aus, meisterpflichtige Arbeiten wie Elektro, Sanitär und Heizung über unser Netzwerk geprüfter Fachbetriebe. Für Sie bleibt es bei einem Ansprechpartner.",
  },
  {
    question: "Welche Arbeiten laufen über Partnerbetriebe?",
    answer: "Genehmigungs- und meisterpflichtige Gewerke — insbesondere Elektroinstallation, Sanitär und Heizung sowie Statik — führen wir nicht selbst aus. Wir vergeben sie an konzessionierte Fachbetriebe und koordinieren deren Einsatz, damit jedes Gewerk fachgerecht abgedeckt ist.",
  },
  {
    question: "Wie schnell kann ein Projekt starten?",
    answer: "Kurzfristige Termine sind möglich. Nach Ihrer Anfrage melden wir uns zeitnah mit einer Einschätzung zu Aufwand und möglichen Startterminen.",
  },
  {
    question: "In welchen Orten sind Sie tätig?",
    answer: "Heidelberg, Mannheim, Dossenheim, Schriesheim, Weinheim, Leimen, Eppelheim, Schwetzingen, Hockenheim, Ladenburg und Umgebung.",
  },
  {
    question: "Was kostet ein Innenausbau-Projekt?",
    answer: "Abhängig von Umfang, Größe und Material. Sie erhalten nach der Anfrage und Besichtigung ein transparentes, unverbindliches Angebot.",
  },
]

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="py-20 bg-[#0a0a0a]">
      <div className="section-padding">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="heading-glow text-4xl md:text-5xl text-white" style={{ fontFamily: 'var(--font-headline)', fontWeight: 400, letterSpacing: '0.02em' }}>
              Häufige Fragen
            </h2>
          </div>

          {/* FAQ Items */}
          <div className="space-y-0">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border-b border-[rgba(255,255,255,0.08)] overflow-hidden"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between py-5 text-left transition-all duration-300"
                >
                  <h3 className="text-[15px] text-white pr-4" style={{ fontFamily: 'var(--font-headline)', fontWeight: 500 }}>
                    {faq.question}
                  </h3>
                  <span
                    className="text-xl flex-shrink-0 transition-transform duration-400"
                    style={{ 
                      color: 'rgba(255,255,255,0.4)', 
                      transform: openIndex === index ? 'rotate(45deg)' : 'rotate(0deg)'
                    }}
                  >
                    +
                  </span>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-[450ms] ${
                    openIndex === index ? "max-h-96 pb-5" : "max-h-0"
                  }`}
                  style={{ transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}
                >
                  <p className="text-[15px] leading-loose" style={{ fontFamily: 'var(--font-body)', fontWeight: 300, color: 'rgba(255,255,255,0.55)' }}>
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
