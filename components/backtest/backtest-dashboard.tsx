"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import BacktestForm from "./backtest-form"
import BacktestResults from "./backtest-results"
import BacktestService, { type BacktestParams, type BacktestResult } from "@/lib/backtest-service"
import { Loader2 } from "lucide-react"

export default function BacktestDashboard() {
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<BacktestResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const backtestService = new BacktestService()

  const handleRunBacktest = async (params: BacktestParams) => {
    setIsLoading(true)
    setError(null)

    try {
      // Add a small delay to simulate processing
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const results = await backtestService.runBacktest(params)
      setResults(results)
    } catch (err) {
      console.error("Backtest error:", err)
      setError("An error occurred while running the backtest. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <BacktestForm onRunBacktest={handleRunBacktest} isLoading={isLoading} />
        </div>

        <div className="lg:col-span-2">
          {isLoading ? (
            <Card className="bg-slate-800/50 border-slate-700 h-[400px] flex items-center justify-center">
              <CardContent>
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="h-12 w-12 text-blue-400 animate-spin" />
                  <p className="text-slate-300">Running backtest...</p>
                </div>
              </CardContent>
            </Card>
          ) : error ? (
            <Card className="bg-red-900/20 border-red-700">
              <CardContent className="p-6">
                <p className="text-red-400">{error}</p>
              </CardContent>
            </Card>
          ) : !results ? (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle>Backtest Results</CardTitle>
              </CardHeader>
              <CardContent className="p-6 text-center">
                <p className="text-slate-400">Configure and run a backtest to see results</p>
              </CardContent>
            </Card>
          ) : (
            <BacktestResults results={results} />
          )}
        </div>
      </div>
    </div>
  )
}
