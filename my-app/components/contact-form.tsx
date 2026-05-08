"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle2 } from "lucide-react"

export function ContactForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [message, setMessage] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError("")

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          message,
        }),
      })

      if (!response.ok) {
        throw new Error("Fehler beim Senden der Nachricht")
      }

      setSubmitted(true)
      setName("")
      setEmail("")
      setPhone("")
      setMessage("")
    } catch (err) {
      setError("Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.")
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="bg-[var(--bg-2)] border p-12 text-center" style={{ borderColor: 'rgba(255,255,255,0.06)', borderRadius: '3px' }}>
        <CheckCircle2 className="w-16 h-16 text-white mx-auto mb-6" />
        <h3 className="text-2xl text-white mb-4" style={{ fontFamily: 'var(--font-headline)', fontWeight: 400 }}>
          Nachricht gesendet!
        </h3>
        <p className="mb-6" style={{ fontFamily: 'var(--font-body)', fontWeight: 300, color: 'rgba(255,255,255,0.55)' }}>
          Vielen Dank für Ihre Nachricht. Wir melden uns zeitnah bei Ihnen.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="px-8 py-3.5 bg-white text-black hover:bg-[rgba(255,255,255,0.9)] font-semibold transition-all"
          style={{ fontFamily: 'var(--font-headline)', fontWeight: 600, letterSpacing: '0.05em', borderRadius: '3px' }}
        >
          Weitere Nachricht senden
        </button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <form onSubmit={handleSubmit} className="lg:col-span-2 bg-[var(--bg-2)] border p-8" style={{ borderColor: 'rgba(255,255,255,0.06)', borderRadius: '3px' }}>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="name" className="text-white">Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-[#0a0a0a] border-[rgba(255,255,255,0.1)] text-white"
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-white">E-Mail *</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-[#0a0a0a] border-[rgba(255,255,255,0.1)] text-white"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="phone" className="text-white">Telefon (optional)</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="bg-[#0a0a0a] border-[rgba(255,255,255,0.1)] text-white"
            />
          </div>

          <div>
            <Label htmlFor="message" className="text-white">Nachricht *</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={6}
              className="bg-[#0a0a0a] border-[rgba(255,255,255,0.1)] text-white"
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4" style={{ borderRadius: '3px' }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full px-8 py-3.5 bg-white text-black hover:bg-[rgba(255,255,255,0.9)] font-semibold transition-all disabled:opacity-50"
            style={{ fontFamily: 'var(--font-headline)', fontWeight: 600, letterSpacing: '0.05em', borderRadius: '3px' }}
          >
            {submitting ? "Wird gesendet..." : "Nachricht senden →"}
          </button>
        </div>
      </form>

      <div className="bg-[var(--bg-2)] border p-8" style={{ borderColor: 'rgba(255,255,255,0.06)', borderRadius: '3px' }}>
        <h3 className="text-xl text-white mb-6" style={{ fontFamily: 'var(--font-headline)', fontWeight: 500 }}>
          Kontaktdaten
        </h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm mb-1" style={{ fontFamily: 'var(--font-headline)', color: 'rgba(255,255,255,0.5)' }}>E-Mail</p>
            <a href="mailto:bennet.pfeifer@highendhomes.de" className="hover:text-white transition-colors" style={{ fontFamily: 'var(--font-body)', fontWeight: 300, color: 'rgba(255,255,255,0.7)' }}>
              bennet.pfeifer@highendhomes.de
            </a>
          </div>
          <div>
            <p className="text-sm mb-1" style={{ fontFamily: 'var(--font-headline)', color: 'rgba(255,255,255,0.5)' }}>Adresse</p>
            <p style={{ fontFamily: 'var(--font-body)', fontWeight: 300, color: 'rgba(255,255,255,0.7)' }}>
              Gerhard-Hauptmann Straße 38<br />
              69221 Dossenheim
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
