import { formatNumber, formatTime, formatWalletAddress } from "@/lib/utils";
import { useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function TradeHistory({ trades, token }: { trades: any[]; token: any }) {
  const [currentPage, setCurrentPage] = useState(1);
  const tradesPerPage = 6; // Number of trades per page

  // Calculate indices for pagination
  const totalPages = Math.ceil(trades.length / tradesPerPage);
  const startIndex = (currentPage - 1) * tradesPerPage;
  const endIndex = startIndex + tradesPerPage;
  const currentTrades = trades.slice(startIndex, endIndex);

  return (
    <div className="w-full overflow-x-auto">
    {/* Header */}
    <div className="text-sm text-gray-400 grid grid-cols-6 gap-4 p-2 border-b border-green-700 min-w-[700px]">
      <span className="font-semibold">Account</span>
      <span className="font-semibold">Trade Type</span>
      <span className="font-semibold">ETH</span>
      <span className="font-semibold">{token.symbol}</span>
      <span className="font-semibold">Time</span>
      <span className="font-semibold">Tx</span>
    </div>
  
    {/* Trades */}
    {currentTrades.length > 0 ? (
      currentTrades.map((trade, index) => (
        <div
          key={index}
          className="grid grid-cols-6 gap-4 items-center p-2 rounded-lg bg-green-900/30 hover:bg-green-800 border border-green-700 mb-2 min-w-[700px]"
        >
          {/* Account */}
          <div className="flex items-center space-x-2">
            <span className="text-white font-medium">
              {formatWalletAddress(trade.user)}
            </span>
          </div>
  
          {/* Trade Type */}
          <span
            className={`font-bold ${
              trade.type === "buy" ? "text-green-400" : "text-red-400"
            }`}
          >
            {trade.type.toUpperCase()}
          </span>
  
          {/* ETH Amount */}
          <span className="text-gray-400">
            {Number(trade.ethAmount).toFixed(6)} ETH
          </span>
  
          {/* Token Amount */}
          <span className="text-gray-400">
            {formatNumber(Number(trade.amount))}
          </span>
  
          {/* Time */}
          <span className="text-gray-400">
            {formatTime(trade.timestamp)}
          </span>
  
          {/* Tx Hash */}
          <a
            href={`https://etherscan.io/tx/${trade.signature}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline"
          >
            {formatWalletAddress(trade.signature)}
          </a>
        </div>
      ))
    ) : (
      <div className="text-gray-500 text-center py-4">
        No trades available for this token.
      </div>
    )}
  
    {/* Pagination */}
    {trades.length > tradesPerPage && (
      <div className="flex justify-center items-center space-x-2 mt-4">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
          className={`px-3 py-1 border border-green-700 rounded-lg text-sm ${
            currentPage === 1
              ? "text-gray-500 cursor-not-allowed"
              : "text-green-400 hover:bg-green-700"
          }`}
        >
          Previous
        </button>
        <span className="text-gray-400">
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
          className={`px-3 py-1 border border-green-700 rounded-lg text-sm ${
            currentPage === totalPages
              ? "text-gray-500 cursor-not-allowed"
              : "text-green-400 hover:bg-green-700"
          }`}
        >
          Next
        </button>
      </div>
    )}
  </div>
  
  );
}
