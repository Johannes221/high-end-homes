"use client"

import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export function Hero() {
  return (
    <section id="hero" className="relative bg-[#0A1628] pt-20 pb-12 overflow-hidden">
      {/* Villa Background Image */}
      <div className="absolute inset-0 z-0">
        <div className="relative w-full h-full">
          <Image
            src="/villa-bild.png"
            alt="Luxuriöse Villa bei Nacht"
            fill
            className="object-cover opacity-30"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A1628]/80 via-[#0A1628]/60 to-[#0A1628]" />
        </div>
      </div>
      
      {/* Accent line at top */}
      <div className="absolute top-0 left-0 right-0 h-1 pointer-events-none bg-gradient-to-r from-transparent via-[#60A5FA] to-transparent z-10" />

      {/* Content */}
      <div className="relative z-10 px-4 sm:px-6 lg:px-8 w-full max-w-6xl mx-auto">
        <div className="flex flex-col items-center text-center space-y-8 py-16">
          
          {/* Main Headline */}
          <div className="space-y-6">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
              Ihr Haus.<br />
              <span className="text-[#60A5FA]">Eine Adresse.</span>
            </h1>
            <p className="text-xl sm:text-2xl md:text-3xl text-white/90 font-light" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Von der Entrümpelung bis zum fertigen Ausbau – alles aus einer Hand.<br />
              <span className="text-[#60A5FA]">In Heidelberg, Mannheim & Umgebung.</span>
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button
              asChild
              size="lg"
              className="bg-[#60A5FA] text-[#0A1628] hover:bg-[#93C5FD] font-bold text-lg px-10 h-14 shadow-lg shadow-[#60A5FA]/30 border-0"
            >
              <a href="/angebot" className="flex items-center gap-2">
                Angebot einholen
                <ArrowRight className="w-5 h-5" />
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-[#60A5FA] text-white hover:bg-[#60A5FA]/10 h-14 px-8 text-lg"
            >
              <a href="#villa-services">
                Leistungen entdecken
              </a>
            </Button>
          </div>

        </div>
      </div>

      {/* Accent line at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-1 pointer-events-none bg-gradient-to-r from-transparent via-[#60A5FA] to-transparent z-10" />
    </section>
  )
}
