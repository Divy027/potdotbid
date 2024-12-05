import { Header } from "@/components/header"
import { TokenGrid } from "@/components/token-grid"

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="container mx-auto px-4 py-8">
      
        
        <TokenGrid />
      </main>
    </div>
  )
}

