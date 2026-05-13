"use client"


import { Clock, Wallet, Sparkles, Target, Users, Award, Shield, Truck } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const uspItems = [
  {
    icon: Clock,
    title: "Schnell",
    description: "In der Regel innerhalb von 24–48 Stunden vor Ort.",
  },
  {
    icon: Wallet,
    title: "Transparent",
    description: "Festpreise nach Besichtigung. Keine versteckten Kosten.",
  },
  {
    icon: Sparkles,
    title: "Einfach",
    description: "Ein Ansprechpartner für alle Gewerke.",
  },
  {
    icon: Target,
    title: "Präzise",
    description: "Pünktliche Termine, saubere Ausführung.",
  },
  {
    icon: Shield,
    title: "Besenrein",
    description: "Übergabe in sauberem Zustand – immer.",
  },
  {
    icon: Award,
    title: "Zertifiziert",
    description: "Fachgerechte Entsorgung mit allen Genehmigungen.",
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
          <h2 className="heading-glow text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Warum Kunden uns vertrauen
          </h2>
          <p className="text-lg text-[#fafafa]/60 max-w-2xl mx-auto">
            Planbare Ergebnisse – schnell, sauber, präzise.
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
