"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { X, MessageCircle } from "lucide-react";
import { HowItWorks } from "./how-it-works";
import Image from "next/image"; // Import Image component
import logo from "@/app/potdotbidLogo-removebg-preview.png"; // Import image

export function Header() {
  const [showHowItWorks, setShowHowItWorks] = useState(false);

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
            >
              Connect Wallet
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
