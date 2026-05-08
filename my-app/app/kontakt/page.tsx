import type { Metadata } from "next"
import { Navigation } from "@/components/navigation-new"
import { Footer } from "@/components/footer-new"
import { ContactForm } from "@/components/contact-form"

export const metadata: Metadata = {
  title: "Kontakt | High-End Homes",
  description: "Kontaktieren Sie uns für Entrümpelung, Entkernung und Ausbau-Leistungen in Heidelberg und Mannheim.",
}

export default function KontaktPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navigation />
      <main className="pt-32 pb-16">
        <div className="section-padding">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6" style={{ fontFamily: 'var(--font-headline)', fontWeight: 300 }}>
                Kontakt
              </h1>
              <p className="text-xl text-white/70" style={{ fontFamily: 'var(--font-body)', fontWeight: 300 }}>
                Haben Sie Fragen? Wir sind für Sie da.
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
