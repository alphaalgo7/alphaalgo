"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Clock, Settings, Shield, Target, Lock, TrendingUp } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { DollarSign, ArrowRightLeft } from "lucide-react"

export function ExecutionParameters() {
  const [executionType, setExecutionType] = useState("market")
  const [startTime, setStartTime] = useState({ hours: "09", minutes: "20", seconds: "00" })
  const [endTime, setEndTime] = useState({ hours: "15", minutes: "15", seconds: "00" })
  const [sqOffTime, setSqOffTime] = useState({ hours: "15", minutes: "25", seconds: "00" })
  const [activeTimeField, setActiveTimeField] = useState<"hours" | "minutes" | "seconds">("hours")

  // Add square off options
  const [sqoffLossMaking, setSqoffLossMaking] = useState(false)
  const [sqoffProfitMaking, setSqoffProfitMaking] = useState(false)

  // Add product type and strategy tag
  const [productType, setProductType] = useState("NRML")
  const [strategyTag, setStrategyTag] = useState("DEFAULT")
  const [strategyTags, setStrategyTags] = useState(["DEFAULT", "INTRADAY", "POSITIONAL"])
  const [showTagInput, setShowTagInput] = useState(false)
  const [newTagName, setNewTagName] = useState("")

  // Add profit locking and trailing settings
  const [maxProfit, setMaxProfit] = useState(0)
  const [maxLoss, setMaxLoss] = useState(0)

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

  // Strategy Range Breakout settings
  const [rangeBreakoutSettings, setRangeBreakoutSettings] = useState({
    strategy: "ShortStraddle",
    startTime: { hours: "09", minutes: "20", seconds: "00" },
    endTime: { hours: "00", minutes: "00", seconds: "00" },
    underlying: "Spot",
    strikeAdjust: "None",
    monitoring: "Rolling",
    breakoutValue: "",
    executeAction: "",
  })

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

  // Function to add a new strategy tag
  const addStrategyTag = () => {
    if (newTagName.trim() !== "") {
      setStrategyTags([...strategyTags, newTagName.trim().toUpperCase()])
      setStrategyTag(newTagName.trim().toUpperCase())
      setNewTagName("")
      setShowTagInput(false)
    }
  }

  // Handle profit locking changes
  const handleProfitLockingChange = (field: string, value: string | boolean) => {
    setProfitLockingSettings({
      ...profitLockingSettings,
      [field]: value,
    })
  }

  // Handle profit trailing changes
  const handleProfitTrailingChange = (field: string, value: string | boolean) => {
    setProfitTrailingSettings({
      ...profitTrailingSettings,
      [field]: value,
    })
  }

  // Handle range breakout changes
  const handleRangeBreakoutChange = (field: string, value: any) => {
    setRangeBreakoutSettings({
      ...rangeBreakoutSettings,
      [field]: value,
    })
  }

  // Handle range breakout time changes
  const updateRangeBreakoutTime = (timeType: "startTime" | "endTime", field: string, increment: boolean) => {
    const currentTime = rangeBreakoutSettings[timeType]
    const newTime = { ...currentTime }

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

    handleRangeBreakoutChange(timeType, newTime)
  }

  return (
    <Card className="w-full">
      <CardContent className="p-0">
        <Tabs defaultValue="execution" className="w-full">
          <TabsList className="grid w-full grid-cols-5 h-auto p-0 bg-transparent rounded-none border-b-0">
            <TabsTrigger
              value="execution"
              className="rounded-none bg-gradient-to-r from-slate-800 to-slate-700 text-white hover:text-white data-[state=active]:text-white font-bold py-4 px-6 border-r border-slate-300 flex items-center justify-center transition-all duration-300 ease-in-out data-[state=active]:shadow-lg transform hover:scale-[1.02] data-[state=active]:scale-[1.02]"
            >
              <Settings className="h-4 w-4 mr-2 transition-transform duration-300 ease-in-out group-hover:rotate-12" />
              EXECUTION PARAMETER
            </TabsTrigger>
            <TabsTrigger
              value="stoploss"
              className="rounded-none bg-gradient-to-r from-slate-800 to-slate-700 text-white hover:text-white data-[state=active]:text-white font-bold py-4 px-6 border-r border-slate-300 flex items-center justify-center transition-all duration-300 ease-in-out data-[state=active]:shadow-lg transform hover:scale-[1.02] data-[state=active]:scale-[1.02]"
            >
              <Shield className="h-4 w-4 mr-2 transition-transform duration-300 ease-in-out group-hover:rotate-12" />
              STOPLOSS SETTING
            </TabsTrigger>
            <TabsTrigger
              value="target"
              className="rounded-none bg-gradient-to-r from-slate-800 to-slate-700 text-white hover:text-white data-[state=active]:text-white font-bold py-4 px-6 border-r border-slate-300 flex items-center justify-center transition-all duration-300 ease-in-out data-[state=active]:shadow-lg transform hover:scale-[1.02] data-[state=active]:scale-[1.02]"
            >
              <Target className="h-4 w-4 mr-2 transition-transform duration-300 ease-in-out group-hover:rotate-12" />
              TARGET SETTING
            </TabsTrigger>
            <TabsTrigger
              value="profit"
              className="rounded-none bg-gradient-to-r from-slate-800 to-slate-700 text-white hover:text-white data-[state=active]:text-white font-bold py-4 px-6 border-r border-slate-300 flex items-center justify-center transition-all duration-300 ease-in-out data-[state=active]:shadow-lg transform hover:scale-[1.02] data-[state=active]:scale-[1.02]"
            >
              <Lock className="h-4 w-4 mr-2 transition-transform duration-300 ease-in-out group-hover:rotate-12" />
              PROFIT LOCKING
            </TabsTrigger>
            <TabsTrigger
              value="breakout"
              className="rounded-none bg-gradient-to-r from-slate-800 to-slate-700 text-white hover:text-white data-[state=active]:text-white font-bold py-4 px-6 flex items-center justify-center transition-all duration-300 ease-in-out data-[state=active]:shadow-lg transform hover:scale-[1.02] data-[state=active]:scale-[1.02]"
            >
              <TrendingUp className="h-4 w-4 mr-2 transition-transform duration-300 ease-in-out group-hover:rotate-12" />
              RANGE BREAKOUT
            </TabsTrigger>
          </TabsList>

          <TabsContent value="execution" className="mt-0 p-6 animate-in fade-in-50 slide-in-from-bottom-2 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Main Execution Settings */}
              <div className="lg:col-span-2 space-y-6">
                {/* Core Settings */}
                <div className="bg-slate-50 rounded-lg p-4 space-y-4">
                  <h3 className="text-sm font-semibold text-slate-700 flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                    Core Settings
                  </h3>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="product-type" className="text-xs font-medium text-slate-600">
                        Product Type
                      </Label>
                      <Select value={productType} onValueChange={setProductType}>
                        <SelectTrigger id="product-type" className="h-9 bg-white border-slate-200 shadow-sm">
                          <SelectValue placeholder="Select product type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="NRML">NRML</SelectItem>
                          <SelectItem value="MIS">MIS</SelectItem>
                          <SelectItem value="CNC">CNC</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="execution-type" className="text-xs font-medium text-slate-600">
                        Execution Type
                      </Label>
                      <Select value={executionType} onValueChange={setExecutionType}>
                        <SelectTrigger id="execution-type" className="h-9 bg-white border-slate-200 shadow-sm">
                          <SelectValue placeholder="Select execution type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="market">Market</SelectItem>
                          <SelectItem value="limit">Limit</SelectItem>
                          <SelectItem value="sltp">SL-TP</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {executionType === "limit" && (
                      <div className="space-y-2">
                        <Label htmlFor="limit-price" className="text-xs font-medium text-slate-600">
                          Limit Price
                        </Label>
                        <Input
                          id="limit-price"
                          type="number"
                          placeholder="Enter limit price"
                          className="h-9 bg-white border-slate-200 shadow-sm"
                        />
                      </div>
                    )}

                    {executionType === "sltp" && (
                      <div className="space-y-2">
                        <Label htmlFor="trigger-price" className="text-xs font-medium text-slate-600">
                          Trigger Price
                        </Label>
                        <Input
                          id="trigger-price"
                          type="number"
                          placeholder="Enter trigger price"
                          className="h-9 bg-white border-slate-200 shadow-sm"
                        />
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="legs-execution" className="text-xs font-medium text-slate-600">
                        Legs Execution
                      </Label>
                      <Select defaultValue="Parallel">
                        <SelectTrigger id="legs-execution" className="h-9 bg-white border-slate-200 shadow-sm">
                          <SelectValue placeholder="Select execution mode" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Parallel">Parallel</SelectItem>
                          <SelectItem value="Sequential">Sequential</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="if-leg-fails" className="text-xs font-medium text-slate-600">
                        If One or More Leg Fails
                      </Label>
                      <Select defaultValue="KeepPlacedLegs">
                        <SelectTrigger id="if-leg-fails" className="h-9 bg-white border-slate-200 shadow-sm">
                          <SelectValue placeholder="Select action" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="KeepPlacedLegs">Keep Placed Legs</SelectItem>
                          <SelectItem value="CancelAll">Cancel All</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Timing Settings */}
              <div className="lg:col-span-1">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-5 space-y-5 sticky top-4">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-blue-600" />
                    <h3 className="font-semibold text-slate-800">Timing Settings</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="run-on-days" className="text-xs font-medium text-slate-700">
                        Run On Days
                      </Label>
                      <Select defaultValue="all">
                        <SelectTrigger id="run-on-days" className="h-9 bg-white border-slate-200 shadow-sm">
                          <SelectValue placeholder="Select days" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Days</SelectItem>
                          <SelectItem value="monday">Monday</SelectItem>
                          <SelectItem value="tuesday">Tuesday</SelectItem>
                          <SelectItem value="wednesday">Wednesday</SelectItem>
                          <SelectItem value="thursday">Thursday</SelectItem>
                          <SelectItem value="friday">Friday</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="start-time" className="text-xs font-medium text-slate-700">
                        Start Time
                      </Label>
                      <div className="flex items-center bg-white rounded-md border border-slate-200 shadow-sm">
                        {/* Hours */}
                        <div className="flex-1 relative border-r border-slate-200">
                          <input
                            type="text"
                            className="w-full h-9 px-2 text-center border-0 bg-transparent focus:outline-none focus:ring-0 font-mono"
                            value={startTime.hours}
                            onChange={(e) => {
                              const value = e.target.value
                              if (/^\d*$/.test(value)) {
                                const hours = value === "" ? "00" : value.padStart(2, "0").slice(-2)
                                setStartTime({ ...startTime, hours })
                              }
                            }}
                            onClick={() => setActiveTimeField("hours")}
                          />
                          <div className="absolute right-0 top-0 bottom-0 flex flex-col justify-center pr-1">
                            <button
                              className="h-4 text-xs leading-none text-slate-500 hover:text-blue-600 transition-colors"
                              onClick={() => updateTime(startTime, setStartTime, "hours", true)}
                            >
                              ▲
                            </button>
                            <button
                              className="h-4 text-xs leading-none text-slate-500 hover:text-blue-600 transition-colors"
                              onClick={() => updateTime(startTime, setStartTime, "hours", false)}
                            >
                              ▼
                            </button>
                          </div>
                        </div>
                        <span className="px-1 text-slate-400 font-mono">:</span>
                        {/* Minutes */}
                        <div className="flex-1 relative border-r border-slate-200">
                          <input
                            type="text"
                            className="w-full h-9 px-2 text-center border-0 bg-transparent focus:outline-none focus:ring-0 font-mono"
                            value={startTime.minutes}
                            onChange={(e) => {
                              const value = e.target.value
                              if (/^\d*$/.test(value)) {
                                const minutes = value === "" ? "00" : value.padStart(2, "0").slice(-2)
                                setStartTime({ ...startTime, minutes })
                              }
                            }}
                            onClick={() => setActiveTimeField("minutes")}
                          />
                          <div className="absolute right-0 top-0 bottom-0 flex flex-col justify-center pr-1">
                            <button
                              className="h-4 text-xs leading-none text-slate-500 hover:text-blue-600 transition-colors"
                              onClick={() => updateTime(startTime, setStartTime, "minutes", true)}
                            >
                              ▲
                            </button>
                            <button
                              className="h-4 text-xs leading-none text-slate-500 hover:text-blue-600 transition-colors"
                              onClick={() => updateTime(startTime, setStartTime, "minutes", false)}
                            >
                              ▼
                            </button>
                          </div>
                        </div>
                        <span className="px-1 text-slate-400 font-mono">:</span>
                        {/* Seconds */}
                        <div className="flex-1 relative">
                          <input
                            type="text"
                            className="w-full h-9 px-2 text-center border-0 bg-transparent focus:outline-none focus:ring-0 font-mono"
                            value={startTime.seconds}
                            onChange={(e) => {
                              const value = e.target.value
                              if (/^\d*$/.test(value)) {
                                const seconds = value === "" ? "00" : value.padStart(2, "0").slice(-2)
                                setStartTime({ ...startTime, seconds })
                              }
                            }}
                            onClick={() => setActiveTimeField("seconds")}
                          />
                          <div className="absolute right-0 top-0 bottom-0 flex flex-col justify-center pr-1">
                            <button
                              className="h-4 text-xs leading-none text-slate-500 hover:text-blue-600 transition-colors"
                              onClick={() => updateTime(startTime, setStartTime, "seconds", true)}
                            >
                              ▲
                            </button>
                            <button
                              className="h-4 text-xs leading-none text-slate-500 hover:text-blue-600 transition-colors"
                              onClick={() => updateTime(startTime, setStartTime, "seconds", false)}
                            >
                              ▼
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="end-time" className="text-xs font-medium text-slate-700">
                        End Time
                      </Label>
                      <div className="flex items-center bg-white rounded-md border border-slate-200 shadow-sm">
                        {/* Hours */}
                        <div className="flex-1 relative border-r border-slate-200">
                          <input
                            type="text"
                            className="w-full h-9 px-2 text-center border-0 bg-transparent focus:outline-none focus:ring-0 font-mono"
                            value={endTime.hours}
                            onChange={(e) => {
                              const value = e.target.value
                              if (/^\d*$/.test(value)) {
                                const hours = value === "" ? "00" : value.padStart(2, "0").slice(-2)
                                setEndTime({ ...endTime, hours })
                              }
                            }}
                            onClick={() => setActiveTimeField("hours")}
                          />
                          <div className="absolute right-0 top-0 bottom-0 flex flex-col justify-center pr-1">
                            <button
                              className="h-4 text-xs leading-none text-slate-500 hover:text-blue-600 transition-colors"
                              onClick={() => updateTime(endTime, setEndTime, "hours", true)}
                            >
                              ▲
                            </button>
                            <button
                              className="h-4 text-xs leading-none text-slate-500 hover:text-blue-600 transition-colors"
                              onClick={() => updateTime(endTime, setEndTime, "hours", false)}
                            >
                              ▼
                            </button>
                          </div>
                        </div>
                        <span className="px-1 text-slate-400 font-mono">:</span>
                        {/* Minutes */}
                        <div className="flex-1 relative border-r border-slate-200">
                          <input
                            type="text"
                            className="w-full h-9 px-2 text-center border-0 bg-transparent focus:outline-none focus:ring-0 font-mono"
                            value={endTime.minutes}
                            onChange={(e) => {
                              const value = e.target.value
                              if (/^\d*$/.test(value)) {
                                const minutes = value === "" ? "00" : value.padStart(2, "0").slice(-2)
                                setEndTime({ ...endTime, minutes })
                              }
                            }}
                            onClick={() => setActiveTimeField("minutes")}
                          />
                          <div className="absolute right-0 top-0 bottom-0 flex flex-col justify-center pr-1">
                            <button
                              className="h-4 text-xs leading-none text-slate-500 hover:text-blue-600 transition-colors"
                              onClick={() => updateTime(endTime, setEndTime, "minutes", true)}
                            >
                              ▲
                            </button>
                            <button
                              className="h-4 text-xs leading-none text-slate-500 hover:text-blue-600 transition-colors"
                              onClick={() => updateTime(endTime, setEndTime, "minutes", false)}
                            >
                              ▼
                            </button>
                          </div>
                        </div>
                        <span className="px-1 text-slate-400 font-mono">:</span>
                        {/* Seconds */}
                        <div className="flex-1 relative">
                          <input
                            type="text"
                            className="w-full h-9 px-2 text-center border-0 bg-transparent focus:outline-none focus:ring-0 font-mono"
                            value={endTime.seconds}
                            onChange={(e) => {
                              const value = e.target.value
                              if (/^\d*$/.test(value)) {
                                const seconds = value === "" ? "00" : value.padStart(2, "0").slice(-2)
                                setEndTime({ ...endTime, seconds })
                              }
                            }}
                            onClick={() => setActiveTimeField("seconds")}
                          />
                          <div className="absolute right-0 top-0 bottom-0 flex flex-col justify-center pr-1">
                            <button
                              className="h-4 text-xs leading-none text-slate-500 hover:text-blue-600 transition-colors"
                              onClick={() => updateTime(endTime, setEndTime, "seconds", true)}
                            >
                              ▲
                            </button>
                            <button
                              className="h-4 text-xs leading-none text-slate-500 hover:text-blue-600 transition-colors"
                              onClick={() => updateTime(endTime, setEndTime, "seconds", false)}
                            >
                              ▼
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="sqoff-time" className="text-xs font-medium text-slate-700">
                        Square Off Time
                      </Label>
                      <div className="flex items-center bg-white rounded-md border border-slate-200 shadow-sm">
                        {/* Hours */}
                        <div className="flex-1 relative border-r border-slate-200">
                          <input
                            type="text"
                            className="w-full h-9 px-2 text-center border-0 bg-transparent focus:outline-none focus:ring-0 font-mono"
                            value={sqOffTime.hours}
                            onChange={(e) => {
                              const value = e.target.value
                              if (/^\d*$/.test(value)) {
                                const hours = value === "" ? "00" : value.padStart(2, "0").slice(-2)
                                setSqOffTime({ ...sqOffTime, hours })
                              }
                            }}
                            onClick={() => setActiveTimeField("hours")}
                          />
                          <div className="absolute right-0 top-0 bottom-0 flex flex-col justify-center pr-1">
                            <button
                              className="h-4 text-xs leading-none text-slate-500 hover:text-blue-600 transition-colors"
                              onClick={() => updateTime(sqOffTime, setSqOffTime, "hours", true)}
                            >
                              ▲
                            </button>
                            <button
                              className="h-4 text-xs leading-none text-slate-500 hover:text-blue-600 transition-colors"
                              onClick={() => updateTime(sqOffTime, setSqOffTime, "hours", false)}
                            >
                              ▼
                            </button>
                          </div>
                        </div>
                        <span className="px-1 text-slate-400 font-mono">:</span>
                        {/* Minutes */}
                        <div className="flex-1 relative border-r border-slate-200">
                          <input
                            type="text"
                            className="w-full h-9 px-2 text-center border-0 bg-transparent focus:outline-none focus:ring-0 font-mono"
                            value={sqOffTime.minutes}
                            onChange={(e) => {
                              const value = e.target.value
                              if (/^\d*$/.test(value)) {
                                const minutes = value === "" ? "00" : value.padStart(2, "0").slice(-2)
                                setSqOffTime({ ...sqOffTime, minutes })
                              }
                            }}
                            onClick={() => setActiveTimeField("minutes")}
                          />
                          <div className="absolute right-0 top-0 bottom-0 flex flex-col justify-center pr-1">
                            <button
                              className="h-4 text-xs leading-none text-slate-500 hover:text-blue-600 transition-colors"
                              onClick={() => updateTime(sqOffTime, setSqOffTime, "minutes", true)}
                            >
                              ▲
                            </button>
                            <button
                              className="h-4 text-xs leading-none text-slate-500 hover:text-blue-600 transition-colors"
                              onClick={() => updateTime(sqOffTime, setSqOffTime, "minutes", false)}
                            >
                              ▼
                            </button>
                          </div>
                        </div>
                        <span className="px-1 text-slate-400 font-mono">:</span>
                        {/* Seconds */}
                        <div className="flex-1 relative">
                          <input
                            type="text"
                            className="w-full h-9 px-2 text-center border-0 bg-transparent focus:outline-none focus:ring-0 font-mono"
                            value={sqOffTime.seconds}
                            onChange={(e) => {
                              const value = e.target.value
                              if (/^\d*$/.test(value)) {
                                const seconds = value === "" ? "00" : value.padStart(2, "0").slice(-2)
                                setSqOffTime({ ...sqOffTime, seconds })
                              }
                            }}
                            onClick={() => setActiveTimeField("seconds")}
                          />
                          <div className="absolute right-0 top-0 bottom-0 flex flex-col justify-center pr-1">
                            <button
                              className="h-4 text-xs leading-none text-slate-500 hover:text-blue-600 transition-colors"
                              onClick={() => updateTime(sqOffTime, setSqOffTime, "seconds", true)}
                            >
                              ▲
                            </button>
                            <button
                              className="h-4 text-xs leading-none text-slate-500 hover:text-blue-600 transition-colors"
                              onClick={() => updateTime(sqOffTime, setSqOffTime, "seconds", false)}
                            >
                              ▼
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t border-slate-200 mt-8">
              <Button variant="outline" className="px-6">
                Reset
              </Button>
              <Button className="px-6 bg-blue-600 hover:bg-blue-700">Apply</Button>
            </div>
          </TabsContent>

          <TabsContent value="stoploss" className="mt-0 p-6 animate-in fade-in-50 slide-in-from-bottom-2 duration-500">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="sl-premium" className="text-sm font-medium text-slate-700">
                    Combined Premium (%)
                  </Label>
                  <Input
                    id="sl-premium"
                    type="number"
                    placeholder="Enter percentage"
                    className="h-10 bg-white border-slate-300 shadow-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sl-value" className="text-sm font-medium text-slate-700">
                    Combined Value (₹)
                  </Label>
                  <Input
                    id="sl-value"
                    type="number"
                    placeholder="Enter value"
                    className="h-10 bg-white border-slate-300 shadow-sm"
                  />
                </div>
              </div>

              {/* Square Off Options */}
              <div className="bg-purple-50 rounded-lg p-6 space-y-4">
                <h4 className="text-lg font-semibold text-purple-700 flex items-center">
                  <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                  Square Off Options
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="sqoffLossMaking"
                      checked={sqoffLossMaking}
                      onCheckedChange={handleSqoffLossMakingChange}
                      className="h-5 w-5"
                    />
                    <label htmlFor="sqoffLossMaking" className="text-base text-red-600 font-medium cursor-pointer">
                      Loss Making Positions
                    </label>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="sqoffProfitMaking"
                      checked={sqoffProfitMaking}
                      onCheckedChange={handleSqoffProfitMakingChange}
                      className="h-5 w-5"
                    />
                    <label htmlFor="sqoffProfitMaking" className="text-base text-green-600 font-medium cursor-pointer">
                      Profit Making Positions
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="target" className="mt-0 p-6 animate-in fade-in-50 slide-in-from-bottom-2 duration-500">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="target-premium" className="text-sm font-medium text-slate-700">
                    Combined Premium (%)
                  </Label>
                  <Input
                    id="target-premium"
                    type="number"
                    placeholder="Enter percentage"
                    className="h-10 bg-white border-slate-300 shadow-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="target-value" className="text-sm font-medium text-slate-700">
                    Combined Value (₹)
                  </Label>
                  <Input
                    id="target-value"
                    type="number"
                    placeholder="Enter value"
                    className="h-10 bg-white border-slate-300 shadow-sm"
                  />
                </div>
              </div>

              {/* Square Off Options for Target */}
              <div className="bg-purple-50 rounded-lg p-6 space-y-4">
                <h4 className="text-lg font-semibold text-purple-700 flex items-center">
                  <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                  Square Off Options
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Checkbox id="targetSqoffLossMaking" className="h-5 w-5" />
                    <label
                      htmlFor="targetSqoffLossMaking"
                      className="text-base text-red-600 font-medium cursor-pointer"
                    >
                      Loss Making Positions
                    </label>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Checkbox id="targetSqoffProfitMaking" className="h-5 w-5" />
                    <label
                      htmlFor="targetSqoffProfitMaking"
                      className="text-base text-green-600 font-medium cursor-pointer"
                    >
                      Profit Making Positions
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="profit" className="mt-0 p-6 animate-in fade-in-50 slide-in-from-bottom-2 duration-500">
            <div className="space-y-8">
              {/* Max Profit and Max Loss */}
              <div className="bg-slate-50 rounded-lg p-6 space-y-6">
                <h3 className="text-lg font-semibold text-slate-700 flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  Portfolio Limits
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="max-profit" className="text-sm font-medium text-slate-700">
                      Max Profit (₹)
                    </Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
                      <Input
                        id="max-profit"
                        type="number"
                        value={maxProfit}
                        onChange={(e) => setMaxProfit(Number(e.target.value))}
                        placeholder="Enter maximum profit"
                        className="pl-10 h-10 bg-white border-slate-300 shadow-sm"
                      />
                    </div>
                    <p className="text-xs text-slate-500">Maximum profit before auto square-off</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="max-loss" className="text-sm font-medium text-slate-700">
                      Max Loss (₹)
                    </Label>
                    <div className="relative">
                      <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-500" />
                      <Input
                        id="max-loss"
                        type="number"
                        value={maxLoss}
                        onChange={(e) => setMaxLoss(Number(e.target.value))}
                        placeholder="Enter maximum loss"
                        className="pl-10 h-10 bg-white border-slate-300 shadow-sm"
                      />
                    </div>
                    <p className="text-xs text-slate-500">Maximum loss before auto square-off</p>
                  </div>
                </div>
              </div>

              {/* Profit Locking Section */}
              <div className="bg-blue-50 rounded-lg p-6 space-y-6 border border-blue-200">
                <div className="flex items-center space-x-3">
                  <Switch
                    id="enable-profit-locking"
                    checked={profitLockingSettings.enabled}
                    onCheckedChange={(checked) => handleProfitLockingChange("enabled", checked)}
                  />
                  <Label
                    htmlFor="enable-profit-locking"
                    className="text-lg font-semibold text-blue-700 flex items-center cursor-pointer"
                  >
                    <Lock className="h-5 w-5 mr-2" />
                    Profit Locking
                  </Label>
                </div>

                {profitLockingSettings.enabled && (
                  <div className="space-y-6 pl-8 border-l-2 border-blue-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="profit-threshold" className="text-sm font-medium text-blue-700">
                          If Profit Reaches (₹)
                        </Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
                          <Input
                            id="profit-threshold"
                            type="number"
                            min="0"
                            value={profitLockingSettings.profitThreshold}
                            onChange={(e) => handleProfitLockingChange("profitThreshold", Number(e.target.value))}
                            placeholder="Enter profit threshold"
                            className="pl-10 h-10 bg-white border-blue-300 shadow-sm"
                          />
                        </div>
                        <p className="text-xs text-blue-600">The profit amount that triggers the locking mechanism</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="minimum-profit-lock" className="text-sm font-medium text-blue-700">
                          Lock Minimum Profit At (₹)
                        </Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-500" />
                          <Input
                            id="minimum-profit-lock"
                            type="number"
                            min="0"
                            value={profitLockingSettings.minimumProfitLock}
                            onChange={(e) => handleProfitLockingChange("minimumProfitLock", Number(e.target.value))}
                            placeholder="Enter minimum profit to lock"
                            className="pl-10 h-10 bg-white border-blue-300 shadow-sm"
                          />
                        </div>
                        <p className="text-xs text-blue-600">The minimum profit amount that will be secured</p>
                      </div>
                    </div>

                    <div className="bg-blue-100 rounded-md p-4 border border-blue-200">
                      <div className="flex items-start space-x-3">
                        <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-white text-xs font-bold">i</span>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-blue-800 mb-1">How Profit Locking Works</h4>
                          <p className="text-xs text-blue-700">
                            When your profit reaches ₹{profitLockingSettings.profitThreshold}, the system will
                            automatically adjust your stop-loss to lock in a minimum profit of ₹
                            {profitLockingSettings.minimumProfitLock}.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Profit Trailing Section */}
              <div className="bg-green-50 rounded-lg p-6 space-y-6 border border-green-200">
                <div className="flex items-center space-x-3">
                  <Switch
                    id="enable-profit-trailing"
                    checked={profitTrailingSettings.enabled}
                    onCheckedChange={(checked) => handleProfitTrailingChange("enabled", checked)}
                  />
                  <Label
                    htmlFor="enable-profit-trailing"
                    className="text-lg font-semibold text-green-700 flex items-center cursor-pointer"
                  >
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Profit Trailing
                  </Label>
                </div>

                {profitTrailingSettings.enabled && (
                  <div className="space-y-6 pl-8 border-l-2 border-green-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="increase-by" className="text-sm font-medium text-green-700">
                          Every Increase In Profit By (₹)
                        </Label>
                        <div className="relative">
                          <TrendingUp className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
                          <Input
                            id="increase-by"
                            type="number"
                            min="0"
                            value={profitTrailingSettings.increaseBy}
                            onChange={(e) => handleProfitTrailingChange("increaseBy", Number(e.target.value))}
                            placeholder="Enter profit increase amount"
                            className="pl-10 h-10 bg-white border-green-300 shadow-sm"
                          />
                        </div>
                        <p className="text-xs text-green-600">The profit increase that triggers trailing adjustment</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="trail-by" className="text-sm font-medium text-green-700">
                          Trail Profit By (₹)
                        </Label>
                        <div className="relative">
                          <ArrowRightLeft className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
                          <Input
                            id="trail-by"
                            type="number"
                            min="0"
                            value={profitTrailingSettings.trailBy}
                            onChange={(e) => handleProfitTrailingChange("trailBy", Number(e.target.value))}
                            placeholder="Enter trailing amount"
                            className="pl-10 h-10 bg-white border-green-300 shadow-sm"
                          />
                        </div>
                        <p className="text-xs text-green-600">The amount by which stop-loss will be trailed</p>
                      </div>
                    </div>

                    <div className="bg-green-100 rounded-md p-4 border border-green-200">
                      <div className="flex items-start space-x-3">
                        <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-white text-xs font-bold">i</span>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-green-800 mb-1">How Profit Trailing Works</h4>
                          <p className="text-xs text-green-700">
                            For every ₹{profitTrailingSettings.increaseBy} increase in profit, your stop-loss will be
                            automatically moved up by ₹{profitTrailingSettings.trailBy} to lock in more profits.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-slate-200">
                <Button variant="outline" className="px-6">
                  Reset
                </Button>
                <Button className="px-6 bg-purple-600 hover:bg-purple-700">Apply Profit Settings</Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="breakout" className="mt-0 p-6 animate-in fade-in-50 slide-in-from-bottom-2 duration-500">
            <div className="space-y-8">
              {/* Strategy Range Breakout Header */}
              <div className="bg-orange-50 rounded-lg p-6 space-y-6 border border-orange-200">
                <h3 className="text-lg font-semibold text-orange-700 flex items-center">
                  <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
                  Strategy Range Breakout
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Strategy Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="strategy-select" className="text-sm font-medium text-orange-700">
                      Strategy
                    </Label>
                    <Select
                      value={rangeBreakoutSettings.strategy}
                      onValueChange={(value) => handleRangeBreakoutChange("strategy", value)}
                    >
                      <SelectTrigger id="strategy-select" className="h-10 bg-white border-orange-300 shadow-sm">
                        <SelectValue placeholder="Select strategy" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ShortStraddle">ShortStraddle</SelectItem>
                        <SelectItem value="LongStraddle">LongStraddle</SelectItem>
                        <SelectItem value="ShortStrangle">ShortStrangle</SelectItem>
                        <SelectItem value="LongStrangle">LongStrangle</SelectItem>
                        <SelectItem value="IronCondor">IronCondor</SelectItem>
                        <SelectItem value="IronButterfly">IronButterfly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Underlying */}
                  <div className="space-y-2">
                    <Label htmlFor="underlying-select" className="text-sm font-medium text-orange-700">
                      Underlying
                    </Label>
                    <Select
                      value={rangeBreakoutSettings.underlying}
                      onValueChange={(value) => handleRangeBreakoutChange("underlying", value)}
                    >
                      <SelectTrigger id="underlying-select" className="h-10 bg-white border-orange-300 shadow-sm">
                        <SelectValue placeholder="Select underlying" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Spot">Spot</SelectItem>
                        <SelectItem value="Future">Future</SelectItem>
                        <SelectItem value="Index">Index</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Strike Adjust */}
                  <div className="space-y-2">
                    <Label htmlFor="strike-adjust" className="text-sm font-medium text-orange-700">
                      Strike Adjust <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={rangeBreakoutSettings.strikeAdjust}
                      onValueChange={(value) => handleRangeBreakoutChange("strikeAdjust", value)}
                    >
                      <SelectTrigger id="strike-adjust" className="h-10 bg-white border-orange-300 shadow-sm">
                        <SelectValue placeholder="Select strike adjust" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="None">None</SelectItem>
                        <SelectItem value="ATM">ATM</SelectItem>
                        <SelectItem value="ITM">ITM</SelectItem>
                        <SelectItem value="OTM">OTM</SelectItem>
                        <SelectItem value="Custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Time Settings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Start Time */}
                  <div className="space-y-2">
                    <Label htmlFor="breakout-start-time" className="text-sm font-medium text-orange-700">
                      Start Time
                    </Label>
                    <div className="flex items-center bg-white rounded-md border border-orange-300 shadow-sm">
                      {/* Hours */}
                      <div className="flex-1 relative border-r border-orange-200">
                        <input
                          type="text"
                          className="w-full h-10 px-2 text-center border-0 bg-transparent focus:outline-none focus:ring-0 font-mono"
                          value={rangeBreakoutSettings.startTime.hours}
                          onChange={(e) => {
                            const value = e.target.value
                            if (/^\d*$/.test(value)) {
                              const hours = value === "" ? "00" : value.padStart(2, "0").slice(-2)
                              handleRangeBreakoutChange("startTime", { ...rangeBreakoutSettings.startTime, hours })
                            }
                          }}
                        />
                        <div className="absolute right-0 top-0 bottom-0 flex flex-col justify-center pr-1">
                          <button
                            className="h-4 text-xs leading-none text-slate-500 hover:text-orange-600 transition-colors"
                            onClick={() => updateRangeBreakoutTime("startTime", "hours", true)}
                          >
                            ▲
                          </button>
                          <button
                            className="h-4 text-xs leading-none text-slate-500 hover:text-orange-600 transition-colors"
                            onClick={() => updateRangeBreakoutTime("startTime", "hours", false)}
                          >
                            ▼
                          </button>
                        </div>
                      </div>
                      <span className="px-1 text-slate-400 font-mono">:</span>
                      {/* Minutes */}
                      <div className="flex-1 relative border-r border-orange-200">
                        <input
                          type="text"
                          className="w-full h-10 px-2 text-center border-0 bg-transparent focus:outline-none focus:ring-0 font-mono"
                          value={rangeBreakoutSettings.startTime.minutes}
                          onChange={(e) => {
                            const value = e.target.value
                            if (/^\d*$/.test(value)) {
                              const minutes = value === "" ? "00" : value.padStart(2, "0").slice(-2)
                              handleRangeBreakoutChange("startTime", { ...rangeBreakoutSettings.startTime, minutes })
                            }
                          }}
                        />
                        <div className="absolute right-0 top-0 bottom-0 flex flex-col justify-center pr-1">
                          <button
                            className="h-4 text-xs leading-none text-slate-500 hover:text-orange-600 transition-colors"
                            onClick={() => updateRangeBreakoutTime("startTime", "minutes", true)}
                          >
                            ▲
                          </button>
                          <button
                            className="h-4 text-xs leading-none text-slate-500 hover:text-orange-600 transition-colors"
                            onClick={() => updateRangeBreakoutTime("startTime", "minutes", false)}
                          >
                            ▼
                          </button>
                        </div>
                      </div>
                      <span className="px-1 text-slate-400 font-mono">:</span>
                      {/* Seconds */}
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          className="w-full h-10 px-2 text-center border-0 bg-transparent focus:outline-none focus:ring-0 font-mono"
                          value={rangeBreakoutSettings.startTime.seconds}
                          onChange={(e) => {
                            const value = e.target.value
                            if (/^\d*$/.test(value)) {
                              const seconds = value === "" ? "00" : value.padStart(2, "0").slice(-2)
                              handleRangeBreakoutChange("startTime", { ...rangeBreakoutSettings.startTime, seconds })
                            }
                          }}
                        />
                        <div className="absolute right-0 top-0 bottom-0 flex flex-col justify-center pr-1">
                          <button
                            className="h-4 text-xs leading-none text-slate-500 hover:text-orange-600 transition-colors"
                            onClick={() => updateRangeBreakoutTime("startTime", "seconds", true)}
                          >
                            ▲
                          </button>
                          <button
                            className="h-4 text-xs leading-none text-slate-500 hover:text-orange-600 transition-colors"
                            onClick={() => updateRangeBreakoutTime("startTime", "seconds", false)}
                          >
                            ▼
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* End Time (Optional) */}
                  <div className="space-y-2">
                    <Label htmlFor="breakout-end-time" className="text-sm font-medium text-orange-700">
                      End Time (Optional)
                    </Label>
                    <div className="flex items-center bg-white rounded-md border border-orange-300 shadow-sm">
                      {/* Hours */}
                      <div className="flex-1 relative border-r border-orange-200">
                        <input
                          type="text"
                          className="w-full h-10 px-2 text-center border-0 bg-transparent focus:outline-none focus:ring-0 font-mono"
                          value={rangeBreakoutSettings.endTime.hours}
                          onChange={(e) => {
                            const value = e.target.value
                            if (/^\d*$/.test(value)) {
                              const hours = value === "" ? "00" : value.padStart(2, "0").slice(-2)
                              handleRangeBreakoutChange("endTime", { ...rangeBreakoutSettings.endTime, hours })
                            }
                          }}
                        />
                        <div className="absolute right-0 top-0 bottom-0 flex flex-col justify-center pr-1">
                          <button
                            className="h-4 text-xs leading-none text-slate-500 hover:text-orange-600 transition-colors"
                            onClick={() => updateRangeBreakoutTime("endTime", "hours", true)}
                          >
                            ▲
                          </button>
                          <button
                            className="h-4 text-xs leading-none text-slate-500 hover:text-orange-600 transition-colors"
                            onClick={() => updateRangeBreakoutTime("endTime", "hours", false)}
                          >
                            ▼
                          </button>
                        </div>
                      </div>
                      <span className="px-1 text-slate-400 font-mono">:</span>
                      {/* Minutes */}
                      <div className="flex-1 relative border-r border-orange-200">
                        <input
                          type="text"
                          className="w-full h-10 px-2 text-center border-0 bg-transparent focus:outline-none focus:ring-0 font-mono"
                          value={rangeBreakoutSettings.endTime.minutes}
                          onChange={(e) => {
                            const value = e.target.value
                            if (/^\d*$/.test(value)) {
                              const minutes = value === "" ? "00" : value.padStart(2, "0").slice(-2)
                              handleRangeBreakoutChange("endTime", { ...rangeBreakoutSettings.endTime, minutes })
                            }
                          }}
                        />
                        <div className="absolute right-0 top-0 bottom-0 flex flex-col justify-center pr-1">
                          <button
                            className="h-4 text-xs leading-none text-slate-500 hover:text-orange-600 transition-colors"
                            onClick={() => updateRangeBreakoutTime("endTime", "minutes", true)}
                          >
                            ▲
                          </button>
                          <button
                            className="h-4 text-xs leading-none text-slate-500 hover:text-orange-600 transition-colors"
                            onClick={() => updateRangeBreakoutTime("endTime", "minutes", false)}
                          >
                            ▼
                          </button>
                        </div>
                      </div>
                      <span className="px-1 text-slate-400 font-mono">:</span>
                      {/* Seconds */}
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          className="w-full h-10 px-2 text-center border-0 bg-transparent focus:outline-none focus:ring-0 font-mono"
                          value={rangeBreakoutSettings.endTime.seconds}
                          onChange={(e) => {
                            const value = e.target.value
                            if (/^\d*$/.test(value)) {
                              const seconds = value === "" ? "00" : value.padStart(2, "0").slice(-2)
                              handleRangeBreakoutChange("endTime", { ...rangeBreakoutSettings.endTime, seconds })
                            }
                          }}
                        />
                        <div className="absolute right-0 top-0 bottom-0 flex flex-col justify-center pr-1">
                          <button
                            className="h-4 text-xs leading-none text-slate-500 hover:text-orange-600 transition-colors"
                            onClick={() => updateRangeBreakoutTime("endTime", "seconds", true)}
                          >
                            ▲
                          </button>
                          <button
                            className="h-4 text-xs leading-none text-slate-500 hover:text-orange-600 transition-colors"
                            onClick={() => updateRangeBreakoutTime("endTime", "seconds", false)}
                          >
                            ▼
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Monitoring Section */}
              <div className="bg-purple-50 rounded-lg p-6 space-y-6 border border-purple-200">
                <h3 className="text-lg font-semibold text-purple-700 flex items-center">
                  <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                  Monitoring & Execution
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Monitoring Options */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-purple-700">Monitoring</Label>
                    <div className="space-y-2">
                      <div
                        className={`p-3 rounded-md border cursor-pointer transition-all ${
                          rangeBreakoutSettings.monitoring === "Rolling"
                            ? "bg-blue-100 border-blue-300 text-blue-700"
                            : "bg-white border-purple-200 hover:border-purple-300"
                        }`}
                        onClick={() => handleRangeBreakoutChange("monitoring", "Rolling")}
                      >
                        <div className="flex items-center space-x-2">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              rangeBreakoutSettings.monitoring === "Rolling" ? "bg-blue-500" : "bg-gray-300"
                            }`}
                          ></div>
                          <span className="font-medium">Rolling</span>
                        </div>
                      </div>
                      <div
                        className={`p-3 rounded-md border cursor-pointer transition-all ${
                          rangeBreakoutSettings.monitoring === "Static"
                            ? "bg-blue-100 border-blue-300 text-blue-700"
                            : "bg-white border-purple-200 hover:border-purple-300"
                        }`}
                        onClick={() => handleRangeBreakoutChange("monitoring", "Static")}
                      >
                        <div className="flex items-center space-x-2">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              rangeBreakoutSettings.monitoring === "Static" ? "bg-blue-500" : "bg-gray-300"
                            }`}
                          ></div>
                          <span className="font-medium">Static</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Breakout Value and Execute Action */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="breakout-value" className="text-sm font-medium text-purple-700">
                        Breakout Value
                      </Label>
                      <Input
                        id="breakout-value"
                        type="number"
                        value={rangeBreakoutSettings.breakoutValue}
                        onChange={(e) => handleRangeBreakoutChange("breakoutValue", e.target.value)}
                        placeholder="Enter breakout value"
                        className="h-10 bg-white border-purple-300 shadow-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="execute-action" className="text-sm font-medium text-purple-700">
                        Execute Action
                      </Label>
                      <Select
                        value={rangeBreakoutSettings.executeAction}
                        onValueChange={(value) => handleRangeBreakoutChange("executeAction", value)}
                      >
                        <SelectTrigger id="execute-action" className="h-10 bg-white border-purple-300 shadow-sm">
                          <SelectValue placeholder="Select execute action" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SquareOff">Square Off</SelectItem>
                          <SelectItem value="Hedge">Hedge</SelectItem>
                          <SelectItem value="Exit">Exit</SelectItem>
                          <SelectItem value="Adjust">Adjust</SelectItem>
                          <SelectItem value="Hold">Hold</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Info Box */}
                <div className="bg-purple-100 rounded-md p-4 border border-purple-200">
                  <div className="flex items-start space-x-3">
                    <div className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">i</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-purple-800 mb-1">Range Breakout Strategy</h4>
                      <p className="text-xs text-purple-700">
                        This strategy monitors the {rangeBreakoutSettings.strategy} position and executes the selected
                        action when the breakout value is reached during the specified time window using{" "}
                        {rangeBreakoutSettings.monitoring.toLowerCase()} monitoring.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-slate-200">
                <Button variant="outline" className="px-6">
                  Reset
                </Button>
                <Button className="px-6 bg-orange-600 hover:bg-orange-700">Apply Breakout Settings</Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
