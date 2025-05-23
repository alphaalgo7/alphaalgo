"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
} from "lucide-react"
import { useRouter } from "next/navigation"
import { toast, Toaster } from "sonner"
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
  const [portfolios, setPortfolios] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [expandedPortfolioId, setExpandedPortfolioId] = useState(null)
  const [activeTab, setActiveTab] = useState("all")
  const [sortBy, setSortBy] = useState("newest")

  const [showUserAssignDialog, setShowUserAssignDialog] = useState(false)
  const [selectedPortfolioForUser, setSelectedPortfolioForUser] = useState(null)
  const [availableUsers, setAvailableUsers] = useState([])
  const [selectedUsers, setSelectedUsers] = useState([])
  const [editableSettings, setEditableSettings] = useState({})

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
                  profitLocking: false,
                  entryRetry: 0,
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
        toast.error("Failed to load portfolios")
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
      toast.error("Failed to load users")
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

      toast.success("Portfolio settings saved successfully")
    } catch (error) {
      console.error("Error saving portfolio settings:", error)
      toast.error("Failed to save portfolio settings")
    }
  }

  // Handle portfolio deletion
  const handleDelete = (id, e) => {
    e.stopPropagation()
    try {
      localStorage.removeItem(id)
      setPortfolios(portfolios.filter((p) => p.id !== id))
      toast.success("Portfolio deleted successfully")
    } catch (error) {
      console.error("Error deleting portfolio:", error)
      toast.error("Failed to delete portfolio")
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

  // Handle save user assignments
  const handleSaveUserAssignments = () => {
    if (selectedPortfolioForUser) {
      const newSettings = {
        ...portfolios.find((p) => p.id === selectedPortfolioForUser).settings,
        assignedUsers: selectedUsers,
      }
      savePortfolioSettings(selectedPortfolioForUser, newSettings)
      setShowUserAssignDialog(false)
      setSelectedPortfolioForUser(null)
      setSelectedUsers([])
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
    // Use window.location for a hard redirect to ensure it works
    window.location.href = "/strategies"
    // Show toast message after a small delay to ensure it appears after navigation starts
    setTimeout(() => {
      toast.info("Select strategies to add to a new portfolio")
    }, 100)
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

          <Button
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            onClick={handleCreateNew}
          >
            <Plus className="h-4 w-4 mr-2" />
            Go to Strategies
          </Button>
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
          filteredPortfolios.map((portfolio) => (
            <Card
              key={portfolio.id}
              className={`overflow-hidden border transition-all hover:shadow-md cursor-pointer ${
                expandedPortfolioId === portfolio.id ? "border-blue-400 shadow-md" : "border-border/40"
              }`}
              onClick={() => handleCardClick(portfolio.id)}
              data-editable={expandedPortfolioId === portfolio.id}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{portfolio.name}</CardTitle>
                    <CardDescription className="flex items-center mt-1">
                      <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
                      {formatDate(portfolio.timestamp)}
                    </CardDescription>
                  </div>
                  <div className="flex items-center">
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
                      <div>
                        <Label htmlFor={`entryRetry-${portfolio.id}`} className="text-xs">
                          Entry Retry
                        </Label>
                        <div className="relative">
                          <RefreshCw className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-amber-500" />
                          <Input
                            id={`entryRetry-${portfolio.id}`}
                            type="number"
                            value={editableSettings.entryRetry || 0}
                            onChange={(e) => handleSettingsChange("entryRetry", Number(e.target.value))}
                            className="pl-8"
                          />
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id={`profitLocking-${portfolio.id}`}
                          checked={editableSettings.profitLocking || false}
                          onCheckedChange={(checked) => handleSettingsChange("profitLocking", checked)}
                        />
                        <Label htmlFor={`profitLocking-${portfolio.id}`} className="text-sm">
                          Profit Locking
                        </Label>
                      </div>
                    </div>

                    <div className="flex flex-col space-y-3 mt-4">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleAssignUser(portfolio.id)
                        }}
                        variant="outline"
                        className="w-full"
                      >
                        <Users className="h-4 w-4 mr-2" />
                        Assign Users with Multiplier
                      </Button>

                      <div className="flex gap-2">
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
                        {portfolio.settings.profitLocking ? "Enabled" : "Disabled"}
                      </span>
                    </div>
                    <div className="flex items-center text-sm">
                      <RefreshCw className="h-4 w-4 mr-2 text-amber-500" />
                      <span className="text-muted-foreground">Entry Retry:</span>
                      <span className="ml-auto font-medium">{portfolio.settings.entryRetry || "0"}</span>
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

              <CardFooter className="bg-muted/30 pt-3 pb-3 flex justify-between">
                <div className="flex items-center">
                  <span className="text-sm text-muted-foreground">
                    {expandedPortfolioId === portfolio.id ? "Edit Mode" : "Portfolio Settings"}
                  </span>
                </div>
                {expandedPortfolioId !== portfolio.id && (
                  <div className="flex items-center gap-2">
                    {portfolio.settings.profitLocking && (
                      <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
                        Profit Lock
                      </Badge>
                    )}
                    {portfolio.settings.entryRetry > 0 && (
                      <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-200">
                        Retry: {portfolio.settings.entryRetry}
                      </Badge>
                    )}
                  </div>
                )}
              </CardFooter>
            </Card>
          ))
        )}
      </div>

      {/* User Assignment Dialog */}
      <SimpleDialog
        title="Assign Users to Portfolio"
        description="Select users and set their multipliers for this portfolio"
        open={showUserAssignDialog}
        onOpenChange={setShowUserAssignDialog}
        size="lg"
        footer={
          <div className="flex justify-between w-full">
            <Button variant="outline" onClick={() => setShowUserAssignDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveUserAssignments} className="bg-indigo-600 hover:bg-indigo-700">
              Save Assignments
            </Button>
          </div>
        }
      >
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
                        : "bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700"
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
      </SimpleDialog>
      <Toaster />
    </div>
  )
}

function SimpleDialog({ children, title, description, open, onOpenChange, size, footer }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={size === "lg" ? "max-w-3xl" : "max-w-md"}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
        <DialogFooter>{footer}</DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
