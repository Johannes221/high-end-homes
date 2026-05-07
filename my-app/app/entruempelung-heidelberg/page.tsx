import type { Metadata } from "next"
import { LocalServicePage } from "@/components/local-service-page"
import { localSeoPagesBySlug } from "@/lib/local-seo-pages"

const page = localSeoPagesBySlug["entruempelung-heidelberg"]

export const metadata: Metadata = {
  title: page.metaTitle,
  description: page.metaDescription,
  alternates: {
    canonical: `/${page.slug}`,
  },
}

export default function EntruempelungHeidelbergPage() {
  return <LocalServicePage page={page} />
}
