"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { TokenCard } from "@/components/token-card"

interface Token {
  name: string
  symbol: string
  description: string
  image: File | null
  social: {
    x: string
    tg: string
  }
  price: string
  marketCap: string
  volume: string
  liquidity: string
  holders: number
  status: "bidding" | "completed"
}

export function TokenGrid() {
  const [tokens, setTokens] = useState<Token[]>([
    { 
      name: "HoneyPot1", 
      symbol: "HP1", 
      description: "The sweetest deal in crypto",
      image: null,
      social: { x: "honeypot1", tg: "honeypot1" },
      price: "0.001 ETH", 
      marketCap: "10K", 
      volume: "5K", 
      liquidity: "2K", 
      holders: 50, 
      status: "bidding" 
    },
    { 
      name: "SweetDeal", 
      symbol: "SWED", 
      description: "A deal too sweet to resist",
      image: null,
      social: { x: "sweetdeal", tg: "sweetdeal" },
      price: "0.002 ETH", 
      marketCap: "20K", 
      volume: "8K", 
      liquidity: "4K", 
      holders: 75, 
      status: "bidding" 
    },
    { 
      name: "GreenGains", 
      symbol: "GG", 
      description: "Grow your wealth with green gains",
      image: null,
      social: { x: "greengains", tg: "greengains" },
      price: "0.005 ETH", 
      marketCap: "50K", 
      volume: "20K", 
      liquidity: "10K", 
      holders: 200, 
      status: "completed" 
    },
    { 
      name: "LuckyPot", 
      symbol: "LP", 
      description: "Your lucky day is here",
      image: null,
      social: { x: "luckypot", tg: "luckypot" },
      price: "0.003 ETH", 
      marketCap: "30K", 
      volume: "12K", 
      liquidity: "6K", 
      holders: 100, 
      status: "completed" 
    },
  ])

  const [newToken, setNewToken] = useState<Omit<Token, 'price' | 'marketCap' | 'volume' | 'liquidity' | 'holders' | 'status'>>({
    name: "",
    symbol: "",
    description: "",
    image: null,
    social: { x: "", tg: "" }
  })

  const handleNewToken = (e: React.FormEvent) => {
    e.preventDefault()
    if (newToken.name && newToken.symbol) {
      setTokens([...tokens, { 
        ...newToken, 
        price: "0.001 ETH", 
        marketCap: "0", 
        volume: "0",
        liquidity: "0",
        holders: 0,
        status: "bidding" 
      }])
      setNewToken({ name: "", symbol: "", description: "", image: null, social: { x: "", tg: "" } })
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    if (name === "x" || name === "tg") {
      setNewToken(prev => ({
        ...prev,
        social: { ...prev.social, [name]: value }
      }))
    } else {
      setNewToken(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setNewToken(prev => ({ ...prev, image: file }))
  }

  const biddingTokens = tokens.filter(token => token.status === "bidding")
  const completedTokens = tokens.filter(token => token.status === "completed")

  return (
    <div className="space-y-8">
      <Card className="bg-green-900/20 border-green-400">
        <CardHeader>
          <CardTitle className="text-green-400">Create New Token</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleNewToken} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="text-green-400">Token Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={newToken.name}
                  onChange={handleInputChange}
                  className="bg-green-900/30 border-green-400 text-white"
                />
              </div>
              <div>
                <Label htmlFor="symbol" className="text-green-400">Token Symbol</Label>
                <Input
                  id="symbol"
                  name="symbol"
                  value={newToken.symbol}
                  onChange={handleInputChange}
                  className="bg-green-900/30 border-green-400 text-white"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="description" className="text-green-400">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={newToken.description}
                onChange={handleInputChange}
                className="bg-green-900/30 border-green-400 text-white"
              />
            </div>
            <div>
              <Label htmlFor="image" className="text-green-400">Upload Image</Label>
              <Input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="bg-green-900/30 border-green-400 text-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="x" className="text-green-400">X (Twitter) Link</Label>
                <Input
                  id="x"
                  name="x"
                  value={newToken.social.x}
                  onChange={handleInputChange}
                  placeholder="https://twitter.com/username"
                  className="bg-green-900/30 border-green-400 text-white"
                />
              </div>
              <div>
                <Label htmlFor="tg" className="text-green-400">Telegram Link</Label>
                <Input
                  id="tg"
                  name="tg"
                  value={newToken.social.tg}
                  onChange={handleInputChange}
                  placeholder="https://t.me/username"
                  className="bg-green-900/30 border-green-400 text-white"
                />
              </div>
            </div>
            <Button type="submit" className="w-full bg-green-400 text-black hover:bg-green-300">Create Token</Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="text-2xl font-bold mb-4 text-green-400">Bidding Tokens</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {biddingTokens.map((token, index) => (
              <TokenCard key={index} token={token} />
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4 text-green-400">Completed Tokens</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {completedTokens.map((token, index) => (
              <TokenCard key={index} token={token} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

