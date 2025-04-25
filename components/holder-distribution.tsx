"use client"

import { motion } from "framer-motion"

interface Holder {
  address: string
  tokens: number
  percentage: string
}

interface HolderDistributionProps {
  holders: Holder[]
}

export function HolderDistribution({ holders }: HolderDistributionProps) {
  // Format wallet address
  const formatWalletAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  // Format number with commas
  const formatNumber = (num: number) => {
    return num.toLocaleString(undefined, { maximumFractionDigits: 2 })
  }

  return (
    <div className="space-y-2">
      {holders.map((holder, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center justify-between p-3 rounded-lg bg-green-900/30 border border-green-800/50 hover:bg-green-800/30 transition-colors"
        >
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-green-400"></div>
            <span className="text-sm text-gray-400">
              {holder.address === "0x1539360c6c61DDa27653f826640E55AF92EbfF91"
                ? "Bidding Curve"
                : formatWalletAddress(holder.address)}
            </span>
          </div>
          <div className="text-right">
            <div className="text-sm text-green-400 font-medium">{formatNumber(Number(holder.tokens))} tokens</div>
            <div className="text-xs text-gray-400">{holder.percentage}</div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
