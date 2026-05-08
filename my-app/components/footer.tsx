"use client"


import Link from "next/link"
import { Mail, Phone, MapPin, ArrowUp } from "lucide-react"
import Image from "next/image"
import { Separator } from "@/components/ui/separator"

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <footer className="bg-[#0a0a0a] border-t border-[#2a2a2a]">
      <div className="section-padding max-w-7xl mx-auto py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Logo & Info */}
          <div
            
            className="space-y-6"
          >
            <Image
              src="/logo-white.png"
              alt="High-End Homes"
              width={200}
              height={70}
              className="h-14 w-auto"
            />
            <p className="text-[#fafafa]/60 text-sm leading-relaxed">
              Ihr zuverlässiger Partner für professionelle Entrümpelung, 
              Hausauflösung und Entkernung in Heidelberg, Mannheim und der Rhein-Neckar-Region.
            </p>
          </div>

          {/* Quick Links */}
          <div
            
          >
            <h4 className="font-semibold mb-6 text-[#c9a45c]">Navigation</h4>
            <ul className="space-y-3">
              {[
                { label: "Home", href: "/#hero" },
                { label: "Angebot einholen", href: "/#quote" },
                { label: "Leistungen", href: "/#services" },
                { label: "Über uns", href: "/#about" },
                { label: "Region", href: "/#region" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[#fafafa]/60 hover:text-[#c9a45c] transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div
            
          >
            <h4 className="font-semibold mb-6 text-[#c9a45c]">Leistungen</h4>
            <ul className="space-y-3">
              {[
                "Entrümpelung",
                "Hausauflösung",
                "Entkernung",
                "Wohnungsauflösung",
                "Fensterbau",
                "Gerüstbau",
                "Fliesenleger",
              ].map((service) => (
                <li key={service}>
                  <span className="text-[#fafafa]/60 text-sm">{service}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div
            
          >
            <h4 className="font-semibold mb-6 text-[#c9a45c]">Kontakt</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#c9a45c] shrink-0 mt-0.5" />
                <span className="text-[#fafafa]/60 text-sm">
                  Gerhard-Hauptmann Straße 38<br />
                  69221 Dossenheim
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#c9a45c] shrink-0" />
                <a
                  href="mailto:bennet.pfeifer@highendhomes.de"
                  className="text-[#fafafa]/60 hover:text-[#c9a45c] transition-colors text-sm"
                >
                  bennet.pfeifer@highendhomes.de
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#c9a45c] shrink-0" />
                <a
                  href="tel:+491234567890"
                  className="text-[#fafafa]/60 hover:text-[#c9a45c] transition-colors text-sm"
                >
                  +49 123 456 7890
                </a>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-12 bg-[#2a2a2a]" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Impressum */}
          <div className="text-center md:text-left">
            <h4 className="font-semibold mb-2 text-sm">Impressum</h4>
            <p className="text-[#fafafa]/40 text-xs leading-relaxed">
              Bennet Pfeifer<br />
              Gerhard-Hauptmann Straße 38<br />
              69221 Dossenheim<br />
              Deutschland
            </p>
          </div>

          {/* Copyright */}
          <div className="text-center">
            <p className="text-[#fafafa]/40 text-sm">
              © {new Date().getFullYear()} High-End Homes. Alle Rechte vorbehalten.
            </p>
          </div>

          {/* Back to Top */}
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-[#fafafa]/60 hover:text-[#c9a45c] transition-colors text-sm"
          >
            Nach oben
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  )
}
