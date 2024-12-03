"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function HowItWorks() {
  return (
    <Card className="w-full max-w-xl bg-gray-900/50 text-gray-200">
      <CardHeader>
        <CardTitle className="text-center">how it works</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-center text-sm">
          potdotbid prevents rugs by implementing a unique honeypot mechanism. each coin on potdotbid is a{" "}
          <span className="text-green-400">fair-launch</span> with{" "}
          <span className="text-blue-400">no presale</span> and{" "}
          <span className="text-orange-400">no team allocation</span>.
        </p>
        <div className="space-y-2 text-sm">
          <p>step 1: pick a coin that you like</p>
          <p>step 2: buy the coin on the bonding curve</p>
          <p>step 3: wait for the bonding curve to complete</p>
          <p>step 4: random addresses will be selected for selling privileges</p>
          <p>step 5: selected addresses can sell their allocated percentage</p>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" variant="outline">
          [I&apos;m ready to bid]
        </Button>
      </CardFooter>
    </Card>
  )
}

