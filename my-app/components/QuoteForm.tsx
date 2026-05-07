"use client"

import { useState, useEffect, type CSSProperties, type FormEvent } from "react"
import { useSearchParams } from "next/navigation"

type TabType = "entruempelung" | "entkernung" | "entkernung-entruempelung"

type ClearanceErrors = {
  name?: string
  email?: string
  squareMeters?: string
  buildingType?: string
}

type GuttingErrors = {
  name?: string
  email?: string
  squareMeters?: string
  buildingType?: string
}

const colors = {
  page: "#0a0a0a",
  card: "#1a1a1a",
  border: "#2a2a2a",
  gold: "#c9a45c",
  text: "#ffffff",
  muted: "rgba(255,255,255,0.7)",
  faint: "rgba(255,255,255,0.4)",
  error: "#ef4444",
}

const clearanceMaterialOptions = [
  "Möbel",
  "Elektrogeräte",
  "Kleidung & Textilien",
  "Holz",
  "Metall",
  "Kunststoff",
  "Baumaterialien",
  "Sondermüll",
]

const guttingRemovalOptions = [
  "Böden",
  "Deckenverkleidungen",
  "Wandverkleidungen & Putz",
  "Sanitär (Bad/WC)",
  "Elektroinstallationen",
  "Fenster & Türen",
  "Heizung & Rohre",
  "Trennwände",
]

const clearanceBuildingOptions = ["Wohnung", "Haus", "Keller", "Garage", "Dachgeschoss", "Sonstiges"]
const guttingBuildingOptions = ["Wohnung", "Haus", "Büro", "Gewerbe", "Industriegebäude", "Sonstiges"]
const combinedBuildingOptions = ["Wohnung", "Haus", "Keller", "Garage", "Dachgeschoss", "Büro", "Gewerbe", "Industriegebäude", "Sonstiges"]
const floorOptions = ["Erdgeschoss", "1.OG", "2.OG", "3.OG+", "Keller"]
const quantityOptions = ["Wenig", "Mittel", "Viel"]
const permitOptions = ["Ja", "Nein", "Noch nicht"]

const sectionTitleStyle: CSSProperties = {
  color: colors.gold,
  fontSize: 16,
  fontWeight: 600,
  margin: "0 0 16px 0",
}

const inputStyle: CSSProperties = {
  width: "100%",
  padding: "10px 14px",
  borderRadius: 8,
  border: `1px solid ${colors.border}`,
  backgroundColor: colors.page,
  color: colors.text,
  fontSize: 14,
  boxSizing: "border-box",
}

const labelStyle: CSSProperties = {
  display: "block",
  color: colors.text,
  fontSize: 14,
  marginBottom: 8,
}

const fieldWrapStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 8,
}

const helperTextStyle: CSSProperties = {
  fontSize: 12,
  color: colors.muted,
  margin: 0,
}

const errorTextStyle: CSSProperties = {
  fontSize: 12,
  color: colors.error,
  margin: 0,
}

const cardStyle: CSSProperties = {
  backgroundColor: colors.card,
  border: `1px solid ${colors.border}`,
  borderRadius: 16,
  padding: 24,
}

const fileUploadStyle: CSSProperties = {
  width: "100%",
  padding: "24px",
  borderRadius: 12,
  border: `2px dashed ${colors.border}`,
  backgroundColor: "rgba(255,255,255,0.02)",
  cursor: "pointer",
  transition: "all 0.2s ease",
  textAlign: "center",
}

const fileUploadHoverStyle: CSSProperties = {
  borderColor: colors.gold,
  backgroundColor: "rgba(201,164,92,0.08)",
}

function requiredLabel(label: string) {
  return (
    <>
      {label} <span style={{ color: colors.gold }}>*</span>
    </>
  )
}

function optionalLabel(label: string) {
  return (
    <>
      {label} <span style={{ color: colors.faint }}>(optional)</span>
    </>
  )
}

function getChipStyle(selected: boolean): CSSProperties {
  return {
    padding: "10px 14px",
    borderRadius: 999,
    border: `1px solid ${selected ? colors.gold : colors.border}`,
    backgroundColor: selected ? "rgba(201,164,92,0.18)" : colors.page,
    color: colors.text,
    fontSize: 14,
    cursor: "pointer",
  }
}

function getToggleStyle(selected: boolean): CSSProperties {
  return {
    flex: 1,
    padding: "10px 14px",
    borderRadius: 8,
    border: `1px solid ${selected ? colors.gold : colors.border}`,
    backgroundColor: selected ? colors.gold : colors.page,
    color: selected ? "#000000" : colors.text,
    fontSize: 14,
    cursor: "pointer",
  }
}

function getTabStyle(active: boolean): CSSProperties {
  return {
    flex: 1,
    padding: "14px 16px",
    borderRadius: 10,
    border: `1px solid ${active ? colors.gold : colors.border}`,
    backgroundColor: active ? colors.gold : colors.card,
    color: active ? "#000000" : colors.text,
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
  }
}

function sanitizePayloadName(name: string) {
  return name.trim() || "Unbekannt"
}

const configuredBackendUrl = process.env.NEXT_PUBLIC_BACKEND_URL?.trim()

function resolveBackendUrl(pathname: string) {
  if (!configuredBackendUrl) {
    return pathname
  }

  const normalizedBaseUrl = configuredBackendUrl.endsWith("/")
    ? configuredBackendUrl.slice(0, -1)
    : configuredBackendUrl
  const normalizedPathname = pathname.startsWith("/") ? pathname : `/${pathname}`

  return `${normalizedBaseUrl}${normalizedPathname}`
}

