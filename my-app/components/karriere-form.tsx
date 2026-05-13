"use client"

import { useState, useRef } from "react"

const POSITIONS = [
  "Maler & Lackierer (m/w/d)",
  "Trockenbauer (m/w/d)",
  "Fliesenleger (m/w/d)",
  "Initiativbewerbung",
] as const

type Status = "idle" | "sending" | "success" | "error"

export function KarriereForm({ defaultPosition }: { defaultPosition?: string }) {
  const [status, setStatus] = useState<Status>("idle")
  const [errorMsg, setErrorMsg] = useState("")
  const fileRef = useRef<HTMLInputElement>(null)

  async function readFileAsBase64(file: File): Promise<{ name: string; mime: string; data: string }> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const result = reader.result as string
        const data = result.split(",")[1] ?? ""
        resolve({ name: file.name, mime: file.type, data })
      }
      reader.onerror = () => reject(new Error("Datei konnte nicht gelesen werden"))
      reader.readAsDataURL(file)
    })
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus("sending")
    setErrorMsg("")

    const fd = new FormData(e.currentTarget)
    const file = fileRef.current?.files?.[0]

    if (file && file.size > 8 * 1024 * 1024) {
      setStatus("error")
      setErrorMsg("Datei zu groß (max. 8 MB).")
      return
    }

    const payload: Record<string, unknown> = {
      position: fd.get("position"),
      name: fd.get("name"),
      email: fd.get("email"),
      phone: fd.get("phone"),
      experience: fd.get("experience"),
      availability: fd.get("availability"),
      message: fd.get("message"),
    }

    if (file) {
      payload.attachment = await readFileAsBase64(file)
    }

    try {
      const res = await fetch("/api/karriere", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || "Senden fehlgeschlagen")
      }
      setStatus("success")
      ;(e.target as HTMLFormElement).reset()
    } catch (err) {
      setStatus("error")
      setErrorMsg(err instanceof Error ? err.message : "Senden fehlgeschlagen")
    }
  }

  if (status === "success") {
    return (
      <div
        className="border p-10 text-center"
        style={{ borderColor: "rgba(201,164,92,0.4)", background: "rgba(201,164,92,0.05)" }}
      >
        <h3 className="text-2xl mb-3" style={{ fontFamily: "var(--font-headline)", color: "#fff" }}>
          Bewerbung gesendet
        </h3>
        <p style={{ color: "rgba(255,255,255,0.65)" }}>
          Vielen Dank! Wir melden uns innerhalb weniger Tage bei dir.
        </p>
      </div>
    )
  }

  const inputCls =
    "w-full bg-[#111] border border-[rgba(255,255,255,0.12)] px-4 py-3 text-white placeholder-[rgba(255,255,255,0.35)] focus:outline-none focus:border-[#c9a45c] transition-colors"

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <label className="block text-xs uppercase tracking-[0.2em] mb-2" style={{ color: "rgba(255,255,255,0.5)" }}>
          Position
        </label>
        <select name="position" required defaultValue={defaultPosition ?? POSITIONS[0]} className={inputCls}>
          {POSITIONS.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs uppercase tracking-[0.2em] mb-2" style={{ color: "rgba(255,255,255,0.5)" }}>
            Name *
          </label>
          <input name="name" required className={inputCls} placeholder="Vor- und Nachname" />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-[0.2em] mb-2" style={{ color: "rgba(255,255,255,0.5)" }}>
            E-Mail *
          </label>
          <input name="email" type="email" required className={inputCls} placeholder="name@beispiel.de" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs uppercase tracking-[0.2em] mb-2" style={{ color: "rgba(255,255,255,0.5)" }}>
            Telefon
          </label>
          <input name="phone" className={inputCls} placeholder="+49 …" />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-[0.2em] mb-2" style={{ color: "rgba(255,255,255,0.5)" }}>
            Verfügbar ab
          </label>
          <input name="availability" className={inputCls} placeholder="z. B. sofort, 01.07.2026" />
        </div>
      </div>

      <div>
        <label className="block text-xs uppercase tracking-[0.2em] mb-2" style={{ color: "rgba(255,255,255,0.5)" }}>
          Berufserfahrung
        </label>
        <input name="experience" className={inputCls} placeholder="z. B. 5 Jahre Trockenbau" />
      </div>

      <div>
        <label className="block text-xs uppercase tracking-[0.2em] mb-2" style={{ color: "rgba(255,255,255,0.5)" }}>
          Nachricht
        </label>
        <textarea name="message" rows={5} className={inputCls} placeholder="Worauf legst du Wert? Was sollen wir wissen?" />
      </div>

      <div>
        <label className="block text-xs uppercase tracking-[0.2em] mb-2" style={{ color: "rgba(255,255,255,0.5)" }}>
          Lebenslauf (PDF, optional)
        </label>
        <input ref={fileRef} type="file" accept="application/pdf,.pdf" className="w-full text-sm text-white file:mr-4 file:px-4 file:py-2 file:border-0 file:bg-[#c9a45c] file:text-black file:cursor-pointer file:hover:bg-[#d9b46c]" />
      </div>

      {status === "error" && (
        <p className="text-sm" style={{ color: "#ff8585" }}>
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full md:w-auto px-10 py-4 bg-[#c9a45c] text-black hover:bg-[#d9b46c] transition-all disabled:opacity-50"
        style={{ fontFamily: "var(--font-headline)", fontWeight: 600, letterSpacing: "0.05em", borderRadius: "3px" }}
      >
        {status === "sending" ? "Senden…" : "Bewerbung senden →"}
      </button>
    </form>
  )
}
