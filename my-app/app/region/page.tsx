import type { Metadata } from "next"
import { Navigation } from "@/components/navigation-new"
import { Footer } from "@/components/footer-new"
import { MapPin } from "lucide-react"

export const metadata: Metadata = {
  title: "Unser Einsatzgebiet | High-End Homes",
  description: "Wir sind in Heidelberg, Mannheim und der gesamten Rhein-Neckar-Region für dich da.",
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
            <h1 className="text-5xl md:text-6xl text-white mb-8" style={{ fontFamily: 'var(--font-headline)', fontWeight: 300, letterSpacing: '0.02em' }}>
              Unser Einsatzgebiet
            </h1>
            <p className="text-xl mb-12" style={{ fontFamily: 'var(--font-body)', fontWeight: 300, color: 'rgba(255,255,255,0.65)', lineHeight: 1.7 }}>
              Wir sind in der gesamten Rhein-Neckar-Region für dich da – schnell, zuverlässig und professionell.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {regions.map((region) => (
                <div
                  key={region}
                  className="flex items-center gap-3 bg-[var(--bg-2)] border p-4"
                  style={{ borderColor: 'rgba(255,255,255,0.06)' }}
                >
                  <span className="text-lg" style={{ fontFamily: 'var(--font-body)', fontWeight: 300, color: 'rgba(255,255,255,0.7)' }}>
                    {region}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-12 bg-[var(--bg-2)] border p-8" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
              <h2 className="text-2xl text-white mb-4" style={{ fontFamily: 'var(--font-headline)', fontWeight: 400 }}>
                Du bist dir nicht sicher, ob dein Ort dazugehört?
              </h2>
              <p style={{ fontFamily: 'var(--font-body)', fontWeight: 300, color: 'rgba(255,255,255,0.55)' }}>
                Frag einfach an. Wir prüfen gerne, ob wir auch in deiner Region tätig werden können.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
