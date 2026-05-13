import Link from "next/link"
import { MapPin, CheckCircle2, Home, Trash2, Hammer, Building2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const serviceAreas = [
  "Heidelberg",
  "Mannheim",
  "Dossenheim",
  "Schriesheim",
  "Weinheim",
  "Leimen",
  "Eppelheim",
  "Schwetzingen",
  "Hockenheim",
  "Ladenburg",
  "Rhein-Neckar-Kreis",
]

const coreTopics = [
  {
    icon: Trash2,
    title: "Entrümpelung in Heidelberg & Mannheim",
    text: "Wir übernehmen Entrümpelungen von Wohnungen, Häusern, Kellern, Garagen und Gewerbeflächen. Von einzelnen Räumen bis zur kompletten Räumung bekommst du eine zügige, sauber geplante und fachgerechte Ausführung.",
  },
  {
    icon: Home,
    title: "Hausauflösung und Wohnungsauflösung",
    text: "Bei Hausauflösungen und Wohnungsauflösungen kümmern wir uns um Demontage, Sortierung, Abtransport und besenreine Übergabe. Auch kurzfristige Termine in Heidelberg, Mannheim und Umgebung sind möglich.",
  },
  {
    icon: Hammer,
    title: "Entkernung für Sanierung und Umbau",
    text: "Wenn vor einer Sanierung oder Modernisierung eine fachgerechte Entkernung nötig ist, entfernen wir Böden, Decken, nicht tragende Bauteile und Altmaterialien strukturiert und terminsicher.",
  },
]

const reasons = [
  "Schnelle Vor-Ort-Termine in Heidelberg, Mannheim und der Region",
  "Transparente Kalkulation für Entrümpelung, Hausauflösung und Entkernung",
  "Besenreine Übergabe und fachgerechte Entsorgung",
  "Privat- und Gewerbeobjekte jeder Größe",
]

const faqs = [
  {
    question: "Welche Leistungen bietet ihr in Heidelberg und Mannheim an?",
    answer: "Wir bieten Entrümpelung, Hausauflösung, Wohnungsauflösung und Entkernung für private und gewerbliche Objekte in Heidelberg, Mannheim und der gesamten Rhein-Neckar-Region an.",
  },
  {
    question: "Wie schnell kann eine Entrümpelung oder Hausauflösung starten?",
    answer: "Je nach Umfang sind kurzfristige Besichtigungen und schnelle Termine möglich. Nach deiner Anfrage melden wir uns zeitnah mit einer Einschätzung zum Aufwand und möglichen Startterminen.",
  },
  {
    question: "Übernehmt ihr auch Entkernungen vor Sanierungen?",
    answer: "Ja. Wir übernehmen Entkernungen für Wohnungen, Häuser, Büros und Gewerbeeinheiten und bereiten das Objekt strukturiert auf die nächsten Bau- oder Sanierungsschritte vor.",
  },
  {
    question: "In welchen Orten rund um Heidelberg seid ihr tätig?",
    answer: "Neben Heidelberg und Mannheim sind wir unter anderem in Dossenheim, Schriesheim, Weinheim, Leimen, Eppelheim, Schwetzingen, Ladenburg, Hockenheim und im gesamten Rhein-Neckar-Kreis im Einsatz.",
  },
]

const localLandingPages = [
  {
    href: "/entruempelung-heidelberg",
    title: "Entrümpelung Heidelberg",
    text: "Lokale Landingpage für Entrümpelung von Wohnung, Haus, Keller und Gewerbe in Heidelberg.",
  },
  {
    href: "/hausaufloesung-mannheim",
    title: "Hausauflösung Mannheim",
    text: "Spezifische Seite für Hausauflösungen und Wohnungsauflösungen in Mannheim.",
  },
  {
    href: "/entkernung-heidelberg",
    title: "Entkernung Heidelberg",
    text: "Landingpage für Entkernung vor Sanierung, Umbau und Modernisierung in Heidelberg.",
  },
]

export function SeoContent() {
  return (
    <section id="region" className="bg-[#0a0a0a] py-16">
      <div className="section-padding max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-4xl mx-auto space-y-5">
          <Badge className="bg-[#c9a45c]/10 text-[#c9a45c] border border-[#c9a45c]/30 hover:bg-[#c9a45c]/10">
            Regional stark in der Rhein-Neckar-Region
          </Badge>
          <h2 className="heading-glow text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            Entrümpelung, Hausauflösung und Entkernung in <span className="text-[#c9a45c]">Heidelberg, Mannheim und Umgebung</span>
          </h2>
          <p className="text-lg text-white/70 leading-relaxed">
            Wenn du einen zuverlässigen Fachbetrieb für Entrümpelung, Hausauflösung oder Entkernung suchst, ist High-End Homes dein Ansprechpartner in Heidelberg und der Metropolregion Rhein-Neckar. Wir unterstützen Eigentümer, Verwaltungen, Familien und Unternehmen bei Räumungen, Rückbauarbeiten und der professionellen Vorbereitung von Sanierungsprojekten.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {coreTopics.map((topic) => (
            <Card key={topic.title} className="bg-[#1a1a1a] border-[#2a2a2a] h-full">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-[#c9a45c]/10 flex items-center justify-center mb-4">
                  <topic.icon className="w-6 h-6 text-[#c9a45c]" />
                </div>
                <CardTitle className="text-xl text-white leading-snug">{topic.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-white/65 leading-7">{topic.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-6 items-start">
          <Card className="bg-[#1a1a1a] border-[#2a2a2a]">
            <CardHeader>
              <CardTitle className="text-2xl text-white">Warum Kunden aus Heidelberg, Mannheim und Umgebung uns wählen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-white/65 leading-7">
                Gerade bei sensiblen Projekten wie einer Hausauflösung, einer Wohnungsentrümpelung nach einem Umzug oder einer Entkernung vor dem Umbau zählt eine klare Organisation. Wir arbeiten effizient, respektvoll und mit Blick auf eine reibungslose Abwicklung.
              </p>
              <ul className="space-y-3">
                {reasons.map((reason) => (
                  <li key={reason} className="flex items-start gap-3 text-white/80">
                    <CheckCircle2 className="w-5 h-5 text-[#c9a45c] shrink-0 mt-0.5" />
                    <span className="leading-6">{reason}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-[#1a1a1a] border-[#2a2a2a]">
            <CardHeader>
              <CardTitle className="text-2xl text-white">Einsatzgebiet</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {serviceAreas.map((area) => (
                  <div
                    key={area}
                    className="inline-flex items-center gap-2 rounded-full border border-[#2a2a2a] bg-[#0f0f0f] px-3 py-2 text-sm text-white/80"
                  >
                    <MapPin className="w-4 h-4 text-[#c9a45c]" />
                    <span>{area}</span>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-sm text-white/60 leading-6">
                Du bist dir nicht sicher, ob dein Ort dazugehört? Frag einfach an. Wir betreuen Projekte im gesamten Umkreis von Heidelberg und Mannheim.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h3 className="text-2xl sm:text-3xl font-bold text-white">Häufige Fragen zu Entrümpelung, Hausauflösung und Entkernung</h3>
            <p className="text-white/65">
              Diese Antworten helfen Suchenden und verbessern gleichzeitig die thematische Relevanz der Seite für lokale Suchanfragen.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {faqs.map((faq) => (
              <Card key={faq.question} className="bg-[#1a1a1a] border-[#2a2a2a] h-full">
                <CardHeader>
                  <CardTitle className="text-lg text-white leading-7">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-white/65 leading-7">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h3 className="text-2xl sm:text-3xl font-bold text-white">Spezielle Landingpages für unsere Kernleistungen</h3>
            <p className="text-white/65">
              Für noch gezieltere Informationen zu Leistung und Ort findest du hier unsere lokalen Themenseiten.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {localLandingPages.map((page) => (
              <Card key={page.href} className="bg-[#1a1a1a] border-[#2a2a2a] h-full">
                <CardHeader>
                  <CardTitle className="text-xl text-white">{page.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-white/65 leading-7">{page.text}</p>
                  <Link
                    href={page.href}
                    className="inline-flex items-center text-sm font-medium text-[#c9a45c] transition-colors hover:text-[#d4af37]"
                  >
                    Zur Landingpage
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-[#2a2a2a] bg-[#121212] p-8 text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-14 h-14 rounded-full bg-[#c9a45c]/10 flex items-center justify-center">
              <Building2 className="w-7 h-7 text-[#c9a45c]" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white">Jetzt Angebot für Ihr Projekt in Heidelberg oder Mannheim anfragen</h3>
          <p className="max-w-3xl mx-auto text-white/65 leading-7">
            Ob Entrümpelung, Hausauflösung oder Entkernung: Über das Formular kannst du dein Projekt direkt anfragen. Je klarer die Angaben, desto schneller können wir den Aufwand einschätzen und dir ein passendes Angebot erstellen.
          </p>
          <a
            href="#quote"
            className="inline-flex items-center justify-center rounded-lg bg-[#c9a45c] px-6 py-3 font-semibold text-[#0a0a0a] transition-colors hover:bg-[#d4af37]"
          >
            Unverbindlich anfragen
          </a>
        </div>
      </div>
    </section>
  )
}
