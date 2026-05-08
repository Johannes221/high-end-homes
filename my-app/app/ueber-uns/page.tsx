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
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-8" style={{ fontFamily: 'var(--font-headline)', fontWeight: 300 }}>
              Über uns
            </h1>
            <div className="space-y-6 text-white/70" style={{ fontFamily: 'var(--font-body)', fontWeight: 300 }}>
              <p className="text-xl">
                High-End Homes ist Ihr zuverlässiger Partner für Entrümpelung, Hausauflösung, Entkernung und Ausbau-Leistungen in der Rhein-Neckar-Region.
              </p>
              <p className="text-lg">
                Mit über 500 erfolgreich abgeschlossenen Projekten in Heidelberg, Mannheim und Umgebung haben wir uns als verlässlicher Partner etabliert. Unser Anspruch: Schnell, transparent und professionell – von der ersten Anfrage bis zur besenreinen Übergabe.
              </p>
              <p className="text-lg">
                Wir bieten Ihnen alles aus einer Hand: Von der Entrümpelung über die Entkernung bis hin zu allen Ausbau-Leistungen wie Maler, Trockenbau, Fliesenleger, Sanitär & Elektro sowie Fensterbau.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
