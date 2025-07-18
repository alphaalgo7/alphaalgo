"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { X, Target, CheckCircle } from "lucide-react"
import type { GeneratedStrategyRow } from "@/lib/types"

interface PlanStrategySelectionModalProps {
  isOpen: boolean
  onClose: () => void
  configurations: GeneratedStrategyRow[]
  onSelectionChange: (selectedIds: string[]) => void
}

export default function PlanStrategySelectionModal({
  isOpen,
  onClose,
  configurations,
  onSelectionChange,
}: PlanStrategySelectionModalProps) {
  const [selectedStrategies, setSelectedStrategies] = useState<Set<string>>(new Set())

  if (!isOpen) return null

  // Group configurations by plan letter
  const groupedByPlan = configurations.reduce(
    (acc, config) => {
      if (!acc[config.planLetter]) {
        acc[config.planLetter] = []
      }
      acc[config.planLetter].push(config)
      return acc
    },
    {} as Record<string, GeneratedStrategyRow[]>,
  )

  const handleStrategyToggle = (strategyId: string) => {
    const newSelected = new Set(selectedStrategies)
    if (newSelected.has(strategyId)) {
      newSelected.delete(strategyId)
    } else {
      newSelected.add(strategyId)
    }
    setSelectedStrategies(newSelected)
  }

  const handlePlanToggle = (planLetter: string, selectAll: boolean) => {
    const planStrategies = groupedByPlan[planLetter]
    const newSelected = new Set(selectedStrategies)

    planStrategies.forEach((strategy) => {
      if (selectAll) {
        newSelected.add(strategy.id)
      } else {
        newSelected.delete(strategy.id)
      }
    })

    setSelectedStrategies(newSelected)
  }

  const handleApplySelection = () => {
    onSelectionChange(Array.from(selectedStrategies))
    onClose()
  }

  const isPlanFullySelected = (planLetter: string) => {
    const planStrategies = groupedByPlan[planLetter]
    return planStrategies.every((strategy) => selectedStrategies.has(strategy.id))
  }

  const isPlanPartiallySelected = (planLetter: string) => {
    const planStrategies = groupedByPlan[planLetter]
    return planStrategies.some((strategy) => selectedStrategies.has(strategy.id)) && !isPlanFullySelected(planLetter)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <CardHeader className="border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Target className="h-6 w-6 text-blue-600" />
              <CardTitle className="text-xl font-semibold text-slate-800 dark:text-slate-100">
                Select Strategies by Plan
              </CardTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="space-y-6">
            {Object.entries(groupedByPlan).map(([planLetter, strategies]) => (
              <div key={planLetter} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={isPlanFullySelected(planLetter)}
                      onCheckedChange={(checked) => handlePlanToggle(planLetter, checked as boolean)}
                      className={isPlanPartiallySelected(planLetter) ? "data-[state=checked]:bg-blue-600" : ""}
                    />
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Plan {planLetter}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {strategies.length} strategies
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {strategies.filter((s) => selectedStrategies.has(s.id)).length} selected
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handlePlanToggle(planLetter, true)}>
                      Select All
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handlePlanToggle(planLetter, false)}>
                      Deselect All
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {strategies.map((strategy) => (
                    <div
                      key={strategy.id}
                      className={`border rounded-lg p-3 cursor-pointer transition-all ${
                        selectedStrategies.has(strategy.id)
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                          : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                      }`}
                      onClick={() => handleStrategyToggle(strategy.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Checkbox
                              checked={selectedStrategies.has(strategy.id)}
                              onCheckedChange={() => handleStrategyToggle(strategy.id)}
                            />
                            <Badge variant="secondary" className="text-xs">
                              {strategy.strategyType}
                            </Badge>
                          </div>
                          <div className="space-y-1 text-xs">
                            <div className="flex justify-between">
                              <span className="text-slate-600 dark:text-slate-400">Trading Acc:</span>
                              <span className="text-slate-800 dark:text-slate-200">{strategy.tradingAcc}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600 dark:text-slate-400">Main Basket:</span>
                              <span className="text-slate-800 dark:text-slate-200">{strategy.mainBasket}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600 dark:text-slate-400">Max Profit:</span>
                              <span className="text-slate-800 dark:text-slate-200">{strategy.dayMaxProfit}</span>
                            </div>
                          </div>
                        </div>
                        {selectedStrategies.has(strategy.id) && (
                          <CheckCircle className="h-4 w-4 text-blue-600 flex-shrink-0" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>

        <div className="border-t border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-600 dark:text-slate-400">
              {selectedStrategies.size} of {configurations.length} strategies selected
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                onClick={handleApplySelection}
                disabled={selectedStrategies.size === 0}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Apply Selection ({selectedStrategies.size})
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
