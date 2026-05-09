"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

const faqs = [
  {
    question: "Welche Leistungen bieten Sie in Heidelberg und Mannheim an?",
    answer: "Wir bieten Entrümpelung, Hausauflösung und Entkernung für private und gewerbliche Objekte in Heidelberg, Mannheim und der gesamten Rhein-Neckar-Region an. Zusätzlich übernehmen wir alle Ausbau-Leistungen wie Maler, Trockenbau, Fliesenleger, Sanitär & Elektro sowie Fensterbau.",
  },
  {
    question: "Wie schnell kann eine Entrümpelung oder Hausauflösung starten?",
    answer: "Je nach Umfang sind kurzfristige Besichtigungen und schnelle Termine möglich. Nach Ihrer Anfrage melden wir uns zeitnah mit einer Einschätzung zum Aufwand und möglichen Startterminen.",
  },
  {
    question: "Übernehmen Sie auch Entkernungen vor Sanierungen?",
    answer: "Ja. Wir übernehmen Entkernungen für Wohnungen, Häuser, Büros und Gewerbeeinheiten und bereiten das Objekt strukturiert auf die nächsten Bau- oder Sanierungsschritte vor. Inklusive fachgerechter Entsorgung aller Materialien.",
  },
  {
    question: "In welchen Orten rund um Heidelberg sind Sie tätig?",
    answer: "Wir sind in Heidelberg, Mannheim, Dossenheim, Schriesheim, Weinheim, Leimen, Eppelheim, Schwetzingen, Hockenheim, Ladenburg und im gesamten Rhein-Neckar-Kreis tätig.",
  },
  {
    question: "Was kostet eine Entrümpelung?",
    answer: "Die Kosten hängen von verschiedenen Faktoren ab: Größe des Objekts, Umfang der Arbeiten, Stockwerk, Aufzug vorhanden, Art der Materialien etc. Nach Ihrer Anfrage erstellen wir Ihnen ein transparentes und unverbindliches Angebot.",
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
