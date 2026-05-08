import type { Metadata } from "next"
import { Navigation } from "@/components/navigation-new"
import { Footer } from "@/components/footer-new"
import { QuoteFormTabs } from "@/components/quote-form-tabs"

export const metadata: Metadata = {
  title: "Angebot einholen | High-End Homes",
  description: "Holen Sie sich jetzt ein unverbindliches Angebot für Entrümpelung, Entkernung oder Ausbau-Leistungen in Heidelberg und Mannheim.",
}

export default function AngebotPage() {
  return (
    <div className="min-h-screen bg-[#0A1628]">
      <Navigation />
      <main className="pt-24 pb-16">
        <div className="section-padding">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <p className="text-[#60A5FA] text-sm font-semibold uppercase tracking-wider mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Kostenlos & Unverbindlich
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
                Jetzt <span className="text-[#60A5FA]">Angebot einholen</span>
              </h1>
              <p className="text-xl text-white/70 max-w-3xl mx-auto" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Füllen Sie das Formular aus und erhalten Sie innerhalb von 24 Stunden ein transparentes und unverbindliches Angebot.
              </p>
            </div>

            {/* Quote Form with Tabs */}
            <QuoteFormTabs />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
