"use client"

import Image from "next/image"
import { useCallback, useEffect, useRef, useState } from "react"

type Props = {
  beforeSrc: string
  afterSrc: string
  beforeAlt?: string
  afterAlt?: string
  initial?: number
  aspectRatio?: string
}

export function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  beforeAlt = "Vorher",
  afterAlt = "Nachher",
  initial = 50,
  aspectRatio = "3/2",
}: Props) {
  const [position, setPosition] = useState(initial)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const pct = ((clientX - rect.left) / rect.width) * 100
    setPosition(Math.max(0, Math.min(100, pct)))
  }, [])

  useEffect(() => {
    if (!isDragging) return
    const onMove = (e: MouseEvent | TouchEvent) => {
      const clientX = "touches" in e ? e.touches[0]?.clientX : e.clientX
      if (clientX != null) updateFromClientX(clientX)
    }
    const stop = () => setIsDragging(false)
    window.addEventListener("mousemove", onMove)
    window.addEventListener("touchmove", onMove, { passive: true })
    window.addEventListener("mouseup", stop)
    window.addEventListener("touchend", stop)
    return () => {
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("touchmove", onMove)
      window.removeEventListener("mouseup", stop)
      window.removeEventListener("touchend", stop)
    }
  }, [isDragging, updateFromClientX])

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") setPosition((p) => Math.max(0, p - 4))
    if (e.key === "ArrowRight") setPosition((p) => Math.min(100, p + 4))
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden select-none cursor-ew-resize"
      style={{ aspectRatio }}
      onMouseDown={(e) => {
        setIsDragging(true)
        updateFromClientX(e.clientX)
      }}
      onTouchStart={(e) => {
        setIsDragging(true)
        const t = e.touches[0]
        if (t) updateFromClientX(t.clientX)
      }}
    >
      <Image
        src={afterSrc}
        alt={afterAlt}
        fill
        sizes="(max-width: 768px) 100vw, 1200px"
        className="object-cover pointer-events-none"
      />

      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <Image
          src={beforeSrc}
          alt={beforeAlt}
          fill
          sizes="(max-width: 768px) 100vw, 1200px"
          className="object-cover"
        />
      </div>

      <span
        className="absolute top-4 left-4 px-3 py-1 text-[10px] tracking-[0.25em] uppercase"
        style={{
          fontFamily: "var(--font-headline)",
          background: "rgba(8,8,8,0.7)",
          border: "1px solid rgba(255,255,255,0.2)",
          color: "rgba(255,255,255,0.9)",
        }}
      >
        Vorher
      </span>
      <span
        className="absolute top-4 right-4 px-3 py-1 text-[10px] tracking-[0.25em] uppercase"
        style={{
          fontFamily: "var(--font-headline)",
          background: "rgba(201,164,92,0.9)",
          color: "#000",
        }}
      >
        Nachher
      </span>

      <div
        className="absolute top-0 bottom-0 w-px bg-white pointer-events-none"
        style={{ left: `${position}%` }}
      />

      <button
        type="button"
        role="slider"
        aria-label="Vorher/Nachher Vergleich"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(position)}
        onKeyDown={onKey}
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center cursor-ew-resize focus:outline-none focus:ring-2 focus:ring-[#c9a45c]"
        style={{ left: `${position}%` }}
        onMouseDown={(e) => {
          e.stopPropagation()
          setIsDragging(true)
        }}
        onTouchStart={(e) => {
          e.stopPropagation()
          setIsDragging(true)
        }}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M7 4L3 10l4 6M13 4l4 6-4 6" stroke="#0a0a0a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  )
}
