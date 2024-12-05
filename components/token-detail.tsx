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
import { CountdownTimer } from "./countdown-timer"
import { useAppKitAccount, useAppKitProvider } from "@reown/appkit/react"
import { ethers } from "ethers"
import { BondingCurve, ERC20ABI } from "@/config"
import { toast } from "react-toastify"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function TokenDetail({ id }: { id: string }) {

   const holders = [
    { address: "0x1234...5678", percentage: "25%", tokens: "250,000", txHash: "0x123" },
    { address: "0x8765...4321", percentage: "15%", tokens: "150,000", txHash: "0x123" },
    { address: "0xabcd...ef12", percentage: "10%", tokens: "100,000", txHash: "0x123" },
  ]
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
    nextSellingTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
    selectedAddresses: ["0x1234567890abcdef1234567890abcdef12345678"],

  })
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [tradeUnit, setTradeUnit] = useState<'ETH' | string>('ETH');
  const [tokenAmount, setTokenAmount] = useState('')
  const [ethAmount, setEthAmount] = useState('')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const [sellPercentage, setSellPercentage] = useState(100) 
  const {isConnected} = useAppKitAccount()
  const { walletProvider } = useAppKitProvider('eip155')
  const [ethBalance, setEthBalance] = useState("");
  const [tokenBalance, setTokenBalance] = useState("");

  const tokenAddress = id;

  const handleTradeTypeChange = (isBuy: boolean) => {
    setTradeType(isBuy ? 'buy' : 'sell')
    setTokenAmount('')
    setEthAmount('')
    //setSellPercentage(100)
    if (isBuy) {
      setTradeUnit('ETH')
    }
  }

  const handleTokenAmountChange = async(value: string) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const provider = new ethers.providers.Web3Provider(walletProvider as any);
      const signer = provider.getSigner()
      const BondingContract = new ethers.Contract(BondingCurve.contractAddress, BondingCurve.ABI, signer)
      setTokenAmount(value)
      if (tradeType == "buy") {
        const ethAmount = await BondingContract.getEthAmountToBuyTokens(tokenAddress, ethers.utils.parseEther(value));
        setEthAmount(ethers.utils.formatEther(ethAmount))
  
      }else {
        const ethAmount = await BondingContract.getEthAmountBySale(tokenAddress, ethers.utils.parseEther(value));
        setEthAmount(ethers.utils.formatEther(ethAmount))
      }
    }catch (e){
      console.log(e);
    }
   
    
  }

  const handleEthAmountChange = async(value: string) => {
    try {
      setEthAmount(value)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const provider = new ethers.providers.Web3Provider(walletProvider as any);
      const signer = provider.getSigner()
      const BondingContract = new ethers.Contract(BondingCurve.contractAddress, BondingCurve.ABI, signer)
      setTokenAmount(value)
    
      const tokenAmount = await BondingContract.getTokenAmountByPurchase(tokenAddress, ethers.utils.parseEther(value));
      setTokenAmount(ethers.utils.formatEther(tokenAmount));
    } catch (e){
      console.log(e)
    }
   
    
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSellPercentageChange = (value: number) => {
    //setSellPercentage(value)
    // Assuming the user has 1000 tokens as balance
    setTokenAmount((1000 * value / 100).toString())
  }

  const handlebuysell = async() => {
    try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const provider = new ethers.providers.Web3Provider(walletProvider as any);
    const signer = provider.getSigner()
    const BondingContract = new ethers.Contract(BondingCurve.contractAddress, BondingCurve.ABI, signer)
    if (tradeType == "buy") {
      const balance = await provider.getBalance(await signer.getAddress());
      if (ethers.utils.parseEther(ethAmount).gte(balance)) {
        console.log("LESS BALANCE")
        toast.error("LESS BALANCE")
        return;
      }
      const outAmount = await BondingContract.getTokenAmountByPurchase(tokenAddress, ethers.utils.parseEther(ethAmount));
      const tx = await BondingContract.purchaseToken(tokenAddress,outAmount, 
        {
           value: ethers.utils.parseEther(ethAmount)

        });
      await tx.wait();
      console.log("BUYING SUCCCESFULLL");
      toast.success("Buy Succesfull");
      await fetchBalances();

    }else {
      const tokenContract = new ethers.Contract(
        tokenAddress,
        ERC20ABI,
        signer
      );
      const tokenBalance = await tokenContract.balanceOf(await signer.getAddress());
      if (ethers.utils.parseEther(tokenAmount).gte(tokenBalance)) {
        console.log("LESS BALANCE")
        toast.error("LESS BALANCE")
        return;
      }

      const currentAllowance = await tokenContract.allowance(
        await signer.getAddress(),
        BondingCurve.contractAddress
      );
      if (currentAllowance.lt(ethers.utils.parseEther(tokenAmount))) {
        const tx = await tokenContract.approve(BondingCurve.contractAddress, ethers.utils.parseEther(tokenAmount));
      console.log("Approval transaction sent:", tx.hash);

      // Wait for the transaction to be mined
       await tx.wait();
      }
      const outAmount = await BondingContract.getEthAmountBySale(tokenAddress, ethers.utils.parseEther(tokenAmount));
      const tx = await BondingContract.sellToken(tokenAddress,ethers.utils.parseEther(tokenAmount),outAmount);
      await tx.wait();
      console.log("Selling SUCCCESFULLL");
      toast.success("SEll SUCCESFULL")
      await fetchBalances()
    }
  } catch (e) {
    console.log(e);
  }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const fetchBalances = async () => {
    try {
      // Fetch ETH balance
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const provider = new ethers.providers.Web3Provider(walletProvider as any);
      const signer = provider.getSigner()
      const balance = await provider.getBalance(await signer.getAddress());
      setEthBalance(ethers.utils.formatEther(balance));

      // Fetch token balance
      if (tokenAddress) {
        const erc20Abi = [
          "function balanceOf(address owner) view returns (uint256)",
        ];
        const tokenContract = new ethers.Contract(
          tokenAddress,
          erc20Abi,
          provider
        );
        const tokenBalance = await tokenContract.balanceOf(await signer.getAddress());
        setTokenBalance(ethers.utils.formatUnits(tokenBalance, 18)); 
      }
    } catch (error) {
      console.error("Error fetching balances:", error);
    }
  };

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

  useEffect(() => {
    if (isConnected) {
      // Fetch ETH balance
      

      fetchBalances();
    }
  }, [isConnected, fetchBalances]);

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

      

      {/* Chart and Trading and Bidding Progress*/}
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
                  <span>
                    Balance: { tradeType == "sell" ? tradeType == "sell" && `${Number(tokenBalance).toFixed(4)} ${token.symbol}` : tradeType == "buy" && tradeUnit == "ETH" ? `${Number(ethBalance).toFixed(4)} ETH` : `${Number(tokenBalance).toFixed(4)} ${token.symbol}`}
                  </span>
                </div>
                <div className="flex items-center space-x-2 bg-green-900/30 rounded-md p-2">
                  <Input 
  type="number" 
  placeholder="0.0"
  value={tradeType === 'sell' ? tokenAmount : (tradeUnit === 'ETH' ? ethAmount : tokenAmount)}
  onChange={(e) => {
    if (tradeType === 'sell') {
      handleTokenAmountChange(e.target.value)
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
  <Select onValueChange={(value) => {
    setTokenAmount('')
    setEthAmount('')
    setTradeUnit(value)
    }} defaultValue="ETH">
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
              {tradeType == "buy" && tradeUnit == "ETH" && 
                <>
                  <span className=" text-white"> You will recieve {tokenAmount} {token.symbol} </span>
                </>
              }
              {tradeType == "buy" && tradeUnit == token.symbol && 
                <>
                  <span className=" text-white"> You will pay {ethAmount} ETH </span>
                </>
              }
              {tradeType == "sell"  && 
                <>
                  <span className=" text-white"> You will recieve {ethAmount} ETH </span>
                </>
              }
              <Button className="w-full bg-green-400 text-black hover:bg-green-300" onClick={handlebuysell}>
                {tradeType === 'sell' ? `Sell ${token.symbol}` : `Buy ${token.symbol}`}
              </Button>
            </CardContent>
            <CardHeader>
              <CardTitle className="text-green-400">Bidding Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <BiddingProgress progress={token.biddingProgress} />
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
                  {tokenAddress}
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

      {/* Countdown Timer and list of selected address and Holder distribution */}
    <Card className="bg-green-900/20 border-green-400">
      <CardHeader>
        <CardTitle className="text-green-400">Next Selling Window</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center space-y-2">
          <div className="text-xl font-bold text-green-400">
            {/* Replace with your countdown timer */}
            <CountdownTimer endTime={token.nextSellingTime} migrated={false} />
          </div>
          <div className="text-sm text-gray-400">Time until the next selling window opens.</div>
        </div>
      </CardContent>

      <CardHeader>
        <CardTitle className="text-green-400">Addresses Selected for Selling</CardTitle>
      </CardHeader>
      <CardContent>
        <HolderDistribution holders={holders}/>
      </CardContent>
      <CardHeader>
          <CardTitle className="text-green-400">Holder Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <HolderDistribution holders={holders}/>
        </CardContent>
    </Card>
    </div>
  )
}

