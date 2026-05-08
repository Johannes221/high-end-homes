"use client"

import { useState } from "react"
import Link from "next/link"

const floors = [
  {
    id: "dach",
    label: "Entrümpelung & Entkernung",
    href: "/entkernung",
    top: "5%",
    height: "18%",
  },
  {
    id: "og1",
    label: "Maler & Lackierer",
    href: "/maler",
    top: "23%",
    height: "18%",
  },
  {
    id: "og2",
    label: "Trockenbau & Stukateur",
    href: "/trockenbau",
    top: "41%",
    height: "18%",
  },
  {
    id: "og3",
    label: "Fliesenleger",
    href: "/fliesenleger",
    top: "59%",
    height: "18%",
  },
  {
    id: "eg",
    label: "Sanitär & Elektro",
    href: "/sanitaer",
    top: "77%",
    height: "18%",
  },
]

export function VillaInteractive() {
  const [hoveredFloor, setHoveredFloor] = useState<string | null>(null)

  return (
    <section id="villa-services" className="py-20 bg-[#0A1628]">
      <div className="section-padding">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <p className="text-[#60A5FA] text-sm font-semibold uppercase tracking-wider mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Unsere Leistungen
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              Alles aus einer Hand –<br />
              <span className="text-[#60A5FA]">von Keller bis Dach</span>
            </h2>
            <p className="text-white/70 text-lg max-w-2xl mx-auto" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Klicken Sie auf eine Etage, um mehr über unsere Leistungen zu erfahren
            </p>
          </div>

          {/* Villa Interactive */}
          <div className="relative max-w-3xl mx-auto">
            {/* Villa SVG Container */}
            <div className="relative w-full" style={{ paddingBottom: "133%" }}>
              {/* Background Villa Image */}
              <div className="absolute inset-0">
                <iframe
                  src="/villa-interactive.html"
                  className="w-full h-full border-0"
                  title="Interaktive Villa"
                />
              </div>

              {/* Clickable Floor Overlays */}
              {floors.map((floor) => (
                <Link
                  key={floor.id}
                  href={floor.href}
                  className="absolute left-0 right-0 cursor-pointer group transition-all duration-300"
                  style={{
                    top: floor.top,
                    height: floor.height,
                  }}
                  onMouseEnter={() => setHoveredFloor(floor.id)}
                  onMouseLeave={() => setHoveredFloor(null)}
                >
                  {/* Hover Overlay */}
                  <div
                    className={`absolute inset-0 transition-all duration-300 ${
                      hoveredFloor === floor.id
                        ? "bg-[#60A5FA]/20 shadow-[0_0_30px_rgba(96,165,250,0.4)]"
                        : "bg-transparent"
                    }`}
                  />
                  
                  {/* Label */}
                  <div
                    className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
                      hoveredFloor === floor.id
                        ? "opacity-100 scale-100"
                        : "opacity-0 scale-95"
                    }`}
                  >
                    <div className="bg-[#0A1628]/95 border-2 border-[#60A5FA] rounded-lg px-6 py-3 shadow-xl">
                      <p className="text-white font-semibold text-lg whitespace-nowrap" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        {floor.label}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {floors.map((floor) => (
              <Link
                key={floor.id}
                href={floor.href}
                className="flex items-center gap-3 p-4 bg-[#1a2a3a] border border-[#60A5FA]/20 rounded-lg hover:border-[#60A5FA] hover:shadow-lg hover:shadow-[#60A5FA]/20 transition-all duration-300"
              >
                <div className="w-3 h-3 rounded-full bg-[#60A5FA]" />
                <span className="text-white/90 font-medium" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  {floor.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
