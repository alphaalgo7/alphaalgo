"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Activity, Filter, RefreshCw, ChevronDown, X, TrendingUp, TrendingDown, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { toast } from "@/hooks/use-toast"

// Mock data - preserved from original
const mockUsers = [
  {
    id: 1,
    account: "ACC001",
    tradingAccount: "TA001",
    pnl: 12500,
    lots: 25,
    totalPositions: 42,
    positionsOpen: 18,
    positionsClosed: 24,
    totalOrders: 67,
    ordersCompleted: 58,
    ordersPending: 6,
    ordersRejected: 3,
    totalFunds: 100000,
    fundsAvailable: 65000,
    fundsUtilized: 35000,
  },
  {
    id: 2,
    account: "ACC002",
    tradingAccount: "TA002",
    pnl: -3200,
    lots: 12,
    totalPositions: 28,
    positionsOpen: 10,
    positionsClosed: 18,
    totalOrders: 45,
    ordersCompleted: 39,
    ordersPending: 4,
    ordersRejected: 2,
    totalFunds: 75000,
    fundsAvailable: 42000,
    fundsUtilized: 33000,
  },
  {
    id: 3,
    account: "ACC003",
    tradingAccount: "TA003",
    pnl: 8700,
    lots: 18,
    totalPositions: 35,
    positionsOpen: 15,
    positionsClosed: 20,
    totalOrders: 52,
    ordersCompleted: 48,
    ordersPending: 2,
    ordersRejected: 2,
    totalFunds: 120000,
    fundsAvailable: 85000,
    fundsUtilized: 35000,
  },
  {
    id: 4,
    account: "ACC004",
    tradingAccount: "TA004",
    pnl: 5300,
    lots: 15,
    totalPositions: 30,
    positionsOpen: 12,
    positionsClosed: 18,
    totalOrders: 48,
    ordersCompleted: 42,
    ordersPending: 5,
    ordersRejected: 1,
    totalFunds: 90000,
    fundsAvailable: 60000,
    fundsUtilized: 30000,
  },
  {
    id: 5,
    account: "ACC005",
    tradingAccount: "TA005",
    pnl: -1800,
    lots: 8,
    totalPositions: 22,
    positionsOpen: 6,
    positionsClosed: 16,
    totalOrders: 35,
    ordersCompleted: 32,
    ordersPending: 2,
    ordersRejected: 1,
    totalFunds: 60000,
    fundsAvailable: 45000,
    fundsUtilized: 15000,
  },
]

const mockPositions = [
  {
    id: 1,
    account: "ACC001",
    symbol: "NIFTY 23JUN 19500 CE",
    direction: "LONG",
    type: "OPTION",
    state: "OPEN",
    exchange: "NSE",
    broker: "ZERODHA",
    netQty: 25,
    buyQty: 25,
    sellQty: 0,
    ltp: 145.2,
    sellPrice: 0,
    buyPrice: 120.5,
    pnl: 6175,
    realPnl: 0,
    unrealPnl: 6175,
    strategy: "momentum",
    portfolio: "aggressive",
    user: "ACC001",
  },
  {
    id: 2,
    account: "ACC001",
    symbol: "BANKNIFTY 23JUN 44000 PE",
    direction: "SHORT",
    type: "OPTION",
    state: "OPEN",
    exchange: "NSE",
    broker: "ZERODHA",
    netQty: -15,
    buyQty: 0,
    sellQty: 15,
    ltp: 85.3,
    sellPrice: 110.25,
    buyPrice: 0,
    pnl: 3742.5,
    realPnl: 0,
    unrealPnl: 3742.5,
    strategy: "meanreversion",
    portfolio: "balanced",
    user: "ACC001",
  },
  {
    id: 3,
    account: "ACC002",
    symbol: "RELIANCE",
    direction: "LONG",
    type: "EQUITY",
    state: "OPEN",
    exchange: "NSE",
    broker: "UPSTOX",
    netQty: 50,
    buyQty: 50,
    sellQty: 0,
    ltp: 2540.75,
    sellPrice: 0,
    buyPrice: 2580.5,
    pnl: -1987.5,
    realPnl: 0,
    unrealPnl: -1987.5,
    strategy: "volatility",
    portfolio: "conservative",
    user: "ACC002",
  },
  {
    id: 4,
    account: "ACC003",
    symbol: "INFY 23JUN 1500 CE",
    direction: "LONG",
    type: "OPTION",
    state: "OPEN",
    exchange: "NSE",
    broker: "ICICI",
    netQty: 20,
    buyQty: 20,
    sellQty: 0,
    ltp: 45.6,
    sellPrice: 0,
    buyPrice: 38.75,
    pnl: 1370,
    realPnl: 0,
    unrealPnl: 1370,
    strategy: "momentum",
    portfolio: "aggressive",
    user: "ACC003",
  },
  {
    id: 5,
    account: "ACC004",
    symbol: "HDFC BANK",
    direction: "SHORT",
    type: "EQUITY",
    state: "OPEN",
    exchange: "NSE",
    broker: "ZERODHA",
    netQty: -30,
    buyQty: 0,
    sellQty: 30,
    ltp: 1645.25,
    sellPrice: 1670.8,
    buyPrice: 0,
    pnl: 766.5,
    realPnl: 0,
    unrealPnl: 766.5,
    strategy: "meanreversion",
    portfolio: "balanced",
    user: "ACC004",
  },
  {
    id: 6,
    account: "ACC005",
    symbol: "NIFTY 23JUN 19000 PE",
    direction: "SHORT",
    type: "OPTION",
    state: "OPEN",
    exchange: "NSE",
    broker: "UPSTOX",
    netQty: -10,
    buyQty: 0,
    sellQty: 10,
    ltp: 75.4,
    sellPrice: 65.2,
    buyPrice: 0,
    pnl: -1020,
    realPnl: 0,
    unrealPnl: -1020,
    strategy: "volatility",
    portfolio: "conservative",
    user: "ACC005",
  },
]

