import type { MetadataRoute } from "next"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://highendhomes.de"

// Alle öffentlichen Routen, nach Priorität sortiert.
type Entry = { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }

const entries: Entry[] = [
  // Top-Level
  { path: "", priority: 1.0, changeFrequency: "weekly" },
  { path: "/angebot", priority: 0.9, changeFrequency: "weekly" },
  { path: "/kontakt", priority: 0.8, changeFrequency: "monthly" },
  { path: "/ueber-uns", priority: 0.7, changeFrequency: "monthly" },
  { path: "/region", priority: 0.7, changeFrequency: "monthly" },
  { path: "/faq", priority: 0.6, changeFrequency: "monthly" },
  { path: "/karriere", priority: 0.8, changeFrequency: "weekly" },

  // Sanierung & Innenausbau (Eigenleistungen)
  { path: "/innenausbau", priority: 0.9, changeFrequency: "monthly" },
  { path: "/bodenverlegung", priority: 0.8, changeFrequency: "monthly" },
  { path: "/maler", priority: 0.8, changeFrequency: "monthly" },

  // Rückbau & Räumung
  { path: "/entkernung", priority: 0.8, changeFrequency: "monthly" },
  { path: "/entruempelung", priority: 0.7, changeFrequency: "monthly" },
  { path: "/hausaufloesung", priority: 0.7, changeFrequency: "monthly" },
  { path: "/wohnungsaufloesung", priority: 0.6, changeFrequency: "monthly" },

  // Local SEO Landing Pages
  { path: "/entruempelung-heidelberg", priority: 0.85, changeFrequency: "monthly" },
  { path: "/hausaufloesung-mannheim", priority: 0.85, changeFrequency: "monthly" },
  { path: "/entkernung-heidelberg", priority: 0.85, changeFrequency: "monthly" },

  // Rechtliches
  { path: "/impressum", priority: 0.3, changeFrequency: "yearly" },
  { path: "/datenschutz", priority: 0.3, changeFrequency: "yearly" },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  return entries.map((entry) => ({
    url: `${siteUrl}${entry.path}`,
    lastModified: now,
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
  }))
}
