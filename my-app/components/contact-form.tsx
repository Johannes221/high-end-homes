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
      <div className="bg-[#111111] border border-[rgba(255,255,255,0.06)] rounded-sm p-12 text-center">
        <CheckCircle2 className="w-16 h-16 text-white mx-auto mb-6" />
        <h3 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-headline)' }}>
          Nachricht gesendet!
        </h3>
        <p className="text-white/70 mb-6" style={{ fontFamily: 'var(--font-body)', fontWeight: 300 }}>
          Vielen Dank für Ihre Nachricht. Wir melden uns zeitnah bei Ihnen.
        </p>
        <Button
          onClick={() => setSubmitted(false)}
          className="bg-white text-black hover:bg-white/90 font-semibold rounded-sm"
          style={{ fontFamily: 'var(--font-headline)' }}
        >
          Weitere Nachricht senden
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-[#111111] border border-[rgba(255,255,255,0.06)] rounded-sm p-8">
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
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-sm">
            {error}
          </div>
        )}

        <Button
          type="submit"
          disabled={submitting}
          className="w-full bg-white text-black hover:bg-white/90 font-bold text-lg h-14 rounded-sm"
          style={{ fontFamily: 'var(--font-headline)' }}
        >
          {submitting ? "Wird gesendet..." : "Nachricht senden"}
        </Button>
      </div>
    </form>
  )
}
