import type { Metadata } from "next"
import { Navigation } from "@/components/navigation-new"
import { Footer } from "@/components/footer-new"
import { PartnerForm } from "@/components/partner-form"

export const metadata: Metadata = {
  title: "Partner & Subunternehmer – High-End Homes",
  description:
    "Subunternehmer und Handwerksbetriebe gesucht: Maler, Trockenbau, Sanitär, Elektro, Fensterbau und mehr. Langfristige Zusammenarbeit im Raum Heidelberg & Mannheim.",
  alternates: { canonical: "/partner" },
}

const benefits = [
  {
    title: "Planbare Auslastung",
    text: "Wiederkehrende Projekte über das ganze Jahr – Sanierung, Ausbau, Komplettmaßnahmen.",
  },
  {
    title: "Faire Konditionen",
    text: "Transparente Abrechnung, pünktliche Zahlungen, klare Leistungsbeschreibung.",
  },
  {
    title: "Ein Ansprechpartner",
    text: "Koordination, Termine und Übergabe laufen über uns. Sie machen Ihre Arbeit.",
  },
]

export default function PartnerPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navigation />

      <main className="pt-32 pb-24">
        <div className="section-padding max-w-5xl mx-auto">
          {/* Header */}
          <header className="text-center mb-16">
            <p
              className="text-[11px] font-semibold tracking-[0.3em] uppercase mb-4"
              style={{ fontFamily: "var(--font-headline)", color: "rgba(255,255,255,0.5)" }}
            >
              PARTNER & SUBUNTERNEHMER
            </p>
            <h1
              className="heading-glow text-4xl md:text-5xl lg:text-6xl mb-6"
              style={{ fontFamily: "var(--font-headline)", fontWeight: 300, letterSpacing: "0.02em" }}
            >
              Lassen Sie uns zusammenarbeiten
            </h1>
            <p
              className="text-base md:text-lg max-w-2xl mx-auto"
              style={{ fontFamily: "var(--font-body)", color: "rgba(255,255,255,0.6)" }}
            >
              Wir suchen verlässliche Handwerksbetriebe und Subunternehmer im Raum Heidelberg, Mannheim & Umgebung.
            </p>
          </header>

          {/* Benefits */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
            {benefits.map((b) => (
              <article
                key={b.title}
                className="border p-7"
                style={{ borderColor: "rgba(255,255,255,0.08)", background: "var(--bg-2)" }}
              >
                <h2 className="text-lg mb-3" style={{ fontFamily: "var(--font-headline)", fontWeight: 500 }}>
                  {b.title}
                </h2>
                <p className="text-sm" style={{ fontFamily: "var(--font-body)", color: "rgba(255,255,255,0.6)" }}>
                  {b.text}
                </p>
              </article>
            ))}
          </section>

          {/* Form */}
          <section id="anfragen" className="scroll-mt-32">
            <div className="text-center mb-10">
              <p
                className="text-[11px] font-semibold tracking-[0.3em] uppercase mb-3"
                style={{ fontFamily: "var(--font-headline)", color: "rgba(255,255,255,0.5)" }}
              >
                KONTAKT
              </p>
              <h2
                className="text-3xl md:text-4xl"
                style={{ fontFamily: "var(--font-headline)", fontWeight: 300, letterSpacing: "0.02em" }}
              >
                Stellen Sie sich vor
              </h2>
            </div>
            <div className="max-w-2xl mx-auto">
              <PartnerForm />
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
