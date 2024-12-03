"use client"
import { Header } from "./header"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Copy } from 'lucide-react'
// import { TokenChart } from "@/components/token-chart"
import { TradeHistory } from "@/components/trade-history"
import { BiddingProgress } from "@/components/bidding-progress"
import { HolderDistribution } from "@/components/holder-distribution"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function TokenDetail({ id }: { id: string }) {
  const [token] = useState({
    name: "Example Token",
    symbol: "EX",
    description: "An example token for demonstration",
    contractAddress: "0x1234567890abcdef1234567890abcdef12345678",
    creator: "0xabcd...ef12",
    totalSupply: "1,000,000",
    marketCap: "$100,000",
    currentPrice: "0.001 ETH",
    biddingProgress: 65,
  })

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      if (typeof TradingView !== 'undefined') {
        new TradingView.widget({
          autosize: true,
          symbol: 'BINANCE:BTCUSDT', // Replace with your token's symbol
          interval: 'D',
          timezone: 'Etc/UTC',
          theme: 'dark',
          style: '1',
          locale: 'en',
          toolbar_bg: '#f1f3f6',
          enable_publishing: false,
          allow_symbol_change: true,
          container_id: 'tradingview_widget'
        });
      }
    };
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [tradeUnit, setTradeUnit] = useState<'ETH' | string>('ETH');
  const [tokenAmount, setTokenAmount] = useState('')
  const [ethAmount, setEthAmount] = useState('')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [sellPercentage, setSellPercentage] = useState(100) 

  const handleTradeTypeChange = (isBuy: boolean) => {
    setTradeType(isBuy ? 'buy' : 'sell')
    setTokenAmount('')
    setEthAmount('')
    setSellPercentage(100)
    if (isBuy) {
      setTradeUnit('ETH')
    }
  }

  const handleTokenAmountChange = (value: string) => {
    setTokenAmount(value)
    const ethValue = (parseFloat(value) * parseFloat(token.currentPrice)).toFixed(6)
    setEthAmount(isNaN(parseFloat(ethValue)) ? '' : ethValue)
  }

  const handleEthAmountChange = (value: string) => {
    setEthAmount(value)
    const tokenValue = (parseFloat(value) / parseFloat(token.currentPrice)).toFixed(6)
    setTokenAmount(isNaN(parseFloat(tokenValue)) ? '' : tokenValue)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSellPercentageChange = (value: number) => {
    setSellPercentage(value)
    // Assuming the user has 1000 tokens as balance
    setTokenAmount((1000 * value / 100).toString())
  }

  return (
    <div className="space-y-6">

      <Header/>
      {/* Token Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-row "> 
          <div>
          <CardContent className="p-4">
            <div className="text-sm text-gray-400">Total Supply</div>
            <div className="text-xl font-bold text-green-400">{token.totalSupply}</div>
          </CardContent>
          </div>
          <div> 
          <CardContent className="p-4">
            <div className="text-sm text-gray-400">Creator</div>
            <div className="text-xl font-bold text-green-400">{token.creator}</div>
          </CardContent>


          </div>

          <div> 

          <CardContent className="p-4">
            <div className="text-sm text-gray-400">Market Cap</div>
            <div className="text-xl font-bold text-green-400">{token.marketCap}</div>
          </CardContent>


          </div>



        </div>
        
        
        
         
        
        
         
       
      </div>

      {/* Chart and Trading */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3">
          <Card className="bg-green-900/20 border-green-400">
            <CardContent className="p-4 h-[400px]">
              <div className="w-full h-full" id="tradingview_widget"></div>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-1">
          <Card className="bg-green-900/20 border-green-400">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-green-400">Trade</CardTitle>
                <div className="flex items-center space-x-2">
                  <span className={`text-sm ${tradeType === 'buy' ? 'text-green-400' : 'text-gray-400'}`}>Buy</span>
                  <Switch
                    checked={tradeType === 'sell'}
                    onCheckedChange={(checked) => handleTradeTypeChange(!checked)}
                  />
                  <span className={`text-sm ${tradeType === 'sell' ? 'text-green-400' : 'text-gray-400'}`}>Sell</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Amount</span>
                  <span>Balance: 1000 {token.symbol}</span>
                </div>
                <div className="flex items-center space-x-2 bg-green-900/30 rounded-md p-2">
                  <Input 
  type="number" 
  placeholder="0.0"
  value={tradeType === 'sell' ? tokenAmount : (tradeUnit === 'ETH' ? ethAmount : tokenAmount)}
  onChange={(e) => {
    if (tradeType === 'sell') {
      setTokenAmount(e.target.value)
    } else {
      if (tradeUnit === 'ETH') {
        handleEthAmountChange(e.target.value)
      } else {
        handleTokenAmountChange(e.target.value)
      }
    }
  }}
  className="bg-transparent border-none text-white text-lg"
/>
{tradeType === 'buy' ? (
  <Select onValueChange={(value) => setTradeUnit(value)} defaultValue="ETH">
    <SelectTrigger className="w-[100px]">
      <SelectValue placeholder="Select unit" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="ETH">ETH</SelectItem>
      <SelectItem value={token.symbol}>{token.symbol}</SelectItem>
    </SelectContent>
  </Select>
) : (
  <Button variant="secondary" className="bg-green-800 text-green-400">{token.symbol}</Button>
)}
                </div>
              </div>
              <Button className="w-full bg-green-400 text-black hover:bg-green-300">
                {tradeType === 'sell' ? `Sell ${token.symbol}` : `Buy ${token.symbol}`}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Trade History and Token Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="bg-green-900/20 border-green-400">
          <CardHeader>
            <CardTitle className="text-green-400">Trade History</CardTitle>
          </CardHeader>
          <CardContent>
            <TradeHistory />
          </CardContent>
        </Card>
        <Card className="bg-green-900/20 border-green-400">
          <CardHeader>
            <CardTitle className="text-green-400">Token Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm text-gray-400">Name</div>
              <div className="font-bold">{token.name} ({token.symbol})</div>
            </div>
            <div>
              <div className="text-sm text-gray-400">Description</div>
              <div className="text-sm">{token.description}</div>
            </div>
            <div>
              <div className="text-sm text-gray-400">Contract Address</div>
              <div className="flex items-center space-x-2">
                <code className="text-sm text-gray-400 px-2 py-1 rounded">
                  {token.contractAddress}
                </code>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => copyToClipboard(token.contractAddress)}
                  className="text-green-400 hover:text-green-300"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bidding Progress and Holder distribution */}
      <Card className="bg-green-900/20 border-green-400">
        <CardHeader>
          <CardTitle className="text-green-400">Bidding Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <BiddingProgress progress={token.biddingProgress} />
        </CardContent>

        <CardHeader>
          <CardTitle className="text-green-400">Holder Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <HolderDistribution />
        </CardContent>
      </Card>

    </div>
  )
}

