"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, TrendingUp, TrendingDown, DollarSign, Target } from "lucide-react"
import Link from "next/link"

interface PortfolioData {
  totalValue: number
  dailyPnL: number
  totalPositions: number
  activeStrategies: number
  topPerformers: Array<{
    strategy: string
    pnl: number
    percentage: number
  }>
  recentTrades: Array<{
    id: string
    strategy: string
    instrument: string
    type: "BUY" | "SELL"
    quantity: number
    price: number
    timestamp: string
  }>
}

export default function PortfolioView() {
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    const fetchPortfolioData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setPortfolioData({
        totalValue: 1250000,
        dailyPnL: 15750,
        totalPositions: 24,
        activeStrategies: 8,
        topPerformers: [
          { strategy: "PLANA-SENSEX0DTE", pnl: 8500, percentage: 12.5 },
          { strategy: "PLANB-NIFTY1DTE", pnl: 6200, percentage: 9.8 },
          { strategy: "PLANC-SENSEX1DTE", pnl: 4100, percentage: 7.2 },
        ],
        recentTrades: [
          {
            id: "1",
            strategy: "PLANA-SENSEX0DTE",
            instrument: "SENSEX",
            type: "BUY",
            quantity: 50,
            price: 72500,
            timestamp: "2024-01-15T10:30:00Z",
          },
          {
            id: "2",
            strategy: "PLANB-NIFTY1DTE",
            instrument: "NIFTY",
            type: "SELL",
            quantity: 75,
            price: 21800,
            timestamp: "2024-01-15T10:15:00Z",
          },
        ],
      })
      setLoading(false)
    }

    fetchPortfolioData()
  }, [])

  if (loading || !portfolioData) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading portfolio data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Configuration
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Portfolio Overview</h1>
              <p className="text-slate-600 dark:text-slate-400">Real-time portfolio performance and analytics</p>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Portfolio Value</p>
                  <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                    ₹{portfolioData.totalValue.toLocaleString()}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Daily P&L</p>
                  <p
                    className={`text-2xl font-bold ${portfolioData.dailyPnL >= 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    {portfolioData.dailyPnL >= 0 ? "+" : ""}₹{portfolioData.dailyPnL.toLocaleString()}
                  </p>
                </div>
                {portfolioData.dailyPnL >= 0 ? (
                  <TrendingUp className="h-8 w-8 text-green-600" />
                ) : (
                  <TrendingDown className="h-8 w-8 text-red-600" />
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Active Positions</p>
                  <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                    {portfolioData.totalPositions}
                  </p>
                </div>
                <Target className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Active Strategies</p>
                  <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                    {portfolioData.activeStrategies}
                  </p>
                </div>
                <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-bold text-sm">{portfolioData.activeStrategies}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Performers and Recent Trades */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Performers */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                Top Performing Strategies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {portfolioData.topPerformers.map((performer, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 font-bold text-sm">#{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium text-slate-800 dark:text-slate-100">{performer.strategy}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">+{performer.percentage}%</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">+₹{performer.pnl.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Trades */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-100">Recent Trades</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {portfolioData.recentTrades.map((trade) => (
                  <div
                    key={trade.id}
                    className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Badge variant={trade.type === "BUY" ? "default" : "secondary"} className="text-xs">
                        {trade.type}
                      </Badge>
                      <div>
                        <p className="font-medium text-slate-800 dark:text-slate-100">{trade.strategy}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {trade.quantity} × ₹{trade.price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {new Date(trade.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
