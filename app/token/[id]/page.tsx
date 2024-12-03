import { TokenDetail } from "@/components/token-detail"

interface TokenDetailPageProps {
  params: {
    id: string
  }
}

export default function TokenDetailPage({ params }: TokenDetailPageProps) {
  return (
    <div className="min-h-screen bg-black text-white">
      <main className="container mx-auto px-4 py-8">
        <TokenDetail id={params.id} />
      </main>
    </div>
  )
}

