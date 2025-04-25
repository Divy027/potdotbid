"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { X, MessageCircle, ChevronDown, Menu} from "lucide-react";
import { HowItWorks } from "./how-it-works";
import Image from "next/image"; // Import Image component
import logo from "@/app/potdotbidLogo-removebg-preview.png"; // Import image
import { useAppKit, useAppKitAccount, useDisconnect } from '@reown/appkit/react'
import { formatWalletAddress } from "@/lib/utils";
import { ethers } from "ethers";
import { backend_url } from "@/config";
import { motion, AnimatePresence } from "framer-motion"

export function Header() {
  const [showHowItWorks, setShowHowItWorks] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
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
  }, [isConnected, address]);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-green-900/50 bg-black/80 backdrop-blur-md">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Left Section with Logo and Navigation */}
            <div className="flex items-center space-x-6">
              {/* Logo */}
              <Link href="/" className="flex items-center">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Image
                    src={logo} // Update with your actual logo path
                    alt="Potdotbid Logo"
                    width={50}
                    height={50}
                    className="object-contain"
                  />
                </motion.div>
                <span className="ml-2 text-xl font-bold text-green-400 hidden sm:inline-block">Pot.Bid</span>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center space-x-6">
                <Link href="/tokens" className="text-green-400 hover:text-green-300 transition-colors">
                  Explore Tokens
                </Link>
                <div className="relative group">
                  <button className="flex items-center text-green-400 hover:text-green-300 transition-colors">
                    Resources <ChevronDown className="ml-1 h-4 w-4" />
                  </button>
                  <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-green-900/90 backdrop-blur-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 border border-green-700">
                    <div className="py-1">
                      <Link href="/docs" className="block px-4 py-2 text-sm text-green-300 hover:bg-green-800/50">
                        Documentation
                      </Link>
                      <Link href="/faq" className="block px-4 py-2 text-sm text-green-300 hover:bg-green-800/50">
                        FAQ
                      </Link>
                      <button
                        onClick={() => setShowHowItWorks(true)}
                        className="w-full text-left block px-4 py-2 text-sm text-green-300 hover:bg-green-800/50"
                      >
                        How It Works
                      </button>
                    </div>
                  </div>
                </div>
              </nav>
            </div>

            {/* Right Section with Social Links and Connect Wallet */}
            <div className="flex items-center space-x-4">
              {/* Social Links */}
              <div className="hidden sm:flex items-center space-x-3">
                <Link
                  href="https://x.com/potdotbid"
                  target="_blank"
                  className="text-green-400 hover:text-green-300 transition-colors"
                >
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <X className="h-5 w-5" />
                  </motion.div>
                </Link>
                <Link
                  href="https://t.me/potdotbid"
                  target="_blank"
                  className="text-green-400 hover:text-green-300 transition-colors"
                >
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <MessageCircle className="h-5 w-5" />
                  </motion.div>
                </Link>
              </div>

              {/* Connect Wallet Button */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  className="relative overflow-hidden group border-green-500 text-green-400 hover:text-black"
                  onClick={() => open()}
                  disabled={isRegistering}
                >
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-green-400 to-emerald-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="relative">
                    {isRegistering
                      ? "Registering..."
                      : isConnected
                        ? formatWalletAddress(address || "")
                        : "Connect Wallet"}
                  </span>
                </Button>
              </motion.div>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-green-400"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-green-900/50 bg-black/90 backdrop-blur-md"
            >
              <div className="container mx-auto px-4 py-4 space-y-4">
                <Link
                  href="/tokens"
                  className="block text-green-400 hover:text-green-300 transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Explore Tokens
                </Link>
                <Link
                  href="/docs"
                  className="block text-green-400 hover:text-green-300 transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Documentation
                </Link>
                <Link
                  href="/faq"
                  className="block text-green-400 hover:text-green-300 transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  FAQ
                </Link>
                <button
                  onClick={() => {
                    setShowHowItWorks(true)
                    setIsMenuOpen(false)
                  }}
                  className="block text-green-400 hover:text-green-300 transition-colors py-2 w-full text-left"
                >
                  How It Works
                </button>
                <div className="flex space-x-4 py-2">
                  <Link
                    href="https://x.com/potdotbid"
                    target="_blank"
                    className="text-green-400 hover:text-green-300 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </Link>
                  <Link
                    href="https://t.me/potdotbid"
                    target="_blank"
                    className="text-green-400 hover:text-green-300 transition-colors"
                  >
                    <MessageCircle className="h-5 w-5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* How It Works Modal */}
      <AnimatePresence>
        {showHowItWorks && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50"
            onClick={() => setShowHowItWorks(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-4xl w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <HowItWorks onClose={() => setShowHowItWorks(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
