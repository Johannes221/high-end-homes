"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"

const floors = [
  {
    id: "dach",
    etage: "DACHGESCHOSS",
    label: "Entrümpelung & Entkernung",
    desc: "Vorbereitung · Rückbau · Beräumung",
    href: "/entruempelung",
    top: "0%",
    height: "18%",
  },
  {
    id: "og3",
    etage: "3. OBERGESCHOSS",
    label: "Trockenbau & Stuckateur",
    desc: "Wände · Decken · Stuck",
    href: "/trockenbau",
    top: "18%",
    height: "17%",
  },
  {
    id: "og2",
    etage: "2. OBERGESCHOSS",
    label: "Sanitär & Elektro",
    desc: "Installation · Leitungen",
    href: "/sanitaer",
    top: "35%",
    height: "17%",
  },
  {
    id: "og1",
    etage: "1. OBERGESCHOSS",
    label: "Maler & Lackierer",
    desc: "Innen · Außen · Spachteln",
    href: "/maler",
    top: "52%",
    height: "15%",
  },
  {
    id: "eg",
    etage: "ERDGESCHOSS",
    label: "Fliesenleger",
    desc: "Bad · Küche · Terrasse",
    href: "/fliesenleger",
    top: "67%",
    height: "33%",
  },
]

const tabs = [
  { nr: "01", name: "Entrümpelung & Entkernung", href: "/entkernung" },
  { nr: "02", name: "Trockenbau & Stuckateur", href: "/trockenbau" },
  { nr: "03", name: "Sanitär & Elektro", href: "/sanitaer" },
  { nr: "04", name: "Maler & Lackierer", href: "/maler" },
  { nr: "05", name: "Fliesenleger", href: "/fliesenleger" },
]

export function VillaInteractive() {
  const [hoveredFloor, setHoveredFloor] = useState<string | null>(null)

  return (
    <>
      {/* Header - Above the Image Section */}
      <div className="w-full py-16 text-center" style={{ background: 'var(--bg-1)' }}>
        <p 
          className="text-[11px] font-semibold tracking-[0.3em] uppercase mb-3"
          style={{ 
            fontFamily: 'var(--font-headline)', 
            fontWeight: 600,
            color: 'rgba(255,255,255,0.5)'
          }}
        >
          UNSERE LEISTUNGEN
        </p>
        <h2 
          className="heading-glow text-3xl sm:text-4xl md:text-5xl"
          style={{ 
            fontFamily: 'var(--font-headline)', 
            fontWeight: 300,
            letterSpacing: '0.03em',
            color: 'white'
          }}
        >
          Von oben bis unten
        </h2>
      </div>

      <section id="leistungen" className="relative w-screen m-0 p-0 overflow-hidden" style={{ aspectRatio: '3/2', minHeight: '600px' }}>
        {/* Villa Background Image */}
        <Image
          src="/villa-bild.webp"
          alt="High-End Homes Villa"
          fill
          className="object-cover object-center transition-all duration-500"
          style={{ 
            filter: hoveredFloor ? 'brightness(0.45)' : 'brightness(0.7)',
            objectFit: 'cover',
            objectPosition: 'center center'
          }}
          sizes="100vw"
          priority
          fetchPriority="high"
        />

        {/* Hover Zones */}
        {floors.map((floor) => (
          <Link
            key={floor.id}
            href={floor.href}
            className={`absolute left-0 right-0 cursor-pointer transition-all duration-[400ms] ease-out
              bg-transparent
              md:bg-transparent
              ${hoveredFloor === floor.id ? 'md:bg-[rgba(255,255,255,0.04)]' : ''}`}
            style={{
              top: floor.top,
              height: floor.height,
            }}
            onMouseEnter={() => setHoveredFloor(floor.id)}
            onMouseLeave={() => setHoveredFloor(null)}
          >
            {/* Horizontal Line at Top - Mobile/Tablet: immer sichtbar & zentriert, Desktop: nur bei Hover */}
            <div
              className={`absolute top-0 h-[1px]
                scale-x-100
                lg:scale-x-0 lg:transition-transform lg:duration-500
                ${hoveredFloor === floor.id ? 'lg:scale-x-100' : ''}`}
              style={{
                left: "5%",
                right: "5%",
                background: "rgba(255,255,255,0.5)",
                transformOrigin: "center",
                transitionTimingFunction: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
              }}
            />

            {/* Label — sitzt mittig in seiner Stockwerks-Zone (genauso wie Mobile). */}
            <div
              className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none whitespace-nowrap z-10
                opacity-100
                lg:opacity-0 lg:transition-opacity lg:duration-[400ms]
                ${hoveredFloor === floor.id ? 'lg:opacity-100' : ''}`}
              style={{
                transitionTimingFunction: "cubic-bezier(0.34, 1.3, 0.64, 1)",
              }}
            >
              <div
                className="w-[290px] md:w-[420px] px-4 py-3 md:px-8 md:py-5 text-center"
                style={{
                  background: "rgba(8,8,8,0.78)",
                  border: "1px solid rgba(255,255,255,0.4)",
                }}
              >
                <div
                  className="text-[9px] md:text-[10px] tracking-[0.3em] mb-1.5 md:mb-2"
                  style={{
                    fontFamily: "var(--font-headline)",
                    fontWeight: 600,
                    color: "rgba(255,255,255,0.45)",
                    textTransform: "uppercase",
                  }}
                >
                  {floor.etage}
                </div>
                <div
                  className="text-base md:text-xl mb-1 md:mb-1.5"
                  style={{
                    fontFamily: "var(--font-headline)",
                    fontWeight: 400,
                    color: "#ffffff",
                    letterSpacing: "0.03em",
                  }}
                >
                  {floor.label}
                </div>
                <div
                  className="text-[11px] md:text-xs tracking-[0.1em]"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontWeight: 300,
                    color: "rgba(255,255,255,0.5)",
                  }}
                >
                  {floor.desc}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </section>

      {/* Leistungs-Tabs - Directly Below Image, No Gap */}
      <div
        className="grid grid-cols-1 md:grid-cols-5 bg-[var(--bg-2)]"
        style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
      >
        {tabs.map((tab, idx) => (
          <Link
            key={tab.nr}
            href={tab.href}
            className="flex flex-col gap-1.5 p-5 md:p-6 transition-all duration-300 hover:bg-[rgba(255,255,255,0.04)]"
            style={{
              borderRight: idx < tabs.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
              textDecoration: "none",
              color: "white",
            }}
          >
            <span
              className="text-[10px] tracking-[0.2em]"
              style={{
                fontFamily: "var(--font-headline)",
                color: "rgba(255,255,255,0.25)",
              }}
            >
              {tab.nr}
            </span>
            <span
              className="text-[13px]"
              style={{
                fontFamily: "var(--font-headline)",
                fontWeight: 500,
              }}
            >
              {tab.name}
            </span>
            <span
              className="text-sm mt-2"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              →
            </span>
          </Link>
        ))}
      </div>
    </>
  )
}
