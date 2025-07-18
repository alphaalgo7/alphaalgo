"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, TrendingUp, Plus, Minus, BarChart3 } from "lucide-react"
import type { GeneratedStrategyRow } from "@/lib/types"

interface MultiLegPortfolioModalProps {
  isOpen: boolean
  onClose: () => void
  configurations: GeneratedStrategyRow[]
  stoxxoNumber: string
  instrument: string
}

interface PortfolioLeg {
  id: string
  strategy: GeneratedStrategyRow
  allocation: number
  quantity: number
}

export default function MultiLegPortfolioModal({
  isOpen,
  onClose,
  configurations,
  stoxxoNumber,
  instrument,
}: MultiLegPortfolioModalProps) {
  const [portfolioLegs, setPortfolioLegs] = useState<PortfolioLeg[]>([])
  const [portfolioName, setPortfolioName] = useState("")
  const [totalCapital, setTotalCapital] = useState<number>(1000000)

  if (!isOpen) return null

  const selectedConfigs = configurations.filter((config) => config.selected)

  const addLeg = (strategy: GeneratedStrategyRow) => {
    const newLeg: PortfolioLeg = {
      id: `leg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      strategy,
      allocation: 0,
      quantity: 1,
    }
    setPortfolioLegs([...portfolioLegs, newLeg])
  }

  const removeLeg = (legId: string) => {
    setPortfolioLegs(portfolioLegs.filter((leg) => leg.id !== legId))
  }

  const updateLegAllocation = (legId: string, allocation: number) => {
    setPortfolioLegs(
      portfolioLegs.map((leg) =>
        leg.id === legId ? { ...leg, allocation: Math.max(0, Math.min(100, allocation)) } : leg,
      ),
    )
  }

  const updateLegQuantity = (legId: string, quantity: number) => {
    setPortfolioLegs(portfolioLegs.map((leg) => (leg.id === legId ? { ...leg, quantity: Math.max(1, quantity) } : leg)))
  }

  const totalAllocation = portfolioLegs.reduce((sum, leg) => sum + leg.allocation, 0)
  const remainingAllocation = 100 - totalAllocation

  const autoBalanceAllocations = () => {
    if (portfolioLegs.length === 0) return

    const equalAllocation = 100 / portfolioLegs.length
    setPortfolioLegs(
      portfolioLegs.map((leg) => ({
        ...leg,
        allocation: Math.round(equalAllocation * 100) / 100,
      })),
    )
  }

  const calculateLegCapital = (allocation: number) => {
    return (totalCapital * allocation) / 100
  }

  const handleCreatePortfolio = () => {
    if (portfolioLegs.length === 0 || !portfolioName.trim()) return

    const portfolioData = {
      name: portfolioName,
      totalCapital,
      legs: portfolioLegs.map((leg) => ({
        strategy: leg.strategy,
        allocation: leg.allocation,
        quantity: leg.quantity,
        capital: calculateLegCapital(leg.allocation),
      })),
      stoxxoNumber,
      instrument,
      createdAt: new Date().toISOString(),
    }

    console.log("Creating multi-leg portfolio:", portfolioData)

    // Here you would typically save the portfolio
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-6xl max-h-[95vh] overflow-hidden">
        <CardHeader className="border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BarChart3 className="h-6 w-6 text-purple-600" />
              <CardTitle className="text-xl font-semibold text-slate-800 dark:text-slate-100">
                Multi-Leg Portfolio Builder
              </CardTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6 overflow-y-auto max-h-[calc(95vh-200px)]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Available Strategies */}
            <div className="lg:col-span-1">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">
                Available Strategies ({selectedConfigs.length})
              </h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {selectedConfigs.map((config) => (
                  <div key={config.id} className="border border-slate-200 dark:border-slate-700 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="text-xs">
                        {config.planLetter}-{config.strategyType}
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => addLeg(config)}
                        disabled={portfolioLegs.some((leg) => leg.strategy.id === config.id)}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Add
                      </Button>
                    </div>
                    <div className="text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">Trading Acc:</span>
                        <span className="text-slate-800 dark:text-slate-200">{config.tradingAcc}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">Main Basket:</span>
                        <span className="text-slate-800 dark:text-slate-200">{config.mainBasket}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Portfolio Configuration */}
            <div className="lg:col-span-2">
              <div className="space-y-6">
                {/* Portfolio Settings */}
                <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">Portfolio Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="portfolioName" className="text-sm font-medium">
                        Portfolio Name
                      </Label>
                      <Input
                        id="portfolioName"
                        value={portfolioName}
                        onChange={(e) => setPortfolioName(e.target.value)}
                        placeholder="e.g., Balanced Multi-Strategy Portfolio"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="totalCapital" className="text-sm font-medium">
                        Total Capital (₹)
                      </Label>
                      <Input
                        id="totalCapital"
                        type="number"
                        value={totalCapital}
                        onChange={(e) => setTotalCapital(Number(e.target.value))}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                {/* Portfolio Legs */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                      Portfolio Legs ({portfolioLegs.length})
                    </h3>
                    <div className="flex items-center gap-2">
                      <Badge variant={totalAllocation === 100 ? "default" : "destructive"} className="text-xs">
                        {totalAllocation}% allocated
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={autoBalanceAllocations}
                        disabled={portfolioLegs.length === 0}
                      >
                        Auto Balance
                      </Button>
                    </div>
                  </div>

                  {portfolioLegs.length === 0 ? (
                    <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-8 text-center">
                      <TrendingUp className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-500 dark:text-slate-400">
                        Add strategies from the left panel to build your portfolio
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {portfolioLegs.map((leg, index) => (
                        <div key={leg.id} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-slate-800 dark:text-slate-100">
                                Leg {index + 1}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {leg.strategy.planLetter}-{leg.strategy.strategyType}
                              </Badge>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeLeg(leg.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <Label className="text-xs font-medium text-slate-600 dark:text-slate-400">
                                Allocation (%)
                              </Label>
                              <Input
                                type="number"
                                value={leg.allocation}
                                onChange={(e) => updateLegAllocation(leg.id, Number(e.target.value))}
                                min="0"
                                max="100"
                                step="0.1"
                                className="mt-1 h-8 text-sm"
                              />
                            </div>
                            <div>
                              <Label className="text-xs font-medium text-slate-600 dark:text-slate-400">Quantity</Label>
                              <Input
                                type="number"
                                value={leg.quantity}
                                onChange={(e) => updateLegQuantity(leg.id, Number(e.target.value))}
                                min="1"
                                className="mt-1 h-8 text-sm"
                              />
                            </div>
                            <div>
                              <Label className="text-xs font-medium text-slate-600 dark:text-slate-400">
                                Capital Allocated
                              </Label>
                              <div className="mt-1 h-8 px-3 bg-slate-100 dark:bg-slate-700 rounded border flex items-center text-sm">
                                ₹{calculateLegCapital(leg.allocation).toLocaleString()}
                              </div>
                            </div>
                          </div>

                          <div className="mt-3 text-xs text-slate-600 dark:text-slate-400 grid grid-cols-2 gap-4">
                            <div>Trading Acc: {leg.strategy.tradingAcc}</div>
                            <div>Main Basket: {leg.strategy.mainBasket}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Portfolio Summary */}
                {portfolioLegs.length > 0 && (
                  <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-3">Portfolio Summary</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-slate-600 dark:text-slate-400">Total Legs:</span>
                        <div className="font-semibold text-slate-800 dark:text-slate-100">{portfolioLegs.length}</div>
                      </div>
                      <div>
                        <span className="text-slate-600 dark:text-slate-400">Total Allocation:</span>
                        <div className={`font-semibold ${totalAllocation === 100 ? "text-green-600" : "text-red-600"}`}>
                          {totalAllocation}%
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-600 dark:text-slate-400">Remaining:</span>
                        <div className="font-semibold text-slate-800 dark:text-slate-100">{remainingAllocation}%</div>
                      </div>
                      <div>
                        <span className="text-slate-600 dark:text-slate-400">Total Capital:</span>
                        <div className="font-semibold text-slate-800 dark:text-slate-100">
                          ₹{totalCapital.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>

        <div className="border-t border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-600 dark:text-slate-400">
              {portfolioLegs.length} legs configured • {totalAllocation}% allocated
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                onClick={handleCreatePortfolio}
                disabled={portfolioLegs.length === 0 || !portfolioName.trim() || totalAllocation !== 100}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                Create Portfolio
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
