"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useLiveData } from "./live-data-provider"
import { calculateRiskFactor } from "@/lib/calculations"
import StraddlePremiumChart from "./charts/straddle-premium-chart"
import RiskFactorGauge from "./charts/risk-factor-gauge"
import ActionRecommendation from "./action-recommendation"
import { Activity, Wifi, WifiOff } from "lucide-react"

interface LiveDataPoint {
  time: string
  actualPremium: number
  expectedPremium: number
  rds: number
  ivScore: number
}

export default function LiveDashboard() {
  const { isConnected, tickData, optionChain, straddlePremium } = useLiveData()
  const [liveData, setLiveData] = useState<LiveDataPoint[]>([])
  const [riskFactor, setRiskFactor] = useState(0)

  // Convert live data to dashboard format
  useEffect(() => {
    if (isConnected && straddlePremium > 0) {
      const now = new Date()
      const timeString = now.toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      })

      // Calculate expected premium based on time decay
      const marketOpenTime = new Date()
      marketOpenTime.setHours(9, 15, 0, 0)
      const minutesElapsed = Math.max(0, (now.getTime() - marketOpenTime.getTime()) / (1000 * 60))

      // Simple theta decay model (this should be replaced with actual Greeks calculation)
      const decayFactor = Math.exp(-0.001 * minutesElapsed)
      const expectedPremium = straddlePremium * decayFactor

      // Calculate RDS
      const rds = (straddlePremium - expectedPremium) / expectedPremium

      // Simulate IV score (in real implementation, calculate from option prices)
      const ivScore = Math.random() * 0.1 - 0.05

      const newDataPoint: LiveDataPoint = {
        time: timeString,
        actualPremium: straddlePremium,
        expectedPremium,
        rds,
        ivScore,
      }

      setLiveData((prev) => {
        const updated = [...prev, newDataPoint]
        // Keep only last 50 data points
        return updated.slice(-50)
      })

      // Calculate risk factor
      const calculatedRiskFactor = calculateRiskFactor([newDataPoint])
      setRiskFactor(calculatedRiskFactor)
    }
  }, [isConnected, straddlePremium])

  if (!isConnected) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-8 text-center">
          <WifiOff className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-300 mb-2">No Live Data Connection</h3>
          <p className="text-slate-400">Connect to Zerodha API to see live market data</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <Card className="bg-green-900/20 border-green-700">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wifi className="h-5 w-5 text-green-400" />
              <span className="font-medium text-green-400">Live Data Connected</span>
              <Badge variant="outline" className="border-green-600 text-green-400">
                <Activity className="h-3 w-3 mr-1" />
                Real-time
              </Badge>
            </div>
            {tickData && (
              <div className="text-sm text-green-300">Last update: {tickData.timestamp.toLocaleTimeString()}</div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Live Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Live Straddle Premium</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-400">₹{straddlePremium.toFixed(2)}</div>
            <p className="text-sm text-slate-400 mt-1">ATM Straddle (Live)</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Risk Factor</CardTitle>
          </CardHeader>
          <CardContent>
            <RiskFactorGauge value={riskFactor} />
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Option Chain</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {optionChain.slice(0, 3).map((option, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-slate-400">{option.strike}</span>
                  <div className="flex gap-2">
                    <span className="text-green-400">C: ₹{option.call_ltp.toFixed(2)}</span>
                    <span className="text-red-400">P: ₹{option.put_ltp.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Live Charts */}
      {liveData.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle>Live Premium Chart</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <StraddlePremiumChart data={liveData} />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle>Live Action Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <ActionRecommendation riskFactor={riskFactor} />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
