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
      <div className="bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 shadow-lg overflow-hidden">
        {/* Enhanced Header */}
        <div className="bg-gradient-to-r from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-1">Strategy Management</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Configure and organize your trading strategies
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <div className="bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                {filteredStrategies.length} strategies
              </div>
              {selectedStrategies.length > 0 && (
                <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full">
                  {selectedStrategies.length} selected
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Table */}
        <div className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-slate-100 via-slate-50 to-slate-100 dark:from-slate-800 dark:via-slate-850 dark:to-slate-800 border-b border-slate-200 dark:border-slate-700">
                  <th className="h-12 px-4 text-left font-semibold text-slate-700 dark:text-slate-300 w-12">
                    <div className="flex items-center justify-center">
                      <Checkbox
                        checked={
                          selectedStrategies.length > 0 && selectedStrategies.length === filteredStrategies.length
                        }
                        onCheckedChange={handleSelectAll}
                        aria-label="Select all"
                        className="border-slate-400 dark:border-slate-500"
                      />
                    </div>
                  </th>
                  <th className="h-12 px-6 text-left font-semibold text-slate-700 dark:text-slate-300">
                    Strategy Details
                  </th>
                  <th className="h-12 px-6 text-left font-semibold text-slate-700 dark:text-slate-300">Max Profit</th>
                  <th className="h-12 px-6 text-left font-semibold text-slate-700 dark:text-slate-300">Max Loss</th>
                  <th className="h-12 px-6 text-left font-semibold text-slate-700 dark:text-slate-300">
                    Profit Locking
                  </th>
                  <th className="h-12 px-6 text-left font-semibold text-slate-700 dark:text-slate-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredStrategies.length > 0 ? (
                  filteredStrategies.map((strategy, index) => (
                    <tr
                      key={strategy.id}
                      className={`transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-900/50 ${
                        selectedStrategies.includes(strategy.id)
                          ? "bg-blue-50 dark:bg-blue-950/20 border-l-4 border-l-blue-500"
                          : index % 2 === 0
                            ? "bg-white dark:bg-slate-950"
                            : "bg-slate-50/50 dark:bg-slate-900/30"
                      }`}
                    >
                      <td className="p-4 align-middle">
                        <div className="flex items-center justify-center">
                          <Checkbox
                            checked={selectedStrategies.includes(strategy.id)}
                            onCheckedChange={() => handleSelectStrategy(strategy.id)}
                            aria-label={`Select ${strategy.name}`}
                            className="border-slate-400 dark:border-slate-500"
                          />
                        </div>
                      </td>
                      <td className="p-6 align-middle">
                        <div className="space-y-2">
                          <div className="font-semibold text-slate-900 dark:text-slate-100 text-base">
                            {strategy.name}
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {strategy.tags.map((tag) => (
                              <Badge
                                key={tag}
                                className={`${getTagColor(tag)} text-xs font-medium px-2.5 py-1 shadow-sm`}
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </td>
                      <td className="p-6 align-middle">
                        <div className="font-semibold text-emerald-600 dark:text-emerald-400 text-base">
                          ₹{strategy.maxProfit}
                        </div>
                      </td>
                      <td className="p-6 align-middle">
                        <div className="font-semibold text-rose-600 dark:text-rose-400 text-base">
                          ₹{strategy.maxLoss}
                        </div>
                      </td>
                      <td className="p-6 align-middle">
                        <div
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            strategy.profitLocking === "Enabled"
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                          }`}
                        >
                          {strategy.profitLocking}
                        </div>
                      </td>
                      <td className="p-6 align-middle">
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-9 w-9 p-0 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 dark:hover:text-blue-400 rounded-lg transition-all"
                            onClick={() => handleEditStrategy(strategy.id)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-9 w-9 p-0 text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 dark:hover:text-rose-400 rounded-lg transition-all"
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
                    <td colSpan={6} className="h-32 text-center">
                      {isLoading ? (
                        <div className="flex justify-center items-center space-y-2">
                          <div className="flex items-center text-slate-500 dark:text-slate-400">
                            <RotateCw className="h-5 w-5 animate-spin mr-3" />
                            <span className="text-base">Loading strategies...</span>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="text-slate-400 dark:text-slate-500 text-lg">No strategies found</div>
                          <div className="text-slate-500 dark:text-slate-400 text-sm">
                            {searchTerm
                              ? "Try adjusting your search criteria"
                              : "Create your first strategy to get started"}
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Enhanced Footer */}
        <div className="bg-gradient-to-r from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 border-t border-slate-200 dark:border-slate-800 px-6 py-4">
          <div className="flex items-center justify-between text-sm">
            <div className="text-slate-600 dark:text-slate-400">
              Showing{" "}
              <span className="font-medium text-slate-900 dark:text-slate-100">{filteredStrategies.length}</span> of{" "}
              <span className="font-medium text-slate-900 dark:text-slate-100">{strategies.length}</span> strategies
            </div>
            {selectedStrategies.length > 0 && (
              <div className="text-blue-600 dark:text-blue-400 font-medium">
                {selectedStrategies.length} strategies selected
              </div>
            )}
          </div>
        </div>
      </div>

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
