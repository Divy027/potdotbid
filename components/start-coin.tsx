"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function StartCoin() {
  return (
    <Card className="w-full max-w-md bg-gray-900/50">
      <CardContent className="pt-6">
        <form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Token Name</Label>
            <Input id="name" placeholder="Enter token name" className="bg-gray-800" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="symbol">Token Symbol</Label>
            <Input id="symbol" placeholder="Enter token symbol" className="bg-gray-800" />
          </div>
          <Button type="submit" className="w-full">
            Create Token
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

