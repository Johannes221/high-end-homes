"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CTABanner() {
  return (
    <section className="py-20 bg-gradient-to-br from-[#60A5FA]/10 to-[#0A1628]">
      <div className="section-padding">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
            Jetzt unverbindliches<br />
            <span className="text-[#60A5FA]">Angebot einholen</span>
          </h2>
          <p className="text-xl text-white/80 mb-8" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Kostenlose Beratung · Transparente Preise · Schnelle Umsetzung
          </p>
          <Button asChild size="lg" className="bg-[#60A5FA] text-[#0A1628] hover:bg-[#93C5FD] font-bold text-lg px-12 h-16 shadow-xl shadow-[#60A5FA]/30 border-0">
            <Link href="/angebot" className="flex items-center gap-2">
              Angebot anfragen
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
