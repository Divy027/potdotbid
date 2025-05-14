"use client"
import { Header } from "@/components/header"
import { TokenGrid } from "@/components/token-grid"
import { backend_url } from "@/config"
import axios from "axios"
import { useCallback, useEffect, useState } from "react"

import { TokenCreationForm } from "@/components/token-creation-form"

import { motion } from "framer-motion"
export default function Home() {
  const [tokens, setTokens] = useState<any[]>([])
  const fetchTokens = useCallback(async () => { // Wrapped in useCallback
    try {
      const response = await axios.get(`${backend_url}/api/tokens/getAll`)
      if (response.data.success) {
        setTokens(response.data.tokens)
        console.log("Fetched tokens:", response.data.tokens)
      }
    } catch (error) {
      console.error("Error fetching tokens:", error)
    }
  }, []) // Empty dependency array, fetchTokens itself doesn't change

  useEffect(() => {
    fetchTokens()
  }, [fetchTokens]) // Call fetchTokens when the component mounts or fetchTokens changes (it won't here)

  // This function will be called by TokenCreationForm after a new token is successfully created
  const handleTokenCreated = () => {
    console.log("New token created, re-fetching tokens in Home component...")
    fetchTokens() // Re-fetch all tokens
  }
  const biddingTokens = tokens.filter(token => token.status === "bidding")
  const completedTokens = tokens.filter(token => token.status === "completed")
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-green-950">
    <Header />

    <main className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12 text-center"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-green-400 mb-4">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-300">
            Pot.Bid
          </span>
        </h1>
        <p className="text-green-300 max-w-2xl mx-auto">
          Create, bid, and trade tokens in a decentralized marketplace with transparent mechanics and community
          governance.
        </p>
      </motion.div>

      <div className="space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <TokenCreationForm onTokenCreated={handleTokenCreated} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="grid gap-12 lg:grid-cols-2"
        >
          <TokenGrid
            title="Bidding Tokens"
            tokens={biddingTokens}
            emptyMessage="No tokens currently in bidding phase."
            type="bidding"
          />
          <TokenGrid
            title="Completed Tokens"
            tokens={completedTokens}
            emptyMessage="No completed tokens yet."
            type="completed"
          />
        </motion.div>
      </div>
    </main>

    <footer className="mt-20 border-t border-green-900 py-8 text-center text-green-500 text-sm">
      <div className="container mx-auto px-4">
        <p>© {new Date().getFullYear()} Pot.Bid - All rights reserved</p>
      </div>
    </footer>
  </div>
  )
}

