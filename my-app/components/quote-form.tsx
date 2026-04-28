"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { 
  Calculator, 
  Upload, 
  Mail, 
  Home, 
  Trash2, 
  Clock,
  Euro,
  Calendar,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const formSchema = z.object({
  squareMeters: z.string().min(1, "Bitte geben Sie die Quadratmeter an"),
  buildingType: z.string().min(1, "Bitte wählen Sie einen Gebäudetyp"),
  materials: z.array(z.string()).min(1, "Bitte wählen Sie mindestens einen Stoff"),
  asbestos: z.boolean(),
  email: z.string().email("Bitte geben Sie eine gültige E-Mail-Adresse ein"),
  notes: z.string().optional(),
})

type FormSchemaType = z.infer<typeof formSchema>

type FormData = {
  squareMeters: string
  buildingType: string
  materials: string[]
  asbestos: boolean
  email: string
  notes?: string
}

const buildingTypes = [
  { value: "wohnung", label: "Wohnung" },
  { value: "haus", label: "Einfamilienhaus" },
  { value: "gewerbe", label: "Gewerbeobjekt" },
  { value: "buero", label: "Bürogebäude" },
  { value: "lager", label: "Lagerhalle" },
  { value: "industrie", label: "Industriegebäude" },
]

const materialOptions = [
  { id: "holz", label: "Holz" },
  { id: "metall", label: "Metall" },
  { id: "kunststoff", label: "Kunststoff" },
  { id: "glas", label: "Glas" },
  { id: "elektronik", label: "Elektronik" },
  { id: "moebel", label: "Möbel" },
  { id: "textilien", label: "Textilien" },
  { id: "baumaterial", label: "Baumaterialien" },
]

interface QuoteResult {
  priceRange: {
    min: number
    max: number
  }
  durationRange: {
    min: number
    max: number
  }
}

