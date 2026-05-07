import type { MetadataRoute } from "next"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://high-end-homes.de"
const staticRoutes = [
  "",
  "/entruempelung-heidelberg",
  "/hausaufloesung-mannheim",
  "/entkernung-heidelberg",
]

export default function sitemap(): MetadataRoute.Sitemap {
  return staticRoutes.map((route, index) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: index === 0 ? 1 : 0.8,
  }))
}
