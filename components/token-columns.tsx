"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Token {
  name: string
  symbol: string
  price: string
  marketCap: string
  status: "bidding" | "completed"
}

export function TokenColumns() {
  const [newTokens, setNewTokens] = useState<Token[]>([
    { name: "HoneyPot1", symbol: "HP1", price: "0.001 ETH", marketCap: "10K", status: "bidding" },
    { name: "SweetDeal", symbol: "SWED", price: "0.002 ETH", marketCap: "20K", status: "bidding" },
  ])

  const [completedTokens, setCompletedTokens] = useState<Token[]>([
    { name: "GreenGains", symbol: "GG", price: "0.005 ETH", marketCap: "50K", status: "completed" },
    { name: "LuckyPot", symbol: "LP", price: "0.003 ETH", marketCap: "30K", status: "completed" },
  ])

  const [newToken, setNewToken] = useState({ name: "", symbol: "" })

  const handleNewToken = (e: React.FormEvent) => {
    e.preventDefault()
    if (newToken.name && newToken.symbol) {
      setNewTokens([...newTokens, { ...newToken, price: "0.001 ETH", marketCap: "0", status: "bidding" }])
      setNewToken({ name: "", symbol: "" })
    }
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <Card className="bg-green-900/20 border-green-400">
        <CardHeader>
          <CardTitle className="text-green-400">New Bidding Tokens</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleNewToken} className="mb-4 space-y-4">
            <div>
              <Label htmlFor="tokenName" className="text-green-400">Token Name</Label>
              <Input
                id="tokenName"
                value={newToken.name}
                onChange={(e) => setNewToken({ ...newToken, name: e.target.value })}
                className="bg-green-900/30 border-green-400 text-white"
              />
            </div>
            <div>
              <Label htmlFor="tokenSymbol" className="text-green-400">Token Symbol</Label>
              <Input
                id="tokenSymbol"
                value={newToken.symbol}
                onChange={(e) => setNewToken({ ...newToken, symbol: e.target.value })}
                className="bg-green-900/30 border-green-400 text-white"
              />
            </div>
            <Button type="submit" className="w-full bg-green-400 text-black hover:bg-green-300">Create New Token</Button>
          </form>
          <ul className="space-y-2">
            {newTokens.map((token, index) => (
              <li key={index} className="bg-green-900/30 p-2 rounded">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-green-400">{token.name} ({token.symbol})</span>
                  <span className="text-sm">{token.price}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>Market Cap: {token.marketCap}</span>
                  <span className="text-yellow-400">Bidding</span>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      <Card className="bg-green-900/20 border-green-400">
        <CardHeader>
          <CardTitle className="text-green-400">Completed Bidding Tokens</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {completedTokens.map((token, index) => (
              <li key={index} className="bg-green-900/30 p-2 rounded">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-green-400">{token.name} ({token.symbol})</span>
                  <span className="text-sm">{token.price}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>Market Cap: {token.marketCap}</span>
                  <span className="text-red-400">Honeypot Active</span>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

