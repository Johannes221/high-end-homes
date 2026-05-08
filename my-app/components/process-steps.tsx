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
    <section className="py-20 bg-[#0A1628]">
      <div className="section-padding">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <p className="text-[#60A5FA] text-sm font-semibold uppercase tracking-wider mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              So läuft's ab
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
              In 5 Schritten zum <span className="text-[#60A5FA]">fertigen Projekt</span>
            </h2>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <div key={index} className="relative flex flex-col items-center text-center">
                  {/* Connector Line (desktop only) */}
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-10 left-1/2 w-full h-0.5 bg-[#60A5FA]/20" />
                  )}
                  
                  {/* Circle with Icon */}
                  <div className="relative z-10 w-20 h-20 rounded-full bg-[#60A5FA] flex items-center justify-center mb-4 shadow-lg shadow-[#60A5FA]/30">
                    <Icon className="w-10 h-10 text-[#0A1628]" />
                  </div>
                  
                  {/* Step Number */}
                  <div className="text-[#60A5FA] text-sm font-bold mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    SCHRITT {index + 1}
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-lg font-semibold text-white mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    {step.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-white/60 text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>
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
