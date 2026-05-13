"use client"

import { useState } from "react"

const TRADES = [
  "Maler & Lackierer",
  "Trockenbau & Stuckateur",
  "Fliesenleger",
  "Sanitär",
  "Elektro",
  "Fensterbau",
  "Gerüstbau",
  "Schreiner / Tischler",
  "Boden- / Parkettleger",
  "Dachdecker",
  "Sonstiges",
] as const

type Status = "idle" | "sending" | "success" | "error"

export function PartnerForm() {
  const [status, setStatus] = useState<Status>("idle")
  const [errorMsg, setErrorMsg] = useState("")

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus("sending")
    setErrorMsg("")

    const fd = new FormData(e.currentTarget)
    const payload = {
      company: fd.get("company"),
      contact: fd.get("contact"),
      trade: fd.get("trade"),
      employees: fd.get("employees"),
      region: fd.get("region"),
      email: fd.get("email"),
      phone: fd.get("phone"),
      website: fd.get("website"),
      message: fd.get("message"),
    }

    try {
      const res = await fetch("/api/partner", {
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
          Anfrage gesendet
        </h3>
        <p style={{ color: "rgba(255,255,255,0.65)" }}>
          Danke! Wir melden uns innerhalb weniger Tage bei Ihnen.
        </p>
      </div>
    )
  }

  const inputCls =
    "w-full bg-[#111] border border-[rgba(255,255,255,0.12)] px-4 py-3 text-white placeholder-[rgba(255,255,255,0.35)] focus:outline-none focus:border-[#c9a45c] transition-colors"
  const labelCls = "block text-xs uppercase tracking-[0.2em] mb-2"
  const labelStyle = { color: "rgba(255,255,255,0.5)" } as const

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className={labelCls} style={labelStyle}>
            Firma *
          </label>
          <input name="company" required className={inputCls} placeholder="Firmenname" />
        </div>
        <div>
          <label className={labelCls} style={labelStyle}>
            Ansprechpartner *
          </label>
          <input name="contact" required className={inputCls} placeholder="Vor- und Nachname" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className={labelCls} style={labelStyle}>
            Gewerk *
          </label>
          <select name="trade" required className={inputCls}>
            {TRADES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCls} style={labelStyle}>
            Mitarbeiter
          </label>
          <input name="employees" className={inputCls} placeholder="z. B. 5 Mitarbeiter" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className={labelCls} style={labelStyle}>
            E-Mail *
          </label>
          <input name="email" type="email" required className={inputCls} placeholder="name@firma.de" />
        </div>
        <div>
          <label className={labelCls} style={labelStyle}>
            Telefon
          </label>
          <input name="phone" className={inputCls} placeholder="+49 …" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className={labelCls} style={labelStyle}>
            Region / PLZ
          </label>
          <input name="region" className={inputCls} placeholder="z. B. 69221 / Heidelberg" />
        </div>
        <div>
          <label className={labelCls} style={labelStyle}>
            Website
          </label>
          <input name="website" className={inputCls} placeholder="https://…" />
        </div>
      </div>

      <div>
        <label className={labelCls} style={labelStyle}>
          Nachricht
        </label>
        <textarea name="message" rows={5} className={inputCls} placeholder="Referenzen, Spezialgebiete, Verfügbarkeit …" />
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
        {status === "sending" ? "Senden…" : "Anfrage senden →"}
      </button>
    </form>
  )
}
