"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { PercentageAbsoluteInput } from "./percentage-absolute-input"
import { ArrowUpRight, Target } from "lucide-react"

export function TargetSettings() {
  const [enableTarget, setEnableTarget] = useState(false)
  const [targetType, setTargetType] = useState("percentage")
  const [trailingEnabled, setTrailingEnabled] = useState(false)
  const [multipleTargets, setMultipleTargets] = useState(false)
  const [targets, setTargets] = useState([{ id: 1, value: "", percentage: 100 }])

  // Add profit protection settings
  const [profitProtection, setProfitProtection] = useState({
    enabled: false,
    profitReachesValue: "10000",
    minimumProfitValue: "5000",
    increasingProfitBy: "1000",
    trailProfitBy: "500",
  })

  // Add target action settings
  const [targetAction, setTargetAction] = useState("exit")
  const [partialExitPercentage, setPartialExitPercentage] = useState("50")
  const [executeLegsOnTarget, setExecuteLegsOnTarget] = useState<number[]>([])
  const [squareOffLegsOnTarget, setSquareOffLegsOnTarget] = useState<number[]>([])

  const addTarget = () => {
    if (targets.length < 5) {
      const newId = Math.max(...targets.map((t) => t.id), 0) + 1
      setTargets([...targets, { id: newId, value: "", percentage: 0 }])
    }
  }

  const removeTarget = (id: number) => {
    if (targets.length > 1) {
      setTargets(targets.filter((t) => t.id !== id))
    }
  }

  const updateTarget = (id: number, field: string, value: string | number) => {
    setTargets(targets.map((t) => (t.id === id ? { ...t, [field]: value } : t)))
  }

  // Handle profit protection changes
  const handleProfitProtectionChange = (field: string, value: string | boolean) => {
    setProfitProtection({
      ...profitProtection,
      [field]: value,
    })
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Target className="h-4 w-4 mr-2 text-green-500" />
          Target Settings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch id="enable-target" checked={enableTarget} onCheckedChange={setEnableTarget} />
            <Label htmlFor="enable-target">Enable Target</Label>
          </div>

          {enableTarget && (
            <>
              <div className="space-y-2">
                <Label htmlFor="target-type">Target Type</Label>
                <Select value={targetType} onValueChange={setTargetType}>
                  <SelectTrigger id="target-type">
                    <SelectValue placeholder="Select target type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="points">Points</SelectItem>
                    <SelectItem value="price">Price</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="target-action">On Target Trigger</Label>
                <Select value={targetAction} onValueChange={setTargetAction}>
                  <SelectTrigger id="target-action">
                    <SelectValue placeholder="Select action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="exit">Exit Position</SelectItem>
                    <SelectItem value="partial">Partial Exit</SelectItem>
                    <SelectItem value="trail">Trail SL</SelectItem>
                    <SelectItem value="hedge">Add Hedge</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {targetAction === "partial" && (
                <div className="space-y-2 pl-6">
                  <Label htmlFor="partial-exit-percentage">Exit Percentage</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="partial-exit-percentage"
                      value={partialExitPercentage}
                      onChange={(e) => setPartialExitPercentage(e.target.value)}
                      className="w-24"
                    />
                    <span>%</span>
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Switch id="multiple-targets" checked={multipleTargets} onCheckedChange={setMultipleTargets} />
                <Label htmlFor="multiple-targets">Multiple Targets</Label>
              </div>

              {!multipleTargets ? (
                <div className="space-y-2">
                  <Label htmlFor="target-value">Target Value</Label>
                  <PercentageAbsoluteInput
                    id="target-value"
                    mode={targetType === "percentage" ? "percentage" : "absolute"}
                    placeholder={targetType === "percentage" ? "Enter % value" : "Enter value"}
                  />
                </div>
              ) : (
                <div className="space-y-3">
                  {targets.map((target, index) => (
                    <div key={target.id} className="grid grid-cols-12 gap-2 items-center">
                      <div className="col-span-6">
                        <Label htmlFor={`target-${target.id}`} className={index > 0 ? "sr-only" : ""}>
                          Target Value
                        </Label>
                        <PercentageAbsoluteInput
                          id={`target-${target.id}`}
                          mode={targetType === "percentage" ? "percentage" : "absolute"}
                          placeholder={targetType === "percentage" ? "Enter % value" : "Enter value"}
                          value={target.value}
                          onChange={(value) => updateTarget(target.id, "value", value)}
                        />
                      </div>
                      <div className="col-span-4">
                        <Label htmlFor={`percentage-${target.id}`} className={index > 0 ? "sr-only" : ""}>
                          Quantity %
                        </Label>
                        <Input
                          id={`percentage-${target.id}`}
                          type="number"
                          placeholder="Qty %"
                          value={target.percentage}
                          onChange={(e) => updateTarget(target.id, "percentage", e.target.value)}
                        />
                      </div>
                      <div className="col-span-2 flex justify-end items-end">
                        {index === targets.length - 1 && targets.length < 5 && (
                          <Button type="button" variant="ghost" size="sm" onClick={addTarget} className="h-8 w-8 p-0">
                            +
                          </Button>
                        )}
                        {targets.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeTarget(target.id)}
                            className="h-8 w-8 p-0 text-red-500"
                          >
                            ×
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Switch id="trailing-target" checked={trailingEnabled} onCheckedChange={setTrailingEnabled} />
                <Label htmlFor="trailing-target">Trailing Target</Label>
              </div>

              {trailingEnabled && (
                <div className="space-y-2 pl-6">
                  <Label htmlFor="trailing-value">Trailing Value</Label>
                  <PercentageAbsoluteInput
                    id="trailing-value"
                    mode={targetType === "percentage" ? "percentage" : "absolute"}
                    placeholder={targetType === "percentage" ? "Enter % value" : "Enter value"}
                  />
                </div>
              )}

              {/* Profit Protection Section */}
              <div className="mt-6 space-y-4 border-t pt-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="enable-profit-protection"
                    checked={profitProtection.enabled}
                    onCheckedChange={(checked) => handleProfitProtectionChange("enabled", checked)}
                  />
                  <Label htmlFor="enable-profit-protection" className="flex items-center font-medium">
                    <ArrowUpRight className="h-4 w-4 mr-2 text-green-500" />
                    Profit Protection
                  </Label>
                </div>

                {profitProtection.enabled && (
                  <div className="p-2 bg-green-50 rounded-md border border-green-100 space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="profit-reaches" className="text-xs text-green-700">
                          If profit reaches
                        </Label>
                        <Input
                          id="profit-reaches"
                          value={profitProtection.profitReachesValue}
                          onChange={(e) => handleProfitProtectionChange("profitReachesValue", e.target.value)}
                          className="h-8 text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="min-profit" className="text-xs text-green-700">
                          Lock minimum profit at
                        </Label>
                        <Input
                          id="min-profit"
                          value={profitProtection.minimumProfitValue}
                          onChange={(e) => handleProfitProtectionChange("minimumProfitValue", e.target.value)}
                          className="h-8 text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="increase-profit" className="text-xs text-green-700">
                          Every increase in profit by
                        </Label>
                        <Input
                          id="increase-profit"
                          value={profitProtection.increasingProfitBy}
                          onChange={(e) => handleProfitProtectionChange("increasingProfitBy", e.target.value)}
                          className="h-8 text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="trail-profit" className="text-xs text-green-700">
                          Trail profit by
                        </Label>
                        <Input
                          id="trail-profit"
                          value={profitProtection.trailProfitBy}
                          onChange={(e) => handleProfitProtectionChange("trailProfitBy", e.target.value)}
                          className="h-8 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Leg-specific options */}
              <div className="mt-6 space-y-4 border-t pt-4">
                <Label className="font-medium">Leg-Specific Actions on Target</Label>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-blue-700 font-medium">Execute Legs</span>
                      <Button variant="outline" size="sm" className="h-6 text-xs py-0 px-2">
                        Select All
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-1 max-h-24 overflow-y-auto bg-white rounded border border-slate-200 p-1">
                      {[1, 2, 3, 4].map((legId) => (
                        <div
                          key={`exec-${legId}`}
                          className="flex items-center space-x-2 p-1 hover:bg-slate-50 rounded"
                        >
                          <Checkbox
                            id={`exec-leg-${legId}`}
                            checked={executeLegsOnTarget.includes(legId)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setExecuteLegsOnTarget([...executeLegsOnTarget, legId])
                              } else {
                                setExecuteLegsOnTarget(executeLegsOnTarget.filter((id) => id !== legId))
                              }
                            }}
                          />
                          <label htmlFor={`exec-leg-${legId}`} className="text-xs cursor-pointer flex-1">
                            Leg {legId}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-blue-700 font-medium">Square Off Legs</span>
                      <Button variant="outline" size="sm" className="h-6 text-xs py-0 px-2">
                        Select All
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-1 max-h-24 overflow-y-auto bg-white rounded border border-slate-200 p-1">
                      {[1, 2, 3, 4].map((legId) => (
                        <div key={`sq-${legId}`} className="flex items-center space-x-2 p-1 hover:bg-slate-50 rounded">
                          <Checkbox
                            id={`sq-leg-${legId}`}
                            checked={squareOffLegsOnTarget.includes(legId)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSquareOffLegsOnTarget([...squareOffLegsOnTarget, legId])
                              } else {
                                setSquareOffLegsOnTarget(squareOffLegsOnTarget.filter((id) => id !== legId))
                              }
                            }}
                          />
                          <label htmlFor={`sq-leg-${legId}`} className="text-xs cursor-pointer flex-1">
                            Leg {legId}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline">Reset</Button>
            <Button>Apply</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
