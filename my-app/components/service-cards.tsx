"use client"

import Link from "next/link"
import { Trash2, Home, Hammer, Paintbrush, Box, Droplet, Wrench, Frame } from "lucide-react"
import { Button } from "@/components/ui/button"

const mainServices = [
  {
    icon: Trash2,
    title: "Entrümpelung",
    description: "Professionelle Entrümpelung von Häusern, Wohnungen und Gewerbeobjekten. Schnell, sauber und zuverlässig.",
    href: "/entruempelung",
  },
  {
    icon: Home,
    title: "Hausauflösung",
    description: "Komplette Hausauflösung mit Wertgegenständen-Sortierung und fachgerechter Entsorgung.",
    href: "/hausaufloesung",
  },
  {
    icon: Hammer,
    title: "Entkernung",
    description: "Professionelle Entkernung für Sanierungen und Umbauten. Inklusive Entsorgung aller Materialien.",
    href: "/entkernung",
  },
]

const constructionServices = [
  {
    icon: Paintbrush,
    title: "Maler & Lackierer",
    description: "Hochwertige Malerarbeiten für Innen und Außen.",
    href: "/maler",
  },
  {
    icon: Box,
    title: "Trockenbau & Stukateur",
    description: "Trockenbau, Stuckarbeiten und Innenausbau.",
    href: "/trockenbau",
  },
  {
    icon: Frame,
    title: "Fliesenleger",
    description: "Präzise Fliesenverlegung für Bad und Küche.",
    href: "/fliesenleger",
  },
  {
    icon: Droplet,
    title: "Sanitär & Elektro",
    description: "Sanitär- und Elektroinstallationen vom Profi.",
    href: "/sanitaer",
  },
  {
    icon: Wrench,
    title: "Fensterbau & Gerüst",
    description: "Fensterbau und Gerüstbau für Ihr Projekt.",
    href: "/fensterbau",
  },
]

export function ServiceCards() {
  return (
    <section className="py-20 bg-[#0A1628]">
      <div className="section-padding">
        <div className="max-w-6xl mx-auto">
          {/* Main Services */}
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12" style={{ fontFamily: 'Playfair Display, serif' }}>
              Unsere <span className="text-[#60A5FA]">Hauptleistungen</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {mainServices.map((service, index) => {
                const Icon = service.icon
                return (
                  <div
                    key={index}
                    className="bg-[#1a2a3a] border border-[#60A5FA]/15 rounded-lg p-8 hover:border-[#60A5FA] hover:shadow-xl hover:shadow-[#60A5FA]/20 transition-all duration-300"
                  >
                    <div className="w-14 h-14 rounded-lg bg-[#60A5FA]/10 flex items-center justify-center mb-6">
                      <Icon className="w-7 h-7 text-[#60A5FA]" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                      {service.title}
                    </h3>
                    <p className="text-white/70 mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      {service.description}
                    </p>
                    <Button asChild variant="outline" className="w-full border-[#60A5FA] text-[#60A5FA] hover:bg-[#60A5FA] hover:text-[#0A1628]">
                      <Link href={service.href}>
                        Mehr erfahren →
                      </Link>
                    </Button>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Construction Services */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12" style={{ fontFamily: 'Playfair Display, serif' }}>
              <span className="text-[#60A5FA]">Ausbau-Leistungen</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {constructionServices.map((service, index) => {
                const Icon = service.icon
                return (
                  <Link
                    key={index}
                    href={service.href}
                    className="bg-[#1a2a3a] border border-[#60A5FA]/15 rounded-lg p-6 hover:border-[#60A5FA] hover:shadow-lg hover:shadow-[#60A5FA]/20 transition-all duration-300 group"
                  >
                    <div className="w-12 h-12 rounded-lg bg-[#60A5FA]/10 flex items-center justify-center mb-4 group-hover:bg-[#60A5FA]/20 transition-colors">
                      <Icon className="w-6 h-6 text-[#60A5FA]" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#60A5FA] transition-colors" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      {service.title}
                    </h3>
                    <p className="text-white/60 text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      {service.description}
                    </p>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
