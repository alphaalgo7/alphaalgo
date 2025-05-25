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
import { ArrowDownRight, Shield } from "lucide-react"

export function StoplossSettings() {
  const [enableStoploss, setEnableStoploss] = useState(false)
  const [stoplossType, setStoplossType] = useState("percentage")
  const [trailingEnabled, setTrailingEnabled] = useState(false)

  // Add stoploss action settings
  const [stoplossAction, setStoplossAction] = useState("exit")
  const [hedgeSettings, setHedgeSettings] = useState({
    instrument: "NIFTY",
    quantity: "1",
    type: "CE",
  })

  // Add loss protection settings
  const [lossProtection, setLossProtection] = useState({
    enabled: false,
    lossReachesValue: "5000",
    maximumLossValue: "10000",
    increasingLossBy: "1000",
    trailLossBy: "500",
  })

  // Add leg-specific settings
  const [executeLegsOnStoploss, setExecuteLegsOnStoploss] = useState<number[]>([])
  const [squareOffLegsOnStoploss, setSquareOffLegsOnStoploss] = useState<number[]>([])

  // Handle loss protection changes
  const handleLossProtectionChange = (field: string, value: string | boolean) => {
    setLossProtection({
      ...lossProtection,
      [field]: value,
    })
  }

  // Handle hedge settings changes
  const handleHedgeSettingChange = (field: string, value: string) => {
    setHedgeSettings({
      ...hedgeSettings,
      [field]: value,
    })
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Shield className="h-4 w-4 mr-2 text-red-500" />
          Stoploss Settings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch id="enable-stoploss" checked={enableStoploss} onCheckedChange={setEnableStoploss} />
            <Label htmlFor="enable-stoploss">Enable Stoploss</Label>
          </div>

          {enableStoploss && (
            <>
              <div className="space-y-2">
                <Label htmlFor="stoploss-type">Stoploss Type</Label>
                <Select value={stoplossType} onValueChange={setStoplossType}>
                  <SelectTrigger id="stoploss-type">
                    <SelectValue placeholder="Select stoploss type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="points">Points</SelectItem>
                    <SelectItem value="price">Price</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="stoploss-value">Stoploss Value</Label>
                <PercentageAbsoluteInput
                  id="stoploss-value"
                  mode={stoplossType === "percentage" ? "percentage" : "absolute"}
                  placeholder={stoplossType === "percentage" ? "Enter % value" : "Enter value"}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stoploss-action">On SL Trigger</Label>
                <Select value={stoplossAction} onValueChange={setStoplossAction}>
                  <SelectTrigger id="stoploss-action">
                    <SelectValue placeholder="Select action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="exit">Exit Position</SelectItem>
                    <SelectItem value="hedge">Add Hedge</SelectItem>
                    <SelectItem value="none">Do Nothing</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {stoplossAction === "hedge" && (
                <div className="space-y-3 pl-6 p-2 bg-slate-50 rounded-md border border-slate-200">
                  <div className="space-y-2">
                    <Label htmlFor="hedge-instrument">Instrument</Label>
                    <Select
                      value={hedgeSettings.instrument}
                      onValueChange={(value) => handleHedgeSettingChange("instrument", value)}
                    >
                      <SelectTrigger id="hedge-instrument">
                        <SelectValue placeholder="Select instrument" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="NIFTY">NIFTY</SelectItem>
                        <SelectItem value="BANKNIFTY">BANKNIFTY</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hedge-type">Option Type</Label>
                    <Select
                      value={hedgeSettings.type}
                      onValueChange={(value) => handleHedgeSettingChange("type", value)}
                    >
                      <SelectTrigger id="hedge-type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CE">CE</SelectItem>
                        <SelectItem value="PE">PE</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hedge-quantity">Quantity</Label>
                    <Input
                      id="hedge-quantity"
                      value={hedgeSettings.quantity}
                      onChange={(e) => handleHedgeSettingChange("quantity", e.target.value)}
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Switch id="trailing-stoploss" checked={trailingEnabled} onCheckedChange={setTrailingEnabled} />
                <Label htmlFor="trailing-stoploss">Trailing Stoploss</Label>
              </div>

              {trailingEnabled && (
                <div className="space-y-2 pl-6">
                  <Label htmlFor="trailing-value">Trailing Value</Label>
                  <PercentageAbsoluteInput
                    id="trailing-value"
                    mode={stoplossType === "percentage" ? "percentage" : "absolute"}
                    placeholder={stoplossType === "percentage" ? "Enter % value" : "Enter value"}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="trigger-type">Trigger Type</Label>
                <Select defaultValue="mark">
                  <SelectTrigger id="trigger-type">
                    <SelectValue placeholder="Select trigger type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mark">Mark Price</SelectItem>
                    <SelectItem value="last">Last Price</SelectItem>
                    <SelectItem value="index">Index Price</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="execution-type">Execution Type</Label>
                <Select defaultValue="market">
                  <SelectTrigger id="execution-type">
                    <SelectValue placeholder="Select execution type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="market">Market</SelectItem>
                    <SelectItem value="limit">Limit</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Loss Protection Section */}
              <div className="mt-6 space-y-4 border-t pt-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="enable-loss-protection"
                    checked={lossProtection.enabled}
                    onCheckedChange={(checked) => handleLossProtectionChange("enabled", checked)}
                  />
                  <Label htmlFor="enable-loss-protection" className="flex items-center font-medium">
                    <ArrowDownRight className="h-4 w-4 mr-2 text-red-500" />
                    Loss Protection
                  </Label>
                </div>

                {lossProtection.enabled && (
                  <div className="p-2 bg-red-50 rounded-md border border-red-100 space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="loss-reaches" className="text-xs text-red-700">
                          If loss reaches
                        </Label>
                        <Input
                          id="loss-reaches"
                          value={lossProtection.lossReachesValue}
                          onChange={(e) => handleLossProtectionChange("lossReachesValue", e.target.value)}
                          className="h-8 text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="max-loss" className="text-xs text-red-700">
                          Maximum loss at
                        </Label>
                        <Input
                          id="max-loss"
                          value={lossProtection.maximumLossValue}
                          onChange={(e) => handleLossProtectionChange("maximumLossValue", e.target.value)}
                          className="h-8 text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="increase-loss" className="text-xs text-red-700">
                          Every increase in loss by
                        </Label>
                        <Input
                          id="increase-loss"
                          value={lossProtection.increasingLossBy}
                          onChange={(e) => handleLossProtectionChange("increasingLossBy", e.target.value)}
                          className="h-8 text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="trail-loss" className="text-xs text-red-700">
                          Trail loss by
                        </Label>
                        <Input
                          id="trail-loss"
                          value={lossProtection.trailLossBy}
                          onChange={(e) => handleLossProtectionChange("trailLossBy", e.target.value)}
                          className="h-8 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Leg-specific options */}
              <div className="mt-6 space-y-4 border-t pt-4">
                <Label className="font-medium">Leg-Specific Actions on Stoploss</Label>

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
                            checked={executeLegsOnStoploss.includes(legId)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setExecuteLegsOnStoploss([...executeLegsOnStoploss, legId])
                              } else {
                                setExecuteLegsOnStoploss(executeLegsOnStoploss.filter((id) => id !== legId))
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
                            checked={squareOffLegsOnStoploss.includes(legId)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSquareOffLegsOnStoploss([...squareOffLegsOnStoploss, legId])
                              } else {
                                setSquareOffLegsOnStoploss(squareOffLegsOnStoploss.filter((id) => id !== legId))
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
