"use client"

import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Card } from "@/components/ui/card"

const data = [
  { time: "00:00", price: 400 },
  { time: "04:00", price: 300 },
  { time: "08:00", price: 600 },
  { time: "12:00", price: 500 },
  { time: "16:00", price: 700 },
  { time: "20:00", price: 600 },
  { time: "24:00", price: 800 },
]

export function TokenChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
        <XAxis dataKey="time" stroke="#9ca3af" />
        <YAxis stroke="#9ca3af" />
        <Tooltip
          contentStyle={{
            backgroundColor: "#111827",
            border: "1px solid #374151",
          }}
        />
        <Line
          type="monotone"
          dataKey="price"
          stroke="#4ade80"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

