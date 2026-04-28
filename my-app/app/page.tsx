import { Navigation } from "@/components/navigation"
import { Hero } from "@/components/hero"
import { QuoteForm } from "@/components/quote-form"
import { Services } from "@/components/services"
import { About } from "@/components/about"
import { Footer } from "@/components/footer"
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navigation />
      <main>
        {/* BauPreis Hero Section */}
        <section className="flex flex-col items-center justify-center text-center px-6 py-24 bg-gradient-to-b from-blue-950 to-[#0a0a0a]">
          <div className="text-5xl mb-4">🏗️</div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Bau<span className="text-blue-400">Preis</span>
          </h1>
          <p className="text-lg text-blue-200 max-w-xl mb-2">
            Baumarkt-Preisvergleich im Rhein-Neckar-Kreis
          </p>
          <p className="text-sm text-zinc-400 max-w-md mb-10">
            Vergleiche Preise bei OBI, Bauhaus, Hornbach, Hagebau, Toom, Globus Bau und Hellweg –
            automatisch und in Echtzeit für Mannheim, Heidelberg und Ludwigshafen.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/register"
              className="px-7 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-500 transition-colors"
            >
              Kostenlos starten
            </Link>
            <Link
              href="/login"
              className="px-7 py-3 border border-white/20 text-white rounded-lg font-semibold hover:bg-white/10 transition-colors"
            >
              Anmelden
            </Link>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 px-6 bg-[#0a0a0a]">
          <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { emoji: "🔍", titel: "7 Baumärkte gleichzeitig", text: "Alle großen Baumärkte der Region in einem Vergleich" },
              { emoji: "⭐", titel: "Favoriten & Alarme", text: "Speichere Produkte und erhalte E-Mails bei Preissenkungen" },
              { emoji: "📊", titel: "Preisverlauf", text: "Verfolge Preishistorien mit interaktiven Charts" },
            ].map((f) => (
              <div key={f.titel} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-center">
                <div className="text-3xl mb-3">{f.emoji}</div>
                <p className="font-semibold text-white text-sm mb-1">{f.titel}</p>
                <p className="text-zinc-400 text-xs">{f.text}</p>
              </div>
            ))}
          </div>
        </section>

        <Hero />
        <QuoteForm />
        <Services />
        <About />
      </main>
      <Footer />
    </div>
  )
}
