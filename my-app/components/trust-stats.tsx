"use client"

import { CheckCircle2, Clock, User } from "lucide-react"

const stats = [
  {
    icon: CheckCircle2,
    number: "500+",
    label: "Projekte abgeschlossen",
    description: "Zufriedene Kunden in der Region",
  },
  {
    icon: Clock,
    number: "24-48h",
    label: "Express vor Ort",
    description: "Schnelle Reaktionszeit",
  },
  {
    icon: User,
    number: "1",
    label: "Ansprechpartner für alles",
    description: "Vom ersten Kontakt bis zur Übergabe",
  },
]

export function TrustStats() {
  return (
    <section className="py-16 bg-[#0A1628]">
      <div className="section-padding">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div
                  key={index}
                  className="flex flex-col items-center text-center p-8 bg-[#1a2a3a] border border-[#60A5FA]/15 rounded-lg hover:border-[#60A5FA]/40 hover:shadow-lg hover:shadow-[#60A5FA]/10 transition-all duration-300"
                >
                  <div className="w-16 h-16 rounded-full bg-[#60A5FA]/10 flex items-center justify-center mb-4">
                    <Icon className="w-8 h-8 text-[#60A5FA]" />
                  </div>
                  <div className="text-5xl font-bold text-[#60A5FA] mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                    {stat.number}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    {stat.label}
                  </h3>
                  <p className="text-white/60 text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    {stat.description}
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
