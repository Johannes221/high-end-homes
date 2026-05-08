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
    <section className="py-20 bg-[#0a0a0a]">
      <div className="section-padding">
        <div className="max-w-6xl mx-auto">
          {/* Main Services */}
          <div className="mb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12" style={{ fontFamily: 'var(--font-headline)' }}>
              Kernleistungen
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {mainServices.map((service, index) => {
                const Icon = service.icon
                return (
                  <div
                    key={index}
                    className="bg-[#111111] border border-[rgba(255,255,255,0.06)] p-8 hover:border-[rgba(255,255,255,0.2)] transition-all duration-300"
                  >
                    <h3 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-headline)' }}>
                      {service.title}
                    </h3>
                    <p className="text-white/60 mb-6" style={{ fontFamily: 'var(--font-body)', fontWeight: 300 }}>
                      {service.description}
                    </p>
                    <Button asChild variant="outline" className="w-full border-white/30 text-white hover:bg-white hover:text-black rounded-sm" style={{ fontFamily: 'var(--font-headline)' }}>
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
            <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12" style={{ fontFamily: 'var(--font-headline)' }}>
              Ausbau-Leistungen
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {constructionServices.map((service, index) => {
                const Icon = service.icon
                return (
                  <Link
                    key={index}
                    href={service.href}
                    className="bg-[#111111] border border-[rgba(255,255,255,0.06)] p-6 hover:border-[rgba(255,255,255,0.2)] transition-all duration-300 group"
                  >
                    <h3 className="text-base font-semibold text-white mb-2" style={{ fontFamily: 'var(--font-headline)' }}>
                      {service.title}
                    </h3>
                    <p className="text-white/50 text-sm" style={{ fontFamily: 'var(--font-body)', fontWeight: 300 }}>
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
