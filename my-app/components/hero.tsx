"use client"

import { motion } from "framer-motion"
import { ArrowRight, Clock, Shield, CheckCircle, Phone, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

export function Hero() {
  return (
    <section id="hero" className="relative min-h-screen bg-[#0a0a0a] pt-24 pb-16 overflow-hidden">
      {/* Subtle gradient background - no images */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] via-[#0a0a0a] to-[#0a0a0a]" />
      
      {/* Gold accent line at top */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#c9a45c] to-transparent" />

      {/* Content */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="relative z-10 section-padding w-full max-w-6xl mx-auto"
      >
        {/* Main Content Stack */}
        <div className="flex flex-col items-center text-center space-y-8 py-12">
          
          {/* Badge */}
          <motion.div variants={fadeInUp} transition={{ duration: 0.5 }}>
            <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#c9a45c]/10 border border-[#c9a45c]/40 rounded-full text-[#c9a45c] text-sm font-semibold">
              <Shield className="w-4 h-4" />
              Zertifiziert & Versichert
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.div variants={fadeInUp} transition={{ duration: 0.5, delay: 0.1 }} className="space-y-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
              Entrümpelung &<br />
              <span className="text-[#c9a45c]">Entkernung</span>
            </h1>
            <p className="text-xl sm:text-2xl text-white/80 font-light">
              Schnell · Günstig · Präzise · Sauber
            </p>
          </motion.div>

          {/* Description */}
          <motion.p
            variants={fadeInUp}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-white/60 max-w-2xl"
          >
            Ihr zuverlässiger Partner für professionelle Entrümpelung, Entkernung und Kernsanierung 
            in der Region. In 2 Minuten zum unverbindlichen Angebot.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={fadeInUp}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 pt-4"
          >
            <Button
              asChild
              size="lg"
              className="bg-[#c9a45c] text-[#0a0a0a] hover:bg-[#d4af37] font-bold text-lg px-10 h-14 shadow-lg shadow-[#c9a45c]/20"
            >
              <a href="#quote" className="flex items-center gap-2">
                Jetzt Angebot einholen
                <ArrowRight className="w-5 h-5" />
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white/30 text-white hover:bg-white/10 h-14 px-8 text-lg"
            >
              <a href="tel:+491234567890" className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                Direkt anrufen
              </a>
            </Button>
          </motion.div>

          {/* Trust Badges Row */}
          <motion.div
            variants={fadeInUp}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-6 pt-8"
          >
            {[
              { icon: Clock, text: "24h Reaktionszeit" },
              { icon: Shield, text: "Festpreis-Garantie" },
              { icon: CheckCircle, text: "15+ Jahre Erfahrung" },
              { icon: MapPin, text: "Region Rhein-Neckar" },
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-2 text-sm text-white/50">
                <item.icon className="w-4 h-4 text-[#c9a45c]" />
                <span>{item.text}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Stats Bar */}
        <motion.div
          variants={fadeInUp}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-12"
        >
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-6 md:p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {[
                { value: "500+", label: "Projekte" },
                { value: "98%", label: "Zufriedenheit" },
                { value: "15+", label: "Jahre Erfahrung" },
                { value: "24h", label: "Schnelle Antwort" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-[#c9a45c]">{stat.value}</div>
                  <div className="text-sm text-white/50 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-white/20 rounded-full flex items-start justify-center p-2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1.5 h-1.5 bg-[#c9a45c] rounded-full"
          />
        </motion.div>
      </motion.div>
    </section>
  )
}
