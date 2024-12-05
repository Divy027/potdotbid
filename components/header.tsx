"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { X, MessageCircle } from "lucide-react";
import { HowItWorks } from "./how-it-works";
import Image from "next/image"; // Import Image component
import logo from "@/app/potdotbidLogo-removebg-preview.png"; // Import image
import { useAppKit, useAppKitAccount, useDisconnect } from '@reown/appkit/react'
import { formatWalletAddress } from "@/lib/utils";
import { ethers } from "ethers";
import { backend_url } from "@/config";

export function Header() {
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const { open } = useAppKit();
  const {  isConnected,address } = useAppKitAccount();
  const {disconnect} = useDisconnect();
  const [isRegistering, setIsRegistering] = useState(false);

  // Automatically register user after wallet connection
  useEffect(() => {
    const registerUser = async () => {
      if (!address) return;

      try {
        const old_token = localStorage.getItem("token");
        console.log("OLD TOKEN",old_token)
        if (old_token) return;
        setIsRegistering(true);
       

       // Fetch a nonce from the backend
      const nonceResponse = await fetch(`${backend_url}/api/users/nonce`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress: address }),
      });

      if (!nonceResponse.ok) {
        disconnect();
        throw new Error("Failed to fetch nonce");
        
      }

      const { nonce } = await nonceResponse.json();

      // Request a signature from the user's wallet
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const signature = await signer.signMessage(nonce);

      // Send the signature and address to the backend for verification
      const verifyResponse = await fetch(`${backend_url}/api/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress: address, signature, nonce }),
      });

      if (!verifyResponse.ok) {
        disconnect()
        throw new Error("Verification failed");
      }

      const { token, user } = await verifyResponse.json();
      console.log("Registration successful:", user);
      localStorage.setItem("token", token);
    } catch (error) {
      disconnect();
      console.error("Error registering user:", error);
    } finally {
      setIsRegistering(false);
    }
    };

    if (isConnected) {
      registerUser();
    }else {
      console.log("REMOEV")
      localStorage.removeItem('token');
    }
  }, [isConnected, address, disconnect]);

  return (
    <>
      <header className="border-b border-green-900 bg-black/50 backdrop-blur-sm">
        <div className="container m-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Left Section with Logo, Icons, and How It Works */}
            <div className="flex items-center space-x-4">
              {/* Logo without space on left */}
              <Link href="/">
              <Image
                src={logo}
                alt="Potdotbid Logo"
                width={80} // Set the width
                height={80} // Set the height
                className="object-contain ml-0" // Removed margin left to align with the edge
              />
              </Link>
              
              {/* Icons */}
              <Link href="#" className="text-green-400 hover:text-green-300">
                <X className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-green-400 hover:text-green-300">
                <MessageCircle className="h-5 w-5" />
              </Link>

              {/* How It Works Button */}
              <button
                onClick={() => setShowHowItWorks(true)}
                className="text-green-400 hover:text-green-300 text-sm"
              >
                How It Works
              </button>
            </div>

            {/* Right Section with Connect Wallet Button */}
            
            <Button
              variant="outline"
              className="text-sm border-green-400 text-green-400 hover:bg-green-400 hover:text-black"
              onClick={() => open()}
              disabled={isRegistering} // Disable button while registering
            >
              {isRegistering
                ? "Registering..."
                : isConnected
                ? formatWalletAddress(address || "")
                : "Connect Wallet"}
            </Button>
          </div>
        </div>
      </header>

      {/* How It Works Popup */}
      {showHowItWorks && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="relative">
            <HowItWorks onClose={() => setShowHowItWorks(false)} />
          </div>
        </div>
      )}
    </>
  );
}
