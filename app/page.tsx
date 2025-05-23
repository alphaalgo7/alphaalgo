"use client"
import { useState, useEffect, useCallback, useMemo } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import type React from "react"
import { motion, AnimatePresence } from "framer-motion"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import {
  RefreshCw,
  Plus,
  ChevronUp,
  ChevronDown,
  LineChart,
  Settings,
  Loader2,
  CheckCircle2,
  Layers,
  BarChart3,
  PieChart,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Trash2,
  Shield,
  Save,
} from "lucide-react"
import { enhancedToast } from "@/components/enhanced-toast"

// Import the utility
import { saveData, saveStrategy, loadData } from "@/utils/save-utils"

// Import the InstrumentCard component at the top of the file with the other imports:
import { InstrumentCard } from "@/components/instrument-card-example"

// Import missing components
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BasicPopup } from "@/components/basic-popup"

// Dummy ToastTest component to resolve the undeclared variable issue
const ToastTest = () => {
  return null // Or any other valid React component
}

// Loading animation component
const LoadingAnimation = () => {
  return (
    <div className="h-[70vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
          </div>
          <svg className="h-24 w-24" viewBox="0 0 100 100">
            <circle
              className="text-slate-200"
              strokeWidth="4"
              stroke="currentColor"
              fill="transparent"
              r="42"
              cx="50"
              cy="50"
            />
            <motion.circle
              className="text-blue-600"
              strokeWidth="4"
              stroke="currentColor"
              fill="transparent"
              r="42"
              cx="50"
              cy="50"
              initial={{ strokeDasharray: "0 264" }}
              animate={{ strokeDasharray: "264 0" }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, repeatType: "loop", ease: "easeInOut" }}
            />
          </svg>
        </div>
        <div className="text-center">
          <h3 className="text-xl font-medium text-slate-800 mb-2">Preparing Strategy Builder</h3>
          <p className="text-slate-500 max-w-md">
            Loading market data and initializing components for your trading strategy...
          </p>
        </div>
        <div className="flex gap-2">
          <motion.div
            className="h-2 w-2 rounded-full bg-blue-500"
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
          />
          <motion.div
            className="h-2 w-2 rounded-full bg-blue-500"
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 1, delay: 0.2, repeat: Number.POSITIVE_INFINITY }}
          />
          <motion.div
            className="h-2 w-2 rounded-full bg-blue-500"
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 1, delay: 0.4, repeat: Number.POSITIVE_INFINITY }}
          />
        </div>
      </div>
    </div>
  )
}

import { useToast } from "@/hooks/use-toast"

