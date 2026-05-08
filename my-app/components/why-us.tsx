"use client"

import { Clock, DollarSign, Smile, Target, Sparkles, Award } from "lucide-react"

const benefits = [
  {
    icon: Clock,
    title: "Schnell",
    description: "Express-Service innerhalb 24-48h vor Ort",
  },
  {
    icon: DollarSign,
    title: "Günstig",
    description: "Transparente Preise ohne versteckte Kosten",
  },
  {
    icon: Smile,
    title: "Einfach",
    description: "Ein Ansprechpartner für alles",
  },
  {
    icon: Target,
    title: "Präzise",
    description: "Saubere und professionelle Ausführung",
  },
  {
    icon: Sparkles,
    title: "Sauber",
    description: "Besenreine Übergabe garantiert",
  },
  {
    icon: Award,
    title: "Zertifiziert",
    description: "Qualifizierte Fachkräfte mit Erfahrung",
  },
]

export function WhyUs() {
  return (
    <section className="py-20 bg-[#0A1628]">
      <div className="section-padding">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <p className="text-[#60A5FA] text-sm font-semibold uppercase tracking-wider mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Ihre Vorteile
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
              Warum <span className="text-[#60A5FA]">High-End Homes</span>?
            </h2>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon
              return (
                <div
                  key={index}
                  className="flex flex-col items-center text-center p-6 bg-[#1a2a3a] border border-[#60A5FA]/15 rounded-lg hover:border-[#60A5FA] hover:shadow-lg hover:shadow-[#60A5FA]/20 transition-all duration-300"
                >
                  <div className="w-16 h-16 rounded-full bg-[#60A5FA]/10 flex items-center justify-center mb-4">
                    <Icon className="w-8 h-8 text-[#60A5FA]" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    {benefit.title}
                  </h3>
                  <p className="text-white/60 text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    {benefit.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
