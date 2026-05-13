import type { Metadata } from "next"
import { Suspense } from "react"
import { Navigation } from "@/components/navigation-new"
import { Footer } from "@/components/footer-new"
import { QuoteFormTabs } from "@/components/quote-form-tabs-new"

export const metadata: Metadata = {
  title: "Angebot einholen | High-End Homes",
  description: "Hol dir jetzt ein unverbindliches Angebot für Entrümpelung, Entkernung oder Ausbau-Leistungen in Heidelberg und Mannheim.",
}

export default function AngebotPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navigation />
      <main className="pt-32 pb-16">
        <div className="section-padding">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
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
              <h1 className="text-4xl md:text-5xl lg:text-6xl text-white mb-6" style={{ fontFamily: 'var(--font-headline)', fontWeight: 300, letterSpacing: '0.02em' }}>
                Jetzt Angebot einholen
              </h1>
              <p className="text-xl max-w-3xl mx-auto" style={{ fontFamily: 'var(--font-body)', fontWeight: 300, color: 'rgba(255,255,255,0.65)', lineHeight: 1.7 }}>
                Füll das Formular aus und bekomm ein transparentes, unverbindliches Angebot.
              </p>
            </div>

            {/* Quote Form with Tabs */}
            <Suspense fallback={<div className="text-white text-center py-12">Lädt...</div>}>
              <QuoteFormTabs />
            </Suspense>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
