import { formatNumber, formatWalletAddress } from "@/lib/utils";

interface Holder {
  address: string;
  percentage: string;
  tokens: string;
}

interface HolderDistributionProps {
  holders: Holder[];
}

export function HolderDistribution({holders}: HolderDistributionProps) {
  // const holders = [
  //   { address: "0x1234...5678", percentage: "25%", tokens: "250,000" },
  //   { address: "0x8765...4321", percentage: "15%", tokens: "150,000" },
  //   { address: "0xabcd...ef12", percentage: "10%", tokens: "100,000" },
  // ]

  return (
    <div className="space-y-2">
      {holders.map((holder, index) => (
        <div 
          key={index}
          className="flex items-center justify-between p-2 rounded bg-green-900/30"
        >
          <span className="text-sm text-gray-400">{holder.address == "0x1539360c6c61DDa27653f826640E55AF92EbfF91" ? "Bidding Curve" : formatWalletAddress(holder.address)}</span>
          <div className="text-right">
            <div className="text-sm text-gray-400">{formatNumber(Number(holder.tokens))} tokens</div>
            <div className="text-xs text-gray-400">{holder.percentage}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

