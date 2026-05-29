import type { Metadata } from "next"
import Image from "next/image"

export const metadata: Metadata = {
  title: "High-End Homes — wir bauen um",
  description:
    "High-End Homes überarbeitet gerade die Webseite. Bald sind wir wieder für Sie da. Kontakt: bennet.pfeifer@highendhomes.de",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
}

export default function ComingSoonPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-[#0a0a0a] text-white">
      <div className="max-w-xl w-full text-center">
        <Image
          src="/logo.webp"
          alt="High-End Homes"
          width={220}
          height={70}
          priority
          className="mx-auto mb-12 h-14 w-auto"
        />

        <p
          className="text-[11px] font-semibold tracking-[0.4em] uppercase mb-6"
          style={{ fontFamily: "var(--font-headline)", color: "rgba(255,255,255,0.45)" }}
        >
          IN ÜBERARBEITUNG
        </p>

        <h1
          className="text-3xl md:text-4xl mb-6"
          style={{
            fontFamily: "var(--font-headline)",
            fontWeight: 300,
            letterSpacing: "0.02em",
            lineHeight: 1.2,
          }}
        >
          Wir bauen unsere Webseite gerade um.
        </h1>

        <p
          className="text-base md:text-lg mb-12 leading-relaxed"
          style={{ fontFamily: "var(--font-body)", color: "rgba(255,255,255,0.6)" }}
        >
          High-End Homes — Innenausbau & Sanierung in Heidelberg und Mannheim. Bald sind wir mit einem neuen Auftritt wieder für Sie da.
        </p>

        <div
          className="mx-auto w-16 h-px mb-12"
          style={{ background: "rgba(201,164,92,0.5)" }}
        />

        <div className="space-y-3">
          <p
            className="text-xs uppercase tracking-[0.3em]"
            style={{ fontFamily: "var(--font-headline)", color: "rgba(255,255,255,0.4)" }}
          >
            Anfragen direkt an
          </p>
          <a
            href="mailto:bennet.pfeifer@highendhomes.de"
            className="inline-block text-lg hover:text-[#c9a45c] transition-colors"
            style={{ fontFamily: "var(--font-body)", color: "rgba(255,255,255,0.85)" }}
          >
            bennet.pfeifer@highendhomes.de
          </a>
        </div>
      </div>

      <div
        className="absolute bottom-6 text-[10px] tracking-[0.2em] uppercase"
        style={{ fontFamily: "var(--font-headline)", color: "rgba(255,255,255,0.25)" }}
      >
        © {new Date().getFullYear()} High-End Homes
      </div>
    </div>
  )
}
