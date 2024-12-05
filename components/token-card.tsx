"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { X, MessageCircle } from 'lucide-react'
import { useRouter } from "next/navigation"
import logo from "../app/potdotbidLogo.jpg"

interface TokenCardProps {
  token: {
    tokenSymbol: string
    tokenImage: string,
    creator: string,
    liquidity: string,
    marketcap: string,
    txnsBuy: string,
    txnsSell: string,
    tokenAddr: string,
    tokenName: string,
    price: string,
    buyVolume: string,
    sellVolume: string,
    status: string,
    social: {
      X: string,
      tg: string
    },
    description: string
  }
}

export function TokenCard({ token }: any) {
  const router = useRouter()
  
  const imageSrc = token.image || "/placeholder.svg?height=100&width=100"

  const handleClick = () => {
    // In a real app, you'd use a proper token ID
    router.push(`/token/${encodeURIComponent(token.address)}`)
  }

  return (
    <Card 
      className="bg-green-900/30 border-green-400 overflow-hidden cursor-pointer transition-colors hover:bg-green-900/40"
      onClick={handleClick}
    >
      <CardHeader className="bg-green-800/50 p-4">
        <div className="flex items-center space-x-4">
          <Image
            src={logo} 
            alt={token.name} 
            width={70}
            height={70}
            className="rounded-full"
            loading="lazy"
          />
          <div>
            <CardTitle className="text-lg font-bold text-green-400">{token.name}</CardTitle>
            <p className="text-sm text-green-200">({token.symbol})</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-2">
        <p className="text-sm text-gray-300">{token.description}</p>
        <div className="flex space-x-2">
          <a href={token.social.X} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
            <X className="h-4 w-4" />
          </a>
          <a href={token.social.tg} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
            <MessageCircle className="h-4 w-4" />
          </a>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Price:</span>
          <span className="font-medium">{token.price}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Market Cap:</span>
          <span className="font-medium">{token.marketcap}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Volume:</span>
          <span className="font-medium">{token.buyVolume}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Liquidity:</span>
          <span className="font-medium">{token.liquidity}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Holders:</span>
          <span className="font-medium">{""}</span>
        </div>
        <div className="flex justify-between items-center mt-2 pt-2 border-t border-green-700">
          <span className="text-sm font-medium">Status:</span>
          <span className={`text-sm font-bold ${token.status === 'bidding' ? 'text-yellow-400' : 'text-red-400'}`}>
            {token.status === 'bidding' ? 'Bidding' : 'Honeypot Active'}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

