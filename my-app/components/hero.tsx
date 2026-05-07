"use client"

import { ArrowRight, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section id="hero" className="relative bg-[#0a0a0a] pt-16 pb-8 overflow-hidden">
      {/* Subtle gradient background - no images */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-[#1a1a1a] via-[#0a0a0a] to-[#0a0a0a]" />
      
      {/* Gold accent line at top */}
      <div className="absolute top-0 left-0 right-0 h-1 pointer-events-none bg-gradient-to-r from-transparent via-[#c9a45c] to-transparent" />

      {/* Content */}
      <div className="relative z-10 px-4 sm:px-6 lg:px-8 w-full max-w-6xl mx-auto">
        {/* Main Content Stack */}
        <div className="flex flex-col items-center text-center space-y-6 py-8">
          

          {/* Main Headline */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
              Entrümpelung, Hausauflösung &<br />
              <span className="text-[#c9a45c]">Entkernung in Heidelberg</span>
            </h1>
            <p className="text-xl sm:text-2xl text-white/80 font-light">
              Heidelberg · Mannheim · Rhein-Neckar · schnell · sauber · präzise
            </p>
          </div>

          {/* Description */}
          <p className="text-lg text-white/60 max-w-2xl">
            Ihr zuverlässiger Partner für professionelle Entrümpelung, Hausauflösung und Entkernung 
            in Heidelberg, Mannheim und Umgebung. Schnell vor Ort, transparent kalkuliert und auf Wunsch mit besenreiner Übergabe.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <Button
              asChild
              size="lg"
              className="bg-[#c9a45c] text-[#0a0a0a] hover:bg-[#d4af37] font-bold text-lg px-8 h-12 shadow-lg shadow-[#c9a45c]/20"
            >
              <a href="?tab=entruempelung#quote" className="flex items-center gap-2">
                Angebot Entrümpelung
                <ArrowRight className="w-5 h-5" />
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              className="bg-[#c9a45c] text-[#0a0a0a] hover:bg-[#d4af37] font-bold text-lg px-8 h-12 shadow-lg shadow-[#c9a45c]/20"
            >
              <a href="?tab=entkernung#quote" className="flex items-center gap-2">
                Angebot Entkernung
                <ArrowRight className="w-5 h-5" />
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white/30 text-white hover:bg-white/10 h-12 px-6 text-lg"
            >
              <a href="tel:+491234567890" className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                Direkt anrufen
              </a>
            </Button>
          </div>

        </div>

      </div>
    </section>
  )
}
