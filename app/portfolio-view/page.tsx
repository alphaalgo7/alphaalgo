"use client"

import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, TrendingUp, TrendingDown, DollarSign, Target } from "lucide-react"
import Link from "next/link"

interface PortfolioEntry {
  id: string
  strategyTag: string
  planType: string
  status: "active" | "inactive" | "pending"
  currentPnL: number
  maxProfit: number
  maxLoss: number
  trades: number
}

export default function PortfolioViewPage() {
  const [portfolioData, setPortfolioData] = useState<PortfolioEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading portfolio data
    const timer = setTimeout(() => {
      setPortfolioData([
        {
          id: "1",
          strategyTag: "PLANA5J",
          planType: "A",
          status: "active",
          currentPnL: 1250.5,
          maxProfit: 29500,
          maxLoss: 1500,
          trades: 12,
        },
        {
          id: "2",
          strategyTag: "PLANB6B",
          planType: "B",
          status: "active",
          currentPnL: -450.25,
          maxProfit: 33000,
          maxLoss: 10000,
          trades: 8,
        },
        {
          id: "3",
          strategyTag: "PLANC7B",
          planType: "C",
          status: "inactive",
          currentPnL: 0,
          maxProfit: 46200,
          maxLoss: 14000,
          trades: 0,
        },
      ])
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const getPlanColor = (planType: string) => {
    switch (planType) {
      case "A":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "B":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "C":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "inactive":
        return "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200"
    }
  }

  const totalPnL = portfolioData.reduce((sum, entry) => sum + entry.currentPnL, 0)
  const activeTrades = portfolioData.filter((entry) => entry.status === "active").length
  const totalTrades = portfolioData.reduce((sum, entry) => sum + entry.trades, 0)

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-slate-950 py-6 sm:py-8">
        <main className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-300 dark:bg-slate-700 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-2/3 mb-8"></div>

            <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg p-6">
              <div className="h-6 bg-slate-300 dark:bg-slate-700 rounded w-1/4 mb-4"></div>
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-4 bg-slate-200 dark:bg-slate-800 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 py-6 sm:py-8">
      <main className="container mx-auto px-4">
        <header className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Link href="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Configuration
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Portfolio View</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Monitor your active trading strategies and performance.
          </p>
        </header>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total P&L</p>
                  <p className={`text-2xl font-bold ${totalPnL >= 0 ? "text-green-600" : "text-red-600"}`}>
                    ₹{totalPnL.toFixed(2)}
                  </p>
                </div>
                {totalPnL >= 0 ? (
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
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Active Strategies</p>
                  <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{activeTrades}</p>
                </div>
                <Target className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Trades</p>
                  <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{totalTrades}</p>
                </div>
                <DollarSign className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Strategies</p>
                  <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{portfolioData.length}</p>
                </div>
                <Target className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Portfolio Table */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-slate-800 dark:text-slate-200">
              Strategy Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="text-left py-3 px-4 font-medium text-slate-700 dark:text-slate-300">Strategy</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-700 dark:text-slate-300">Plan</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-700 dark:text-slate-300">Status</th>
                    <th className="text-right py-3 px-4 font-medium text-slate-700 dark:text-slate-300">Current P&L</th>
                    <th className="text-right py-3 px-4 font-medium text-slate-700 dark:text-slate-300">Max Profit</th>
                    <th className="text-right py-3 px-4 font-medium text-slate-700 dark:text-slate-300">Max Loss</th>
                    <th className="text-right py-3 px-4 font-medium text-slate-700 dark:text-slate-300">Trades</th>
                  </tr>
                </thead>
                <tbody>
                  {portfolioData.map((entry) => (
                    <tr
                      key={entry.id}
                      className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      <td className="py-3 px-4">
                        <span className="font-medium text-slate-800 dark:text-slate-200">{entry.strategyTag}</span>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={getPlanColor(entry.planType)}>Plan {entry.planType}</Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={getStatusColor(entry.status)}>
                          {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
                        </Badge>
                      </td>
                      <td
                        className={`py-3 px-4 text-right font-medium ${entry.currentPnL >= 0 ? "text-green-600" : "text-red-600"}`}
                      >
                        ₹{entry.currentPnL.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-right text-slate-600 dark:text-slate-400">
                        ₹{entry.maxProfit.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right text-slate-600 dark:text-slate-400">
                        ₹{entry.maxLoss.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right text-slate-600 dark:text-slate-400">{entry.trades}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
