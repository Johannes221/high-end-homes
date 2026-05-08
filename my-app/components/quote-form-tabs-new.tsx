"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { CheckCircle2, DollarSign, Shield, Info } from "lucide-react"
import { ImageUpload } from "@/components/image-upload"

const buildingTypes = ["Wohnung", "Haus", "Keller", "Garage", "Dachgeschoss", "Büro", "Gewerbe", "Sonstiges"]
const floorOptions = ["Erdgeschoss", "1. OG", "2. OG", "3. OG+", "Keller"]
const clearanceMaterials = ["Möbel", "Elektrogeräte", "Kleidung & Textilien", "Holz", "Metall", "Kunststoff", "Baumaterialien", "Sondermüll"]
const guttingMaterials = ["Böden", "Deckenverkleidungen", "Wandverkleidungen & Putz", "Sanitär (Bad/WC)", "Elektroinstallationen", "Fenster & Türen", "Heizung & Rohre", "Trennwände"]
const constructionServices = ["Maler & Lackierer", "Trockenbau & Stukateur", "Fliesenleger", "Sanitär & Elektro", "Fensterbau & Gerüst"]

type FormData = {
  name: string
  email: string
  phone: string
  company: string
  squareMeters: string
  buildingType: string
  constructionYear: string
  floor: string
  elevator: string
  materials: string[]
  removalItems: string[]
  quantityEstimate: string
  valuables: string
  asbestosRequired: boolean
  otherPollutants: boolean
  disposalWanted: boolean
  permitStatus: string
  desiredDate: string
  notes: string
  imagesBase64: string[]
  imageFileNames: string[]
}

