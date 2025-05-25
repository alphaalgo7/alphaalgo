"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { generateMockData } from "@/lib/mock-data"
import { calculateRiskFactor } from "@/lib/calculations"
import { RefreshCw, ChevronDown, Bell, Settings, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { motion } from "framer-motion"

import Header from "./header"
import StraddlePremiumChart from "./charts/straddle-premium-chart"
import ReverseDecayScoreChart from "./charts/reverse-decay-score-chart"
import IVSpikeChart from "./charts/iv-spike-chart"
import RiskFactorGauge from "./charts/risk-factor-gauge"
import ActionRecommendation from "./action-recommendation"
import DataTable from "./data-table"
import MetricsGrid from "./metrics-grid"
import TradingSignals from "./trading-signals"
import MarketOverview from "./market-overview"
import { LiveDataProvider } from "./live-data-provider"
import ZerodhaAuth from "./zerodha-auth"
import LiveDashboard from "./live-dashboard"
import BacktestDashboard from "./backtest/backtest-dashboard"
import CoreLogicDocs from "./core-logic-docs"

export default function Dashboard() {
  const [data, setData] = useState(() => generateMockData())
  const [riskFactor, setRiskFactor] = useState(0)
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [isLoading, setIsLoading] = useState(false)
  const [timeframe, setTimeframe] = useState("today")

  useEffect(() => {
    // Calculate risk factor based on the data
    const calculatedRiskFactor = calculateRiskFactor(data)
    setRiskFactor(calculatedRiskFactor)
  }, [data])

  const refreshData = () => {
    setIsLoading(true)
    // Simulate loading
    setTimeout(() => {
      setData(generateMockData())
      setLastUpdated(new Date())
      setIsLoading(false)
    }, 800)
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      <Header />

      <main className="container mx-auto py-6 px-4 lg:px-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Reverse Decay Detection System
            </h1>
            <p className="text-slate-400 mt-1">Advanced analytics for quantitative options trading</p>
          </div>

          <div className="flex items-center gap-3 self-end">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" className="border-slate-700 text-slate-400 hover:text-white">
                    <Bell className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Notifications</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" className="border-slate-700 text-slate-400 hover:text-white">
                    <Settings className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Settings</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-slate-700 text-slate-200">
                  {timeframe === "today" ? "Today" : timeframe === "week" ? "This Week" : "This Month"}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setTimeframe("today")}>Today</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTimeframe("week")}>This Week</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTimeframe("month")}>This Month</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button onClick={refreshData} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white">
              <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
          <motion.div
            className="lg:col-span-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm overflow-hidden">
              <CardContent className="p-0">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h2 className="text-xl font-bold text-white">Risk Factor Analysis</h2>
                      <p className="text-slate-400 text-sm">Last updated: {lastUpdated.toLocaleTimeString()}</p>
                    </div>
                    <Badge
                      variant={riskFactor < 30 ? "outline" : riskFactor < 60 ? "secondary" : "destructive"}
                      className="text-sm py-1"
                    >
                      {riskFactor < 30 ? "Low Risk" : riskFactor < 60 ? "Moderate Risk" : "High Risk"}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <RiskFactorGauge value={riskFactor} />
                    </div>
                    <div className="flex flex-col justify-center">
                      <ActionRecommendation riskFactor={riskFactor} />
                    </div>
                  </div>
                </div>

                <Separator className="bg-slate-700/50" />

                <div className="p-6">
                  <h3 className="text-lg font-medium mb-4 text-slate-200">ATM Straddle Premium (9:15 - 9:25 AM)</h3>
                  <div className="h-[300px]">
                    <StraddlePremiumChart data={data} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            className="lg:col-span-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="grid grid-cols-1 gap-6">
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-white">Key Metrics</h2>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                            <Info className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            These metrics show the current state of the options market and reverse decay indicators.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <MetricsGrid data={data} />
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-white mb-4">Trading Signals</h2>
                  <TradingSignals riskFactor={riskFactor} />
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Tabs defaultValue="premium" className="w-full">
            <div className="flex justify-between items-center mb-4">
              <TabsList className="bg-slate-800/70 border border-slate-700">
                <TabsTrigger value="premium" className="data-[state=active]:bg-blue-600">
                  Premium Analysis
                </TabsTrigger>
                <TabsTrigger value="rds" className="data-[state=active]:bg-blue-600">
                  Reverse Decay
                </TabsTrigger>
                <TabsTrigger value="iv" className="data-[state=active]:bg-blue-600">
                  IV Analysis
                </TabsTrigger>
                <TabsTrigger value="market" className="data-[state=active]:bg-blue-600">
                  Market Overview
                </TabsTrigger>
                <TabsTrigger value="data" className="data-[state=active]:bg-blue-600">
                  Raw Data
                </TabsTrigger>
                <TabsTrigger value="live" className="data-[state=active]:bg-blue-600">
                  Live Data
                </TabsTrigger>
                <TabsTrigger value="backtest" className="data-[state=active]:bg-blue-600">
                  Backtesting
                </TabsTrigger>
                <TabsTrigger value="core-logic" className="data-[state=active]:bg-blue-600">
                  Core Logic
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="premium" className="mt-0">
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-white mb-4">Premium Analysis</h2>
                  <p className="text-slate-400 mb-6">
                    Detailed analysis of ATM straddle premium behavior compared to expected decay patterns.
                  </p>
                  <div className="h-[400px]">
                    <StraddlePremiumChart data={data} advanced={true} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="rds" className="mt-0">
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-white mb-4">Reverse Decay Score Timeline</h2>
                  <p className="text-slate-400 mb-6">
                    Visualization of the Reverse Decay Score (RDS) over time with key threshold indicators.
                  </p>
                  <div className="h-[400px]">
                    <ReverseDecayScoreChart data={data} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="iv" className="mt-0">
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-white mb-4">IV Spike Confirmation</h2>
                  <p className="text-slate-400 mb-6">
                    Analysis of implied volatility changes that confirm reverse decay patterns.
                  </p>
                  <div className="h-[400px]">
                    <IVSpikeChart data={data} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="market" className="mt-0">
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-white mb-4">Market Overview</h2>
                  <p className="text-slate-400 mb-6">
                    Broader market context and indicators related to volatility and price action.
                  </p>
                  <MarketOverview />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="data" className="mt-0">
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-white mb-4">Raw Data</h2>
                  <p className="text-slate-400 mb-6">Detailed numerical data for all metrics and calculations.</p>
                  <DataTable data={data} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="live" className="mt-0">
              <LiveDataProvider>
                <div className="space-y-6">
                  <ZerodhaAuth />
                  <LiveDashboard />
                </div>
              </LiveDataProvider>
            </TabsContent>
            <TabsContent value="backtest" className="mt-0">
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-white mb-4">Strategy Backtesting</h2>
                  <p className="text-slate-400 mb-6">
                    Test your reverse decay detection strategies against historical data to validate performance.
                  </p>
                  <BacktestDashboard />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="core-logic" className="mt-0">
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardContent className="p-6">
                  <CoreLogicDocs />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
    </div>
  )
}