export default function TradingPlatform() {
  const { toast } = useToast()
  const [isLoaded, setIsLoaded] = useState(false)
  const [activeFeature, setActiveFeature] = useState(0)
  const [statsVisible, setStatsVisible] = useState(false)

  // Add a state to track if the component is mounted
  const [isMounted, setIsMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [loadingPhase, setLoadingPhase] = useState(0)

  const [lotSize, setLotSize] = useState(75)
  const [strikeStep, setStrikeStep] = useState(50)
  const [legs, setLegs] = useState(() => [
    {
      id: 1,
      action: "SELL",
      type: "CE",
      lots: 1,
      expiry: "Weekly",
      strike: "ATM",
      target: "None",
      targetType: "%",
      stoploss: "None",
      stoplossType: "%",
      time: "00:00:00",
      executeLegs: [1],
      squareOffLegs: [1],
    },
    {
      id: 2,
      action: "SELL",
      type: "PE",
      lots: 1,
      expiry: "Weekly",
      strike: "ATM",
      target: "None",
      targetType: "%",
      stoploss: "None",
      stoplossType: "%",
      time: "00:00:00",
      executeLegs: [1],
      squareOffLegs: [1],
    },
  ])
  const [showPayoffChart, setShowPayoffChart] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [hoveredRow, setHoveredRow] = useState<number | null>(null)
  const [strategyTags, setStrategyTags] = useState(["DEFAULT", "INTRADAY", "POSITIONAL"])
  const [newTagName, setNewTagName] = useState("")
  const [showTagInput, setShowTagInput] = useState(false)
  const [startTime, setStartTime] = useState({ hours: "09", minutes: "20", seconds: "00" })
  const [endTime, setEndTime] = useState({ hours: "15", minutes: "15", seconds: "00" })
  const [sqOffTime, setSqOffTime] = useState({ hours: "15", minutes: "25", seconds: "00" })
  const [activeTimeField, setActiveTimeField] = useState<"hours" | "minutes" | "seconds">("hours")
  const [sqoffLossMaking, setSqoffLossMaking] = useState(false)
  const [sqoffProfitMaking, setSqoffProfitMaking] = useState(false)

  // Profit protection settings
  const [profitProtection, setProfitProtection] = useState({
    profitReachesValue: "10000",
    minimumProfitValue: "5000",
    increasingProfitBy: "1000",
    trailProfitBy: "500",
  })

  // Stoploss protection settings
  const [lossProtection, setLossProtection] = useState({
    lossReachesValue: 5000,
    maximumLossValue: 10000,
    increasingLossBy: 1000,
    trailLossBy: 500,
  })

  const [selectedExecuteLegs, setSelectedExecuteLegs] = useState<number[]>([1])
  const [selectedSquareOffLegs, setSelectedSquareOffLegs] = useState<number[]>([1])

  // Add a state for portfolio name
  const [portfolioName, setPortfolioName] = useState("")

  // Add state for managing the popover visibility for each leg:
  const [openActionPopup, setOpenActionPopup] = useState<number | null>(null)
  const [openTimePopup, setOpenTimePopup] = useState<number | null>(null)
  const [openStrikePopup, setOpenStrikePopup] = useState(false)
  const [payoffDialogOpen, setPayoffDialogOpen] = useState(false)

  const searchParams = useSearchParams()
  const strategyId = searchParams?.get("strategyId")

  // In the TradingPlatform component, add the router
  const router = useRouter()

  // Set isMounted to true when component mounts and handle loading state
  useEffect(() => {
    setIsMounted(true)

    // Simulate a multi-phase loading process
    const timer1 = setTimeout(() => {
      setLoadingPhase(1)
    }, 800)

    const timer2 = setTimeout(() => {
      setLoadingPhase(2)
    }, 1600)

    const timer3 = setTimeout(() => {
      setIsLoading(false)
    }, 2200)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [])

  // Add this useEffect to load strategy data when editing
  useEffect(() => {
    const loadStrategyData = async () => {
      if (strategyId && isMounted) {
        try {
          // Load all strategies
          const strategies = await loadData("strategies", [])

          // Find the strategy with the matching ID
          const strategy = strategies.find((s: any) => s.id === Number(strategyId))

          if (strategy) {
            // Set portfolio name
            setPortfolioName(strategy.name)

            // Set legs if available
            if (strategy.legs && Array.isArray(strategy.legs)) {
              setLegs(strategy.legs)
            }

            // Set lot size
            if (strategy.lotSize) {
              setLotSize(strategy.lotSize)
            }

            // Set strike step
            if (strategy.strikeStep) {
              setStrikeStep(strategy.strikeStep)
            }

            // Set times
            if (strategy.startTime) {
              setStartTime(strategy.startTime)
            }

            if (strategy.endTime) {
              setEndTime(strategy.endTime)
            }

            if (strategy.sqOffTime) {
              setSqOffTime(strategy.sqOffTime)
            }

            // Set profit protection
            if (strategy.profitLocking) {
              const [profitReachesValue, minimumProfitValue, increasingProfitBy, trailProfitBy] =
                strategy.profitLocking.split("~")

              setProfitProtection({
                profitReachesValue: profitReachesValue || "10000",
                minimumProfitValue: minimumProfitValue || "5000",
                increasingProfitBy: increasingProfitBy || "1000",
                trailProfitBy: trailProfitBy || "500",
              })
            }

            // Set loss protection
            if (strategy.maxLoss) {
              setLossProtection({
                ...lossProtection,
                maximumLossValue: Number(strategy.maxLoss),
              })
            }

            // Set tags
            if (strategy.tags && Array.isArray(strategy.tags)) {
              setStrategyTags(strategy.tags)
            }

            enhancedToast({
              title: "Strategy Loaded",
              description: `Loaded strategy "${strategy.name}" for editing`,
              variant: "default",
            })
          } else {
            enhancedToast({
              title: "Error",
              description: "Strategy not found",
              variant: "destructive",
            })
          }
        } catch (error) {
          console.error("Error loading strategy:", error)
          enhancedToast({
            title: "Error",
            description: "Failed to load strategy data",
            variant: "destructive",
          })
        }
      }
    }

    loadStrategyData()
  }, [strategyId, isMounted])

  useEffect(() => {
    setIsLoaded(true)

    const timer = setTimeout(() => {
      setStatsVisible(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const features = [
    {
      title: "Advanced Strategy Builder",
      description: "Create complex multi-leg options strategies with our intuitive drag-and-drop builder",
      icon: <Layers className="h-10 w-10 text-primary" />,
      stats: [
        { label: "Supported Strategies", value: "25+" },
        { label: "Custom Functions", value: "Unlimited" },
        { label: "Execution Speed", value: "<0.5s" },
      ],
    },
    {
      title: "Real-time Backtesting",
      description: "Test your strategies against historical data with millisecond precision",
      icon: <BarChart3 className="h-10 w-10 text-primary" />,
      stats: [
        { label: "Data Points", value: "10M+" },
        { label: "Timeframe", value: "5Y History" },
        { label: "Accuracy", value: "99.8%" },
      ],
    },
    {
      title: "Portfolio Optimization",
      description: "Optimize your trading portfolio with AI-powered risk management tools",
      icon: <PieChart className="h-10 w-10 text-primary" />,
      stats: [
        { label: "Risk Models", value: "12" },
        { label: "Optimization Algorithms", value: "8" },
        { label: "Rebalancing Speed", value: "Real-time" },
      ],
    },
    {
      title: "Multi-broker Integration",
      description: "Connect with multiple brokers for seamless execution across platforms",
      icon: <Users className="h-10 w-10 text-primary" />,
      stats: [
        { label: "Supported Brokers", value: "15+" },
        { label: "API Latency", value: "<100ms" },
        { label: "Success Rate", value: "99.9%" },
      ],
    },
  ]

  const testimonials = [
    {
      quote:
        "This platform revolutionized my options trading strategy. The multi-leg builder saved me countless hours of manual work.",
      author: "Alex Thompson",
      role: "Professional Trader",
    },
    {
      quote:
        "The backtesting capabilities are unmatched. I can validate strategies with confidence before risking real capital.",
      author: "Sarah Chen",
      role: "Hedge Fund Manager",
    },
    {
      quote:
        "The portfolio optimization tools helped me reduce risk while maintaining returns. A game-changer for my firm.",
      author: "Michael Rodriguez",
      role: "Investment Advisor",
    },
  ]

  const handleDemoClick = () => {
    toast({
      title: "Interactive Demo",
      description: "The interactive demo is loading. You'll be able to test the platform's capabilities in seconds.",
    })
  }

  // Memoize the strike prices generation to avoid recalculation on every render
  const generateStrikePrices = useCallback(() => {
    const strikes = ["ATM"]
    for (let i = 1; i <= 20; i++) {
      strikes.push(`ATM+${i * strikeStep}`)
    }
    for (let i = 1; i <= 20; i++) {
      strikes.push(`ATM-${i * strikeStep}`)
    }
    return strikes.sort((a, b) => {
      if (a === "ATM") return -1
      if (b === "ATM") return 1

      const aValue = Number.parseInt(a.replace("ATM+", "").replace("ATM-", "-"))
      const bValue = Number.parseInt(b.replace("ATM+", "").replace("ATM-", "-"))

      return aValue - bValue
    })
  }, [strikeStep])

  // Memoize the strike prices
  const strikePrices = useMemo(() => generateStrikePrices(), [generateStrikePrices])

  // Function to toggle between SELL and BUY
  const toggleAction = (id: number) => {
    setLegs(
      legs.map((leg) => {
        if (leg.id === id) {
          return { ...leg, action: leg.action === "SELL" ? "BUY" : "SELL" }
        }
        return leg
      }),
    )
  }

  // Function to toggle between CE and PE
  const toggleType = (id: number) => {
    setLegs(
      legs.map((leg) => {
        if (leg.id === id) {
          return { ...leg, type: leg.type === "CE" ? "PE" : "CE" }
        }
        return leg
      }),
    )
  }

  // Modify the handleRefresh function to only animate the icon for 600ms
  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => setRefreshing(false), 600) // Changed to 600ms
  }

  // Function to add a new trading leg
  const addTradingLeg = () => {
    const newId = legs.length > 0 ? Math.max(...legs.map((leg) => leg.id)) + 1 : 1
    const newLeg = {
      id: newId,
      action: "SELL",
      type: "CE",
      lots: 1,
      expiry: "Weekly",
      strike: "ATM",
      target: "None",
      targetType: "%",
      stoploss: "None",
      stoplossType: "%",
      time: "00:00:00",
      executeLegs: [1],
      squareOffLegs: [1],
    }
    setLegs([...legs, newLeg])
  }

  // Function to add a new strategy tag
  const addStrategyTag = () => {
    if (newTagName.trim() !== "") {
      setStrategyTags([...strategyTags, newTagName.trim().toUpperCase()])
      setNewTagName("")
      setShowTagInput(false)
    }
  }

  // Function to delete a leg
  const deleteLeg = (id: number) => {
    setLegs(legs.filter((leg) => leg.id !== id))
  }

  // Function to clone a leg
  const cloneLeg = (id: number) => {
    const legToClone = legs.find((leg) => leg.id === id)
    if (legToClone) {
      const newId = legs.length > 0 ? Math.max(...legs.map((leg) => leg.id)) + 1 : 1
      const newLeg = { ...legToClone, id: newId }
      setLegs([...legs, newLeg])
    }
  }

  // Functions to handle target and stoploss value changes
  const incrementTarget = (id: number) => {
    setLegs(
      legs.map((leg) => {
        if (leg.id === id) {
          if (leg.target === "None") return { ...leg, target: "1" }
          const currentValue = Number.parseInt(leg.target)
          if (!isNaN(currentValue)) {
            return { ...leg, target: (currentValue + 1).toString() }
          }
          return { ...leg, target: "1" }
        }
        return leg
      }),
    )
  }

  const decrementTarget = (id: number) => {
    setLegs(
      legs.map((leg) => {
        if (leg.id === id) {
          if (leg.target === "None") return { ...leg, target: "0" }
          const currentValue = Number.parseInt(leg.target)
          if (!isNaN(currentValue) && currentValue > 0) {
            return { ...leg, target: (currentValue - 1).toString() }
          }
          return { ...leg, target: "0" }
        }
        return leg
      }),
    )
  }

  const toggleTargetType = (id: number) => {
    setLegs(
      legs.map((leg) => {
        if (leg.id === id) {
          return { ...leg, targetType: leg.targetType === "%" ? "abs" : "%" }
        }
        return leg
      }),
    )
  }

  const incrementStoploss = (id: number) => {
    setLegs(
      legs.map((leg) => {
        if (leg.id === id) {
          if (leg.stoploss === "None") return { ...leg, stoploss: "1" }
          const currentValue = Number.parseInt(leg.stoploss)
          if (!isNaN(currentValue)) {
            return { ...leg, stoploss: (currentValue + 1).toString() }
          }
          return { ...leg, stoploss: "1" }
        }
        return leg
      }),
    )
  }

  const decrementStoploss = (id: number) => {
    setLegs(
      legs.map((leg) => {
        if (leg.id === id) {
          if (leg.stoploss === "None") return { ...leg, stoploss: "0" }
          const currentValue = Number.parseInt(leg.stoploss)
          if (!isNaN(currentValue) && currentValue > 0) {
            return { ...leg, stoploss: (currentValue - 1).toString() }
          }
          return { ...leg, stoploss: "0" }
        }
        return leg
      }),
    )
  }

  const toggleStoplossType = (id: number) => {
    setLegs(
      legs.map((leg) => {
        if (leg.id === id) {
          return { ...leg, stoplossType: leg.stoplossType === "%" ? "abs" : "%" }
        }
        return leg
      }),
    )
  }

  // Functions to handle lot size changes
  const incrementLots = (id: number) => {
    setLegs(
      legs.map((leg) => {
        if (leg.id === id) {
          return { ...leg, lots: leg.lots + 1 }
        }
        return leg
      }),
    )
  }

  const decrementLots = (id: number) => {
    setLegs(
      legs.map((leg) => {
        if (leg.id === id && leg.lots > 1) {
          return { ...leg, lots: leg.lots - 1 }
        }
        return leg
      }),
    )
  }

  // Functions to handle global lot size changes
  const incrementGlobalLotSize = () => {
    setLotSize(lotSize + 1)
  }

  const decrementGlobalLotSize = () => {
    if (lotSize > 1) {
      setLotSize(lotSize - 1)
    }
  }

  // Functions to handle strike step changes
  const handleStrikeStepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value)
    if (!isNaN(value) && value > 0) {
      setStrikeStep(value)
    }
  }

  // Functions to handle time changes
  const updateTime = (timeObj: any, setter: any, field: string, increment: boolean) => {
    const newTime = { ...timeObj }

    if (field === "hours") {
      let hours = Number.parseInt(newTime.hours)
      if (increment) {
        hours = (hours + 1) % 24
      } else {
        hours = (hours - 1 + 24) % 24
      }
      newTime.hours = hours.toString().padStart(2, "0")
    } else if (field === "minutes") {
      let minutes = Number.parseInt(newTime.minutes)
      if (increment) {
        minutes = (minutes + 1) % 60
      } else {
        minutes = (minutes - 1 + 60) % 60
      }
      newTime.minutes = minutes.toString().padStart(2, "0")
    } else if (field === "seconds") {
      let seconds = Number.parseInt(newTime.seconds)
      if (increment) {
        seconds = (seconds + 1) % 60
      } else {
        seconds = (seconds - 1 + 60) % 60
      }
      newTime.seconds = seconds.toString().padStart(2, "0")
    }

    setter(newTime)
  }

  const formatTime = (timeObj: any) => {
    return `${timeObj.hours}:${timeObj.minutes}:${timeObj.seconds}`
  }

  // Handle SL options mutual exclusivity
  const handleSqoffLossMakingChange = (checked: boolean) => {
    setSqoffLossMaking(checked)
    if (checked) {
      setSqoffProfitMaking(false)
    }
  }

  const handleSqoffProfitMakingChange = (checked: boolean) => {
    setSqoffProfitMaking(checked)
    if (checked) {
      setSqoffLossMaking(false)
    }
  }

  // Handle profit protection changes
  const handleProfitProtectionChange = (field: string, value: string) => {
    setProfitProtection({
      ...profitProtection,
      [field]: value,
    })
  }

  // Handle loss protection changes
  const handleLossProtectionChange = (field: string, value: string) => {
    setLossProtection({
      ...lossProtection,
      [field]: value,
    })
  }

  const [percentValue, setPercentValue] = useState("10%")

  const [timeValue, setTimeValue] = useState({ hours: "09", minutes: "30", seconds: "00" })

  const [quantityValue, setQuantityValue] = useState("100")

  const [calculatedQuantity, setCalculatedQuantity] = useState(100)

  // Update the save function
  const handleSavePortfolio = async () => {
    if (portfolioName.trim()) {
      // Create a portfolio object with all the relevant data
      const portfolioData = {
        name: portfolioName,
        legs,
        lotSize,
        strikeStep,
        startTime,
        endTime,
        sqOffTime,
        profitProtection,
        lossProtection,
        sqoffLossMaking,
        sqoffProfitMaking,
        strategyTags,
        timestamp: new Date().toISOString(),
      }

      // Save the data as a portfolio
      await saveData(`portfolio_${portfolioName}`, portfolioData)

      // Also save as a strategy so it appears in the strategies page
      const result = await saveStrategy(portfolioData)

      if (result.success) {
        // Show success toast
        enhancedToast({
          title: strategyId ? "Strategy Updated" : "Strategy Created",
          description: strategyId ? "Strategy updated successfully" : "Strategy saved successfully",
          variant: "default",
        })

        // Navigate to the strategies page after successful save
        setTimeout(() => {
          router.push("/strategies")
        }, 1000) // Short delay to allow the toast to be seen
      } else {
        enhancedToast({
          title: "Error",
          description: "Failed to save strategy",
          variant: "destructive",
        })
      }
    } else {
      enhancedToast({
        title: "Error",
        description: "Please enter a strategy name",
        variant: "destructive",
      })
    }
  }

  // Function to update a leg's strike
  const updateLegStrike = (legId: number, strike: string) => {
    setLegs(
      legs.map((leg) => {
        if (leg.id === legId) {
          return { ...leg, strike }
        }
        return leg
      }),
    )
    setOpenStrikePopup(false)
  }

  // If not mounted yet, don't render anything
  if (!isMounted) {
    return (
      <div className="w-full max-w-[1300px] mx-auto p-4 text-sm">
        <div className="flex justify-center items-center h-[50vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    )
  }

  // Show a lightweight loading indicator while the main content is preparing
  if (isLoading) {
    return (
      <div className="w-full max-w-[1300px] mx-auto p-4 text-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2 rounded-lg font-bold">
              Moneey.ai
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold">{strategyId ? "Edit Strategy" : "Create New Strategy"}</h1>
              <span className="text-slate-500 text-xs">Loading strategy builder...</span>
            </div>
          </motion.div>
        </div>

        <AnimatePresence mode="wait">
          {loadingPhase === 0 && (
            <motion.div
              key="phase1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <LoadingAnimation />
            </motion.div>
          )}

          {loadingPhase === 1 && (
            <motion.div
              key="phase2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-center py-12"
            >
              <motion.div
                className="inline-flex items-center justify-center p-8 mb-6 rounded-full bg-blue-50"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, type: "spring" }}
              >
                <LineChart className="h-12 w-12 text-blue-600" />
              </motion.div>
              <h2 className="text-2xl font-bold mb-2">Preparing Your Trading Environment</h2>
              <p className="text-slate-500 max-w-md mx-auto">
                Setting up your strategy builder with the latest market data...
              </p>

              <div className="mt-8 flex justify-center">
                <div className="relative w-64 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    className="absolute top-0 left-0 h-full bg-blue-600"
                    initial={{ width: "0%" }}
                    animate={{ width: "60%" }}
                    transition={{ duration: 0.8 }}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {loadingPhase === 2 && (
            <motion.div
              key="phase3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-center py-12"
            >
              <motion.div
                className="inline-flex items-center justify-center p-8 mb-6 rounded-full bg-green-50"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, type: "spring" }}
              >
                <CheckCircle2 className="h-12 w-12 text-green-600" />
              </motion.div>
              <h2 className="text-2xl font-bold mb-2">Almost Ready!</h2>
              <p className="text-slate-500 max-w-md mx-auto">Finalizing your strategy builder...</p>

              <div className="mt-8 flex justify-center">
                <div className="relative w-64 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    className="absolute top-0 left-0 h-full bg-green-600"
                    initial={{ width: "60%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 0.6 }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  return (
    <div className="w-full max-w-[1300px] mx-auto p-4 text-sm">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2 rounded-lg font-bold">
            Moneey.ai
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold">{strategyId ? "Edit Strategy" : "Create New Strategy"}</h1>
            <span className="text-slate-500 text-xs">Configure your trading strategy</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Replace the existing NIFTY card in the header section with our new InstrumentCard. Find this code in the header section: */}
          <div className="relative">
            <InstrumentCard />
          </div>

          <div>
            <Card>
              <CardContent className="p-3 flex items-center gap-3">
                <div className="flex flex-col">
                  <span className="text-xs text-slate-500">Lot Size</span>
                  <div className="flex items-center">
                    <span className="text-lg font-bold">{lotSize}</span>
                    <div className="flex flex-col ml-2">
                      <button
                        className="h-4 text-xs leading-none text-slate-500 hover:text-slate-800"
                        onClick={incrementGlobalLotSize}
                      >
                        <ChevronUp className="h-3 w-3" />
                      </button>
                      <button
                        className="h-4 text-xs leading-none text-slate-500 hover:text-slate-800"
                        onClick={decrementGlobalLotSize}
                      >
                        <ChevronDown className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="h-8 px-2 ml-2">
                  <Settings className="h-3 w-3 mr-1" />
                  Edit
                </Button>
              </CardContent>
            </Card>
          </div>

          <div>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleRefresh}>
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
              Refresh Data
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-6">
        {/* Settings Panel */}
        <motion.div
          className=""
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="overflow-hidden border-0 shadow-lg">
            <div className="bg-gradient-to-r from-slate-800 to-slate-700 p-4 text-white">
              <h2 className="text-lg font-bold flex items-center">
                <Settings className="h-4 w-4 mr-2" />
                Trading Configuration
              </h2>
            </div>

            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Exchange & Symbol</label>
                    <div className="flex gap-2">
                      <Select defaultValue="N">
                        <SelectTrigger className="h-10 bg-slate-50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="N">NSE</SelectItem>
                          <SelectItem value="B">BSE</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select defaultValue="NIFTY">
                        <SelectTrigger className="h-10 bg-slate-50 flex-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="NIFTY">NIFTY</SelectItem>
                          <SelectItem value="BANKNIFTY">BANKNIFTY</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Expiry & Lots</label>
                    <div className="flex gap-2">
                      <Select defaultValue="Weekly">
                        <SelectTrigger className="h-10 bg-slate-50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Weekly">Weekly</SelectItem>
                          <SelectItem value="Monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>

                      <div className="flex items-center bg-slate-50 rounded-md border h-10 px-3">
                        <Input
                          type="text"
                          className="h-8 w-12 text-center border-0 p-0 bg-transparent"
                          value="1"
                          readOnly
                        />
                        <div className="flex flex-col ml-1">
                          <button
                            className="h-4 text-xs leading-none text-slate-500 hover:text-slate-800"
                            onClick={() => {}}
                          >
                            <ChevronUp className="h-3 w-3" />
                          </button>
                          <button
                            className="h-4 text-xs leading-none text-slate-500 hover:text-slate-800"
                            onClick={() => {}}
                          >
                            <ChevronDown className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Strategy & Strike Selection</label>
                    <div className="flex gap-2">
                      <Select defaultValue="Custom">
                        <SelectTrigger className="h-10 bg-slate-50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Custom">Custom</SelectItem>
                          <SelectItem value="Straddle">Straddle</SelectItem>
                          <SelectItem value="Strangle">Strangle</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select defaultValue="Relative">
                        <SelectTrigger className="h-10 bg-slate-50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Relative">Relative</SelectItem>
                          <SelectItem value="Normal">Normal</SelectItem>
                          <SelectItem value="Both">Both</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Underlying & Price Type</label>
                    <div className="flex gap-2">
                      <Select defaultValue="Spot">
                        <SelectTrigger className="h-10 bg-slate-50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Spot">Spot</SelectItem>
                          <SelectItem value="Future">Future</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select defaultValue="LTP">
                        <SelectTrigger className="h-10 bg-slate-50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="LTP">LTP</SelectItem>
                          <SelectItem value="Market">Market</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Strike Step</label>
                    <Input
                      type="text"
                      className="h-10 bg-slate-50"
                      value={strikeStep}
                      onChange={handleStrikeStepChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Trading Options</label>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center space-x-2 bg-slate-50 p-2 rounded-md">
                        <Checkbox id="buyTradesFirst" defaultChecked />
                        <label htmlFor="buyTradesFirst" className="text-sm">
                          Buy Trades First
                        </label>
                      </div>
                      <div className="flex items-center space-x-2 bg-slate-50 p-2 rounded-md">
                        <Checkbox id="allowFarStrikes" />
                        <label htmlFor="allowFarStrikes" className="text-sm">
                          Allow Far Strikes
                        </label>
                      </div>
                      <div className="flex items-center space-x-2 bg-slate-50 p-2 rounded-md">
                        <Checkbox id="impliedFutures" />
                        <label htmlFor="impliedFutures" className="text-sm">
                          Implied Futures
                        </label>
                      </div>
                      <div className="flex items-center space-x-2 bg-slate-50 p-2 rounded-md">
                        <Checkbox id="tntSlEntry" defaultChecked />
                        <label htmlFor="tntSlEntry" className="text-sm">
                          Per Lot Basis
                        </label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Button
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                      onClick={addTradingLeg}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Trading Leg
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          className=""
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="overflow-hidden border-0 shadow-lg">
            <div className="bg-gradient-to-r from-slate-800 to-slate-700 p-4 text-white">
              <h2 className="text-lg font-bold flex items-center">
                <LineChart className="h-4 w-4 mr-2" />
                Trading Legs
              </h2>
            </div>

            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-100">
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        IDLE
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        LTP
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        B/S
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Lots
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Expiry
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Strike
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Target
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Stoploss
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Action
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Time
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {legs.map((leg, index) => (
                      <motion.tr
                        key={leg.id}
                        className="hover:bg-slate-50 transition-colors"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 * index + 0.3 }}
                        onMouseEnter={() => setHoveredRow(leg.id)}
                        onMouseLeave={() => setHoveredRow(null)}
                      >
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-500">{leg.id}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-500">
                          <Badge variant="outline">IDLE</Badge>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-500">
                          <span className="font-medium">₹19,458.75</span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="px-2 py-1 h-auto"
                            onClick={() => toggleAction(leg.id)}
                          >
                            {leg.action === "SELL" ? (
                              <ArrowDownRight className="h-4 w-4 text-green-500" />
                            ) : (
                              <ArrowUpRight className="h-4 w-4 text-red-500" />
                            )}
                          </Button>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="px-2 py-1 h-auto"
                            onClick={() => toggleType(leg.id)}
                          >
                            {leg.type === "CE" ? (
                              <span className="text-blue-500">CE</span>
                            ) : (
                              <span className="text-orange-500">PE</span>
                            )}
                          </Button>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-500">
                          <div className="flex items-center">
                            <button
                              className="text-slate-500 hover:text-slate-800 disabled:text-slate-300 disabled:hover:text-slate-300"
                              onClick={() => decrementLots(leg.id)}
                              disabled={leg.lots <= 1}
                            >
                              <ChevronDown className="h-4 w-4" />
                            </button>
                            <Input
                              type="text"
                              className="h-8 w-12 text-center border-0 p-0 bg-transparent"
                              value={leg.lots}
                              readOnly
                            />
                            <button
                              className="text-slate-500 hover:text-slate-800"
                              onClick={() => incrementLots(leg.id)}
                            >
                              <ChevronUp className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-500">{leg.expiry}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-500">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="px-2 py-1 h-auto w-24 justify-start"
                            onClick={() => setOpenStrikePopup(leg.id)}
                          >
                            {leg.strike}
                          </Button>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-500">
                          <div className="flex items-center">
                            <button
                              className="text-slate-500 hover:text-slate-800"
                              onClick={() => decrementTarget(leg.id)}
                            >
                              <ChevronDown className="h-4 w-4" />
                            </button>
                            <Input
                              type="text"
                              className="h-8 w-12 text-center border-0 p-0 bg-transparent"
                              value={leg.target}
                              readOnly
                            />
                            <button
                              className="text-slate-500 hover:text-slate-800"
                              onClick={() => incrementTarget(leg.id)}
                            >
                              <ChevronUp className="h-4 w-4" />
                            </button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="px-2 py-1 h-auto"
                              onClick={() => toggleTargetType(leg.id)}
                            >
                              {leg.targetType === "%" ? "%" : "abs"}
                            </Button>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-500">
                          <div className="flex items-center">
                            <button
                              className="text-slate-500 hover:text-slate-800"
                              onClick={() => decrementStoploss(leg.id)}
                            >
                              <ChevronDown className="h-4 w-4" />
                            </button>
                            <Input
                              type="text"
                              className="h-8 w-12 text-center border-0 p-0 bg-transparent"
                              value={leg.stoploss}
                              readOnly
                            />
                            <button
                              className="text-slate-500 hover:text-slate-800"
                              onClick={() => incrementStoploss(leg.id)}
                            >
                              <ChevronUp className="h-4 w-4" />
                            </button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="px-2 py-1 h-auto"
                              onClick={() => toggleStoplossType(leg.id)}
                            >
                              {leg.stoplossType === "%" ? "%" : "abs"}
                            </Button>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-500">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="px-2 py-1 h-auto w-24 justify-start"
                            onClick={() => setOpenActionPopup(leg.id)}
                          >
                            {leg.action}
                          </Button>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-500">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="px-2 py-1 h-auto w-24 justify-start"
                            onClick={() => setOpenTimePopup(leg.id)}
                          >
                            {leg.time}
                          </Button>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          <div className="flex gap-2">
                            <Button variant="outline" size="icon" onClick={() => cloneLeg(leg.id)}>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="w-4 h-4"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M15.75 4.5a3 3 0 11.825 2.066l-5.478 5.477A3 3 0 014.5 13.5a3 3 0 010-6.066l5.477-5.477A3 3 0 0115.75 4.5zM6.75 12a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM12.75 6a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM15.75 15.75a3 3 0 11.825 2.066l-5.478 5.477A3 3 0 014.5 22.5a3 3 0 010-6.066l5.477-5.477A3 3 0 0115.75 15.75zM6.75 21a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM12.75 15a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </Button>
                            <Button variant="destructive" size="icon" onClick={() => deleteLeg(leg.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Execution Parameters */}
        <motion.div
          className=""
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="overflow-hidden border-0 shadow-lg">
            <div className="bg-gradient-to-r from-slate-800 to-slate-700 p-4 text-white">
              <h2 className="text-lg font-bold flex items-center">
                <Shield className="h-4 w-4 mr-2" />
                Execution Parameters
              </h2>
            </div>

            <CardContent className="p-6">
              <Tabs defaultValue="protection" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="protection">Protection</TabsTrigger>
                  <TabsTrigger value="time">Time</TabsTrigger>
                  <TabsTrigger value="quantity">Quantity</TabsTrigger>
                  <TabsTrigger value="tags">Tags</TabsTrigger>
                </TabsList>
                <TabsContent value="protection">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Profit Protection */}
                    <div className="space-y-4">
                      <h3 className="text-md font-semibold text-slate-800">Profit Protection</h3>
                      <div className="space-y-2">
                        <Label htmlFor="profitReachesValue">Profit Reaches Value</Label>
                        <Input
                          type="text"
                          id="profitReachesValue"
                          className="h-10 bg-slate-50"
                          value={profitProtection.profitReachesValue}
                          onChange={(e) => handleProfitProtectionChange("profitReachesValue", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="minimumProfitValue">Minimum Profit Value</Label>
                        <Input
                          type="text"
                          id="minimumProfitValue"
                          className="h-10 bg-slate-50"
                          value={profitProtection.minimumProfitValue}
                          onChange={(e) => handleProfitProtectionChange("minimumProfitValue", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="increasingProfitBy">Increasing Profit By</Label>
                        <Input
                          type="text"
                          id="increasingProfitBy"
                          className="h-10 bg-slate-50"
                          value={profitProtection.increasingProfitBy}
                          onChange={(e) => handleProfitProtectionChange("increasingProfitBy", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="trailProfitBy">Trail Profit By</Label>
                        <Input
                          type="text"
                          id="trailProfitBy"
                          className="h-10 bg-slate-50"
                          value={profitProtection.trailProfitBy}
                          onChange={(e) => handleProfitProtectionChange("trailProfitBy", e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Loss Protection */}
                    <div className="space-y-4">
                      <h3 className="text-md font-semibold text-slate-800">Loss Protection</h3>
                      <div className="space-y-2">
                        <Label htmlFor="lossReachesValue">Loss Reaches Value</Label>
                        <Input
                          type="text"
                          id="lossReachesValue"
                          className="h-10 bg-slate-50"
                          value={lossProtection.lossReachesValue}
                          onChange={(e) => handleLossProtectionChange("lossReachesValue", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="maximumLossValue">Maximum Loss Value</Label>
                        <Input
                          type="text"
                          id="maximumLossValue"
                          className="h-10 bg-slate-50"
                          value={lossProtection.maximumLossValue}
                          onChange={(e) => handleLossProtectionChange("maximumLossValue", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="increasingLossBy">Increasing Loss By</Label>
                        <Input
                          type="text"
                          id="increasingLossBy"
                          className="h-10 bg-slate-50"
                          value={lossProtection.increasingLossBy}
                          onChange={(e) => handleLossProtectionChange("increasingLossBy", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="trailLossBy">Trail Loss By</Label>
                        <Input
                          type="text"
                          id="trailLossBy"
                          className="h-10 bg-slate-50"
                          value={lossProtection.trailLossBy}
                          onChange={(e) => handleLossProtectionChange("trailLossBy", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Square Off Options */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div className="space-y-2">
                      <h3 className="text-md font-semibold text-slate-800">Square Off Options</h3>
                      <div className="flex items-center space-x-2 bg-slate-50 p-2 rounded-md">
                        <Checkbox
                          id="sqoffLossMaking"
                          checked={sqoffLossMaking}
                          onCheckedChange={handleSqoffLossMakingChange}
                        />
                        <label htmlFor="sqoffLossMaking" className="text-sm">
                          Square Off Loss Making
                        </label>
                      </div>
                      <div className="flex items-center space-x-2 bg-slate-50 p-2 rounded-md">
                        <Checkbox
                          id="sqoffProfitMaking"
                          checked={sqoffProfitMaking}
                          onCheckedChange={handleSqoffProfitMakingChange}
                        />
                        <label htmlFor="sqoffProfitMaking" className="text-sm">
                          Square Off Profit Making
                        </label>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="time">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Start Time */}
                    <div className="space-y-4">
                      <h3 className="text-md font-semibold text-slate-800">Start Time</h3>
                      <div className="flex items-center gap-2">
                        <div className="flex flex-col items-center">
                          <button
                            className="h-6 w-6 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200"
                            onClick={() => updateTime(startTime, setStartTime, "hours", true)}
                          >
                            <ChevronUp className="h-4 w-4" />
                          </button>
                          <div
                            className={`text-2xl font-semibold w-16 text-center ${
                              activeTimeField === "hours" ? "text-blue-600" : ""
                            }`}
                            onClick={() => setActiveTimeField("hours")}
                          >
                            {startTime.hours}
                          </div>
                          <button
                            className="h-6 w-6 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200"
                            onClick={() => updateTime(startTime, setStartTime, "hours", false)}
                          >
                            <ChevronDown className="h-4 w-4" />
                          </button>
                        </div>
                        <span className="text-2xl font-semibold">:</span>
                        <div className="flex flex-col items-center">
                          <button
                            className="h-6 w-6 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200"
                            onClick={() => updateTime(startTime, setStartTime, "minutes", true)}
                          >
                            <ChevronUp className="h-4 w-4" />
                          </button>
                          <div
                            className={`text-2xl font-semibold w-16 text-center ${
                              activeTimeField === "minutes" ? "text-blue-600" : ""
                            }`}
                            onClick={() => setActiveTimeField("minutes")}
                          >
                            {startTime.minutes}
                          </div>
                          <button
                            className="h-6 w-6 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200"
                            onClick={() => updateTime(startTime, setStartTime, "minutes", false)}
                          >
                            <ChevronDown className="h-4 w-4" />
                          </button>
                        </div>
                        <span className="text-2xl font-semibold">:</span>
                        <div className="flex flex-col items-center">
                          <button
                            className="h-6 w-6 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200"
                            onClick={() => updateTime(startTime, setStartTime, "seconds", true)}
                          >
                            <ChevronUp className="h-4 w-4" />
                          </button>
                          <div
                            className={`text-2xl font-semibold w-16 text-center ${
                              activeTimeField === "seconds" ? "text-blue-600" : ""
                            }`}
                            onClick={() => setActiveTimeField("seconds")}
                          >
                            {startTime.seconds}
                          </div>
                          <button
                            className="h-6 w-6 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200"
                            onClick={() => updateTime(startTime, setStartTime, "seconds", false)}
                          >
                            <ChevronDown className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-slate-500">
                        The strategy will start executing at {formatTime(startTime)}.
                      </p>
                    </div>

                    {/* End Time */}
                    <div className="space-y-4">
                      <h3 className="text-md font-semibold text-slate-800">End Time</h3>
                      <div className="flex items-center gap-2">
                        <div className="flex flex-col items-center">
                          <button
                            className="h-6 w-6 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200"
                            onClick={() => updateTime(endTime, setEndTime, "hours", true)}
                          >
                            <ChevronUp className="h-4 w-4" />
                          </button>
                          <div
                            className={`text-2xl font-semibold w-16 text-center ${
                              activeTimeField === "hours" ? "text-blue-600" : ""
                            }`}
                            onClick={() => setActiveTimeField("hours")}
                          >
                            {endTime.hours}
                          </div>
                          <button
                            className="h-6 w-6 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200"
                            onClick={() => updateTime(endTime, setEndTime, "hours", false)}
                          >
                            <ChevronDown className="h-4 w-4" />
                          </button>
                        </div>
                        <span className="text-2xl font-semibold">:</span>
                        <div className="flex flex-col items-center">
                          <button
                            className="h-6 w-6 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200"
                            onClick={() => updateTime(endTime, setEndTime, "minutes", true)}
                          >
                            <ChevronUp className="h-4 w-4" />
                          </button>
                          <div
                            className={`text-2xl font-semibold w-16 text-center ${
                              activeTimeField === "minutes" ? "text-blue-600" : ""
                            }`}
                            onClick={() => setActiveTimeField("minutes")}
                          >
                            {endTime.minutes}
                          </div>
                          <button
                            className="h-6 w-6 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200"
                            onClick={() => updateTime(endTime, setEndTime, "minutes", false)}
                          >
                            <ChevronDown className="h-4 w-4" />
                          </button>
                        </div>
                        <span className="text-2xl font-semibold">:</span>
                        <div className="flex flex-col items-center">
                          <button
                            className="h-6 w-6 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200"
                            onClick={() => updateTime(endTime, setEndTime, "seconds", true)}
                          >
                            <ChevronUp className="h-4 w-4" />
                          </button>
                          <div
                            className={`text-2xl font-semibold w-16 text-center ${
                              activeTimeField === "seconds" ? "text-blue-600" : ""
                            }`}
                            onClick={() => setActiveTimeField("seconds")}
                          >
                            {endTime.seconds}
                          </div>
                          <button
                            className="h-6 w-6 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200"
                            onClick={() => updateTime(endTime, setEndTime, "seconds", false)}
                          >
                            <ChevronDown className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-slate-500">
                        The strategy will stop executing at {formatTime(endTime)}.
                      </p>
                    </div>

                    {/* Square Off Time */}
                    <div className="space-y-4">
                      <h3 className="text-md font-semibold text-slate-800">Square Off Time</h3>
                      <div className="flex items-center gap-2">
                        <div className="flex flex-col items-center">
                          <button
                            className="h-6 w-6 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200"
                            onClick={() => updateTime(sqOffTime, setSqOffTime, "hours", true)}
                          >
                            <ChevronUp className="h-4 w-4" />
                          </button>
                          <div
                            className={`text-2xl font-semibold w-16 text-center ${
                              activeTimeField === "hours" ? "text-blue-600" : ""
                            }`}
                            onClick={() => setActiveTimeField("hours")}
                          >
                            {sqOffTime.hours}
                          </div>
                          <button
                            className="h-6 w-6 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200"
                            onClick={() => updateTime(sqOffTime, setSqOffTime, "hours", false)}
                          >
                            <ChevronDown className="h-4 w-4" />
                          </button>
                        </div>
                        <span className="text-2xl font-semibold">:</span>
                        <div className="flex flex-col items-center">
                          <button
                            className="h-6 w-6 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200"
                            onClick={() => updateTime(sqOffTime, setSqOffTime, "minutes", true)}
                          >
                            <ChevronUp className="h-4 w-4" />
                          </button>
                          <div
                            className={`text-2xl font-semibold w-16 text-center ${
                              activeTimeField === "minutes" ? "text-blue-600" : ""
                            }`}
                            onClick={() => setActiveTimeField("minutes")}
                          >
                            {sqOffTime.minutes}
                          </div>
                          <button
                            className="h-6 w-6 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200"
                            onClick={() => updateTime(sqOffTime, setSqOffTime, "minutes", false)}
                          >
                            <ChevronDown className="h-4 w-4" />
                          </button>
                        </div>
                        <span className="text-2xl font-semibold">:</span>
                        <div className="flex flex-col items-center">
                          <button
                            className="h-6 w-6 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200"
                            onClick={() => updateTime(sqOffTime, setSqOffTime, "seconds", true)}
                          >
                            <ChevronUp className="h-4 w-4" />
                          </button>
                          <div
                            className={`text-2xl font-semibold w-16 text-center ${
                              activeTimeField === "seconds" ? "text-blue-600" : ""
                            }`}
                            onClick={() => setActiveTimeField("seconds")}
                          >
                            {sqOffTime.seconds}
                          </div>
                          <button
                            className="h-6 w-6 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200"
                            onClick={() => updateTime(sqOffTime, setSqOffTime, "seconds", false)}
                          >
                            <ChevronDown className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-slate-500">
                        The strategy will be squared off at {formatTime(sqOffTime)}.
                      </p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="quantity">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Percent Value */}
                    <div className="space-y-4">
                      <h3 className="text-md font-semibold text-slate-800">Percent Value</h3>
                      <div className="space-y-2">
                        <Label htmlFor="percentValue">Enter Percent Value</Label>
                        <Input
                          type="text"
                          id="percentValue"
                          className="h-10 bg-slate-50"
                          value={percentValue}
                          onChange={(e) => setPercentValue(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Time Value */}
                    <div className="space-y-4">
                      <h3 className="text-md font-semibold text-slate-800">Time Value</h3>
                      <div className="space-y-2">
                        <Label htmlFor="timeValue">Enter Time Value</Label>
                        <Input
                          type="text"
                          id="timeValue"
                          className="h-10 bg-slate-50"
                          value={timeValue}
                          onChange={(e) => setTimeValue(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Quantity Value */}
                    <div className="space-y-4">
                      <h3 className="text-md font-semibold text-slate-800">Quantity Value</h3>
                      <div className="space-y-2">
                        <Label htmlFor="quantityValue">Enter Quantity Value</Label>
                        <Input
                          type="text"
                          id="quantityValue"
                          className="h-10 bg-slate-50"
                          value={quantityValue}
                          onChange={(e) => {
                            setQuantityValue(e.target.value)
                            setCalculatedQuantity(Number(e.target.value) * lotSize)
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="calculatedQuantity">Calculated Quantity</Label>
                        <Input
                          type="text"
                          id="calculatedQuantity"
                          className="h-10 bg-slate-50"
                          value={calculatedQuantity}
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="tags">
                  <div className="space-y-4">
                    <h3 className="text-md font-semibold text-slate-800">Strategy Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {strategyTags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                      {!showTagInput && (
                        <Button variant="outline" size="sm" onClick={() => setShowTagInput(true)}>
                          Add Tag
                        </Button>
                      )}
                    </div>
                    {showTagInput && (
                      <div className="flex items-center gap-2">
                        <Input
                          type="text"
                          placeholder="New tag name"
                          value={newTagName}
                          onChange={(e) => setNewTagName(e.target.value)}
                          className="h-10 bg-slate-50"
                        />
                        <Button variant="outline" size="sm" onClick={addStrategyTag}>
                          Add
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setShowTagInput(false)}>
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>

        {/* Strategy Name and Save */}
        <motion.div
          className=""
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="overflow-hidden border-0 shadow-lg">
            <div className="bg-gradient-to-r from-slate-800 to-slate-700 p-4 text-white">
              <h2 className="text-lg font-bold flex items-center">
                <Save className="h-4 w-4 mr-2" />
                Save Strategy
              </h2>
            </div>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="portfolioName">Strategy Name</Label>
                  <Input
                    type="text"
                    id="portfolioName"
                    placeholder="Enter strategy name"
                    className="h-10 bg-slate-50"
                    value={portfolioName}
                    onChange={(e) => setPortfolioName(e.target.value)}
                  />
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleSavePortfolio}>
                  {strategyId ? "Update Strategy" : "Save Strategy"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Popups */}
      <BasicPopup open={payoffDialogOpen} setOpen={setPayoffDialogOpen}>
        <div className="flex flex-col">
          <h3 className="text-xl font-bold mb-4">Payoff Chart</h3>
          <img src="/payoff-chart.png" alt="Payoff Chart" className="w-full h-auto" />
        </div>
      </BasicPopup>

      {legs.map((leg) => (
        <BasicPopup key={leg.id} open={openActionPopup === leg.id} setOpen={() => setOpenActionPopup(null)}>
          <div className="flex flex-col">
            <h3 className="text-xl font-bold mb-4">Select Action</h3>
            <Button variant="outline" onClick={() => {}}>
              Buy
            </Button>
            <Button variant="outline" onClick={() => {}}>
              Sell
            </Button>
          </div>
        </BasicPopup>
      ))}

      {legs.map((leg) => (
        <BasicPopup key={leg.id} open={openTimePopup === leg.id} setOpen={() => setOpenTimePopup(null)}>
          <div className="flex flex-col">
            <h3 className="text-xl font-bold mb-4">Select Time</h3>
            <Input type="time" />
          </div>
        </BasicPopup>
      ))}

      <BasicPopup open={openStrikePopup} setOpen={() => setOpenStrikePopup(false)}>
        <div className="flex flex-col">
          <h3 className="text-xl font-bold mb-4">Select Strike</h3>
          <div className="grid grid-cols-3 gap-2">
            {strikePrices.map((strike) => (
              <Button key={strike} variant="outline" onClick={() => updateLegStrike(1, strike)}>
                {strike}
              </Button>
            ))}
          </div>
        </div>
      </BasicPopup>
    </div>
  )
}
