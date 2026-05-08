"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"

const floors = [
  {
    id: "dach",
    etage: "DACHGESCHOSS",
    label: "Entrümpelung & Entkernug",
    desc: "BESENREIN",
    href: "/entkernung",
    top: "0%",
    height: "17%",
  },
  {
    id: "og3",
    etage: "3. OBERGESCHOSS",
    label: "Maler & Lackierer",
    desc: "PRÄZISE AUSFÜHRUNG",
    href: "/maler",
    top: "17%",
    height: "19%",
  },
  {
    id: "og2",
    etage: "2. OBERGESCHOSS",
    label: "Trockenbau & Stukateur",
    desc: "MILLIMETERGENAU",
    href: "/trockenbau",
    top: "36%",
    height: "19%",
  },
  {
    id: "og1",
    etage: "1. OBERGESCHOSS",
    label: "Fliesenleger",
    desc: "PERFEKTE FUGEN",
    href: "/fliesenleger",
    top: "55%",
    height: "19%",
  },
  {
    id: "eg",
    etage: "ERDGESCHOSS",
    label: "Sanitär & Elektro",
    desc: "ZERTIFIZIERT",
    href: "/sanitaer",
    top: "74%",
    height: "26%",
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
    <section id="villa-services" className="min-h-screen bg-[#0a0a0a] py-20">
      <div className="section-padding">
        <div className="max-w-[1000px] mx-auto">
          {/* Villa Container */}
          <div className="relative w-full" style={{ minHeight: "70vh" }}>
            {/* Villa Image */}
            <div className="relative w-full h-full">
              <Image
                src="/villa-bild.png"
                alt="High-End Homes Villa"
                width={1000}
                height={1330}
                className="w-full h-auto"
                priority
              />

              {/* Hover Zones */}
              {floors.map((floor) => (
                <Link
                  key={floor.id}
                  href={floor.href}
                  className="absolute left-0 right-0 cursor-pointer group zone"
                  style={{
                    top: floor.top,
                    height: floor.height,
                  }}
                  onMouseEnter={() => setHoveredFloor(floor.id)}
                  onMouseLeave={() => setHoveredFloor(null)}
                >
                  {/* Hover Overlay */}
                  <div
                    className="absolute inset-0 transition-all duration-[400ms] ease-out"
                    style={{
                      background: hoveredFloor === floor.id ? "rgba(255,255,255,0.04)" : "transparent",
                    }}
                  />

                  {/* Horizontal Line */}
                  <div
                    className="absolute top-0 h-[1px] transition-transform duration-[400ms]"
                    style={{
                      left: "10%",
                      right: "10%",
                      background: "rgba(255,255,255,0.4)",
                      transform: hoveredFloor === floor.id ? "scaleX(1)" : "scaleX(0)",
                      transformOrigin: "center",
                    }}
                  />

                  {/* Label */}
                  <div
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all duration-[350ms]"
                    style={{
                      opacity: hoveredFloor === floor.id ? 1 : 0,
                      transform: `translate(-50%, -50%) translateY(${hoveredFloor === floor.id ? "0" : "12px"})`,
                      transitionTimingFunction: "cubic-bezier(0.34, 1.4, 0.64, 1)",
                    }}
                  >
                    <div
                      className="px-8 py-3.5 text-center"
                      style={{
                        background: "rgba(10,10,10,0.9)",
                        border: "1px solid rgba(255,255,255,0.5)",
                        backdropFilter: "blur(8px)",
                      }}
                    >
                      <div
                        className="text-[10px] tracking-[0.3em] mb-1.5"
                        style={{
                          fontFamily: "var(--font-headline)",
                          fontWeight: 600,
                          color: "rgba(255,255,255,0.5)",
                        }}
                      >
                        {floor.etage}
                      </div>
                      <div
                        className="text-[20px] whitespace-nowrap mb-1"
                        style={{
                          fontFamily: "var(--font-headline)",
                          fontWeight: 700,
                          color: "#ffffff",
                          letterSpacing: "0.02em",
                        }}
                      >
                        {floor.label}
                      </div>
                      <div
                        className="text-[11px] tracking-[0.1em]"
                        style={{
                          fontFamily: "var(--font-body)",
                          fontWeight: 300,
                          color: "rgba(255,255,255,0.55)",
                        }}
                      >
                        {floor.desc}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Leistungs-Tabs */}
          <div
            className="grid grid-cols-1 md:grid-cols-5 mt-0 overflow-x-auto"
            style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
          >
            {tabs.map((tab, idx) => (
              <Link
                key={tab.nr}
                href={tab.href}
                className="flex flex-col gap-1.5 p-5 transition-all duration-300 hover:bg-[rgba(255,255,255,0.04)]"
                style={{
                  borderRight: idx < tabs.length - 1 ? "1px solid rgba(255,255,255,0.08)" : "none",
                  textDecoration: "none",
                  color: "white",
                }}
              >
                <span
                  className="text-[10px] tracking-[0.2em]"
                  style={{
                    fontFamily: "var(--font-headline)",
                    color: "rgba(255,255,255,0.3)",
                  }}
                >
                  {tab.nr}
                </span>
                <span
                  className="text-[13px]"
                  style={{
                    fontFamily: "var(--font-headline)",
                    fontWeight: 600,
                  }}
                >
                  {tab.name}
                </span>
                <span
                  className="text-[16px] mt-auto"
                  style={{ color: "rgba(255,255,255,0.4)" }}
                >
                  →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
