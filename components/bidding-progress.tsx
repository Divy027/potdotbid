interface BiddingProgressProps {
  progress: number
}

export function BiddingProgress({ progress }: BiddingProgressProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>Progress</span>
        <span>{progress}%</span>
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
    </div>
  )
}

