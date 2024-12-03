import Link from "next/link"
import { Button } from "@/components/ui/button"
import { X, MessageCircle, Github } from 'lucide-react'

export function Header() {
  return (
    <header className="border-b border-green-900 bg-black/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="#" className="text-green-400 hover:text-green-300">
              <X className="h-5 w-5" />
            </Link>
            <Link href="#" className="text-green-400 hover:text-green-300">
              <MessageCircle className="h-5 w-5" />
            </Link>
           
          </div>
          <h1 className="text-3xl font-bold text-center text-green-400">potdotbid</h1>
          <Button variant="outline" className="text-sm border-green-400 text-green-400 hover:bg-green-400 hover:text-black">
            Connect Wallet
          </Button>
        </div>
      </div>
    </header>
  )
}

