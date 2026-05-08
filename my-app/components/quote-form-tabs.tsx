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

export function QuoteFormTabs() {
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState("entruempelung")

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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Form Section */}
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

          {/* Entrümpelung Form */}
          <TabsContent value="entruempelung" className="mt-6">
            <div className="bg-[var(--bg-2)] border p-4 mb-6 flex items-start gap-3" style={{ borderColor: 'rgba(255,255,255,0.08)', borderRadius: '3px' }}>
              <Info className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
              <p style={{ fontFamily: 'var(--font-body)', fontWeight: 300, color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>Unverbindliche Preiseinschätzung – der finale Preis wird vor Ort festgelegt.</p>
            </div>
            <form className="space-y-6 bg-[var(--bg-2)] border p-8" style={{ borderColor: 'rgba(255,255,255,0.08)', borderRadius: '3px' }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name" className="text-white">Name *</Label>
                  <Input id="name" required className="bg-[#0a0a0a] border-[rgba(255,255,255,0.1)] text-white" />
                </div>
                <div>
                  <Label htmlFor="email" className="text-white">E-Mail *</Label>
                  <Input id="email" type="email" required className="bg-[#0a0a0a] border-[rgba(255,255,255,0.1)] text-white" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="phone" className="text-white">Telefon</Label>
                  <Input id="phone" type="tel" className="bg-[#0a0a0a] border-[rgba(255,255,255,0.1)] text-white" />
                </div>
                <div>
                  <Label htmlFor="company" className="text-white">Firma (optional)</Label>
                  <Input id="company" className="bg-[#0a0a0a] border-[rgba(255,255,255,0.1)] text-white" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="sqm" className="text-white">Quadratmeter *</Label>
                  <Input id="sqm" type="number" required className="bg-[#0a0a0a] border-[rgba(255,255,255,0.1)] text-white" />
                </div>
                <div>
                  <Label htmlFor="building-type" className="text-white">Gebäudetyp *</Label>
                  <Select required>
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
                  <Select>
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
                  <Select>
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
                      <Checkbox id={material} className="border-[rgba(255,255,255,0.1)]" />
                      <label htmlFor={material} className="text-sm text-white/80 cursor-pointer">
                        {material}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="valuables" className="text-white">Wertgegenstände vorhanden?</Label>
                <Textarea id="valuables" placeholder="Beschreiben Sie eventuelle Wertgegenstände..." className="bg-[#0a0a0a] border-[rgba(255,255,255,0.1)] text-white" />
              </div>

              <div>
                <Label htmlFor="date" className="text-white">Wunschtermin</Label>
                <Input id="date" type="date" className="bg-[#0a0a0a] border-[rgba(255,255,255,0.1)] text-white" />
              </div>

              <div>
                <Label htmlFor="notes" className="text-white">Anmerkungen</Label>
                <Textarea id="notes" placeholder="Weitere Informationen..." className="bg-[#0a0a0a] border-[rgba(255,255,255,0.1)] text-white" rows={4} />
              </div>

              <ImageUpload id="images-entruempelung" label="Bilder hochladen (optional)" />

              <Button type="submit" className="w-full bg-white text-black hover:bg-[rgba(255,255,255,0.9)] font-bold text-lg h-14">
                Angebot anfragen
              </Button>
            </form>
          </TabsContent>

          {/* Entkernung Form */}
          <TabsContent value="entkernung" className="mt-6">
            <div className="bg-white/10 border border-[rgba(255,255,255,0.1)] rounded-sm p-4 mb-6 flex items-start gap-3">
              <Info className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
              <p className="text-white/80 text-sm">Unverbindliche Preiseinschätzung – der finale Preis wird vor Ort festgelegt.</p>
            </div>
            <form className="space-y-6 bg-[var(--bg-2)] border border rounded-lg p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name-g" className="text-white">Name *</Label>
                  <Input id="name-g" required className="bg-[#0a0a0a] border-[rgba(255,255,255,0.1)] text-white" />
                </div>
                <div>
                  <Label htmlFor="email-g" className="text-white">E-Mail *</Label>
                  <Input id="email-g" type="email" required className="bg-[#0a0a0a] border-[rgba(255,255,255,0.1)] text-white" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="sqm-g" className="text-white">Quadratmeter *</Label>
                  <Input id="sqm-g" type="number" required className="bg-[#0a0a0a] border-[rgba(255,255,255,0.1)] text-white" />
                </div>
                <div>
                  <Label htmlFor="building-type-g" className="text-white">Gebäudetyp *</Label>
                  <Select required>
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
                      <Checkbox id={`g-${material}`} className="border-[rgba(255,255,255,0.1)]" />
                      <label htmlFor={`g-${material}`} className="text-sm text-white/80 cursor-pointer">
                        {material}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="asbestos" className="text-white">Asbest vorhanden?</Label>
                <Select>
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
                <Textarea id="notes-g" placeholder="Weitere Informationen..." className="bg-[#0a0a0a] border-[rgba(255,255,255,0.1)] text-white" rows={4} />
              </div>

              <ImageUpload id="images-entkernung" label="Bilder hochladen (optional)" />

              <Button type="submit" className="w-full bg-white text-black hover:bg-[rgba(255,255,255,0.9)] font-bold text-lg h-14">
                Angebot anfragen
              </Button>
            </form>
          </TabsContent>

          {/* Kombi Form */}
          <TabsContent value="kombi" className="mt-6">
            <div className="bg-white/10 border border-[rgba(255,255,255,0.1)] rounded-sm p-4 mb-6 flex items-start gap-3">
              <Info className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
              <p className="text-white/80 text-sm">Unverbindliche Preiseinschätzung – der finale Preis wird vor Ort festgelegt.</p>
            </div>
            <form className="space-y-6 bg-[var(--bg-2)] border border rounded-lg p-8">
              <p className="text-white/70 text-sm mb-4">Kombinieren Sie Entkernung und Entrümpelung für ein Komplettpaket.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name-k" className="text-white">Name *</Label>
                  <Input id="name-k" required className="bg-[#0a0a0a] border-[rgba(255,255,255,0.1)] text-white" />
                </div>
                <div>
                  <Label htmlFor="email-k" className="text-white">E-Mail *</Label>
                  <Input id="email-k" type="email" required className="bg-[#0a0a0a] border-[rgba(255,255,255,0.1)] text-white" />
                </div>
              </div>

              <div>
                <Label htmlFor="sqm-k" className="text-white">Quadratmeter *</Label>
                <Input id="sqm-k" type="number" required className="bg-[#0a0a0a] border-[rgba(255,255,255,0.1)] text-white" />
              </div>

              <div>
                <Label htmlFor="notes-k" className="text-white">Projektbeschreibung *</Label>
                <Textarea id="notes-k" placeholder="Beschreiben Sie Ihr Projekt..." className="bg-[#0a0a0a] border-[rgba(255,255,255,0.1)] text-white" rows={6} required />
              </div>

              <ImageUpload id="images-kombi" label="Bilder hochladen (optional)" />

              <Button type="submit" className="w-full bg-white text-black hover:bg-[rgba(255,255,255,0.9)] font-bold text-lg h-14">
                Angebot anfragen
              </Button>
            </form>
          </TabsContent>

          {/* Ausbau Form */}
          <TabsContent value="ausbau" className="mt-6">
            <div className="bg-white/10 border border-[rgba(255,255,255,0.1)] rounded-sm p-4 mb-6 flex items-start gap-3">
              <Info className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
              <p className="text-white/80 text-sm">Unverbindliche Preiseinschätzung – der finale Preis wird vor Ort festgelegt.</p>
            </div>
            <form className="space-y-6 bg-[var(--bg-2)] border border rounded-lg p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name-a" className="text-white">Name *</Label>
                  <Input id="name-a" required className="bg-[#0a0a0a] border-[rgba(255,255,255,0.1)] text-white" />
                </div>
                <div>
                  <Label htmlFor="email-a" className="text-white">E-Mail *</Label>
                  <Input id="email-a" type="email" required className="bg-[#0a0a0a] border-[rgba(255,255,255,0.1)] text-white" />
                </div>
              </div>

              <div>
                <Label className="text-white mb-3 block">Gewünschte Leistungen (Mehrfachauswahl)</Label>
                <div className="space-y-3">
                  {constructionServices.map((service) => (
                    <div key={service} className="flex items-center space-x-2">
                      <Checkbox id={`a-${service}`} className="border-[rgba(255,255,255,0.1)]" />
                      <label htmlFor={`a-${service}`} className="text-sm text-white/80 cursor-pointer">
                        {service}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="sqm-a" className="text-white">Quadratmeter</Label>
                <Input id="sqm-a" type="number" className="bg-[#0a0a0a] border-[rgba(255,255,255,0.1)] text-white" />
              </div>

              <div>
                <Label htmlFor="notes-a" className="text-white">Projektbeschreibung *</Label>
                <Textarea id="notes-a" placeholder="Beschreiben Sie Ihr Projekt..." className="bg-[#0a0a0a] border-[rgba(255,255,255,0.1)] text-white" rows={6} required />
              </div>

              <ImageUpload id="images-ausbau" label="Bilder hochladen (optional)" />

              <Button type="submit" className="w-full bg-white text-black hover:bg-[rgba(255,255,255,0.9)] font-bold text-lg h-14">
                Angebot anfragen
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </div>

      {/* Trust Box */}
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
