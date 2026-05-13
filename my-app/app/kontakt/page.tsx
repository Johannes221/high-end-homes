import type { Metadata } from "next"
import { Navigation } from "@/components/navigation-new"
import { Footer } from "@/components/footer-new"
import { ContactForm } from "@/components/contact-form"

export const metadata: Metadata = {
  title: "Kontakt | High-End Homes",
  description: "Kontaktier uns für Entrümpelung, Entkernung und Ausbau-Leistungen in Heidelberg und Mannheim.",
}

export default function KontaktPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navigation />
      <main className="pt-32 pb-16">
        <div className="section-padding">
          <div className="max-w-4xl mx-auto">
            <div className="mb-12">
              <h1 className="text-5xl md:text-6xl text-white mb-6" style={{ fontFamily: 'var(--font-headline)', fontWeight: 300, letterSpacing: '0.02em' }}>
                Kontakt
              </h1>
              <p className="text-xl" style={{ fontFamily: 'var(--font-body)', fontWeight: 300, color: 'rgba(255,255,255,0.65)', lineHeight: 1.7 }}>
                Hast du Fragen? Wir sind für dich da.
              </p>
            </div>
            
            <ContactForm />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
