"use client"
import { useState, useEffect } from "react"
import axios from "axios"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { TokenCard } from "@/components/token-card"
import { backend_url, BondingCurve } from "@/config"
import { useAppKitAccount, useAppKitProvider } from "@reown/appkit/react"
import { ethers } from "ethers"
import { toast } from "react-toastify"

interface Token {
  name: string
  symbol: string
  description: string
  image: File | null
  social: {
    x: string
    tg: string
  }
  price: string
  marketCap: string
  volume: string
  liquidity: string
  holders: number
  status: "bidding" | "completed"
}

export function TokenGrid() {
  const [tokens, setTokens] = useState<Token[]>([])
  const { isConnected} = useAppKitAccount()
  const { walletProvider } = useAppKitProvider('eip155')
  const [ethAmount, setEthAmount] = useState("0")
  const [error, setError] = useState("");
  
  const [newToken, setNewToken] = useState<Omit<Token, 'price' | 'marketCap' | 'volume' | 'liquidity' | 'holders' | 'status'>>({
    name: "",
    symbol: "",
    description: "",
    image: null,
    social: { x: "", tg: "" }
  })

  useEffect(() => {
    // Fetch all tokens on component mount
    async function fetchTokens() {
      try {
        const response = await axios.get(`${backend_url}/api/tokens/getAll`)
        if (response.data.success) {
          setTokens(response.data.tokens)
          console.log(response.data.tokens)
        }
      } catch (error) {
        console.error("Error fetching tokens:", error)
      }
    }

    fetchTokens()
  }, [])

  // const handleImageUploadurl = async (file: any) => {
  //   const formData = new FormData();
  //   formData.append("file", file);
  
  //   try {
  //     const response = await axios.post("https://freeimage.host/api/1/upload", formData, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //       }
  //     });
  
  //     if (response.data.success) {
  //       // The URL for the uploaded image
  //       const imageUrl = response.data.url;
  //       console.log('Image URL:', imageUrl);
  //       return imageUrl;
  
  //       // Now you can use the image URL for your backend or anywhere in your app
  //       // Example: send it to your backend with other form data
  //     }
  //   } catch (error) {
  //     console.error('Error uploading image:', error);
  //   }
  // };

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
                    const response = await axios.post(`${backend_url}/api/tokens/create`, tokenData, {
                        headers: {
                            "Content-Type": "application/json",
                            "x-auth-token": localStorage.getItem('token')
                        }
                    });

                    if (response.data.success) {
                        setTokens((prevTokens) => [...prevTokens, response.data.token]);
                        setNewToken({ name: "", symbol: "", description: "", image: null, social: { x: "", tg: "" } });
                        toast.success("TOKEN CREATE SUCCESSFULL")
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
                      setTokens((prevTokens) => [...prevTokens, response.data.token]);
                      setNewToken({ name: "", symbol: "", description: "", image: null, social: { x: "", tg: "" } });
                      toast.success("TOKEN CREATE SUCCESSFULL")
                      // Stop listening for the event after success
                     
                  }
              } catch (error) {
                  console.error("Error while posting to backend:", error);
              } finally {
                BondingContract.off("TokenPurchase", listener);
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

  const biddingTokens = tokens.filter(token => token.status === "bidding")
  const completedTokens = tokens.filter(token => token.status === "completed")

  return (
    <div className="space-y-8">
      <Card className="bg-green-900/20 border-green-400">
        <CardHeader>
          <CardTitle className="text-green-400">Create New Token</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleNewToken} className="space-y-4">
            <div className="grid grid-cols-4 gap-2">
              <div>
                <Label htmlFor="name" className="text-green-400">Token Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={newToken.name}
                  onChange={handleInputChange}
                  className="bg-green-900/30 border-green-400 text-white"
                />
              </div>
              <div>
                <Label htmlFor="symbol" className="text-green-400">Token Symbol</Label>
                <Input
                  id="symbol"
                  name="symbol"
                  value={newToken.symbol}
                  onChange={handleInputChange}
                  className="bg-green-900/30 border-green-400 text-white"
                />
              </div>
              <div>
              <Label htmlFor="description" className="text-green-400">Description</Label>
              <Input
                id="description"
                name="description"
                value={newToken.description}
                onChange={handleInputChange}
                className="bg-green-900/30 border-green-400 text-white"
              />
            </div>

            <div>
              <Label htmlFor="image" className="text-green-400">Upload Image</Label>
              <Input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="bg-green-900/30 border-green-400 text-white"
              />
            </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
            

            <div>
                <Label htmlFor="x" className="text-green-400">X  Link (optional)</Label>
                <Input
                  id="x"
                  name="x"
                  value={newToken.social.x}
                  onChange={handleInputChange}
                  placeholder="https://twitter.com/username"
                  className="bg-green-900/30 border-green-400 text-white"
                />
              </div>
              <div>
                <Label htmlFor="tg" className="text-green-400">Telegram Link (optional)</Label>
                <Input
                  id="tg"
                  name="tg"
                  value={newToken.social.tg}
                  onChange={handleInputChange}
                  placeholder="https://t.me/username"
                  className="bg-green-900/30 border-green-400 text-white"
                />
              </div>

              <div>
                <Label htmlFor="ethAmount" className="text-green-400">Eth Amount to buy new token (optional)</Label>
                <Input
                  id="ethAmount"
                  type="number"
                  name="ethAmount"
                  value={ethAmount}
                  onChange={(e)=>setEthAmount(e.target.value) }
                  className="bg-green-900/30 border-green-400 text-white"
                />
              </div>


            </div>
           
              
            
              <span className="text-red-600 mt-2"> {error}</span>
            <Button type="submit" className="w-full bg-green-400 text-black hover:bg-green-300">Create Token</Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="text-2xl font-bold mb-4 text-green-400">Bidding Tokens</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {biddingTokens.map((token, index) => (
              <TokenCard key={index} token={token} />
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4 text-green-400">Completed Tokens</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {completedTokens.map((token, index) => (
              <TokenCard key={index} token={token} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
