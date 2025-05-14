"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, MessageCircle, TrendingUp, Clock, AlertTriangle, ExternalLink } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useRouter } from "next/navigation"
import logo from "../app/potdotbidLogo.jpg"
import { useEffect, useState } from "react"
import { ethers } from "ethers"
import { useAppKitAccount } from "@reown/appkit/react"
import { useAppKitProvider } from "@reown/appkit/react"
import { BondingCurve, indexer } from "@/config"
import { Button } from "@/components/ui/button"
import { delay } from "@/lib/utils"
//@ts-expect-error error contain error
import PriceIndexer from "price-indexer"
interface TokenCardProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  token: any
  type: "bidding" | "completed"
  index: number
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function TokenCard({ token, type, index }: TokenCardProps) {
  const router = useRouter()
  const { walletProvider } = useAppKitProvider('eip155')
  const { isConnected } = useAppKitAccount();
  const [isHovered, setIsHovered] = useState(false)


  const[marketCap, setMarketCap] = useState<number | null>(null);

  const handleClick = () => {
    // In a real app, you'd use a proper token ID
    router.push(`/token/${encodeURIComponent(token.address)}`)
  }

  const fetchLatestEthPrice = async () => {
    try {
     await delay(1000);
     
    const fetchPriceIndex = await new PriceIndexer("mainnet").basePrice();
    console.log(fetchPriceIndex);

     // const data = await response.json();
      const ethPrice = fetchPriceIndex;
      console.log("Latest ETH Price (USD):", ethPrice);
      return Number(ethPrice); // Return the fetched price
    } catch (error) {
      console.error("Error fetching ETH price:", error);
      return null;
    }
  };

  const calculateMarketCap = async () => {
    try {
      const latestEthPrice = await fetchLatestEthPrice();
      if (!latestEthPrice) {
        throw new Error("Error fetching ETH price");
      }

      const latest_price_response = await fetch(indexer, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
           query {
            Bidding_PriceChanged(order_by: {timestamp: desc}, where: {token: {_eq: "${token.address}"}}) {
              timestamp
              newPrice
              token
              circulatingSupply
            }
          }
          `,
        }),
      });

      const latestPriceData = await latest_price_response.json();

      // Ensure data is present
      if (!latestPriceData.data || !latestPriceData.data.Bidding_PriceChanged.length) {
        throw new Error("No price data found for the token.");
      }
  
      const latestEvent = latestPriceData.data.Bidding_PriceChanged[0]; // Latest price event
      const newPrice = Number(latestEvent.newPrice)  / 10 ** 18 // Bonding curve price in ETH
      const circulatingSupply = Number(latestEvent.circulatingSupply) / 10 ** 18; // Tokens in circulation
  
      // Calculate market cap
      const marketCap = newPrice * circulatingSupply * latestEthPrice;
  
      console.log(`Market Cap: ${marketCap}`);
      setMarketCap(marketCap); // Update the state
    } catch (error) {
      console.log(error);
      return;
    }
  };

  const listenToPoolEvents = async () => {
    if (isConnected) {
      console.log("EVENT SET");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const provider = new ethers.providers.Web3Provider(walletProvider as any);
    const contract = new ethers.Contract(
      BondingCurve.contractAddress,
      BondingCurve.ABI,
      provider
    );

    contract.on("PriceChanged", async () => {
      // Fetch and calculate market cap when an event is emitted
      console.log(token);
      await calculateMarketCap();
    });
    }
    
  };

  useEffect(() => {
    listenToPoolEvents();
  }, [isConnected]);

  useEffect(()=> {
    const fetchdata = async()=> {
      await calculateMarketCap();
      console.log("FETCH")
    }
    fetchdata();
  },[])
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        delay: index * 0.1,
      },
    },
  }

  return (
    <motion.div
    variants={item}
    whileHover={{ y: -5 }}
    onHoverStart={() => setIsHovered(true)}
    onHoverEnd={() => setIsHovered(false)}
  >
    <Card
      className="overflow-hidden border-green-700 bg-gradient-to-br from-green-950/80 to-black/90 backdrop-blur-sm shadow-lg shadow-green-900/20 h-full transition-all duration-300"
      onClick={handleClick}
    >
      <CardHeader className="bg-gradient-to-r from-green-900/50 to-green-800/30 p-3">
        <div className="flex items-center justify-between space-x-3">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Image
                src={token.logo || logo}
                alt={token.name}
                width={50}
                height={50}
                className="rounded-full border-2 border-green-500"
                loading="lazy"
              />
              {type === "bidding" && (
                <div className="absolute -top-1 -right-1 bg-yellow-500 rounded-full p-1">
                  <Clock className="h-3 w-3 text-black" />
                </div>
              )}
              {type === "completed" && (
                <div className="absolute -top-1 -right-1 bg-red-500 rounded-full p-1">
                  <AlertTriangle className="h-3 w-3 text-white" />
                </div>
              )}
            </div>
            <div>
              <CardTitle className="text-sm font-bold text-green-400">{token.name}</CardTitle>
              <p className="text-xs text-green-200">{token.symbol}</p>
            </div>
          </div>
          <div className="flex space-x-2 items-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <a
                    href={token.social?.X}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-400 hover:text-green-300 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <X className="h-4 w-4" />
                  </a>
                </TooltipTrigger>
                <TooltipContent className="bg-green-900 text-green-200 border-green-700">
                  <p>Follow on X</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <a
                    href={token.social?.tg}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-400 hover:text-green-300 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MessageCircle className="h-4 w-4" />
                  </a>
                </TooltipTrigger>
                <TooltipContent className="bg-green-900 text-green-200 border-green-700">
                  <p>Join Telegram</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-3 space-y-3">
        {/* Market Cap Section */}
        <div className="flex justify-between items-center text-xs">
          <div className="flex items-center">
            <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
            <span className="text-green-300">Market Cap:</span>
          </div>
          <span className="font-medium text-green-200">
            {!token.address
              ? "Not deployed"
              : marketCap != null
                ? marketCap.toLocaleString() + " USD"
                : "Calculating..."}
          </span>
        </div>

        {/* Status Section */}
        <div className="flex justify-between items-center text-xs pt-2 border-t border-green-800/50">
          <span className="text-green-300">Status:</span>
          <span
            className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              type === "bidding" ? "bg-yellow-500/20 text-yellow-400" : "bg-red-500/20 text-red-400"
            }`}
          >
            {type === "bidding" ? "Bidding Active" : "Honeypot Active"}
          </span>
        </div>

        {/* Action Button - Only visible on hover */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
          transition={{ duration: 0.2 }}
          className="pt-2"
        >
          <Button
            variant="outline"
            size="sm"
            className="w-full border-green-500 text-green-400 hover:bg-green-500 hover:text-black"
            onClick={(e) => {
              e.stopPropagation()
              handleClick()
            }}
          >
            <span>View Details</span>
            <ExternalLink className="h-3 w-3 ml-2" />
          </Button>
        </motion.div>
      </CardContent>
    </Card>
  </motion.div>
  
  
  )
}