const mockOrders = [
  {
    id: 1,
    symbol: "NIFTY 23JUN 19500 CE",
    account: "ACC001",
    buySell: "BUY",
    pendQty: 0,
    price: 120.5,
    qty: 25,
    executionStatus: "COMPLETE",
    tradingAccount: "TA001",
    orderId: "ORD123456",
    updateTime: "10:15:23",
    product: "NRML",
    exchange: "NSE",
    fillQty: 25,
    broker: "ZERODHA",
    date: "2023-06-15",
    rejectReason: "",
    strategy: "momentum",
    portfolio: "aggressive",
    user: "ACC001",
  },
  {
    id: 2,
    symbol: "BANKNIFTY 23JUN 44000 PE",
    account: "ACC001",
    buySell: "SELL",
    pendQty: 0,
    price: 110.25,
    qty: 15,
    executionStatus: "COMPLETE",
    tradingAccount: "TA001",
    orderId: "ORD123457",
    updateTime: "10:18:45",
    product: "NRML",
    exchange: "NSE",
    fillQty: 15,
    broker: "ZERODHA",
    date: "2023-06-15",
    rejectReason: "",
    strategy: "meanreversion",
    portfolio: "balanced",
    user: "ACC001",
  },
  {
    id: 3,
    symbol: "RELIANCE",
    account: "ACC002",
    buySell: "BUY",
    pendQty: 0,
    price: 2580.5,
    qty: 50,
    executionStatus: "COMPLETE",
    tradingAccount: "TA002",
    orderId: "ORD123458",
    updateTime: "10:22:12",
    product: "CNC",
    exchange: "NSE",
    fillQty: 50,
    broker: "UPSTOX",
    date: "2023-06-15",
    rejectReason: "",
    strategy: "volatility",
    portfolio: "conservative",
    user: "ACC002",
  },
  {
    id: 4,
    symbol: "INFY 23JUN 1500 CE",
    account: "ACC003",
    buySell: "BUY",
    pendQty: 0,
    price: 38.75,
    qty: 20,
    executionStatus: "COMPLETE",
    tradingAccount: "TA003",
    orderId: "ORD123459",
    updateTime: "10:25:33",
    product: "NRML",
    exchange: "NSE",
    fillQty: 20,
    broker: "ICICI",
    date: "2023-06-15",
    rejectReason: "",
    strategy: "momentum",
    portfolio: "aggressive",
    user: "ACC003",
  },
  {
    id: 5,
    symbol: "HDFC BANK",
    account: "ACC004",
    buySell: "SELL",
    pendQty: 0,
    price: 1670.8,
    qty: 30,
    executionStatus: "COMPLETE",
    tradingAccount: "TA004",
    orderId: "ORD123460",
    updateTime: "10:30:15",
    product: "CNC",
    exchange: "NSE",
    fillQty: 30,
    broker: "ZERODHA",
    date: "2023-06-15",
    rejectReason: "",
    strategy: "meanreversion",
    portfolio: "balanced",
    user: "ACC004",
  },
  {
    id: 6,
    symbol: "NIFTY 23JUN 19000 PE",
    account: "ACC005",
    buySell: "SELL",
    pendQty: 0,
    price: 65.2,
    qty: 10,
    executionStatus: "COMPLETE",
    tradingAccount: "TA005",
    orderId: "ORD123461",
    updateTime: "10:35:42",
    product: "NRML",
    exchange: "NSE",
    fillQty: 10,
    broker: "UPSTOX",
    date: "2023-06-15",
    rejectReason: "",
    strategy: "volatility",
    portfolio: "conservative",
    user: "ACC005",
  },
  {
    id: 7,
    symbol: "TCS",
    account: "ACC003",
    buySell: "BUY",
    pendQty: 25,
    price: 3450.75,
    qty: 25,
    executionStatus: "PENDING",
    tradingAccount: "TA003",
    orderId: "ORD123462",
    updateTime: "10:40:18",
    product: "CNC",
    exchange: "NSE",
    fillQty: 0,
    broker: "ICICI",
    date: "2023-06-15",
    rejectReason: "",
    strategy: "momentum",
    portfolio: "aggressive",
    user: "ACC003",
  },
  {
    id: 8,
    symbol: "SBIN",
    account: "ACC002",
    buySell: "BUY",
    pendQty: 0,
    price: 580.25,
    qty: 100,
    executionStatus: "REJECTED",
    tradingAccount: "TA002",
    orderId: "ORD123463",
    updateTime: "10:45:30",
    product: "CNC",
    exchange: "NSE",
    fillQty: 0,
    broker: "UPSTOX",
    date: "2023-06-15",
    rejectReason: "Insufficient funds",
    strategy: "meanreversion",
    portfolio: "balanced",
    user: "ACC002",
  },
  {
    id: 9,
    symbol: "INFY",
    account: "ACC001",
    buySell: "BUY",
    pendQty: 0,
    price: 1550.5,
    qty: 10,
    executionStatus: "CANCELLED",
    tradingAccount: "TA001",
    orderId: "ORD123464",
    updateTime: "11:00:00",
    product: "CNC",
    exchange: "NSE",
    fillQty: 0,
    broker: "ZERODHA",
    date: "2023-06-15",
    rejectReason: "User cancelled",
    strategy: "momentum",
    portfolio: "aggressive",
    user: "ACC001",
  },
]

const mockMargin = [
  {
    id: 1,
    account: "ACC001",
    tradingAccount: "TA001",
    broker: "ZERODHA",
    totalMargin: 100000,
    availableMargin: 65000,
    usedMargin: 35000,
    utilizedPercentage: 35,
  },
  {
    id: 2,
    account: "ACC002",
    tradingAccount: "TA002",
    broker: "UPSTOX",
    totalMargin: 75000,
    availableMargin: 42000,
    usedMargin: 33000,
    utilizedPercentage: 44,
  },
  {
    id: 3,
    account: "ACC003",
    tradingAccount: "TA003",
    broker: "ICICI",
    totalMargin: 120000,
    availableMargin: 85000,
    usedMargin: 35000,
    utilizedPercentage: 29,
  },
  {
    id: 4,
    account: "ACC004",
    tradingAccount: "TA004",
    broker: "ZERODHA",
    totalMargin: 90000,
    availableMargin: 60000,
    usedMargin: 30000,
    utilizedPercentage: 33,
  },
  {
    id: 5,
    account: "ACC005",
    tradingAccount: "TA005",
    broker: "UPSTOX",
    totalMargin: 60000,
    availableMargin: 45000,
    usedMargin: 15000,
    utilizedPercentage: 25,
  },
]

