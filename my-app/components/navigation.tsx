"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Phone } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"

const navLinks = [
  { href: "#hero", label: "Home" },
  { href: "#quote", label: "Angebot" },
  { href: "#services", label: "Leistungen" },
  { href: "#about", label: "Über uns" },
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
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-[#0a0a0a]/95 backdrop-blur-md border-b border-[#2a2a2a]"
            : "bg-transparent"
        }`}
      >
        <div className="section-padding">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <a href="#hero" className="flex items-center gap-2">
              <Image
                src="/logo-white.png"
                alt="High-End Homes"
                width={180}
                height={60}
                className="h-12 w-auto"
                priority
              />
            </a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm text-[#fafafa]/80 hover:text-[#c9a45c] transition-colors duration-300"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* CTA Button */}
            <div className="hidden md:flex items-center gap-4">
              <a href="tel:+491234567890" className="flex items-center gap-2 text-sm text-[#fafafa]/80 hover:text-[#c9a45c] transition-colors">
                <Phone className="w-4 h-4" />
                <span>Kontakt</span>
              </a>
              <Button asChild className="bg-[#c9a45c] text-[#0a0a0a] hover:bg-[#d4af37] font-semibold">
                <a href="#quote">Angebot einholen</a>
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
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-[#0a0a0a] pt-24 md:hidden"
          >
            <div className="section-padding py-8">
              <div className="flex flex-col gap-6">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-2xl font-medium text-[#fafafa] hover:text-[#c9a45c] transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
                <div className="pt-6 border-t border-[#2a2a2a]">
                  <Button asChild className="w-full bg-[#c9a45c] text-[#0a0a0a] hover:bg-[#d4af37] font-semibold">
                    <a href="#quote" onClick={() => setIsMobileMenuOpen(false)}>
                      Angebot einholen
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
