"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CTABanner() {
  return (
    <section className="py-20 bg-[#0a0a0a] border-t border-b border-[rgba(255,255,255,0.08)]">
      <div className="section-padding">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8" style={{ fontFamily: 'var(--font-headline)' }}>
            Jetzt unverbindliches Angebot einholen
          </h2>
          <Button asChild size="lg" className="bg-white text-black hover:bg-white/90 font-bold text-lg px-12 h-16 border-0 rounded-sm" style={{ fontFamily: 'var(--font-headline)' }}>
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
