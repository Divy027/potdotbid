"use client";
import { Header } from "./header";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy } from "lucide-react";
// import { TokenChart } from "@/components/token-chart"
import { TradeHistory } from "@/components/trade-history";
import { BiddingProgress } from "@/components/bidding-progress";
import { HolderDistribution } from "@/components/holder-distribution";
import { Switch } from "@/components/ui/switch";
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

  return (
    <div className="space-y-6">
      <Header />
      {/* Token Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-row ">
          <div>
            <CardContent className="p-4">
              <div className="text-sm text-gray-400">Total Supply</div>
              <div className="text-xl font-bold text-green-400">
                {token.supply}
              </div>
            </CardContent>
          </div>
          <div>
            <CardContent className="p-4">
              <div className="text-sm text-gray-400">Creator</div>
              <div className="text-xl font-bold text-green-400">
                {formatWalletAddress(token.owner)}
              </div>
            </CardContent>
          </div>
          <div>
            <CardContent className="p-4">
              <div className="text-sm text-gray-400">Market Cap</div>
              <div className="text-xl font-bold text-green-400">
                {!tokenAddress
                  ? null
                  : marketCap != null
                  ? marketCap.toLocaleString() + "USD"
                  : "Getting Market Cap..."}
              </div>
            </CardContent>
          </div>
        </div>
      </div>

      {/* Chart and Trading and Bidding Progress*/}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3">
          {/* <Card className="bg-green-900/20 border-green-400"> */}
            <CardContent className="p-4 h-[400px]">
              <TradingViewChart priceData={priceData}/>
            </CardContent>
          {/* </Card> */}
        </div>
        <div className="lg:col-span-1">
          <Card className="bg-green-900/20 border-green-400">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-green-400">Trade</CardTitle>
                <div className="flex items-center space-x-2">
                  <span
                    className={`text-sm ${
                      tradeType === "buy" ? "text-green-400" : "text-gray-400"
                    }`}
                  >
                    Buy
                  </span>
                  <Switch
                    checked={tradeType === "sell"}
                    onCheckedChange={(checked) =>
                      handleTradeTypeChange(!checked)
                    }
                  />
                  <span
                    className={`text-sm ${
                      tradeType === "sell" ? "text-green-400" : "text-gray-400"
                    }`}
                  >
                    Sell
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className={launched ? "space-y-4 brightness-50 pointer-events-none" : "space-y-4"}>
              
                <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Amount</span>
                  <span>
                    Balance:{" "}
                    {tradeType == "sell"
                      ? tradeType == "sell" &&
                        `${Number(tokenBalance).toFixed(4)} ${token.symbol}`
                      : tradeType == "buy" && tradeUnit == "ETH"
                      ? `${Number(ethBalance).toFixed(4)} ETH`
                      : `${Number(tokenBalance).toFixed(4)} ${token.symbol}`}
                  </span>
                </div>
                <div className="flex items-center space-x-2 bg-green-900/30 rounded-md p-2">
                  <Input
                    type="number"
                    placeholder="0.0"
                    value={
                      tradeType === "sell"
                        ? tokenAmount
                        : tradeUnit === "ETH"
                        ? ethAmount
                        : tokenAmount
                    }
                    onChange={(e) => {
                      if (tradeType === "sell") {
                        handleTokenAmountChange(e.target.value);
                      } else {
                        if (tradeUnit === "ETH") {
                          handleEthAmountChange(e.target.value);
                        } else {
                          handleTokenAmountChange(e.target.value);
                        }
                      }
                    }}
                    className="bg-transparent border-none text-white text-lg"
                  />
                  {tradeType === "buy" ? (
                    <Select
                      onValueChange={(value) => {
                        setTokenAmount("");
                        setEthAmount("");
                        setTradeUnit(value);
                      }}
                      defaultValue="ETH"
                    >
                      <SelectTrigger className="w-[100px]">
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ETH">ETH</SelectItem>
                        <SelectItem value={token.symbol}>
                          {token.symbol}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Button
                      variant="secondary"
                      className="bg-green-800 text-green-400"
                    >
                      {token.symbol}
                    </Button>
                  )}
                </div>
              </div>
              {tradeType == "buy" && tradeUnit == "ETH" && (
                <>
                  <span className=" text-white">
                    {" "}
                    You will recieve {tokenAmount} {token.symbol}{" "}
                  </span>
                </>
              )}
              {tradeType == "buy" && tradeUnit == token.symbol && (
                <>
                  <span className=" text-white">
                    {" "}
                    You will pay {ethAmount} ETH{" "}
                  </span>
                </>
              )}
              {tradeType == "sell" && (
                <>
                  <span className=" text-white">
                    {" "}
                    You will recieve {ethAmount} ETH{" "}
                  </span>
                </>
              )}
              <Button
                className="w-full bg-green-400 text-black hover:bg-green-300"
                onClick={handlebuysell}
              >
                {tradeType === "sell"
                  ? `Sell ${token.symbol}`
                  : `Buy ${token.symbol}`}
              </Button>
              
            </CardContent>
            <CardHeader>
              <CardTitle className="text-green-400">Bidding Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <BiddingProgress progress={progress || 0} launched={launched} />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Trade History and Token Info */}
      <div className="grid grid-cols-4 gap-4">
  {/* Trade History Section */}
  <div className="col-span-3">
    <Card className="bg-green-900/20 border-green-400 h-full">
      <CardHeader>
        <CardTitle className="text-green-400">Trade History</CardTitle>
      </CardHeader>
      <CardContent>
        {loading? 
          <>
            <div className="text-center text-white">Loading...</div>
          </> :
          <>
             <TradeHistory trades={trades} token={token} />
          </>}
     
      </CardContent>
    </Card>
  </div>
  
  {/* Token Information Section */}
  <div className="col-span-1">
    <Card className="bg-green-900/20 border-green-400 h-full">
      <CardHeader>
        <CardTitle className="text-green-400">Token Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="text-sm text-gray-400">Name</div>
          <div className="font-bold text-gray-400 px-2 py-1">
            {token.name} ({token.symbol})
          </div>
        </div>
        <div>
        <div className="text-sm text-gray-400">Description</div>
          <div
            className="text-sm text-gray-400 px-2 py-1 max-h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-green-400 s  crollbar-track-green-900 rounded"
          >
            {token.description}
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-400">Contract Address</div>
          <div className="flex items-center space-x-2">
            <code className="text-sm text-gray-400 px-2 py-1 rounded">
              {formatWalletAddress(tokenAddress)}
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
      <CardHeader>
          <CardTitle className="text-green-400">Next Selling Window</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-2">
            <div className="text-xl font-bold text-green-400">
              {/* Replace with your countdown timer */}
              <CountdownTimer
                endTime={token.nextSellingTime || 24 * 60 * 60 * 1000}
                migrated={false}
              />
            </div>
            <div className="text-sm text-gray-400">
              Time until the next selling window opens.
            </div>
          </div>
        </CardContent>
    </Card>
  </div>
</div>


      {/* Countdown Timer and list of selected address and Holder distribution */}
      <Card className="bg-green-900/20 border-green-400">
        

        <CardHeader>
          <CardTitle className="text-green-400">
            Addresses Selected for Selling
          </CardTitle>
        </CardHeader>
        <CardContent>
          <HolderDistribution holders={holders} />
        </CardContent>
        <CardHeader>
          <CardTitle className="text-green-400">Holder Distribution</CardTitle>
        </CardHeader>
        <CardContent>
        {loading? 
          <>
            <div className="text-center text-white">Loading...</div>
          </> :
          <>
              <HolderDistribution holders={holders} />
          </>}
         
        </CardContent>
      </Card>
    </div>
  );
}
