"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Menu, X, ChevronDown, Mail } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"

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

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isServicesOpen, setIsServicesOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-2xl ${
          isScrolled
            ? "bg-[#0A1628]/95 border-b border-white/10"
            : "bg-[#0A1628]/80"
        }`}
      >
        <div className="section-padding">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
                HIGH-END HOMES
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {/* Leistungen Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setIsServicesOpen(true)}
                onMouseLeave={() => setIsServicesOpen(false)}
              >
                <button className="flex items-center gap-1 text-sm text-[#fafafa]/80 hover:text-[#60A5FA] transition-colors duration-300">
                  Leistungen
                  <ChevronDown className="w-4 h-4" />
                </button>
                
                {isServicesOpen && (
                  <div className="absolute top-full left-0 mt-2 bg-[#0A1628] border border-[#60A5FA]/20 rounded-md shadow-xl min-w-[500px] p-6">
                    <div className="grid grid-cols-2 gap-6">
                      {/* Hauptleistungen */}
                      <div>
                        <h3 className="text-xs font-semibold text-[#60A5FA] mb-3 uppercase tracking-wider">
                          Hauptleistungen
                        </h3>
                        <div className="space-y-2">
                          {mainServices.map((service) => (
                            <Link
                              key={service.href}
                              href={service.href}
                              className="block text-sm text-[#fafafa]/80 hover:text-[#60A5FA] transition-colors py-1"
                            >
                              {service.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                      
                      {/* Ausbau-Leistungen */}
                      <div>
                        <h3 className="text-xs font-semibold text-[#60A5FA] mb-3 uppercase tracking-wider">
                          Ausbau-Leistungen
                        </h3>
                        <div className="space-y-2">
                          {constructionServices.map((service) => (
                            <Link
                              key={service.href}
                              href={service.href}
                              className="block text-sm text-[#fafafa]/80 hover:text-[#60A5FA] transition-colors py-1"
                            >
                              {service.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Link
                href="/#about"
                className="text-sm text-[#fafafa]/80 hover:text-[#60A5FA] transition-colors duration-300"
              >
                Über uns
              </Link>
              
              <Link
                href="/#region"
                className="text-sm text-[#fafafa]/80 hover:text-[#60A5FA] transition-colors duration-300"
              >
                Region
              </Link>
              
              <Link
                href="/#kontakt"
                className="text-sm text-[#fafafa]/80 hover:text-[#60A5FA] transition-colors duration-300"
              >
                Kontakt
              </Link>
            </div>

            {/* CTA Button */}
            <div className="hidden lg:flex items-center gap-4">
              <Button asChild className="bg-[#60A5FA] text-[#0A1628] hover:bg-[#93C5FD] font-semibold border-0">
                <Link href="/angebot">Angebot einholen →</Link>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-[#fafafa]"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#0A1628] pt-24 lg:hidden overflow-y-auto">
          <div className="section-padding py-8">
            <div className="flex flex-col gap-6">
              {/* Hauptleistungen */}
              <div>
                <h3 className="text-xs font-semibold text-[#60A5FA] mb-3 uppercase tracking-wider">
                  Hauptleistungen
                </h3>
                <div className="space-y-3">
                  {mainServices.map((service) => (
                    <Link
                      key={service.href}
                      href={service.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block text-lg font-medium text-[#fafafa] hover:text-[#60A5FA] transition-colors"
                    >
                      {service.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Ausbau-Leistungen */}
              <div className="pt-4 border-t border-white/10">
                <h3 className="text-xs font-semibold text-[#60A5FA] mb-3 uppercase tracking-wider">
                  Ausbau-Leistungen
                </h3>
                <div className="space-y-3">
                  {constructionServices.map((service) => (
                    <Link
                      key={service.href}
                      href={service.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block text-lg font-medium text-[#fafafa] hover:text-[#60A5FA] transition-colors"
                    >
                      {service.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Other Links */}
              <div className="pt-4 border-t border-white/10 space-y-3">
                <Link
                  href="/#about"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-lg font-medium text-[#fafafa] hover:text-[#60A5FA] transition-colors"
                >
                  Über uns
                </Link>
                <Link
                  href="/#region"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-lg font-medium text-[#fafafa] hover:text-[#60A5FA] transition-colors"
                >
                  Region
                </Link>
                <Link
                  href="/#kontakt"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-lg font-medium text-[#fafafa] hover:text-[#60A5FA] transition-colors"
                >
                  Kontakt
                </Link>
              </div>

              <div className="pt-6 border-t border-white/10">
                <Button asChild className="w-full bg-[#60A5FA] text-[#0A1628] hover:bg-[#93C5FD] font-semibold">
                  <Link href="/angebot" onClick={() => setIsMobileMenuOpen(false)}>
                    Angebot einholen →
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
