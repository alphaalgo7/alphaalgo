"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Clock, Settings } from "lucide-react"

export function ExecutionParameters() {
  const [executionType, setExecutionType] = useState("market")
  const [isAdvanced, setIsAdvanced] = useState(false)
  const [slicingEnabled, setSlicingEnabled] = useState(false)
  const [twapEnabled, setTwapEnabled] = useState(false)

  // Add timing settings
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

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Settings className="h-4 w-4 mr-2 text-blue-600" />
          Execution Parameters
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="product-type">Product Type</Label>
              <Select value={productType} onValueChange={setProductType}>
                <SelectTrigger id="product-type" className="h-9 bg-slate-50">
                  <SelectValue placeholder="Select product type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NRML">NRML</SelectItem>
                  <SelectItem value="MIS">MIS</SelectItem>
                  <SelectItem value="CNC">CNC</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="strategy-tag">Strategy Tag</Label>
              <div className="relative">
                <Select value={strategyTag} onValueChange={setStrategyTag}>
                  <SelectTrigger id="strategy-tag" className="h-9 bg-slate-50 pr-10">
                    <SelectValue placeholder="Select strategy tag" />
                  </SelectTrigger>
                  <SelectContent>
                    {strategyTags.map((tag) => (
                      <SelectItem key={tag} value={tag}>
                        {tag}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-9 w-9 p-0"
                  onClick={() => setShowTagInput(true)}
                >
                  +
                </Button>
              </div>
              {showTagInput && (
                <div className="mt-2 flex gap-2">
                  <Input
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    placeholder="New tag name"
                    className="h-8 text-xs"
                  />
                  <Button size="sm" className="h-8" onClick={addStrategyTag}>
                    Add
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 p-0 w-8" onClick={() => setShowTagInput(false)}>
                    ×
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="execution-type">Execution Type</Label>
              <Select value={executionType} onValueChange={setExecutionType}>
                <SelectTrigger id="execution-type" className="h-9 bg-slate-50">
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
                <Label htmlFor="limit-price">Limit Price</Label>
                <Input id="limit-price" type="number" placeholder="Enter limit price" className="h-9 bg-slate-50" />
              </div>
            )}

            {executionType === "sltp" && (
              <div className="space-y-2">
                <Label htmlFor="trigger-price">Trigger Price</Label>
                <Input id="trigger-price" type="number" placeholder="Enter trigger price" className="h-9 bg-slate-50" />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="legs-execution">Legs Execution</Label>
              <Select defaultValue="Parallel">
                <SelectTrigger id="legs-execution" className="h-9 bg-slate-50">
                  <SelectValue placeholder="Select execution mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Parallel">Parallel</SelectItem>
                  <SelectItem value="Sequential">Sequential</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="if-leg-fails">If One or More Leg Fails</Label>
              <Select defaultValue="KeepPlacedLegs">
                <SelectTrigger id="if-leg-fails" className="h-9 bg-slate-50">
                  <SelectValue placeholder="Select action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="KeepPlacedLegs">Keep Placed Legs</SelectItem>
                  <SelectItem value="CancelAll">Cancel All</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="advanced-settings" checked={isAdvanced} onCheckedChange={setIsAdvanced} />
            <Label htmlFor="advanced-settings">Advanced Settings</Label>
          </div>

          {isAdvanced && (
            <div className="space-y-4 pt-2 pl-6">
              <div className="flex items-center space-x-2">
                <Switch id="enable-slicing" checked={slicingEnabled} onCheckedChange={setSlicingEnabled} />
                <Label htmlFor="enable-slicing">Enable Order Slicing</Label>
              </div>

              {slicingEnabled && (
                <div className="grid grid-cols-2 gap-4 pl-6">
                  <div className="space-y-2">
                    <Label htmlFor="slice-size">Slice Size</Label>
                    <Input id="slice-size" type="number" placeholder="Enter slice size" className="h-9 bg-slate-50" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slice-interval">Interval (seconds)</Label>
                    <Input id="slice-interval" type="number" placeholder="Enter interval" className="h-9 bg-slate-50" />
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Switch id="enable-twap" checked={twapEnabled} onCheckedChange={setTwapEnabled} />
                <Label htmlFor="enable-twap">Enable TWAP</Label>
              </div>

              {twapEnabled && (
                <div className="grid grid-cols-2 gap-4 pl-6">
                  <div className="space-y-2">
                    <Label htmlFor="twap-duration">Duration (minutes)</Label>
                    <Input id="twap-duration" type="number" placeholder="Enter duration" className="h-9 bg-slate-50" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="twap-slices">Number of Slices</Label>
                    <Input id="twap-slices" type="number" placeholder="Enter slices" className="h-9 bg-slate-50" />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="validity">Order Validity</Label>
                <Select defaultValue="day">
                  <SelectTrigger id="validity" className="h-9 bg-slate-50">
                    <SelectValue placeholder="Select validity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="day">Day</SelectItem>
                    <SelectItem value="ioc">IOC</SelectItem>
                    <SelectItem value="gtc">GTC</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="qty-by-exposure">Qty by Exposure</Label>
                  <Input
                    id="qty-by-exposure"
                    placeholder="Enter value or %"
                    defaultValue="25%"
                    className="h-9 bg-slate-50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max-lots">Max Lots</Label>
                  <Input id="max-lots" type="number" defaultValue="10" className="h-9 bg-slate-50" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="portfolio-execution-mode">Portfolio Execution Mode</Label>
                <Select defaultValue="StartTime">
                  <SelectTrigger id="portfolio-execution-mode" className="h-9 bg-slate-50">
                    <SelectValue placeholder="Select execution mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="StartTime">Start Time</SelectItem>
                    <SelectItem value="Manual">Manual</SelectItem>
                    <SelectItem value="Signal">Signal Based</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Timing Settings Section */}
          <div className="mt-6 space-y-4 border-t pt-4">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-blue-600" />
              <Label className="font-medium">Timing Settings</Label>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="run-on-days">Run On Days</Label>
                <Select defaultValue="all">
                  <SelectTrigger id="run-on-days" className="h-9 bg-slate-50">
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

              <div className="space-y-2">
                <Label htmlFor="start-time">Start Time</Label>
                <div className="flex items-center bg-slate-50 rounded-md border">
                  {/* Hours */}
                  <div className="flex-1 relative border-r border-slate-200">
                    <input
                      type="text"
                      className="w-full h-9 px-2 text-center border-0 bg-transparent focus:outline-none focus:ring-0"
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
                        className="h-4 text-xs leading-none text-slate-500 hover:text-slate-800"
                        onClick={() => updateTime(startTime, setStartTime, "hours", true)}
                      >
                        ▲
                      </button>
                      <button
                        className="h-4 text-xs leading-none text-slate-500 hover:text-slate-800"
                        onClick={() => updateTime(startTime, setStartTime, "hours", false)}
                      >
                        ▼
                      </button>
                    </div>
                  </div>
                  <span className="px-1 text-slate-400">:</span>
                  {/* Minutes */}
                  <div className="flex-1 relative border-r border-slate-200">
                    <input
                      type="text"
                      className="w-full h-9 px-2 text-center border-0 bg-transparent focus:outline-none focus:ring-0"
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
                        className="h-4 text-xs leading-none text-slate-500 hover:text-slate-800"
                        onClick={() => updateTime(startTime, setStartTime, "minutes", true)}
                      >
                        ▲
                      </button>
                      <button
                        className="h-4 text-xs leading-none text-slate-500 hover:text-slate-800"
                        onClick={() => updateTime(startTime, setStartTime, "minutes", false)}
                      >
                        ▼
                      </button>
                    </div>
                  </div>
                  <span className="px-1 text-slate-400">:</span>
                  {/* Seconds */}
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      className="w-full h-9 px-2 text-center border-0 bg-transparent focus:outline-none focus:ring-0"
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
                        className="h-4 text-xs leading-none text-slate-500 hover:text-slate-800"
                        onClick={() => updateTime(startTime, setStartTime, "seconds", true)}
                      >
                        ▲
                      </button>
                      <button
                        className="h-4 text-xs leading-none text-slate-500 hover:text-slate-800"
                        onClick={() => updateTime(startTime, setStartTime, "seconds", false)}
                      >
                        ▼
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-1">
                  <Button variant="outline" size="sm" className="text-xs h-7">
                    09:15:00
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs h-7">
                    09:30:00
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs h-7">
                    10:00:00
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="end-time">End Time</Label>
                <div className="flex items-center bg-slate-50 rounded-md border">
                  {/* Hours */}
                  <div className="flex-1 relative border-r border-slate-200">
                    <input
                      type="text"
                      className="w-full h-9 px-2 text-center border-0 bg-transparent focus:outline-none focus:ring-0"
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
                        className="h-4 text-xs leading-none text-slate-500 hover:text-slate-800"
                        onClick={() => updateTime(endTime, setEndTime, "hours", true)}
                      >
                        ▲
                      </button>
                      <button
                        className="h-4 text-xs leading-none text-slate-500 hover:text-slate-800"
                        onClick={() => updateTime(endTime, setEndTime, "hours", false)}
                      >
                        ▼
                      </button>
                    </div>
                  </div>
                  <span className="px-1 text-slate-400">:</span>
                  {/* Minutes */}
                  <div className="flex-1 relative border-r border-slate-200">
                    <input
                      type="text"
                      className="w-full h-9 px-2 text-center border-0 bg-transparent focus:outline-none focus:ring-0"
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
                        className="h-4 text-xs leading-none text-slate-500 hover:text-slate-800"
                        onClick={() => updateTime(endTime, setEndTime, "minutes", true)}
                      >
                        ▲
                      </button>
                      <button
                        className="h-4 text-xs leading-none text-slate-500 hover:text-slate-800"
                        onClick={() => updateTime(endTime, setEndTime, "minutes", false)}
                      >
                        ▼
                      </button>
                    </div>
                  </div>
                  <span className="px-1 text-slate-400">:</span>
                  {/* Seconds */}
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      className="w-full h-9 px-2 text-center border-0 bg-transparent focus:outline-none focus:ring-0"
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
                        className="h-4 text-xs leading-none text-slate-500 hover:text-slate-800"
                        onClick={() => updateTime(endTime, setEndTime, "seconds", true)}
                      >
                        ▲
                      </button>
                      <button
                        className="h-4 text-xs leading-none text-slate-500 hover:text-slate-800"
                        onClick={() => updateTime(endTime, setEndTime, "seconds", false)}
                      >
                        ▼
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-1">
                  <Button variant="outline" size="sm" className="text-xs h-7">
                    15:15:00
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs h-7">
                    15:20:00
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs h-7">
                    15:25:00
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sqoff-time">Square Off Time</Label>
                <div className="flex items-center bg-slate-50 rounded-md border">
                  {/* Hours */}
                  <div className="flex-1 relative border-r border-slate-200">
                    <input
                      type="text"
                      className="w-full h-9 px-2 text-center border-0 bg-transparent focus:outline-none focus:ring-0"
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
                        className="h-4 text-xs leading-none text-slate-500 hover:text-slate-800"
                        onClick={() => updateTime(sqOffTime, setSqOffTime, "hours", true)}
                      >
                        ▲
                      </button>
                      <button
                        className="h-4 text-xs leading-none text-slate-500 hover:text-slate-800"
                        onClick={() => updateTime(sqOffTime, setSqOffTime, "hours", false)}
                      >
                        ▼
                      </button>
                    </div>
                  </div>
                  <span className="px-1 text-slate-400">:</span>
                  {/* Minutes */}
                  <div className="flex-1 relative border-r border-slate-200">
                    <input
                      type="text"
                      className="w-full h-9 px-2 text-center border-0 bg-transparent focus:outline-none focus:ring-0"
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
                        className="h-4 text-xs leading-none text-slate-500 hover:text-slate-800"
                        onClick={() => updateTime(sqOffTime, setSqOffTime, "minutes", true)}
                      >
                        ▲
                      </button>
                      <button
                        className="h-4 text-xs leading-none text-slate-500 hover:text-slate-800"
                        onClick={() => updateTime(sqOffTime, setSqOffTime, "minutes", false)}
                      >
                        ▼
                      </button>
                    </div>
                  </div>
                  <span className="px-1 text-slate-400">:</span>
                  {/* Seconds */}
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      className="w-full h-9 px-2 text-center border-0 bg-transparent focus:outline-none focus:ring-0"
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
                        className="h-4 text-xs leading-none text-slate-500 hover:text-slate-800"
                        onClick={() => updateTime(sqOffTime, setSqOffTime, "seconds", true)}
                      >
                        ▲
                      </button>
                      <button
                        className="h-4 text-xs leading-none text-slate-500 hover:text-slate-800"
                        onClick={() => updateTime(sqOffTime, setSqOffTime, "seconds", false)}
                      >
                        ▼
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-1">
                  <Button variant="outline" size="sm" className="text-xs h-7">
                    15:25:00
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs h-7">
                    15:30:00
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Square Off Options</Label>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sqoffLossMaking"
                      checked={sqoffLossMaking}
                      onCheckedChange={handleSqoffLossMakingChange}
                    />
                    <label htmlFor="sqoffLossMaking" className="text-sm text-blue-700">
                      Loss Making
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sqoffProfitMaking"
                      checked={sqoffProfitMaking}
                      onCheckedChange={handleSqoffProfitMakingChange}
                    />
                    <label htmlFor="sqoffProfitMaking" className="text-sm text-blue-700">
                      Profit Making
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline">Reset</Button>
            <Button>Apply</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
