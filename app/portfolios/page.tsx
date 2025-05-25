"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Settings,
  Plus,
  Search,
  Trash2,
  Calendar,
  RotateCw,
  Users,
  Save,
  X,
  ChevronDown,
  MoreHorizontal,
  ArrowUpRight,
  DollarSign,
  Shield,
  RefreshCw,
  Lock,
  Briefcase,
  Filter,
  ChevronUp,
  Edit,
  TrendingUp,
  Clock,
  ArrowRightLeft,
  Play,
  Square,
  AlertTriangle,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function PortfolioList() {
  const router = useRouter()
  const { toast } = useToast()
  const [portfolios, setPortfolios] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [expandedPortfolioId, setExpandedPortfolioId] = useState(null)
  const [activeTab, setActiveTab] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [livePortfolios, setLivePortfolios] = useState(new Set())

  const [showUserAssignDialog, setShowUserAssignDialog] = useState(false)
  const [showRetryMechanismDialog, setShowRetryMechanismDialog] = useState(false)
  const [showProfitLockingDialog, setShowProfitLockingDialog] = useState(false)
  const [showProfitTrailingDialog, setShowProfitTrailingDialog] = useState(false)
  const [showGoLiveDialog, setShowGoLiveDialog] = useState(false)
  const [selectedPortfoliosForLive, setSelectedPortfoliosForLive] = useState([])

  const [selectedPortfolioForUser, setSelectedPortfolioForUser] = useState(null)
  const [selectedPortfolioForSettings, setSelectedPortfolioForSettings] = useState(null)
  const [availableUsers, setAvailableUsers] = useState([])
  const [selectedUsers, setSelectedUsers] = useState([])
  const [editableSettings, setEditableSettings] = useState({})

  const [showSquareOffDialog, setShowSquareOffDialog] = useState(false)
  const [selectedPortfolioForSquareOff, setSelectedPortfolioForSquareOff] = useState(null)
  const [squareOffPositions, setSquareOffPositions] = useState([])

  // Retry mechanism settings
  const [retrySettings, setRetrySettings] = useState({
    entryOrderRetry: false,
    entryRetryCount: 3,
    entryRetryWaitSeconds: 5,
    entryMaxWaitSeconds: 30,
    exitOrderRetry: false,
    exitRetryCount: 3,
    exitRetryWaitSeconds: 5,
    exitMaxWaitSeconds: 30,
  })

  // Profit locking settings
  const [profitLockingSettings, setProfitLockingSettings] = useState({
    enabled: false,
    profitThreshold: 1000,
    minimumProfitLock: 500,
  })

  // Profit trailing settings
  const [profitTrailingSettings, setProfitTrailingSettings] = useState({
    enabled: false,
    increaseBy: 500,
    trailBy: 200,
  })

  // Load live portfolios from localStorage on component mount
  useEffect(() => {
    const savedLivePortfolios = localStorage.getItem("livePortfolios")
    if (savedLivePortfolios) {
      try {
        const livePortfolioIds = JSON.parse(savedLivePortfolios)
        setLivePortfolios(new Set(livePortfolioIds))
      } catch (error) {
        console.error("Error loading live portfolios:", error)
      }
    }
  }, [])

  // Save live portfolios to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("livePortfolios", JSON.stringify(Array.from(livePortfolios)))
  }, [livePortfolios])

  // Load portfolios from localStorage on component mount
  useEffect(() => {
    const loadPortfolios = () => {
      setIsLoading(true)
      try {
        // Get all keys from localStorage
        const keys = Object.keys(localStorage)

        // Filter keys that start with "portfolio_" AND were created from strategies
        const portfolioKeys = keys.filter((key) => {
          if (!key.startsWith("portfolio_")) return false

          try {
            const data = JSON.parse(localStorage.getItem(key))
            // Only include portfolios that were created from strategies page
            return data && typeof data === "object" && data.createdFromStrategies === true
          } catch {
            return false
          }
        })

        if (portfolioKeys.length === 0) {
          setPortfolios([])
          setIsLoading(false)
          return
        }

        // Load each portfolio
        const loadedPortfolios = portfolioKeys
          .map((key) => {
            try {
              const portfolioData = JSON.parse(localStorage.getItem(key))

              if (!portfolioData) {
                return null
              }

              // Extract strategies if they exist
              const strategies = portfolioData.strategies || []

              return {
                id: key,
                name: portfolioData.name || "Unnamed Portfolio",
                timestamp: portfolioData.timestamp || new Date().toISOString(),
                // Portfolio settings with defaults
                settings: portfolioData.settings || {
                  maxProfit: 0,
                  maxLoss: 0,
                  profitLocking: {
                    enabled: false,
                    profitThreshold: 1000,
                    minimumProfitLock: 500,
                  },
                  retryMechanism: {
                    entryOrderRetry: false,
                    entryRetryCount: 3,
                    entryRetryWaitSeconds: 5,
                    entryMaxWaitSeconds: 30,
                    exitOrderRetry: false,
                    exitRetryCount: 3,
                    exitRetryWaitSeconds: 5,
                    exitMaxWaitSeconds: 30,
                  },
                  profitTrailing: {
                    enabled: false,
                    increaseBy: 500,
                    trailBy: 200,
                  },
                  assignedUsers: [],
                  trailingSettings: {
                    enabled: false,
                    trailPercent: 0,
                    triggerPercent: 0,
                  },
                },
                // For filtering - use portfolio type if available, otherwise default
                type: portfolioData.type || "other",
                // Store strategies count
                strategiesCount: strategies.length,
              }
            } catch (error) {
              console.error(`Error parsing portfolio data for key ${key}:`, error)
              return null
            }
          })
          .filter(Boolean) // Remove null entries

        // Sort portfolios
        loadedPortfolios.sort((a, b) => {
          if (sortBy === "newest") {
            return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          } else if (sortBy === "name") {
            return a.name.localeCompare(b.name)
          }
          return 0
        })

        setPortfolios(loadedPortfolios)
      } catch (error) {
        console.error("Error loading portfolios:", error)
        toast({
          title: "Error",
          description: "Failed to load portfolios",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadPortfolios()
  }, [sortBy])

  // Load available users from localStorage (from user settings page)
  const loadAvailableUsers = () => {
    try {
      // Get all keys from localStorage
      const keys = Object.keys(localStorage)

      // This would normally come from a users data structure
      // For now, we'll create some sample users based on the user settings page structure
      const sampleUsers = [
        { id: 1, alias: "SIMULATED1", userId: "SIM1", broker: "APITest", enabled: true, loggedIn: true },
        { id: 2, alias: "ABHINAV", userId: "ZU4216", broker: "Zerodha", enabled: true, loggedIn: true },
        { id: 3, alias: "MAYANK", userId: "YV8917", broker: "Zerodha", enabled: true, loggedIn: true },
        { id: 4, alias: "SATISH", userId: "DA2311", broker: "Zerodha", enabled: true, loggedIn: true },
        { id: 5, alias: "DIKSHYA", userId: "YC7167", broker: "Zerodha", enabled: true, loggedIn: false },
        { id: 6, alias: "RIDDHI", userId: "YS7077", broker: "Zerodha", enabled: false, loggedIn: false },
      ]

      setAvailableUsers(sampleUsers)
    } catch (error) {
      console.error("Error loading users:", error)
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive",
      })
    }
  }

  // Save portfolio settings
  const savePortfolioSettings = (portfolioId, newSettings) => {
    try {
      const portfolioData = JSON.parse(localStorage.getItem(portfolioId))
      portfolioData.settings = newSettings
      localStorage.setItem(portfolioId, JSON.stringify(portfolioData))

      // Update local state
      setPortfolios(portfolios.map((p) => (p.id === portfolioId ? { ...p, settings: newSettings } : p)))

      toast({
        title: "Success",
        description: "Portfolio settings saved successfully",
      })
    } catch (error) {
      console.error("Error saving portfolio settings:", error)
      toast({
        title: "Error",
        description: "Failed to save portfolio settings",
        variant: "destructive",
      })
    }
  }

  // Handle portfolio deletion
  const handleDelete = (id, e) => {
    e.stopPropagation()
    try {
      localStorage.removeItem(id)
      setPortfolios(portfolios.filter((p) => p.id !== id))
      // Remove from live portfolios if it was live
      setLivePortfolios((prev) => {
        const newSet = new Set(prev)
        newSet.delete(id)
        return newSet
      })
      toast({
        title: "Success",
        description: "Portfolio deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting portfolio:", error)
      toast({
        title: "Error",
        description: "Failed to delete portfolio",
        variant: "destructive",
      })
    }
  }

  // Handle stop live for individual portfolio with square off confirmation
  const handleStopLive = (portfolioId, e) => {
    e.stopPropagation()

    // Get portfolio details
    const portfolio = portfolios.find((p) => p.id === portfolioId)

    // Load associated positions for this portfolio (mock data for now)
    const mockPositions = [
      {
        id: 1,
        symbol: "NIFTY 24350 CE",
        quantity: 50,
        avgPrice: 125.5,
        currentPrice: 142.3,
        pnl: 840,
        type: "BUY",
      },
      {
        id: 2,
        symbol: "BANKNIFTY 52000 PE",
        quantity: 25,
        avgPrice: 89.75,
        currentPrice: 76.2,
        pnl: -338.75,
        type: "BUY",
      },
      {
        id: 3,
        symbol: "RELIANCE",
        quantity: 10,
        avgPrice: 2450.0,
        currentPrice: 2478.5,
        pnl: 285,
        type: "BUY",
      },
    ]

    setSelectedPortfolioForSquareOff(portfolio)
    setSquareOffPositions(mockPositions)
    setShowSquareOffDialog(true)
  }

  // Handle square off confirmation
  const handleConfirmSquareOff = () => {
    if (selectedPortfolioForSquareOff) {
      // Remove from live portfolios
      setLivePortfolios((prev) => {
        const newSet = new Set(prev)
        newSet.delete(selectedPortfolioForSquareOff.id)
        return newSet
      })

      // Show success message
      toast({
        title: "Portfolio Stopped",
        description: `${selectedPortfolioForSquareOff.name} stopped and all ${squareOffPositions.length} positions squared off successfully`,
      })

      // Close dialog and reset state
      setShowSquareOffDialog(false)
      setSelectedPortfolioForSquareOff(null)
      setSquareOffPositions([])

      // Here you would implement the actual square off logic
      console.log("Squaring off positions for portfolio:", selectedPortfolioForSquareOff.id, squareOffPositions)
    }
  }

  // Handle assign user
  const handleAssignUser = (portfolioId, e) => {
    if (e) e.stopPropagation()
    setSelectedPortfolioForUser(portfolioId)
    loadAvailableUsers()

    // Load currently assigned users for this portfolio
    const portfolio = portfolios.find((p) => p.id === portfolioId)
    setSelectedUsers(portfolio.settings.assignedUsers || [])

    setShowUserAssignDialog(true)
  }

  // Handle retry mechanism dialog
  const handleRetryMechanism = (portfolioId, e) => {
    if (e) e.stopPropagation()
    setSelectedPortfolioForSettings(portfolioId)

    // Load current retry settings
    const portfolio = portfolios.find((p) => p.id === portfolioId)
    setRetrySettings(
      portfolio.settings.retryMechanism || {
        entryOrderRetry: false,
        entryRetryCount: 3,
        entryRetryWaitSeconds: 5,
        entryMaxWaitSeconds: 30,
        exitOrderRetry: false,
        exitRetryCount: 3,
        exitRetryWaitSeconds: 5,
        exitMaxWaitSeconds: 30,
      },
    )

    setShowRetryMechanismDialog(true)
  }

  // Handle profit locking dialog
  const handleProfitLocking = (portfolioId, e) => {
    if (e) e.stopPropagation()
    setSelectedPortfolioForSettings(portfolioId)

    // Load current profit locking settings
    const portfolio = portfolios.find((p) => p.id === portfolioId)
    setProfitLockingSettings(
      portfolio.settings.profitLocking || {
        enabled: false,
        profitThreshold: 1000,
        minimumProfitLock: 500,
      },
    )

    setShowProfitLockingDialog(true)
  }

  // Handle profit trailing dialog
  const handleProfitTrailing = (portfolioId, e) => {
    if (e) e.stopPropagation()
    setSelectedPortfolioForSettings(portfolioId)

    // Load current profit trailing settings
    const portfolio = portfolios.find((p) => p.id === portfolioId)
    setProfitTrailingSettings(
      portfolio.settings.profitTrailing || {
        enabled: false,
        increaseBy: 500,
        trailBy: 200,
      },
    )

    setShowProfitTrailingDialog(true)
  }

  // Handle go live dialog
  const handleGoLive = () => {
    setSelectedPortfoliosForLive([])
    setShowGoLiveDialog(true)
  }

  // Handle portfolio selection for go live
  const handlePortfolioSelection = (portfolioId) => {
    setSelectedPortfoliosForLive((prev) => {
      if (prev.includes(portfolioId)) {
        return prev.filter((id) => id !== portfolioId)
      } else {
        return [...prev, portfolioId]
      }
    })
  }

  // Handle go live execution
  const handleExecuteGoLive = () => {
    if (selectedPortfoliosForLive.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one portfolio to go live",
        variant: "destructive",
      })
      return
    }

    // Add selected portfolios to live portfolios
    setLivePortfolios((prev) => {
      const newSet = new Set(prev)
      selectedPortfoliosForLive.forEach((id) => newSet.add(id))
      return newSet
    })

    const selectedPortfolioNames = portfolios.filter((p) => selectedPortfoliosForLive.includes(p.id)).map((p) => p.name)

    toast({
      title: "Success",
      description: `${selectedPortfoliosForLive.length} portfolio(s) are now LIVE: ${selectedPortfolioNames.join(", ")}`,
    })
    setShowGoLiveDialog(false)
    setSelectedPortfoliosForLive([])

    // Add your go live logic here
    console.log("Going live with portfolios:", selectedPortfoliosForLive)
  }

  // Handle save user assignments
  const handleSaveUserAssignments = () => {
    if (selectedPortfolioForUser) {
      const portfolio = portfolios.find((p) => p.id === selectedPortfolioForUser)
      const newSettings = {
        ...portfolio.settings,
        assignedUsers: selectedUsers,
      }
      savePortfolioSettings(selectedPortfolioForUser, newSettings)
      setShowUserAssignDialog(false)
      setSelectedPortfolioForUser(null)
      setSelectedUsers([])
    }
  }

  // Handle save retry mechanism settings
  const handleSaveRetrySettings = () => {
    if (selectedPortfolioForSettings) {
      const portfolio = portfolios.find((p) => p.id === selectedPortfolioForSettings)
      const newSettings = {
        ...portfolio.settings,
        retryMechanism: retrySettings,
      }
      savePortfolioSettings(selectedPortfolioForSettings, newSettings)
      setShowRetryMechanismDialog(false)
      setSelectedPortfolioForSettings(null)
    }
  }

  // Handle save profit locking settings
  const handleSaveProfitLockingSettings = () => {
    if (selectedPortfolioForSettings) {
      const portfolio = portfolios.find((p) => p.id === selectedPortfolioForSettings)
      const newSettings = {
        ...portfolio.settings,
        profitLocking: profitLockingSettings,
      }
      savePortfolioSettings(selectedPortfolioForSettings, newSettings)
      setShowProfitLockingDialog(false)
      setSelectedPortfolioForSettings(null)
    }
  }

  // Handle save profit trailing settings
  const handleSaveProfitTrailingSettings = () => {
    if (selectedPortfolioForSettings) {
      const portfolio = portfolios.find((p) => p.id === selectedPortfolioForSettings)
      const newSettings = {
        ...portfolio.settings,
        profitTrailing: profitTrailingSettings,
      }
      savePortfolioSettings(selectedPortfolioForSettings, newSettings)
      setShowProfitTrailingDialog(false)
      setSelectedPortfolioForSettings(null)
    }
  }

  // Handle user selection in dialog
  const handleUserSelection = (user, multiplier = 1) => {
    const existingUserIndex = selectedUsers.findIndex((u) => u.id === user.id)

    if (existingUserIndex >= 0) {
      // Update existing user
      const updatedUsers = [...selectedUsers]
      updatedUsers[existingUserIndex] = { ...user, multiplier }
      setSelectedUsers(updatedUsers)
    } else {
      // Add new user
      setSelectedUsers([...selectedUsers, { ...user, multiplier }])
    }
  }

  // Handle user removal
  const handleUserRemoval = (userId) => {
    setSelectedUsers(selectedUsers.filter((u) => u.id !== userId))
  }

  // Handle card click to expand/collapse
  const handleCardClick = (portfolioId) => {
    if (expandedPortfolioId === portfolioId) {
      setExpandedPortfolioId(null)
    } else {
      setExpandedPortfolioId(portfolioId)
      // Initialize editable settings with current portfolio settings
      const portfolio = portfolios.find((p) => p.id === portfolioId)
      setEditableSettings({ ...portfolio.settings })
    }
  }

  // Handle settings change
  const handleSettingsChange = (field, value) => {
    setEditableSettings((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Handle save settings
  const handleSaveSettings = (portfolioId) => {
    savePortfolioSettings(portfolioId, editableSettings)
    setExpandedPortfolioId(null)
  }

  const filteredPortfolios = portfolios.filter((portfolio) => {
    // Only filter by portfolio name
    const matchesSearch = portfolio.name.toLowerCase().includes(searchTerm.toLowerCase())

    // Then filter by tab
    if (activeTab === "all") return matchesSearch
    if (activeTab === "intraday") return matchesSearch && portfolio.type === "intraday"
    if (activeTab === "positional") return matchesSearch && portfolio.type === "positional"
    return matchesSearch
  })

  // Format date for display
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    } catch (e) {
      return "Unknown date"
    }
  }

  // Handle create new portfolio
  const handleCreateNew = () => {
    // Show toast immediately before navigation
    toast({
      title: "Info",
      description: "Select strategies to add to a new portfolio",
    })

    // Use direct navigation without setTimeout
    window.location.href = "/strategies"
  }

  // Handle view portfolio
  const handleViewPortfolio = (id, e) => {
    e.stopPropagation()
    router.push(`/?portfolioId=${id}`)
  }

  // Handle refresh
  const handleRefresh = () => {
    window.location.reload()
  }

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Portfolio Manager</h1>
            <p className="text-muted-foreground mt-1">Manage your trading portfolios in one place</p>
          </div>

          <div className="flex gap-3">
            <Button
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              onClick={handleCreateNew}
            >
              <Plus className="h-4 w-4 mr-2" />
              Go to Strategies
            </Button>

            <Button
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
              onClick={handleGoLive}
            >
              <div className="flex items-center">
                <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                Go Live
              </div>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="relative col-span-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search portfolios by name..."
              className="pl-10 bg-background"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  <div className="flex items-center">
                    <Filter className="h-4 w-4 mr-2" />
                    <span>Sort: {sortBy === "newest" ? "Newest" : "Name"}</span>
                  </div>
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setSortBy("newest")}>Newest First</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("name")}>Name</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isLoading}>
              {isLoading ? <RotateCw className="h-4 w-4 animate-spin" /> : <RotateCw className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="grid grid-cols-4 md:w-[400px]">
            <TabsTrigger value="all">All Portfolios</TabsTrigger>
            <TabsTrigger value="intraday">Intraday</TabsTrigger>
            <TabsTrigger value="positional">Positional</TabsTrigger>
            <TabsTrigger value="other">Other</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Portfolios List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          // Loading state
          Array(6)
            .fill(0)
            .map((_, index) => (
              <Card key={`skeleton-${index}`} className="overflow-hidden border border-border/40">
                <CardHeader className="pb-2">
                  <div className="animate-pulse">
                    <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="animate-pulse">
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded w-full"></div>
                      <div className="h-4 bg-muted rounded w-full"></div>
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="animate-pulse w-full">
                    <div className="h-8 bg-muted rounded w-full"></div>
                  </div>
                </CardFooter>
              </Card>
            ))
        ) : filteredPortfolios.length === 0 ? (
          // Empty state
          <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
            <div className="bg-muted rounded-full p-6 mb-6">
              <Briefcase className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-medium mb-3">No portfolios found</h3>
            <p className="text-muted-foreground mb-8 max-w-md">
              {searchTerm
                ? "Try adjusting your search to find what you're looking for."
                : "To create a portfolio, first select strategies from the strategies page and click 'Add to Portfolios'."}
            </p>
            <Button
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              onClick={handleCreateNew}
            >
              <Plus className="h-4 w-4 mr-2" />
              Go to Strategies
            </Button>
          </div>
        ) : (
          // Portfolio cards
          filteredPortfolios.map((portfolio) => {
            const isLive = livePortfolios.has(portfolio.id)

            return (
              <Card
                key={portfolio.id}
                className={`overflow-hidden border transition-all hover:shadow-md cursor-pointer ${
                  expandedPortfolioId === portfolio.id
                    ? "border-blue-400 shadow-md"
                    : isLive
                      ? "border-green-400 shadow-sm bg-green-50/30 dark:bg-green-900/10"
                      : "border-border/40"
                }`}
                onClick={() => handleCardClick(portfolio.id)}
                data-editable={expandedPortfolioId === portfolio.id}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle className="text-lg">{portfolio.name}</CardTitle>
                        {isLive ? (
                          <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white animate-pulse">
                            <Play className="h-3 w-3 mr-1" />
                            LIVE
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-gray-100 text-gray-600 border-gray-300">
                            <Square className="h-3 w-3 mr-1" />
                            NOT LIVE
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="flex items-center mt-1">
                        <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
                        {formatDate(portfolio.timestamp)}
                      </CardDescription>
                    </div>
                    <div className="flex items-center">
                      {isLive && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="mr-2 text-red-600 border-red-300 hover:bg-red-50"
                          onClick={(e) => handleStopLive(portfolio.id, e)}
                        >
                          <Square className="h-3 w-3 mr-1" />
                          Stop
                        </Button>
                      )}
                      {expandedPortfolioId === portfolio.id ? (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-blue-500"
                          onClick={(e) => {
                            e.stopPropagation()
                            setExpandedPortfolioId(null)
                          }}
                        >
                          <ChevronUp className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleCardClick(portfolio.id)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={(e) => handleViewPortfolio(portfolio.id, e)}>
                            <ArrowUpRight className="h-4 w-4 mr-2" />
                            View Portfolio
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation()
                              handleCardClick(portfolio.id)
                            }}
                          >
                            <Settings className="h-4 w-4 mr-2" />
                            Edit Settings
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => handleAssignUser(portfolio.id, e)}>
                            <Users className="h-4 w-4 mr-2" />
                            Assign User
                          </DropdownMenuItem>
                          {isLive && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={(e) => handleStopLive(portfolio.id, e)}
                                className="text-red-600"
                              >
                                <Square className="h-4 w-4 mr-2" />
                                Stop Live Trading
                              </DropdownMenuItem>
                            </>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDelete(portfolio.id, e)
                            }}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Portfolio
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pb-3">
                  {/* Portfolio Settings - Editable when expanded */}
                  {expandedPortfolioId === portfolio.id ? (
                    <div
                      className="space-y-4 p-4 bg-muted/30 rounded-md mb-4 border border-border"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <h3 className="text-sm font-medium flex items-center">
                        <Settings className="h-4 w-4 mr-2 text-blue-500" />
                        Portfolio Settings
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`maxProfit-${portfolio.id}`} className="text-xs">
                            Max Profit
                          </Label>
                          <div className="relative">
                            <DollarSign className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-green-500" />
                            <Input
                              id={`maxProfit-${portfolio.id}`}
                              type="number"
                              value={editableSettings.maxProfit || 0}
                              onChange={(e) => handleSettingsChange("maxProfit", Number(e.target.value))}
                              className="pl-8"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor={`maxLoss-${portfolio.id}`} className="text-xs">
                            Max Loss
                          </Label>
                          <div className="relative">
                            <Shield className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-red-500" />
                            <Input
                              id={`maxLoss-${portfolio.id}`}
                              type="number"
                              value={editableSettings.maxLoss || 0}
                              onChange={(e) => handleSettingsChange("maxLoss", Number(e.target.value))}
                              className="pl-8"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col space-y-3 mt-4">
                        <Button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleRetryMechanism(portfolio.id, e)
                          }}
                          variant="outline"
                          className="w-full flex justify-between"
                        >
                          <div className="flex items-center">
                            <RefreshCw className="h-4 w-4 mr-2 text-amber-500" />
                            Retry Mechanism
                          </div>
                          <ChevronRight className="h-4 w-4" />
                        </Button>

                        <Button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleProfitLocking(portfolio.id, e)
                          }}
                          variant="outline"
                          className="w-full flex justify-between"
                        >
                          <div className="flex items-center">
                            <Lock className="h-4 w-4 mr-2 text-blue-500" />
                            Profit Locking
                          </div>
                          <ChevronRight className="h-4 w-4" />
                        </Button>

                        <Button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleProfitTrailing(portfolio.id, e)
                          }}
                          variant="outline"
                          className="w-full flex justify-between"
                        >
                          <div className="flex items-center">
                            <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
                            Profit Trailing
                          </div>
                          <ChevronRight className="h-4 w-4" />
                        </Button>

                        <Button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleAssignUser(portfolio.id)
                          }}
                          variant="outline"
                          className="w-full flex justify-between"
                        >
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-2 text-indigo-500" />
                            Assign Users
                          </div>
                          <ChevronRight className="h-4 w-4" />
                        </Button>

                        <div className="flex gap-2 pt-2">
                          <Button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleSaveSettings(portfolio.id)
                            }}
                            className="w-full bg-blue-600 hover:bg-blue-700"
                          >
                            <Save className="h-4 w-4 mr-2" />
                            Save Settings
                          </Button>
                          <Button
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation()
                              setExpandedPortfolioId(null)
                            }}
                            className="w-1/3"
                          >
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Collapsed view - just show summary
                    <div className="grid grid-cols-2 gap-y-2 gap-x-4 mb-4">
                      <div className="flex items-center text-sm">
                        <DollarSign className="h-4 w-4 mr-2 text-green-500" />
                        <span className="text-muted-foreground">Max Profit:</span>
                        <span className="ml-auto font-medium">₹{portfolio.settings.maxProfit || "0"}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Shield className="h-4 w-4 mr-2 text-red-500" />
                        <span className="text-muted-foreground">Max Loss:</span>
                        <span className="ml-auto font-medium">₹{portfolio.settings.maxLoss || "0"}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Lock className="h-4 w-4 mr-2 text-blue-500" />
                        <span className="text-muted-foreground">Profit Lock:</span>
                        <span className="ml-auto font-medium">
                          {portfolio.settings.profitLocking?.enabled ? "Enabled" : "Disabled"}
                        </span>
                      </div>
                      <div className="flex items-center text-sm">
                        <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
                        <span className="text-muted-foreground">Profit Trail:</span>
                        <span className="ml-auto font-medium">
                          {portfolio.settings.profitTrailing?.enabled ? "Enabled" : "Disabled"}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Assigned Users */}
                  {portfolio.settings.assignedUsers &&
                    portfolio.settings.assignedUsers.length > 0 &&
                    expandedPortfolioId !== portfolio.id && (
                      <div className="mb-4">
                        <div className="flex items-center mb-2 text-sm">
                          <Users className="h-4 w-4 mr-2 text-indigo-500" />
                          <span className="font-medium">Assigned Users</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {portfolio.settings.assignedUsers.map((user, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {user.alias || user.name} (x{user.multiplier})
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Strategies Count */}
                  {portfolio.strategiesCount > 0 && expandedPortfolioId !== portfolio.id && (
                    <div className="mt-2">
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {portfolio.strategiesCount} {portfolio.strategiesCount === 1 ? "Strategy" : "Strategies"}
                      </Badge>
                    </div>
                  )}
                </CardContent>

                <CardFooter
                  className={`pt-3 pb-3 flex justify-between ${isLive ? "bg-green-50/50 dark:bg-green-900/10" : "bg-muted/30"}`}
                >
                  <div className="flex items-center">
                    <span className="text-sm text-muted-foreground">
                      {expandedPortfolioId === portfolio.id
                        ? "Edit Mode"
                        : isLive
                          ? "Live Trading Active"
                          : "Portfolio Settings"}
                    </span>
                  </div>
                  {expandedPortfolioId !== portfolio.id && (
                    <div className="flex items-center gap-2">
                      {portfolio.settings.profitLocking?.enabled && (
                        <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200">
                          Profit Lock
                        </Badge>
                      )}
                      {portfolio.settings.profitTrailing?.enabled && (
                        <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
                          Profit Trail
                        </Badge>
                      )}
                      {portfolio.settings.retryMechanism?.entryOrderRetry && (
                        <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-200">
                          Retry
                        </Badge>
                      )}
                    </div>
                  )}
                </CardFooter>
              </Card>
            )
          })
        )}
      </div>

      {/* User Assignment Dialog */}
      <Dialog open={showUserAssignDialog} onOpenChange={setShowUserAssignDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Assign Users to Portfolio</DialogTitle>
            <DialogDescription>Select users and set their multipliers for this portfolio</DialogDescription>
          </DialogHeader>
          <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
            <div className="space-y-6">
              {/* Available Users */}
              <div>
                <h3 className="text-sm font-medium mb-3">Available Users</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {availableUsers.map((user) => {
                    const isSelected = selectedUsers.some((u) => u.id === user.id)
                    const selectedUser = selectedUsers.find((u) => u.id === user.id)

                    return (
                      <div
                        key={user.id}
                        className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                          isSelected
                            ? "bg-indigo-50 border-indigo-200 dark:bg-indigo-900/20 dark:border-indigo-800"
                            : "bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
                        } ${!user.enabled ? "opacity-60" : ""}`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-md ${
                              user.broker === "Zerodha"
                                ? "bg-gradient-to-r from-blue-500 to-blue-600"
                                : "bg-gradient-to-r from-purple-500 to-purple-700"
                            } flex items-center justify-center text-white font-semibold text-xs`}
                          >
                            {user.alias.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium">{user.alias}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {user.userId} • {user.broker}
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <div
                              className={`w-2 h-2 rounded-full ${
                                user.loggedIn && user.enabled
                                  ? "bg-green-500"
                                  : user.enabled
                                    ? "bg-amber-500"
                                    : "bg-gray-400"
                              }`}
                            ></div>
                            <span className="text-xs text-gray-500">
                              {!user.enabled ? "Disabled" : user.loggedIn ? "Active" : "Logged Out"}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {isSelected && (
                            <div className="flex items-center gap-2">
                              <Label htmlFor={`multiplier-${user.id}`} className="text-xs">
                                Multiplier:
                              </Label>
                              <Input
                                id={`multiplier-${user.id}`}
                                type="number"
                                min="0.1"
                                step="0.1"
                                value={selectedUser?.multiplier || 1}
                                onChange={(e) => handleUserSelection(user, Number.parseFloat(e.target.value) || 1)}
                                className="w-20 h-8 text-xs"
                              />
                            </div>
                          )}

                          <Button
                            variant={isSelected ? "destructive" : "outline"}
                            size="sm"
                            onClick={() => (isSelected ? handleUserRemoval(user.id) : handleUserSelection(user))}
                            disabled={!user.enabled}
                          >
                            {isSelected ? "Remove" : "Add"}
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Selected Users Summary */}
              {selectedUsers.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium mb-3">Selected Users ({selectedUsers.length})</h3>
                  <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-3 border border-indigo-200 dark:border-indigo-800">
                    <div className="flex flex-wrap gap-2">
                      {selectedUsers.map((user) => (
                        <Badge key={user.id} variant="outline" className="bg-white dark:bg-gray-800">
                          {user.alias} (x{user.multiplier})
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <DialogFooter className="p-6 pt-2">
            <div className="flex justify-between w-full">
              <Button variant="outline" onClick={() => setShowUserAssignDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveUserAssignments} className="bg-indigo-600 hover:bg-indigo-700">
                Save Assignments
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Retry Mechanism Dialog */}
      <Dialog open={showRetryMechanismDialog} onOpenChange={setShowRetryMechanismDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Retry Mechanism Settings</DialogTitle>
            <DialogDescription>Configure order retry settings for failed orders</DialogDescription>
          </DialogHeader>
          <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-medium flex items-center">
                  <RefreshCw className="h-4 w-4 mr-2 text-amber-500" />
                  Entry Order Retry Settings
                </h3>

                <div className="flex items-center space-x-2 mb-4">
                  <Switch
                    id="entryOrderRetry"
                    checked={retrySettings.entryOrderRetry}
                    onCheckedChange={(checked) => setRetrySettings({ ...retrySettings, entryOrderRetry: checked })}
                  />
                  <Label htmlFor="entryOrderRetry">Enable Entry Order Retry</Label>
                </div>

                {retrySettings.entryOrderRetry && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6 border-l-2 border-amber-200">
                    <div>
                      <Label htmlFor="entryRetryCount" className="text-xs">
                        Entry Retry Count
                      </Label>
                      <div className="relative">
                        <Input
                          id="entryRetryCount"
                          type="number"
                          min="1"
                          max="10"
                          value={retrySettings.entryRetryCount}
                          onChange={(e) =>
                            setRetrySettings({ ...retrySettings, entryRetryCount: Number(e.target.value) })
                          }
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="entryRetryWaitSeconds" className="text-xs">
                        Wait Between Retries (seconds)
                      </Label>
                      <div className="relative">
                        <Clock className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                        <Input
                          id="entryRetryWaitSeconds"
                          type="number"
                          min="1"
                          max="60"
                          value={retrySettings.entryRetryWaitSeconds}
                          onChange={(e) =>
                            setRetrySettings({ ...retrySettings, entryRetryWaitSeconds: Number(e.target.value) })
                          }
                          className="pl-8"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="entryMaxWaitSeconds" className="text-xs">
                        Maximum Wait Time (seconds)
                      </Label>
                      <div className="relative">
                        <Clock className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                        <Input
                          id="entryMaxWaitSeconds"
                          type="number"
                          min="5"
                          max="300"
                          value={retrySettings.entryMaxWaitSeconds}
                          onChange={(e) =>
                            setRetrySettings({ ...retrySettings, entryMaxWaitSeconds: Number(e.target.value) })
                          }
                          className="pl-8"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium flex items-center">
                  <ArrowRightLeft className="h-4 w-4 mr-2 text-red-500" />
                  Exit Order Retry Settings
                </h3>

                <div className="flex items-center space-x-2 mb-4">
                  <Switch
                    id="exitOrderRetry"
                    checked={retrySettings.exitOrderRetry}
                    onCheckedChange={(checked) => setRetrySettings({ ...retrySettings, exitOrderRetry: checked })}
                  />
                  <Label htmlFor="exitOrderRetry">Enable Exit Order Retry</Label>
                </div>

                {retrySettings.exitOrderRetry && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6 border-l-2 border-red-200">
                    <div>
                      <Label htmlFor="exitRetryCount" className="text-xs">
                        Exit Retry Count
                      </Label>
                      <div className="relative">
                        <Input
                          id="exitRetryCount"
                          type="number"
                          min="1"
                          max="10"
                          value={retrySettings.exitRetryCount}
                          onChange={(e) =>
                            setRetrySettings({ ...retrySettings, exitRetryCount: Number(e.target.value) })
                          }
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="exitRetryWaitSeconds" className="text-xs">
                        Wait Between Retries (seconds)
                      </Label>
                      <div className="relative">
                        <Clock className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                        <Input
                          id="exitRetryWaitSeconds"
                          type="number"
                          min="1"
                          max="60"
                          value={retrySettings.exitRetryWaitSeconds}
                          onChange={(e) =>
                            setRetrySettings({ ...retrySettings, exitRetryWaitSeconds: Number(e.target.value) })
                          }
                          className="pl-8"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="exitMaxWaitSeconds" className="text-xs">
                        Maximum Wait Time (seconds)
                      </Label>
                      <div className="relative">
                        <Clock className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                        <Input
                          id="exitMaxWaitSeconds"
                          type="number"
                          min="5"
                          max="300"
                          value={retrySettings.exitMaxWaitSeconds}
                          onChange={(e) =>
                            setRetrySettings({ ...retrySettings, exitMaxWaitSeconds: Number(e.target.value) })
                          }
                          className="pl-8"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <DialogFooter className="p-6 pt-2">
            <div className="flex justify-between w-full">
              <Button variant="outline" onClick={() => setShowRetryMechanismDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveRetrySettings} className="bg-amber-600 hover:bg-amber-700">
                Save Settings
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Profit Locking Dialog */}
      <Dialog open={showProfitLockingDialog} onOpenChange={setShowProfitLockingDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Profit Locking Settings</DialogTitle>
            <DialogDescription>Configure profit locking to secure profits</DialogDescription>
          </DialogHeader>
          <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-4">
                  <Switch
                    id="profitLockingEnabled"
                    checked={profitLockingSettings.enabled}
                    onCheckedChange={(checked) =>
                      setProfitLockingSettings({ ...profitLockingSettings, enabled: checked })
                    }
                  />
                  <Label htmlFor="profitLockingEnabled">Enable Profit Locking</Label>
                </div>

                {profitLockingSettings.enabled && (
                  <div className="space-y-4 pl-6 border-l-2 border-blue-200">
                    <div>
                      <Label htmlFor="profitThreshold" className="text-xs">
                        If Profit Reaches (₹)
                      </Label>
                      <div className="relative">
                        <DollarSign className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-green-500" />
                        <Input
                          id="profitThreshold"
                          type="number"
                          min="0"
                          value={profitLockingSettings.profitThreshold}
                          onChange={(e) =>
                            setProfitLockingSettings({
                              ...profitLockingSettings,
                              profitThreshold: Number(e.target.value),
                            })
                          }
                          className="pl-8"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        The profit amount that triggers the profit locking mechanism
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="minimumProfitLock" className="text-xs">
                        Lock Minimum Profit At (₹)
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-blue-500" />
                        <Input
                          id="minimumProfitLock"
                          type="number"
                          min="0"
                          value={profitLockingSettings.minimumProfitLock}
                          onChange={(e) =>
                            setProfitLockingSettings({
                              ...profitLockingSettings,
                              minimumProfitLock: Number(e.target.value),
                            })
                          }
                          className="pl-8"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        The minimum profit amount that will be secured
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <DialogFooter className="p-6 pt-2">
            <div className="flex justify-between w-full">
              <Button variant="outline" onClick={() => setShowProfitLockingDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveProfitLockingSettings} className="bg-blue-600 hover:bg-blue-700">
                Save Settings
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Profit Trailing Dialog */}
      <Dialog open={showProfitTrailingDialog} onOpenChange={setShowProfitTrailingDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Profit Trailing Settings</DialogTitle>
            <DialogDescription>Configure profit trailing to maximize profits</DialogDescription>
          </DialogHeader>
          <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-4">
                  <Switch
                    id="profitTrailingEnabled"
                    checked={profitTrailingSettings.enabled}
                    onCheckedChange={(checked) =>
                      setProfitTrailingSettings({ ...profitTrailingSettings, enabled: checked })
                    }
                  />
                  <Label htmlFor="profitTrailingEnabled">Enable Profit Trailing</Label>
                </div>

                {profitTrailingSettings.enabled && (
                  <div className="space-y-4 pl-6 border-l-2 border-green-200">
                    <div>
                      <Label htmlFor="increaseBy" className="text-xs">
                        Every Increase In Profit By (₹)
                      </Label>
                      <div className="relative">
                        <TrendingUp className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-green-500" />
                        <Input
                          id="increaseBy"
                          type="number"
                          min="0"
                          value={profitTrailingSettings.increaseBy}
                          onChange={(e) =>
                            setProfitTrailingSettings({
                              ...profitTrailingSettings,
                              increaseBy: Number(e.target.value),
                            })
                          }
                          className="pl-8"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        The profit increase amount that triggers the trailing mechanism
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="trailBy" className="text-xs">
                        Trail Profit By (₹)
                      </Label>
                      <div className="relative">
                        <ArrowRightLeft className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-green-500" />
                        <Input
                          id="trailBy"
                          type="number"
                          min="0"
                          value={profitTrailingSettings.trailBy}
                          onChange={(e) =>
                            setProfitTrailingSettings({
                              ...profitTrailingSettings,
                              trailBy: Number(e.target.value),
                            })
                          }
                          className="pl-8"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        The amount by which the stop loss will be trailed
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <DialogFooter className="p-6 pt-2">
            <div className="flex justify-between w-full">
              <Button variant="outline" onClick={() => setShowProfitTrailingDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveProfitTrailingSettings} className="bg-green-600 hover:bg-green-700">
                Save Settings
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Go Live Dialog */}
      <Dialog open={showGoLiveDialog} onOpenChange={setShowGoLiveDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Select Portfolios to Go Live</DialogTitle>
            <DialogDescription>Choose which portfolios you want to activate for live trading</DialogDescription>
          </DialogHeader>

          <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
            <div className="space-y-4">
              {portfolios.length === 0 ? (
                <div className="text-center py-8">
                  <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Portfolios Available</h3>
                  <p className="text-muted-foreground">Create some portfolios first to go live with trading.</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {portfolios.map((portfolio) => {
                    const isSelected = selectedPortfoliosForLive.includes(portfolio.id)

                    return (
                      <div
                        key={portfolio.id}
                        className={`flex items-center p-4 rounded-lg border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800"
                            : "bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                      >
                        <div className="flex items-center space-x-3 flex-1">
                          <div className="flex-shrink-0">
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedPortfoliosForLive((prev) => [...prev, portfolio.id])
                                } else {
                                  setSelectedPortfoliosForLive((prev) => prev.filter((id) => id !== portfolio.id))
                                }
                              }}
                              className="h-4 w-4"
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>

                          <div
                            className="flex-1 min-w-0 cursor-pointer"
                            onClick={() => handlePortfolioSelection(portfolio.id)}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                  {portfolio.name}
                                </h4>
                                <div className="flex items-center mt-1 space-x-4">
                                  <span className="text-xs text-gray-500 flex items-center">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    {formatDate(portfolio.timestamp)}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {portfolio.strategiesCount}{" "}
                                    {portfolio.strategiesCount === 1 ? "Strategy" : "Strategies"}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center space-x-2">
                                <Badge variant="outline" className="text-xs">
                                  {portfolio.type || "Other"}
                                </Badge>
                                {portfolio.settings.assignedUsers && portfolio.settings.assignedUsers.length > 0 && (
                                  <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                    {portfolio.settings.assignedUsers.length} User(s)
                                  </Badge>
                                )}
                              </div>
                            </div>

                            <div className="mt-2 grid grid-cols-2 gap-4 text-xs">
                              <div className="flex items-center">
                                <DollarSign className="h-3 w-3 mr-1 text-green-500" />
                                <span className="text-gray-500">Max Profit:</span>
                                <span className="ml-1 font-medium">₹{portfolio.settings.maxProfit || "0"}</span>
                              </div>
                              <div className="flex items-center">
                                <Shield className="h-3 w-3 mr-1 text-red-500" />
                                <span className="text-gray-500">Max Loss:</span>
                                <span className="ml-1 font-medium">₹{portfolio.settings.maxLoss || "0"}</span>
                              </div>
                            </div>

                            {(portfolio.settings.profitLocking?.enabled ||
                              portfolio.settings.profitTrailing?.enabled ||
                              portfolio.settings.retryMechanism?.entryOrderRetry) && (
                              <div className="mt-2 flex flex-wrap gap-1">
                                {portfolio.settings.profitLocking?.enabled && (
                                  <Badge
                                    variant="outline"
                                    className="text-xs bg-blue-100 text-blue-700 border-blue-200"
                                  >
                                    Profit Lock
                                  </Badge>
                                )}
                                {portfolio.settings.profitTrailing?.enabled && (
                                  <Badge
                                    variant="outline"
                                    className="text-xs bg-green-100 text-green-700 border-green-200"
                                  >
                                    Profit Trail
                                  </Badge>
                                )}
                                {portfolio.settings.retryMechanism?.entryOrderRetry && (
                                  <Badge
                                    variant="outline"
                                    className="text-xs bg-amber-100 text-amber-700 border-amber-200"
                                  >
                                    Retry
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {selectedPortfoliosForLive.length > 0 && (
                <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                  <h4 className="text-sm font-medium text-red-800 dark:text-red-200 mb-2">
                    Selected Portfolios ({selectedPortfoliosForLive.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {portfolios
                      .filter((p) => selectedPortfoliosForLive.includes(p.id))
                      .map((portfolio) => (
                        <Badge
                          key={portfolio.id}
                          variant="outline"
                          className="bg-white dark:bg-gray-800 text-red-700 border-red-300"
                        >
                          {portfolio.name}
                        </Badge>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="p-6 pt-2">
            <div className="flex justify-between w-full">
              <Button variant="outline" onClick={() => setShowGoLiveDialog(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleExecuteGoLive}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                disabled={selectedPortfoliosForLive.length === 0}
              >
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                  Go Live ({selectedPortfoliosForLive.length})
                </div>
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Square Off Confirmation Dialog */}
      <Dialog open={showSquareOffDialog} onOpenChange={setShowSquareOffDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center text-red-600">
              <Square className="h-5 w-5 mr-2" />
              Stop Portfolio & Square Off Positions
            </DialogTitle>
            <DialogDescription>
              Stopping "{selectedPortfolioForSquareOff?.name}" will square off all associated positions. This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="px-6 py-4 max-h-[60vh] overflow-y-auto">
            {squareOffPositions.length > 0 ? (
              <div className="space-y-4">
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <AlertTriangle className="h-4 w-4 text-amber-600 mr-2" />
                    <h4 className="text-sm font-medium text-amber-800 dark:text-amber-200">
                      Warning: All positions will be squared off at market price
                    </h4>
                  </div>
                  <p className="text-xs text-amber-700 dark:text-amber-300">
                    This will immediately close all open positions associated with this portfolio.
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-3 flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2 text-blue-500" />
                    Positions to be Squared Off ({squareOffPositions.length})
                  </h3>

                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-50 dark:bg-gray-800 px-4 py-2 grid grid-cols-6 gap-4 text-xs font-medium text-gray-600 dark:text-gray-400">
                      <div>Symbol</div>
                      <div>Quantity</div>
                      <div>Avg Price</div>
                      <div>Current Price</div>
                      <div>P&L</div>
                      <div>Type</div>
                    </div>

                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                      {squareOffPositions.map((position) => (
                        <div
                          key={position.id}
                          className="px-4 py-3 grid grid-cols-6 gap-4 text-sm hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                          <div className="font-medium">{position.symbol}</div>
                          <div>{position.quantity}</div>
                          <div>₹{position.avgPrice.toFixed(2)}</div>
                          <div>₹{position.currentPrice.toFixed(2)}</div>
                          <div className={`font-medium ${position.pnl >= 0 ? "text-green-600" : "text-red-600"}`}>
                            {position.pnl >= 0 ? "+" : ""}₹{position.pnl.toFixed(2)}
                          </div>
                          <div>
                            <Badge variant={position.type === "BUY" ? "default" : "secondary"} className="text-xs">
                              {position.type}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200">Total P&L Impact</h4>
                      <p className="text-xs text-blue-600 dark:text-blue-400">
                        Net profit/loss from squaring off all positions
                      </p>
                    </div>
                    <div
                      className={`text-lg font-bold ${squareOffPositions.reduce((sum, pos) => sum + pos.pnl, 0) >= 0 ? "text-green-600" : "text-red-600"}`}
                    >
                      {squareOffPositions.reduce((sum, pos) => sum + pos.pnl, 0) >= 0 ? "+" : ""}₹
                      {squareOffPositions.reduce((sum, pos) => sum + pos.pnl, 0).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Square className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Open Positions</h3>
                <p className="text-gray-500">This portfolio has no open positions to square off.</p>
              </div>
            )}
          </div>

          <DialogFooter className="p-6 pt-2">
            <div className="flex justify-between w-full">
              <Button variant="outline" onClick={() => setShowSquareOffDialog(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleConfirmSquareOff}
                className="bg-red-600 hover:bg-red-700 text-white"
                disabled={squareOffPositions.length === 0}
              >
                <Square className="h-4 w-4 mr-2" />
                Stop Portfolio & Square Off All Positions
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function ChevronRight(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  )
}
