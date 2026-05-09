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
    title: "Trockenbau & Stuckateur",
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
            <h2 className="text-3xl md:text-4xl text-white text-center mb-12" style={{ fontFamily: 'var(--font-headline)', fontWeight: 400, letterSpacing: '0.02em' }}>
              Hauptleistungen
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {mainServices.map((service, index) => {
                const Icon = service.icon
                return (
                  <div
                    key={index}
                    className="bg-[var(--bg-2)] border p-9 transition-all duration-300"
                    style={{ borderColor: 'rgba(255,255,255,0.06)' }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)'}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}
                  >
                    <h3 className="text-lg mb-3" style={{ fontFamily: 'var(--font-headline)', fontWeight: 500, color: 'white' }}>
                      {service.title}
                    </h3>
                    <p className="mb-5 text-sm leading-relaxed" style={{ fontFamily: 'var(--font-body)', fontWeight: 300, color: 'rgba(255,255,255,0.55)' }}>
                      {service.description}
                    </p>
                    <Link href={service.href} className="inline-block text-xs font-semibold tracking-wider" style={{ fontFamily: 'var(--font-headline)', fontWeight: 600, letterSpacing: '0.1em', color: 'white', textDecoration: 'none' }}>
                      Mehr erfahren →
                    </Link>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Construction Services */}
          <div>
            <h2 className="text-3xl md:text-4xl text-white text-center mb-12" style={{ fontFamily: 'var(--font-headline)', fontWeight: 400, letterSpacing: '0.02em' }}>
              Ausbau-Leistungen
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {constructionServices.map((service, index) => {
                const Icon = service.icon
                return (
                  <Link
                    key={index}
                    href={service.href}
                    className="bg-[var(--bg-2)] border p-8 transition-all duration-300 group block"
                    style={{ borderColor: 'rgba(255,255,255,0.06)', textDecoration: 'none' }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)'}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}
                  >
                    <h3 className="text-base mb-2" style={{ fontFamily: 'var(--font-headline)', fontWeight: 500, color: 'white' }}>
                      {service.title}
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ fontFamily: 'var(--font-body)', fontWeight: 300, color: 'rgba(255,255,255,0.55)' }}>
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
