"use client"

import Link from "next/link"
import {
  Trash2,
  Hammer,
  Paintbrush,
  Box,
  Wrench,
  Building2,
  Sparkles,
  Layers,
  PaintBucket,
  PackageOpen,
  Network,
  Zap,
  Droplets,
  Ruler,
} from "lucide-react"

// FOKUS — Sanierung & Innenausbau. Komplettsanierung = Koordination/GU, nicht Eigenausführung.
const fokusServices = [
  {
    icon: Building2,
    title: "Komplettsanierung",
    description: "Wir planen, koordinieren und steuern Ihr Gesamtprojekt — eigene Gewerke plus geprüftes Partnernetzwerk. Ein Ansprechpartner.",
    href: "/angebot",
  },
  {
    icon: Layers,
    title: "Innenausbau",
    description: "Trockenbau, Wand- und Deckengestaltung, Spachtel- und Bodenarbeiten — alles in eigener Hand.",
    href: "/innenausbau",
  },
  {
    icon: Sparkles,
    title: "Renovierung",
    description: "Wohnung, Haus, Gewerbe. Mit Auge fürs Detail und höchstem Qualitätsanspruch.",
    href: "/maler",
  },
]

// EIGENLEISTUNG — was das eigene Team ausführt.
const eigenleistungen = [
  {
    icon: Box,
    title: "Trockenbau",
    description: "Ständerwerk, Gipsplatten, abgehängte Decken.",
    href: "/innenausbau",
  },
  {
    icon: PaintBucket,
    title: "Spachtelarbeiten",
    description: "Untergrundvorbereitung, Glätten, Q1–Q4.",
    href: "/innenausbau",
  },
  {
    icon: Layers,
    title: "Fliesen- & Bodenarbeiten",
    description: "Fliesen, Laminat, Vinyl, Bodenbeläge.",
    href: "/bodenverlegung",
  },
  {
    icon: Paintbrush,
    title: "Maler & Lackierer",
    description: "Streichen, Tapezieren, Lackieren.",
    href: "/maler",
  },
  {
    icon: Wrench,
    title: "Montagearbeiten",
    description: "Türen, Zargen, Möbel, Trennwände.",
    href: "/innenausbau",
  },
]

// PARTNERNETZWERK — meisterpflichtige Gewerke, von HEH koordiniert (keine Firmennamen).
const partnerGewerke = [
  {
    icon: Zap,
    title: "Elektroinstallation",
    description: "Über konzessionierte Elektro-Fachbetriebe.",
  },
  {
    icon: Droplets,
    title: "Sanitär & Heizung",
    description: "Über eingetragene SHK-Meisterbetriebe.",
  },
  {
    icon: Ruler,
    title: "Statik & Tragwerk",
    description: "Über Fachplaner und geprüfte Statiker.",
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
    icon: PackageOpen,
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
          {/* FOKUS — Sanierung & Innenausbau */}
          <div className="mb-20">
            <p
              className="text-center text-[11px] font-semibold tracking-[0.3em] uppercase mb-3"
              style={{ fontFamily: 'var(--font-headline)', color: 'rgba(255,255,255,0.5)' }}
            >
              UNSER FOKUS
            </p>
            <h2 className="heading-glow text-3xl md:text-4xl text-white text-center mb-4" style={{ fontFamily: 'var(--font-headline)', fontWeight: 400, letterSpacing: '0.02em' }}>
              Innenausbau & Sanierung
            </h2>
            <p
              className="text-center text-base md:text-lg max-w-2xl mx-auto mb-12"
              style={{ fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.55)' }}
            >
              Einzelgewerke aus eigener Hand, Komplettprojekte koordiniert über unser Partnernetzwerk — für Eigentümer, Investoren und Bauträger in Heidelberg, Mannheim und der Rhein-Neckar-Region.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {fokusServices.map((service, index) => {
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

          {/* EIGENLEISTUNG */}
          <div className="mb-20">
            <h2 className="heading-glow text-3xl md:text-4xl text-white text-center mb-3" style={{ fontFamily: 'var(--font-headline)', fontWeight: 400, letterSpacing: '0.02em' }}>
              Unsere Eigenleistungen
            </h2>
            <p
              className="text-center text-sm md:text-base max-w-2xl mx-auto mb-12"
              style={{ fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.5)' }}
            >
              Diese Gewerke führt unser eigenes Team aus.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {eigenleistungen.map((service, index) => {
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

          {/* PARTNERNETZWERK — koordiniert, generisch */}
          <div className="mb-20">
            <div className="flex justify-center mb-4">
              <Network className="w-7 h-7" style={{ color: '#c9a45c' }} />
            </div>
            <h2 className="heading-glow text-3xl md:text-4xl text-white text-center mb-3" style={{ fontFamily: 'var(--font-headline)', fontWeight: 400, letterSpacing: '0.02em' }}>
              Unser Partnernetzwerk
            </h2>
            <p
              className="text-center text-sm md:text-base max-w-2xl mx-auto mb-12"
              style={{ fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.55)' }}
            >
              Meisterpflichtige und genehmigungspflichtige Gewerke führen wir nicht selbst aus, sondern koordinieren sie über ein Netzwerk geprüfter Fachbetriebe. Sie haben dabei immer nur einen Ansprechpartner: uns.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {partnerGewerke.map((service, index) => {
                const Icon = service.icon
                return (
                  <div
                    key={index}
                    className="bg-[var(--bg-2)] border p-8"
                    style={{ borderColor: 'rgba(255,255,255,0.06)' }}
                  >
                    <Icon className="w-6 h-6 mb-3" style={{ color: 'rgba(201,164,92,0.7)' }} />
                    <h3 className="text-base mb-2" style={{ fontFamily: 'var(--font-headline)', fontWeight: 500, color: 'white' }}>
                      {service.title}
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ fontFamily: 'var(--font-body)', fontWeight: 300, color: 'rgba(255,255,255,0.55)' }}>
                      {service.description}
                    </p>
                  </div>
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
