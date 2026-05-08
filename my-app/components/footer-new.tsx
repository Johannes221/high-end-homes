"use client"

import Link from "next/link"
import { Mail, MapPin } from "lucide-react"

const mainServices = [
  { href: "/entruempelung", label: "Entrümpelung" },
  { href: "/hausaufloesung", label: "Hausauflösung" },
  { href: "/entkernung", label: "Entkernung" },
  { href: "/wohnungsaufloesung", label: "Wohnungsauflösung" },
]

const constructionServices = [
  { href: "/maler", label: "Maler & Lackierer" },
  { href: "/trockenbau", label: "Trockenbau & Stukateur" },
  { href: "/fliesenleger", label: "Fliesenleger" },
  { href: "/sanitaer", label: "Sanitär & Elektro" },
  { href: "/fensterbau", label: "Fensterbau & Gerüst" },
]

export function Footer() {
  return (
    <footer id="kontakt" className="bg-[#0a0a0a] border-t border-[rgba(255,255,255,0.08)]">
      <div className="section-padding py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            {/* Company Info */}
            <div>
              <h3 className="text-xl font-bold text-white mb-4 tracking-[0.1em]" style={{ fontFamily: 'var(--font-headline)' }}>
                HIGH-END HOMES
              </h3>
              <p className="text-white/60 mb-6 text-sm" style={{ fontFamily: 'var(--font-body)', fontWeight: 300 }}>
                Ihr zuverlässiger Partner für Entrümpelung, Hausauflösung, Entkernung und Ausbau in Heidelberg, Mannheim und Umgebung.
              </p>
            </div>

            {/* Navigation */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider" style={{ fontFamily: 'var(--font-headline)' }}>
                Navigation
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/#hero" className="text-white/60 hover:text-white transition-colors text-sm" style={{ fontFamily: 'var(--font-body)' }}>
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/#about" className="text-white/60 hover:text-white transition-colors text-sm" style={{ fontFamily: 'var(--font-body)' }}>
                    Über uns
                  </Link>
                </li>
                <li>
                  <Link href="/#region" className="text-white/60 hover:text-white transition-colors text-sm" style={{ fontFamily: 'var(--font-body)' }}>
                    Region
                  </Link>
                </li>
                <li>
                  <Link href="/angebot" className="text-white/60 hover:text-white transition-colors text-sm" style={{ fontFamily: 'var(--font-body)' }}>
                    Angebot einholen
                  </Link>
                </li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider" style={{ fontFamily: 'var(--font-headline)' }}>
                Leistungen
              </h4>
              <ul className="space-y-2">
                {mainServices.map((service) => (
                  <li key={service.href}>
                    <Link href={service.href} className="text-white/60 hover:text-white transition-colors text-sm" style={{ fontFamily: 'var(--font-body)' }}>
                      {service.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider" style={{ fontFamily: 'var(--font-headline)' }}>
                Kontakt
              </h4>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-white flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-white/60 text-sm" style={{ fontFamily: 'var(--font-body)', fontWeight: 300 }}>
                      Gerhard-Hauptmann Straße 38<br />
                      69221 Dossenheim
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-white flex-shrink-0 mt-1" />
                  <div>
                    <a 
                      href="mailto:bennet.pfeifer@highendhomes.de" 
                      className="text-white/60 hover:text-white transition-colors text-sm"
                      style={{ fontFamily: 'var(--font-body)', fontWeight: 300 }}
                    >
                      bennet.pfeifer@highendhomes.de
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Service Area */}
          <div className="border-t border-[rgba(255,255,255,0.08)] pt-8 mb-8">
            <h4 className="text-sm font-semibold text-white mb-4 text-center uppercase tracking-wider" style={{ fontFamily: 'var(--font-headline)' }}>
              Unser Einsatzgebiet
            </h4>
            <p className="text-white/60 text-center text-sm" style={{ fontFamily: 'var(--font-body)', fontWeight: 300 }}>
              Heidelberg · Mannheim · Dossenheim · Schriesheim · Weinheim · Leimen · Eppelheim · Schwetzingen · Hockenheim · Ladenburg · Rhein-Neckar-Kreis
            </p>
          </div>

          {/* Copyright */}
          <div className="border-t border-[rgba(255,255,255,0.08)] pt-8 text-center">
            <p className="text-white/35 text-sm" style={{ fontFamily: 'var(--font-body)', fontWeight: 300 }}>
              © {new Date().getFullYear()} High-End Homes. Alle Rechte vorbehalten.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
