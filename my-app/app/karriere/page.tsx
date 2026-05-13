import type { Metadata } from "next"
import { Navigation } from "@/components/navigation-new"
import { Footer } from "@/components/footer-new"
import { KarriereForm } from "@/components/karriere-form"

export const metadata: Metadata = {
  title: "Karriere bei High-End Homes – Maler, Trockenbauer, Fliesenleger",
  description:
    "Offene Stellen in Heidelberg, Mannheim und Umgebung. Maler & Lackierer, Trockenbauer und Fliesenleger gesucht. Faire Bezahlung, modernes Team.",
  alternates: { canonical: "/karriere" },
}

const jobs = [
  {
    title: "Maler & Lackierer (m/w/d)",
    summary: "Innen- und Außenarbeiten, Spachtelarbeiten, Tapezierarbeiten.",
    bullets: [
      "Saubere Ausführung an Privat- und Gewerbeobjekten",
      "Eigenständige Arbeit oder im 2er-Team",
      "Führerschein Klasse B von Vorteil",
    ],
  },
  {
    title: "Trockenbauer (m/w/d)",
    summary: "Wände, Decken, abgehängte Konstruktionen, Stuckarbeiten.",
    bullets: [
      "Erfahrung mit Metallständer- und Massivbau",
      "Akkurates Arbeiten nach Plan",
      "Eigenverantwortliche Baustellenbetreuung möglich",
    ],
  },
  {
    title: "Fliesenleger (m/w/d)",
    summary: "Bäder, Küchen, Terrassen – im Neubau und in der Sanierung.",
    bullets: [
      "Groß- und Kleinformat-Erfahrung",
      "Sauberes, präzises Fugenbild",
      "Selbstständige Arbeitsweise",
    ],
  },
]

export default function KarrierePage() {
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
              KARRIERE
            </p>
            <h1
              className="heading-glow text-4xl md:text-5xl lg:text-6xl mb-6"
              style={{ fontFamily: "var(--font-headline)", fontWeight: 300, letterSpacing: "0.02em" }}
            >
              Verstärken Sie unser Team
            </h1>
            <p
              className="text-base md:text-lg max-w-2xl mx-auto"
              style={{ fontFamily: "var(--font-body)", color: "rgba(255,255,255,0.6)" }}
            >
              Faire Bezahlung, planbare Baustellen, sauberes Arbeitsumfeld in Heidelberg, Mannheim & Umgebung.
            </p>
          </header>

          {/* Jobs */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
            {jobs.map((job) => (
              <article
                key={job.title}
                className="border p-7 transition-colors"
                style={{ borderColor: "rgba(255,255,255,0.08)", background: "var(--bg-2)" }}
              >
                <h2
                  className="text-lg mb-3"
                  style={{ fontFamily: "var(--font-headline)", fontWeight: 500 }}
                >
                  {job.title}
                </h2>
                <p
                  className="text-sm mb-5"
                  style={{ fontFamily: "var(--font-body)", color: "rgba(255,255,255,0.55)" }}
                >
                  {job.summary}
                </p>
                <ul className="space-y-2 mb-6">
                  {job.bullets.map((b) => (
                    <li
                      key={b}
                      className="text-sm pl-4 relative"
                      style={{ color: "rgba(255,255,255,0.7)" }}
                    >
                      <span
                        className="absolute left-0 top-2 w-2 h-px"
                        style={{ background: "#c9a45c" }}
                      />
                      {b}
                    </li>
                  ))}
                </ul>
                <a
                  href={`#bewerben`}
                  className="text-xs font-semibold tracking-[0.1em]"
                  style={{ fontFamily: "var(--font-headline)", color: "#c9a45c" }}
                >
                  Jetzt bewerben →
                </a>
              </article>
            ))}
          </section>

          {/* Form */}
          <section id="bewerben" className="scroll-mt-32">
            <div className="text-center mb-10">
              <p
                className="text-[11px] font-semibold tracking-[0.3em] uppercase mb-3"
                style={{ fontFamily: "var(--font-headline)", color: "rgba(255,255,255,0.5)" }}
              >
                BEWERBEN
              </p>
              <h2
                className="text-3xl md:text-4xl"
                style={{ fontFamily: "var(--font-headline)", fontWeight: 300, letterSpacing: "0.02em" }}
              >
                Schicken Sie uns Ihre Bewerbung
              </h2>
            </div>
            <div className="max-w-2xl mx-auto">
              <KarriereForm />
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
