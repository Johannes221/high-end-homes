"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

const faqs = [
  {
    question: "Welche Leistungen bieten Sie in Heidelberg und Mannheim an?",
    answer: "Wir bieten Entrümpelung, Hausauflösung, Wohnungsauflösung und Entkernung für private und gewerbliche Objekte in Heidelberg, Mannheim und der gesamten Rhein-Neckar-Region an. Zusätzlich übernehmen wir alle Ausbau-Leistungen wie Maler, Trockenbau, Fliesenleger, Sanitär & Elektro sowie Fensterbau.",
  },
  {
    question: "Wie schnell kann eine Entrümpelung oder Hausauflösung starten?",
    answer: "Je nach Umfang sind kurzfristige Besichtigungen und schnelle Termine möglich. Nach Ihrer Anfrage melden wir uns zeitnah mit einer Einschätzung zum Aufwand und möglichen Startterminen. Unser Express-Service ermöglicht einen Start innerhalb von 24-48 Stunden.",
  },
  {
    question: "Übernehmen Sie auch Entkernungen vor Sanierungen?",
    answer: "Ja. Wir übernehmen Entkernungen für Wohnungen, Häuser, Büros und Gewerbeeinheiten und bereiten das Objekt strukturiert auf die nächsten Bau- oder Sanierungsschritte vor. Inklusive fachgerechter Entsorgung aller Materialien.",
  },
  {
    question: "Was kostet eine Entrümpelung oder Entkernung?",
    answer: "Die Kosten hängen von verschiedenen Faktoren ab: Größe des Objekts, Umfang der Arbeiten, Stockwerk, Aufzug vorhanden, Art der Materialien etc. Nach Ihrer Anfrage erstellen wir Ihnen ein transparentes und unverbindliches Angebot innerhalb von 24 Stunden.",
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
            <h2 className="text-4xl md:text-5xl font-bold text-white" style={{ fontFamily: 'var(--font-headline)' }}>
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
    </section>
  )
}
