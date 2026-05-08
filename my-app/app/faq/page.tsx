"use client"

import type { Metadata } from "next"
import { useState } from "react"
import { Navigation } from "@/components/navigation-new"
import { Footer } from "@/components/footer-new"
import { ChevronDown } from "lucide-react"

const generalFaqs = [
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
  {
    question: "In welchen Regionen sind Sie tätig?",
    answer: "Wir sind in der gesamten Rhein-Neckar-Region tätig, insbesondere in Heidelberg, Mannheim, Dossenheim, Schriesheim, Weinheim, Leimen, Eppelheim, Schwetzingen, Ladenburg und Hockenheim. Kontaktieren Sie uns gerne, wenn Ihr Standort nicht aufgelistet ist.",
  },
  {
    question: "Wie läuft eine Anfrage ab?",
    answer: "Sie füllen unser Anfrageformular aus oder kontaktieren uns direkt. Wir melden uns zeitnah für eine Besichtigung vor Ort. Nach der Besichtigung erhalten Sie ein transparentes, unverbindliches Angebot. Bei Beauftragung vereinbaren wir einen Termin und führen die Arbeiten professionell durch.",
  },
  {
    question: "Übernehmen Sie auch die Entsorgung?",
    answer: "Ja, wir übernehmen die komplette fachgerechte Entsorgung aller Materialien und Gegenstände. Sie erhalten die Räumlichkeiten besenrein zurück.",
  },
  {
    question: "Kann ich bei der Entrümpelung Wertgegenstände behalten?",
    answer: "Selbstverständlich. Wertgegenstände werden sortiert und können nach Absprache behalten oder verwertet werden. Die Verwertung kann die Kosten der Entrümpelung reduzieren.",
  },
]

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
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
