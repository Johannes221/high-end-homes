"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Menu, X, ChevronDown, Mail } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"

const mainServices = [
  { href: "/entruempelung", label: "Entrümpelung" },
  { href: "/entkernung", label: "Entkernung" },
  { href: "/hausaufloesung", label: "Hausauflösung" },
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
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-xl ${
          isScrolled
            ? "bg-[rgba(10,10,10,0.95)] border-b border-[rgba(255,255,255,0.06)]"
            : "bg-[rgba(10,10,10,0.95)]"
        }`}
      >
        <div className="section-padding">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <Image
                src="/logo.webp"
                alt="High-End Homes"
                width={160}
                height={50}
                className="h-12 w-auto"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {/* Leistungen Dropdown */}
              <div 
                className="relative nav-dropdown-wrapper"
                onMouseEnter={() => setIsServicesOpen(true)}
                onMouseLeave={() => setIsServicesOpen(false)}
              >
                <button className="flex items-center gap-1 text-sm hover:text-white transition-colors duration-300 py-2" style={{ fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.7)' }}>
                  Leistungen ▾
                </button>
                
                {isServicesOpen && (
                  <div className="absolute left-0 min-w-[320px]" style={{ top: '100%', paddingTop: '8px' }}>
                    <div className="bg-[#111] border border-[rgba(255,255,255,0.1)] py-2">
                    <div className="space-y-0">
                      {/* Hauptleistungen */}
                      <div className="px-5 py-2">
                        <h3 className="text-[10px] font-semibold mb-2 uppercase tracking-wider" style={{ fontFamily: 'var(--font-headline)', color: 'rgba(255,255,255,0.4)' }}>
                          Hauptleistungen
                        </h3>
                        <div className="space-y-0">
                          {mainServices.map((service) => (
                            <Link
                              key={service.href}
                              href={service.href}
                              className="block text-sm py-3 px-5 -mx-5 hover:bg-[rgba(255,255,255,0.05)] transition-all" style={{ fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.7)' }}
                            >
                              {service.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                      
                      {/* Ausbau-Leistungen */}
                      <div className="px-5 py-2 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                        <h3 className="text-[10px] font-semibold mb-2 uppercase tracking-wider" style={{ fontFamily: 'var(--font-headline)', color: 'rgba(255,255,255,0.4)' }}>
                          Ausbau-Leistungen
                        </h3>
                        <div className="space-y-0">
                          {constructionServices.map((service) => (
                            <Link
                              key={service.href}
                              href={service.href}
                              className="block text-sm py-3 px-5 -mx-5 hover:bg-[rgba(255,255,255,0.05)] transition-all" style={{ fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.7)' }}
                            >
                              {service.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                    </div>
                  </div>
                )}
              </div>

              <Link
                href="/ueber-uns"
                className="text-sm hover:text-white transition-colors duration-300" style={{ fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.7)' }}
              >
                Über uns
              </Link>
              
              <Link
                href="/region"
                className="text-sm hover:text-white transition-colors duration-300" style={{ fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.7)' }}
              >
                Region
              </Link>
              
              <Link
                href="/kontakt"
                className="text-sm hover:text-white transition-colors duration-300" style={{ fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.7)' }}
              >
                Kontakt
              </Link>
              
              <Link
                href="/angebot"
                className="text-sm hover:text-white transition-colors duration-300" style={{ fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.7)' }}
              >
                Angebot einholen
              </Link>
            </div>

            {/* CTA Button */}
            <div className="hidden lg:flex items-center gap-4">
              <Link href="/angebot" className="px-8 py-3.5 bg-white text-black hover:bg-[rgba(255,255,255,0.9)] font-semibold transition-all" style={{ fontFamily: 'var(--font-headline)', fontWeight: 600, letterSpacing: '0.05em', borderRadius: '3px' }}>
                Angebot einholen →
              </Link>
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
        <div className="fixed inset-0 z-40 bg-[#0a0a0a] pt-24 lg:hidden overflow-y-auto">
          <div className="section-padding py-8">
            <div className="flex flex-col gap-6">
              {/* Hauptleistungen */}
              <div>
                <h3 className="text-xs font-semibold text-white/40 mb-3 uppercase tracking-wider" style={{ fontFamily: 'var(--font-headline)' }}>
                  Hauptleistungen
                </h3>
                <div className="space-y-3">
                  {mainServices.map((service) => (
                    <Link
                      key={service.href}
                      href={service.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block text-lg font-medium text-white hover:text-white/60 transition-colors" style={{ fontFamily: 'var(--font-body)' }}
                    >
                      {service.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Ausbau-Leistungen */}
              <div className="pt-4 border-t border-white/10">
                <h3 className="text-xs font-semibold text-white/40 mb-3 uppercase tracking-wider" style={{ fontFamily: 'var(--font-headline)' }}>
                  Ausbau-Leistungen
                </h3>
                <div className="space-y-3">
                  {constructionServices.map((service) => (
                    <Link
                      key={service.href}
                      href={service.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block text-lg font-medium text-white hover:text-white/60 transition-colors" style={{ fontFamily: 'var(--font-body)' }}
                    >
                      {service.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Other Links */}
              <div className="pt-4 border-t border-white/10 space-y-3">
                <Link
                  href="/ueber-uns"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-lg font-medium text-white hover:text-white/60 transition-colors" style={{ fontFamily: 'var(--font-body)' }}
                >
                  Über uns
                </Link>
                <Link
                  href="/region"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-lg font-medium text-white hover:text-white/60 transition-colors" style={{ fontFamily: 'var(--font-body)' }}
                >
                  Region
                </Link>
                <Link
                  href="/kontakt"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-lg font-medium text-white hover:text-white/60 transition-colors" style={{ fontFamily: 'var(--font-body)' }}
                >
                  Kontakt
                </Link>
                <Link
                  href="/angebot"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-lg font-medium text-white hover:text-white/60 transition-colors" style={{ fontFamily: 'var(--font-body)' }}
                >
                  Angebot einholen
                </Link>
              </div>

              <div className="pt-6 border-t border-white/10">
                <Link href="/angebot" onClick={() => setIsMobileMenuOpen(false)} className="block w-full text-center px-8 py-3.5 bg-white text-black hover:bg-[rgba(255,255,255,0.9)] font-semibold transition-all" style={{ fontFamily: 'var(--font-headline)', fontWeight: 600, letterSpacing: '0.05em', borderRadius: '3px' }}>
                  Angebot einholen →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
