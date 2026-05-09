"use client"

import { FileText, Mail, Eye, Rocket, Zap } from "lucide-react"

const steps = [
  {
    icon: FileText,
    title: "Angebot anfragen",
    description: "Formular ausfüllen mit allen Details",
  },
  {
    icon: Mail,
    title: "Angebot erhalten",
    description: "Transparente Kalkulation innerhalb 24h",
  },
  {
    icon: Eye,
    title: "Besichtigung",
    description: "Vor-Ort-Termin zur finalen Abstimmung",
  },
  {
    icon: Rocket,
    title: "Start in Tagen",
    description: "Schneller Projektbeginn garantiert",
  },
  {
    icon: Zap,
    title: "Schneller als andere",
    description: "Express-Service bei Bedarf",
  },
]

export function ProcessSteps() {
  return (
    <section className="py-20 bg-[#0a0a0a]">
      <div className="section-padding">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="heading-glow text-4xl md:text-5xl font-bold text-white" style={{ fontFamily: 'var(--font-headline)' }}>
              So läuft's ab
            </h2>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <div key={index} className="relative flex flex-col items-center text-center">
                  {/* Connector Line (desktop only) */}
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-5 left-1/2 w-full h-[1px] border-t border-dashed border-[rgba(255,255,255,0.15)]" />
                  )}
                  
                  {/* Circle with Number */}
                  <div className="relative z-10 w-10 h-10 rounded-full border border-[rgba(255,255,255,0.3)] flex items-center justify-center mb-4">
                    <span className="text-white font-bold text-lg" style={{ fontFamily: 'var(--font-headline)' }}>{index + 1}</span>
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-[15px] font-semibold text-white mb-2" style={{ fontFamily: 'var(--font-headline)' }}>
                    {step.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-white/50 text-[13px]" style={{ fontFamily: 'var(--font-body)', fontWeight: 300 }}>
                    {step.description}
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
