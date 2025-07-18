"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Plus, Trash2, Copy, Search } from "lucide-react"
import type { StrategyConfigRow } from "@/lib/types"
import { toast } from "@/hooks/use-toast"

interface MultiLegPortfolioModalProps {
  isOpen: boolean
  onClose: () => void
  strategyData: StrategyConfigRow[]
  onSelectionChange: (
    entries: Array<{
      id: string
      displayName: string
      parentTag: string
      type: string
      subType?: string
      isCopied: boolean
    }>,
  ) => void
}

interface PortfolioEntry {
  id: string
  displayName: string
  parentTag: string
  type: string
  subType?: string
  isCopied: boolean
}

export default function MultiLegPortfolioModal({
  isOpen,
  onClose,
  strategyData,
  onSelectionChange,
}: MultiLegPortfolioModalProps) {
  const [portfolioEntries, setPortfolioEntries] = useState<PortfolioEntry[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [newEntryName, setNewEntryName] = useState("")
  const [selectedParentTag, setSelectedParentTag] = useState("")

  useEffect(() => {
    onSelectionChange(portfolioEntries)
  }, [portfolioEntries, onSelectionChange])

  if (!isOpen) return null

  const availableStrategies = strategyData.filter((strategy) =>
    strategy.StrategyTag.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const addPortfolioEntry = () => {
    if (!newEntryName.trim() || !selectedParentTag) {
      toast({
        title: "Missing Information",
        description: "Please provide both entry name and parent strategy.",
        variant: "destructive",
      })
      return
    }

    const newEntry: PortfolioEntry = {
      id: Date.now().toString(),
      displayName: newEntryName.trim(),
      parentTag: selectedParentTag,
      type: "manual",
      isCopied: false,
    }

    setPortfolioEntries([...portfolioEntries, newEntry])
    setNewEntryName("")
    setSelectedParentTag("")

    toast({
      title: "Entry Added",
      description: `"${newEntry.displayName}" has been added to the portfolio.`,
    })
  }

  const removeEntry = (id: string) => {
    setPortfolioEntries(portfolioEntries.filter((entry) => entry.id !== id))
    toast({
      title: "Entry Removed",
      description: "Portfolio entry has been removed.",
    })
  }

  const copyEntry = (entry: PortfolioEntry) => {
    const copiedEntry: PortfolioEntry = {
      ...entry,
      id: Date.now().toString(),
      displayName: `${entry.displayName} (Copy)`,
      isCopied: true,
    }

    setPortfolioEntries([...portfolioEntries, copiedEntry])
    toast({
      title: "Entry Copied",
      description: `"${copiedEntry.displayName}" has been created.`,
    })
  }

  const getPlanColor = (parentTag: string) => {
    if (parentTag.includes("PLANA")) return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
    if (parentTag.includes("PLANB")) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    if (parentTag.includes("PLANC")) return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
    return "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200"
  }

  const groupedEntries = portfolioEntries.reduce(
    (acc, entry) => {
      const planMatch = entry.parentTag.match(/PLAN([A-C])/i)
      const planType = planMatch ? planMatch[1].toUpperCase() : "OTHER"

      if (!acc[planType]) {
        acc[planType] = []
      }
      acc[planType].push(entry)
      return acc
    },
    {} as Record<string, PortfolioEntry[]>,
  )

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl font-semibold">Multi Leg Portfolio Manager</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Add New Entry Section */}
          <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 bg-slate-50 dark:bg-slate-800">
            <h3 className="font-medium mb-4">Add New Portfolio Entry</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="entryName" className="text-sm font-medium">
                  Entry Name
                </Label>
                <Input
                  id="entryName"
                  value={newEntryName}
                  onChange={(e) => setNewEntryName(e.target.value)}
                  placeholder="e.g., SENSEX Bull Spread"
                />
              </div>
              <div>
                <Label htmlFor="parentStrategy" className="text-sm font-medium">
                  Parent Strategy
                </Label>
                <select
                  id="parentStrategy"
                  value={selectedParentTag}
                  onChange={(e) => setSelectedParentTag(e.target.value)}
                  className="w-full h-10 px-3 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800"
                >
                  <option value="">Select a strategy...</option>
                  {strategyData.map((strategy) => (
                    <option key={strategy.StrategyTag} value={strategy.StrategyTag}>
                      {strategy.StrategyTag}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <Button onClick={addPortfolioEntry} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Entry
                </Button>
              </div>
            </div>
          </div>

          {/* Search */}
          <div>
            <Label htmlFor="search" className="text-sm font-medium">
              Search Strategies
            </Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search available strategies..."
                className="pl-10"
              />
            </div>
          </div>

          {/* Portfolio Entries */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Portfolio Entries ({portfolioEntries.length})</h3>
              {portfolioEntries.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setPortfolioEntries([])
                    toast({
                      title: "All Entries Cleared",
                      description: "Portfolio has been cleared.",
                    })
                  }}
                >
                  Clear All
                </Button>
              )}
            </div>

            {portfolioEntries.length === 0 ? (
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-8 text-center">
                <p className="text-slate-500 dark:text-slate-400">
                  No portfolio entries yet. Add some entries above to get started.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(groupedEntries).map(([planType, entries]) => (
                  <div key={planType} className="border border-slate-200 dark:border-slate-700 rounded-lg">
                    <div className="bg-slate-50 dark:bg-slate-800 px-4 py-2 border-b border-slate-200 dark:border-slate-700">
                      <h4 className="font-medium text-slate-700 dark:text-slate-300">
                        Plan {planType} ({entries.length} entries)
                      </h4>
                    </div>
                    <div className="divide-y divide-slate-200 dark:divide-slate-700">
                      {entries.map((entry) => (
                        <div key={entry.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div>
                                <div className="font-medium text-slate-800 dark:text-slate-200">
                                  {entry.displayName}
                                  {entry.isCopied && (
                                    <span className="ml-2 text-xs text-slate-500 dark:text-slate-400">(Copy)</span>
                                  )}
                                </div>
                                <div className="flex items-center space-x-2 mt-1">
                                  <Badge className={getPlanColor(entry.parentTag)} variant="secondary">
                                    {entry.parentTag}
                                  </Badge>
                                  <span className="text-xs text-slate-500 dark:text-slate-400">Type: {entry.type}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button variant="outline" size="sm" onClick={() => copyEntry(entry)} className="h-8 px-2">
                                <Copy className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => removeEntry(entry.id)}
                                className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Available Strategies */}
          {searchTerm && (
            <div className="space-y-2">
              <h3 className="font-medium">Available Strategies</h3>
              <div className="border border-slate-200 dark:border-slate-700 rounded-lg max-h-48 overflow-y-auto">
                {availableStrategies.length === 0 ? (
                  <div className="p-4 text-center text-slate-500 dark:text-slate-400">
                    No strategies found matching "{searchTerm}"
                  </div>
                ) : (
                  <div className="divide-y divide-slate-200 dark:divide-slate-700">
                    {availableStrategies.map((strategy) => (
                      <div
                        key={strategy.StrategyTag}
                        className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                        onClick={() => setSelectedParentTag(strategy.StrategyTag)}
                      >
                        <div className="flex items-center justify-between">
                          <Badge className={getPlanColor(strategy.StrategyTag)} variant="secondary">
                            {strategy.StrategyTag}
                          </Badge>
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            Max Profit: {strategy["Max Profit"]} | User: {strategy["User Account"]}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={onClose} className="bg-purple-600 hover:bg-purple-700 text-white">
              Apply Portfolio ({portfolioEntries.length} entries)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
