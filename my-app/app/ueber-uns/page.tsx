import type { Metadata } from "next"
import { Navigation } from "@/components/navigation-new"
import { Footer } from "@/components/footer-new"

export const metadata: Metadata = {
  title: "Über uns | High-End Homes",
  description: "High-End Homes – Ihr Innenausbau- und Renovierungsbetrieb in Heidelberg, Mannheim und der Rhein-Neckar-Region.",
}

export default function UeberUnsPage() {
  return (
    <div className="min-h-screen bg-[#050A20]">
      <Navigation />
      <main className="pt-32 pb-16">
        <div className="section-padding">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl text-white mb-8" style={{ fontFamily: 'var(--font-headline)', fontWeight: 300, letterSpacing: '0.02em' }}>
              Über High-End Homes
            </h1>
            <div className="space-y-6" style={{ fontFamily: 'var(--font-body)', fontWeight: 300, color: 'rgba(255,255,255,0.65)' }}>
              <p className="text-xl leading-relaxed">
                High-End Homes ist Ihr Innenausbau- und Renovierungsbetrieb in der Rhein-Neckar-Region. Unser Schwerpunkt liegt auf Renovierung, Modernisierung und Innenausbau für Wohn- und Gewerbeobjekte.
              </p>
              <p className="text-lg leading-relaxed">
                Wir stehen für Qualität, Professionalität und Detailgenauigkeit. Unser Anspruch: modern, transparent und zuverlässig – von der ersten Anfrage bis zur sauberen Übergabe.
              </p>
              <h2 className="text-2xl text-white mt-12 mb-4" style={{ fontFamily: 'var(--font-headline)', fontWeight: 400 }}>
                Unsere Eigenleistungen
              </h2>
              <p className="text-lg leading-relaxed">
                Unser eigenes Team übernimmt Renovierungs- und Innenausbauarbeiten: Maler- und Lackierarbeiten, Bodenverlegung, Wand- und Deckenausbau, Spachtelarbeiten und Montage. Dazu kommen Entrümpelung, Hausauflösung und Rückbau.
              </p>
              <h2 className="text-2xl text-white mt-12 mb-4" style={{ fontFamily: 'var(--font-headline)', fontWeight: 400 }}>
                Komplettprojekte über unser Partnernetzwerk
              </h2>
              <p className="text-lg leading-relaxed">
                Bei größeren Vorhaben übernehmen wir Planung und Koordination. Genehmigungs- und meisterpflichtige Gewerke wie Elektro, Sanitär und Heizung führen wir nicht selbst aus, sondern vergeben sie an geprüfte Fachbetriebe und steuern deren Einsatz. Für Sie bleibt es bei einem Ansprechpartner.
              </p>
              <h2 className="text-2xl text-white mt-12 mb-4" style={{ fontFamily: 'var(--font-headline)', fontWeight: 400 }}>
                Unsere Zielgruppe
              </h2>
              <p className="text-lg leading-relaxed">
                Wir arbeiten für Privatkunden, Hausverwaltungen und Unternehmen in Heidelberg, Mannheim, Dossenheim und der gesamten Rhein-Neckar-Region.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
