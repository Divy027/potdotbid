"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Upload, X, MessageCircle, Info, AlertCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { backend_url, BondingCurve } from "@/config"
import { useAppKitAccount, useAppKitProvider } from "@reown/appkit/react"
import { ethers } from "ethers"
import axios from "axios"
import { toast } from "react-toastify"

  interface TokenCreationFormProps {
    onTokenCreated: () => void; // Define the prop type
  }
  
export function TokenCreationForm({ onTokenCreated }: TokenCreationFormProps) {
 
  const [isExpanded, setIsExpanded] = useState(false)
  const [newToken, setNewToken] = useState({
    name: "",
    symbol: "",
    description: "",
    social: {
      x: "",
      tg: "",
    },
  })
  const { isConnected} = useAppKitAccount()
  const { walletProvider } = useAppKitProvider('eip155')
  const [ethAmount, setEthAmount] = useState("0")
  const [error, setError] = useState("")
  const [imagePreview, setImagePreview] = useState(null)

  const handleNewToken = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (newToken.name && newToken.symbol && newToken.description) {
      
  
      try {
       if (!isConnected) return;
       // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const ethersProvider = new ethers.providers.Web3Provider(walletProvider as any)

        const signer = ethersProvider.getSigner()
       console.log(ethAmount)
        const balance = await ethersProvider.getBalance(await signer.getAddress());
        console.log("BALANCE",balance.toString());
        //console.log("BALANCE",ethers.utils.parseEther(ethAmount.toString()).toString());
        if (Number(ethAmount) > 0 ){
          console.log('checking')
          if (balance.lte(ethers.utils.parseEther(ethAmount))) {
            console.log("Less balance")
            return;
          }
        }
      
         
        // The Contract object
        const BondingContract = new ethers.Contract(BondingCurve.contractAddress, BondingCurve.ABI, signer)

        let hash = '';
        let tokenAddress = ""

        BondingContract.on("TokenCreate", async function listener(newTokenAddress, tokenCount, creator, event) {
            if (creator == await signer.getAddress()) {
                console.log("Token created:");
                console.log("Token Address:", newTokenAddress);
                console.log("Event Details:", event);

                tokenAddress = newTokenAddress;

                if (Number(ethAmount) <= 0) {
                  const tokenData = {
                    name: newToken.name,
                    symbol: newToken.symbol,
                    description: newToken.description,
                    social: newToken.social,
                    address: newTokenAddress,
                    signature: hash,
                    avatar: "https://pink-acceptable-heron-641.mypinata.cloud/files/bafkreibobif7s6nyfnl3osaqkynliuywnw2o7zl6wkbccp7xn7fdyur3hi?X-Algorithm=PINATA1&X-Date=1733391021&X-Expires=30&X-Method=GET&X-Signature=901eb8293c2d2ceb554b24e18f062ddb4b3f14913c6ca932b7339ce677cd5360"
                };

                try {
                  console.log("New token update");
                    const response = await axios.post(`${backend_url}/api/tokens/create`, tokenData, {
                        headers: {
                            "Content-Type": "application/json",
                            "x-auth-token": localStorage.getItem('token')
                        }
                    });
                    console.log(response);

                    if (response.data.success) {
                        //setTokens((prevTokens) => [...prevTokens, response.data.token]);
                        setNewToken({ name: "", symbol: "", description: "", social: { x: "", tg: "" } });
                        toast.success("TOKEN CREATE SUCCESSFULL")
                        onTokenCreated();
                        // Stop listening for the event after success
                       
                    }
                } catch (error) {
                    console.error("Error while posting to backend:", error);
                }
                finally {
                  BondingContract.off("TokenCreate", listener);
                  console.log("Stopped listening to TokenCreate event.");
                }
                }

                
            }
        });

        BondingContract.on("TokenPurchased", async function listener(newTokenAddress, creator,initialfunds, tokenamount) {
          if (creator == await signer.getAddress() && tokenAddress == newTokenAddress) {
              console.log("Token purchased:");
              console.log("Token Address:", newTokenAddress);
             
              if (Number(ethAmount) > 0) {
                const tokenData = {
                  name: newToken.name,
                  symbol: newToken.symbol,
                  description: newToken.description,
                  social: newToken.social,
                  address: newTokenAddress,
                  signature: hash,
                  boughtAmount: Number(ethers.utils.formatUnits(tokenamount,18)),
                  ethAmount: Number(ethers.utils.formatEther(initialfunds)),
                  avatar: "https://pink-acceptable-heron-641.mypinata.cloud/files/bafkreibobif7s6nyfnl3osaqkynliuywnw2o7zl6wkbccp7xn7fdyur3hi?X-Algorithm=PINATA1&X-Date=1733391021&X-Expires=30&X-Method=GET&X-Signature=901eb8293c2d2ceb554b24e18f062ddb4b3f14913c6ca932b7339ce677cd5360"
              };

              try {
                  const response = await axios.post(`${backend_url}/api/tokens/create`, tokenData, {
                      headers: {
                          "Content-Type": "application/json",
                          "x-auth-token": localStorage.getItem('token')
                      }
                  });

                  if (response.data.success) {
                      //setTokens((prevTokens) => [...prevTokens, response.data.token]);
                      setNewToken({ name: "", symbol: "", description: "", social: { x: "", tg: "" } });
                      toast.success("TOKEN CREATE SUCCESSFULL")
                      onTokenCreated();
                      // Stop listening for the event after success
                     
                  }
              } catch (error) {
                  console.error("Error while posting to backend:", error);
              } finally {
                BondingContract.off("TokenPurchased", listener);
                console.log("Stopped listening to Purchase event.");
              } 
              }
             
          }
      });

        console.log("name",newToken.name);
        console.log("symbol",newToken.symbol);
        console.log("msg.value",ethers.utils.parseEther(ethAmount).toString());
        const tx = await BondingContract.createAndInitPurchase(newToken.name, newToken.symbol, {
          value: ethers.utils.parseEther(ethAmount)
        });
        hash = tx.hash;
        await tx.wait();
       

      } catch (error) {
        console.error("Error creating token:", error);
      }
    }else {
      setError("Name, Symbol and description are required.");
      console.log("Not present");
    }
  };
  

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    if (name === "x" || name === "tg") {
      setNewToken(prev => ({
        ...prev,
        social: { ...prev.social, [name]: value }
      }))
    } else {
      setNewToken(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setNewToken(prev => ({ ...prev, image: file }))
  }

 

  return (
    <motion.div layout transition={{ duration: 0.3 }}>
      <Card className="overflow-hidden border-green-700 bg-gradient-to-br from-green-950/80 to-black/90 backdrop-blur-sm shadow-lg shadow-green-900/20">
        <CardHeader className="bg-gradient-to-r from-green-900/50 to-green-800/30 pb-4">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold text-green-400">
              {isExpanded ? "Create New Token" : "Launch Your Token"}
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-green-400 hover:text-green-300 hover:bg-green-900/30"
            >
              {isExpanded ? "Minimize" : "Get Started"}
            </Button>
          </div>
          {!isExpanded && (
            <p className="text-green-300/80 mt-2">
              Create your own token in seconds and start accepting bids from the community.
            </p>
          )}
        </CardHeader>

        {isExpanded && (
          <CardContent className="p-6">
            <form onSubmit={handleNewToken} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Label htmlFor="name" className="text-green-400 font-medium">
                          Token Name
                        </Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-4 w-4 ml-1 text-green-400/70">
                                <Info className="h-3 w-3" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent className="bg-green-900 text-green-200 border-green-700">
                              <p>The full name of your token (e.g., "Ethereum")</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Input
                        id="name"
                        name="name"
                        value={newToken.name}
                        onChange={handleInputChange}
                        className="bg-green-900/30 border-green-700 text-white focus:border-green-500 focus:ring-green-500/20"
                        placeholder="e.g., Ethereum"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Label htmlFor="symbol" className="text-green-400 font-medium">
                          Token Symbol
                        </Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-4 w-4 ml-1 text-green-400/70">
                                <Info className="h-3 w-3" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent className="bg-green-900 text-green-200 border-green-700">
                              <p>The ticker symbol for your token (e.g., "ETH")</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Input
                        id="symbol"
                        name="symbol"
                        value={newToken.symbol}
                        onChange={handleInputChange}
                        className="bg-green-900/30 border-green-700 text-white focus:border-green-500 focus:ring-green-500/20"
                        placeholder="e.g., ETH"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-green-400 font-medium">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={newToken.description}
                      onChange={handleInputChange}
                      className="bg-green-900/30 border-green-700 text-white focus:border-green-500 focus:ring-green-500/20 min-h-[100px]"
                      placeholder="Describe your token and its purpose..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Label htmlFor="x" className="text-green-400 font-medium">
                          X Link (optional)
                        </Label>
                      </div>
                      <div className="relative">
                        <X className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500/50" />
                        <Input
                          id="x"
                          name="x"
                          value={newToken.social.x}
                          onChange={handleInputChange}
                          placeholder="https://x.com/username"
                          className="bg-green-900/30 border-green-700 text-white focus:border-green-500 focus:ring-green-500/20 pl-10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Label htmlFor="tg" className="text-green-400 font-medium">
                          Telegram Link (optional)
                        </Label>
                      </div>
                      <div className="relative">
                        <MessageCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500/50" />
                        <Input
                          id="tg"
                          name="tg"
                          value={newToken.social.tg}
                          onChange={handleInputChange}
                          placeholder="https://t.me/username"
                          className="bg-green-900/30 border-green-700 text-white focus:border-green-500 focus:ring-green-500/20 pl-10"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Label htmlFor="ethAmount" className="text-green-400 font-medium">
                        ETH Amount (optional)
                      </Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-4 w-4 ml-1 text-green-400/70">
                              <Info className="h-3 w-3" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent className="bg-green-900 text-green-200 border-green-700">
                            <p>Amount of ETH you want to contribute to your token's initial liquidity</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Input
                      id="ethAmount"
                      type="number"
                      name="ethAmount"
                      value={ethAmount}
                      onChange={(e) => setEthAmount(e.target.value)}
                      className="bg-green-900/30 border-green-700 text-white focus:border-green-500 focus:ring-green-500/20"
                      placeholder="0.1"
                      step="0.0000000001"
                      min="0"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="image" className="text-green-400 font-medium">
                      Token Logo
                    </Label>
                    <div className="flex flex-col items-center justify-center border-2 border-dashed border-green-700 rounded-lg p-6 bg-green-900/20 hover:bg-green-900/30 transition-colors cursor-pointer">
                      <input
                        id="image"
                        name="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <label
                        htmlFor="image"
                        className="cursor-pointer w-full h-full flex flex-col items-center justify-center"
                      >
                        {imagePreview ? (
                          <div className="relative">
                            <img
                              src={imagePreview || "/placeholder.svg"}
                              alt="Token preview"
                              className="w-32 h-32 object-cover rounded-full border-2 border-green-500"
                            />
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault()
                                setImagePreview(null)
                              }}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <>
                            <Upload className="h-12 w-12 text-green-500 mb-2" />
                            <p className="text-green-400 text-sm text-center">Drag & drop or click to upload</p>
                            <p className="text-green-500/70 text-xs mt-1 text-center">PNG, JPG or SVG (max 2MB)</p>
                          </>
                        )}
                      </label>
                    </div>
                  </div>

                  <div className="bg-green-900/30 rounded-lg p-4 border border-green-800">
                    <h3 className="text-green-400 font-medium flex items-center">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      Token Creation Fee
                    </h3>
                    <p className="text-green-300/80 text-sm mt-2">
                      A small fee of 0.01 ETH is required to create a new token. This helps prevent spam and supports
                      the platform.
                    </p>
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-900/30 border border-red-800 rounded-md p-3 text-red-400 text-sm">{error}</div>
              )}

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button type="submit" className="w-full relative overflow-hidden group">
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-green-400 to-emerald-300 transition-transform duration-300"></span>
                  <span className="relative text-black font-bold">Create Token</span>
                </Button>
              </motion.div>
            </form>
          </CardContent>
        )}
      </Card>
    </motion.div>
  )
}
