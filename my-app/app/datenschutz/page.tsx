import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Datenschutzerklärung | High-End Homes",
  description: "Informationen zur Verarbeitung Ihrer personenbezogenen Daten durch High-End Homes.",
  robots: {
    index: true,
    follow: true,
  },
}

export default function DatenschutzPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <h1 className="text-4xl font-bold mb-8 tracking-[0.1em]" style={{ fontFamily: 'var(--font-headline)' }}>
          Datenschutzerklärung
        </h1>

        <div className="prose prose-invert prose-lg max-w-none space-y-8" style={{ fontFamily: 'var(--font-body)', fontWeight: 300 }}>
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-[#c9a45c]">1. Verantwortlicher</h2>
            <p className="text-white/80">
              Verantwortlich für die Datenverarbeitung ist:
            </p>
            <p className="text-white/80 mt-2">
              Bennet Pfeifer<br />
              Gerhard-Hauptmann-Straße 38<br />
              69221 Dossenheim<br />
              Deutschland<br />
              E-Mail: bennet.pfeifer@highendhomes.de
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-[#c9a45c]">2. Übersicht der Datenverarbeitung</h2>
            <p className="text-white/80">
              Wir verarbeiten personenbezogene Daten im Rahmen unserer Geschäftsprozesse, insbesondere für:
            </p>
            <ul className="list-disc pl-6 text-white/80 mt-2 space-y-1">
              <li>Bearbeitung von Angebotsanfragen (Entrümpelung, Hausauflösung, Entkernung)</li>
              <li>User-Registrierung und Login für den internen Bereich</li>
              <li>Kommunikation per E-Mail</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-[#c9a45c]">3. Kategorien personenbezogener Daten</h2>
            
            <h3 className="text-xl font-semibold mb-2 mt-6 text-white">3.1 Daten aus Angebotsanfragen</h3>
            <p className="text-white/80">
              Bei Anfragen über unser Kontaktformular werden folgende Daten verarbeitet:
            </p>
            <ul className="list-disc pl-6 text-white/80 mt-2 space-y-1">
              <li>Name</li>
              <li>E-Mail-Adresse</li>
              <li>Telefonnummer (optional)</li>
              <li>Firma (optional)</li>
              <li>Adresse (optional)</li>
              <li>Projektdetails: Quadratmeter, Gebäudetyp, Baujahr, Etage, Aufzug (optional)</li>
              <li>Materialien und zu entfernende Gegenstände</li>
              <li>Bilder (als Base64-codierte Daten)</li>
              <li>Gewünschtes Ausführungsdatum (optional)</li>
              <li>Weitere Notizen (optional)</li>
            </ul>

            <h3 className="text-xl font-semibold mb-2 mt-6 text-white">3.2 User-Registrierungsdaten</h3>
            <p className="text-white/80">
              Bei Registrierung für den internen Bereich werden folgende Daten verarbeitet:
            </p>
            <ul className="list-disc pl-6 text-white/80 mt-2 space-y-1">
              <li>Name (optional)</li>
              <li>E-Mail-Adresse</li>
              <li>Passwort (gehasht mit bcrypt)</li>
              <li>Erstellungsdatum</li>
            </ul>

            <h3 className="text-xl font-semibold mb-2 mt-6 text-white">3.3 Sitzungsdaten</h3>
            <p className="text-white/80">
              Für die Authentifizierung verwenden wir NextAuth v5 mit JWT-Sessions:
            </p>
            <ul className="list-disc pl-6 text-white/80 mt-2 space-y-1">
              <li>Session-Cookies für Login-Status</li>
              <li>JWT-Token mit User-ID und E-Mail</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-[#c9a45c]">4. Zwecke der Datenverarbeitung</h2>
            <ul className="list-disc pl-6 text-white/80 space-y-1">
              <li>Erstellung und Zusendung von Angeboten</li>
              <li>Ausführung von Aufträgen (Entrümpelung, Hausauflösung, Entkernung)</li>
              <li>Kommunikation mit Kunden</li>
              <li>Authentifizierung und Zugriffskontrolle für den internen Bereich</li>
              <li>Buchhaltung und Dokumentation</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-[#c9a45c]">5. Rechtsgrundlagen</h2>
            <p className="text-white/80">
              Die Datenverarbeitung erfolgt auf folgenden Rechtsgrundlagen gemäß Art. 6 DSGVO:
            </p>
            <ul className="list-disc pl-6 text-white/80 mt-2 space-y-1">
              <li><strong>Art. 6 Abs. 1 lit. b DSGVO:</strong> Erfüllung von Verträgen oder vorvertraglicher Maßnahmen (Angebotsanfragen)</li>
              <li><strong>Art. 6 Abs. 1 lit. f DSGVO:</strong> Berechtigte Interessen (Kommunikation, Buchhaltung)</li>
              <li><strong>Art. 6 Abs. 1 lit. c DSGVO:</strong> Erfüllung gesetzlicher Pflichten (Aufbewahrungsfristen)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-[#c9a45c]">6. Speicherdauer</h2>
            <p className="text-white/80">
              Wir speichern Ihre Daten nur so lange, wie dies für die oben genannten Zwecke erforderlich ist:
            </p>
            <ul className="list-disc pl-6 text-white/80 mt-2 space-y-1">
              <li>Angebotsanfragen: bis zum Abschluss des Projekts oder maximal 3 Jahre nach letzter Kontaktaufnahme</li>
              <li>User-Accounts: bis zur Löschung durch den User</li>
              <li>Rechnungen und Buchungsbelege: gesetzliche Aufbewahrungsfrist von 10 Jahren (§ 257 HGB, § 147 AO)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-[#c9a45c]">7. Empfänger von Daten</h2>
            <p className="text-white/80">
              Ihre Daten werden nicht an Dritte weitergegeben. Eine Übermittlung erfolgt nur:
            </p>
            <ul className="list-disc pl-6 text-white/80 mt-2 space-y-1">
              <li>An Auftragsverarbeiter (Hosting-Provider, Datenbank-Provider) zur technischen Bereitstellung</li>
              <li>An gesetzlich vorgeschriebene Stellen (z.B. Finanzamt) bei Vorliegen gesetzlicher Verpflichtungen</li>
            </ul>
            <p className="text-white/80 mt-2">
              Es erfolgt keine Übermittlung in Drittstaaten außerhalb des Europäischen Wirtschaftsraums (EWR).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-[#c9a45c]">8. Cookies</h2>
            <p className="text-white/80">
              Wir verwenden ausschließlich technisch notwendige Cookies für die Authentifizierung (NextAuth-Sessions). 
              Es werden keine Tracking-Cookies oder Analyse-Tools eingesetzt.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-[#c9a45c]">9. Ihre Rechte</h2>
            <p className="text-white/80">
              Sie haben gegenüber uns folgende Rechte gemäß DSGVO:
            </p>
            <ul className="list-disc pl-6 text-white/80 mt-2 space-y-1">
              <li><strong>Recht auf Auskunft:</strong> Sie können Auskunft über die über Sie gespeicherten Daten verlangen.</li>
              <li><strong>Recht auf Berichtigung:</strong> Sie können die Berichtigung unrichtiger Daten verlangen.</li>
              <li><strong>Recht auf Löschung:</strong> Sie können die Löschung Ihrer Daten verlangen, soweit keine gesetzlichen Aufbewahrungspflichten entgegenstehen.</li>
              <li><strong>Recht auf Einschränkung:</strong> Sie können die Einschränkung der Verarbeitung verlangen.</li>
              <li><strong>Recht auf Datenübertragbarkeit:</strong> Sie können die Übermittlung Ihrer Daten an einen anderen Verantwortlichen verlangen.</li>
              <li><strong>Widerspruchsrecht:</strong> Sie können der Verarbeitung widersprechen, soweit diese auf Art. 6 Abs. 1 lit. f DSGVO beruht.</li>
            </ul>
            <p className="text-white/80 mt-2">
              Zur Ausübung dieser Rechte wenden Sie sich bitte per E-Mail an: bennet.pfeifer@highendhomes.de
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-[#c9a45c]">10. Beschwerderecht</h2>
            <p className="text-white/80">
              Sie haben das Recht, sich bei einer Aufsichtsbehörde über die Verarbeitung Ihrer personenbezogenen Daten zu beschweren. 
              Zuständige Behörde ist:
            </p>
            <p className="text-white/80 mt-2">
              Der Landesbeauftragte für den Datenschutz und die Informationsfreiheit Rheinland-Pfalz<br />
              Postfach 30 40<br />
              55023 Mainz<br />
              Tel: 06131/208-2449<br />
              E-Mail: poststelle@ldi.rlp.de
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-[#c9a45c]">11. Änderungen dieser Datenschutzerklärung</h2>
            <p className="text-white/80">
              Wir behalten uns vor, diese Datenschutzerklärung bei Änderungen der gesetzlichen Anforderungen oder unserer Geschäftsprozesse anzupassen. 
              Die aktuelle Version ist auf unserer Website einsehbar.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-[#c9a45c]">12. Stand</h2>
            <p className="text-white/80">
              Stand dieser Datenschutzerklärung: Mai 2026
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
