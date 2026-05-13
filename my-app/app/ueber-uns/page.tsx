import type { Metadata } from "next"
import { Navigation } from "@/components/navigation-new"
import { Footer } from "@/components/footer-new"

export const metadata: Metadata = {
  title: "Über uns | High-End Homes",
  description: "Erfahren Sie mehr über High-End Homes - Ihr Partner für Entrümpelung, Entkernung und Ausbau in Heidelberg und Mannheim.",
}

export default function UeberUnsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navigation />
      <main className="pt-32 pb-16">
        <div className="section-padding">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl text-white mb-8" style={{ fontFamily: 'var(--font-headline)', fontWeight: 300, letterSpacing: '0.02em' }}>
              Über High-End Homes
            </h1>
            <div className="space-y-6" style={{ fontFamily: 'var(--font-body)', fontWeight: 300, color: 'rgba(255,255,255,0.65)' }}>
              <p className="text-xl leading-relaxed">
                High-End Homes ist Ihr zuverlässiger Partner für Entrümpelung, Hausauflösung, Entkernung und Ausbau-Leistungen in der Rhein-Neckar-Region.
              </p>
              <p className="text-lg leading-relaxed">
                Wir stehen für Qualität, Professionalität und Detailgenauigkeit. Unser Anspruch: Modern, transparent und zuverlässig – von der ersten Anfrage bis zur besenreinen Übergabe.
              </p>
              <p className="text-lg leading-relaxed">
                Wir bieten Ihnen alles aus einer Hand: Von der Entrümpelung über die Entkernung bis hin zu allen Ausbau-Leistungen wie Maler, Trockenbau, Fliesenleger, Sanitär & Elektro sowie Fensterbau.
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
