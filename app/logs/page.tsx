"use client"

import { useState, useEffect, useMemo } from "react"
import {
  X,
  AlertTriangle,
  AlertCircle,
  MessageSquare,
  TrendingUp,
  Trash2,
  Copy,
  Download,
  Search,
  ChevronDown,
  Clock,
  User,
  Briefcase,
  SlidersHorizontal,
  Calendar,
  ArrowUpDown,
  ChevronRight,
  ChevronLeft,
  Info,
  CheckCircle2,
  XCircle,
  Bell,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Switch } from "@/components/ui/switch"

interface LogEntry {
  id: string
  timestamp: string
  logType: string
  user: string
  strategy: string
  portfolio: string
  message: string
  severity?: "info" | "warning" | "error" | "success"
  isNew?: boolean
}

export default function LogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [filter, setFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null)
  const [timeRange, setTimeRange] = useState("today")
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const logsPerPage = 10

  useEffect(() => {
    // In a real app, you would fetch logs from an API
    // This is mock data based on the image
    const mockLogs: LogEntry[] = [
      {
        id: "1",
        timestamp: "15:40:53.671",
        logType: "MESSAGE",
        user: "MONEYYAI",
        strategy: "",
        portfolio: "",
        message:
          "User ID: MONEYYAI Logged in successfully. Expiry Date: 15-Jun-2025, Max Users: 5, Version: 1.0.2.799.",
        severity: "info",
        isNew: true,
      },
      {
        id: "2",
        timestamp: "15:41:12.345",
        logType: "WARNING",
        user: "MONEYYAI",
        strategy: "Iron Condor",
        portfolio: "Portfolio 1",
        message: "Strategy execution delayed due to market volatility.",
        severity: "warning",
      },
      {
        id: "3",
        timestamp: "15:42:30.128",
        logType: "ERROR",
        user: "MONEYYAI",
        strategy: "Butterfly",
        portfolio: "Portfolio 2",
        message: "Failed to execute order: Insufficient funds.",
        severity: "error",
      },
      {
        id: "4",
        timestamp: "15:43:05.789",
        logType: "TRADING",
        user: "MONEYYAI",
        strategy: "Bull Call Spread",
        portfolio: "Portfolio 1",
        message: "Order executed: Buy 10 NIFTY 22000 CE @ 150.25",
        severity: "success",
      },
      {
        id: "5",
        timestamp: "15:44:22.456",
        logType: "MESSAGE",
        user: "Admin",
        strategy: "",
        portfolio: "",
        message: "System maintenance scheduled for 22-May-2025 at 02:00 AM.",
        severity: "info",
      },
      {
        id: "6",
        timestamp: "15:45:18.901",
        logType: "TRADING",
        user: "MONEYYAI",
        strategy: "Bear Put Spread",
        portfolio: "Portfolio 3",
        message: "Order executed: Sell 5 BANKNIFTY 45000 PE @ 250.75",
        severity: "success",
      },
      {
        id: "7",
        timestamp: "15:46:33.222",
        logType: "WARNING",
        user: "MONEYYAI",
        strategy: "Straddle",
        portfolio: "Portfolio 2",
        message: "High implied volatility detected. Consider adjusting strategy parameters.",
        severity: "warning",
      },
      {
        id: "8",
        timestamp: "15:47:45.678",
        logType: "MESSAGE",
        user: "System",
        strategy: "",
        portfolio: "",
        message: "Market data feed updated. Latest data available for analysis.",
        severity: "info",
      },
      {
        id: "9",
        timestamp: "15:48:59.123",
        logType: "ERROR",
        user: "MONEYYAI",
        strategy: "Calendar Spread",
        portfolio: "Portfolio 1",
        message: "API connection failed. Retrying in 30 seconds.",
        severity: "error",
      },
      {
        id: "10",
        timestamp: "15:50:10.456",
        logType: "TRADING",
        user: "MONEYYAI",
        strategy: "Covered Call",
        portfolio: "Portfolio 3",
        message: "Position closed: NIFTY 21500 CE @ 180.50. Profit: ₹3,025",
        severity: "success",
      },
      {
        id: "11",
        timestamp: "15:51:25.789",
        logType: "MESSAGE",
        user: "MONEYYAI",
        strategy: "",
        portfolio: "",
        message: "Profile settings updated. New email notification preferences saved.",
        severity: "info",
      },
      {
        id: "12",
        timestamp: "15:52:40.123",
        logType: "WARNING",
        user: "System",
        strategy: "All Strategies",
        portfolio: "All Portfolios",
        message: "Market closing in 10 minutes. Consider closing intraday positions.",
        severity: "warning",
      },
    ]

    setLogs(mockLogs)
  }, [])

  // Auto-refresh effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (autoRefresh) {
      interval = setInterval(() => {
        // In a real app, you would fetch fresh logs here
        console.log("Auto-refreshing logs...")
        // For demo, we'll just add a new log entry
        const newLog: LogEntry = {
          id: `new-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString("en-US", {
            hour12: false,
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            fractionalSecondDigits: 3,
          }),
          logType: ["MESSAGE", "WARNING", "ERROR", "TRADING"][Math.floor(Math.random() * 4)],
          user: "MONEYYAI",
          strategy: "",
          portfolio: "",
          message: "Auto-refreshed log entry " + new Date().toLocaleTimeString(),
          severity: ["info", "warning", "error", "success"][Math.floor(Math.random() * 4)] as any,
          isNew: true,
        }

        setLogs((prevLogs) => [newLog, ...prevLogs])
      }, 10000) // Refresh every 10 seconds
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [autoRefresh])

  const clearLogs = () => {
    setLogs([])
  }

  const copyAll = () => {
    const logText = logs
      .map(
        (log) =>
          `${log.timestamp} | ${log.logType} | ${log.user} | ${log.strategy} | ${log.portfolio} | ${log.message}`,
      )
      .join("\n")

    navigator.clipboard.writeText(logText)
  }

  const exportLogs = () => {
    const logText = logs
      .map((log) => `${log.timestamp},${log.logType},${log.user},${log.strategy},${log.portfolio},${log.message}`)
      .join("\n")

    const header = "Timestamp,LogType,User,Strategy,Portfolio,Message\n"
    const csvContent = header + logText

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", "trading_logs.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      // Apply type filter
      if (filter !== "all" && log.logType !== filter) return false

      // Apply search term
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase()
        return (
          log.message.toLowerCase().includes(searchLower) ||
          log.user.toLowerCase().includes(searchLower) ||
          log.strategy.toLowerCase().includes(searchLower) ||
          log.portfolio.toLowerCase().includes(searchLower) ||
          log.logType.toLowerCase().includes(searchLower)
        )
      }

      return true
    })
  }, [logs, filter, searchTerm])

  // Pagination
  const currentLogs = useMemo(() => {
    const indexOfLastLog = currentPage * logsPerPage
    const indexOfFirstLog = indexOfLastLog - logsPerPage
    return filteredLogs.slice(indexOfFirstLog, indexOfLastLog)
  }, [filteredLogs, currentPage])

  const totalPages = Math.ceil(filteredLogs.length / logsPerPage)

  // Count by log type
  const logCounts = useMemo(() => {
    return {
      all: logs.length,
      attention: logs.filter((log) => log.severity === "warning").length,
      errors: logs.filter((log) => log.severity === "error").length,
      warnings: logs.filter((log) => log.severity === "warning").length,
      messages: logs.filter((log) => log.logType === "MESSAGE").length,
      trading: logs.filter((log) => log.logType === "TRADING").length,
    }
  }, [logs])

  const getLogTypeIcon = (logType: string, severity?: string) => {
    switch (logType) {
      case "MESSAGE":
        return <MessageSquare className="h-4 w-4 text-blue-500" />
      case "WARNING":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case "ERROR":
        return <X className="h-4 w-4 text-red-500" />
      case "TRADING":
        return <TrendingUp className="h-4 w-4 text-emerald-500" />
      default:
        if (severity === "success") return <CheckCircle2 className="h-4 w-4 text-emerald-500" />
        if (severity === "warning") return <AlertCircle className="h-4 w-4 text-yellow-500" />
        if (severity === "error") return <XCircle className="h-4 w-4 text-red-500" />
        return <Info className="h-4 w-4 text-blue-500" />
    }
  }

  const getLogTypeBadge = (logType: string, severity?: string) => {
    let bgColor = "bg-gray-100 text-gray-800"
    let icon = <Info className="h-3 w-3 mr-1" />

    switch (logType) {
      case "MESSAGE":
        bgColor = "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
        icon = <MessageSquare className="h-3 w-3 mr-1" />
        break
      case "WARNING":
        bgColor = "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
        icon = <AlertCircle className="h-3 w-3 mr-1" />
        break
      case "ERROR":
        bgColor = "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
        icon = <X className="h-3 w-3 mr-1" />
        break
      case "TRADING":
        bgColor = "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300"
        icon = <TrendingUp className="h-3 w-3 mr-1" />
        break
    }

    return (
      <Badge variant="outline" className={`${bgColor} flex items-center px-2 py-0.5 text-xs font-medium rounded-full`}>
        {icon}
        {logType}
      </Badge>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      <main className="flex-1 container mx-auto py-6 px-4">
        <Card className="shadow-lg border-0 overflow-hidden bg-white dark:bg-gray-950">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 border-b border-gray-100 dark:border-gray-800 p-4 md:p-6">
            <div className="flex flex-col space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <CardTitle className="text-xl md:text-2xl font-bold flex items-center">
                  <Bell className="h-5 w-5 mr-2 text-blue-500" />
                  System Logs
                </CardTitle>

                <div className="flex items-center gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500 dark:text-gray-400">Auto-refresh</span>
                          <Switch
                            checked={autoRefresh}
                            onCheckedChange={setAutoRefresh}
                            className="data-[state=checked]:bg-blue-500"
                          />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Automatically refresh logs every 10 seconds</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={filter === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter("all")}
                    className={filter === "all" ? "bg-blue-500 hover:bg-blue-600" : ""}
                  >
                    <CheckCircle2 className="h-4 w-4 mr-1" /> All Logs ({logCounts.all})
                  </Button>
                  <Button
                    variant={filter === "attention" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter("attention")}
                    className={filter === "attention" ? "bg-amber-500 hover:bg-amber-600" : ""}
                  >
                    <AlertTriangle className="h-4 w-4 mr-1 text-amber-500" /> Attention ({logCounts.attention})
                  </Button>
                  <Button
                    variant={filter === "ERROR" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter("ERROR")}
                    className={filter === "ERROR" ? "bg-red-500 hover:bg-red-600" : ""}
                  >
                    <X className="h-4 w-4 mr-1 text-red-500" /> Errors ({logCounts.errors})
                  </Button>
                  <Button
                    variant={filter === "WARNING" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter("WARNING")}
                    className={filter === "WARNING" ? "bg-yellow-500 hover:bg-yellow-600" : ""}
                  >
                    <AlertCircle className="h-4 w-4 mr-1 text-yellow-500" /> Warnings ({logCounts.warnings})
                  </Button>
                  <Button
                    variant={filter === "MESSAGE" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter("MESSAGE")}
                    className={filter === "MESSAGE" ? "bg-blue-500 hover:bg-blue-600" : ""}
                  >
                    <MessageSquare className="h-4 w-4 mr-1 text-blue-500" /> Messages ({logCounts.messages})
                  </Button>
                  <Button
                    variant={filter === "TRADING" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter("TRADING")}
                    className={filter === "TRADING" ? "bg-emerald-500 hover:bg-emerald-600" : ""}
                  >
                    <TrendingUp className="h-4 w-4 mr-1 text-emerald-500" /> Trading ({logCounts.trading})
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2 w-full md:w-auto">
                  <div className="relative w-full md:w-auto">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      type="text"
                      placeholder="Search logs..."
                      className="pl-9 h-9 w-full md:w-[200px] lg:w-[300px]"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="h-9">
                        <Calendar className="h-4 w-4 mr-1" />
                        {timeRange === "today"
                          ? "Today"
                          : timeRange === "week"
                            ? "This Week"
                            : timeRange === "month"
                              ? "This Month"
                              : "All Time"}
                        <ChevronDown className="h-4 w-4 ml-1" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => setTimeRange("today")}>Today</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setTimeRange("week")}>This Week</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setTimeRange("month")}>This Month</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setTimeRange("all")}>All Time</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <Button variant="outline" size="sm" className="h-9" onClick={() => setShowFilters(!showFilters)}>
                    <SlidersHorizontal className="h-4 w-4 mr-1" />
                    {showFilters ? "Hide Filters" : "Show Filters"}
                  </Button>
                </div>
              </div>

              {showFilters && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg mt-2">
                  <div>
                    <label className="text-sm font-medium">Filter by User</label>
                    <Input placeholder="Enter username" className="mt-1" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Filter by Strategy</label>
                    <Input placeholder="Enter strategy name" className="mt-1" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Filter by Portfolio</label>
                    <Input placeholder="Enter portfolio name" className="mt-1" />
                  </div>
                </div>
              )}

              <div className="flex flex-wrap justify-between items-center gap-2 mt-2">
                <div className="flex gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <span className="text-gray-500">NIFTY:</span>
                    <span className="text-purple-600 dark:text-purple-400 font-medium">22,456.80</span>
                    <span className="text-green-500">+1.2%</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-gray-500">BNF:</span>
                    <span className="text-amber-600 dark:text-amber-400 font-medium">48,123.45</span>
                    <span className="text-green-500">+0.8%</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-gray-500">FIN:</span>
                    <span className="text-green-600 dark:text-green-400 font-medium">21,789.30</span>
                    <span className="text-red-500">-0.3%</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={clearLogs} className="h-9">
                    <Trash2 className="h-4 w-4 mr-1" /> Clear
                  </Button>
                  <Button variant="outline" size="sm" onClick={copyAll} className="h-9">
                    <Copy className="h-4 w-4 mr-1" /> Copy
                  </Button>
                  <Button variant="outline" size="sm" onClick={exportLogs} className="h-9">
                    <Download className="h-4 w-4 mr-1" /> Export
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="w-full">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-900 border-y border-gray-200 dark:border-gray-800">
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          Timestamp
                          <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                            <ArrowUpDown className="h-3 w-3" />
                          </Button>
                        </div>
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <div className="flex items-center gap-1">
                          Log Type
                          <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                            <ArrowUpDown className="h-3 w-3" />
                          </Button>
                        </div>
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          User
                          <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                            <ArrowUpDown className="h-3 w-3" />
                          </Button>
                        </div>
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <div className="flex items-center gap-1">
                          Strategy
                          <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                            <ArrowUpDown className="h-3 w-3" />
                          </Button>
                        </div>
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <div className="flex items-center gap-1">
                          <Briefcase className="h-4 w-4" />
                          Portfolio
                          <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                            <ArrowUpDown className="h-3 w-3" />
                          </Button>
                        </div>
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <div className="flex items-center gap-1">
                          Message
                          <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                            <ArrowUpDown className="h-3 w-3" />
                          </Button>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                    {currentLogs.length > 0 ? (
                      currentLogs.map((log) => (
                        <tr
                          key={log.id}
                          className={`
                              hover:bg-gray-50 dark:hover:bg-gray-900 
                              ${log.isNew ? "animate-highlight" : ""}
                              ${log.severity === "error" ? "bg-red-50 dark:bg-red-900/20" : ""}
                              ${log.severity === "warning" ? "bg-yellow-50 dark:bg-yellow-900/20" : ""}
                            `}
                        >
                          <td className="px-4 py-3 whitespace-nowrap font-mono text-xs text-gray-700 dark:text-gray-300">
                            {log.timestamp}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">{getLogTypeBadge(log.logType, log.severity)}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            {log.user ? (
                              <Badge
                                variant="outline"
                                className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                              >
                                <User className="h-3 w-3 mr-1" />
                                {log.user}
                              </Badge>
                            ) : (
                              "-"
                            )}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            {log.strategy ? (
                              <Badge
                                variant="outline"
                                className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
                              >
                                {log.strategy}
                              </Badge>
                            ) : (
                              "-"
                            )}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            {log.portfolio ? (
                              <Badge
                                variant="outline"
                                className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                              >
                                <Briefcase className="h-3 w-3 mr-1" />
                                {log.portfolio}
                              </Badge>
                            ) : (
                              "-"
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 max-w-md truncate">
                            <div className="flex items-center">
                              {getLogTypeIcon(log.logType, log.severity)}
                              <span className="ml-2">{log.message}</span>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                          No logs found matching your criteria
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
            <div className="text-sm text-gray-500">
              Showing {Math.min(filteredLogs.length, (currentPage - 1) * logsPerPage + 1)} to{" "}
              {Math.min(filteredLogs.length, currentPage * logsPerPage)} of {filteredLogs.length} logs
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const pageNum = i + 1
                  return (
                    <Button
                      key={i}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      className={`w-8 h-8 p-0 ${currentPage === pageNum ? "bg-blue-500" : ""}`}
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  )
                })}

                {totalPages > 5 && (
                  <>
                    <span className="mx-1">...</span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-8 h-8 p-0"
                      onClick={() => setCurrentPage(totalPages)}
                    >
                      {totalPages}
                    </Button>
                  </>
                )}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      </main>

      <style jsx global>{`
        @keyframes highlight {
          0% { background-color: rgba(59, 130, 246, 0.2); }
          100% { background-color: transparent; }
        }
        
        .animate-highlight {
          animation: highlight 2s ease-in-out;
        }
      `}</style>
    </div>
  )
}
