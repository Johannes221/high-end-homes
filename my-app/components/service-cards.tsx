"use client"

import Link from "next/link"
import {
  Trash2,
  Home,
  Hammer,
  Paintbrush,
  Box,
  Droplet,
  Wrench,
  Frame,
  Building2,
  Sparkles,
  Layers,
} from "lucide-react"

const sanierungServices = [
  {
    icon: Building2,
    title: "Komplettsanierung",
    description: "Vom Rohzustand bis schlüsselfertig — alle Gewerke aus einer Hand, ein Ansprechpartner.",
    href: "/entkernung",
  },
  {
    icon: Sparkles,
    title: "Renovierung",
    description: "Wohnung, Haus, Gewerbe. Mit Auge fürs Detail und höchstem Qualitätsanspruch.",
    href: "/maler",
  },
  {
    icon: Layers,
    title: "Innenausbau",
    description: "Trockenbau, Bodenarbeiten, Wände nach Maß. Modernisierung im Bestand.",
    href: "/trockenbau",
  },
]

const constructionServices = [
  {
    icon: Paintbrush,
    title: "Maler & Lackierer",
    description: "Innen, außen, Spachtelarbeiten.",
    href: "/maler",
  },
  {
    icon: Box,
    title: "Trockenbau & Stuckateur",
    description: "Wände, Decken, Stuck.",
    href: "/trockenbau",
  },
  {
    icon: Frame,
    title: "Fliesenleger",
    description: "Bad, Küche, Terrasse.",
    href: "/fliesenleger",
  },
  {
    icon: Droplet,
    title: "Sanitär & Elektro",
    description: "Installation und Leitungen.",
    href: "/sanitaer",
  },
  {
    icon: Wrench,
    title: "Fensterbau & Gerüst",
    description: "Fenster, Türen, Gerüstbau.",
    href: "/fensterbau",
  },
]

const rueckbauServices = [
  {
    icon: Hammer,
    title: "Entkernung",
    description: "Strukturierter Rückbau für Sanierung und Umbau.",
    href: "/entkernung",
  },
  {
    icon: Trash2,
    title: "Entrümpelung",
    description: "Häuser, Wohnungen, Gewerbe. Schnell und besenrein.",
    href: "/entruempelung",
  },
  {
    icon: Home,
    title: "Hausauflösung",
    description: "Komplett – inkl. Sortierung und fachgerechter Entsorgung.",
    href: "/hausaufloesung",
  },
]

export function ServiceCards() {
  return (
    <section className="py-20 bg-[#0a0a0a]">
      <div className="section-padding">
        <div className="max-w-6xl mx-auto">
          {/* Sanierung & Ausbau — High-End Positioning. Erste Sektion, höchste SEO-Priorität */}
          <div className="mb-20">
            <p
              className="text-center text-[11px] font-semibold tracking-[0.3em] uppercase mb-3"
              style={{ fontFamily: 'var(--font-headline)', color: 'rgba(255,255,255,0.5)' }}
            >
              UNSER FOKUS
            </p>
            <h2 className="heading-glow text-3xl md:text-4xl text-white text-center mb-4" style={{ fontFamily: 'var(--font-headline)', fontWeight: 400, letterSpacing: '0.02em' }}>
              High-End Sanierung & Ausbau
            </h2>
            <p
              className="text-center text-base md:text-lg max-w-2xl mx-auto mb-12"
              style={{ fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.55)' }}
            >
              Komplettsanierung, Renovierung und Innenausbau aus einer Hand — für Eigentümer, Investoren und Bauträger in Heidelberg, Mannheim und der Rhein-Neckar-Region.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {sanierungServices.map((service, index) => {
                const Icon = service.icon
                return (
                  <div
                    key={index}
                    className="bg-[var(--bg-2)] border p-9 transition-all duration-300"
                    style={{ borderColor: 'rgba(255,255,255,0.06)' }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(201,164,92,0.35)'}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}
                  >
                    <Icon className="w-7 h-7 mb-4" style={{ color: '#c9a45c' }} />
                    <h3 className="text-lg mb-3" style={{ fontFamily: 'var(--font-headline)', fontWeight: 500, color: 'white' }}>
                      {service.title}
                    </h3>
                    <p className="mb-5 text-sm leading-relaxed" style={{ fontFamily: 'var(--font-body)', fontWeight: 300, color: 'rgba(255,255,255,0.6)' }}>
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

          {/* Einzel-Gewerke */}
          <div className="mb-20">
            <h2 className="heading-glow text-3xl md:text-4xl text-white text-center mb-12" style={{ fontFamily: 'var(--font-headline)', fontWeight: 400, letterSpacing: '0.02em' }}>
              Einzel-Gewerke
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
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

          {/* Rückbau & Räumung */}
          <div>
            <h2 className="heading-glow text-3xl md:text-4xl text-white text-center mb-12" style={{ fontFamily: 'var(--font-headline)', fontWeight: 400, letterSpacing: '0.02em' }}>
              Rückbau & Räumung
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {rueckbauServices.map((service, index) => {
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