function FileUpload({
  id,
  files,
  onFilesChange,
  label,
}: {
  id: string
  files: string[]
  onFilesChange: (files: string[]) => void
  label: string
}) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = (error) => reject(error)
    })
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFiles = Array.from(e.dataTransfer.files).filter((file) => file.type.startsWith("image/"))
    const base64Files = await Promise.all(droppedFiles.map((f) => convertFileToBase64(f)))
    onFilesChange([...files, ...base64Files])
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    const base64Files = await Promise.all(selectedFiles.map((file) => convertFileToBase64(file)))
    onFilesChange([...files, ...base64Files])
  }

  const removeFile = (index: number) => {
    onFilesChange(files.filter((_, i) => i !== index))
  }

  return (
    <div style={fieldWrapStyle}>
      <label style={labelStyle} htmlFor={id}>{label}</label>
      <div
        style={{
          ...fileUploadStyle,
          ...(isDragging ? fileUploadHoverStyle : {}),
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById(id)?.click()}
      >
        <input
          id={id}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          style={{ display: "none" }}
        />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <div style={{ fontSize: 32, color: colors.gold }}>📷</div>
          <div style={{ color: colors.text, fontSize: 14, fontWeight: 500 }}>
            {files.length === 0 ? "Bilder hierher ziehen oder klicken" : `${files.length} Bild${files.length > 1 ? "er" : ""} ausgewählt`}
          </div>
          <div style={{ color: colors.muted, fontSize: 12 }}>
            {files.length === 0 ? "JPG, PNG, WEBP (max 5MB pro Bild)" : "Weitere Bilder hinzufügen"}
          </div>
        </div>
      </div>
      {files.length > 0 && (
        <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: colors.text, fontSize: 13, fontWeight: 500 }}>Ausgewählte Bilder:</span>
            <button
              type="button"
              onClick={() => onFilesChange([])}
              style={{
                padding: "4px 10px",
                borderRadius: 6,
                border: `1px solid ${colors.border}`,
                backgroundColor: colors.page,
                color: colors.muted,
                fontSize: 11,
                cursor: "pointer",
              }}
            >
              Alle entfernen
            </button>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {files.map((base64, index) => {
              const mimeType = base64.split(":")[1]?.split(";")[0] || "image/jpeg"
              const fileExt = mimeType.split("/")[1] || "jpg"
              return (
                <div
                  key={`${base64.slice(0, 20)}-${index}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "6px 10px",
                    borderRadius: 8,
                    backgroundColor: "rgba(255,255,255,0.05)",
                    border: `1px solid ${colors.border}`,
                    fontSize: 12,
                    color: colors.text,
                  }}
                >
                  <img
                    src={base64}
                    alt={`Bild ${index + 1}`}
                    style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 4 }}
                  />
                  <span style={{ maxWidth: 80, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    Bild.{fileExt}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      border: "none",
                      backgroundColor: colors.error,
                      color: "#fff",
                      fontSize: 11,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: 0,
                    }}
                  >
                    ×
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export function QuoteForm() {
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState<TabType>("entruempelung")

  useEffect(() => {
    const tabParam = searchParams.get("tab")
    if (tabParam === "entkernung") {
      setActiveTab("entkernung")
    } else if (tabParam === "entkernung-entruempelung") {
      setActiveTab("entkernung-entruempelung")
    } else if (tabParam === "entruempelung") {
      setActiveTab("entruempelung")
    }

    // Scroll to quote section if hash is present
    if (window.location.hash === "#quote") {
      setTimeout(() => {
        const element = document.getElementById("quote")
        if (element) {
          element.scrollIntoView({ behavior: "smooth" })
        }
      }, 100)
    }
  }, [searchParams])
  const [clearanceName, setClearanceName] = useState("")
  const [clearanceEmail, setClearanceEmail] = useState("")
  const [clearancePhone, setClearancePhone] = useState("")
  const [clearanceCompany, setClearanceCompany] = useState("")
  const [clearanceSquareMeters, setClearanceSquareMeters] = useState("")
  const [clearanceBuildingType, setClearanceBuildingType] = useState("")
  const [clearanceFloor, setClearanceFloor] = useState("")
  const [clearanceElevator, setClearanceElevator] = useState("")
  const [clearanceMaterials, setClearanceMaterials] = useState<string[]>([])
  const [clearanceQuantity, setClearanceQuantity] = useState("")
  const [clearanceValuables, setClearanceValuables] = useState("")
  const [clearanceAsbestos, setClearanceAsbestos] = useState(false)
  const [clearanceDesiredDate, setClearanceDesiredDate] = useState("")
  const [clearanceFiles, setClearanceFiles] = useState<string[]>([])
  const [clearanceNotes, setClearanceNotes] = useState("")
  const [clearanceErrors, setClearanceErrors] = useState<ClearanceErrors>({})
  const [clearanceSubmitting, setClearanceSubmitting] = useState(false)
  const [clearanceSubmitError, setClearanceSubmitError] = useState("")
  const [clearanceSubmitted, setClearanceSubmitted] = useState(false)

  const [guttingName, setGuttingName] = useState("")
  const [guttingEmail, setGuttingEmail] = useState("")
  const [guttingPhone, setGuttingPhone] = useState("")
  const [guttingCompany, setGuttingCompany] = useState("")
  const [guttingSquareMeters, setGuttingSquareMeters] = useState("")
  const [guttingBuildingType, setGuttingBuildingType] = useState("")
  const [guttingConstructionYear, setGuttingConstructionYear] = useState("")
  const [guttingFloor, setGuttingFloor] = useState("")
  const [guttingElevator, setGuttingElevator] = useState("")
  const [guttingRemovalItems, setGuttingRemovalItems] = useState<string[]>([])
  const [guttingAsbestos, setGuttingAsbestos] = useState(false)
  const [guttingPollutants, setGuttingPollutants] = useState(false)
  const [guttingDisposalWanted, setGuttingDisposalWanted] = useState(false)
  const [guttingPermit, setGuttingPermit] = useState("")
  const [guttingDesiredDate, setGuttingDesiredDate] = useState("")
  const [guttingFiles, setGuttingFiles] = useState<string[]>([])
  const [guttingNotes, setGuttingNotes] = useState("")
  const [guttingErrors, setGuttingErrors] = useState<GuttingErrors>({})
  const [guttingSubmitting, setGuttingSubmitting] = useState(false)
  const [guttingSubmitError, setGuttingSubmitError] = useState("")
  const [guttingSubmitted, setGuttingSubmitted] = useState(false)

  const [combinedName, setCombinedName] = useState("")
  const [combinedEmail, setCombinedEmail] = useState("")
  const [combinedPhone, setCombinedPhone] = useState("")
  const [combinedCompany, setCombinedCompany] = useState("")
  const [combinedSquareMeters, setCombinedSquareMeters] = useState("")
  const [combinedBuildingType, setCombinedBuildingType] = useState("")
  const [combinedFloor, setCombinedFloor] = useState("")
  const [combinedElevator, setCombinedElevator] = useState("")
  const [combinedEffort, setCombinedEffort] = useState("")
  const [combinedMaterials, setCombinedMaterials] = useState<string[]>([])
  const [combinedRemovalItems, setCombinedRemovalItems] = useState<string[]>([])
  const [combinedAsbestos, setCombinedAsbestos] = useState(false)
  const [combinedDesiredDate, setCombinedDesiredDate] = useState("")
  const [combinedFiles, setCombinedFiles] = useState<string[]>([])
  const [combinedNotes, setCombinedNotes] = useState("")
  const [combinedErrors, setCombinedErrors] = useState<ClearanceErrors>({})
  const [combinedSubmitting, setCombinedSubmitting] = useState(false)
  const [combinedSubmitError, setCombinedSubmitError] = useState("")
  const [combinedSubmitted, setCombinedSubmitted] = useState(false)

  const toggleClearanceMaterial = (item: string) => {
    setClearanceMaterials((current) =>
      current.includes(item) ? current.filter((entry) => entry !== item) : [...current, item]
    )
  }

  const toggleGuttingRemovalItem = (item: string) => {
    setGuttingRemovalItems((current) =>
      current.includes(item) ? current.filter((entry) => entry !== item) : [...current, item]
    )
  }

  const toggleCombinedMaterial = (item: string) => {
    setCombinedMaterials((current) =>
      current.includes(item) ? current.filter((entry) => entry !== item) : [...current, item]
    )
  }

  const toggleCombinedRemovalItem = (item: string) => {
    setCombinedRemovalItems((current) =>
      current.includes(item) ? current.filter((entry) => entry !== item) : [...current, item]
    )
  }

  const validateClearance = () => {
    const nextErrors: ClearanceErrors = {}

    if (!clearanceName.trim()) {
      nextErrors.name = "Bitte geben Sie Ihren Namen ein."
    }

    if (!clearanceEmail.trim()) {
      nextErrors.email = "Bitte geben Sie Ihre E-Mail ein."
    }

    if (!clearanceSquareMeters.trim()) {
      nextErrors.squareMeters = "Bitte geben Sie die Quadratmeter an."
    }

    if (!clearanceBuildingType.trim()) {
      nextErrors.buildingType = "Bitte wählen Sie einen Gebäudetyp aus."
    }

    setClearanceErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const validateGutting = () => {
    const nextErrors: GuttingErrors = {}

    if (!guttingName.trim()) {
      nextErrors.name = "Bitte geben Sie Ihren Namen ein."
    }

    if (!guttingEmail.trim()) {
      nextErrors.email = "Bitte geben Sie Ihre E-Mail ein."
    }

    if (!guttingSquareMeters.trim()) {
      nextErrors.squareMeters = "Bitte geben Sie die Quadratmeter an."
    }

    if (!guttingBuildingType.trim()) {
      nextErrors.buildingType = "Bitte wählen Sie einen Gebäudetyp aus."
    }

    setGuttingErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const validateCombined = () => {
    const nextErrors: ClearanceErrors = {}

    if (!combinedName.trim()) {
      nextErrors.name = "Bitte geben Sie Ihren Namen ein."
    }

    if (!combinedEmail.trim()) {
      nextErrors.email = "Bitte geben Sie Ihre E-Mail ein."
    }

    if (!combinedSquareMeters.trim()) {
      nextErrors.squareMeters = "Bitte geben Sie die Quadratmeter an."
    }

    if (!combinedBuildingType.trim()) {
      nextErrors.buildingType = "Bitte wählen Sie einen Gebäudetyp aus."
    }

    setCombinedErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const submitClearance = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setClearanceSubmitError("")

    if (!validateClearance()) {
      return
    }

    setClearanceSubmitting(true)

    try {
      const response = await fetch(resolveBackendUrl("/api/quote"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "Entrümpelung",
          name: sanitizePayloadName(clearanceName),
          email: clearanceEmail.trim(),
          phone: clearancePhone.trim(),
          company: clearanceCompany.trim(),
          squareMeters: clearanceSquareMeters.trim(),
          buildingType: clearanceBuildingType,
          floor: clearanceFloor,
          elevator: clearanceElevator,
          materials: clearanceMaterials,
          quantityEstimate: clearanceQuantity,
          valuables: clearanceValuables,
          asbestosRequired: clearanceAsbestos,
          desiredDate: clearanceDesiredDate.trim(),
          imageFileNames: clearanceFiles,
          imagesBase64: clearanceFiles,
          notes: clearanceNotes.trim(),
        }),
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        setClearanceSubmitError(result.error || "Die Anfrage konnte nicht gesendet werden.")
        return
      }

      setClearanceSubmitted(true)
    } catch {
      setClearanceSubmitError("Die Anfrage konnte nicht gesendet werden.")
    } finally {
      setClearanceSubmitting(false)
    }
  }

  const submitGutting = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setGuttingSubmitError("")

    if (!validateGutting()) {
      return
    }

    setGuttingSubmitting(true)

    try {
      const response = await fetch(resolveBackendUrl("/api/quote"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "Entkernung",
          name: sanitizePayloadName(guttingName),
          email: guttingEmail.trim(),
          phone: guttingPhone.trim(),
          company: guttingCompany.trim(),
          squareMeters: guttingSquareMeters.trim(),
          buildingType: guttingBuildingType,
          constructionYear: guttingConstructionYear.trim(),
          floor: guttingFloor,
          elevator: guttingElevator,
          removalItems: guttingRemovalItems,
          asbestosRequired: guttingAsbestos,
          otherPollutants: guttingPollutants,
          disposalWanted: guttingDisposalWanted,
          permitStatus: guttingPermit,
          desiredDate: guttingDesiredDate.trim(),
          imageFileNames: guttingFiles,
          imagesBase64: guttingFiles,
          notes: guttingNotes.trim(),
        }),
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        setGuttingSubmitError(result.error || "Die Anfrage konnte nicht gesendet werden.")
        return
      }

      setGuttingSubmitted(true)
    } catch {
      setGuttingSubmitError("Die Anfrage konnte nicht gesendet werden.")
    } finally {
      setGuttingSubmitting(false)
    }
  }

  const submitCombined = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setCombinedSubmitError("")

    if (!validateCombined()) {
      return
    }

    setCombinedSubmitting(true)

    try {
      const response = await fetch(resolveBackendUrl("/api/quote"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "Entkernung & Entrümpelung",
          name: sanitizePayloadName(combinedName),
          email: combinedEmail.trim(),
          phone: combinedPhone.trim(),
          company: combinedCompany.trim(),
          squareMeters: combinedSquareMeters.trim(),
          buildingType: combinedBuildingType,
          floor: combinedFloor,
          elevator: combinedElevator,
          effortEstimate: combinedEffort,
          materials: combinedMaterials,
          removalItems: combinedRemovalItems,
          asbestosRequired: combinedAsbestos,
          desiredDate: combinedDesiredDate.trim(),
          imageFileNames: combinedFiles,
          imagesBase64: combinedFiles,
          notes: combinedNotes.trim(),
        }),
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        setCombinedSubmitError(result.error || "Die Anfrage konnte nicht gesendet werden.")
        return
      }

      setCombinedSubmitted(true)
    } catch {
      setCombinedSubmitError("Die Anfrage konnte nicht gesendet werden.")
    } finally {
      setCombinedSubmitting(false)
    }
  }

  return (
    <section
      id="quote"
      style={{
        backgroundColor: colors.page,
        padding: "48px 20px",
        position: "relative",
        zIndex: 20,
        pointerEvents: "auto",
      }}
    >
      <div
        style={{
          maxWidth: 960,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: 24,
          position: "relative",
          zIndex: 21,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 12, textAlign: "center" }}>
          <h2 style={{ color: colors.text, fontSize: 32, margin: 0 }}>Angebot anfragen</h2>
          <p style={{ color: colors.muted, fontSize: 16, margin: 0 }}>
            Wählen Sie die passende Leistung und senden Sie uns Ihre Angaben für ein schnelles Angebot.
          </p>
        </div>

        {/* Goldener Trenner */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          margin: "8px 0",
        }}>
          <div style={{ flex: 1, height: 1, background: "linear-gradient(to right, transparent, rgba(201,164,92,0.3), transparent)" }} />
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: colors.gold }} />
          <div style={{ flex: 1, height: 1, background: "linear-gradient(to right, transparent, rgba(201,164,92,0.3), transparent)" }} />
        </div>

        <div style={{ display: "flex", gap: 12, position: "relative", zIndex: 30 }}>
          <button type="button" onClick={() => setActiveTab("entruempelung")} style={getTabStyle(activeTab === "entruempelung")}>
            Entrümpelung
          </button>
          <button type="button" onClick={() => setActiveTab("entkernung")} style={getTabStyle(activeTab === "entkernung")}>
            Entkernung
          </button>
          <button type="button" onClick={() => setActiveTab("entkernung-entruempelung")} style={getTabStyle(activeTab === "entkernung-entruempelung")}>
            Entkernung & Entrümpelung
          </button>
        </div>

        {/* Trenner zwischen Tabs und Formular */}
        <div style={{
          height: 1,
          background: "linear-gradient(to right, transparent, rgba(201,164,92,0.2), transparent)",
          margin: "4px 0",
        }} />

        {activeTab === "entruempelung" ? (
          clearanceSubmitted ? (
            <div style={cardStyle}>
              <h3 style={{ color: colors.gold, fontSize: 24, margin: "0 0 12px 0" }}>Vielen Dank!</h3>
              <p style={{ color: colors.text, fontSize: 16, margin: 0 }}>
                Vielen Dank! Wir melden uns innerhalb von 30 Minuten mit Ihrem Angebot.
              </p>
            </div>
          ) : (
            <form onSubmit={submitClearance} style={{ ...cardStyle, display: "flex", flexDirection: "column", gap: 24 }}>
              <div>
                <h3 style={sectionTitleStyle}>Kontakt</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
                  <div style={fieldWrapStyle}>
                    <label style={labelStyle} htmlFor="clearance-name">{requiredLabel("Name")}</label>
                    <input id="clearance-name" type="text" value={clearanceName} onChange={(event) => setClearanceName(event.target.value)} style={inputStyle} />
                    {clearanceErrors.name ? <p style={errorTextStyle}>{clearanceErrors.name}</p> : null}
                  </div>
                  <div style={fieldWrapStyle}>
                    <label style={labelStyle} htmlFor="clearance-email">{requiredLabel("E-Mail")}</label>
                    <input id="clearance-email" type="email" value={clearanceEmail} onChange={(event) => setClearanceEmail(event.target.value)} style={inputStyle} />
                    {clearanceErrors.email ? <p style={errorTextStyle}>{clearanceErrors.email}</p> : null}
                  </div>
                  <div style={fieldWrapStyle}>
                    <label style={labelStyle} htmlFor="clearance-phone">{optionalLabel("Telefon")}</label>
                    <input id="clearance-phone" type="text" value={clearancePhone} onChange={(event) => setClearancePhone(event.target.value)} style={inputStyle} />
                  </div>
                  <div style={fieldWrapStyle}>
                    <label style={labelStyle} htmlFor="clearance-company">{optionalLabel("Firma")}</label>
                    <input id="clearance-company" type="text" value={clearanceCompany} onChange={(event) => setClearanceCompany(event.target.value)} style={inputStyle} />
                  </div>
                </div>
              </div>

              <div>
                <h3 style={sectionTitleStyle}>Projekt</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
                  <div style={fieldWrapStyle}>
                    <label style={labelStyle} htmlFor="clearance-sqm">{requiredLabel("Quadratmeter")}</label>
                    <input id="clearance-sqm" type="number" value={clearanceSquareMeters} onChange={(event) => setClearanceSquareMeters(event.target.value)} style={inputStyle} />
                    {clearanceErrors.squareMeters ? <p style={errorTextStyle}>{clearanceErrors.squareMeters}</p> : null}
                  </div>
                  <div style={fieldWrapStyle}>
                    <label style={labelStyle} htmlFor="clearance-building-type">{requiredLabel("Gebäudetyp")}</label>
                    <select id="clearance-building-type" value={clearanceBuildingType} onChange={(event) => setClearanceBuildingType(event.target.value)} style={inputStyle}>
                      <option value="">Bitte auswählen</option>
                      {clearanceBuildingOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    {clearanceErrors.buildingType ? <p style={errorTextStyle}>{clearanceErrors.buildingType}</p> : null}
                  </div>
                  <div style={fieldWrapStyle}>
                    <label style={labelStyle} htmlFor="clearance-floor">{optionalLabel("Stockwerk")}</label>
                    <select id="clearance-floor" value={clearanceFloor} onChange={(event) => setClearanceFloor(event.target.value)} style={inputStyle}>
                      <option value="">Bitte auswählen</option>
                      {floorOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div style={fieldWrapStyle}>
                    <span style={labelStyle}>{optionalLabel("Aufzug vorhanden")}</span>
                    <div style={{ display: "flex", gap: 10 }}>
                      <button type="button" onClick={() => setClearanceElevator("Ja")} style={getToggleStyle(clearanceElevator === "Ja")}>Ja</button>
                      <button type="button" onClick={() => setClearanceElevator("Nein")} style={getToggleStyle(clearanceElevator === "Nein")}>Nein</button>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 style={sectionTitleStyle}>Materialien</h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                  {clearanceMaterialOptions.map((option) => (
                    <button key={option} type="button" onClick={() => toggleClearanceMaterial(option)} style={getChipStyle(clearanceMaterials.includes(option))}>
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 style={sectionTitleStyle}>Mengeneinschätzung</h3>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {quantityOptions.map((option) => (
                    <button key={option} type="button" onClick={() => setClearanceQuantity(option)} style={{ ...getToggleStyle(clearanceQuantity === option), flex: "0 0 auto", minWidth: 120 }}>
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 style={sectionTitleStyle}>Wertgegenstände vorhanden</h3>
                <div style={{ display: "flex", gap: 10 }}>
                  <button type="button" onClick={() => setClearanceValuables("Ja")} style={getToggleStyle(clearanceValuables === "Ja")}>Ja</button>
                  <button type="button" onClick={() => setClearanceValuables("Nein")} style={getToggleStyle(clearanceValuables === "Nein")}>Nein</button>
                </div>
                {clearanceValuables === "Ja" ? (
                  <p style={{ ...helperTextStyle, marginTop: 10 }}>
                    Wertgegenstände können gegebenenfalls mit dem Preis verrechnet werden.
                  </p>
                ) : null}
              </div>

              <div>
                <h3 style={sectionTitleStyle}>Asbest-Entsorgung</h3>
                <label style={{ display: "flex", alignItems: "flex-start", gap: 10, color: colors.text, fontSize: 14 }}>
                  <input type="checkbox" checked={clearanceAsbestos} onChange={(event) => setClearanceAsbestos(event.target.checked)} />
                  <span>
                    Asbest-Entsorgung erforderlich
                    <span style={{ display: "block", color: colors.muted, fontSize: 12, marginTop: 4 }}>
                      Wir arbeiten mit zertifizierten Fachbetrieben.
                    </span>
                  </span>
                </label>
              </div>

              <div>
                <h3 style={sectionTitleStyle}>Weitere Informationen</h3>
                <div style={{ display: "grid", gap: 16 }}>
                  <div style={fieldWrapStyle}>
                    <label style={labelStyle} htmlFor="clearance-desired-date">{optionalLabel("Wunschtermin")}</label>
                    <input id="clearance-desired-date" type="text" value={clearanceDesiredDate} onChange={(event) => setClearanceDesiredDate(event.target.value)} style={inputStyle} />
                  </div>
                  <FileUpload
                    id="clearance-files"
                    files={clearanceFiles}
                    onFilesChange={setClearanceFiles}
                    label="Bilder hochladen (optional)"
                  />
                  <div style={fieldWrapStyle}>
                    <label style={labelStyle} htmlFor="clearance-notes">{optionalLabel("Anmerkungen")}</label>
                    <textarea id="clearance-notes" value={clearanceNotes} onChange={(event) => setClearanceNotes(event.target.value)} rows={5} style={{ ...inputStyle, resize: "vertical" }} />
                  </div>
                </div>
              </div>

              {clearanceSubmitError ? <p style={errorTextStyle}>{clearanceSubmitError}</p> : null}

              <button
                type="submit"
                disabled={clearanceSubmitting}
                style={{
                  padding: "14px 18px",
                  borderRadius: 10,
                  border: `1px solid ${colors.gold}`,
                  backgroundColor: colors.gold,
                  color: "#000000",
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: "pointer",
                  opacity: clearanceSubmitting ? 0.7 : 1,
                }}
              >
                {clearanceSubmitting ? "Wird gesendet..." : "Angebot anfragen"}
              </button>
            </form>
          )
        ) : activeTab === "entkernung" ? (
          guttingSubmitted ? (
            <div style={cardStyle}>
              <h3 style={{ color: colors.gold, fontSize: 24, margin: "0 0 12px 0" }}>Vielen Dank!</h3>
              <p style={{ color: colors.text, fontSize: 16, margin: 0 }}>
                Vielen Dank! Wir melden uns innerhalb von 30 Minuten mit Ihrem Angebot.
              </p>
            </div>
          ) : (
            <form onSubmit={submitGutting} style={{ ...cardStyle, display: "flex", flexDirection: "column", gap: 24 }}>
            <div>
              <h3 style={sectionTitleStyle}>Kontakt</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
                <div style={fieldWrapStyle}>
                  <label style={labelStyle} htmlFor="gutting-name">{requiredLabel("Name")}</label>
                  <input id="gutting-name" type="text" value={guttingName} onChange={(event) => setGuttingName(event.target.value)} style={inputStyle} />
                  {guttingErrors.name ? <p style={errorTextStyle}>{guttingErrors.name}</p> : null}
                </div>
                <div style={fieldWrapStyle}>
                  <label style={labelStyle} htmlFor="gutting-email">{requiredLabel("E-Mail")}</label>
                  <input id="gutting-email" type="email" value={guttingEmail} onChange={(event) => setGuttingEmail(event.target.value)} style={inputStyle} />
                  {guttingErrors.email ? <p style={errorTextStyle}>{guttingErrors.email}</p> : null}
                </div>
                <div style={fieldWrapStyle}>
                  <label style={labelStyle} htmlFor="gutting-phone">{optionalLabel("Telefon")}</label>
                  <input id="gutting-phone" type="text" value={guttingPhone} onChange={(event) => setGuttingPhone(event.target.value)} style={inputStyle} />
                </div>
                <div style={fieldWrapStyle}>
                  <label style={labelStyle} htmlFor="gutting-company">{optionalLabel("Firma")}</label>
                  <input id="gutting-company" type="text" value={guttingCompany} onChange={(event) => setGuttingCompany(event.target.value)} style={inputStyle} />
                </div>
              </div>
            </div>

            <div>
              <h3 style={sectionTitleStyle}>Projekt</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
                <div style={fieldWrapStyle}>
                  <label style={labelStyle} htmlFor="gutting-sqm">{requiredLabel("Quadratmeter")}</label>
                  <input id="gutting-sqm" type="number" value={guttingSquareMeters} onChange={(event) => setGuttingSquareMeters(event.target.value)} style={inputStyle} />
                  {guttingErrors.squareMeters ? <p style={errorTextStyle}>{guttingErrors.squareMeters}</p> : null}
                </div>
                <div style={fieldWrapStyle}>
                  <label style={labelStyle} htmlFor="gutting-building-type">{requiredLabel("Gebäudetyp")}</label>
                  <select id="gutting-building-type" value={guttingBuildingType} onChange={(event) => setGuttingBuildingType(event.target.value)} style={inputStyle}>
                    <option value="">Bitte auswählen</option>
                    {guttingBuildingOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  {guttingErrors.buildingType ? <p style={errorTextStyle}>{guttingErrors.buildingType}</p> : null}
                </div>
                <div style={fieldWrapStyle}>
                  <label style={labelStyle} htmlFor="gutting-year">{optionalLabel("Baujahr")}</label>
                  <input
                    id="gutting-year"
                    type="text"
                    placeholder="z.B. 1975 — relevant für Schadstoffprüfung"
                    value={guttingConstructionYear}
                    onChange={(event) => setGuttingConstructionYear(event.target.value)}
                    style={inputStyle}
                  />
                </div>
                <div style={fieldWrapStyle}>
                  <label style={labelStyle} htmlFor="gutting-floor">{optionalLabel("Stockwerk")}</label>
                  <select id="gutting-floor" value={guttingFloor} onChange={(event) => setGuttingFloor(event.target.value)} style={inputStyle}>
                    <option value="">Bitte auswählen</option>
                    {floorOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div style={fieldWrapStyle}>
                  <span style={labelStyle}>{optionalLabel("Aufzug vorhanden")}</span>
                  <div style={{ display: "flex", gap: 10 }}>
                    <button type="button" onClick={() => setGuttingElevator("Ja")} style={getToggleStyle(guttingElevator === "Ja")}>Ja</button>
                    <button type="button" onClick={() => setGuttingElevator("Nein")} style={getToggleStyle(guttingElevator === "Nein")}>Nein</button>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 style={sectionTitleStyle}>Was soll entfernt werden?</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {guttingRemovalOptions.map((option) => (
                  <button key={option} type="button" onClick={() => toggleGuttingRemovalItem(option)} style={getChipStyle(guttingRemovalItems.includes(option))}>
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 style={sectionTitleStyle}>Sonderpositionen</h3>
              <div style={{ display: "grid", gap: 12 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 10, color: colors.text, fontSize: 14, padding: 12, borderRadius: 10, border: `1px solid ${colors.gold}`, backgroundColor: colors.page }}>
                  <input type="checkbox" checked={guttingAsbestos} onChange={(event) => setGuttingAsbestos(event.target.checked)} />
                  <span>Asbest-Entsorgung erforderlich</span>
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 10, color: colors.text, fontSize: 14 }}>
                  <input type="checkbox" checked={guttingPollutants} onChange={(event) => setGuttingPollutants(event.target.checked)} />
                  <span>Andere Schadstoffe (PCB, KMF, Teer etc.)</span>
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 10, color: colors.text, fontSize: 14 }}>
                  <input type="checkbox" checked={guttingDisposalWanted} onChange={(event) => setGuttingDisposalWanted(event.target.checked)} />
                  <span>Entsorgung des Materials gewünscht</span>
                </label>
              </div>
            </div>

            <div>
              <h3 style={sectionTitleStyle}>Baugenehmigung</h3>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {permitOptions.map((option) => (
                  <button key={option} type="button" onClick={() => setGuttingPermit(option)} style={{ ...getToggleStyle(guttingPermit === option), flex: "0 0 auto", minWidth: 120 }}>
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 style={sectionTitleStyle}>Weitere Informationen</h3>
              <div style={{ display: "grid", gap: 16 }}>
                <div style={fieldWrapStyle}>
                  <label style={labelStyle} htmlFor="gutting-desired-date">{optionalLabel("Wunschtermin")}</label>
                  <input id="gutting-desired-date" type="text" value={guttingDesiredDate} onChange={(event) => setGuttingDesiredDate(event.target.value)} style={inputStyle} />
                </div>
                <FileUpload
                  id="gutting-files"
                  files={guttingFiles}
                  onFilesChange={setGuttingFiles}
                  label="Bilder hochladen (optional)"
                />
                <div style={fieldWrapStyle}>
                  <label style={labelStyle} htmlFor="gutting-notes">{optionalLabel("Anmerkungen")}</label>
                  <textarea id="gutting-notes" value={guttingNotes} onChange={(event) => setGuttingNotes(event.target.value)} rows={5} style={{ ...inputStyle, resize: "vertical" }} />
                </div>
              </div>
            </div>

            {guttingSubmitError ? <p style={errorTextStyle}>{guttingSubmitError}</p> : null}

            <button
              type="submit"
              disabled={guttingSubmitting}
              style={{
                padding: "14px 18px",
                borderRadius: 10,
                border: `1px solid ${colors.gold}`,
                backgroundColor: colors.gold,
                color: "#000000",
                fontSize: 15,
                fontWeight: 600,
                cursor: "pointer",
                opacity: guttingSubmitting ? 0.7 : 1,
              }}
            >
              {guttingSubmitting ? "Wird gesendet..." : "Angebot anfragen"}
            </button>
          </form>
          )
        ) : activeTab === "entkernung-entruempelung" ? (
          combinedSubmitted ? (
            <div style={cardStyle}>
              <h3 style={{ color: colors.gold, fontSize: 24, margin: "0 0 12px 0" }}>Vielen Dank!</h3>
              <p style={{ color: colors.text, fontSize: 16, margin: 0 }}>
                Vielen Dank! Wir melden uns innerhalb von 30 Minuten mit Ihrem Angebot.
              </p>
            </div>
          ) : (
            <form onSubmit={submitCombined} style={{ ...cardStyle, display: "flex", flexDirection: "column", gap: 24 }}>
              <div>
                <h3 style={sectionTitleStyle}>Kontakt</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
                  <div style={fieldWrapStyle}>
                    <label style={labelStyle} htmlFor="combined-name">{requiredLabel("Name")}</label>
                    <input id="combined-name" type="text" value={combinedName} onChange={(event) => setCombinedName(event.target.value)} style={inputStyle} />
                    {combinedErrors.name ? <p style={errorTextStyle}>{combinedErrors.name}</p> : null}
                  </div>
                  <div style={fieldWrapStyle}>
                    <label style={labelStyle} htmlFor="combined-email">{requiredLabel("E-Mail")}</label>
                    <input id="combined-email" type="email" value={combinedEmail} onChange={(event) => setCombinedEmail(event.target.value)} style={inputStyle} />
                    {combinedErrors.email ? <p style={errorTextStyle}>{combinedErrors.email}</p> : null}
                  </div>
                  <div style={fieldWrapStyle}>
                    <label style={labelStyle} htmlFor="combined-phone">{optionalLabel("Telefon")}</label>
                    <input id="combined-phone" type="text" value={combinedPhone} onChange={(event) => setCombinedPhone(event.target.value)} style={inputStyle} />
                  </div>
                  <div style={fieldWrapStyle}>
                    <label style={labelStyle} htmlFor="combined-company">{optionalLabel("Firma")}</label>
                    <input id="combined-company" type="text" value={combinedCompany} onChange={(event) => setCombinedCompany(event.target.value)} style={inputStyle} />
                  </div>
                </div>
              </div>

              <div>
                <h3 style={sectionTitleStyle}>Projekt</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
                  <div style={fieldWrapStyle}>
                    <label style={labelStyle} htmlFor="combined-sqm">{requiredLabel("Quadratmeter")}</label>
                    <input id="combined-sqm" type="number" value={combinedSquareMeters} onChange={(event) => setCombinedSquareMeters(event.target.value)} style={inputStyle} />
                    {combinedErrors.squareMeters ? <p style={errorTextStyle}>{combinedErrors.squareMeters}</p> : null}
                  </div>
                  <div style={fieldWrapStyle}>
                    <label style={labelStyle} htmlFor="combined-building-type">{requiredLabel("Gebäudetyp")}</label>
                    <select id="combined-building-type" value={combinedBuildingType} onChange={(event) => setCombinedBuildingType(event.target.value)} style={inputStyle}>
                      <option value="">Bitte auswählen</option>
                      {combinedBuildingOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    {combinedErrors.buildingType ? <p style={errorTextStyle}>{combinedErrors.buildingType}</p> : null}
                  </div>
                  <div style={fieldWrapStyle}>
                    <label style={labelStyle} htmlFor="combined-floor">{optionalLabel("Stockwerk")}</label>
                    <select id="combined-floor" value={combinedFloor} onChange={(event) => setCombinedFloor(event.target.value)} style={inputStyle}>
                      <option value="">Bitte auswählen</option>
                      {floorOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div style={fieldWrapStyle}>
                    <span style={labelStyle}>{optionalLabel("Aufzug vorhanden")}</span>
                    <div style={{ display: "flex", gap: 10 }}>
                      <button type="button" onClick={() => setCombinedElevator("Ja")} style={getToggleStyle(combinedElevator === "Ja")}>Ja</button>
                      <button type="button" onClick={() => setCombinedElevator("Nein")} style={getToggleStyle(combinedElevator === "Nein")}>Nein</button>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 style={sectionTitleStyle}>Aufwandseinschätzung</h3>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {quantityOptions.map((option) => (
                    <button key={option} type="button" onClick={() => setCombinedEffort(option)} style={{ ...getToggleStyle(combinedEffort === option), flex: "0 0 auto", minWidth: 120 }}>
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 style={sectionTitleStyle}>Materialien (Entrümpelung)</h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                  {clearanceMaterialOptions.map((option) => (
                    <button key={option} type="button" onClick={() => toggleCombinedMaterial(option)} style={getChipStyle(combinedMaterials.includes(option))}>
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 style={sectionTitleStyle}>Was soll entfernt werden (Entkernung)</h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                  {guttingRemovalOptions.map((option) => (
                    <button key={option} type="button" onClick={() => toggleCombinedRemovalItem(option)} style={getChipStyle(combinedRemovalItems.includes(option))}>
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 style={sectionTitleStyle}>Sonderpositionen</h3>
                <label style={{ display: "flex", alignItems: "flex-start", gap: 10, color: colors.text, fontSize: 14 }}>
                  <input type="checkbox" checked={combinedAsbestos} onChange={(event) => setCombinedAsbestos(event.target.checked)} />
                  <span>
                    Asbest-Entsorgung erforderlich
                    <span style={{ display: "block", color: colors.muted, fontSize: 12, marginTop: 4 }}>
                      Wir arbeiten mit zertifizierten Fachbetrieben.
                    </span>
                  </span>
                </label>
              </div>

              <div>
                <h3 style={sectionTitleStyle}>Weitere Informationen</h3>
                <div style={{ display: "grid", gap: 16 }}>
                  <div style={fieldWrapStyle}>
                    <label style={labelStyle} htmlFor="combined-desired-date">{optionalLabel("Wunschtermin")}</label>
                    <input id="combined-desired-date" type="text" value={combinedDesiredDate} onChange={(event) => setCombinedDesiredDate(event.target.value)} style={inputStyle} />
                  </div>
                  <FileUpload
                    id="combined-files"
                    files={combinedFiles}
                    onFilesChange={setCombinedFiles}
                    label="Bilder hochladen (optional)"
                  />
                  <div style={fieldWrapStyle}>
                    <label style={labelStyle} htmlFor="combined-notes">{optionalLabel("Anmerkungen")}</label>
                    <textarea id="combined-notes" value={combinedNotes} onChange={(event) => setCombinedNotes(event.target.value)} rows={5} style={{ ...inputStyle, resize: "vertical" }} />
                  </div>
                </div>
              </div>

              {combinedSubmitError ? <p style={errorTextStyle}>{combinedSubmitError}</p> : null}

              <button
                type="submit"
                disabled={combinedSubmitting}
                style={{
                  padding: "14px 18px",
                  borderRadius: 10,
                  border: `1px solid ${colors.gold}`,
                  backgroundColor: colors.gold,
                  color: "#000000",
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: "pointer",
                  opacity: combinedSubmitting ? 0.7 : 1,
                }}
              >
                {combinedSubmitting ? "Wird gesendet..." : "Angebot anfragen"}
              </button>
            </form>
          )
        ) : null}
      </div>
    </section>
  )
}
