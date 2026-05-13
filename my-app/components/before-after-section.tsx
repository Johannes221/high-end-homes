import { BeforeAfterSlider } from "./before-after-slider"

const sample = {
  beforeSrc: "/before-after/innen-before.webp",
  afterSrc: "/before-after/innen-after.webp",
  caption: "Innenausbau – nach Entkernung, Malerarbeiten und Bodenverlegung",
}

export function BeforeAfterSection() {
  return (
    <section className="py-20 md:py-28 bg-[#0a0a0a]">
      <div className="section-padding mx-auto max-w-6xl">
        <div className="text-center mb-12 mx-auto max-w-3xl">
          <p
            className="text-[11px] font-semibold tracking-[0.3em] uppercase mb-3"
            style={{ fontFamily: "var(--font-headline)", color: "rgba(255,255,255,0.5)" }}
          >
            VORHER · NACHHER
          </p>
          <h2
            className="heading-glow text-3xl md:text-4xl lg:text-5xl mb-4 text-balance"
            style={{ fontFamily: "var(--font-headline)", fontWeight: 300, letterSpacing: "0.02em" }}
          >
            Das gleiche Objekt. Ein anderer Eindruck.
          </h2>
          <p
            className="text-sm md:text-base"
            style={{ fontFamily: "var(--font-body)", color: "rgba(255,255,255,0.55)" }}
          >
            Schieben Sie den Regler, um den Unterschied zu sehen.
          </p>
        </div>

        <div className="border" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <BeforeAfterSlider
            beforeSrc={sample.beforeSrc}
            afterSrc={sample.afterSrc}
            beforeAlt="Vorher – Innenausbau"
            afterAlt="Nachher – Innenausbau"
          />
        </div>
        <p
          className="text-center text-sm mt-5"
          style={{ fontFamily: "var(--font-body)", color: "rgba(255,255,255,0.45)" }}
        >
          {sample.caption}
        </p>
      </div>
    </section>
  )
}
