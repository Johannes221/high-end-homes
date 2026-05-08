"use client"

import { useState } from "react"
import Link from "next/link"
import { Navigation } from "@/components/navigation-new"
import { Footer } from "@/components/footer-new"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle2, Info, ChevronDown } from "lucide-react"
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
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null)

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative bg-[#0a0a0a] pt-32 pb-16 overflow-hidden">
        <div className="relative z-10 section-padding">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6" style={{ fontFamily: 'var(--font-headline)' }}>
              {title}
            </h1>
            <p className="text-xl text-white/60 mb-6" style={{ fontFamily: 'var(--font-body)', fontWeight: 300 }}>
              {description}
            </p>
            <div className="bg-white/5 border border-white/10 rounded-sm p-4 mb-8 flex items-start gap-3 max-w-2xl mx-auto">
              <Info className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
              <p className="text-white/70 text-sm" style={{ fontFamily: 'var(--font-body)', fontWeight: 300 }}>
                Unverbindliche Preiseinschätzung – der finale Preis wird vor Ort festgelegt.
              </p>
            </div>
            <Button asChild size="lg" className="bg-white text-black hover:bg-white/90 font-bold text-lg px-10 h-14 rounded-sm" style={{ fontFamily: 'var(--font-headline)' }}>
              <Link href={`/angebot?service=${quoteTab}`} className="flex items-center gap-2">
                Jetzt Angebot einholen
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Was wir machen */}
      <section className="py-16 bg-[#0a0a0a]">
        <div className="section-padding">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center" style={{ fontFamily: 'var(--font-headline)' }}>
              Was wir machen
            </h2>
            <div className="space-y-4">
              {whatWeDo.map((item, index) => (
                <div key={index} className="flex items-start gap-4 bg-[#111111] border border-[rgba(255,255,255,0.06)] p-6">
                  <CheckCircle2 className="w-6 h-6 text-white flex-shrink-0 mt-1" />
                  <p className="text-white/80 text-lg" style={{ fontFamily: 'var(--font-body)', fontWeight: 300 }}>
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Vorteile */}
      <section className="py-16 bg-[#0a0a0a]">
        <div className="section-padding">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center" style={{ fontFamily: 'var(--font-headline)' }}>
              Ihre Vorteile
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="bg-[#111111] border border-[rgba(255,255,255,0.06)] p-8 text-center hover:border-[rgba(255,255,255,0.2)] transition-all duration-300"
                >
                  <h3 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-headline)' }}>
                    {benefit.title}
                  </h3>
                  <p className="text-white/60" style={{ fontFamily: 'var(--font-body)', fontWeight: 300 }}>
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Ablauf */}
      <section className="py-16 bg-[#0a0a0a]">
        <div className="section-padding">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center" style={{ fontFamily: 'var(--font-headline)' }}>
              So läuft's ab
            </h2>
            <div className="space-y-6">
              {process.map((step, index) => (
                <div key={index} className="flex items-start gap-6">
                  <div className="w-10 h-10 rounded-full border border-[rgba(255,255,255,0.3)] flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-lg" style={{ fontFamily: 'var(--font-headline)' }}>{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-headline)' }}>
                      {step.title}
                    </h3>
                    <p className="text-white/60" style={{ fontFamily: 'var(--font-body)', fontWeight: 300 }}>
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
      <section className="py-16 bg-[#0a0a0a]">
        <div className="section-padding">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center" style={{ fontFamily: 'var(--font-headline)' }}>
              Häufige Fragen
            </h2>
            <div className="space-y-0">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b border-[rgba(255,255,255,0.08)] overflow-hidden">
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full flex items-center justify-between py-5 text-left transition-all duration-300"
                  >
                    <h3 className="text-[15px] font-semibold text-white pr-4" style={{ fontFamily: 'var(--font-headline)' }}>
                      {faq.question}
                    </h3>
                    <ChevronDown
                      className={`w-5 h-5 text-white flex-shrink-0 transition-transform duration-400 ${
                        openFaqIndex === index ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-400 ${
                      openFaqIndex === index ? "max-h-96 pb-5" : "max-h-0"
                    }`}
                    style={{ transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}
                  >
                    <p className="text-white/60 leading-relaxed" style={{ fontFamily: 'var(--font-body)', fontWeight: 300 }}>
                      {faq.answer}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#0a0a0a] border-t border-[rgba(255,255,255,0.08)]">
        <div className="section-padding">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8" style={{ fontFamily: 'var(--font-headline)' }}>
              Bereit zu starten?
            </h2>
            <Button asChild size="lg" className="bg-white text-black hover:bg-white/90 font-bold text-lg px-12 h-16 rounded-sm" style={{ fontFamily: 'var(--font-headline)' }}>
              <Link href={`/angebot?service=${quoteTab}`} className="flex items-center gap-2">
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
