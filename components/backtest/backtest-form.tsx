"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import type { BacktestParams } from "@/lib/backtest-service"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface BacktestFormProps {
  onRunBacktest: (params: BacktestParams) => void
  isLoading: boolean
}

export default function BacktestForm({ onRunBacktest, isLoading }: BacktestFormProps) {
  const [symbol, setSymbol] = useState("NIFTY")
  const [fromDate, setFromDate] = useState<Date | undefined>(new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)) // 90 days ago
  const [toDate, setToDate] = useState<Date | undefined>(new Date())
  const [timeFrame, setTimeFrame] = useState("day")
  const [strategy, setStrategy] = useState<"reverseDecay" | "ivSpike" | "combined">("reverseDecay")
  const [entryThreshold, setEntryThreshold] = useState(0.05) // 5%
  const [exitThreshold, setExitThreshold] = useState(0.02) // 2%
  const [stopLoss, setStopLoss] = useState(5) // 5%
  const [targetProfit, setTargetProfit] = useState(10) // 10%

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!fromDate || !toDate) {
      alert("Please select valid date range")
      return
    }

    onRunBacktest({
      symbol,
      fromDate: fromDate.toISOString().split("T")[0],
      toDate: toDate.toISOString().split("T")[0],
      timeFrame,
      strategy,
      entryThreshold,
      exitThreshold,
      stopLoss,
      targetProfit,
    })
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle>Backtest Configuration</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="symbol">Symbol</Label>
              <Select value={symbol} onValueChange={setSymbol}>
                <SelectTrigger id="symbol" className="bg-slate-900 border-slate-700">
                  <SelectValue placeholder="Select Symbol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NIFTY">NIFTY</SelectItem>
                  <SelectItem value="BANKNIFTY">BANKNIFTY</SelectItem>
                  <SelectItem value="FINNIFTY">FINNIFTY</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeFrame">Time Frame</Label>
              <Select value={timeFrame} onValueChange={setTimeFrame}>
                <SelectTrigger id="timeFrame" className="bg-slate-900 border-slate-700">
                  <SelectValue placeholder="Select Time Frame" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="minute">1 Minute</SelectItem>
                  <SelectItem value="5minute">5 Minutes</SelectItem>
                  <SelectItem value="15minute">15 Minutes</SelectItem>
                  <SelectItem value="30minute">30 Minutes</SelectItem>
                  <SelectItem value="60minute">1 Hour</SelectItem>
                  <SelectItem value="day">1 Day</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>From Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal bg-slate-900 border-slate-700",
                      !fromDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {fromDate ? format(fromDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={fromDate} onSelect={setFromDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>To Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal bg-slate-900 border-slate-700",
                      !toDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {toDate ? format(toDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={toDate} onSelect={setToDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="strategy">Strategy</Label>
            <Select value={strategy} onValueChange={(value: any) => setStrategy(value)}>
              <SelectTrigger id="strategy" className="bg-slate-900 border-slate-700">
                <SelectValue placeholder="Select Strategy" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="reverseDecay">Reverse Decay</SelectItem>
                <SelectItem value="ivSpike">IV Spike</SelectItem>
                <SelectItem value="combined">Combined Strategy</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="entryThreshold">Entry Threshold: {(entryThreshold * 100).toFixed(1)}%</Label>
              </div>
              <Slider
                id="entryThreshold"
                min={0.01}
                max={0.2}
                step={0.01}
                value={[entryThreshold]}
                onValueChange={(value) => setEntryThreshold(value[0])}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="exitThreshold">Exit Threshold: {(exitThreshold * 100).toFixed(1)}%</Label>
              </div>
              <Slider
                id="exitThreshold"
                min={0.01}
                max={0.1}
                step={0.01}
                value={[exitThreshold]}
                onValueChange={(value) => setExitThreshold(value[0])}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="stopLoss">Stop Loss (%)</Label>
                <Input
                  id="stopLoss"
                  type="number"
                  min={1}
                  max={20}
                  value={stopLoss}
                  onChange={(e) => setStopLoss(Number(e.target.value))}
                  className="bg-slate-900 border-slate-700"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetProfit">Target Profit (%)</Label>
                <Input
                  id="targetProfit"
                  type="number"
                  min={1}
                  max={50}
                  value={targetProfit}
                  onChange={(e) => setTargetProfit(Number(e.target.value))}
                  className="bg-slate-900 border-slate-700"
                />
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
            {isLoading ? "Running Backtest..." : "Run Backtest"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
