export function TradeHistory() {
  const trades = [
    {
      type: "buy",
      address: "0x1234...5678",
      amount: "1000",
      price: "0.001 ETH",
      time: "5 mins ago"
    },
    {
      type: "sell",
      address: "0x8765...4321",
      amount: "500",
      price: "0.0012 ETH",
      time: "10 mins ago"
    },
  ]

  return (
    <div className="space-y-2">
      {trades.map((trade, index) => (
        <div 
          key={index}
          className="flex items-center justify-between p-2 rounded bg-green-900/30"
        >
          <div className="flex items-center space-x-2">
            <span className={trade.type === "buy" ? "text-green-400" : "text-red-400"}>
              {trade.type === "buy" ? "Buy" : "Sell"}
            </span>
            <span className="text-sm text-gray-400">{trade.address}</span>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-400">{trade.amount} tokens</div>
            <div className="text-sm text-gray-400">{trade.price}</div>
            <div className="text-xs text-gray-500">{trade.time}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

