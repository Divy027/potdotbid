"use client"

import { motion } from "framer-motion"

interface BiddingProgressProps {
  progress: number
  launched: boolean
}

export function BiddingProgress({ progress, launched }: BiddingProgressProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm text-gray-400">
        <span>Progress</span>
        <span>{progress.toFixed(3)}%</span>
      </div>
      <div className="h-4 bg-green-900/30 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-green-400 to-green-300"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-400">
        <span>0%</span>
        <span>Target: 100%</span>
      </div>
      {launched && (
        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="block text-md mt-2 text-gray-400">
          Liquidity is sent to uniswap v2! Check{" "}
          <a
            href="https://uniswap.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-500 hover:text-purple-400 transition-colors"
          >
            here
          </a>
        </motion.span>
      )}
    </div>
  )
}
