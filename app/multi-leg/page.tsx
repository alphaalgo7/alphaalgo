"use client"

import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { DropdownMenuLabel } from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
  Filter,
  Plus,
  Edit2,
  Copy,
  PlayCircle,
  Clock,
  Search,
  RefreshCw,
  Download,
  Settings,
  HelpCircle,
  Info,
  LayoutGrid,
  List,
  ChevronDown,
  ChevronUp,
  ArrowUpRight,
  Calendar,
  BarChart3,
  CheckCircle2,
  XCircle,
  Layers,
  Trash2,
  Sparkles,
  Gauge,
  TrendingUp,
  Percent,
  Wallet,
  Activity,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Toggle } from "@/components/ui/toggle"
import { Tooltip, TooltipProvider } from "@/components/ui/tooltip"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { InstrumentSelector } from "@/components/instrument-selector"
import { loadData } from "@/utils/save-utils"
import { toast } from "sonner"

// Define the strategy type
interface Strategy {
  id: string
  enabled: boolean
  status: string
  portfolioName: string
  product: string
  symbol: string
  strategyTag: string
  startTime: string
  endTime: string
  sqOffTime: string
  pnl: string
  legs?: any[]
  profitProtection?: any
  lossProtection?: any
  lastUpdated?: string
  lotSize?: number
  strikeStep?: number
}

// Define the market data type
interface MarketData {
  symbol: string
  ltp: number
  change: number
  changePercent: number
  open: number
  high: number
  low: number
  volume: number
}

