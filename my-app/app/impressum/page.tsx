import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Impressum | High-End Homes",
  description: "Impressum und rechtliche Informationen von High-End Homes",
}

export default function ImpressumPage() {
  return (
    <div className="min-h-screen bg-black py-24">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold text-[#c9a45c] mb-8">
          Impressum
        </h1>

        <div className="space-y-8 text-white/80">
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              Angaben gemäß § 5 TMG
            </h2>
            <p className="leading-relaxed">
              High-End Homes GmbH
              <br />
              Musterstraße 123
              <br />
              69115 Heidelberg
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              Vertreten durch
            </h2>
            <p className="leading-relaxed">Geschäftsführer: Bennet Pfeifer</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Kontakt</h2>
            <p className="leading-relaxed">
              E-Mail: bennet.pfeifer@highendhomes.de
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              Registereintrag
            </h2>
            <p className="leading-relaxed">
              Eintragung im Handelsregister
              <br />
              Registergericht: Amtsgericht Mannheim
              <br />
              Registernummer: HRB 123456
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              Umsatzsteuer-ID
            </h2>
            <p className="leading-relaxed">
              Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:
              <br />
              DE123456789
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV
            </h2>
            <p className="leading-relaxed">
              Bennet Pfeifer
              <br />
              Musterstraße 123
              <br />
              69115 Heidelberg
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              EU-Streitschlichtung
            </h2>
            <p className="leading-relaxed">
              Die Europäische Kommission stellt eine Plattform zur
              Online-Streitbeilegung (OS) bereit:{" "}
              <a
                href="https://ec.europa.eu/consumers/odr/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#c9a45c] hover:underline"
              >
                https://ec.europa.eu/consumers/odr/
              </a>
              .
              <br />
              Unsere E-Mail-Adresse finden Sie oben im Impressum.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              Verbraucherstreitbeilegung/Universalschlichtungsstelle
            </h2>
            <p className="leading-relaxed">
              Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren
              vor einer Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
