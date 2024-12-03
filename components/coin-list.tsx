"use client"

import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export function CoinList() {
  return (
    <div className="w-full">
      <div className="mb-4 flex items-center space-x-8">
        <div className="flex items-center space-x-2">
          <Label htmlFor="featured">sort: featured 🔥</Label>
          <Switch id="featured" />
        </div>
        <div className="flex items-center space-x-2">
          <Label htmlFor="nsfw">include nsfw:</Label>
          <Switch id="nsfw" />
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Token</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Market Cap</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">EXAMPLE</TableCell>
            <TableCell>0.001 ETH</TableCell>
            <TableCell>100K</TableCell>
            <TableCell>
              <span className="text-yellow-400">Bonding</span>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">TEST</TableCell>
            <TableCell>0.002 ETH</TableCell>
            <TableCell>50K</TableCell>
            <TableCell>
              <span className="text-red-400">Honeypot Active</span>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}

