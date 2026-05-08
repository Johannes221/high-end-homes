import type { Metadata } from "next"
import { Navigation } from "@/components/navigation-new"
import { Footer } from "@/components/footer-new"
import { MapPin } from "lucide-react"

export const metadata: Metadata = {
  title: "Unser Einsatzgebiet | High-End Homes",
  description: "Wir sind in Heidelberg, Mannheim und der gesamten Rhein-Neckar-Region für Sie da.",
}

const regions = [
  "Heidelberg",
  "Mannheim",
  "Dossenheim",
  "Schriesheim",
  "Weinheim",
  "Leimen",
  "Eppelheim",
  "Schwetzingen",
  "Ladenburg",
  "Hockenheim",
  "Rhein-Neckar-Kreis",
]

export default function RegionPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navigation />
      <main className="pt-32 pb-16">
        <div className="section-padding">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-8" style={{ fontFamily: 'var(--font-headline)', fontWeight: 300 }}>
              Unser Einsatzgebiet
            </h1>
            <p className="text-xl text-white/70 mb-12" style={{ fontFamily: 'var(--font-body)', fontWeight: 300 }}>
              Wir sind in der gesamten Rhein-Neckar-Region für Sie da – schnell, zuverlässig und professionell.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {regions.map((region) => (
                <div
                  key={region}
                  className="flex items-center gap-3 bg-[#111111] border border-[rgba(255,255,255,0.06)] p-4"
                >
                  <MapPin className="w-5 h-5 text-white flex-shrink-0" />
                  <span className="text-white/80 text-lg" style={{ fontFamily: 'var(--font-body)', fontWeight: 300 }}>
                    {region}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-12 bg-[#111111] border border-[rgba(255,255,255,0.06)] p-8">
              <h2 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-headline)' }}>
                Nicht in der Liste?
              </h2>
              <p className="text-white/70" style={{ fontFamily: 'var(--font-body)', fontWeight: 300 }}>
                Kontaktieren Sie uns gerne – wir prüfen, ob wir auch in Ihrer Region tätig werden können.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
