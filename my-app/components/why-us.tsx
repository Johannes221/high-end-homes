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
    <section className="py-20 bg-[#0a0a0a]">
      <div className="section-padding">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="heading-glow text-4xl md:text-5xl font-bold text-white" style={{ fontFamily: 'var(--font-headline)' }}>
              Warum High-End Homes?
            </h2>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon
              return (
                <div
                  key={index}
                  className="flex flex-col items-start p-6 bg-[#111111] border border-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.2)] transition-all duration-300"
                >
                  <Icon className="w-6 h-6 text-white mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2" style={{ fontFamily: 'var(--font-headline)' }}>
                    {benefit.title}
                  </h3>
                  <p className="text-white/50 text-sm" style={{ fontFamily: 'var(--font-body)', fontWeight: 300 }}>
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