export function QuoteFormTabs() {
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState("entruempelung")
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    company: "",
    squareMeters: "",
    buildingType: "",
    constructionYear: "",
    floor: "",
    elevator: "",
    materials: [],
    removalItems: [],
    quantityEstimate: "",
    valuables: "",
    asbestosRequired: false,
    otherPollutants: false,
    disposalWanted: false,
    permitStatus: "",
    desiredDate: "",
    notes: "",
    imagesBase64: [],
    imageFileNames: [],
  })

  useEffect(() => {
    const serviceParam = searchParams.get("service")
    if (serviceParam === "entkernung") {
      setActiveTab("entkernung")
    } else if (serviceParam === "entruempelung") {
      setActiveTab("entruempelung")
    } else if (serviceParam === "kombi") {
      setActiveTab("kombi")
    } else if (serviceParam === "ausbau") {
      setActiveTab("ausbau")
    }
  }, [searchParams])

  const handleImageChange = (images: File[], base64Images: string[]) => {
    setFormData(prev => ({
      ...prev,
      imagesBase64: base64Images,
      imageFileNames: images.map(f => f.name),
    }))
  }

  const handleCheckboxChange = (field: "materials" | "removalItems", value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked 
        ? [...prev[field], value]
        : prev[field].filter(item => item !== value)
    }))
  }

  const handleSubmit = async (e: React.FormEvent, type: string) => {
    e.preventDefault()
    setSubmitting(true)
    setError("")

    try {
      const payload = {
        type,
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        company: formData.company || undefined,
        address: undefined,
        squareMeters: formData.squareMeters ? Number(formData.squareMeters) : undefined,
        buildingType: formData.buildingType || undefined,
        constructionYear: formData.constructionYear || undefined,
        floor: formData.floor || undefined,
        elevator: formData.elevator || undefined,
        materials: type === "Entrümpelung" || type === "Kombi" ? formData.materials : undefined,
        removalItems: type === "Entkernung" || type === "Kombi" ? formData.removalItems : undefined,
        quantityEstimate: formData.quantityEstimate || undefined,
        valuables: formData.valuables || undefined,
        asbestosRequired: formData.asbestosRequired || undefined,
        otherPollutants: formData.otherPollutants || undefined,
        disposalWanted: formData.disposalWanted || undefined,
        permitStatus: formData.permitStatus || undefined,
        desiredDate: formData.desiredDate || undefined,
        notes: formData.notes || undefined,
        imagesBase64: formData.imagesBase64.length > 0 ? formData.imagesBase64 : undefined,
        imageFileNames: formData.imageFileNames.length > 0 ? formData.imageFileNames : undefined,
      }

      const response = await fetch("/api/quote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Fehler beim Senden der Anfrage")
      }

      setSubmitted(true)
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        squareMeters: "",
        buildingType: "",
        constructionYear: "",
        floor: "",
        elevator: "",
        materials: [],
        removalItems: [],
        quantityEstimate: "",
        valuables: "",
        asbestosRequired: false,
        otherPollutants: false,
        disposalWanted: false,
        permitStatus: "",
        desiredDate: "",
        notes: "",
        imagesBase64: [],
        imageFileNames: [],
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Es ist ein Fehler aufgetreten")
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="bg-[var(--bg-2)] border p-12 text-center" style={{ borderColor: 'rgba(255,255,255,0.06)', borderRadius: '3px' }}>
        <CheckCircle2 className="w-16 h-16 text-white mx-auto mb-6" />
        <h3 className="text-2xl text-white mb-4" style={{ fontFamily: 'var(--font-headline)', fontWeight: 400 }}>
          Anfrage gesendet!
        </h3>
        <p className="mb-6" style={{ fontFamily: 'var(--font-body)', fontWeight: 300, color: 'rgba(255,255,255,0.55)' }}>
          Vielen Dank für Ihre Anfrage. Wir melden uns zeitnah bei Ihnen mit einem unverbindlichen Angebot.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="px-8 py-3.5 bg-white text-black hover:bg-[rgba(255,255,255,0.9)] font-semibold transition-all"
          style={{ fontFamily: 'var(--font-headline)', fontWeight: 600, letterSpacing: '0.05em', borderRadius: '3px' }}
        >
          Weitere Anfrage senden
        </button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-[var(--bg-2)] border p-1" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
            <TabsTrigger value="entruempelung" className="data-[state=active]:bg-white data-[state=active]:text-black" style={{ fontFamily: 'var(--font-headline)', fontWeight: 500 }}>
              Entrümpelung
            </TabsTrigger>
            <TabsTrigger value="entkernung" className="data-[state=active]:bg-white data-[state=active]:text-black" style={{ fontFamily: 'var(--font-headline)', fontWeight: 500 }}>
              Entkernung
            </TabsTrigger>
            <TabsTrigger value="kombi" className="data-[state=active]:bg-white data-[state=active]:text-black" style={{ fontFamily: 'var(--font-headline)', fontWeight: 500 }}>
              Kombi
            </TabsTrigger>
            <TabsTrigger value="ausbau" className="data-[state=active]:bg-white data-[state=active]:text-black" style={{ fontFamily: 'var(--font-headline)', fontWeight: 500 }}>
              Ausbau
            </TabsTrigger>
          </TabsList>

          <TabsContent value="entruempelung" className="mt-6">
            <div className="bg-[var(--bg-2)] border p-4 mb-6 flex items-start gap-3" style={{ borderColor: 'rgba(255,255,255,0.08)', borderRadius: '3px' }}>
              <Info className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
              <p style={{ fontFamily: 'var(--font-body)', fontWeight: 300, color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>Unverbindliche Preiseinschätzung – der finale Preis wird vor Ort festgelegt.</p>
            </div>
            <form onSubmit={(e) => handleSubmit(e, "Entrümpelung")} className="space-y-6 bg-[var(--bg-2)] border p-8" style={{ borderColor: 'rgba(255,255,255,0.08)', borderRadius: '3px' }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name" className="text-white">Name *</Label>
                  <Input 
                    id="name" 
                    required 
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="bg-[#0a0a0a] border-[rgba(255,255,255,0.1)] text-white" 
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-white">E-Mail *</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    required 
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="bg-[#0a0a0a] border-[rgba(255,255,255,0.1)] text-white" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="phone" className="text-white">Telefon</Label>
                  <Input 
                    id="phone" 
                    type="tel" 
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="bg-[#0a0a0a] border-[rgba(255,255,255,0.1)] text-white" 
                  />
                </div>
                <div>
                  <Label htmlFor="company" className="text-white">Firma (optional)</Label>
                  <Input 
                    id="company" 
                    value={formData.company}
                    onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                    className="bg-[#0a0a0a] border-[rgba(255,255,255,0.1)] text-white" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="sqm" className="text-white">Quadratmeter *</Label>
                  <Input 
                    id="sqm" 
                    type="number" 
                    required 
                    value={formData.squareMeters}
                    onChange={(e) => setFormData(prev => ({ ...prev, squareMeters: e.target.value }))}
                    className="bg-[#0a0a0a] border-[rgba(255,255,255,0.1)] text-white" 
                  />
                </div>
                <div>
                  <Label htmlFor="building-type" className="text-white">Gebäudetyp *</Label>
                  <Select 
                    required 
                    value={formData.buildingType}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, buildingType: value }))}
                  >
                    <SelectTrigger className="bg-[#0a0a0a] border-[rgba(255,255,255,0.1)] text-white">
                      <SelectValue placeholder="Wählen Sie..." />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0a0a0a] border-[rgba(255,255,255,0.1)]">
                      {buildingTypes.map((type) => (
                        <SelectItem key={type} value={type} className="text-white">{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="floor" className="text-white">Stockwerk</Label>
                  <Select 
                    value={formData.floor}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, floor: value }))}
                  >
                    <SelectTrigger className="bg-[#0a0a0a] border-[rgba(255,255,255,0.1)] text-white">
                      <SelectValue placeholder="Wählen Sie..." />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0a0a0a] border-[rgba(255,255,255,0.1)]">
                      {floorOptions.map((floor) => (
                        <SelectItem key={floor} value={floor} className="text-white">{floor}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="elevator" className="text-white">Aufzug vorhanden?</Label>
                  <Select 
                    value={formData.elevator}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, elevator: value }))}
                  >
                    <SelectTrigger className="bg-[#0a0a0a] border-[rgba(255,255,255,0.1)] text-white">
                      <SelectValue placeholder="Wählen Sie..." />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0a0a0a] border-[rgba(255,255,255,0.1)]">
                      <SelectItem value="ja" className="text-white">Ja</SelectItem>
                      <SelectItem value="nein" className="text-white">Nein</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="text-white mb-3 block">Materialien (Mehrfachauswahl)</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {clearanceMaterials.map((material) => (
                    <div key={material} className="flex items-center space-x-2">
                      <Checkbox 
                        id={material} 
                        checked={formData.materials.includes(material)}
                        onCheckedChange={(checked) => handleCheckboxChange("materials", material, checked as boolean)}
                        className="border-[rgba(255,255,255,0.1)]" 
                      />
                      <label htmlFor={material} className="text-sm text-white/80 cursor-pointer">
                        {material}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="valuables" className="text-white">Wertgegenstände vorhanden?</Label>
                <Textarea 
                  id="valuables" 
                  placeholder="Beschreiben Sie eventuelle Wertgegenstände..." 
                  value={formData.valuables}
                  onChange={(e) => setFormData(prev => ({ ...prev, valuables: e.target.value }))}
                  className="bg-[#0a0a0a] border-[rgba(255,255,255,0.1)] text-white" 
                />
              </div>

              <div>
                <Label htmlFor="date" className="text-white">Wunschtermin</Label>
                <Input 
                  id="date" 
                  type="date" 
                  value={formData.desiredDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, desiredDate: e.target.value }))}
                  className="bg-[#0a0a0a] border-[rgba(255,255,255,0.1)] text-white" 
                />
              </div>

              <div>
                <Label htmlFor="notes" className="text-white">Anmerkungen</Label>
                <Textarea 
                  id="notes" 
                  placeholder="Weitere Informationen..." 
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  className="bg-[#0a0a0a] border-[rgba(255,255,255,0.1)] text-white" 
                  rows={4} 
                />
              </div>

              <ImageUpload 
                id="images-entruempelung" 
                label="Bilder hochladen (optional)" 
                onChange={handleImageChange}
              />

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-sm p-4 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <Button 
                type="submit" 
                disabled={submitting}
                className="w-full bg-white text-black hover:bg-[rgba(255,255,255,0.9)] font-bold text-lg h-14"
              >
                {submitting ? "Wird gesendet..." : "Angebot anfragen"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="entkernung" className="mt-6">
            <div className="bg-white/10 border border-[rgba(255,255,255,0.1)] rounded-sm p-4 mb-6 flex items-start gap-3">
              <Info className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
              <p className="text-white/80 text-sm">Unverbindliche Preiseinschätzung – der finale Preis wird vor Ort festgelegt.</p>
            </div>
            <form onSubmit={(e) => handleSubmit(e, "Entkernung")} className="space-y-6 bg-[var(--bg-2)] border p-8" style={{ borderColor: 'rgba(255,255,255,0.08)', borderRadius: '3px' }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name-g" className="text-white">Name *</Label>
                  <Input 
                    id="name-g" 
                    required 
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="bg-[#0a0a0a] border-[rgba(255,255,255,0.1)] text-white" 
                  />
                </div>
                <div>
                  <Label htmlFor="email-g" className="text-white">E-Mail *</Label>
                  <Input 
                    id="email-g" 
                    type="email" 
                    required 
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="bg-[#0a0a0a] border-[rgba(255,255,255,0.1)] text-white" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="sqm-g" className="text-white">Quadratmeter *</Label>
                  <Input 
                    id="sqm-g" 
                    type="number" 
                    required 
                    value={formData.squareMeters}
                    onChange={(e) => setFormData(prev => ({ ...prev, squareMeters: e.target.value }))}
                    className="bg-[#0a0a0a] border-[rgba(255,255,255,0.1)] text-white" 
                  />
                </div>
                <div>
                  <Label htmlFor="building-type-g" className="text-white">Gebäudetyp *</Label>
                  <Select 
                    required 
                    value={formData.buildingType}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, buildingType: value }))}
                  >
                    <SelectTrigger className="bg-[#0a0a0a] border-[rgba(255,255,255,0.1)] text-white">
                      <SelectValue placeholder="Wählen Sie..." />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0a0a0a] border-[rgba(255,255,255,0.1)]">
                      {buildingTypes.map((type) => (
                        <SelectItem key={type} value={type} className="text-white">{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="text-white mb-3 block">Zu entfernende Elemente (Mehrfachauswahl)</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {guttingMaterials.map((material) => (
                    <div key={material} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`g-${material}`} 
                        checked={formData.removalItems.includes(material)}
                        onCheckedChange={(checked) => handleCheckboxChange("removalItems", material, checked as boolean)}
                        className="border-[rgba(255,255,255,0.1)]" 
                      />
                      <label htmlFor={`g-${material}`} className="text-sm text-white/80 cursor-pointer">
                        {material}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="asbestos" className="text-white">Asbest vorhanden?</Label>
                <Select 
                  value={formData.asbestosRequired ? "ja" : "nein"}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, asbestosRequired: value === "ja" }))}
                >
                  <SelectTrigger className="bg-[#0a0a0a] border-[rgba(255,255,255,0.1)] text-white">
                    <SelectValue placeholder="Wählen Sie..." />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0a0a0a] border-[rgba(255,255,255,0.1)]">
                    <SelectItem value="ja" className="text-white">Ja</SelectItem>
                    <SelectItem value="nein" className="text-white">Nein</SelectItem>
                    <SelectItem value="unbekannt" className="text-white">Unbekannt</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="notes-g" className="text-white">Anmerkungen</Label>
                <Textarea 
                  id="notes-g" 
                  placeholder="Weitere Informationen..." 
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  className="bg-[#0a0a0a] border-[rgba(255,255,255,0.1)] text-white" 
                  rows={4} 
                />
              </div>

              <ImageUpload 
                id="images-entkernung" 
                label="Bilder hochladen (optional)" 
                onChange={handleImageChange}
              />

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-sm p-4 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <Button 
                type="submit" 
                disabled={submitting}
                className="w-full bg-white text-black hover:bg-[rgba(255,255,255,0.9)] font-bold text-lg h-14"
              >
                {submitting ? "Wird gesendet..." : "Angebot anfragen"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="kombi" className="mt-6">
            <div className="bg-white/10 border border-[rgba(255,255,255,0.1)] rounded-sm p-4 mb-6 flex items-start gap-3">
              <Info className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
              <p className="text-white/80 text-sm">Unverbindliche Preiseinschätzung – der finale Preis wird vor Ort festgelegt.</p>
            </div>
            <form onSubmit={(e) => handleSubmit(e, "Kombi")} className="space-y-6 bg-[var(--bg-2)] border p-8" style={{ borderColor: 'rgba(255,255,255,0.08)', borderRadius: '3px' }}>
              <p className="text-white/70 text-sm mb-4">Kombinieren Sie Entkernung und Entrümpelung für ein Komplettpaket.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name-k" className="text-white">Name *</Label>
                  <Input 
                    id="name-k" 
                    required 
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="bg-[#0a0a0a] border-[rgba(255,255,255,0.1)] text-white" 
                  />
                </div>
                <div>
                  <Label htmlFor="email-k" className="text-white">E-Mail *</Label>
                  <Input 
                    id="email-k" 
                    type="email" 
                    required 
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="bg-[#0a0a0a] border-[rgba(255,255,255,0.1)] text-white" 
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="sqm-k" className="text-white">Quadratmeter *</Label>
                <Input 
                  id="sqm-k" 
                  type="number" 
                  required 
                  value={formData.squareMeters}
                  onChange={(e) => setFormData(prev => ({ ...prev, squareMeters: e.target.value }))}
                  className="bg-[#0a0a0a] border-[rgba(255,255,255,0.1)] text-white" 
                />
              </div>

              <div>
                <Label htmlFor="notes-k" className="text-white">Projektbeschreibung *</Label>
                <Textarea 
                  id="notes-k" 
                  placeholder="Beschreiben Sie Ihr Projekt..." 
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  className="bg-[#0a0a0a] border-[rgba(255,255,255,0.1)] text-white" 
                  rows={6} 
                  required 
                />
              </div>

              <ImageUpload 
                id="images-kombi" 
                label="Bilder hochladen (optional)" 
                onChange={handleImageChange}
              />

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-sm p-4 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <Button 
                type="submit" 
                disabled={submitting}
                className="w-full bg-white text-black hover:bg-[rgba(255,255,255,0.9)] font-bold text-lg h-14"
              >
                {submitting ? "Wird gesendet..." : "Angebot anfragen"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="ausbau" className="mt-6">
            <div className="bg-white/10 border border-[rgba(255,255,255,0.1)] rounded-sm p-4 mb-6 flex items-start gap-3">
              <Info className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
              <p className="text-white/80 text-sm">Unverbindliche Preiseinschätzung – der finale Preis wird vor Ort festgelegt.</p>
            </div>
            <form onSubmit={(e) => handleSubmit(e, "Ausbau")} className="space-y-6 bg-[var(--bg-2)] border p-8" style={{ borderColor: 'rgba(255,255,255,0.08)', borderRadius: '3px' }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name-a" className="text-white">Name *</Label>
                  <Input 
                    id="name-a" 
                    required 
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="bg-[#0a0a0a] border-[rgba(255,255,255,0.1)] text-white" 
                  />
                </div>
                <div>
                  <Label htmlFor="email-a" className="text-white">E-Mail *</Label>
                  <Input 
                    id="email-a" 
                    type="email" 
                    required 
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="bg-[#0a0a0a] border-[rgba(255,255,255,0.1)] text-white" 
                  />
                </div>
              </div>

              <div>
                <Label className="text-white mb-3 block">Gewünschte Leistungen (Mehrfachauswahl)</Label>
                <div className="space-y-3">
                  {constructionServices.map((service) => (
                    <div key={service} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`a-${service}`} 
                        checked={formData.materials.includes(service)}
                        onCheckedChange={(checked) => handleCheckboxChange("materials", service, checked as boolean)}
                        className="border-[rgba(255,255,255,0.1)]" 
                      />
                      <label htmlFor={`a-${service}`} className="text-sm text-white/80 cursor-pointer">
                        {service}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="sqm-a" className="text-white">Quadratmeter</Label>
                <Input 
                  id="sqm-a" 
                  type="number" 
                  value={formData.squareMeters}
                  onChange={(e) => setFormData(prev => ({ ...prev, squareMeters: e.target.value }))}
                  className="bg-[#0a0a0a] border-[rgba(255,255,255,0.1)] text-white" 
                />
              </div>

              <div>
                <Label htmlFor="notes-a" className="text-white">Projektbeschreibung *</Label>
                <Textarea 
                  id="notes-a" 
                  placeholder="Beschreiben Sie Ihr Projekt..." 
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  className="bg-[#0a0a0a] border-[rgba(255,255,255,0.1)] text-white" 
                  rows={6} 
                  required 
                />
              </div>

              <ImageUpload 
                id="images-ausbau" 
                label="Bilder hochladen (optional)" 
                onChange={handleImageChange}
              />

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-sm p-4 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <Button 
                type="submit" 
                disabled={submitting}
                className="w-full bg-white text-black hover:bg-[rgba(255,255,255,0.9)] font-bold text-lg h-14"
              >
                {submitting ? "Wird gesendet..." : "Angebot anfragen"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </div>

      <div className="lg:col-span-1">
        <div className="bg-[var(--bg-2)] border p-8 sticky top-24" style={{ borderColor: 'rgba(255,255,255,0.08)', borderRadius: '3px' }}>
          <h3 className="text-2xl text-white mb-6" style={{ fontFamily: 'var(--font-headline)', fontWeight: 400 }}>
            Ihre Vorteile
          </h3>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-white mb-1" style={{ fontFamily: 'var(--font-headline)', fontWeight: 500 }}>Schnell</h4>
                <p style={{ fontFamily: 'var(--font-body)', fontWeight: 300, color: 'rgba(255,255,255,0.55)', fontSize: '14px' }}>Kurzfristige Termine möglich</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-white mb-1" style={{ fontFamily: 'var(--font-headline)', fontWeight: 500 }}>Transparent</h4>
                <p style={{ fontFamily: 'var(--font-body)', fontWeight: 300, color: 'rgba(255,255,255,0.55)', fontSize: '14px' }}>Klare Preise ohne versteckte Kosten</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-white mb-1" style={{ fontFamily: 'var(--font-headline)', fontWeight: 500 }}>Professionell</h4>
                <p style={{ fontFamily: 'var(--font-body)', fontWeight: 300, color: 'rgba(255,255,255,0.55)', fontSize: '14px' }}>Erfahrenes Team mit hoher Qualität</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
