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
    <section className="py-24 bg-[#0a0a0a]">
      <div className="section-padding">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-y border-[rgba(255,255,255,0.08)]">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div
                  key={index}
                  className="flex flex-col items-center text-center py-16 px-8 border-r border-[rgba(255,255,255,0.08)] last:border-r-0 md:border-b-0 border-b"
                >
                  <div className="text-7xl text-white mb-4" style={{ fontFamily: 'var(--font-headline)', fontWeight: 300 }}>
                    {stat.number}
                  </div>
                  <h3 className="text-lg font-normal text-white mb-2" style={{ fontFamily: 'var(--font-headline)', fontWeight: 400 }}>
                    {stat.label}
                  </h3>
                  <p className="text-sm text-white/40" style={{ fontFamily: 'var(--font-body)', fontWeight: 300 }}>
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
