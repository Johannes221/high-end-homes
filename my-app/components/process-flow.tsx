"use client"

import { FileText, CheckCircle, User, Clock, Zap } from "lucide-react"

const steps = [
  {
    icon: FileText,
    title: "Angebot anfragen",
    description: "Unverbindlich über das Formular mit Infos & Bildern",
  },
  {
    icon: CheckCircle,
    title: "Angebot erhalten",
    description: "Preisspanne, Kostenauflistung & geschätzte Dauer",
  },
  {
    icon: User,
    title: "Besichtigung",
    description: "Unser Geschäftsführer berät vor Ort zum Umfang & Preis",
  },
  {
    icon: Clock,
    title: "Start in Tagen",
    description: "Nach Beauftragung geht es in wenigen Tagen los",
  },
  {
    icon: Zap,
    title: "Schneller als andere",
    description: "Tage statt Wochen, Wochen statt Monaten",
  },
]

export function ProcessFlow() {
  return (
    <section className="relative bg-[#0a0a0a] py-16 overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-[#1a1a1a] via-[#0a0a0a] to-[#0a0a0a]" />
      
      {/* Gold accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 pointer-events-none bg-gradient-to-r from-transparent via-[#c9a45c] to-transparent" />

      <div className="relative z-10 px-4 sm:px-6 lg:px-8 w-full max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            So geht's
          </h2>
          <p className="text-white/60 text-lg">
            Ihr Projekt in 5 einfachen Schritten
          </p>
        </div>

        <div className="relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-12 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#c9a45c]/50 to-transparent" />

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <div key={index} className="relative flex flex-col items-center text-center">
                  {/* Icon circle */}
                  <div className="relative z-10 w-24 h-24 rounded-full bg-[#1a1a1a] border-2 border-[#c9a45c] flex items-center justify-center mb-4 shadow-lg shadow-[#c9a45c]/20">
                    <Icon className="w-10 h-10 text-[#c9a45c]" />
                  </div>

                  {/* Step number */}
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[#c9a45c] text-[#0a0a0a] font-bold text-sm flex items-center justify-center">
                    {index + 1}
                  </div>

                  {/* Content */}
                  <h3 className="text-white font-semibold text-lg mb-2">
                    {step.title}
                  </h3>
                  <p className="text-white/60 text-sm leading-relaxed">
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
