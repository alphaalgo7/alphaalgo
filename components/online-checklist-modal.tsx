"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Download, Check, Square, CheckSquare, RotateCcw } from "lucide-react"
import type { StrategyConfigRow } from "@/lib/types"
import { toast } from "@/hooks/use-toast"

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

interface ChecklistItem {
  id: string
  type: "strategy" | "portfolio"
  name: string
  parentTag?: string
  checked: boolean
  startTrading: boolean
  portfolioEnabled: boolean
  userAccount?: string
  pseudoAcc?: string
  maxProfit?: string
  maxLoss?: string
  profitLocking?: string
}

export default function OnlineChecklistModal({
  isOpen,
  onClose,
  strategyData,
  selectedPortfolioEntries,
  stoxxoNumber,
  instrument,
}: OnlineChecklistModalProps) {
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([])
  const [activeTab, setActiveTab] = useState<"strategies" | "portfolio">("strategies")

  useEffect(() => {
    if (isOpen) {
      // Initialize checklist items from strategy data
      const strategyItems: ChecklistItem[] = strategyData.map((strategy, index) => ({
        id: `strategy-${index}`,
        type: "strategy",
        name: strategy.StrategyTag,
        checked: false,
        startTrading: false,
        portfolioEnabled: false,
        userAccount: strategy["User Account"],
        pseudoAcc: strategy["Pseudo Acc"],
        maxProfit: strategy["Max Profit"],
        maxLoss: strategy["Max Loss"],
        profitLocking: strategy["Profit Locking"],
      }))

      // Initialize portfolio items
      const portfolioItems: ChecklistItem[] = selectedPortfolioEntries.map((entry, index) => ({
        id: `portfolio-${index}`,
        type: "portfolio",
        name: entry.displayName,
        parentTag: entry.parentTag,
        checked: false,
        startTrading: false,
        portfolioEnabled: false,
      }))

      setChecklistItems([...strategyItems, ...portfolioItems])
    }
  }, [isOpen, strategyData, selectedPortfolioEntries])

  if (!isOpen) return null

  const strategyItems = checklistItems.filter((item) => item.type === "strategy")
  const portfolioItems = checklistItems.filter((item) => item.type === "portfolio")

  const updateItem = (id: string, field: keyof ChecklistItem, value: boolean) => {
    setChecklistItems((items) => items.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
  }

  const toggleAll = (field: keyof ChecklistItem, items: ChecklistItem[]) => {
    const allChecked = items.every((item) => item[field] as boolean)
    const newValue = !allChecked

    setChecklistItems((prevItems) =>
      prevItems.map((item) => (items.some((i) => i.id === item.id) ? { ...item, [field]: newValue } : item)),
    )
  }

  const resetAll = () => {
    setChecklistItems((items) =>
      items.map((item) => ({
        ...item,
        checked: false,
        startTrading: false,
        portfolioEnabled: false,
      })),
    )
    toast({
      title: "Reset Complete",
      description: "All checkboxes have been cleared.",
    })
  }

  const getStats = (items: ChecklistItem[]) => {
    const checked = items.filter((item) => item.checked).length
    const startTrading = items.filter((item) => item.startTrading).length
    const portfolioEnabled = items.filter((item) => item.portfolioEnabled).length
    return { checked, startTrading, portfolioEnabled, total: items.length }
  }

  const handleDownloadModified = () => {
    // Create CSV content with checkbox states
    const headers = [
      "CHECKLIST",
      "START TRADING",
      "PORTFOLIO ENABLED",
      "Name",
      "Parent Tag",
      "User Account",
      "Pseudo Acc",
      "Max Profit",
      "Max Loss",
      "Profit Locking",
    ]

    const csvRows = checklistItems.map((item) => [
      item.checked ? "☑" : "☐",
      item.startTrading ? "YES" : "NO",
      item.portfolioEnabled ? "YES" : "NO",
      item.name,
      item.parentTag || "",
      item.userAccount || "",
      item.pseudoAcc || "",
      item.maxProfit || "",
      item.maxLoss || "",
      item.profitLocking || "",
    ])

    const csvContent = [headers.join(","), ...csvRows.map((row) => row.join(","))].join("\n")

    // Generate filename
    const now = new Date()
    const dateStr = now.toISOString().split("T")[0]
    const timeStr = now.toTimeString().split(" ")[0].replace(/:/g, "")

    const filenameParts = []
    if (stoxxoNumber) filenameParts.push(`STOXXO${stoxxoNumber}`)
    if (instrument)
      filenameParts.push(
        instrument
          .replace(/\s+/g, "_")
          .replace(/[^A-Za-z0-9_-]/g, "")
          .toUpperCase(),
      )
    filenameParts.push("MODIFIED_CHECKLIST")
    filenameParts.push(`${dateStr}_${timeStr}`)

    const filename = filenameParts.join("_")

    // Create and download the file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)

    link.setAttribute("href", url)
    link.setAttribute("download", `${filename}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Modified Checklist Downloaded",
      description: `File saved as ${filename}.csv with current checkbox selections`,
    })
  }

  const currentItems = activeTab === "strategies" ? strategyItems : portfolioItems
  const stats = getStats(currentItems)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-7xl max-h-[95vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl font-semibold">Online Checklist</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Header Info */}
          <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-slate-800 dark:text-slate-200">
                  {stoxxoNumber && `STOXXO ${stoxxoNumber}`}
                  {stoxxoNumber && instrument && " - "}
                  {instrument}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Interactive checklist with real-time updates
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={resetAll}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset All
                </Button>
                <Button
                  onClick={handleDownloadModified}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Modified
                </Button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab("strategies")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === "strategies"
                  ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
              }`}
            >
              Strategy Tags ({strategyItems.length})
            </button>
            <button
              onClick={() => setActiveTab("portfolio")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === "portfolio"
                  ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
              }`}
            >
              Multi Leg Portfolio ({portfolioItems.length})
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.checked}</div>
              <div className="text-sm text-blue-600 dark:text-blue-400">Checked</div>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.startTrading}</div>
              <div className="text-sm text-green-600 dark:text-green-400">Start Trading</div>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.portfolioEnabled}</div>
              <div className="text-sm text-purple-600 dark:text-purple-400">Portfolio Enabled</div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
              <div className="text-2xl font-bold text-slate-600 dark:text-slate-400">{stats.total}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Total Items</div>
            </div>
          </div>

          {/* Bulk Actions */}
          <div className="flex gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={() => toggleAll("checked", currentItems)}
              className="text-blue-600 border-blue-200 hover:bg-blue-50"
            >
              <CheckSquare className="h-4 w-4 mr-2" />
              Toggle All Checked
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toggleAll("startTrading", currentItems)}
              className="text-green-600 border-green-200 hover:bg-green-50"
            >
              <Check className="h-4 w-4 mr-2" />
              Toggle All Start Trading
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toggleAll("portfolioEnabled", currentItems)}
              className="text-purple-600 border-purple-200 hover:bg-purple-50"
            >
              <Square className="h-4 w-4 mr-2" />
              Toggle All Portfolio
            </Button>
          </div>

          {/* Checklist Table */}
          <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
            <div className="overflow-x-auto max-h-96">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800 sticky top-0">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-slate-700 dark:text-slate-300">Checklist</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-700 dark:text-slate-300">
                      Start Trading
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-slate-700 dark:text-slate-300">
                      Portfolio Enabled
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-slate-700 dark:text-slate-300">Name</th>
                    {activeTab === "strategies" && (
                      <>
                        <th className="px-4 py-3 text-left font-medium text-slate-700 dark:text-slate-300">
                          User Account
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-slate-700 dark:text-slate-300">
                          Pseudo Acc
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-slate-700 dark:text-slate-300">
                          Max Profit
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-slate-700 dark:text-slate-300">Max Loss</th>
                      </>
                    )}
                    {activeTab === "portfolio" && (
                      <th className="px-4 py-3 text-left font-medium text-slate-700 dark:text-slate-300">Parent Tag</th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {currentItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800">
                      <td className="px-4 py-3">
                        <button
                          onClick={() => updateItem(item.id, "checked", !item.checked)}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          {item.checked ? <CheckSquare className="h-5 w-5" /> : <Square className="h-5 w-5" />}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => updateItem(item.id, "startTrading", !item.startTrading)}
                          className={`px-3 py-1 rounded text-xs font-medium ${
                            item.startTrading
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400"
                          }`}
                        >
                          {item.startTrading ? "YES" : "NO"}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => updateItem(item.id, "portfolioEnabled", !item.portfolioEnabled)}
                          className={`px-3 py-1 rounded text-xs font-medium ${
                            item.portfolioEnabled
                              ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                              : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400"
                          }`}
                        >
                          {item.portfolioEnabled ? "YES" : "NO"}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant="secondary"
                          className={
                            item.name.includes("PLANA")
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                              : item.name.includes("PLANB")
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                : item.name.includes("PLANC")
                                  ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                                  : "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200"
                          }
                        >
                          {item.name}
                        </Badge>
                      </td>
                      {activeTab === "strategies" && (
                        <>
                          <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{item.userAccount || "-"}</td>
                          <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{item.pseudoAcc || "-"}</td>
                          <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{item.maxProfit || "-"}</td>
                          <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{item.maxLoss || "-"}</td>
                        </>
                      )}
                      {activeTab === "portfolio" && (
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{item.parentTag || "-"}</td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
