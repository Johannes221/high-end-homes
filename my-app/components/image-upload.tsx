"use client"

import { useState, useRef } from "react"
import { Label } from "@/components/ui/label"
import { Upload, X, Info } from "lucide-react"
import Image from "next/image"

interface ImageUploadProps {
  id: string
  label?: string
  onChange?: (images: File[], base64Images: string[]) => void
}

export function ImageUpload({ id, label = "Bilder hochladen", onChange }: ImageUploadProps) {
  const [images, setImages] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [showTooltip, setShowTooltip] = useState(false)
  const [error, setError] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("")
    const files = Array.from(e.target.files || [])
    const validFiles = files.filter(file => {
      const isValidType = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)
      const isValidSize = file.size <= 10 * 1024 * 1024 // 10MB
      return isValidType && isValidSize
    }).slice(0, 10 - images.length)

    if (validFiles.length > 0) {
      const newImages = [...images, ...validFiles].slice(0, 10)
      setImages(newImages)
      
      const newPreviews: string[] = []
      let loadedCount = 0
      let hasError = false
      
      validFiles.forEach(file => {
        const reader = new FileReader()
        reader.onloadend = () => {
          if (reader.error) {
            hasError = true
            setError("Ein oder mehrere Bilder konnten nicht geladen werden.")
            return
          }
          newPreviews.push(reader.result as string)
          loadedCount++
          
          if (loadedCount === validFiles.length) {
            const allPreviews = [...previews, ...newPreviews].slice(0, 10)
            setPreviews(allPreviews)
            if (onChange) {
              onChange(newImages, allPreviews)
            }
          }
        }
        reader.onerror = () => {
          hasError = true
          setError("Ein oder mehrere Bilder konnten nicht geladen werden.")
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    const newPreviews = previews.filter((_, i) => i !== index)
    setImages(newImages)
    setPreviews(newPreviews)
    if (onChange) {
      onChange(newImages, newPreviews)
    }
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Label htmlFor={id} className="text-white">{label}</Label>
        <div 
          className="relative"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <Info className="w-4 h-4 text-white/40 cursor-help" />
          {showTooltip && (
            <div className="absolute left-0 top-6 z-10 bg-[#1a2a3a] border border-[#60A5FA]/30 rounded-sm p-3 text-sm text-white/80 whitespace-nowrap shadow-xl">
              Bilder helfen uns, eine bessere Einschätzung zu geben.
            </div>
          )}
        </div>
      </div>
      
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-[#60A5FA]/30 rounded-lg p-8 text-center cursor-pointer hover:border-[#60A5FA]/50 transition-colors bg-[#0A1628]"
      >
        <Upload className="w-8 h-8 text-white/40 mx-auto mb-3" />
        <p className="text-white/60 text-sm mb-1">
          Klick hier oder zieh Bilder hierher
        </p>
        <p className="text-white/40 text-xs">
          Max. 10 Bilder, je max. 10MB (JPG, PNG, WebP)
        </p>
        <input
          ref={fileInputRef}
          id={id}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {error && (
        <div className="mt-3 text-red-400 text-sm">{error}</div>
      )}

      {previews.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {previews.map((preview, index) => (
            <div key={index} className="relative group">
              <div className="relative w-full h-24 bg-[#0A1628] rounded-sm overflow-hidden">
                <Image
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
