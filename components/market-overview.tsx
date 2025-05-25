"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

export default function MarketOverview() {
  const [timeframe, setTimeframe] = useState("1d")

  // Mock data for market overview
  const marketData = {
    "1d": [
      { time: "9:15", nifty: 22100, vix: 12.5 },
      { time: "9:30", nifty: 22120, vix: 12.8 },
      { time: "9:45", nifty: 22115, vix: 13.1 },
      { time: "10:00", nifty: 22140, vix: 13.0 },
      { time: "10:15", nifty: 22160, vix: 12.9 },
      { time: "10:30", nifty: 22155, vix: 13.2 },
      { time: "10:45", nifty: 22170, vix: 13.5 },
      { time: "11:00", nifty: 22190, vix: 13.4 },
    ],
    "1w": [
      { time: "Mon", nifty: 22000, vix: 12.0 },
      { time: "Tue", nifty: 22050, vix: 12.3 },
      { time: "Wed", nifty: 22100, vix: 12.5 },
      { time: "Thu", nifty: 22150, vix: 13.0 },
      { time: "Fri", nifty: 22190, vix: 13.4 },
    ],
    "1m": [
      { time: "Week 1", nifty: 21800, vix: 11.5 },
      { time: "Week 2", nifty: 21900, vix: 12.0 },
      { time: "Week 3", nifty: 22050, vix: 12.5 },
      { time: "Week 4", nifty: 22190, vix: 13.4 },
    ],
  }

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 border border-slate-700 p-3 rounded-md shadow-lg">
          <p className="text-slate-300 font-medium">{`Time: ${label}`}</p>
          <p className="text-blue-400">{`Nifty: ${payload[0].value.toFixed(2)}`}</p>
          <p className="text-purple-400">{`VIX: ${payload[1].value.toFixed(2)}`}</p>
        </div>
      )
    }
    return null
  }

  // Market summary data
  const marketSummary = [
    { label: "Nifty", value: "22,190.50", change: "+0.41%", color: "#22c55e" },
    { label: "Bank Nifty", value: "48,120.75", change: "+0.28%", color: "#22c55e" },
    { label: "India VIX", value: "13.40", change: "+7.20%", color: "#ef4444" },
    { label: "PCR (Put-Call Ratio)", value: "1.25", change: "-0.05", color: "#f59e0b" },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {marketSummary.map((item, index) => (
          <Card key={index} className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <p className="text-xs font-medium text-slate-400">{item.label}</p>
              <p className="text-xl font-bold text-white mt-1">{item.value}</p>
              <p className="text-xs font-medium mt-1" style={{ color: item.color }}>
                {item.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-white">Market Performance</h3>
          <Tabs value={timeframe} onValueChange={setTimeframe} className="w-auto">
            <TabsList className="bg-slate-800/70 border border-slate-700">
              <TabsTrigger value="1d" className="data-[state=active]:bg-blue-600">
                1D
              </TabsTrigger>
              <TabsTrigger value="1w" className="data-[state=active]:bg-blue-600">
                1W
              </TabsTrigger>
              <TabsTrigger value="1m" className="data-[state=active]:bg-blue-600">
                1M
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={marketData[timeframe as keyof typeof marketData]}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="time" stroke="#94a3b8" />
              <YAxis yAxisId="left" stroke="#94a3b8" />
              <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="nifty"
                name="Nifty"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ r: 4, strokeWidth: 2, stroke: "#1d4ed8", fill: "#3b82f6" }}
                activeDot={{ r: 8, strokeWidth: 2, stroke: "#1d4ed8" }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="vix"
                name="VIX"
                stroke="#a855f7"
                strokeWidth={2}
                dot={{ r: 4, strokeWidth: 2, stroke: "#7e22ce", fill: "#a855f7" }}
                activeDot={{ r: 8, strokeWidth: 2, stroke: "#7e22ce" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
