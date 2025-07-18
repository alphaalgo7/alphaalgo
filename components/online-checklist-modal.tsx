"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { X, Download, Search, CheckCircle, FileSpreadsheet, Users, Target } from "lucide-react"
import type { StrategyConfigRow } from "@/lib/types"

interface OnlineChecklistModalProps {
  isOpen: boolean
  onClose: () => void
  strategyData: StrategyConfigRow[]
  selectedPortfolioEntries: Array<{
    id: string
    displayName: string
    parentTag: string
    type: string
    subType?: string
    isCopied: boolean
  }>
  stoxxoNumber: string
  instrument: string
}

interface StrategyTag {
  id: string
  name: string
  color: string
  strategies: string[]
}

export default function OnlineChecklistModal({
  isOpen,
  onClose,
  strategyData,
  selectedPortfolioEntries,
  stoxxoNumber,
  instrument,
}: OnlineChecklistModalProps) {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set())
  const [searchTerm, setSearchTerm] = useState("")
  const [filterPlan, setFilterPlan] = useState<string>("all")
  const [filterStrategy, setFilterStrategy] = useState<string>("all")
  const [tags, setTags] = useState<StrategyTag[]>([
    { id: "1", name: "High Priority", color: "bg-red-500", strategies: [] },
    { id: "2", name: "Conservative", color: "bg-green-500", strategies: [] },
    { id: "3", name: "Aggressive", color: "bg-orange-500", strategies: [] },
  ])

  const filteredConfigurations = useMemo(() => {
    return strategyData.filter((config) => {
      const matchesSearch =
        searchTerm === "" ||
        Object.values(config).some((value) => String(value).toLowerCase().includes(searchTerm.toLowerCase()))
      const strategyTag = config.StrategyTag || ""
      const planMatch = strategyTag.match(/PLAN([A-Z])/i)
      const planLetter = planMatch ? planMatch[1] : ""

      const matchesPlan = filterPlan === "all" || planLetter === filterPlan
      const matchesStrategy = filterStrategy === "all" || strategyTag.includes(filterStrategy)

      return matchesSearch && matchesPlan && matchesStrategy
    })
  }, [strategyData, searchTerm, filterPlan, filterStrategy])

  const uniquePlans = Array.from(
    new Set(
      strategyData
        .map((c) => {
          const strategyTag = c.StrategyTag || ""
          const planMatch = strategyTag.match(/PLAN([A-Z])/i)
          return planMatch ? planMatch[1] : ""
        })
        .filter(Boolean),
    ),
  ).sort()

  const uniqueStrategies = Array.from(new Set(strategyData.map((c) => c.StrategyTag || "").filter(Boolean))).sort()

  const handleItemCheck = (itemId: string) => {
    const newChecked = new Set(checkedItems)
    if (newChecked.has(itemId)) {
      newChecked.delete(itemId)
    } else {
      newChecked.add(itemId)
    }
    setCheckedItems(newChecked)
  }

  const handleBulkAction = (action: "check" | "uncheck") => {
    if (action === "check") {
      setCheckedItems(new Set(filteredConfigurations.map((c, index) => `strategy-${index}`)))
    } else {
      setCheckedItems(new Set())
    }
  }

  const addTag = (strategyId: string, tagId: string) => {
    setTags(
      tags.map((tag) =>
        tag.id === tagId
          ? { ...tag, strategies: [...tag.strategies.filter((id) => id !== strategyId), strategyId] }
          : { ...tag, strategies: tag.strategies.filter((id) => id !== strategyId) },
      ),
    )
  }

  const downloadChecklist = () => {
    const csvData = [
      ["Checked", "Plan", "Strategy Tag", "User Account", "Max Profit", "Max Loss", "Profit Locking", "Tags"],
      ...filteredConfigurations.map((config, index) => [
        checkedItems.has(`strategy-${index}`) ? "✓" : "○",
        config.StrategyTag?.match(/PLAN([A-Z])/i)?.[1] || "",
        config.StrategyTag || "",
        config["User Account"] || "",
        config["Max Profit"] || "",
        config["Max Loss"] || "",
        config["Profit Locking"] || "",
        tags
          .filter((tag) => tag.strategies.includes(`strategy-${index}`))
          .map((tag) => tag.name)
          .join("; "),
      ]),
    ]

    const csvContent = csvData.map((row) => row.join(",")).join("\n")
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `strategy-checklist-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const checkedCount = checkedItems.size
  const totalCount = filteredConfigurations.length
  const completionPercentage = totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-7xl max-h-[95vh] overflow-hidden">
        <CardHeader className="border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <CardTitle className="text-xl font-semibold text-slate-800 dark:text-slate-100">
                Interactive Strategy Checklist
              </CardTitle>
              <Badge variant="secondary" className="text-xs">
                {checkedCount}/{totalCount} completed ({completionPercentage}%)
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={downloadChecklist}>
                <Download className="h-4 w-4 mr-1" />
                Download CSV
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0 overflow-y-auto max-h-[calc(95vh-120px)]">
          <Tabs defaultValue="checklist" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="checklist">Strategy Checklist</TabsTrigger>
              <TabsTrigger value="portfolio">Multi-Leg Portfolio</TabsTrigger>
            </TabsList>

            <TabsContent value="checklist" className="p-6">
              {/* Filters and Controls */}
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
                <div className="flex flex-col sm:flex-row gap-3 flex-1">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <Input
                      placeholder="Search strategies..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 text-sm"
                    />
                  </div>
                  <select
                    value={filterPlan}
                    onChange={(e) => setFilterPlan(e.target.value)}
                    className="px-3 py-2 text-sm border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800"
                  >
                    <option value="all">All Plans</option>
                    {uniquePlans.map((plan) => (
                      <option key={plan} value={plan}>
                        Plan {plan}
                      </option>
                    ))}
                  </select>
                  <select
                    value={filterStrategy}
                    onChange={(e) => setFilterStrategy(e.target.value)}
                    className="px-3 py-2 text-sm border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800"
                  >
                    <option value="all">All Strategies</option>
                    {uniqueStrategies.map((strategy) => (
                      <option key={strategy} value={strategy}>
                        {strategy}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleBulkAction("check")}>
                    Check All
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleBulkAction("uncheck")}>
                    Uncheck All
                  </Button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Completion Progress</span>
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {checkedCount} of {totalCount} strategies
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>
              </div>

              {/* Strategy List */}
              <div className="space-y-3">
                {filteredConfigurations.map((config, index) => {
                  const itemId = `strategy-${index}`
                  const isChecked = checkedItems.has(itemId)
                  const planLetter = config.StrategyTag?.match(/PLAN([A-Z])/i)?.[1] || ""

                  return (
                    <div
                      key={itemId}
                      className={`border rounded-lg p-4 transition-all ${
                        isChecked
                          ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                          : "border-slate-200 dark:border-slate-700 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <Checkbox
                          checked={isChecked}
                          onCheckedChange={() => handleItemCheck(itemId)}
                          className="mt-1"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="text-xs">
                              Plan {planLetter}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {config.StrategyTag}
                            </Badge>
                            {isChecked && (
                              <Badge variant="default" className="text-xs bg-green-600">
                                Completed
                              </Badge>
                            )}
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-slate-600 dark:text-slate-400">User Account:</span>
                              <div className="font-medium text-slate-800 dark:text-slate-200">
                                {config["User Account"] || "N/A"}
                              </div>
                            </div>
                            <div>
                              <span className="text-slate-600 dark:text-slate-400">Max Profit:</span>
                              <div className="font-medium text-slate-800 dark:text-slate-200">
                                {config["Max Profit"] || "N/A"}
                              </div>
                            </div>
                            <div>
                              <span className="text-slate-600 dark:text-slate-400">Max Loss:</span>
                              <div className="font-medium text-slate-800 dark:text-slate-200">
                                {config["Max Loss"] || "N/A"}
                              </div>
                            </div>
                            <div>
                              <span className="text-slate-600 dark:text-slate-400">Profit Locking:</span>
                              <div className="font-medium text-slate-800 dark:text-slate-200">
                                {config["Profit Locking"] || "N/A"}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {filteredConfigurations.length === 0 && (
                <div className="text-center py-12">
                  <FileSpreadsheet className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-2">No strategies found</h3>
                  <p className="text-slate-600 dark:text-slate-400">Try adjusting your search or filter criteria.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="portfolio" className="p-6">
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <Users className="h-6 w-6 text-purple-600" />
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                    Multi-Leg Portfolio Entries
                  </h3>
                  <Badge variant="secondary" className="text-xs">
                    {selectedPortfolioEntries.length} entries
                  </Badge>
                </div>

                {selectedPortfolioEntries.length > 0 ? (
                  <div className="space-y-4">
                    {selectedPortfolioEntries.map((entry) => (
                      <div
                        key={entry.id}
                        className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {entry.type}
                            </Badge>
                            <span className="font-medium text-slate-800 dark:text-slate-200">{entry.displayName}</span>
                          </div>
                          <Badge variant={entry.isCopied ? "default" : "secondary"} className="text-xs">
                            {entry.isCopied ? "Copied" : "Original"}
                          </Badge>
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">Parent Tag: {entry.parentTag}</div>
                        {entry.subType && (
                          <div className="text-sm text-slate-600 dark:text-slate-400">Sub Type: {entry.subType}</div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Target className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-2">
                      No portfolio entries selected
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      Use the Multi Leg Portfolio modal to select entries for your checklist.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