export default function LiveMonitorPage() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [marketStatus, setMarketStatus] = useState("Open")
  const [selectedTab, setSelectedTab] = useState("pnl")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [selectedPositions, setSelectedPositions] = useState<number[]>([])
  const [isSquareOffDialogOpen, setIsSquareOffDialogOpen] = useState(false)
  const [isCustomSquareOffDialogOpen, setIsCustomSquareOffDialogOpen] = useState(false)
  const [isAccountSquareOffDialogOpen, setIsAccountSquareOffDialogOpen] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const [selectedStrategy, setSelectedStrategy] = useState("all")
  const [selectedPortfolio, setSelectedPortfolio] = useState("all")
  const [selectedUser, setSelectedUser] = useState("all")

  // Column filters for positions
  const [positionFilters, setPositionFilters] = useState({
    account: "",
    symbol: "",
    direction: "",
    type: "",
    state: "",
    exchange: "",
    broker: "",
  })

  // Column filters for orders
  const [orderFilters, setOrderFilters] = useState({
    symbol: "",
    account: "",
    buySell: "",
    executionStatus: "",
    tradingAccount: "",
    product: "",
    exchange: "",
    broker: "",
  })

  // Manual close form states
  const [closePositionForm, setClosePositionForm] = useState({
    account: "",
    symbol: "",
    quantity: "",
    priceType: "market",
    price: "",
  })

  const [cancelOrderForm, setCancelOrderForm] = useState({
    account: "",
    orderId: "",
  })

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Filter positions based on search term and filters
  const filteredPositions = mockPositions.filter((position) => {
    const matchesSearch =
      position.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      position.account.toLowerCase().includes(searchTerm.toLowerCase()) ||
      position.broker.toLowerCase().includes(searchTerm.toLowerCase())

    // Basic direction filter
    let matchesFilter = true
    if (selectedFilter === "long") matchesFilter = position.direction === "LONG"
    if (selectedFilter === "short") matchesFilter = position.direction === "SHORT"

    // Strategy, portfolio, user filters
    const matchesStrategy = selectedStrategy === "all" || position.strategy === selectedStrategy
    const matchesPortfolio = selectedPortfolio === "all" || position.portfolio === selectedPortfolio
    const matchesUser = selectedUser === "all" || position.user === selectedUser

    // Column filters
    const matchesColumnFilters = Object.entries(positionFilters).every(([key, value]) => {
      if (!value) return true
      return position[key as keyof typeof position]?.toString().toLowerCase().includes(value.toLowerCase())
    })

    return matchesSearch && matchesFilter && matchesStrategy && matchesPortfolio && matchesUser && matchesColumnFilters
  })

  // Filter orders based on search term and filters
  const filteredOrders = mockOrders.filter((order) => {
    const matchesSearch =
      order.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.account.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.broker.toLowerCase().includes(searchTerm.toLowerCase())

    // Basic order filters
    let matchesFilter = true
    if (selectedFilter === "buy") matchesFilter = order.buySell === "BUY"
    if (selectedFilter === "sell") matchesFilter = order.buySell === "SELL"
    if (selectedFilter === "pending") matchesFilter = order.executionStatus === "PENDING"
    if (selectedFilter === "completed") matchesFilter = order.executionStatus === "COMPLETE"
    if (selectedFilter === "rejected") matchesFilter = order.executionStatus === "REJECTED"

    // Strategy, portfolio, user filters
    const matchesStrategy = selectedStrategy === "all" || order.strategy === selectedStrategy
    const matchesPortfolio = selectedPortfolio === "all" || order.portfolio === selectedPortfolio
    const matchesUser = selectedUser === "all" || order.user === selectedUser

    // Column filters
    const matchesColumnFilters = Object.entries(orderFilters).every(([key, value]) => {
      if (!value) return true
      return order[key as keyof typeof order]?.toString().toLowerCase().includes(value.toLowerCase())
    })

    return matchesSearch && matchesFilter && matchesStrategy && matchesPortfolio && matchesUser && matchesColumnFilters
  })

  // Handle square off all positions
  const handleSquareOffAll = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setIsSquareOffDialogOpen(false)
      toast({
        title: "Success",
        description: "All positions squared off successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to square off positions",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle custom square off
  const handleCustomSquareOff = async () => {
    if (selectedPositions.length === 0) {
      toast({
        title: "Warning",
        description: "Please select at least one position",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setIsCustomSquareOffDialogOpen(false)
      setSelectedPositions([])
      toast({
        title: "Success",
        description: `${selectedPositions.length} positions squared off successfully`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to square off selected positions",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle square off by account
  const handleSquareOffByAccount = async () => {
    if (!selectedAccount) {
      toast({
        title: "Warning",
        description: "Please select an account",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setIsAccountSquareOffDialogOpen(false)
      setSelectedAccount("")
      toast({
        title: "Success",
        description: `All positions for account ${selectedAccount} squared off successfully`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to square off account positions",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle close position
  const handleClosePosition = async () => {
    if (!closePositionForm.account || !closePositionForm.symbol || !closePositionForm.quantity) {
      toast({
        title: "Warning",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({
        title: "Success",
        description: `Position closed successfully for ${closePositionForm.symbol}`,
      })
      setClosePositionForm({
        account: "",
        symbol: "",
        quantity: "",
        priceType: "market",
        price: "",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to close position",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle cancel order
  const handleCancelOrder = async () => {
    if (!cancelOrderForm.account || !cancelOrderForm.orderId) {
      toast({
        title: "Warning",
        description: "Please select account and order ID",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({
        title: "Success",
        description: `Order ${cancelOrderForm.orderId} cancelled successfully`,
      })
      setCancelOrderForm({
        account: "",
        orderId: "",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel order",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle individual position square off
  const handleIndividualSquareOff = async (positionId: number) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({
        title: "Success",
        description: "Position squared off successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to square off position",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Toggle position selection
  const togglePositionSelection = (positionId: number) => {
    setSelectedPositions((prev) =>
      prev.includes(positionId) ? prev.filter((id) => id !== positionId) : [...prev, positionId],
    )
  }

  // Check if all positions are selected
  const allPositionsSelected =
    filteredPositions.length > 0 && filteredPositions.every((position) => selectedPositions.includes(position.id))

  // Toggle all positions selection
  const toggleAllPositions = () => {
    if (allPositionsSelected) {
      setSelectedPositions([])
    } else {
      setSelectedPositions(filteredPositions.map((position) => position.id))
    }
  }

  // Calculate totals for summary
  const summaryTotals = {
    pnl: mockUsers.reduce((sum, user) => sum + user.pnl, 0),
    lots: mockUsers.reduce((sum, user) => sum + user.lots, 0),
    totalPositions: mockUsers.reduce((sum, user) => sum + user.totalPositions, 0),
    positionsOpen: mockUsers.reduce((sum, user) => sum + user.positionsOpen, 0),
    positionsClosed: mockUsers.reduce((sum, user) => sum + user.positionsClosed, 0),
    totalOrders: mockUsers.reduce((sum, user) => sum + user.totalOrders, 0),
    ordersCompleted: mockUsers.reduce((sum, user) => sum + user.ordersCompleted, 0),
    ordersPending: mockUsers.reduce((sum, user) => sum + user.ordersPending, 0),
    ordersRejected: mockUsers.reduce((sum, user) => sum + user.ordersRejected, 0),
    totalFunds: mockUsers.reduce((sum, user) => sum + user.totalFunds, 0),
    fundsAvailable: mockUsers.reduce((sum, user) => sum + user.fundsAvailable, 0),
    fundsUtilized: mockUsers.reduce((sum, user) => sum + user.fundsUtilized, 0),
  }

  // Column filter component
  const ColumnFilter = ({
    value,
    onChange,
    options,
    placeholder = "Filter...",
  }: {
    value: string
    onChange: (value: string) => void
    options?: string[]
    placeholder?: string
  }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-700 ${
            value ? "text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400" : "text-slate-500"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <Filter className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56" onClick={(e) => e.stopPropagation()}>
        <div className="p-2">
          <Input
            placeholder={placeholder}
            value={value}
            onChange={(e) => {
              e.stopPropagation()
              onChange(e.target.value)
            }}
            className="h-8"
            autoFocus
          />
        </div>
        {options && options.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation()
                onChange("")
              }}
              className={!value ? "bg-blue-50 dark:bg-blue-900/20" : ""}
            >
              <span className="flex items-center gap-2">
                All
                {!value && <div className="w-2 h-2 rounded-full bg-blue-500" />}
              </span>
            </DropdownMenuItem>
            {options.map((option) => (
              <DropdownMenuItem
                key={option}
                onClick={(e) => {
                  e.stopPropagation()
                  onChange(option)
                }}
                className={value === option ? "bg-blue-50 dark:bg-blue-900/20" : ""}
              >
                <span className="flex items-center gap-2">
                  {option}
                  {value === option && <div className="w-2 h-2 rounded-full bg-blue-500" />}
                </span>
              </DropdownMenuItem>
            ))}
          </>
        )}
        {value && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation()
                onChange("")
              }}
              className="text-red-600 dark:text-red-400"
            >
              Clear Filter
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto p-6 space-y-6">
        {/* Enhanced Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-slate-200 dark:bg-slate-800/80 dark:border-slate-700">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Live Monitor
            </h1>
            <p className="text-muted-foreground">Real-time monitoring of trading activities</p>
          </div>
          <div className="flex flex-col items-end">
            <div className="text-2xl font-mono font-bold tabular-nums bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {currentTime.toLocaleTimeString()}
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant={marketStatus === "Open" ? "default" : "destructive"}
                className={`text-xs px-3 py-1 ${
                  marketStatus === "Open" ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full mr-2 ${
                    marketStatus === "Open" ? "bg-green-200 animate-pulse" : "bg-red-200"
                  }`}
                />
                Market {marketStatus}
              </Badge>
              <span className="text-sm text-muted-foreground">{currentTime.toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Enhanced Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 dark:border dark:border-green-800">
            <CardHeader className="pb-2 border-b border-green-100 dark:border-green-800/30">
              <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">Total P&L</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div className={`text-3xl font-bold ${summaryTotals.pnl >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {summaryTotals.pnl >= 0 ? "+" : ""}₹{summaryTotals.pnl.toLocaleString()}
                </div>
                <div className="p-2 bg-white/50 rounded-full dark:bg-white/10">
                  {summaryTotals.pnl >= 0 ? (
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-red-600" />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 dark:border dark:border-blue-800">
            <CardHeader className="pb-2 border-b border-blue-100 dark:border-blue-800/30">
              <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">Open Positions</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-blue-600">{summaryTotals.positionsOpen}</div>
                <div className="p-2 bg-white/50 rounded-full dark:bg-white/10">
                  <Activity className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 dark:border dark:border-amber-800">
            <CardHeader className="pb-2 border-b border-amber-100 dark:border-amber-800/30">
              <CardTitle className="text-sm font-medium text-amber-700 dark:text-amber-300">Orders Status</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between mb-2">
                <div className="text-2xl font-bold text-amber-600">{summaryTotals.ordersPending}</div>
                <div className="p-2 bg-white/50 rounded-full dark:bg-white/10">
                  <Clock className="h-5 w-5 text-amber-600" />
                </div>
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-green-600 dark:text-green-400">Successful Orders:</span>
                  <span className="font-medium text-green-600 dark:text-green-400">
                    {summaryTotals.ordersCompleted}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-red-600 dark:text-red-400">Rejected Orders:</span>
                  <span className="font-medium text-red-600 dark:text-red-400">{summaryTotals.ordersRejected}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Cancelled Orders:</span>
                  <span className="font-medium text-gray-600 dark:text-gray-400">
                    {mockOrders.filter((o) => o.executionStatus === "CANCELLED").length}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-1 pt-1 border-t border-amber-200 dark:border-amber-800/30">
                  <span className="text-amber-600 dark:text-amber-400 font-medium">Pending Orders:</span>
                  <span className="font-medium text-amber-600 dark:text-amber-400">{summaryTotals.ordersPending}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 dark:border dark:border-purple-800">
            <CardHeader className="pb-2 border-b border-purple-100 dark:border-purple-800/30">
              <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">Funds Utilized</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-purple-600">
                  ₹{summaryTotals.fundsUtilized.toLocaleString()}
                </div>
                <div className="p-2 bg-white/50 rounded-full dark:bg-white/10">
                  <svg
                    className="h-5 w-5 text-purple-600"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </div>
              </div>
              <div className="mt-2">
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-purple-200/50 rounded-full h-1.5 dark:bg-purple-800/50">
                    <div
                      className="bg-purple-600 h-1.5 rounded-full transition-all duration-500"
                      style={{
                        width: `${(summaryTotals.fundsUtilized / summaryTotals.totalFunds) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-xs text-purple-600/70">
                    {((summaryTotals.fundsUtilized / summaryTotals.totalFunds) * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Tabs */}
        <Tabs defaultValue="pnl" className="w-full" onValueChange={setSelectedTab}>
          <div className="bg-white/80 backdrop-blur-sm p-1 rounded-xl shadow-sm border border-slate-200 dark:bg-slate-800/80 dark:border-slate-700">
            <TabsList className="grid grid-cols-5 w-full mb-0 bg-slate-100/80 dark:bg-slate-700/50 p-1 rounded-lg">
              <TabsTrigger
                value="pnl"
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-800 dark:data-[state=active]:text-blue-400"
              >
                User-Level P&L
              </TabsTrigger>
              <TabsTrigger
                value="positions"
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-800 dark:data-[state=active]:text-blue-400"
              >
                Positions
              </TabsTrigger>
              <TabsTrigger
                value="orders"
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-800 dark:data-[state=active]:text-blue-400"
              >
                Orders
              </TabsTrigger>
              <TabsTrigger
                value="manual"
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-800 dark:data-[state=active]:text-blue-400"
              >
                Trade
              </TabsTrigger>
              <TabsTrigger
                value="margin"
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-800 dark:data-[state=active]:text-blue-400"
              >
                Margin
              </TabsTrigger>
            </TabsList>
          </div>

          {/* User-Level P&L Tab */}
          <TabsContent value="pnl" className="mt-6">
            <Card className="border-0 shadow-lg overflow-hidden bg-white/90 backdrop-blur-sm dark:bg-slate-800/90">
              <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 dark:from-blue-900/20 dark:to-indigo-900/20 dark:border-blue-800/30">
                <div>
                  <CardTitle className="text-xl font-semibold text-blue-800 dark:text-blue-300">
                    User-Level P&L Summary
                  </CardTitle>
                  <CardDescription>Overview of P&L and positions by user account</CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1 bg-white/80 hover:bg-white dark:bg-slate-700/50 dark:hover:bg-slate-700"
                  onClick={() => {
                    toast({
                      title: "Refreshed",
                      description: "Data has been refreshed successfully",
                    })
                  }}
                >
                  <RefreshCw className="h-4 w-4" />
                  Refresh
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-slate-50 dark:bg-slate-800/50">
                      <TableRow className="hover:bg-slate-50/50 dark:hover:bg-slate-800/70">
                        <TableHead className="w-12 font-semibold">SI No</TableHead>
                        <TableHead className="font-semibold">Account</TableHead>
                        <TableHead className="font-semibold">Trading Account</TableHead>
                        <TableHead className="font-semibold">PnL</TableHead>
                        <TableHead className="font-semibold">Lots</TableHead>
                        <TableHead className="font-semibold">Total Positions</TableHead>
                        <TableHead className="font-semibold">Positions Open</TableHead>
                        <TableHead className="font-semibold">Positions Closed</TableHead>
                        <TableHead className="font-semibold">Total Orders</TableHead>
                        <TableHead className="font-semibold">Orders Completed</TableHead>
                        <TableHead className="font-semibold">Orders Pending</TableHead>
                        <TableHead className="font-semibold">Orders Rejected</TableHead>
                        <TableHead className="font-semibold">Total Funds</TableHead>
                        <TableHead className="font-semibold">Funds Available</TableHead>
                        <TableHead className="font-semibold">Funds Utilized</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockUsers.map((user, index) => (
                        <TableRow
                          key={user.id}
                          className="hover:bg-slate-50/80 transition-colors dark:hover:bg-slate-800/50"
                        >
                          <TableCell className="font-medium">{index + 1}</TableCell>
                          <TableCell className="font-medium">{user.account}</TableCell>
                          <TableCell>{user.tradingAccount}</TableCell>
                          <TableCell
                            className={`font-semibold ${
                              user.pnl >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                            }`}
                          >
                            {user.pnl >= 0 ? "+" : ""}₹{user.pnl.toLocaleString()}
                          </TableCell>
                          <TableCell>{user.lots}</TableCell>
                          <TableCell>{user.totalPositions}</TableCell>
                          <TableCell className="font-medium text-blue-600 dark:text-blue-400">
                            {user.positionsOpen}
                          </TableCell>
                          <TableCell>{user.positionsClosed}</TableCell>
                          <TableCell>{user.totalOrders}</TableCell>
                          <TableCell className="text-green-600 dark:text-green-400">{user.ordersCompleted}</TableCell>
                          <TableCell className="text-amber-600 dark:text-amber-400">{user.ordersPending}</TableCell>
                          <TableCell className="text-red-600 dark:text-red-400">{user.ordersRejected}</TableCell>
                          <TableCell>₹{user.totalFunds.toLocaleString()}</TableCell>
                          <TableCell className="text-green-600 dark:text-green-400">
                            ₹{user.fundsAvailable.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-blue-600 dark:text-blue-400">
                            ₹{user.fundsUtilized.toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="font-medium bg-slate-100/80 dark:bg-slate-700/50">
                        <TableCell colSpan={3} className="font-bold">
                          Total
                        </TableCell>
                        <TableCell
                          className={`font-bold ${
                            summaryTotals.pnl >= 0
                              ? "text-green-600 dark:text-green-400"
                              : "text-red-600 dark:text-red-400"
                          }`}
                        >
                          {summaryTotals.pnl >= 0 ? "+" : ""}₹{summaryTotals.pnl.toLocaleString()}
                        </TableCell>
                        <TableCell className="font-bold">{summaryTotals.lots}</TableCell>
                        <TableCell className="font-bold">{summaryTotals.totalPositions}</TableCell>
                        <TableCell className="font-bold text-blue-600 dark:text-blue-400">
                          {summaryTotals.positionsOpen}
                        </TableCell>
                        <TableCell className="font-bold">{summaryTotals.positionsClosed}</TableCell>
                        <TableCell className="font-bold">{summaryTotals.totalOrders}</TableCell>
                        <TableCell className="font-bold text-green-600 dark:text-green-400">
                          {summaryTotals.ordersCompleted}
                        </TableCell>
                        <TableCell className="font-bold text-amber-600 dark:text-amber-400">
                          {summaryTotals.ordersPending}
                        </TableCell>
                        <TableCell className="font-bold text-red-600 dark:text-red-400">
                          {summaryTotals.ordersRejected}
                        </TableCell>
                        <TableCell className="font-bold">₹{summaryTotals.totalFunds.toLocaleString()}</TableCell>
                        <TableCell className="font-bold text-green-600 dark:text-green-400">
                          ₹{summaryTotals.fundsAvailable.toLocaleString()}
                        </TableCell>
                        <TableCell className="font-bold text-blue-600 dark:text-blue-400">
                          ₹{summaryTotals.fundsUtilized.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Positions Tab */}
          <TabsContent value="positions" className="mt-6">
            <Card className="border-0 shadow-lg overflow-hidden bg-white/90 backdrop-blur-sm dark:bg-slate-800/90">
              <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 dark:from-blue-900/20 dark:to-indigo-900/20 dark:border-blue-800/30">
                <div>
                  <CardTitle className="text-xl font-semibold text-blue-800 dark:text-blue-300">Positions</CardTitle>
                  <CardDescription>Current open positions across all accounts</CardDescription>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Search positions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-[200px] bg-white/80 dark:bg-slate-700/50"
                    />
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-white/80 hover:bg-white dark:bg-slate-700/50 dark:hover:bg-slate-700"
                        >
                          <Filter className="h-4 w-4 mr-1" />
                          Filter
                          {(selectedFilter !== "all" ||
                            selectedStrategy !== "all" ||
                            selectedPortfolio !== "all" ||
                            selectedUser !== "all") && <div className="ml-1 w-2 h-2 rounded-full bg-blue-500"></div>}
                          <ChevronDown className="h-4 w-4 ml-1" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>Filter By</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setSelectedFilter("all")}>All Positions</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSelectedFilter("long")}>Long Positions</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSelectedFilter("short")}>Short Positions</DropdownMenuItem>

                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>Strategy</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => setSelectedStrategy("all")}>All Strategies</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSelectedStrategy("momentum")}>Momentum</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSelectedStrategy("meanreversion")}>
                          Mean Reversion
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSelectedStrategy("volatility")}>
                          Volatility
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>Portfolio</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => setSelectedPortfolio("all")}>All Portfolios</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSelectedPortfolio("aggressive")}>
                          Aggressive
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSelectedPortfolio("balanced")}>Balanced</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSelectedPortfolio("conservative")}>
                          Conservative
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>User</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => setSelectedUser("all")}>All Users</DropdownMenuItem>
                        {Array.from(new Set(mockUsers.map((user) => user.account))).map((account) => (
                          <DropdownMenuItem key={account} onClick={() => setSelectedUser(account)}>
                            {account}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                    {(selectedFilter !== "all" ||
                      selectedStrategy !== "all" ||
                      selectedPortfolio !== "all" ||
                      selectedUser !== "all") && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedFilter("all")
                          setSelectedStrategy("all")
                          setSelectedPortfolio("all")
                          setSelectedUser("all")
                        }}
                        className="text-xs px-2 h-8"
                      >
                        Reset Filters
                      </Button>
                    )}
                  </div>
                  <Dialog open={isSquareOffDialogOpen} onOpenChange={setIsSquareOffDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                      >
                        Square Off All
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Square Off All Positions</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to square off all positions? This action cannot be undone.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsSquareOffDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={handleSquareOffAll}
                          disabled={isLoading}
                          className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                        >
                          {isLoading ? "Processing..." : "Square Off All"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Dialog open={isCustomSquareOffDialogOpen} onOpenChange={setIsCustomSquareOffDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-white/80 hover:bg-white dark:bg-slate-700/50 dark:hover:bg-slate-700"
                      >
                        Custom Square Off
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Custom Square Off</DialogTitle>
                        <DialogDescription>
                          Square off selected positions. Select positions from the table first.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4">
                        {selectedPositions.length === 0 ? (
                          <p className="text-yellow-500">
                            No positions selected. Please select positions from the table.
                          </p>
                        ) : (
                          <p>{selectedPositions.length} positions selected for square off.</p>
                        )}
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCustomSquareOffDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={handleCustomSquareOff}
                          disabled={isLoading || selectedPositions.length === 0}
                          className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                        >
                          {isLoading ? "Processing..." : "Square Off Selected"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Dialog open={isAccountSquareOffDialogOpen} onOpenChange={setIsAccountSquareOffDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-white/80 hover:bg-white dark:bg-slate-700/50 dark:hover:bg-slate-700"
                      >
                        Square Off By Account
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Custom Square Off By Account</DialogTitle>
                        <DialogDescription>Square off all positions for a specific account.</DialogDescription>
                      </DialogHeader>
                      <div className="py-4">
                        <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                          <SelectTrigger className="bg-white dark:bg-slate-700">
                            <SelectValue placeholder="Select an account" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from(new Set(mockPositions.map((p) => p.account))).map((account) => (
                              <SelectItem key={account} value={account}>
                                {account}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAccountSquareOffDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={handleSquareOffByAccount}
                          disabled={isLoading || !selectedAccount}
                          className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                        >
                          {isLoading ? "Processing..." : "Square Off Account"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-slate-50 dark:bg-slate-800/50">
                      <TableRow className="hover:bg-slate-50/50 dark:hover:bg-slate-800/70">
                        <TableHead className="w-12">
                          <Checkbox
                            checked={allPositionsSelected}
                            onCheckedChange={toggleAllPositions}
                            aria-label="Select all positions"
                          />
                        </TableHead>
                        <TableHead className="w-12 font-semibold">SI No</TableHead>
                        <TableHead className="font-semibold">
                          <div className="flex items-center gap-2 select-none">
                            Account
                            <ColumnFilter
                              value={positionFilters.account}
                              onChange={(value) => setPositionFilters((prev) => ({ ...prev, account: value }))}
                              options={Array.from(new Set(mockPositions.map((p) => p.account)))}
                              placeholder="Filter accounts..."
                            />
                          </div>
                        </TableHead>
                        <TableHead className="font-semibold">
                          <div className="flex items-center gap-2 select-none">
                            Symbol
                            <ColumnFilter
                              value={positionFilters.symbol}
                              onChange={(value) => setPositionFilters((prev) => ({ ...prev, symbol: value }))}
                              placeholder="Filter symbols..."
                            />
                          </div>
                        </TableHead>
                        <TableHead className="font-semibold">
                          <div className="flex items-center gap-2 select-none">
                            Direction
                            <ColumnFilter
                              value={positionFilters.direction}
                              onChange={(value) => setPositionFilters((prev) => ({ ...prev, direction: value }))}
                              options={["LONG", "SHORT"]}
                              placeholder="Filter direction..."
                            />
                          </div>
                        </TableHead>
                        <TableHead className="font-semibold">
                          <div className="flex items-center gap-2 select-none">
                            Type
                            <ColumnFilter
                              value={positionFilters.type}
                              onChange={(value) => setPositionFilters((prev) => ({ ...prev, type: value }))}
                              options={["OPTION", "EQUITY"]}
                              placeholder="Filter type..."
                            />
                          </div>
                        </TableHead>
                        <TableHead className="font-semibold">
                          <div className="flex items-center gap-2 select-none">
                            State
                            <ColumnFilter
                              value={positionFilters.state}
                              onChange={(value) => setPositionFilters((prev) => ({ ...prev, state: value }))}
                              options={["OPEN", "CLOSED"]}
                              placeholder="Filter state..."
                            />
                          </div>
                        </TableHead>
                        <TableHead className="font-semibold">
                          <div className="flex items-center gap-2 select-none">
                            Exchange
                            <ColumnFilter
                              value={positionFilters.exchange}
                              onChange={(value) => setPositionFilters((prev) => ({ ...prev, exchange: value }))}
                              options={Array.from(new Set(mockPositions.map((p) => p.exchange)))}
                              placeholder="Filter exchange..."
                            />
                          </div>
                        </TableHead>
                        <TableHead className="font-semibold">
                          <div className="flex items-center gap-2 select-none">
                            Broker
                            <ColumnFilter
                              value={positionFilters.broker}
                              onChange={(value) => setPositionFilters((prev) => ({ ...prev, broker: value }))}
                              options={Array.from(new Set(mockPositions.map((p) => p.broker)))}
                              placeholder="Filter broker..."
                            />
                          </div>
                        </TableHead>
                        <TableHead className="font-semibold">Net Qty</TableHead>
                        <TableHead className="font-semibold">Buy Qty</TableHead>
                        <TableHead className="font-semibold">Sell Qty</TableHead>
                        <TableHead className="font-semibold">LTP</TableHead>
                        <TableHead className="font-semibold">Sell Price</TableHead>
                        <TableHead className="font-semibold">Buy Price</TableHead>
                        <TableHead className="font-semibold">PnL</TableHead>
                        <TableHead className="font-semibold">Real PnL</TableHead>
                        <TableHead className="font-semibold">Unreal PnL</TableHead>
                        <TableHead className="w-12 font-semibold">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPositions.map((position, index) => (
                        <TableRow
                          key={position.id}
                          className="hover:bg-slate-50/80 transition-colors dark:hover:bg-slate-800/50"
                        >
                          <TableCell>
                            <Checkbox
                              checked={selectedPositions.includes(position.id)}
                              onCheckedChange={() => togglePositionSelection(position.id)}
                              aria-label={`Select position ${position.id}`}
                            />
                          </TableCell>
                          <TableCell className="font-medium">{index + 1}</TableCell>
                          <TableCell className="font-medium">{position.account}</TableCell>
                          <TableCell>
                            <div className="font-medium">{position.symbol}</div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={position.direction === "LONG" ? "default" : "destructive"}
                              className={
                                position.direction === "LONG"
                                  ? "bg-green-500 hover:bg-green-600"
                                  : "bg-red-500 hover:bg-red-600"
                              }
                            >
                              {position.direction}
                            </Badge>
                          </TableCell>
                          <TableCell>{position.type}</TableCell>
                          <TableCell>{position.state}</TableCell>
                          <TableCell>{position.exchange}</TableCell>
                          <TableCell>{position.broker}</TableCell>
                          <TableCell className="font-medium">{position.netQty}</TableCell>
                          <TableCell>{position.buyQty}</TableCell>
                          <TableCell>{position.sellQty}</TableCell>
                          <TableCell className="font-medium">₹{position.ltp.toFixed(2)}</TableCell>
                          <TableCell>{position.sellPrice > 0 ? `₹${position.sellPrice.toFixed(2)}` : "-"}</TableCell>
                          <TableCell>{position.buyPrice > 0 ? `₹${position.buyPrice.toFixed(2)}` : "-"}</TableCell>
                          <TableCell
                            className={`font-semibold ${
                              position.pnl >= 0
                                ? "text-green-600 dark:text-green-400"
                                : "text-red-600 dark:text-red-400"
                            }`}
                          >
                            {position.pnl >= 0 ? "+" : ""}₹{position.pnl.toFixed(2)}
                          </TableCell>
                          <TableCell
                            className={`${
                              position.realPnl >= 0
                                ? "text-green-600 dark:text-green-400"
                                : "text-red-600 dark:text-red-400"
                            }`}
                          >
                            {position.realPnl >= 0 ? "+" : ""}₹{position.realPnl.toFixed(2)}
                          </TableCell>
                          <TableCell
                            className={`${
                              position.unrealPnl >= 0
                                ? "text-green-600 dark:text-green-400"
                                : "text-red-600 dark:text-red-400"
                            }`}
                          >
                            {position.unrealPnl >= 0 ? "+" : ""}₹{position.unrealPnl.toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                              onClick={() => handleIndividualSquareOff(position.id)}
                              disabled={isLoading}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      {filteredPositions.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={19} className="h-24 text-center">
                            No positions found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="mt-6">
            <Card className="border-0 shadow-lg overflow-hidden bg-white/90 backdrop-blur-sm dark:bg-slate-800/90">
              <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-purple-100 dark:from-purple-900/20 dark:to-indigo-900/20 dark:border-purple-800/30">
                <div>
                  <CardTitle className="text-xl font-semibold text-purple-800 dark:text-purple-300">Orders</CardTitle>
                  <CardDescription>All orders across accounts</CardDescription>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Input
                    placeholder="Search orders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-[200px] bg-white/80 dark:bg-slate-700/50"
                  />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-white/80 hover:bg-white dark:bg-slate-700/50 dark:hover:bg-slate-700"
                      >
                        <Filter className="h-4 w-4 mr-1" />
                        Filter
                        {(selectedFilter !== "all" ||
                          selectedStrategy !== "all" ||
                          selectedPortfolio !== "all" ||
                          selectedUser !== "all") && <div className="ml-1 w-2 h-2 rounded-full bg-blue-500"></div>}
                        <ChevronDown className="h-4 w-4 ml-1" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>Filter By</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setSelectedFilter("all")}>All Orders</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSelectedFilter("buy")}>Buy Orders</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSelectedFilter("sell")}>Sell Orders</DropdownMenuItem>

                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setSelectedFilter("pending")}>Pending Orders</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSelectedFilter("completed")}>
                        Completed Orders
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSelectedFilter("rejected")}>Rejected Orders</DropdownMenuItem>

                      <DropdownMenuSeparator />
                      <DropdownMenuLabel>Strategy</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => setSelectedStrategy("all")}>All Strategies</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSelectedStrategy("momentum")}>Momentum</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSelectedStrategy("meanreversion")}>
                        Mean Reversion
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSelectedStrategy("volatility")}>Volatility</DropdownMenuItem>

                      <DropdownMenuSeparator />
                      <DropdownMenuLabel>Portfolio</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => setSelectedPortfolio("all")}>All Portfolios</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSelectedPortfolio("aggressive")}>Aggressive</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSelectedPortfolio("balanced")}>Balanced</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSelectedPortfolio("conservative")}>
                        Conservative
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />
                      <DropdownMenuLabel>User</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => setSelectedUser("all")}>All Users</DropdownMenuItem>
                      {Array.from(new Set(mockUsers.map((user) => user.account))).map((account) => (
                        <DropdownMenuItem key={account} onClick={() => setSelectedUser(account)}>
                          {account}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  {(selectedFilter !== "all" ||
                    selectedStrategy !== "all" ||
                    selectedPortfolio !== "all" ||
                    selectedUser !== "all") && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedFilter("all")
                        setSelectedStrategy("all")
                        setSelectedPortfolio("all")
                        setSelectedUser("all")
                      }}
                      className="text-xs px-2 h-8"
                    >
                      Reset Filters
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1 bg-white/80 hover:bg-white dark:bg-slate-700/50 dark:hover:bg-slate-700"
                    onClick={() => {
                      toast({
                        title: "Refreshed",
                        description: "Orders data has been refreshed successfully",
                      })
                    }}
                  >
                    <RefreshCw className="h-4 w-4" />
                    Refresh
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-slate-50 dark:bg-slate-800/50">
                      <TableRow className="hover:bg-slate-50/50 dark:hover:bg-slate-800/70">
                        <TableHead className="w-12 font-semibold">SI No</TableHead>
                        <TableHead className="font-semibold">
                          <div className="flex items-center gap-2 select-none">
                            Symbol
                            <ColumnFilter
                              value={orderFilters.symbol}
                              onChange={(value) => setOrderFilters((prev) => ({ ...prev, symbol: value }))}
                              placeholder="Filter symbols..."
                            />
                          </div>
                        </TableHead>
                        <TableHead className="font-semibold">
                          <div className="flex items-center gap-2 select-none">
                            Account
                            <ColumnFilter
                              value={orderFilters.account}
                              onChange={(value) => setOrderFilters((prev) => ({ ...prev, account: value }))}
                              options={Array.from(new Set(mockOrders.map((o) => o.account)))}
                              placeholder="Filter accounts..."
                            />
                          </div>
                        </TableHead>
                        <TableHead className="font-semibold">
                          <div className="flex items-center gap-2 select-none">
                            BUY/SELL
                            <ColumnFilter
                              value={orderFilters.buySell}
                              onChange={(value) => setOrderFilters((prev) => ({ ...prev, buySell: value }))}
                              options={["BUY", "SELL"]}
                              placeholder="Filter buy/sell..."
                            />
                          </div>
                        </TableHead>
                        <TableHead className="font-semibold">
                          <div className="flex items-center gap-2 select-none">
                            Execution Status
                            <ColumnFilter
                              value={orderFilters.executionStatus}
                              onChange={(value) => setOrderFilters((prev) => ({ ...prev, executionStatus: value }))}
                              options={["COMPLETE", "PENDING", "REJECTED"]}
                              placeholder="Filter status..."
                            />
                          </div>
                        </TableHead>
                        <TableHead className="font-semibold">
                          <div className="flex items-center gap-2 select-none">
                            Trading Account
                            <ColumnFilter
                              value={orderFilters.tradingAccount}
                              onChange={(value) => setOrderFilters((prev) => ({ ...prev, tradingAccount: value }))}
                              options={Array.from(new Set(mockOrders.map((o) => o.tradingAccount)))}
                              placeholder="Filter trading accounts..."
                            />
                          </div>
                        </TableHead>
                        <TableHead className="font-semibold">
                          <div className="flex items-center gap-2 select-none">
                            Product
                            <ColumnFilter
                              value={orderFilters.product}
                              onChange={(value) => setOrderFilters((prev) => ({ ...prev, product: value }))}
                              options={Array.from(new Set(mockOrders.map((o) => o.product)))}
                              placeholder="Filter products..."
                            />
                          </div>
                        </TableHead>
                        <TableHead className="font-semibold">
                          <div className="flex items-center gap-2 select-none">
                            Exchange
                            <ColumnFilter
                              value={orderFilters.exchange}
                              onChange={(value) => setOrderFilters((prev) => ({ ...prev, exchange: value }))}
                              options={Array.from(new Set(mockOrders.map((o) => o.exchange)))}
                              placeholder="Filter exchange..."
                            />
                          </div>
                        </TableHead>
                        <TableHead className="font-semibold">
                          <div className="flex items-center gap-2 select-none">
                            Broker
                            <ColumnFilter
                              value={orderFilters.broker}
                              onChange={(value) => setOrderFilters((prev) => ({ ...prev, broker: value }))}
                              options={Array.from(new Set(mockOrders.map((o) => o.broker)))}
                              placeholder="Filter broker..."
                            />
                          </div>
                        </TableHead>
                        <TableHead className="font-semibold">Pend Qty</TableHead>
                        <TableHead className="font-semibold">Price</TableHead>
                        <TableHead className="font-semibold">Qty</TableHead>
                        <TableHead className="font-semibold">Execution Status</TableHead>
                        <TableHead className="font-semibold">Trading Account</TableHead>
                        <TableHead className="font-semibold">Id</TableHead>
                        <TableHead className="font-semibold">Update Time</TableHead>
                        <TableHead className="font-semibold">Product</TableHead>
                        <TableHead className="font-semibold">Exchange</TableHead>
                        <TableHead className="font-semibold">Fill Qty</TableHead>
                        <TableHead className="font-semibold">Broker</TableHead>
                        <TableHead className="font-semibold">Date</TableHead>
                        <TableHead className="font-semibold">Reject Reason</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredOrders.map((order, index) => (
                        <TableRow
                          key={order.id}
                          className="hover:bg-slate-50/80 transition-colors dark:hover:bg-slate-800/50"
                        >
                          <TableCell className="font-medium">{index + 1}</TableCell>
                          <TableCell className="font-medium">{order.symbol}</TableCell>
                          <TableCell>{order.account}</TableCell>
                          <TableCell>
                            <Badge
                              variant={order.buySell === "BUY" ? "default" : "destructive"}
                              className={
                                order.buySell === "BUY"
                                  ? "bg-green-500 hover:bg-green-600"
                                  : "bg-red-500 hover:bg-red-600"
                              }
                            >
                              {order.buySell}
                            </Badge>
                          </TableCell>
                          <TableCell>{order.pendQty}</TableCell>
                          <TableCell className="font-medium">₹{order.price.toFixed(2)}</TableCell>
                          <TableCell className="font-medium">{order.qty}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                order.executionStatus === "COMPLETE"
                                  ? "default"
                                  : order.executionStatus === "PENDING"
                                    ? "outline"
                                    : "destructive"
                              }
                              className={
                                order.executionStatus === "COMPLETE"
                                  ? "bg-green-500 hover:bg-green-600"
                                  : order.executionStatus === "PENDING"
                                    ? "border-amber-500 text-amber-600 bg-amber-50 dark:bg-amber-900/20"
                                    : "bg-red-500 hover:bg-red-600"
                              }
                            >
                              {order.executionStatus}
                            </Badge>
                          </TableCell>
                          <TableCell>{order.tradingAccount}</TableCell>
                          <TableCell>
                            <span className="font-mono text-xs">{order.orderId}</span>
                          </TableCell>
                          <TableCell>{order.updateTime}</TableCell>
                          <TableCell>{order.product}</TableCell>
                          <TableCell>{order.exchange}</TableCell>
                          <TableCell>{order.fillQty}</TableCell>
                          <TableCell>{order.broker}</TableCell>
                          <TableCell>{order.date}</TableCell>
                          <TableCell className="text-red-600 dark:text-red-400">{order.rejectReason || "-"}</TableCell>
                        </TableRow>
                      ))}
                      {filteredOrders.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={17} className="h-24 text-center">
                            No orders found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Manual Close Interface */}
          <TabsContent value="manual" className="mt-6">
            <Card className="border-0 shadow-lg overflow-hidden bg-white/90 backdrop-blur-sm dark:bg-slate-800/90">
              <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100 dark:from-amber-900/20 dark:to-orange-900/20 dark:border-amber-800/30">
                <CardTitle className="text-xl font-semibold text-amber-800 dark:text-amber-300">
                  Trade Interface
                </CardTitle>
                <CardDescription>Manually execute trades, close positions or cancel orders</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100 dark:from-blue-900/20 dark:to-indigo-900/20 dark:border-blue-800/30">
                    <h3 className="text-lg font-medium text-blue-800 dark:text-blue-300">Close Position</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Account</label>
                        <Select
                          value={closePositionForm.account}
                          onValueChange={(value) => setClosePositionForm((prev) => ({ ...prev, account: value }))}
                        >
                          <SelectTrigger className="bg-white dark:bg-slate-700">
                            <SelectValue placeholder="Select account" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from(new Set(mockPositions.map((p) => p.account))).map((account) => (
                              <SelectItem key={account} value={account}>
                                {account}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Symbol</label>
                        <Select
                          value={closePositionForm.symbol}
                          onValueChange={(value) => setClosePositionForm((prev) => ({ ...prev, symbol: value }))}
                        >
                          <SelectTrigger className="bg-white dark:bg-slate-700">
                            <SelectValue placeholder="Select symbol" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from(new Set(mockPositions.map((p) => p.symbol))).map((symbol) => (
                              <SelectItem key={symbol} value={symbol}>
                                {symbol}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Quantity</label>
                        <Input
                          type="number"
                          placeholder="Enter quantity"
                          className="bg-white dark:bg-slate-700"
                          value={closePositionForm.quantity}
                          onChange={(e) => setClosePositionForm((prev) => ({ ...prev, quantity: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Price Type</label>
                        <Select
                          value={closePositionForm.priceType}
                          onValueChange={(value) => setClosePositionForm((prev) => ({ ...prev, priceType: value }))}
                        >
                          <SelectTrigger className="bg-white dark:bg-slate-700">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="market">Market</SelectItem>
                            <SelectItem value="limit">Limit</SelectItem>
                            <SelectItem value="sl">Stop Loss</SelectItem>
                            <SelectItem value="slm">Stop Loss Market</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {closePositionForm.priceType === "limit" && (
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Price</label>
                          <Input
                            type="number"
                            placeholder="Enter price"
                            className="bg-white dark:bg-slate-700"
                            value={closePositionForm.price}
                            onChange={(e) => setClosePositionForm((prev) => ({ ...prev, price: e.target.value }))}
                          />
                        </div>
                      )}
                      <Button
                        className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                        onClick={handleClosePosition}
                        disabled={isLoading}
                      >
                        {isLoading ? "Processing..." : "Close Position"}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-4 p-6 bg-gradient-to-br from-red-50 to-pink-50 rounded-xl border border-red-100 dark:from-red-900/20 dark:to-pink-900/20 dark:border-red-800/30">
                    <h3 className="text-lg font-medium text-red-800 dark:text-red-300">Cancel Order</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Account</label>
                        <Select
                          value={cancelOrderForm.account}
                          onValueChange={(value) => setCancelOrderForm((prev) => ({ ...prev, account: value }))}
                        >
                          <SelectTrigger className="bg-white dark:bg-slate-700">
                            <SelectValue placeholder="Select account" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from(new Set(mockOrders.map((o) => o.account))).map((account) => (
                              <SelectItem key={account} value={account}>
                                {account}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Order ID</label>
                        <Select
                          value={cancelOrderForm.orderId}
                          onValueChange={(value) => setCancelOrderForm((prev) => ({ ...prev, orderId: value }))}
                        >
                          <SelectTrigger className="bg-white dark:bg-slate-700">
                            <SelectValue placeholder="Select order ID" />
                          </SelectTrigger>
                          <SelectContent>
                            {mockOrders
                              .filter((o) => o.executionStatus === "PENDING")
                              .map((order) => (
                                <SelectItem key={order.orderId} value={order.orderId}>
                                  {order.orderId} - {order.symbol}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="pt-8">
                        <Button
                          variant="destructive"
                          className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                          onClick={handleCancelOrder}
                          disabled={isLoading}
                        >
                          {isLoading ? "Processing..." : "Cancel Order"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Margin Tab */}
          <TabsContent value="margin" className="mt-6">
            <Card className="border-0 shadow-lg overflow-hidden bg-white/90 backdrop-blur-sm dark:bg-slate-800/90">
              <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100 dark:from-green-900/20 dark:to-emerald-900/20 dark:border-green-800/30">
                <div>
                  <CardTitle className="text-xl font-semibold text-green-800 dark:text-green-300">
                    Margin Information
                  </CardTitle>
                  <CardDescription>Margin details across all accounts</CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1 bg-white/80 hover:bg-white dark:bg-slate-700/50 dark:hover:bg-slate-700"
                  onClick={() => {
                    toast({
                      title: "Refreshed",
                      description: "Margin data has been refreshed successfully",
                    })
                  }}
                >
                  <RefreshCw className="h-4 w-4" />
                  Refresh
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-slate-50 dark:bg-slate-800/50">
                      <TableRow className="hover:bg-slate-50/50 dark:hover:bg-slate-800/70">
                        <TableHead className="w-12 font-semibold">SI No</TableHead>
                        <TableHead className="font-semibold">Account</TableHead>
                        <TableHead className="font-semibold">Trading Account</TableHead>
                        <TableHead className="font-semibold">Broker</TableHead>
                        <TableHead className="font-semibold">Total Margin</TableHead>
                        <TableHead className="font-semibold">Available Margin</TableHead>
                        <TableHead className="font-semibold">Used Margin</TableHead>
                        <TableHead className="font-semibold">Utilized %</TableHead>
                        <TableHead className="font-semibold">Utilization</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockMargin.map((margin, index) => (
                        <TableRow
                          key={margin.id}
                          className="hover:bg-slate-50/80 transition-colors dark:hover:bg-slate-800/50"
                        >
                          <TableCell className="font-medium">{index + 1}</TableCell>
                          <TableCell className="font-medium">{margin.account}</TableCell>
                          <TableCell>{margin.tradingAccount}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-white/50 dark:bg-slate-700/50">
                              {margin.broker}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium">₹{margin.totalMargin.toLocaleString()}</TableCell>
                          <TableCell className="font-medium text-green-600 dark:text-green-400">
                            ₹{margin.availableMargin.toLocaleString()}
                          </TableCell>
                          <TableCell className="font-medium text-blue-600 dark:text-blue-400">
                            ₹{margin.usedMargin.toLocaleString()}
                          </TableCell>
                          <TableCell className="font-medium">{margin.utilizedPercentage}%</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Progress
                                value={margin.utilizedPercentage}
                                className="h-2.5 w-[120px]"
                                indicatorClassName={
                                  margin.utilizedPercentage < 50
                                    ? "bg-green-500"
                                    : margin.utilizedPercentage < 75
                                      ? "bg-yellow-500"
                                      : "bg-red-500"
                                }
                              />
                              <span
                                className={`text-xs font-medium ${
                                  margin.utilizedPercentage < 50
                                    ? "text-green-600 dark:text-green-400"
                                    : margin.utilizedPercentage < 75
                                      ? "text-yellow-600 dark:text-yellow-400"
                                      : "text-red-600 dark:text-red-400"
                                }`}
                              >
                                {margin.utilizedPercentage < 50
                                  ? "Low"
                                  : margin.utilizedPercentage < 75
                                    ? "Medium"
                                    : "High"}
                              </span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
