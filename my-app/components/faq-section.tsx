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
    <section className="py-20 bg-[#0A1628]">
      <div className="section-padding">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <p className="text-[#60A5FA] text-sm font-semibold uppercase tracking-wider mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Häufige Fragen
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
              FAQ
            </h2>
          </div>

          {/* FAQ Items */}
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-[#1a2a3a] border border-[#60A5FA]/15 rounded-lg overflow-hidden hover:border-[#60A5FA]/40 transition-all duration-300"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <h3 className="text-lg font-semibold text-white pr-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    {faq.question}
                  </h3>
                  <ChevronDown
                    className={`w-6 h-6 text-[#60A5FA] flex-shrink-0 transition-transform duration-300 ${
                      openIndex === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openIndex === index ? "max-h-96" : "max-h-0"
                  }`}
                >
                  <div className="px-6 pb-6">
                    <p className="text-white/70 leading-relaxed" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