export function QuoteForm() {
  const [files, setFiles] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [quoteResult, setQuoteResult] = useState<QuoteResult | null>(null)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      materials: [],
      asbestos: false,
    },
  })

  const selectedMaterials = watch("materials")
  const asbestos = watch("asbestos")

  const handleMaterialToggle = (materialId: string) => {
    const current = selectedMaterials || []
    const updated = current.includes(materialId)
      ? current.filter((m) => m !== materialId)
      : [...current, materialId]
    setValue("materials", updated, { shouldValidate: true })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
    }
  }

  const onSubmit = async (data: FormSchemaType) => {
    setIsSubmitting(true)
    setSubmitStatus("idle")

    try {
      // Create FormData for file upload
      const formData = new FormData()
      formData.append("squareMeters", data.squareMeters)
      formData.append("buildingType", data.buildingType)
      formData.append("materials", JSON.stringify(data.materials))
      formData.append("asbestos", String(data.asbestos))
      formData.append("email", data.email)
      formData.append("notes", data.notes || "")

      files.forEach((file) => {
        formData.append("images", file)
      })

      // Use environment variable for API URL, fallback to relative path
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "/api/quote"
      const response = await fetch(apiUrl, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to submit quote")
      }

      const result = await response.json()
      setQuoteResult(result)
      setSubmitStatus("success")
    } catch (error) {
      console.error("Error submitting quote:", error)
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="quote" className="py-24 bg-[#0a0a0a]">
      <div className="section-padding max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 bg-[#c9a45c]/10 border border-[#c9a45c]/30 rounded-full text-[#c9a45c] text-sm font-medium mb-4">
            Kostenloses Angebot
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Ihr <span className="text-gold-gradient">Angebot</span> in 2 Minuten
          </h2>
          <p className="text-lg text-[#fafafa]/60 max-w-2xl mx-auto">
            Füllen Sie das Formular aus und erhalten Sie sofort eine Preisschätzung 
            für Ihre Entrümpelung oder Entkernung.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="bg-[#1a1a1a] border-[#2a2a2a]">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-[#c9a45c]" />
                  Projekt-Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Square Meters */}
                  <div className="space-y-2">
                    <Label htmlFor="squareMeters" className="flex items-center gap-2">
                      <Home className="w-4 h-4 text-[#c9a45c]" />
                      Quadratmeter
                    </Label>
                    <Input
                      id="squareMeters"
                      type="number"
                      placeholder="z.B. 100"
                      {...register("squareMeters")}
                      className="bg-[#0a0a0a] border-[#2a2a2a] text-[#fafafa]"
                    />
                    {errors.squareMeters && (
                      <p className="text-red-400 text-sm">{errors.squareMeters.message}</p>
                    )}
                  </div>

                  {/* Building Type */}
                  <div className="space-y-2">
                    <Label htmlFor="buildingType">Gebäudetyp</Label>
                    <Select onValueChange={(value) => setValue("buildingType", value)}>
                      <SelectTrigger className="bg-[#0a0a0a] border-[#2a2a2a] text-[#fafafa]">
                        <SelectValue placeholder="Wählen Sie einen Gebäudetyp" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1a1a1a] border-[#2a2a2a]">
                        {buildingTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.buildingType && (
                      <p className="text-red-400 text-sm">{errors.buildingType.message}</p>
                    )}
                  </div>

                  {/* Materials */}
                  <div className="space-y-3">
                    <Label className="flex items-center gap-2">
                      <Trash2 className="w-4 h-4 text-[#c9a45c]" />
                      Welche Stoffe müssen entsorgt werden?
                    </Label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {materialOptions.map((material) => (
                        <div key={material.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={material.id}
                            checked={selectedMaterials?.includes(material.id)}
                            onCheckedChange={() => handleMaterialToggle(material.id)}
                          />
                          <Label
                            htmlFor={material.id}
                            className="text-sm font-normal cursor-pointer"
                          >
                            {material.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                    {errors.materials && (
                      <p className="text-red-400 text-sm">{errors.materials.message}</p>
                    )}
                  </div>

                  {/* Asbestos */}
                  <div className="flex items-start space-x-3 p-4 bg-[#c9a45c]/5 border border-[#c9a45c]/20 rounded-lg">
                    <Checkbox
                      id="asbestos"
                      checked={asbestos}
                      onCheckedChange={(checked) => setValue("asbestos", checked as boolean)}
                    />
                    <div className="space-y-1">
                      <Label htmlFor="asbestos" className="font-medium cursor-pointer">
                        Zertifizierte Asbest-Entsorgung erforderlich
                      </Label>
                      <p className="text-sm text-[#fafafa]/60">
                        Wir arbeiten mit zertifizierten Fachbetrieben für die sichere Asbestentsorgung.
                      </p>
                    </div>
                  </div>

                  {/* Image Upload */}
                  <div className="space-y-2">
                    <Label htmlFor="images" className="flex items-center gap-2">
                      <Upload className="w-4 h-4 text-[#c9a45c]" />
                      Bilder hochladen (optional)
                    </Label>
                    <Input
                      id="images"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileChange}
                      className="bg-[#0a0a0a] border-[#2a2a2a] text-[#fafafa]"
                    />
                    {files.length > 0 && (
                      <p className="text-sm text-[#c9a45c]">
                        {files.length} Bilder ausgewählt
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-[#c9a45c]" />
                      E-Mail-Adresse
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="ihre@email.de"
                      {...register("email")}
                      className="bg-[#0a0a0a] border-[#2a2a2a] text-[#fafafa]"
                    />
                    {errors.email && (
                      <p className="text-red-400 text-sm">{errors.email.message}</p>
                    )}
                  </div>

                  {/* Notes */}
                  <div className="space-y-2">
                    <Label htmlFor="notes">Zusätzliche Informationen</Label>
                    <Textarea
                      id="notes"
                      placeholder="Besondere Anforderungen, Zugangsbeschränkungen, etc."
                      {...register("notes")}
                      className="bg-[#0a0a0a] border-[#2a2a2a] text-[#fafafa] min-h-[100px]"
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#c9a45c] text-[#0a0a0a] hover:bg-[#d4af37] font-semibold h-12 text-lg"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Wird berechnet...
                      </>
                    ) : (
                      <>
                        Angebot berechnen
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Result Card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="bg-[#1a1a1a] border-[#2a2a2a] h-full">
              <CardHeader>
                <CardTitle className="text-xl text-center">Ihr Ergebnis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {submitStatus === "success" && quoteResult ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-6"
                  >
                    <div className="text-center">
                      <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Angebot erstellt!</h3>
                      <p className="text-[#fafafa]/60 text-sm">
                        Wir haben Ihnen eine detaillierte E-Mail gesendet.
                      </p>
                    </div>

                    <div className="space-y-4 p-4 bg-[#0a0a0a] rounded-lg">
                      <div className="flex items-center gap-3">
                        <Euro className="w-5 h-5 text-[#c9a45c]" />
                        <div>
                          <p className="text-sm text-[#fafafa]/60">Geschätzter Preis</p>
                          <p className="text-xl font-bold text-[#c9a45c]">
                            {quoteResult.priceRange.min.toLocaleString("de-DE")} € -{" "}
                            {quoteResult.priceRange.max.toLocaleString("de-DE")} €
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-[#c9a45c]" />
                        <div>
                          <p className="text-sm text-[#fafafa]/60">Geschätzte Dauer</p>
                          <p className="text-lg font-semibold">
                            {quoteResult.durationRange.min} - {quoteResult.durationRange.max} Tage
                          </p>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-[#fafafa]/40 text-center">
                      * Dies ist eine Schätzung. Der endgültige Preis kann nach Besichtigung variieren.
                    </p>
                  </motion.div>
                ) : submitStatus === "error" ? (
                  <div className="text-center py-8">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <p className="text-[#fafafa]/60">
                      Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-8 space-y-4">
                    <Clock className="w-12 h-12 text-[#c9a45c]/50 mx-auto" />
                    <p className="text-[#fafafa]/60">
                      Füllen Sie das Formular aus, um Ihr persönliches Angebot zu erhalten.
                    </p>
                    <div className="space-y-2 text-sm text-[#fafafa]/40">
                      <p>Schnelle Berechnung</p>
                      <p>Unverbindlich & Kostenlos</p>
                      <p>Preis- und Zeitschätzung</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
