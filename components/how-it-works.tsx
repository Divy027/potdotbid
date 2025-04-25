"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface HowItWorksProps {
  onClose: () => void
}

export function HowItWorks({ onClose }: HowItWorksProps) {
  return (
    <motion.div layout transition={{ duration: 0.3 }}>
      <Card className="overflow-hidden border-green-700 bg-gradient-to-br from-green-950/80 to-black/90 backdrop-blur-sm shadow-lg shadow-green-900/20">
        <CardHeader className="bg-gradient-to-r from-green-900/50 to-green-800/30 pb-4">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold text-green-400">How Pot.Bid Works</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-green-400 hover:text-green-300 hover:bg-green-900/30"
            >
              Close
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-green-400">1. Token Creation</h3>
            <p className="text-green-300">
              Users can create their own tokens by providing a name, symbol, description, and optional social links.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-green-400">2. Bidding Phase</h3>
            <p className="text-green-300">
              Once a token is created, it enters a bidding phase where community members can place bids to acquire the
              token.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-green-400">3. Transparent Mechanics</h3>
            <p className="text-green-300">
              Pot.Bid operates with transparent mechanics, ensuring fair and open participation for all users.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-green-400">4. Community Governance</h3>
            <p className="text-green-300">
              The platform is governed by the community, allowing token holders to influence the direction and
              development of Pot.Bid.
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
