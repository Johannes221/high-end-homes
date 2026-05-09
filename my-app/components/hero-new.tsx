"use client"

import Link from "next/link"
import Image from "next/image"

export function Hero() {
  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/hero-bg.png"
          alt="High-End Homes"
          fill
          className="object-cover"
          priority
        />
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(10,10,10,0.3)] to-[rgba(10,10,10,0.8)]" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          {/* Eyebrow */}
          <p 
            className="text-[11px] font-semibold tracking-[0.3em] uppercase mb-6"
            style={{ 
              fontFamily: 'var(--font-headline)', 
              fontWeight: 600,
              color: 'rgba(255,255,255,0.5)'
            }}
          >
            HIGH-END HOMES
          </p>

          {/* Headline */}
          <h1 
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl mb-6"
            style={{ 
              fontFamily: 'var(--font-headline)', 
              fontWeight: 300,
              letterSpacing: '0.02em',
              lineHeight: 1.05,
              color: 'white'
            }}
          >
            Ihr Haus.<br />
            <span style={{ fontWeight: 400 }}>Eine Adresse.</span>
          </h1>

          {/* Subline */}
          <p 
            className="text-base sm:text-lg md:text-xl lg:text-2xl mb-10 max-w-3xl mx-auto"
            style={{ 
              fontFamily: 'var(--font-body)', 
              fontWeight: 300,
              color: 'rgba(255,255,255,0.65)',
              lineHeight: 1.7
            }}
          >
            Von der Entrümpelung bis zum fertigen Ausbau – alles aus einer Hand.<br />
            In Heidelberg, Mannheim & Umgebung.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/angebot" 
              className="px-8 py-3.5 bg-white text-black hover:bg-[rgba(255,255,255,0.9)] font-semibold transition-all"
              style={{ 
                fontFamily: 'var(--font-headline)', 
                fontWeight: 600, 
                letterSpacing: '0.05em',
                borderRadius: '3px'
              }}
            >
              Angebot einholen →
            </Link>
            <Link 
              href="#leistungen" 
              className="px-8 py-3.5 bg-transparent text-white border hover:bg-[rgba(255,255,255,0.05)] transition-all"
              style={{ 
                fontFamily: 'var(--font-headline)', 
                fontWeight: 600,
                letterSpacing: '0.05em',
                borderColor: 'rgba(255,255,255,0.4)',
                borderRadius: '3px'
              }}
            >
              Leistungen entdecken
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
