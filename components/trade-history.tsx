import { formatNumber, formatTime, formatWalletAddress } from "@/lib/utils";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function TradeHistory({ trades, token }: { trades: any[], token: any }) {
  return (
    <div className="w-full overflow-x-auto">
      <div className="bg-black p-4 rounded-lg border border-green-700">
        <div className="text-sm text-gray-400 grid grid-cols-6 gap-4 p-2 border-b border-green-700">
          <span className="font-semibold">Account</span>
          <span className="font-semibold">Trade Type</span>
          <span className="font-semibold">ETH</span>
          <span className="font-semibold">{token.symbol}</span>
          <span className="font-semibold">Time</span>
          <span className="font-semibold">Tx</span>
        </div>
        {trades.length > 0 ? (
          trades.map((trade, index) => (
            <div
              key={index}
              className="grid grid-cols-6 gap-4 items-center p-2 rounded-lg bg-green-900/30 hover:bg-green-800 border border-green-700 mb-2"
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
            </div>
          ))
        ) : (
          <div className="text-gray-500 text-center py-4">
            No trades available for this token.
          </div>
        )}
      </div>
    </div>
  );
}
