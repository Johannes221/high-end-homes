"use client"


import { 
  Trash2, 
  Building2, 
  AppWindow, 
  Construction, 
  Hammer,
  Grid3X3,
  ArrowRight
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const mainServices = [
  {
    icon: Trash2,
    title: "Entrümpelung",
    description: "Professionelle Entrümpelung von Wohnungen, Häusern und Gewerbeobjekten in Heidelberg, Mannheim und Umgebung. Wir entsorgen Möbel, Elektrogeräte, Baumaterialien und mehr.",
    features: ["Komplette Wohnungsentrümpelung", "Keller- und Dachbodenräumung", "Gewerbeentrümpelung", "Recycling & Entsorgung"],
    badge: "Hauptleistung",
  },
  {
    icon: Building2,
    title: "Entkernung",
    description: "Fachgerechte Entkernung von Gebäuden aller Art in Heidelberg, Mannheim und der Rhein-Neckar-Region. Wir entfernen Trockenbau, Böden, Installationen und bereiten Ihr Objekt für die Sanierung vor.",
    features: ["Wohnungsentkernung", "Gewerbeentkernung", "Trockenbau-Demontage", "Bodenbelag-Entfernung"],
    badge: "Hauptleistung",
  },
  {
    icon: Construction,
    title: "Hausauflösung",
    description: "Diskrete und strukturierte Hausauflösungen mit besenreiner Übergabe. Ideal bei Umzug, Nachlass, Verkauf oder Eigentümerwechsel in Heidelberg, Mannheim und Umgebung.",
    features: ["Komplette Hausauflösung", "Wohnungsauflösung", "Nachlassauflösung", "Besenreine Übergabe"],
    badge: "Hauptleistung",
  },
]

const additionalServices = [
  {
    icon: AppWindow,
    title: "Fensterbau",
    description: "Professioneller Fenstereinbau und -austausch für optimale Energieeffizienz.",
  },
  {
    icon: Construction,
    title: "Gerüstbau",
    description: "Sicherer Gerüstbau für alle Arbeitsbühnen und Zugänge.",
  },
  {
    icon: Grid3X3,
    title: "Fliesenleger",
    description: "Präzise Fliesenarbeiten für Bad, Küche und Wohnbereiche.",
  },
  {
    icon: Hammer,
    title: "Sonstige Arbeiten",
    description: "Weitere Handwerksleistungen nach Absprache.",
  },
]

export function Services() {
  return (
    <section id="services" className="hidden md:block py-16 bg-[#0a0a0a]">
      <div className="section-padding max-w-7xl mx-auto">
        {/* Header */}
        <div
          
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 bg-[#c9a45c]/10 border border-[#c9a45c]/30 rounded-full text-[#c9a45c] text-sm font-medium mb-4">
            Unsere Leistungen
          </span>
          <h2 className="heading-glow text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Entrümpelung, Hausauflösung und <span className="text-gold-gradient">Entkernung aus einer Hand</span>
          </h2>
          <p className="text-lg text-[#fafafa]/60 max-w-2xl mx-auto">
            Von der Entrümpelung bis zur besenreinen Hausauflösung begleiten wir Projekte in Heidelberg, Mannheim und der gesamten Rhein-Neckar-Region.
          </p>
        </div>

        {/* Main Services */}
        <div
          
          
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
        >
          {mainServices.map((service) => (
            <div key={service.title} >
              <Card className="bg-[#1a1a1a] border-[#2a2a2a] h-full hover:border-[#c9a45c]/50 transition-colors duration-300 group">
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-[#c9a45c]/10 rounded-xl flex items-center justify-center group-hover:bg-[#c9a45c]/20 transition-colors">
                      <service.icon className="w-6 h-6 text-[#c9a45c]" />
                    </div>
                    <Badge variant="secondary" className="bg-[#c9a45c]/10 text-[#c9a45c] border-none">
                      {service.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-[#fafafa]/60 text-sm leading-relaxed">
                    {service.description}
                  </p>
                  <ul className="space-y-2">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-[#fafafa]/80">
                        <div className="w-1.5 h-1.5 bg-[#c9a45c] rounded-full" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Additional Services */}
        <div
          
          className="text-center mb-8"
        >
          <h3 className="text-2xl font-semibold mb-2">Zusätzliche Dienstleistungen</h3>
          <p className="text-[#fafafa]/60">Auch diese Services bieten wir Ihnen professionell an</p>
        </div>

        <div
          
          
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {additionalServices.map((service) => (
            <div key={service.title} >
              <Card className="bg-[#1a1a1a]/50 border-[#2a2a2a] hover:bg-[#1a1a1a] transition-colors duration-300">
                <CardContent className="p-6">
                  <div className="w-10 h-10 bg-[#2a2a2a] rounded-lg flex items-center justify-center mb-4">
                    <service.icon className="w-5 h-5 text-[#c9a45c]" />
                  </div>
                  <h4 className="font-semibold mb-2">{service.title}</h4>
                  <p className="text-sm text-[#fafafa]/60">{service.description}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div

          className="text-center mt-12"
        >
          <a
            href="?tab=entkernung-entruempelung#quote"
            className="inline-flex items-center gap-2 text-[#c9a45c] hover:text-[#d4af37] font-medium transition-colors"
          >
            Jetzt unverbindliches Angebot einholen
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  )
}
