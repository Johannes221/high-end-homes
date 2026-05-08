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
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <div className="mb-6">
              <Link href="/" className="text-sm hover:text-white transition-colors" style={{ fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.5)' }}>
                Home
              </Link>
              <span className="mx-2" style={{ color: 'rgba(255,255,255,0.3)' }}>→</span>
              <span className="text-sm" style={{ fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.7)' }}>{title}</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl text-white mb-6" style={{ fontFamily: 'var(--font-headline)', fontWeight: 300, letterSpacing: '0.02em' }}>
              {title}
            </h1>
            <p className="text-xl mb-8" style={{ fontFamily: 'var(--font-body)', fontWeight: 300, color: 'rgba(255,255,255,0.65)', lineHeight: 1.7 }}>
              {description}
            </p>
            <Link 
              href={`/angebot?service=${quoteTab}`} 
              className="inline-block px-8 py-3.5 bg-white text-black hover:bg-[rgba(255,255,255,0.9)] font-semibold transition-all"
              style={{ 
                fontFamily: 'var(--font-headline)', 
                fontWeight: 600, 
                letterSpacing: '0.05em',
                borderRadius: '3px'
              }}
            >
              Angebot anfragen →
            </Link>
          </div>
        </div>
      </section>

      {/* Was wir machen */}
      <section className="py-20 bg-[#0a0a0a]">
        <div className="section-padding">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl text-white mb-12" style={{ fontFamily: 'var(--font-headline)', fontWeight: 400, letterSpacing: '0.02em' }}>
              Was wir machen
            </h2>
            <div className="space-y-4">
              {whatWeDo.map((item, index) => (
                <div key={index} className="flex items-start gap-4">
                  <span className="text-white mt-1">•</span>
                  <p className="text-base leading-relaxed" style={{ fontFamily: 'var(--font-body)', fontWeight: 300, color: 'rgba(255,255,255,0.7)' }}>
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
      <section className="py-20 bg-[#0a0a0a]">
        <div className="section-padding">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl text-white mb-12" style={{ fontFamily: 'var(--font-headline)', fontWeight: 400, letterSpacing: '0.02em' }}>
              Ablauf
            </h2>
            <div className="space-y-8">
              {process.map((step, index) => (
                <div key={index} className="flex items-start gap-6">
                  <div className="w-12 h-12 rounded-full border flex items-center justify-center flex-shrink-0" style={{ borderColor: 'rgba(255,255,255,0.3)' }}>
                    <span className="text-white text-lg" style={{ fontFamily: 'var(--font-headline)', fontWeight: 500 }}>{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl text-white mb-2" style={{ fontFamily: 'var(--font-headline)', fontWeight: 500 }}>
                      {step.title}
                    </h3>
                    <p className="leading-relaxed" style={{ fontFamily: 'var(--font-body)', fontWeight: 300, color: 'rgba(255,255,255,0.55)' }}>
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
      <section className="py-20 bg-[#0a0a0a]">
        <div className="section-padding">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl text-white mb-12" style={{ fontFamily: 'var(--font-headline)', fontWeight: 400, letterSpacing: '0.02em' }}>
              Häufige Fragen
            </h2>
            <div className="space-y-0">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b border-[rgba(255,255,255,0.08)] overflow-hidden">
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full flex items-center justify-between py-5 text-left transition-all duration-300"
                  >
                    <h3 className="text-[15px] text-white pr-4" style={{ fontFamily: 'var(--font-headline)', fontWeight: 500 }}>
                      {faq.question}
                    </h3>
                    <span
                      className="text-xl flex-shrink-0 transition-transform duration-400"
                      style={{ 
                        color: 'rgba(255,255,255,0.4)', 
                        transform: openFaqIndex === index ? 'rotate(45deg)' : 'rotate(0deg)'
                      }}
                    >
                      +
                    </span>
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-[450ms] ${
                      openFaqIndex === index ? "max-h-96 pb-5" : "max-h-0"
                    }`}
                    style={{ transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}
                  >
                    <p className="text-[15px] leading-loose" style={{ fontFamily: 'var(--font-body)', fontWeight: 300, color: 'rgba(255,255,255,0.55)' }}>
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
            <h2 className="text-4xl md:text-5xl text-white mb-8" style={{ fontFamily: 'var(--font-headline)', fontWeight: 400, letterSpacing: '0.02em' }}>
              Jetzt Angebot anfragen
            </h2>
            <Link 
              href={`/angebot?service=${quoteTab}`} 
              className="inline-block px-8 py-3.5 bg-white text-black hover:bg-[rgba(255,255,255,0.9)] font-semibold transition-all"
              style={{ 
                fontFamily: 'var(--font-headline)', 
                fontWeight: 600, 
                letterSpacing: '0.05em',
                borderRadius: '3px'
              }}
            >
              Angebot einholen →
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
