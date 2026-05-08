"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"

const floors = [
  {
    id: "dach",
    etage: "DACHGESCHOSS",
    label: "Entrümpelung & Entkernug",
    desc: "Vorbereitung · Rückbau · Beräumung",
    href: "/entruempelung",
    top: "0%",
    height: "18%",
  },
  {
    id: "og3",
    etage: "3. OBERGESCHOSS",
    label: "Maler & Lackierer",
    desc: "Innen · Außen · Spachteln",
    href: "/maler",
    top: "18%",
    height: "17%",
  },
  {
    id: "og2",
    etage: "2. OBERGESCHOSS",
    label: "Trockenbau & Stukateur",
    desc: "Wände · Decken · Stuck",
    href: "/trockenbau",
    top: "35%",
    height: "17%",
  },
  {
    id: "og1",
    etage: "1. OBERGESCHOSS",
    label: "Fliesenleger",
    desc: "Bad · Küche · Terrasse",
    href: "/fliesenleger",
    top: "52%",
    height: "15%",
  },
  {
    id: "eg",
    etage: "ERDGESCHOSS",
    label: "Sanitär & Elektro",
    desc: "Installation · Leitungen",
    href: "/sanitaer",
    top: "67%",
    height: "33%",
  },
]

const tabs = [
  { nr: "01", name: "Entrümpelung & Entkernug", href: "/entkernung" },
  { nr: "02", name: "Maler & Lackierer", href: "/maler" },
  { nr: "03", name: "Trockenbau & Stukateur", href: "/trockenbau" },
  { nr: "04", name: "Fliesenleger", href: "/fliesenleger" },
  { nr: "05", name: "Sanitär & Elektro", href: "/sanitaer" },
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
          className="text-3xl sm:text-4xl md:text-5xl"
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
          src="/villa-bild.png"
          alt="High-End Homes Villa"
          fill
          className="object-cover object-center transition-all duration-500"
          style={{ 
            filter: hoveredFloor ? 'brightness(0.45)' : 'brightness(0.7)',
            objectFit: 'cover',
            objectPosition: 'center center'
          }}
          priority
        />

        {/* Hover Zones */}
        {floors.map((floor) => (
          <Link
            key={floor.id}
            href={floor.href}
            className="absolute left-0 right-0 cursor-pointer transition-all duration-[400ms] ease-out"
            style={{
              top: floor.top,
              height: floor.height,
              background: hoveredFloor === floor.id ? "rgba(255,255,255,0.04)" : "transparent",
            }}
            onMouseEnter={() => setHoveredFloor(floor.id)}
            onMouseLeave={() => setHoveredFloor(null)}
          >
            {/* Horizontal Line at Top */}
            <div
              className="absolute top-0 h-[1px] transition-transform duration-500"
              style={{
                left: "5%",
                right: "5%",
                background: "rgba(255,255,255,0.35)",
                transform: hoveredFloor === floor.id ? "scaleX(1)" : "scaleX(0)",
                transformOrigin: "center",
                transitionTimingFunction: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
              }}
            />

            {/* Label */}
            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 pointer-events-none transition-all duration-[400ms] whitespace-nowrap z-10"
              style={{
                opacity: hoveredFloor === floor.id ? 1 : 0,
                transform: `translate(-50%, -50%) translateY(${hoveredFloor === floor.id ? "0" : "14px"})`,
                transitionTimingFunction: "cubic-bezier(0.34, 1.3, 0.64, 1)",
              }}
            >
              <div
                className="px-9 py-4 text-center"
                style={{
                  background: "rgba(8,8,8,0.88)",
                  border: "1px solid rgba(255,255,255,0.45)",
                }}
              >
                <div
                  className="text-[9px] tracking-[0.3em] mb-2"
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
                  className="text-xl sm:text-2xl md:text-3xl mb-1.5"
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
                  className="text-xs tracking-[0.1em]"
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
