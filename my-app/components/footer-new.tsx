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
    <footer id="kontakt" className="bg-[#0A1628] border-t border-[#60A5FA]/20">
      <div className="section-padding py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            {/* Company Info */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                HIGH-END HOMES
              </h3>
              <p className="text-white/70 mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Ihr zuverlässiger Partner für Entrümpelung, Hausauflösung, Entkernung und Ausbau in Heidelberg, Mannheim und Umgebung.
              </p>
            </div>

            {/* Navigation */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Navigation
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/#hero" className="text-white/70 hover:text-[#60A5FA] transition-colors" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/#about" className="text-white/70 hover:text-[#60A5FA] transition-colors" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    Über uns
                  </Link>
                </li>
                <li>
                  <Link href="/#region" className="text-white/70 hover:text-[#60A5FA] transition-colors" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    Region
                  </Link>
                </li>
                <li>
                  <Link href="/angebot" className="text-white/70 hover:text-[#60A5FA] transition-colors" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    Angebot einholen
                  </Link>
                </li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Leistungen
              </h4>
              <ul className="space-y-2">
                {mainServices.map((service) => (
                  <li key={service.href}>
                    <Link href={service.href} className="text-white/70 hover:text-[#60A5FA] transition-colors" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      {service.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Kontakt
              </h4>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#60A5FA] flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-white/70 text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      Gerhard-Hauptmann Straße 38<br />
                      69221 Dossenheim
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-[#60A5FA] flex-shrink-0 mt-1" />
                  <div>
                    <a 
                      href="mailto:Bennet.pfeifer@highendhomes.de" 
                      className="text-white/70 hover:text-[#60A5FA] transition-colors text-sm"
                      style={{ fontFamily: 'Montserrat, sans-serif' }}
                    >
                      Bennet.pfeifer@highendhomes.de
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Service Area */}
          <div className="border-t border-[#60A5FA]/20 pt-8 mb-8">
            <h4 className="text-lg font-semibold text-white mb-4 text-center" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Unser Einsatzgebiet
            </h4>
            <p className="text-white/70 text-center text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Heidelberg · Mannheim · Dossenheim · Schriesheim · Weinheim · Leimen · Eppelheim · Schwetzingen · Hockenheim · Ladenburg · Rhein-Neckar-Kreis
            </p>
          </div>

          {/* Copyright */}
          <div className="border-t border-[#60A5FA]/20 pt-8 text-center">
            <p className="text-white/50 text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              © {new Date().getFullYear()} High-End Homes. Alle Rechte vorbehalten.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
