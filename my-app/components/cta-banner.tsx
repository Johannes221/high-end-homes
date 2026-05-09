"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CTABanner() {
  return (
    <section className="py-20 bg-[#0a0a0a] border-t border-b border-[rgba(255,255,255,0.08)]">
      <div className="section-padding">
        <div className="max-w-4xl mx-auto text-center">
          <p 
            className="text-[11px] font-semibold tracking-[0.3em] uppercase mb-6"
            style={{ 
              fontFamily: 'var(--font-headline)', 
              fontWeight: 600,
              color: 'rgba(255,255,255,0.5)'
            }}
          >
            KOSTENLOS & UNVERBINDLICH
          </p>
          <h2 className="heading-glow text-4xl md:text-5xl lg:text-6xl text-white mb-8" style={{ fontFamily: 'var(--font-headline)', fontWeight: 400, letterSpacing: '0.02em' }}>
            Jetzt Angebot anfragen
          </h2>
          <Link 
            href="/angebot" 
            className="inline-block px-8 py-3.5 bg-white text-black hover:bg-[rgba(255,255,255,0.9)] font-semibold transition-all"
            style={{ 
              fontFamily: 'var(--font-headline)', 
              fontWeight: 600, 
              letterSpacing: '0.05em',
              borderRadius: '3px'
            }}
          >
            Angebot einholen →
          </Link>
        </div>
      </div>
    </section>
  )
}
