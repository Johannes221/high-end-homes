import Link from "next/link"
import { CheckCircle2, ChevronRight, MapPin, Phone } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { LocalSeoPage } from "@/lib/local-seo-pages"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://highendhomes.de"

export function LocalServicePage({ page }: { page: LocalSeoPage }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: `${page.service} ${page.location}`,
        serviceType: page.service,
        areaServed: [page.location, ...page.nearbyAreas],
        provider: {
          "@type": "LocalBusiness",
          name: "High-End Homes",
          url: siteUrl,
        },
        url: `${siteUrl}/${page.slug}`,
        description: page.metaDescription,
      },
      {
        "@type": "FAQPage",
        mainEntity: page.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      },
    ],
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#fafafa]">
      <Navigation />
      <main>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
        <section className="relative overflow-hidden bg-[#0a0a0a] pt-28 pb-14">
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-[#1a1a1a] via-[#0a0a0a] to-[#0a0a0a]" />
          <div className="relative z-10 section-padding max-w-6xl mx-auto space-y-8">
            <div className="flex flex-wrap items-center gap-3 text-sm text-white/60">
              <Link href="/" className="hover:text-[#c9a45c] transition-colors">Startseite</Link>
              <ChevronRight className="w-4 h-4" />
              <span>{page.title}</span>
            </div>

            <div className="max-w-4xl space-y-5">
              <Badge className="bg-[#c9a45c]/10 text-[#c9a45c] border border-[#c9a45c]/30 hover:bg-[#c9a45c]/10">
                {page.service} in {page.location}
              </Badge>
              <h1 className="heading-glow text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                {page.heroTitle}
              </h1>
              <p className="text-lg sm:text-xl text-white/70 leading-8 max-w-3xl">
                {page.heroDescription}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link
                  href="/#quote"
                  className="inline-flex items-center justify-center rounded-lg bg-[#c9a45c] px-6 py-3 font-semibold text-[#0a0a0a] transition-colors hover:bg-[#d4af37]"
                >
                  Angebot anfragen
                </Link>
                <a
                  href="tel:+491234567890"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 px-6 py-3 font-semibold text-white transition-colors hover:bg-white/5"
                >
                  <Phone className="w-4 h-4" />
                  Direkt anrufen
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#0a0a0a] py-16">
          <div className="section-padding max-w-6xl mx-auto grid lg:grid-cols-[1.1fr_0.9fr] gap-6 items-start">
            <Card className="bg-[#1a1a1a] border-[#2a2a2a]">
              <CardHeader>
                <CardTitle className="text-2xl text-white">{page.introTitle}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-white/70 leading-8">{page.introText}</p>
                <ul className="space-y-3">
                  {page.serviceHighlights.map((highlight) => (
                    <li key={highlight} className="flex items-start gap-3 text-white/80">
                      <CheckCircle2 className="w-5 h-5 text-[#c9a45c] mt-0.5 shrink-0" />
                      <span className="leading-7">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-[#1a1a1a] border-[#2a2a2a]">
              <CardHeader>
                <CardTitle className="text-2xl text-white">Regionale Abdeckung</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-white/65 leading-7">
                  Neben {page.location} betreuen wir auch Projekte in angrenzenden Orten und im weiteren Rhein-Neckar-Gebiet.
                </p>
                <div className="flex flex-wrap gap-2">
                  {[page.location, ...page.nearbyAreas].map((area) => (
                    <div
                      key={area}
                      className="inline-flex items-center gap-2 rounded-full border border-[#2a2a2a] bg-[#0f0f0f] px-3 py-2 text-sm text-white/80"
                    >
                      <MapPin className="w-4 h-4 text-[#c9a45c]" />
                      <span>{area}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="bg-[#0a0a0a] py-4">
          <div className="section-padding max-w-6xl mx-auto grid lg:grid-cols-2 gap-6">
            <Card className="bg-[#1a1a1a] border-[#2a2a2a] h-full">
              <CardHeader>
                <CardTitle className="text-2xl text-white">{page.reasonsTitle}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {page.reasons.map((reason) => (
                    <li key={reason} className="flex items-start gap-3 text-white/80">
                      <CheckCircle2 className="w-5 h-5 text-[#c9a45c] mt-0.5 shrink-0" />
                      <span className="leading-7">{reason}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-[#1a1a1a] border-[#2a2a2a] h-full">
              <CardHeader>
                <CardTitle className="text-2xl text-white">{page.processTitle}</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-3">
                  {page.processSteps.map((step, index) => (
                    <li key={step} className="flex items-start gap-3 text-white/80">
                      <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#c9a45c] text-sm font-bold text-[#0a0a0a]">
                        {index + 1}
                      </div>
                      <span className="leading-7">{step}</span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="bg-[#0a0a0a] py-16">
          <div className="section-padding max-w-6xl mx-auto space-y-6">
            <div className="max-w-3xl space-y-3">
              <h2 className="heading-glow text-3xl sm:text-4xl font-bold text-white">{page.faqTitle}</h2>
              <p className="text-white/65 leading-7">
                Kurze Antworten auf typische Fragen rund um {page.service.toLowerCase()} in {page.location}.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {page.faqs.map((faq) => (
                <Card key={faq.question} className="bg-[#1a1a1a] border-[#2a2a2a] h-full">
                  <CardHeader>
                    <CardTitle className="text-lg text-white leading-7">{faq.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-white/65 leading-7">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#0a0a0a] pb-16">
          <div className="section-padding max-w-6xl mx-auto grid lg:grid-cols-[1fr_auto] gap-6 items-start">
            <Card className="bg-[#121212] border-[#2a2a2a]">
              <CardHeader>
                <CardTitle className="text-2xl text-white">Weitere relevante Seiten</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-3">
                <Link
                  href="/"
                  className="inline-flex items-center justify-center rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] px-4 py-2 text-sm text-white/80 transition-colors hover:border-[#c9a45c]/40 hover:text-[#c9a45c]"
                >
                  Startseite
                </Link>
                {page.relatedLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="inline-flex items-center justify-center rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] px-4 py-2 text-sm text-white/80 transition-colors hover:border-[#c9a45c]/40 hover:text-[#c9a45c]"
                  >
                    {link.label}
                  </Link>
                ))}
              </CardContent>
            </Card>

            <Link
              href="/#quote"
              className="inline-flex min-w-[220px] items-center justify-center rounded-lg bg-[#c9a45c] px-6 py-4 font-semibold text-[#0a0a0a] transition-colors hover:bg-[#d4af37]"
            >
              Projekt anfragen
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
