"use client"

import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export function Hero() {
  return (
    <>
      {/* Hero Text Section */}
      <section id="hero" className="relative bg-[#0a0a0a] pt-32 pb-16 overflow-hidden">
        <div className="relative z-10 px-4 sm:px-6 lg:px-8 w-full max-w-6xl mx-auto">
          <div className="flex flex-col items-center text-center space-y-12">
            
            {/* Main Headline */}
            <div className="space-y-8">
              <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-white leading-[1.1]" style={{ fontFamily: 'var(--font-headline)', fontWeight: 300 }}>
                Ihr Haus.<br />
                Eine Adresse.
              </h1>
              <p className="text-xl sm:text-2xl md:text-2xl text-white/70 font-light max-w-3xl mx-auto" style={{ fontFamily: 'var(--font-body)', fontWeight: 300 }}>
                Von der Entrümpelung bis zum fertigen Ausbau – alles aus einer Hand.<br />
                In Heidelberg, Mannheim & Umgebung.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-8">
              <Button
                asChild
                size="lg"
                className="bg-white text-black hover:bg-white/90 font-bold text-lg px-12 h-16 border-0 rounded-sm"
                style={{ fontFamily: 'var(--font-headline)' }}
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
                className="border border-white/30 text-white hover:bg-white/5 h-16 px-10 text-lg rounded-sm"
                style={{ fontFamily: 'var(--font-headline)' }}
              >
                <a href="#villa-services">
                  Leistungen entdecken
                </a>
              </Button>
            </div>

          </div>
        </div>
      </section>

      {/* Full Width Building Image */}
      <section className="relative w-full h-screen">
        <Image
          src="/villa-bild.png"
          alt="Luxuriöse Villa bei Nacht"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(10,10,10,0.4)] to-[rgba(10,10,10,1)]" />
      </section>
    </>
  )
}
