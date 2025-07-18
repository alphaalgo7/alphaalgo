"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Search } from "lucide-react"
import type { StrategyConfigRow } from "@/lib/types"

interface PlanStrategySelectionModalProps {
  isOpen: boolean
  onClose: () => void
  strategyData: StrategyConfigRow[]
  onSelectionChange: (selectedStrategies: string[]) => void
}

export default function PlanStrategySelectionModal({
  isOpen,
  onClose,
  strategyData,
  onSelectionChange,
}: PlanStrategySelectionModalProps) {
  const [selectedStrategies, setSelectedStrategies] = useState<Set<string>>(new Set())
  const [searchTerm, setSearchTerm] = useState("")
  const [filterPlan, setFilterPlan] = useState<string>("all")

  useEffect(() => {
    onSelectionChange(Array.from(selectedStrategies))
  }, [selectedStrategies, onSelectionChange])

  if (!isOpen) return null

  const filteredStrategies = strategyData.filter((strategy) => {
    const matchesSearch = strategy.StrategyTag.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPlan = filterPlan === "all" || strategy.StrategyTag.includes(`PLAN${filterPlan}`)
    return matchesSearch && matchesPlan
  })

  const handleStrategyToggle = (strategyTag: string) => {
    const newSelected = new Set(selectedStrategies)
    if (newSelected.has(strategyTag)) {
      newSelected.delete(strategyTag)
    } else {
      newSelected.add(strategyTag)
    }
    setSelectedStrategies(newSelected)
  }

  const handleSelectAll = () => {
    const allTags = filteredStrategies.map((s) => s.StrategyTag)
    setSelectedStrategies(new Set(allTags))
  }

  const handleClearAll = () => {
    setSelectedStrategies(new Set())
  }

  const getPlanColor = (strategyTag: string) => {
    if (strategyTag.includes("PLANA")) return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
    if (strategyTag.includes("PLANB")) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    if (strategyTag.includes("PLANC")) return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
    return "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200"
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl font-semibold">Select Strategies</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Filter */}
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="search" className="text-sm font-medium">
                Search Strategies
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by strategy tag..."
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="filter" className="text-sm font-medium">
                Filter by Plan
              </Label>
              <select
                id="filter"
                value={filterPlan}
                onChange={(e) => setFilterPlan(e.target.value)}
                className="w-full h-10 px-3 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800"
              >
                <option value="all">All Plans</option>
                <option value="A">Plan A</option>
                <option value="B">Plan B</option>
                <option value="C">Plan C</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleSelectAll}>
              Select All ({filteredStrategies.length})
            </Button>
            <Button variant="outline" size="sm" onClick={handleClearAll}>
              Clear All
            </Button>
            <div className="ml-auto text-sm text-slate-600 dark:text-slate-400">{selectedStrategies.size} selected</div>
          </div>

          {/* Strategy List */}
          <div className="border border-slate-200 dark:border-slate-700 rounded-lg max-h-96 overflow-y-auto">
            {filteredStrategies.length === 0 ? (
              <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                No strategies found matching your criteria.
              </div>
            ) : (
              <div className="divide-y divide-slate-200 dark:divide-slate-700">
                {filteredStrategies.map((strategy) => (
                  <div
                    key={strategy.StrategyTag}
                    className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                    onClick={() => handleStrategyToggle(strategy.StrategyTag)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={selectedStrategies.has(strategy.StrategyTag)}
                          onChange={() => handleStrategyToggle(strategy.StrategyTag)}
                          className="h-4 w-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                        />
                        <div>
                          <Badge className={getPlanColor(strategy.StrategyTag)}>{strategy.StrategyTag}</Badge>
                          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            User: {strategy["User Account"]} | Max Profit: {strategy["Max Profit"]}
                          </div>
                        </div>
                      </div>
                      <div className="text-right text-xs text-slate-500 dark:text-slate-400">
                        <div>Enabled: {strategy.Enabled}</div>
                        <div>Trades: {strategy["Allowed Trades"]}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={onClose} className="bg-blue-600 hover:bg-blue-700 text-white">
              Apply Selection ({selectedStrategies.size})
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
