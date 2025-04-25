import { TokenDetail } from "@/components/token-detail"

interface TokenDetailPageProps {
  params: {
    id: string
  }
}

export default function TokenDetailPage({ params }: TokenDetailPageProps) {
  return (
    <div className="min-h-screen bg-black text-white">
      <main className=" mx-auto">
        <TokenDetail id={params.id} />
      </main>
    </div>
  )
}

