"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { X, MessageCircle } from 'lucide-react'
import { useRouter } from "next/navigation"
import logo from "../app/potdotbidLogo.jpg"
import { useEffect, useState } from "react"
import { ethers } from "ethers"
import { useAppKitAccount } from "@reown/appkit/react"
import { useAppKitProvider } from "@reown/appkit/react"
import { BondingCurve, indexer } from "@/config"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function TokenCard({ token }: any) {
  const router = useRouter()
  const { walletProvider } = useAppKitProvider('eip155')
  const { isConnected } = useAppKitAccount();

  const[marketCap, setMarketCap] = useState<number | null>(null);

  const handleClick = () => {
    // In a real app, you'd use a proper token ID
    router.push(`/token/${encodeURIComponent(token.address)}`)
  }

  const fetchLatestEthPrice = async () => {
    try {
      const response = await fetch(`https://api.basescan.org/api?module=stats&action=ethprice&apikey=${process.env.NEXT_PUBLIC_BASE_API_KEY}`);
      if (!response.ok) {
        throw new Error("Failed to fetch ETH price from CoinGecko");
      }
      const data = await response.json();
      const ethPrice = data.result.ethusd;
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

  return (
    <Card
    className="bg-green-900/30 border-green-400 overflow-hidden cursor-pointer transition-colors hover:bg-green-900/40"
    onClick={handleClick}
  >
    <CardHeader className="bg-green-800/50 p-3">
      <div className="flex items-center justify-between space-x-3">
        <div className="flex items-center space-x-3">
          <Image
            src={logo}
            alt={token.name}
            width={50}
            height={50}
            className="rounded-full"
            loading="lazy"
          />
          <div>
            <CardTitle className="text-sm font-bold text-green-400">{token.name}</CardTitle>
            <p className="text-xs text-green-200">{token.symbol}</p>
          </div>
        </div>
        <div className="flex space-x-2 items-center">
          <a href={token.social.X} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
            <X className="h-4 w-4" />
          </a>
          <a href={token.social.tg} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
            <MessageCircle className="h-4 w-4" />
          </a>
        </div>
      </div>
    </CardHeader>
  
    <CardContent className="p-3 space-y-1">
      {/* Market Cap Section */}
      <div className="flex justify-between text-xs">
        <span className="text-gray-400">Market Cap:</span>
        <span className="font-medium text-gray-400">
          {!token.address
            ? null
            : marketCap != null
            ? marketCap.toLocaleString() + " USD"
            : "Getting..."}
        </span>
      </div>
  
      {/* Status Section */}
      <div className="flex justify-between items-center text-xs pt-2 border-t border-green-700 mt-2">
        <span className="text-gray-400">Status:</span>
        <span className={`text-sm font-bold ${token.status === 'bidding' ? 'text-yellow-400' : 'text-red-400'}`}>
          {token.status === 'bidding' ? 'Bidding' : 'Honeypot Active'}
        </span>
      </div>
    </CardContent>
  </Card>
  
  
  )
}