export default function MultiLegPage() {
  const router = useRouter()

  // State for strategies
  const [strategies, setStrategies] = useState<Strategy[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  const [viewMode, setViewMode] = useState<"table" | "card" | "detailed">("detailed")
  const [expandedCards, setExpandedCards] = useState<string[]>([])
  const [selectedStrategies, setSelectedStrategies] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState("all")
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "ascending" | "descending" } | null>(null)
  const [hoveredStrategy, setHoveredStrategy] = useState<string | null>(null)

  // Market data state
  const [marketData, setMarketData] = useState<MarketData[]>([
    {
      symbol: "NIFTY",
      ltp: 24568.25,
      change: 125.75,
      changePercent: 0.51,
      open: 24450.1,
      high: 24590.3,
      low: 24430.15,
      volume: 12345678,
    },
    {
      symbol: "BANKNIFTY",
      ltp: 48975.6,
      change: -215.4,
      changePercent: -0.44,
      open: 49150.25,
      high: 49200.1,
      low: 48900.5,
      volume: 5678901,
    },
    {
      symbol: "SENSEX",
      ltp: 80245.75,
      change: 412.3,
      changePercent: 0.52,
      open: 79950.2,
      high: 80300.45,
      low: 79900.1,
      volume: 7890123,
    },
    {
      symbol: "FINNIFTY",
      ltp: 22345.6,
      change: 78.25,
      changePercent: 0.35,
      open: 22280.1,
      high: 22380.3,
      low: 22250.4,
      volume: 3456789,
    },
  ])

  // Performance metrics
  const [performanceMetrics, setPerformanceMetrics] = useState({
    totalPnL: 2100.5,
    winRate: 68,
    avgWin: 1250.75,
    avgLoss: -450.25,
    activeStrategies: 0,
    totalStrategies: 0,
  })

  // Filter options
  const [filters, setFilters] = useState({
    showActive: true,
    showDisabled: true,
    showProfitable: true,
    showLossMaking: true,
    selectedSymbols: [] as string[],
    selectedTags: [] as string[],
  })

  // Load strategies from localStorage
  useEffect(() => {
    const loadStrategies = async () => {
      setIsLoading(true)
      try {
        // First try to get from multi_leg_strategies
        const savedStrategies = localStorage.getItem("multi_leg_strategies")
        let strategiesArray: Strategy[] = []

        if (savedStrategies) {
          strategiesArray = JSON.parse(savedStrategies)
        }

        // Then look for any portfolio_ items and convert them to strategies if not already present
        const portfolioKeys = Object.keys(localStorage).filter((key) => key.startsWith("portfolio_"))

        for (const key of portfolioKeys) {
          const portfolioName = key.replace("portfolio_", "")
          const portfolioData = await loadData(key)

          // Check if this portfolio is already in strategies
          const existingStrategy = strategiesArray.find(
            (s) => s.portfolioName.split(" (")[0].toLowerCase() === portfolioName.toLowerCase(),
          )

          if (!existingStrategy && portfolioData) {
            // Format the times properly
            const formatTime = (timeObj: any) => {
              return `${timeObj.hours}:${timeObj.minutes}:${timeObj.seconds}`
            }

            // Determine the symbol based on the first leg or default to NIFTY
            const symbol = (portfolioData.legs && portfolioData.legs[0]?.symbol) || "NIFTY"

            // Get the strategy tag - either the first one or a default
            const strategyTag =
              portfolioData.strategyTags && portfolioData.strategyTags.length > 0
                ? portfolioData.strategyTags[0]
                : "DEFAULT"

            // Create a new strategy from the portfolio data
            const newStrategy: Strategy = {
              id: Date.now().toString(),
              enabled: false,
              status: "Disabled",
              portfolioName: `${portfolioName} (${portfolioData.legs?.length || 0}L)`,
              product: "MIS",
              symbol: symbol,
              strategyTag: strategyTag,
              startTime: portfolioData.startTime ? formatTime(portfolioData.startTime) : "09:20:00",
              endTime: portfolioData.endTime ? formatTime(portfolioData.endTime) : "15:15:00",
              sqOffTime: portfolioData.sqOffTime ? formatTime(portfolioData.sqOffTime) : "15:25:00",
              pnl: "0.00",
              legs: portfolioData.legs || [],
              profitProtection: portfolioData.profitProtection,
              lossProtection: portfolioData.lossProtection,
              lastUpdated: portfolioData.timestamp || new Date().toISOString(),
              lotSize: portfolioData.lotSize || 75,
              strikeStep: portfolioData.strikeStep || 50,
            }

            strategiesArray.push(newStrategy)
          }
        }

        // Update localStorage with the combined strategies
        if (strategiesArray.length > 0) {
          localStorage.setItem("multi_leg_strategies", JSON.stringify(strategiesArray))
        }

        setStrategies(strategiesArray)

        // Update performance metrics
        setPerformanceMetrics((prev) => ({
          ...prev,
          activeStrategies: strategiesArray.filter((s) => s.enabled).length,
          totalStrategies: strategiesArray.length,
        }))
      } catch (error) {
        console.error("Error loading strategies:", error)
        toast.error("Failed to load strategies")
      } finally {
        setIsLoading(false)
      }
    }

    loadStrategies()

    // Set up interval to update market data
    const marketDataInterval = setInterval(() => {
      updateMarketData()
    }, 5000)

    return () => clearInterval(marketDataInterval)
  }, [])

  // Update market data with small random changes
  const updateMarketData = () => {
    setMarketData((prevData) =>
      prevData.map((item) => {
        const changeAmount = (Math.random() * 10 - 5).toFixed(2)
        const newLtp = Number.parseFloat((item.ltp + Number.parseFloat(changeAmount)).toFixed(2))
        const newChange = Number.parseFloat((newLtp - item.open).toFixed(2))
        const newChangePercent = Number.parseFloat(((newChange / item.open) * 100).toFixed(2))

        return {
          ...item,
          ltp: newLtp,
          change: newChange,
          changePercent: newChangePercent,
          high: newLtp > item.high ? newLtp : item.high,
          low: newLtp < item.low ? newLtp : item.low,
          volume: item.volume + Math.floor(Math.random() * 10000),
        }
      }),
    )
  }

  // Handle adding a new strategy
  const handleAddStrategy = () => {
    router.push("/portfolio-settings")
  }

  // Toggle strategy enabled state
  const handleToggleEnabled = (id: string) => {
    const updatedStrategies = strategies.map((strategy) => {
      if (strategy.id === id) {
        const newEnabled = !strategy.enabled
        return {
          ...strategy,
          enabled: newEnabled,
          status: newEnabled ? "Active" : "Disabled",
        }
      }
      return strategy
    })

    setStrategies(updatedStrategies)

    // Save to localStorage
    try {
      localStorage.setItem("multi_leg_strategies", JSON.stringify(updatedStrategies))

      // Update performance metrics
      setPerformanceMetrics((prev) => ({
        ...prev,
        activeStrategies: updatedStrategies.filter((s) => s.enabled).length,
      }))

      toast.success(`Strategy ${updatedStrategies.find((s) => s.id === id)?.enabled ? "enabled" : "disabled"}`)
    } catch (error) {
      console.error("Error saving strategies:", error)
      toast.error("Failed to update strategy")
    }
  }

  // Toggle card expansion
  const toggleCardExpand = (id: string) => {
    if (expandedCards.includes(id)) {
      setExpandedCards(expandedCards.filter((cardId) => cardId !== id))
    } else {
      setExpandedCards([...expandedCards, id])
    }
  }

  // Handle strategy selection
  const handleSelectStrategy = (id: string) => {
    if (selectedStrategies.includes(id)) {
      setSelectedStrategies(selectedStrategies.filter((strategyId) => strategyId !== id))
    } else {
      setSelectedStrategies([...selectedStrategies, id])
    }
  }

  // Handle select all strategies
  const handleSelectAll = () => {
    if (selectedStrategies.length === filteredStrategies.length) {
      setSelectedStrategies([])
    } else {
      setSelectedStrategies(filteredStrategies.map((strategy) => strategy.id))
    }
  }

  // Handle editing a strategy
  const handleEditStrategy = (portfolioName: string) => {
    // Extract just the portfolio name without any additional info in parentheses
    const cleanName = portfolioName.split(" (")[0]
    router.push(`/portfolio-settings?portfolio=${encodeURIComponent(cleanName)}`)
  }

  // Handle deleting a strategy
  const handleDeleteStrategy = (id: string) => {
    const strategyToDelete = strategies.find((s) => s.id === id)

    if (!strategyToDelete) return

    const updatedStrategies = strategies.filter((strategy) => strategy.id !== id)
    setStrategies(updatedStrategies)

    // Remove from selected strategies if present
    if (selectedStrategies.includes(id)) {
      setSelectedStrategies(selectedStrategies.filter((strategyId) => strategyId !== id))
    }

    // Save to localStorage
    try {
      localStorage.setItem("multi_leg_strategies", JSON.stringify(updatedStrategies))

      // Update performance metrics
      setPerformanceMetrics((prev) => ({
        ...prev,
        activeStrategies: updatedStrategies.filter((s) => s.enabled).length,
        totalStrategies: updatedStrategies.length,
      }))

      toast.success(`Strategy "${strategyToDelete.portfolioName}" deleted`)
    } catch (error) {
      console.error("Error saving strategies:", error)
      toast.error("Failed to delete strategy")
    }
  }

  // Handle cloning a strategy
  const handleCloneStrategy = (id: string) => {
    const strategyToClone = strategies.find((s) => s.id === id)

    if (!strategyToClone) return

    const newStrategy = {
      ...strategyToClone,
      id: Date.now().toString(),
      enabled: false,
      status: "Disabled",
      portfolioName: `${strategyToClone.portfolioName.split(" (")[0]} Copy (${strategyToClone.legs?.length || 0}L)`,
      pnl: "0.00",
      lastUpdated: new Date().toISOString(),
    }

    const updatedStrategies = [...strategies, newStrategy]
    setStrategies(updatedStrategies)

    // Save to localStorage
    try {
      localStorage.setItem("multi_leg_strategies", JSON.stringify(updatedStrategies))

      // Update performance metrics
      setPerformanceMetrics((prev) => ({
        ...prev,
        totalStrategies: updatedStrategies.length,
      }))

      toast.success(`Strategy "${strategyToClone.portfolioName}" cloned`)
    } catch (error) {
      console.error("Error saving strategies:", error)
      toast.error("Failed to clone strategy")
    }
  }

  // Handle bulk actions on selected strategies
  const handleBulkAction = (action: "enable" | "disable" | "delete") => {
    if (selectedStrategies.length === 0) {
      toast.error("No strategies selected")
      return
    }

    let updatedStrategies = [...strategies]

    switch (action) {
      case "enable":
        updatedStrategies = strategies.map((strategy) => {
          if (selectedStrategies.includes(strategy.id)) {
            return {
              ...strategy,
              enabled: true,
              status: "Active",
            }
          }
          return strategy
        })
        toast.success(`${selectedStrategies.length} strategies enabled`)
        break

      case "disable":
        updatedStrategies = strategies.map((strategy) => {
          if (selectedStrategies.includes(strategy.id)) {
            return {
              ...strategy,
              enabled: false,
              status: "Disabled",
            }
          }
          return strategy
        })
        toast.success(`${selectedStrategies.length} strategies disabled`)
        break

      case "delete":
        updatedStrategies = strategies.filter((strategy) => !selectedStrategies.includes(strategy.id))
        toast.success(`${selectedStrategies.length} strategies deleted`)
        setSelectedStrategies([])
        break
    }

    setStrategies(updatedStrategies)

    // Save to localStorage
    try {
      localStorage.setItem("multi_leg_strategies", JSON.stringify(updatedStrategies))

      // Update performance metrics
      setPerformanceMetrics((prev) => ({
        ...prev,
        activeStrategies: updatedStrategies.filter((s) => s.enabled).length,
        totalStrategies: updatedStrategies.length,
      }))
    } catch (error) {
      console.error("Error saving strategies:", error)
      toast.error("Failed to perform bulk action")
    }
  }

  // Handle sorting
  const requestSort = (key: string) => {
    let direction: "ascending" | "descending" = "ascending"

    if (sortConfig && sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    }

    setSortConfig({ key, direction })
  }

  // Refresh strategies from localStorage
  const refreshStrategies = () => {
    setIsLoading(true)
    try {
      const savedStrategies = localStorage.getItem("multi_leg_strategies")
      if (savedStrategies) {
        const parsedStrategies = JSON.parse(savedStrategies)
        if (Array.isArray(parsedStrategies)) {
          setStrategies(parsedStrategies)

          // Update performance metrics
          setPerformanceMetrics((prev) => ({
            ...prev,
            activeStrategies: parsedStrategies.filter((s) => s.enabled).length,
            totalStrategies: parsedStrategies.length,
          }))

          toast.success("Strategies refreshed")
        }
      }
    } catch (error) {
      console.error("Error loading strategies:", error)
      toast.error("Failed to refresh strategies")
    } finally {
      setIsLoading(false)
    }
  }

  // Filter strategies based on search term and active tab
  const filteredStrategies = useMemo(() => {
    const result = strategies.filter((strategy) => {
      // Text search
      const matchesSearch =
        strategy.portfolioName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        strategy.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        strategy.strategyTag.toLowerCase().includes(searchTerm.toLowerCase())

      // Tab filters
      const matchesTab =
        activeTab === "all" ||
        (activeTab === "active" && strategy.enabled) ||
        (activeTab === "disabled" && !strategy.enabled) ||
        (activeTab === "profitable" && Number.parseFloat(strategy.pnl) > 0) ||
        (activeTab === "losing" && Number.parseFloat(strategy.pnl) < 0)

      return matchesSearch && matchesTab
    })

    // Apply sorting if configured
    if (sortConfig !== null) {
      result.sort((a, b) => {
        // Handle numeric values
        if (sortConfig.key === "pnl") {
          if (Number.parseFloat(a[sortConfig.key]) < Number.parseFloat(b[sortConfig.key])) {
            return sortConfig.direction === "ascending" ? -1 : 1
          }
          if (Number.parseFloat(a[sortConfig.key]) > Number.parseFloat(b[sortConfig.key])) {
            return sortConfig.direction === "ascending" ? 1 : -1
          }
          return 0
        }

        // Handle string values
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1
        }
        return 0
      })
    }

    return result
  }, [strategies, searchTerm, activeTab, sortConfig])

  // Get status color based on status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-gradient-to-r from-emerald-500 to-teal-500 text-white"
      case "Disabled":
        return "bg-gradient-to-r from-slate-400 to-slate-500 text-white"
      default:
        return "bg-gradient-to-r from-slate-400 to-slate-500 text-white"
    }
  }

  // Get tag color based on tag
  const getTagColor = (tag: string) => {
    switch (tag) {
      case "16B":
        return "bg-gradient-to-r from-violet-500 to-purple-500 text-white"
      case "Strangle":
        return "bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
      case "Iron Condor":
        return "bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
      case "DEFAULT":
        return "bg-gradient-to-r from-slate-500 to-slate-600 text-white"
      case "INTRADAY":
        return "bg-gradient-to-r from-amber-500 to-orange-500 text-white"
      case "POSITIONAL":
        return "bg-gradient-to-r from-blue-500 to-sky-500 text-white"
      default:
        return "bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
    }
  }

  // Get symbol color based on symbol
  const getSymbolColor = (symbol: string) => {
    switch (symbol) {
      case "NIFTY":
        return "bg-gradient-to-r from-amber-500 to-yellow-500 text-white"
      case "BANKNIFTY":
        return "bg-gradient-to-r from-orange-500 to-amber-500 text-white"
      case "SENSEX":
        return "bg-gradient-to-r from-rose-500 to-pink-500 text-white"
      case "FINNIFTY":
        return "bg-gradient-to-r from-emerald-500 to-green-500 text-white"
      default:
        return "bg-gradient-to-r from-amber-500 to-yellow-500 text-white"
    }
  }

  // Get PnL color
  const getPnlColor = (pnl: string) => {
    const pnlValue = Number.parseFloat(pnl)
    if (pnlValue > 0) return "text-emerald-600 dark:text-emerald-400"
    if (pnlValue < 0) return "text-rose-600 dark:text-rose-400"
    return "text-slate-600 dark:text-slate-400"
  }

  // Get market data for a symbol
  const getMarketData = (symbol: string) => {
    return marketData.find((data) => data.symbol === symbol) || null
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col h-screen p-4 space-y-4">
        <div className="flex justify-center items-center h-full">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <p className="text-muted-foreground">Loading strategies...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <TooltipProvider>
      <div className="flex flex-col h-screen p-4 space-y-4">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 p-4 rounded-lg shadow-sm border border-slate-100 dark:border-slate-800">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Trading Strategies
            </h1>
            <p className="text-muted-foreground">Manage and monitor your multi-leg option strategies</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1 border-slate-200 shadow-sm"
              onClick={refreshStrategies}
            >
              <RefreshCw className="h-4 w-4" />
              <span className="hidden sm:inline">Refresh</span>
            </Button>

            <Button variant="outline" size="sm" className="flex items-center gap-1 border-slate-200 shadow-sm">
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Export</span>
            </Button>

            <Button variant="outline" size="sm" className="flex items-center gap-1 border-slate-200 shadow-sm">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Settings</span>
            </Button>

            <Button variant="outline" size="sm" className="flex items-center gap-1 border-slate-200 shadow-sm">
              <HelpCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Help</span>
            </Button>

            <Button
              onClick={handleAddStrategy}
              className="flex items-center gap-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md"
            >
              <Plus className="h-4 w-4" />
              <span>Add Strategy</span>
            </Button>
          </div>
        </div>

        {/* Performance Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card className="border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="text-muted-foreground text-sm">Total P&L</div>
                <Wallet className="h-4 w-4 text-blue-500" />
              </div>
              <div
                className={`text-2xl font-bold mt-2 ${performanceMetrics.totalPnL >= 0 ? "text-emerald-600" : "text-rose-600"}`}
              >
                {performanceMetrics.totalPnL >= 0 ? "+" : ""}₹{performanceMetrics.totalPnL.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="text-muted-foreground text-sm">Win Rate</div>
                <Percent className="h-4 w-4 text-emerald-500" />
              </div>
              <div className="text-2xl font-bold mt-2">{performanceMetrics.winRate}%</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="text-muted-foreground text-sm">Avg. Win</div>
                <TrendingUp className="h-4 w-4 text-emerald-500" />
              </div>
              <div className="text-2xl font-bold mt-2 text-emerald-600">
                ₹{performanceMetrics.avgWin.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="text-muted-foreground text-sm">Avg. Loss</div>
                <Activity className="h-4 w-4 text-rose-500" />
              </div>
              <div className="text-2xl font-bold mt-2 text-rose-600">
                ₹{performanceMetrics.avgLoss.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="text-muted-foreground text-sm">Active</div>
                <Gauge className="h-4 w-4 text-blue-500" />
              </div>
              <div className="text-2xl font-bold mt-2">
                {performanceMetrics.activeStrategies} / {performanceMetrics.totalStrategies}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="text-muted-foreground text-sm">Market Mood</div>
                <Sparkles className="h-4 w-4 text-amber-500" />
              </div>
              <div className="text-2xl font-bold mt-2 text-amber-600">Bullish</div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-950 p-4 rounded-lg shadow-sm border border-slate-100 dark:border-slate-800">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search strategies..."
                className="pl-8 border-slate-200 shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center border rounded-md overflow-hidden shadow-sm">
              <Button
                variant={viewMode === "table" ? "default" : "ghost"}
                size="sm"
                className={`rounded-none border-0 ${
                  viewMode === "table" ? "bg-gradient-to-r from-blue-600 to-indigo-600" : ""
                }`}
                onClick={() => setViewMode("table")}
              >
                <List className="h-4 w-4 mr-1" />
                Table
              </Button>
              <Button
                variant={viewMode === "card" ? "default" : "ghost"}
                size="sm"
                className={`rounded-none border-0 ${
                  viewMode === "card" ? "bg-gradient-to-r from-blue-600 to-indigo-600" : ""
                }`}
                onClick={() => setViewMode("card")}
              >
                <LayoutGrid className="h-4 w-4 mr-1" />
                Cards
              </Button>
              <Button
                variant={viewMode === "detailed" ? "default" : "ghost"}
                size="sm"
                className={`rounded-none border-0 ${
                  viewMode === "detailed" ? "bg-gradient-to-r from-blue-600 to-indigo-600" : ""
                }`}
                onClick={() => setViewMode("detailed")}
              >
                <Layers className="h-4 w-4 mr-1" />
                Detailed
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {selectedStrategies.length > 0 && (
              <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-md">
                <span className="text-sm text-blue-700 dark:text-blue-300">{selectedStrategies.length} selected</span>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs hover:bg-blue-100 hover:text-blue-700 dark:hover:bg-blue-800"
                    onClick={() => handleBulkAction("enable")}
                  >
                    Enable
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs hover:bg-blue-100 hover:text-blue-700 dark:hover:bg-blue-800"
                    onClick={() => handleBulkAction("disable")}
                  >
                    Disable
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs hover:bg-rose-100 hover:text-rose-700 dark:hover:bg-rose-900/30"
                    onClick={() => handleBulkAction("delete")}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-1 border-slate-200 shadow-sm">
                  <Filter className="h-4 w-4" />
                  <span>Filter</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="p-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Show Active</span>
                    <Switch
                      checked={filters.showActive}
                      onCheckedChange={(checked) => setFilters({ ...filters, showActive: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Show Disabled</span>
                    <Switch
                      checked={filters.showDisabled}
                      onCheckedChange={(checked) => setFilters({ ...filters, showDisabled: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Show Profitable</span>
                    <Switch
                      checked={filters.showProfitable}
                      onCheckedChange={(checked) => setFilters({ ...filters, showProfitable: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Show Loss Making</span>
                    <Switch
                      checked={filters.showLossMaking}
                      onCheckedChange={(checked) => setFilters({ ...filters, showLossMaking: checked })}
                    />
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <InstrumentSelector
              className="w-[180px]"
              onSelect={(value) => console.log("Selected instrument:", value)}
            />
          </div>
        </div>

        {/* Tabs and Main Content */}
        <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-5 w-full md:w-auto">
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600"
            >
              All
            </TabsTrigger>
            <TabsTrigger
              value="active"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-teal-600"
            >
              Active
            </TabsTrigger>
            <TabsTrigger
              value="disabled"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-slate-600 data-[state=active]:to-slate-700"
            >
              Disabled
            </TabsTrigger>
            <TabsTrigger
              value="profitable"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-green-600"
            >
              Profitable
            </TabsTrigger>
            <TabsTrigger
              value="losing"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-rose-600 data-[state=active]:to-red-600"
            >
              Losing
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-0 flex-1">
            {viewMode === "table" ? (
              <Card className="flex-1 border-slate-200 shadow-md overflow-hidden">
                {/* Table view content - keep the existing code */}
                <CardHeader className="py-3 bg-gradient-to-r from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 border-b">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Layers className="h-4 w-4 text-blue-600" />
                    Strategy List
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-auto">
                    <Table>
                      {/* Keep the existing table code */}
                      <TableHeader>
                        <TableRow className="bg-slate-50 dark:bg-slate-900">
                          <TableHead className="w-10">
                            <Checkbox
                              checked={
                                selectedStrategies.length === filteredStrategies.length && filteredStrategies.length > 0
                              }
                              onCheckedChange={handleSelectAll}
                              aria-label="Select all strategies"
                            />
                          </TableHead>
                          <TableHead className="w-20">
                            <div
                              className="flex items-center gap-1 cursor-pointer"
                              onClick={() => requestSort("enabled")}
                            >
                              Enabled
                              <Filter className="h-3 w-3" />
                            </div>
                          </TableHead>
                          <TableHead>
                            <div
                              className="flex items-center gap-1 cursor-pointer"
                              onClick={() => requestSort("status")}
                            >
                              Status
                              <Filter className="h-3 w-3" />
                            </div>
                          </TableHead>
                          <TableHead>
                            <div
                              className="flex items-center gap-1 cursor-pointer"
                              onClick={() => requestSort("portfolioName")}
                            >
                              Portfolio Name
                              <Filter className="h-3 w-3" />
                            </div>
                          </TableHead>
                          <TableHead>
                            <div
                              className="flex items-center gap-1 cursor-pointer"
                              onClick={() => requestSort("product")}
                            >
                              Product
                              <Filter className="h-3 w-3" />
                            </div>
                          </TableHead>
                          <TableHead>
                            <div
                              className="flex items-center gap-1 cursor-pointer"
                              onClick={() => requestSort("symbol")}
                            >
                              Symbol
                              <Filter className="h-3 w-3" />
                            </div>
                          </TableHead>
                          <TableHead>
                            <div
                              className="flex items-center gap-1 cursor-pointer"
                              onClick={() => requestSort("strategyTag")}
                            >
                              Strategy Tag
                              <Filter className="h-3 w-3" />
                            </div>
                          </TableHead>
                          <TableHead>Edit</TableHead>
                          <TableHead>
                            <div
                              className="flex items-center gap-1 cursor-pointer"
                              onClick={() => requestSort("startTime")}
                            >
                              Start Time
                              <Filter className="h-3 w-3" />
                            </div>
                          </TableHead>
                          <TableHead>
                            <div
                              className="flex items-center gap-1 cursor-pointer"
                              onClick={() => requestSort("endTime")}
                            >
                              End Time
                              <Filter className="h-3 w-3" />
                            </div>
                          </TableHead>
                          <TableHead>
                            <div
                              className="flex items-center gap-1 cursor-pointer"
                              onClick={() => requestSort("sqOffTime")}
                            >
                              SqOff Time
                              <Filter className="h-3 w-3" />
                            </div>
                          </TableHead>
                          <TableHead>Clone</TableHead>
                          <TableHead>
                            <div className="flex items-center gap-1 cursor-pointer" onClick={() => requestSort("pnl")}>
                              PNL
                              <Filter className="h-3 w-3" />
                            </div>
                          </TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredStrategies.length > 0 ? (
                          filteredStrategies.map((strategy) => (
                            <TableRow
                              key={strategy.id}
                              className={`transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
                                selectedStrategies.includes(strategy.id) ? "bg-blue-50 dark:bg-blue-900/20" : ""
                              }`}
                            >
                              <TableCell>
                                <Checkbox
                                  checked={selectedStrategies.includes(strategy.id)}
                                  onCheckedChange={() => handleSelectStrategy(strategy.id)}
                                  aria-label={`Select ${strategy.portfolioName}`}
                                />
                              </TableCell>
                              <TableCell>
                                <div className="flex justify-center">
                                  <Toggle
                                    aria-label="Toggle strategy"
                                    pressed={strategy.enabled}
                                    onPressedChange={() => handleToggleEnabled(strategy.id)}
                                    size="sm"
                                    className="data-[state=on]:bg-gradient-to-r data-[state=on]:from-emerald-500 data-[state=on]:to-teal-500"
                                  />
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  className={`${getStatusColor(
                                    strategy.status,
                                  )} border-0 shadow-sm hover:shadow-md transition-shadow`}
                                >
                                  {strategy.status === "Active" ? (
                                    <CheckCircle2 className="h-3 w-3 mr-1" />
                                  ) : (
                                    <XCircle className="h-3 w-3 mr-1" />
                                  )}
                                  {strategy.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="font-medium">{strategy.portfolioName}</TableCell>
                              <TableCell>{strategy.product}</TableCell>
                              <TableCell>
                                <Badge
                                  className={`${getSymbolColor(
                                    strategy.symbol,
                                  )} border-0 shadow-sm hover:shadow-md transition-shadow`}
                                >
                                  {strategy.symbol}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  className={`${getTagColor(
                                    strategy.strategyTag,
                                  )} border-0 shadow-sm hover:shadow-md transition-shadow`}
                                >
                                  {strategy.strategyTag}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Tooltip content="Edit strategy">
                                  <button
                                    className="p-1 rounded-full hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                    onClick={() => handleEditStrategy(strategy.portfolioName)}
                                  >
                                    <Edit2 className="h-4 w-4" />
                                  </button>
                                </Tooltip>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3 text-slate-400" />
                                  {strategy.startTime}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3 text-slate-400" />
                                  {strategy.endTime}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3 text-slate-400" />
                                  {strategy.sqOffTime}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Tooltip content="Clone strategy">
                                  <button
                                    className="p-1 rounded-full hover:bg-amber-50 hover:text-amber-600 transition-colors"
                                    onClick={() => handleCloneStrategy(strategy.id)}
                                  >
                                    <Copy className="h-4 w-4 text-amber-500" />
                                  </button>
                                </Tooltip>
                              </TableCell>
                              <TableCell>
                                <span className={`font-medium ${getPnlColor(strategy.pnl)}`}>
                                  {Number.parseFloat(strategy.pnl) > 0 && "+"}
                                  {strategy.pnl}
                                </span>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1">
                                  <Tooltip content="Execute strategy">
                                    <button className="p-1 rounded-full hover:bg-emerald-50 hover:text-emerald-600 transition-colors">
                                      <PlayCircle className="h-4 w-4 text-emerald-500" />
                                    </button>
                                  </Tooltip>
                                  <Tooltip content="Delete strategy">
                                    <button
                                      className="p-1 rounded-full hover:bg-rose-50 hover:text-rose-600 transition-colors"
                                      onClick={() => handleDeleteStrategy(strategy.id)}
                                    >
                                      <Trash2 className="h-4 w-4 text-rose-500" />
                                    </button>
                                  </Tooltip>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={15} className="text-center py-8">
                              <div className="flex flex-col items-center justify-center text-muted-foreground">
                                <Info className="h-10 w-10 mb-2" />
                                <p>No strategies found matching your search criteria</p>
                                <Button variant="link" onClick={() => setSearchTerm("")} className="mt-2">
                                  Clear search
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            ) : viewMode === "card" ? (
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-auto pb-4">
                {filteredStrategies.length > 0 ? (
                  filteredStrategies.map((strategy) => (
                    <Card
                      key={strategy.id}
                      className={`border-slate-200 shadow-lg hover:shadow-xl transition-all overflow-hidden ${
                        expandedCards.includes(strategy.id)
                          ? "bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800"
                          : "bg-white dark:bg-slate-950"
                      } ${selectedStrategies.includes(strategy.id) ? "ring-2 ring-blue-500 ring-offset-2" : ""}`}
                      onMouseEnter={() => setHoveredStrategy(strategy.id)}
                      onMouseLeave={() => setHoveredStrategy(null)}
                    >
                      <div
                        className={`h-1 w-full ${
                          strategy.status === "Active"
                            ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                            : "bg-gradient-to-r from-slate-400 to-slate-500"
                        }`}
                      ></div>
                      <CardHeader className="pb-2 pt-4 px-4 flex flex-row items-start justify-between space-y-0">
                        <div>
                          <CardTitle className="text-base font-medium flex items-center gap-2">
                            {strategy.portfolioName}
                            {strategy.enabled && (
                              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            )}
                          </CardTitle>
                          <div className="flex items-center gap-2 mt-2 flex-wrap">
                            <Badge
                              className={`${getStatusColor(
                                strategy.status,
                              )} border-0 shadow-sm hover:shadow-md transition-shadow`}
                            >
                              {strategy.status === "Active" ? (
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                              ) : (
                                <XCircle className="h-3 w-3 mr-1" />
                              )}
                              {strategy.status}
                            </Badge>
                            <Badge
                              className={`${getTagColor(
                                strategy.strategyTag,
                              )} border-0 shadow-sm hover:shadow-md transition-shadow`}
                            >
                              {strategy.strategyTag}
                            </Badge>
                            <Badge
                              className={`${getSymbolColor(
                                strategy.symbol,
                              )} border-0 shadow-sm hover:shadow-md transition-shadow`}
                            >
                              {strategy.symbol}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={selectedStrategies.includes(strategy.id)}
                            onCheckedChange={() => handleSelectStrategy(strategy.id)}
                            aria-label={`Select ${strategy.portfolioName}`}
                          />
                          <Toggle
                            aria-label="Toggle strategy"
                            pressed={strategy.enabled}
                            onPressedChange={() => handleToggleEnabled(strategy.id)}
                            size="sm"
                            className="data-[state=on]:bg-gradient-to-r data-[state=on]:from-emerald-500 data-[state=on]:to-teal-500"
                          />
                          <button
                            onClick={() => toggleCardExpand(strategy.id)}
                            className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          >
                            {expandedCards.includes(strategy.id) ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </CardHeader>
                      <CardContent className="px-4 py-2">
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="flex flex-col">
                            <span className="text-muted-foreground text-xs flex items-center gap-1">
                              <BarChart3 className="h-3 w-3" /> Product
                            </span>
                            <span className="font-medium">{strategy.product}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-muted-foreground text-xs flex items-center gap-1">
                              <ArrowUpRight className="h-3 w-3" /> PNL
                            </span>
                            <span className={`font-medium text-lg ${getPnlColor(strategy.pnl)}`}>
                              {Number.parseFloat(strategy.pnl) > 0 && "+"}
                              {strategy.pnl}
                            </span>
                          </div>
                        </div>

                        {expandedCards.includes(strategy.id) && (
                          <div className="mt-3 pt-3 border-t grid grid-cols-2 gap-3 text-sm">
                            <div className="flex flex-col">
                              <span className="text-muted-foreground text-xs flex items-center gap-1">
                                <Calendar className="h-3 w-3" /> Start Time
                              </span>
                              <span className="font-medium">{strategy.startTime}</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-muted-foreground text-xs flex items-center gap-1">
                                <Calendar className="h-3 w-3" /> End Time
                              </span>
                              <span className="font-medium">{strategy.endTime}</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-muted-foreground text-xs flex items-center gap-1">
                                <Calendar className="h-3 w-3" /> SqOff Time
                              </span>
                              <span className="font-medium">{strategy.sqOffTime}</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-muted-foreground text-xs flex items-center gap-1">
                                <Layers className="h-3 w-3" /> Legs
                              </span>
                              <span className="font-medium">{strategy.legs?.length || 0}</span>
                            </div>
                          </div>
                        )}

                        {/* Market data if available */}
                        {getMarketData(strategy.symbol) && (
                          <div className="mt-3 pt-3 border-t">
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-muted-foreground">Market Price</span>
                              <span
                                className={`text-sm font-medium ${getMarketData(strategy.symbol)!.change >= 0 ? "text-emerald-600" : "text-rose-600"}`}
                              >
                                {getMarketData(strategy.symbol)!.ltp.toLocaleString()}
                                <span className="ml-1 text-xs">
                                  ({getMarketData(strategy.symbol)!.change >= 0 ? "+" : ""}
                                  {getMarketData(strategy.symbol)!.changePercent.toFixed(2)}%)
                                </span>
                              </span>
                            </div>
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="px-4 py-3 flex justify-between bg-slate-50 dark:bg-slate-900/50">
                        <div className="flex items-center gap-1">
                          <Tooltip content="Edit strategy">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-full hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900/30"
                              onClick={() => handleEditStrategy(strategy.portfolioName)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                          </Tooltip>
                          <Tooltip content="Clone strategy">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-full hover:bg-amber-100 hover:text-amber-600 dark:hover:bg-amber-900/30"
                              onClick={() => handleCloneStrategy(strategy.id)}
                            >
                              <Copy className="h-4 w-4 text-amber-500" />
                            </Button>
                          </Tooltip>
                        </div>
                        <div className="flex items-center gap-1">
                          <Tooltip content="Execute strategy">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-full hover:bg-emerald-100 hover:text-emerald-600 dark:hover:bg-emerald-900/30"
                            >
                              <PlayCircle className="h-4 w-4 text-emerald-500" />
                            </Button>
                          </Tooltip>
                          <Tooltip content="Delete strategy">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-full hover:bg-rose-100 hover:text-rose-600 dark:hover:bg-rose-900/30"
                              onClick={() => handleDeleteStrategy(strategy.id)}
                            >
                              <Trash2 className="h-4 w-4 text-rose-500" />
                            </Button>
                          </Tooltip>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                              >
                                <Settings className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleEditStrategy(strategy.portfolioName)}>
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleCloneStrategy(strategy.id)}>
                                Clone
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDeleteStrategy(strategy.id)}>
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-3 flex flex-col items-center justify-center py-8">
                    <Info className="h-10 w-10 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No strategies found matching your search criteria.</p>
                    <Button variant="link" onClick={() => setSearchTerm("")}>
                      Clear Search
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-muted-foreground">Detailed view is not implemented yet.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="active" className="mt-2">
            <p>This is the active strategies tab content.</p>
          </TabsContent>

          <TabsContent value="disabled" className="mt-2">
            <p>This is the disabled strategies tab content.</p>
          </TabsContent>

          <TabsContent value="profitable" className="mt-2">
            <p>This is the profitable strategies tab content.</p>
          </TabsContent>

          <TabsContent value="losing" className="mt-2">
            <p>This is the losing strategies tab content.</p>
          </TabsContent>
        </Tabs>
      </div>
    </TooltipProvider>
  )
}
