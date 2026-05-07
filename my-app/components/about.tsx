"use client"


import { Clock, Wallet, Sparkles, Target, Users, Award, Shield, Truck } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const uspItems = [
  {
    icon: Clock,
    title: "Schnell",
    description: "Express-Service möglich. In der Regel innerhalb von 24-48 Stunden vor Ort.",
  },
  {
    icon: Wallet,
    title: "Günstig",
    description: "Transparente Festpreise ohne versteckte Kosten. Preisgarantie nach Besichtigung.",
  },
  {
    icon: Sparkles,
    title: "Einfach",
    description: "Ein Anruf genügt. Wir kümmern uns um alles - von der Planung bis zur Entsorgung.",
  },
  {
    icon: Target,
    title: "Präzise",
    description: "Detaillierte Planung und pünktliche Ausführung. Ihr Termin ist heilig.",
  },
  {
    icon: Shield,
    title: "Sauber",
    description: "Gründliche Reinigung nach jeder Entrümpelung. Übergabe in besenreinem Zustand.",
  },
  {
    icon: Award,
    title: "Zertifiziert",
    description: "Fachgerechte Entsorgung mit allen erforderlichen Zertifizierungen und Genehmigungen.",
  },
]

export function About() {
  return (
    <section id="about" className="py-16 bg-[#0a0a0a]">
      <div className="section-padding max-w-7xl mx-auto">
        {/* USP Section */}
        <div
          
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 bg-[#c9a45c]/10 border border-[#c9a45c]/30 rounded-full text-[#c9a45c] text-sm font-medium mb-4">
            Unser Versprechen
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Darum vertrauen Kunden aus Heidelberg, Mannheim und Umgebung auf <span className="text-gold-gradient">High-End Homes</span>
          </h2>
          <p className="text-lg text-[#fafafa]/60 max-w-2xl mx-auto">
            Kein Hokus-Pokus, keine leeren Versprechen. Wir liefern planbare Ergebnisse für Entrümpelung, Hausauflösung und Entkernung - schnell, sauber und präzise.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
          {uspItems.map((item) => (
            <div
              key={item.title}
              
            >
              <Card className="bg-[#1a1a1a] border-[#2a2a2a] h-full hover:border-[#c9a45c]/30 transition-colors duration-300">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-[#c9a45c]/10 rounded-xl flex items-center justify-center mb-4">
                    <item.icon className="w-6 h-6 text-[#c9a45c]" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-[#fafafa]/60 leading-relaxed">{item.description}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div
          
          className="mt-16 flex flex-wrap justify-center gap-8"
        >
          {[
            { icon: Shield, text: "Voll versichert" },
            { icon: Truck, text: "Fachgerechte Entsorgung" },
            { icon: Users, text: "Erfahrenes Team" },
          ].map((badge) => (
            <div key={badge.text} className="flex items-center gap-2 text-[#fafafa]/60">
              <badge.icon className="w-5 h-5 text-[#c9a45c]" />
              <span className="text-sm">{badge.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
