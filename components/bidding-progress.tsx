interface BiddingProgressProps {
  progress: number,
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
        <div 
          className="h-full bg-gradient-to-r from-green-400 to-green-300 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-400">
        <span>0%</span>
        <span>Target: 100%</span>
      </div>
      <span className="text-md mt-2 text-gray-400"> 
       {launched ? <span>Liquidity is sent to uniswap v2! Check <a href="https://uniswap.org/" target="_blank" className="text-purple-500">here</a></span> : ''}

      </span>
    </div>
  )
}

