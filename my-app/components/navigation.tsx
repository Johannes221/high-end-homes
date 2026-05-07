"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Menu, X, Phone } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"

const navLinks = [
  { href: "/#hero", label: "Home" },
  { href: "/#quote", label: "Angebot" },
  { href: "/#services", label: "Leistungen" },
  { href: "/#about", label: "Über uns" },
]

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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
            ? "bg-[#0a0a0a]/20 border-b border-white/10"
            : "bg-[#0a0a0a]/10"
        }`}
      >
        <div className="section-padding">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/#hero" className="flex items-center gap-2">
              <Image
                src="/logo-white-nav.png"
                alt="High-End Homes"
                width={200}
                height={70}
                className="h-14 w-auto"
                priority
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-[#fafafa]/80 hover:text-[#c9a45c] transition-colors duration-300"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* CTA Button */}
            <div className="hidden md:flex items-center gap-4">
              <a href="tel:+491234567890" className="flex items-center gap-2 text-sm text-[#fafafa]/80 hover:text-[#c9a45c] transition-colors">
                <Phone className="w-4 h-4" />
                <span>Kontakt</span>
              </a>
              <Button asChild className="bg-[#c9a45c] text-[#0a0a0a] hover:bg-[#d4af37] font-semibold">
                <Link href="/#quote">Angebot einholen</Link>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-[#fafafa]"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#0a0a0a] pt-24 md:hidden">
            <div className="section-padding py-8">
              <div className="flex flex-col gap-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-2xl font-medium text-[#fafafa] hover:text-[#c9a45c] transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="pt-6 border-t border-[#2a2a2a]">
                  <Button asChild className="w-full bg-[#c9a45c] text-[#0a0a0a] hover:bg-[#d4af37] font-semibold">
                    <Link href="/#quote" onClick={() => setIsMobileMenuOpen(false)}>
                      Angebot einholen
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
