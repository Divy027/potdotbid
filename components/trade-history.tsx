"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { formatNumber, formatTime, formatWalletAddress } from "@/lib/utils";

interface Trade {
  user: string
  type: string
  ethAmount: string
  amount: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  timestamp: any
  signature: string
}

interface TradeHistoryProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  trades: Trade[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  token: any
}

export function TradeHistory({ trades, token }: TradeHistoryProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const tradesPerPage = 5

  // Calculate total pages for pagination
  const totalPages = Math.ceil(trades.length / tradesPerPage)
  const indexOfLastTrade = currentPage * tradesPerPage
  const indexOfFirstTrade = indexOfLastTrade - tradesPerPage
  const currentTrades = trades.slice(indexOfFirstTrade, indexOfLastTrade)

  return (
    <div className="w-full overflow-x-auto">
      {/* Header */}
      <div className="text-sm text-gray-400 grid grid-cols-6 gap-4 p-3 border-b border-green-700 min-w-[700px]">
        <span className="font-semibold">Account</span>
        <span className="font-semibold">Trade Type</span>
        <span className="font-semibold">ETH</span>
        <span className="font-semibold">{token.symbol}</span>
        <span className="font-semibold">Time</span>
        <span className="font-semibold">Tx</span>
      </div>

      {/* Trades */}
      {currentTrades.length > 0 ? (
        <div className="space-y-2 mt-2">
          {currentTrades.map((trade, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="grid grid-cols-6 gap-4 items-center p-3 rounded-lg bg-green-900/30 hover:bg-green-800/30 border border-green-700 transition-colors min-w-[700px]"
            >
              {/* Account */}
              <div className="flex items-center space-x-2">
                <span className="text-white font-medium">{formatWalletAddress(trade.user)}</span>
              </div>

              {/* Trade Type */}
              <span className={`font-bold ${trade.type === "buy" ? "text-green-400" : "text-red-400"}`}>
                {trade.type.toUpperCase()}
              </span>

              {/* ETH Amount */}
              <span className="text-gray-400">{Number(trade.ethAmount).toFixed(6)} ETH</span>

              {/* Token Amount */}
              <span className="text-gray-400">{formatNumber(Number(trade.amount))}</span>

              {/* Time */}
              <span className="text-gray-400">{formatTime(trade.timestamp)}</span>

              {/* Tx Hash */}
              <a
                href={`https://etherscan.io/tx/${trade.signature}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                {formatWalletAddress(trade.signature)}
              </a>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-gray-500 text-center py-8 bg-green-900/20 rounded-lg mt-4 border border-green-800/50">
          No trades available for this token.
        </div>
      )}

      {/* Pagination */}
      {trades.length > tradesPerPage && (
        <div className="flex justify-center items-center space-x-2 mt-6">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            className={`border-green-700 ${
              currentPage === 1
                ? "text-gray-500 cursor-not-allowed"
                : "text-green-400 hover:bg-green-700 hover:text-white"
            }`}
          >
            Previous
          </Button>
          <span className="text-gray-400">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            className={`border-green-700 ${
              currentPage === totalPages
                ? "text-gray-500 cursor-not-allowed"
                : "text-green-400 hover:bg-green-700 hover:text-white"
            }`}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}
