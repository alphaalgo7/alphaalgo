"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { loadStrategies } from "@/utils/save-utils"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Toaster } from "@/components/ui/sonner"
import { Edit, RotateCw, Search, RefreshCw, Plus, Trash2, FolderPlus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Checkbox } from "@/components/ui/checkbox"

export default function StrategiesPage() {
  const router = useRouter()

  // State for strategies
  const [strategies, setStrategies] = useState([])

  // Added search functionality
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [selectedStrategies, setSelectedStrategies] = useState<number[]>([])

  // Dialog states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [strategyToDelete, setStrategyToDelete] = useState<number | null>(null)
  const [portfolioDialogOpen, setPortfolioDialogOpen] = useState(false)
  const [portfolioName, setPortfolioName] = useState("")

  // New states for toasts
  const [refreshSuccess, setRefreshSuccess] = useState(false)
  const [refreshError, setRefreshError] = useState(false)
  const [deleteSuccess, setDeleteSuccess] = useState(false)
  const [deleteError, setDeleteError] = useState(false)
  const [portfolioError, setPortfolioError] = useState<string | null>(null)
  const [portfolioSuccess, setPortfolioSuccess] = useState<string | null>(null)
  const [navigateToPortfolios, setNavigateToPortfolios] = useState(false)

  // Filter strategies based on search term
  const filteredStrategies = strategies.filter(
    (strategy) =>
      strategy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      strategy.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  // Load strategies on component mount
  useEffect(() => {
    const fetchStrategies = async () => {
      setIsLoading(true)
      try {
        const loadedStrategies = await loadStrategies()
        setStrategies(loadedStrategies)
      } catch (error) {
        console.error("Error loading strategies:", error)
        // Don't call toast here
      } finally {
        setIsLoading(false)
      }
    }

    fetchStrategies()
  }, [])

  // Handle refresh
  const handleRefresh = useCallback(async () => {
    setIsLoading(true)
    try {
      const loadedStrategies = await loadStrategies()
      setStrategies(loadedStrategies)
      setRefreshSuccess(true)
    } catch (error) {
      console.error("Error refreshing strategies:", error)
      setRefreshError(true)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Handle add strategy
  const handleAddStrategy = useCallback(() => {
    router.push("/") // Navigate to create strategy page
    // Remove the toast call here
  }, [router])

  // Handle delete strategy
  const handleDeleteStrategy = useCallback((id: number) => {
    setStrategyToDelete(id)
    setDeleteDialogOpen(true)
  }, [])

  // Handle edit strategy
  const handleEditStrategy = useCallback(
    (id: number) => {
      // Navigate to create strategy page with the strategy ID
      router.push(`/?strategyId=${id}`)
      // Remove the toast call here
    },
    [router],
  )

  // Confirm delete strategy
  const confirmDeleteStrategy = useCallback(async () => {
    if (strategyToDelete) {
      try {
        // Get existing strategies
        const updatedStrategies = strategies.filter((strategy) => strategy.id !== strategyToDelete)

        // Save updated strategies
        localStorage.setItem("strategies", JSON.stringify(updatedStrategies))

        // Update state
        setStrategies(updatedStrategies)

        setDeleteSuccess(true)
      } catch (error) {
        console.error("Error deleting strategy:", error)
        setDeleteError(true)
      } finally {
        setDeleteDialogOpen(false)
        setStrategyToDelete(null)
      }
    }
  }, [strategyToDelete, strategies])

  // Handle checkbox selection
  const handleSelectStrategy = (id: number) => {
    setSelectedStrategies((prev) =>
      prev.includes(id) ? prev.filter((strategyId) => strategyId !== id) : [...prev, id],
    )
  }

  // Handle select all
  const handleSelectAll = () => {
    if (selectedStrategies.length === filteredStrategies.length) {
      setSelectedStrategies([])
    } else {
      setSelectedStrategies(filteredStrategies.map((strategy) => strategy.id))
    }
  }

  // Handle add to portfolio
  const handleAddToPortfolio = () => {
    if (selectedStrategies.length === 0) {
      // Move toast call to a useEffect
      setPortfolioError("Please select at least one strategy")
      return
    }
    setPortfolioDialogOpen(true)
  }

  // Save portfolio
  const savePortfolio = async () => {
    if (!portfolioName.trim()) {
      setPortfolioError("Please enter a portfolio name")
      return
    }

    setIsSaving(true)
    try {
      // Get selected strategies
      const selectedStrategyObjects = strategies.filter((strategy) => selectedStrategies.includes(strategy.id))

      // Create portfolio object
      const portfolioData = {
        name: portfolioName,
        strategies: selectedStrategyObjects,
        timestamp: new Date().toISOString(),
        type: "portfolio",
        isRealPortfolio: true,
        createdFromStrategies: true, // Add this flag to indicate it was created from strategies page
        settings: {
          // Add default settings
          maxProfit: 0,
          maxLoss: 0,
          profitLocking: false,
          entryRetry: 0,
          assignedUsers: [],
          trailingSettings: {
            enabled: false,
            trailPercent: 0,
            triggerPercent: 0,
          },
        },
      }

      // Save with portfolio prefix
      const portfolioKey = `portfolio_${Date.now()}`
      localStorage.setItem(portfolioKey, JSON.stringify(portfolioData))

      console.log("Portfolio saved:", portfolioKey, portfolioData)

      // Set success message instead of calling toast directly
      setPortfolioSuccess(`Portfolio "${portfolioName}" created with ${selectedStrategies.length} strategies`)
      setPortfolioDialogOpen(false)
      setPortfolioName("")
      setSelectedStrategies([])

      // Set flag to navigate to portfolios page
      setNavigateToPortfolios(true)
    } catch (error) {
      console.error("Error saving portfolio:", error)
      setPortfolioError("Failed to save portfolio")
    } finally {
      setIsSaving(false)
    }
  }

  // Use a ref to track if navigation is in progress
  const navigationInProgress = useRef(false)

  // Navigate to portfolios page after successful save
  useEffect(() => {
    if (navigateToPortfolios && !navigationInProgress.current) {
      navigationInProgress.current = true
      // Wait a moment for the toast to be visible
      const timer = setTimeout(() => {
        router.push("/portfolios")
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [navigateToPortfolios, router])

  // Get tag color based on tag name
  const getTagColor = (tag: string) => {
    const tagMap: Record<string, string> = {
      IRON_CONDOR: "bg-gradient-to-r from-purple-500 to-purple-600 text-white",
      BUTTERFLY: "bg-gradient-to-r from-cyan-500 to-cyan-600 text-white",
      STRADDLE: "bg-gradient-to-r from-blue-500 to-blue-600 text-white",
      STRANGLE: "bg-gradient-to-r from-green-500 to-green-600 text-white",
      NIFTY: "bg-gradient-to-r from-amber-500 to-amber-600 text-white",
      BANKNIFTY: "bg-gradient-to-r from-red-500 to-red-600 text-white",
      WEEKLY: "bg-gradient-to-r from-slate-500 to-slate-600 text-white",
      MONTHLY: "bg-gradient-to-r from-gray-500 to-gray-600 text-white",
      DEFAULT: "bg-gradient-to-r from-slate-500 to-slate-600 text-white",
      INTRADAY: "bg-gradient-to-r from-blue-500 to-blue-600 text-white",
      POSITIONAL: "bg-gradient-to-r from-green-500 to-green-600 text-white",
    }
    return tagMap[tag] || "bg-gradient-to-r from-slate-500 to-slate-600 text-white"
  }

  // Toast useEffects - ensure these are properly separated
  useEffect(() => {
    if (refreshSuccess) {
      toast.success("Strategies refreshed successfully")
      setRefreshSuccess(false)
    }
  }, [refreshSuccess])

  useEffect(() => {
    if (refreshError) {
      toast.error("Failed to refresh strategies")
      setRefreshError(false)
    }
  }, [refreshError])

  useEffect(() => {
    if (deleteSuccess) {
      toast.success("Strategy deleted successfully")
      setDeleteSuccess(false)
    }
  }, [deleteSuccess])

  useEffect(() => {
    if (deleteError) {
      toast.error("Failed to delete strategy")
      setDeleteError(false)
    }
  }, [deleteError])

  useEffect(() => {
    if (portfolioError) {
      toast.error(portfolioError)
      setPortfolioError(null)
    }
  }, [portfolioError])

  useEffect(() => {
    if (portfolioSuccess) {
      toast.success(portfolioSuccess)
      setPortfolioSuccess(null)
    }
  }, [portfolioSuccess])

  // Ensure proper cleanup on unmount
  useEffect(() => {
    return () => {
      if (navigationInProgress.current) {
        navigationInProgress.current = false
      }
    }
  }, [])

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b">
        <div>
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-slate-700 to-slate-900 dark:from-slate-200 dark:to-white bg-clip-text text-transparent">
            STRATEGIES
          </h1>
          <p className="text-muted-foreground">Manage your trading strategies</p>
        </div>
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  onClick={handleRefresh}
                  disabled={isLoading}
                >
                  {isLoading ? <RotateCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>Refresh</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Button
            variant="outline"
            className="gap-2"
            onClick={handleAddToPortfolio}
            disabled={selectedStrategies.length === 0}
          >
            <FolderPlus className="h-4 w-4" /> Add to Portfolios
          </Button>

          <Button
            className="bg-gradient-to-r from-slate-700 to-slate-900 dark:from-slate-600 dark:to-slate-800 hover:from-slate-800 hover:to-slate-950 dark:hover:from-slate-700 dark:hover:to-slate-900 transition-all shadow-md"
            onClick={handleAddStrategy}
          >
            <Plus className="h-4 w-4 mr-2" /> Add Strategy
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search strategies..."
            className="pl-8 border-slate-300 dark:border-slate-700 focus-visible:ring-slate-400 rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Strategies Table */}
      <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 pb-2">
          <CardTitle>Strategy Settings</CardTitle>
          <CardDescription>Manage your saved trading strategies</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                    <th className="h-10 px-2 text-left font-medium w-10">
                      <div className="flex items-center justify-center">
                        <Checkbox
                          checked={
                            selectedStrategies.length > 0 && selectedStrategies.length === filteredStrategies.length
                          }
                          onCheckedChange={handleSelectAll}
                          aria-label="Select all"
                        />
                      </div>
                    </th>
                    <th className="h-10 px-4 text-left font-medium">Strategy Name</th>
                    <th className="h-10 px-4 text-left font-medium">Max Profit</th>
                    <th className="h-10 px-4 text-left font-medium">Max Loss</th>
                    <th className="h-10 px-4 text-left font-medium">Profit Locking</th>
                    <th className="h-10 px-4 text-left font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStrategies.length > 0 ? (
                    filteredStrategies.map((strategy) => (
                      <tr
                        key={strategy.id}
                        className="border-b border-slate-200 dark:border-slate-800 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                      >
                        <td className="p-2 align-middle">
                          <div className="flex items-center justify-center">
                            <Checkbox
                              checked={selectedStrategies.includes(strategy.id)}
                              onCheckedChange={() => handleSelectStrategy(strategy.id)}
                              aria-label={`Select ${strategy.name}`}
                            />
                          </div>
                        </td>
                        <td className="p-4 align-middle">
                          <div>
                            <div className="font-medium">{strategy.name}</div>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {strategy.tags.map((tag) => (
                                <Badge key={tag} className={`${getTagColor(tag)} text-xs`}>
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </td>
                        <td className="p-4 align-middle font-medium text-emerald-600 dark:text-emerald-400">
                          ₹{strategy.maxProfit}
                        </td>
                        <td className="p-4 align-middle font-medium text-rose-600 dark:text-rose-400">
                          ₹{strategy.maxLoss}
                        </td>
                        <td className="p-4 align-middle">
                          <div className="text-sm">
                            {strategy.profitLocking !== "0~0~0~0" && strategy.profitLocking !== "0" ? (
                              <span className="font-medium text-green-600 dark:text-green-400">
                                {strategy.profitLocking}
                              </span>
                            ) : (
                              <span className="text-gray-500 dark:text-gray-400">Disabled</span>
                            )}
                          </div>
                        </td>
                        <td className="p-4 align-middle">
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-slate-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20"
                              onClick={() => handleEditStrategy(strategy.id)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-slate-500 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                              onClick={() => handleDeleteStrategy(strategy.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="h-24 text-center">
                        {isLoading ? (
                          <div className="flex justify-center items-center">
                            <RotateCw className="h-5 w-5 animate-spin text-slate-400 mr-2" />
                            <span>Loading strategies...</span>
                          </div>
                        ) : (
                          "No strategies found."
                        )}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Footer */}
      <div className="text-sm text-muted-foreground border-t pt-4 mt-2">
        Showing {filteredStrategies.length} of {strategies.length} strategies • {selectedStrategies.length} selected
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this strategy? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteStrategy}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add to Portfolio Dialog */}
      <Dialog open={portfolioDialogOpen} onOpenChange={setPortfolioDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add to Portfolio</DialogTitle>
            <DialogDescription>Create a new portfolio with the selected strategies</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="portfolio-name" className="text-sm font-medium">
                Portfolio Name
              </label>
              <Input
                id="portfolio-name"
                placeholder="Enter portfolio name"
                value={portfolioName}
                onChange={(e) => setPortfolioName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Selected Strategies</label>
              <div className="border rounded-md p-3 space-y-2 max-h-40 overflow-y-auto">
                {selectedStrategies.length > 0 ? (
                  selectedStrategies.map((id) => {
                    const strategy = strategies.find((s) => s.id === id)
                    return strategy ? (
                      <div key={id} className="flex items-center justify-between">
                        <span>{strategy.name}</span>
                        <div className="flex gap-1">
                          {strategy.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ) : null
                  })
                ) : (
                  <div className="text-center text-muted-foreground">No strategies selected</div>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPortfolioDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={savePortfolio} disabled={isSaving}>
              {isSaving ? <RotateCw className="h-4 w-4 mr-2 animate-spin" /> : null}
              Save Portfolio
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Toast notifications */}
      <Toaster />
    </div>
  )
}
