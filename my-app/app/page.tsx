import { Navigation } from "@/components/navigation"
import { Hero } from "@/components/hero"
import { ProcessFlow } from "@/components/process-flow"
import { QuoteForm } from "@/components/QuoteForm"
import { Services } from "@/components/services"
import { About } from "@/components/about"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navigation />
      <main>
        <Hero />
        {/* Goldener Trenner */}
        <div className="flex items-center gap-4 my-4 max-w-4xl mx-auto px-4">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#c9a45c]/30 to-transparent" />
          <div className="w-2 h-2 rounded-full bg-[#c9a45c]" />
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#c9a45c]/30 to-transparent" />
        </div>
        <ProcessFlow />
        {/* Goldener Trenner */}
        <div className="flex items-center gap-4 my-4 max-w-4xl mx-auto px-4">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#c9a45c]/30 to-transparent" />
          <div className="w-2 h-2 rounded-full bg-[#c9a45c]" />
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#c9a45c]/30 to-transparent" />
        </div>
        <QuoteForm />
        {/* Goldener Trenner */}
        <div className="flex items-center gap-4 my-4 max-w-4xl mx-auto px-4">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#c9a45c]/30 to-transparent" />
          <div className="w-2 h-2 rounded-full bg-[#c9a45c]" />
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#c9a45c]/30 to-transparent" />
        </div>
        <Services />
        {/* Goldener Trenner */}
        <div className="flex items-center gap-4 my-4 max-w-4xl mx-auto px-4">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#c9a45c]/30 to-transparent" />
          <div className="w-2 h-2 rounded-full bg-[#c9a45c]" />
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#c9a45c]/30 to-transparent" />
        </div>
        <About />
      </main>
      <Footer />
    </div>
  )
}
