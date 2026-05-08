"use client"

import { useState } from "react"
import Link from "next/link"
import { Navigation } from "@/components/navigation-new"
import { Footer } from "@/components/footer-new"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle2, Info, ChevronDown, Mail, Phone } from "lucide-react"
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
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index)
  }

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus("idle")

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...contactForm,
          service: title
        })
      })

      if (response.ok) {
        setSubmitStatus("success")
        setContactForm({ name: "", email: "", phone: "", message: "" })
      } else {
        setSubmitStatus("error")
      }
    } catch (error) {
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
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

      {/* Kontakt */}
      <section className="py-20 bg-[#0a0a0a] border-t border-[rgba(255,255,255,0.08)]">
        <div className="section-padding">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl text-white mb-12 text-center" style={{ fontFamily: 'var(--font-headline)', fontWeight: 400, letterSpacing: '0.02em' }}>
              Kontaktieren Sie uns
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Kontaktformular */}
              <div>
                <h3 className="text-xl text-white mb-6" style={{ fontFamily: 'var(--font-headline)', fontWeight: 500 }}>
                  Nachricht senden
                </h3>
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Name *"
                      required
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      className="w-full px-4 py-3 bg-[#111111] border border-[rgba(255,255,255,0.1)] text-white placeholder:text-white/40 focus:border-white/30 focus:outline-none transition-colors"
                      style={{ fontFamily: 'var(--font-body)', borderRadius: '3px' }}
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="E-Mail *"
                      required
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      className="w-full px-4 py-3 bg-[#111111] border border-[rgba(255,255,255,0.1)] text-white placeholder:text-white/40 focus:border-white/30 focus:outline-none transition-colors"
                      style={{ fontFamily: 'var(--font-body)', borderRadius: '3px' }}
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      placeholder="Telefon"
                      value={contactForm.phone}
                      onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                      className="w-full px-4 py-3 bg-[#111111] border border-[rgba(255,255,255,0.1)] text-white placeholder:text-white/40 focus:border-white/30 focus:outline-none transition-colors"
                      style={{ fontFamily: 'var(--font-body)', borderRadius: '3px' }}
                    />
                  </div>
                  <div>
                    <textarea
                      placeholder="Ihre Nachricht *"
                      required
                      rows={5}
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      className="w-full px-4 py-3 bg-[#111111] border border-[rgba(255,255,255,0.1)] text-white placeholder:text-white/40 focus:border-white/30 focus:outline-none transition-colors resize-none"
                      style={{ fontFamily: 'var(--font-body)', borderRadius: '3px' }}
                    />
                  </div>
                  
                  {submitStatus === "success" && (
                    <div className="p-4 bg-green-900/20 border border-green-500/30 text-green-400 text-sm" style={{ fontFamily: 'var(--font-body)', borderRadius: '3px' }}>
                      Vielen Dank! Ihre Nachricht wurde erfolgreich gesendet.
                    </div>
                  )}
                  
                  {submitStatus === "error" && (
                    <div className="p-4 bg-red-900/20 border border-red-500/30 text-red-400 text-sm" style={{ fontFamily: 'var(--font-body)', borderRadius: '3px' }}>
                      Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut oder kontaktieren Sie uns direkt per E-Mail.
                    </div>
                  )}
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-8 py-3.5 bg-white text-black hover:bg-[rgba(255,255,255,0.9)] font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ 
                      fontFamily: 'var(--font-headline)', 
                      fontWeight: 600, 
                      letterSpacing: '0.05em',
                      borderRadius: '3px'
                    }}
                  >
                    {isSubmitting ? "Wird gesendet..." : "Nachricht senden"}
                  </button>
                </form>
              </div>

              {/* Kontaktinformationen */}
              <div>
                <h3 className="text-xl text-white mb-6" style={{ fontFamily: 'var(--font-headline)', fontWeight: 500 }}>
                  Direkt kontaktieren
                </h3>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#111111] border border-[rgba(255,255,255,0.1)] flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm mb-2" style={{ fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.5)' }}>
                        E-Mail
                      </p>
                      <a 
                        href="mailto:info@high-end-homes.de" 
                        className="text-white hover:text-white/80 transition-colors"
                        style={{ fontFamily: 'var(--font-body)', fontWeight: 400 }}
                      >
                        info@high-end-homes.de
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#111111] border border-[rgba(255,255,255,0.1)] flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm mb-2" style={{ fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.5)' }}>
                        Telefon
                      </p>
                      <a 
                        href="tel:+4962219999999" 
                        className="text-white hover:text-white/80 transition-colors"
                        style={{ fontFamily: 'var(--font-body)', fontWeight: 400 }}
                      >
                        +49 6221 999 99 99
                      </a>
                    </div>
                  </div>

                  <div className="mt-8 p-6 bg-[#111111] border border-[rgba(255,255,255,0.06)]" style={{ borderRadius: '3px' }}>
                    <p className="text-sm leading-relaxed" style={{ fontFamily: 'var(--font-body)', fontWeight: 300, color: 'rgba(255,255,255,0.6)' }}>
                      Wir sind Montag bis Freitag von 8:00 bis 18:00 Uhr für Sie erreichbar. 
                      Gerne beantworten wir Ihre Fragen zu unseren Dienstleistungen und erstellen Ihnen ein individuelles Angebot.
                    </p>
                  </div>
                </div>
              </div>
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
