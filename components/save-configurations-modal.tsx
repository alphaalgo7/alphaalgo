"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Save, X, FileText, Calendar, User } from "lucide-react"
import type { GeneratedStrategyRow } from "@/lib/types"

interface SaveConfigurationsModalProps {
  isOpen: boolean
  onClose: () => void
  configurations: GeneratedStrategyRow[]
  stoxxoNumber: string
  instrument: string
}

export default function SaveConfigurationsModal({
  isOpen,
  onClose,
  configurations,
  stoxxoNumber,
  instrument,
}: SaveConfigurationsModalProps) {
  const [configName, setConfigName] = useState("")
  const [description, setDescription] = useState("")
  const [tags, setTags] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  if (!isOpen) return null

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate save operation
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Here you would typically save to your backend/database
    console.log("Saving configuration:", {
      name: configName,
      description,
      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      configurations,
      stoxxoNumber,
      instrument,
      createdAt: new Date().toISOString(),
    })

    setIsSaving(false)
    onClose()

    // Reset form
    setConfigName("")
    setDescription("")
    setTags("")
  }

  const selectedConfigs = configurations.filter((config) => config.selected)
  const totalConfigs = configurations.length

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <CardHeader className="border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Save className="h-6 w-6 text-blue-600" />
              <CardTitle className="text-xl font-semibold text-slate-800 dark:text-slate-100">
                Save Configuration Set
              </CardTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6 overflow-y-auto">
          <div className="space-y-6">
            {/* Summary */}
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
              <h3 className="font-medium text-slate-800 dark:text-slate-100 mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Configuration Summary
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-600 dark:text-slate-400">Total Configurations:</span>
                  <Badge variant="secondary" className="ml-2">
                    {totalConfigs}
                  </Badge>
                </div>
                <div>
                  <span className="text-slate-600 dark:text-slate-400">Selected:</span>
                  <Badge variant="default" className="ml-2 bg-blue-600">
                    {selectedConfigs.length}
                  </Badge>
                </div>
                <div>
                  <span className="text-slate-600 dark:text-slate-400">STOXXO Number:</span>
                  <Badge variant="outline" className="ml-2">
                    {stoxxoNumber}
                  </Badge>
                </div>
                <div>
                  <span className="text-slate-600 dark:text-slate-400">Instrument:</span>
                  <Badge variant="outline" className="ml-2">
                    {instrument}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="configName" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Configuration Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="configName"
                  value={configName}
                  onChange={(e) => setConfigName(e.target.value)}
                  placeholder="e.g., Plan A Strategy Set - SENSEX 0DTE"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe this configuration set..."
                  rows={3}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="tags" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Tags
                </Label>
                <Input
                  id="tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="e.g., high-profit, conservative, experimental (comma-separated)"
                  className="mt-1"
                />
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Separate multiple tags with commas</p>
              </div>
            </div>

            {/* Preview of configurations to be saved */}
            {selectedConfigs.length > 0 && (
              <div>
                <h3 className="font-medium text-slate-800 dark:text-slate-100 mb-3">
                  Configurations to Save ({selectedConfigs.length})
                </h3>
                <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                  <div className="max-h-48 overflow-y-auto">
                    <table className="w-full text-xs">
                      <thead className="bg-slate-50 dark:bg-slate-800 sticky top-0">
                        <tr>
                          <th className="px-3 py-2 text-left font-medium text-slate-700 dark:text-slate-300">Plan</th>
                          <th className="px-3 py-2 text-left font-medium text-slate-700 dark:text-slate-300">
                            Strategy
                          </th>
                          <th className="px-3 py-2 text-left font-medium text-slate-700 dark:text-slate-300">
                            Trading Acc
                          </th>
                          <th className="px-3 py-2 text-left font-medium text-slate-700 dark:text-slate-300">
                            Main Basket
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedConfigs.map((config) => (
                          <tr key={config.id} className="border-t border-slate-200 dark:border-slate-700">
                            <td className="px-3 py-2">
                              <Badge variant="outline" className="text-xs">
                                {config.planLetter}
                              </Badge>
                            </td>
                            <td className="px-3 py-2">
                              <Badge variant="secondary" className="text-xs">
                                {config.strategyType}
                              </Badge>
                            </td>
                            <td className="px-3 py-2 text-slate-700 dark:text-slate-300">{config.tradingAcc}</td>
                            <td className="px-3 py-2 text-slate-700 dark:text-slate-300">{config.mainBasket}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Metadata */}
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
              <h3 className="font-medium text-slate-800 dark:text-slate-100 mb-3 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Save Information
              </h3>
              <div className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                <div className="flex items-center gap-2">
                  <User className="h-3 w-3" />
                  <span>Created by: Current User</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-3 w-3" />
                  <span>Date: {new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>

        <div className="border-t border-slate-200 dark:border-slate-700 p-6">
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={onClose} disabled={isSaving}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!configName.trim() || selectedConfigs.length === 0 || isSaving}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isSaving ? "Saving..." : "Save Configuration"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
