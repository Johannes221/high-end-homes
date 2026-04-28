"use client"

import { motion } from "framer-motion"
import { ArrowRight, Clock, Shield, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.15,
    },
  },
}

export function Hero() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero-bg.jpg"
          alt="High-End Homes Background"
          fill
          className="object-cover"
          priority
          quality={90}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/80 via-[#0a0a0a]/60 to-[#0a0a0a]" />
      </div>

      {/* Content */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="relative z-10 section-padding w-full max-w-7xl mx-auto pt-32 pb-20"
      >
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Text */}
          <div className="space-y-8">
            <motion.div variants={fadeInUp} transition={{ duration: 0.6 }}>
              <span className="inline-block px-4 py-2 bg-[#c9a45c]/10 border border-[#c9a45c]/30 rounded-full text-[#c9a45c] text-sm font-medium mb-6">
                Professionelle Entrümpelung & Entkernung
              </span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight"
            >
              Wir machen es{" "}
              <span className="text-gold-gradient">schnell, günstig & präzise</span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-[#fafafa]/70 max-w-xl"
            >
              Ihr zuverlässiger Partner für Entrümpelung, Entkernung und Kernsanierung. 
              Holen Sie sich jetzt in 2 Minuten Ihr unverbindliches Angebot ein.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button
                asChild
                size="lg"
                className="bg-[#c9a45c] text-[#0a0a0a] hover:bg-[#d4af37] font-semibold text-lg px-8 h-14 group"
              >
                <a href="#quote" className="flex items-center gap-2">
                  Jetzt Angebot einholen
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-[#fafafa]/30 text-[#fafafa] hover:bg-[#fafafa]/10 h-14 px-8 text-lg"
              >
                <a href="#services">Unsere Leistungen</a>
              </Button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              variants={fadeInUp}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-6 pt-4"
            >
              {[
                { icon: Clock, text: "24h Antwortzeit" },
                { icon: Shield, text: "Zertifiziert & Versichert" },
                { icon: CheckCircle, text: "Festpreis-Garantie" },
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-[#fafafa]/60">
                  <item.icon className="w-4 h-4 text-[#c9a45c]" />
                  <span>{item.text}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Column - Stats Card */}
          <motion.div
            variants={fadeInUp}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="hidden lg:block"
          >
            <div className="bg-[#1a1a1a]/80 backdrop-blur-sm border border-[#2a2a2a] rounded-2xl p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-4 bg-[#0a0a0a]/50 rounded-xl">
                  <div className="text-3xl font-bold text-[#c9a45c]">500+</div>
                  <div className="text-sm text-[#fafafa]/60 mt-1">Erfolgreiche Projekte</div>
                </div>
                <div className="text-center p-4 bg-[#0a0a0a]/50 rounded-xl">
                  <div className="text-3xl font-bold text-[#c9a45c]">98%</div>
                  <div className="text-sm text-[#fafafa]/60 mt-1">Kundenzufriedenheit</div>
                </div>
                <div className="text-center p-4 bg-[#0a0a0a]/50 rounded-xl">
                  <div className="text-3xl font-bold text-[#c9a45c]">15+</div>
                  <div className="text-sm text-[#fafafa]/60 mt-1">Jahre Erfahrung</div>
                </div>
                <div className="text-center p-4 bg-[#0a0a0a]/50 rounded-xl">
                  <div className="text-3xl font-bold text-[#c9a45c]">24h</div>
                  <div className="text-sm text-[#fafafa]/60 mt-1">Schnelle Antwort</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-[#fafafa]/30 rounded-full flex items-start justify-center p-2"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1.5 h-1.5 bg-[#c9a45c] rounded-full"
          />
        </motion.div>
      </motion.div>
    </section>
  )
}
