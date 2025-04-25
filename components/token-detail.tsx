"use client";
import { Header } from "./header";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input";
import { Copy } from "lucide-react";
// import { TokenChart } from "@/components/token-chart"
import { TradeHistory } from "@/components/trade-history";
import { BiddingProgress } from "@/components/bidding-progress";
import logo from "../app/potdotbidLogo.jpg"
import { HolderDistribution } from "@/components/holder-distribution";
import Image from "next/image"

import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CountdownTimer } from "./countdown-timer";
import { useAppKitAccount, useAppKitProvider } from "@reown/appkit/react";
import { ethers } from "ethers";
import { backend_url, BondingCurve, ERC20ABI, indexer, RPC, TokenABI } from "@/config";
import { toast } from "react-toastify";
import { formatWalletAddress } from "@/lib/utils";
import axios from "axios";
import TradingViewChart from "./TradingViewChart";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function TokenDetail({ id }: { id: string }) {

  const [token, setToken] = useState({
    name: "Example Token",
    symbol: "EX",
    description: "An example token for demonstration",
    contractAddress: "0x1234567890abcdef1234567890abcdef12345678",
    owner: "0xabcd...ef12",
    supply: 1e9,
    currentPrice: "0.001 ETH",
    logo: null,
    biddingProgress: 65,
    nextSellingTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
    selectedAddresses: ["0x1234567890abcdef1234567890abcdef12345678"],
  });
  const [tradeType, setTradeType] = useState<"buy" | "sell">("buy");
  const [tradeUnit, setTradeUnit] = useState<"ETH" | string>("ETH");
  const [tokenAmount, setTokenAmount] = useState("");
  const [ethAmount, setEthAmount] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const [sellPercentage, setSellPercentage] = useState(100)
  const { isConnected } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider("eip155");
  const [ethBalance, setEthBalance] = useState("");
  const [tokenBalance, setTokenBalance] = useState("");
  const [marketCap, setMarketCap] = useState<number | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [priceData, setPriceData] = useState([]);
  const [holders,setHolders] = useState([])
  const [launched, setLaunched] = useState(false)
;
  const tokenAddress = id;

  const handleTradeTypeChange = (isBuy: boolean) => {
    setTradeType(isBuy ? "buy" : "sell");
    setTokenAmount("");
    setEthAmount("");
    //setSellPercentage(100)
    if (isBuy) {
      setTradeUnit("ETH");
    }
  };

  const handleTokenAmountChange = async (value: string) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const provider = new ethers.providers.Web3Provider(walletProvider as any);
      const signer = provider.getSigner();
      const BondingContract = new ethers.Contract(
        BondingCurve.contractAddress,
        BondingCurve.ABI,
        signer
      );
      setTokenAmount(value);
      if (tradeType == "buy") {
        const ethAmount = await BondingContract.getEthAmountToBuyTokens(
          tokenAddress,
          ethers.utils.parseEther(value)
        );
        setEthAmount(ethers.utils.formatEther(ethAmount));
      } else {
        const ethAmount = await BondingContract.getEthAmountBySale(
          tokenAddress,
          ethers.utils.parseEther(value)
        );
        setEthAmount(ethers.utils.formatEther(ethAmount));
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleEthAmountChange = async (value: string) => {
    try {
      setEthAmount(value);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const provider = new ethers.providers.Web3Provider(walletProvider as any);
      const signer = provider.getSigner();
      const BondingContract = new ethers.Contract(
        BondingCurve.contractAddress,
        BondingCurve.ABI,
        signer
      );
      setTokenAmount(value);

      const tokenAmount = await BondingContract.getTokenAmountByPurchase(
        tokenAddress,
        ethers.utils.parseEther(value)
      );
      setTokenAmount(ethers.utils.formatEther(tokenAmount));
    } catch (e) {
      console.log(e);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSellPercentageChange = (value: number) => {
    //setSellPercentage(value)
    // Assuming the user has 1000 tokens as balance
    setTokenAmount(((1000 * value) / 100).toString());
  };

  const handlebuysell = async () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const provider = new ethers.providers.Web3Provider(walletProvider as any);
      const signer = provider.getSigner();
      const walletAddress = await signer.getAddress();
  
      const BondingContract = new ethers.Contract(
        BondingCurve.contractAddress,
        BondingCurve.ABI,
        signer
      );
  
      if (tradeType == "buy") {
        const balance = await provider.getBalance(walletAddress);
        if (ethers.utils.parseEther(ethAmount).gte(balance)) {
          console.log("LESS BALANCE");
          toast.error("LESS BALANCE");
          return;
        }
  
        const outAmount = await BondingContract.getTokenAmountByPurchase(
          tokenAddress,
          ethers.utils.parseEther(ethAmount)
        );

        const valuess = await BondingContract.virtualPools(tokenAddress);
        console.log("Token Reserve:", ethers.utils.formatEther(valuess.TokenReserve));
        console.log("ETH Reserve:", ethers.utils.formatEther(valuess.ETHReserve));
  
        const tx = await BondingContract.purchaseToken(
          tokenAddress,
          outAmount,
          { value: ethers.utils.parseEther(ethAmount).add(1) }
        );
        await tx.wait();
  
        console.log("BUYING SUCCESSFUL");
        toast.success("Buy Successful");

        const txData = {
          token: tokenAddress,
          amount: ethers.utils.formatEther(outAmount),
          signature: tx.hash,
          ethAmount: Number(ethAmount),
        }
  
        const response = await axios.post(`${backend_url}/api/tokens/buy`,txData, {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": localStorage.getItem('token')
          }
        });
        if (!response.data.success) {
          throw new Error("Failed to record purchase in backend");
        }
  
        console.log("BUY API SUCCESSFUL");
        await fetchBalances();
  
      } else {
        const tokenContract = new ethers.Contract(
          tokenAddress,
          ERC20ABI,
          signer
        );
        const tokenBalance = await tokenContract.balanceOf(walletAddress);
        if (ethers.utils.parseEther(tokenAmount).gte(tokenBalance)) {
          console.log("LESS BALANCE");
          toast.error("LESS BALANCE");
          return;
        }
  
        const currentAllowance = await tokenContract.allowance(
          walletAddress,
          BondingCurve.contractAddress
        );
        if (currentAllowance.lt(ethers.utils.parseEther(tokenAmount))) {
          const tx = await tokenContract.approve(
            BondingCurve.contractAddress,
            ethers.utils.parseEther(tokenAmount)
          );
          console.log("Approval transaction sent:", tx.hash);
          await tx.wait();
        }
  
        const outAmount = await BondingContract.getEthAmountBySale(
          tokenAddress,
          ethers.utils.parseEther(tokenAmount)
        );
  
        const tx = await BondingContract.sellToken(
          tokenAddress,
          ethers.utils.parseEther(tokenAmount),
          outAmount
        );
        await tx.wait();
  
        console.log("SELLING SUCCESSFUL");
        toast.success("Sell Successful");

        const txData = {
          token: tokenAddress,
          amount: tokenAmount,
          signature: tx.hash,
          ethAmount:Number(ethers.utils.formatEther(outAmount)),
        }
  
        const response = await axios.post(`${backend_url}/api/tokens/sell`,txData, {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": localStorage.getItem('token')
          }
        });
        if (!response.data.success) {
          throw new Error("Failed to record sale in backend");
        }
  
        console.log("SELL API SUCCESSFUL");
        await fetchBalances();
      }
    } catch (e) {
      console.error(e);
      toast.error("Transaction failed. Please try again.");
    }
  };
  

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const fetchBalances = async () => {
    try {
      // Fetch ETH balance
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const provider = new ethers.providers.Web3Provider(walletProvider as any);
      const signer = provider.getSigner();
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
        const tokenBalance = await tokenContract.balanceOf(
          await signer.getAddress()
        );
        setTokenBalance(ethers.utils.formatUnits(tokenBalance, 18));
      }
    } catch (error) {
      console.error("Error fetching balances:", error);
    }
  };

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
            Bidding_PriceChanged(order_by: {timestamp: desc}, where: {token: {_eq: "${tokenAddress}"}}) {
              timestamp
              newPrice
              token
              circulatingSupply
            }
            Bidding_Poolstate(where: {token: {_eq: "${tokenAddress}"}}, order_by: 
            {timestamp: desc}) {
              token
              timestamp
              tokenReserve
              }
          }
          `,
        }),
      });

      const latestPriceData = await latest_price_response.json();

      // Ensure data is present
      if (
        !latestPriceData.data ||
        !latestPriceData.data.Bidding_PriceChanged.length
      ) {
        throw new Error("No price data found for the token.");
      }

      const formattedData = latestPriceData.data.Bidding_PriceChanged
      .map((entry: { timestamp: string; newPrice: string }) => ({
        time: Number(entry.timestamp), // Convert timestamp to number (Unix timestamp)
        price: ((ethers.utils.formatEther(entry.newPrice))), // Format price
      }))
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .sort((a: any, b:any) => a.time - b.time); 

      setPriceData(formattedData);
      const latestEvent = latestPriceData.data.Bidding_PriceChanged[0]; // Latest price event
      const newPrice = Number(latestEvent.newPrice) / 10 ** 18; // Bonding curve price in ETH
      const circulatingSupply =
        Number(latestEvent.circulatingSupply) / 10 ** 18; // Tokens in circulation

      // Calculate market cap
      const marketCap = newPrice * circulatingSupply * latestEthPrice;

      console.log(`Market Cap: ${marketCap}`);
      setMarketCap(marketCap); // Update the state

      const tokenReserve =
        parseFloat(latestPriceData.data.Bidding_Poolstate[0].tokenReserve) /
        10 ** 18;
        console.log("RESERVE",tokenReserve);
      if (tokenReserve === 0) {
        setLaunched(true);
      }
      const totalSupply = tokenReserve + circulatingSupply;

      const percentage = (circulatingSupply / totalSupply) * 100;

      console.log(percentage);

      setProgress(Number(percentage));
    } catch (error) {
      console.log(error);
      return;
    }
  };

  const fetchTrades = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backend_url}/api/transaction/${tokenAddress}`);
      setTrades(response.data.transactions);
    } catch (err) {
      console.error("Error fetching trade history:", err);
     // setError("Failed to load trade history");
    } finally {
      setLoading(false);
    }
  };

  const fetchEligibleAddresses = async () => {
    setLoading(true);

    try {
      // Connect to the Ethereum provider
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const provider = new ethers.providers.JsonRpcProvider(RPC);

      // Instantiate the contract
      const contract = new ethers.Contract(
        tokenAddress,
        TokenABI,
        provider
      );
     
      // Fetch the eligible addresses
      const addresses: string[] = await contract.getHolders();
      console.log("ADDDDDCCC",addresses)

      // Create an array to hold the address data
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const addressData : any= [];

      for (let i = 0; i < addresses.length; i++) {
        const address = addresses[i];

        // Fetch the balance of each address
        const balance: ethers.BigNumber = await contract.balanceOf(address);

        // Convert balance to a readable format (assuming token has 18 decimals)
        const balanceInTokens = ethers.utils.formatUnits(balance, 18);

        // Calculate the percentage holding based on the total supply
        const percentageHolding = (parseFloat(balanceInTokens) /1000000000) * 100;

        // Format the data to the structure with percentage as a string (e.g., "25%") and tokens as a string with commas
        addressData.push({
          address,
          percentage: `${percentageHolding.toFixed(3)}%`, // Rounded to 2 decimal places
          tokens: balanceInTokens, // Adds commas to the token value
        });
      } 
      console.log("address",addressData)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sortedAddressData = addressData.sort((a: any, b: any) => {
        const percentageA = parseFloat(a.percentage.replace("%", ""));
        const percentageB = parseFloat(b.percentage.replace("%", ""));
        return percentageB - percentageA; // Sort in descending order
      });
      setHolders(sortedAddressData)
      
    } catch (error) {
      console.error("Error fetching eligible addresses:", error);
    } finally {
      setLoading(false);
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
      //console.log(token);
      await calculateMarketCap();

      fetchTrades();
      fetchEligibleAddresses();
    });
    }
    
  };

  useEffect(() => {
    listenToPoolEvents();
  }, [isConnected]);

  useEffect(() => {
    const fetchdata = async () => {
      await calculateMarketCap();
      console.log("FETCH");
    };
    fetchdata();
  }, []);

  useEffect(() => {
    if (isConnected) {
      // Fetch ETH balance

      fetchBalances();
    }
  }, [isConnected, fetchBalances]);

  useEffect(() => {
    

    const fetchToken = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${backend_url}/api/tokens/${tokenAddress}`);

        setToken(response.data.token);
      } catch (err) {
        console.error("Error fetching trade history:", err);
       // setError("Failed to load trade history");
      } finally {
        setLoading(false);
      }
    };

    if (tokenAddress) {
      fetchTrades();
      fetchToken();
      fetchEligibleAddresses()
    }
  }, [tokenAddress]);
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-green-950">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-green-400 text-xl">Loading token data...</div>
          </div>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
            className="space-y-8"
          >
            {/* Token Header */}
            <motion.div
              variants={fadeIn}
              className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-black text-2xl font-bold">
                <Image
                src={token?.logo || logo}
                alt={token.name}
                width={50}
                height={50}
                className="rounded-full border-2 border-green-500"
                loading="lazy"
              />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-green-400">{token.name}</h1>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-gray-400">{token.symbol}</span>
                    <Badge variant="outline" className="text-xs border-green-700 text-green-400">
                      {launched ? "Launched" : "Bidding"}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  className="border-green-700 text-green-400 hover:bg-green-700 hover:text-white"
                >
                  Share
                </Button>
                <Button className="bg-green-400 text-black hover:bg-green-300">
                  {launched ? "Trade on Uniswap" : "Participate in Bidding"}
                </Button>
              </div>
            </motion.div>

            {/* Token Stats */}
            <motion.div variants={fadeIn} className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-green-900/20 border-green-700">
                <CardContent className="p-4">
                  <div className="text-sm text-gray-400">Total Supply</div>
                  <div className="text-xl font-bold text-green-400">{token.supply}</div>
                </CardContent>
              </Card>

              <Card className="bg-green-900/20 border-green-700">
                <CardContent className="p-4">
                  <div className="text-sm text-gray-400">Creator</div>
                  <div className="text-xl font-bold text-green-400">{formatWalletAddress(token.owner)}</div>
                </CardContent>
              </Card>

              <Card className="bg-green-900/20 border-green-700">
                <CardContent className="p-4">
                  <div className="text-sm text-gray-400">Market Cap</div>
                  <div className="text-xl font-bold text-green-400">
                    {marketCap ? `$${marketCap.toLocaleString()}` : "Calculating..."}
                  </div>
                </CardContent>
              </Card>

              {/* <Card className="bg-green-900/20 border-green-700">
                <CardContent className="p-4">
                  <div className="text-sm text-gray-400">Current Price</div>
                  <div className="text-xl font-bold text-green-400">
                    {priceData.length > 0 ? `${priceData[priceData.length - 1]} ETH` : "N/A"}
                  </div>
                </CardContent>
              </Card> */}
            </motion.div>

            {/* Chart and Trading */}
            <motion.div variants={fadeIn} className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              <Card className="lg:col-span-3 bg-green-900/20 border-green-700">
                <CardHeader className="border-b border-green-800">
                  <CardTitle className="text-green-400">Price Chart</CardTitle>
                </CardHeader>
                <CardContent className="p-4 h-[400px]">
                  <TradingViewChart priceData={priceData} />
                </CardContent>
              </Card>

              <div className="lg:col-span-1 space-y-4">
                <Card className="bg-green-900/20 border-green-700">
                  <CardHeader className="border-b border-green-800">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-green-400">Trade</CardTitle>
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm ${tradeType === "buy" ? "text-green-400" : "text-gray-400"}`}>
                          Buy
                        </span>
                        <Switch
                          checked={tradeType === "sell"}
                          onCheckedChange={(checked) => handleTradeTypeChange(!checked)}
                        />
                        <span className={`text-sm ${tradeType === "sell" ? "text-green-400" : "text-gray-400"}`}>
                          Sell
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className={`space-y-4 ${launched ? "brightness-50 pointer-events-none" : ""}`}>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-gray-400">
                        <span>Amount</span>
                        <span>
                          Balance:{" "}
                          {tradeType === "sell"
                            ? `${Number(tokenBalance).toFixed(4)} ${token.symbol}`
                            : tradeUnit === "ETH"
                              ? `${Number(ethBalance).toFixed(4)} ETH`
                              : `${Number(tokenBalance).toFixed(4)} ${token.symbol}`}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 bg-green-900/30 rounded-md p-2">
                        <Input
                          type="number"
                          placeholder="0.0"
                          value={tradeType === "sell" ? tokenAmount : tradeUnit === "ETH" ? ethAmount : tokenAmount}
                          onChange={(e) => {
                            if (tradeType === "sell") {
                              handleTokenAmountChange(e.target.value)
                            } else {
                              if (tradeUnit === "ETH") {
                                handleEthAmountChange(e.target.value)
                              } else {
                                handleTokenAmountChange(e.target.value)
                              }
                            }
                          }}
                          className="bg-transparent border-none text-white text-lg"
                        />
                        {tradeType === "buy" ? (
                          <Select
                            onValueChange={(value) => {
                              setTokenAmount("")
                              setEthAmount("")
                              setTradeUnit(value)
                            }}
                            defaultValue="ETH"
                          >
                            <SelectTrigger className="w-[100px] border-green-700">
                              <SelectValue placeholder="Select unit" />
                            </SelectTrigger>
                            <SelectContent className="bg-green-900 border-green-700">
                              <SelectItem value="ETH">ETH</SelectItem>
                              <SelectItem value={token.symbol}>{token.symbol}</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <Button variant="secondary" className="bg-green-800 text-green-400">
                            {token.symbol}
                          </Button>
                        )}
                      </div>
                    </div>

                    {tradeType === "buy" && tradeUnit === "ETH" && (
                      <div className="text-sm text-white bg-green-900/30 p-2 rounded-md">
                        You will receive <span className="text-green-400 font-bold">{tokenAmount}</span> {token.symbol}
                      </div>
                    )}

                    {tradeType === "buy" && tradeUnit === token.symbol && (
                      <div className="text-sm text-white bg-green-900/30 p-2 rounded-md">
                        You will pay <span className="text-green-400 font-bold">{ethAmount}</span> ETH
                      </div>
                    )}

                    {tradeType === "sell" && (
                      <div className="text-sm text-white bg-green-900/30 p-2 rounded-md">
                        You will receive <span className="text-green-400 font-bold">{ethAmount}</span> ETH
                      </div>
                    )}

                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button className="w-full relative overflow-hidden group" onClick={handlebuysell}>
                        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-green-400 to-emerald-300 transition-transform duration-300"></span>
                        <span className="relative text-black font-bold">
                          {tradeType === "sell" ? `Sell ${token.symbol}` : `Buy ${token.symbol}`}
                        </span>
                      </Button>
                    </motion.div>
                  </CardContent>
                </Card>

                <Card className="bg-green-900/20 border-green-700">
                  <CardHeader className="border-b border-green-800">
                    <CardTitle className="text-green-400">Bidding Progress</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <BiddingProgress progress={progress || 0} launched={launched} />
                  </CardContent>
                </Card>
              </div>
            </motion.div>

            {/* Tabs for Token Details */}
            <motion.div variants={fadeIn}>
              <Tabs defaultValue="trades" className="w-full">
                <TabsList className="grid grid-cols-4 bg-green-900/30 border border-green-800">
                  <TabsTrigger
                    value="trades"
                    className="data-[state=active]:bg-green-800 data-[state=active]:text-green-400"
                  >
                    Trade History
                  </TabsTrigger>
                  <TabsTrigger
                    value="holders"
                    className="data-[state=active]:bg-green-800 data-[state=active]:text-green-400"
                  >
                    Holder Distribution
                  </TabsTrigger>
                  <TabsTrigger
                    value="info"
                    className="data-[state=active]:bg-green-800 data-[state=active]:text-green-400"
                  >
                    Token Info
                  </TabsTrigger>
                  <TabsTrigger
                    value="selling"
                    className="data-[state=active]:bg-green-800 data-[state=active]:text-green-400"
                  >
                    Selling Window
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="trades" className="mt-4">
                  <Card className="bg-green-900/20 border-green-700">
                    <CardHeader className="border-b border-green-800">
                      <CardTitle className="text-green-400">Trade History</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <TradeHistory trades={trades} token={token} />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="holders" className="mt-4">
                  <Card className="bg-green-900/20 border-green-700">
                    <CardHeader className="border-b border-green-800">
                      <CardTitle className="text-green-400">Holder Distribution</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <HolderDistribution holders={holders} />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="info" className="mt-4">
                  <Card className="bg-green-900/20 border-green-700">
                    <CardHeader className="border-b border-green-800">
                      <CardTitle className="text-green-400">Token Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 p-4">
                      <div>
                        <div className="text-sm text-gray-400">Name</div>
                        <div className="font-bold text-gray-400 px-2 py-1">
                          {token.name} ({token.symbol})
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400">Description</div>
                        <div className="text-sm text-gray-400 px-2 py-1 max-h-32 overflow-y-auto rounded">
                          {token.description}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400">Contract Address</div>
                        <div className="flex items-center space-x-2">
                          <code className="text-sm text-gray-400 px-2 py-1 rounded bg-green-900/30">
                            {tokenAddress}
                          </code>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => copyToClipboard(tokenAddress)}
                            className="text-green-400 hover:text-green-300"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="selling" className="mt-4">
                  <Card className="bg-green-900/20 border-green-700">
                    <CardHeader className="border-b border-green-800">
                      <CardTitle className="text-green-400">Next Selling Window</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="text-center space-y-4">
                        <div className="text-2xl font-bold text-green-400">
                          <CountdownTimer endTime={token.nextSellingTime || 24 * 60 * 60 * 1000} migrated={false} />
                        </div>
                        <div className="text-sm text-gray-400">Time until the next selling window opens.</div>
                      </div>

                      {launched && (
                        <div className="mt-6">
                          <h3 className="text-lg font-semibold text-green-400 mb-3">Addresses Selected for Selling</h3>
                          <HolderDistribution holders={holders.slice(0, 3)} />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </motion.div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
