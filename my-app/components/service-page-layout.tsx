"use client"

import Link from "next/link"
import { Navigation } from "@/components/navigation-new"
import { Footer } from "@/components/footer-new"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle2 } from "lucide-react"
import { ReactNode } from "react"

interface ServicePageLayoutProps {
  title: string
  subtitle: string
  description: string
  heroImage?: string
  whatWeDo: string[]
  benefits: {
    title: string
    description: string
  }[]
  process: {
    title: string
    description: string
  }[]
  faqs: {
    question: string
    answer: string
  }[]
  quoteTab: string
}

export function ServicePageLayout({
  title,
  subtitle,
  description,
  heroImage,
  whatWeDo,
  benefits,
  process,
  faqs,
  quoteTab,
}: ServicePageLayoutProps) {
  return (
    <div className="min-h-screen bg-[#0A1628]">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative bg-[#0A1628] pt-32 pb-16 overflow-hidden">
        {heroImage && (
          <div className="absolute inset-0 z-0 opacity-20">
            <div className="absolute inset-0 bg-gradient-to-b from-[#0A1628]/80 via-[#0A1628]/60 to-[#0A1628]" />
          </div>
        )}
        
        <div className="relative z-10 section-padding">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-[#60A5FA] text-sm font-semibold uppercase tracking-wider mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              {subtitle}
            </p>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
              {title}
            </h1>
            <p className="text-xl text-white/80 mb-8" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              {description}
            </p>
            <Button asChild size="lg" className="bg-[#60A5FA] text-[#0A1628] hover:bg-[#93C5FD] font-bold text-lg px-10 h-14">
              <Link href={`/angebot?tab=${quoteTab}`} className="flex items-center gap-2">
                Jetzt Angebot einholen
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Was wir machen */}
      <section className="py-16 bg-[#0A1628]">
        <div className="section-padding">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center" style={{ fontFamily: 'Playfair Display, serif' }}>
              Was wir <span className="text-[#60A5FA]">machen</span>
            </h2>
            <div className="space-y-4">
              {whatWeDo.map((item, index) => (
                <div key={index} className="flex items-start gap-4 bg-[#1a2a3a] border border-[#60A5FA]/15 rounded-lg p-6">
                  <CheckCircle2 className="w-6 h-6 text-[#60A5FA] flex-shrink-0 mt-1" />
                  <p className="text-white/90 text-lg" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Vorteile */}
      <section className="py-16 bg-[#0A1628]">
        <div className="section-padding">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center" style={{ fontFamily: 'Playfair Display, serif' }}>
              Ihre <span className="text-[#60A5FA]">Vorteile</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="bg-[#1a2a3a] border border-[#60A5FA]/15 rounded-lg p-8 text-center hover:border-[#60A5FA] hover:shadow-lg hover:shadow-[#60A5FA]/20 transition-all duration-300"
                >
                  <h3 className="text-2xl font-bold text-[#60A5FA] mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                    {benefit.title}
                  </h3>
                  <p className="text-white/70" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Ablauf */}
      <section className="py-16 bg-[#0A1628]">
        <div className="section-padding">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center" style={{ fontFamily: 'Playfair Display, serif' }}>
              So läuft's <span className="text-[#60A5FA]">ab</span>
            </h2>
            <div className="space-y-6">
              {process.map((step, index) => (
                <div key={index} className="flex items-start gap-6">
                  <div className="w-12 h-12 rounded-full bg-[#60A5FA] flex items-center justify-center flex-shrink-0">
                    <span className="text-[#0A1628] font-bold text-lg">{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      {step.title}
                    </h3>
                    <p className="text-white/70" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-[#0A1628]">
        <div className="section-padding">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center" style={{ fontFamily: 'Playfair Display, serif' }}>
              Häufige <span className="text-[#60A5FA]">Fragen</span>
            </h2>
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-[#1a2a3a] border border-[#60A5FA]/15 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    {faq.question}
                  </h3>
                  <p className="text-white/70" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-[#60A5FA]/10 to-[#0A1628]">
        <div className="section-padding">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
              Bereit zu <span className="text-[#60A5FA]">starten</span>?
            </h2>
            <p className="text-xl text-white/80 mb-8" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Holen Sie sich jetzt Ihr unverbindliches Angebot
            </p>
            <Button asChild size="lg" className="bg-[#60A5FA] text-[#0A1628] hover:bg-[#93C5FD] font-bold text-lg px-12 h-16">
              <Link href={`/angebot?tab=${quoteTab}`} className="flex items-center gap-2">
                Angebot anfragen
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
