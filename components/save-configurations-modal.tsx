"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Download, Copy, Check } from "lucide-react"
import type { StrategyConfigRow } from "@/lib/types"
import { convertToCSV } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"

interface SaveConfigurationsModalProps {
  isOpen: boolean
  onClose: () => void
  currentStrategyData: StrategyConfigRow[]
  strategyHeaders: string[]
  stoxxoNumber: string
  instrument: string
}

export default function SaveConfigurationsModal({
  isOpen,
  onClose,
  currentStrategyData,
  strategyHeaders,
  stoxxoNumber,
  instrument,
}: SaveConfigurationsModalProps) {
  const [customFileName, setCustomFileName] = useState("")
  const [copied, setCopied] = useState(false)

  if (!isOpen) return null

  const generateFileName = () => {
    const now = new Date()
    const dateStr = now.toISOString().split("T")[0]
    const timeStr = now.toTimeString().split(" ")[0].replace(/:/g, "")

    const filenameParts = []
    if (stoxxoNumber) filenameParts.push(`STOXXO${stoxxoNumber}`)
    if (instrument) {
      const cleanInstrument = instrument
        .replace(/\s+/g, "_")
        .replace(/[^A-Za-z0-9_-]/g, "")
        .toUpperCase()
      filenameParts.push(cleanInstrument)
    }
    filenameParts.push(`CONFIG_${dateStr}_${timeStr}`)

    return filenameParts.join("_")
  }

  const handleDownload = () => {
    if (strategyHeaders.length === 0 || currentStrategyData.length === 0) {
      toast({
        title: "No Data",
        description: "There is no data to save.",
        variant: "destructive",
      })
      return
    }

    const filename = customFileName.trim() || generateFileName()
    const csvData = convertToCSV(strategyHeaders, currentStrategyData)
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute("href", url)
      link.setAttribute("download", `${filename}.csv`)
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: "Configuration Saved",
        description: `File saved as ${filename}.csv`,
      })
      onClose()
    }
  }

  const handleCopyToClipboard = async () => {
    if (strategyHeaders.length === 0 || currentStrategyData.length === 0) {
      toast({
        title: "No Data",
        description: "There is no data to copy.",
        variant: "destructive",
      })
      return
    }

    const csvData = convertToCSV(strategyHeaders, currentStrategyData)

    try {
      await navigator.clipboard.writeText(csvData)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast({
        title: "Copied to Clipboard",
        description: "Configuration data has been copied to your clipboard.",
      })
    } catch (err) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy data to clipboard.",
        variant: "destructive",
      })
    }
  }

  const csvPreview =
    strategyHeaders.length > 0 && currentStrategyData.length > 0
      ? convertToCSV(strategyHeaders, currentStrategyData.slice(0, 3))
      : "No data available"

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl font-semibold">Save Configurations</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="filename" className="text-sm font-medium">
                Custom Filename (optional)
              </Label>
              <Input
                id="filename"
                value={customFileName}
                onChange={(e) => setCustomFileName(e.target.value)}
                placeholder={generateFileName()}
                className="mt-1"
              />
              <p className="text-xs text-slate-500 mt-1">Leave empty to use auto-generated filename</p>
            </div>

            <div>
              <Label className="text-sm font-medium">Preview (first 3 rows)</Label>
              <Textarea
                value={csvPreview}
                readOnly
                rows={8}
                className="mt-1 text-xs font-mono bg-slate-50 dark:bg-slate-900"
              />
            </div>

            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
              <h4 className="font-medium text-sm mb-2">Summary</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-600 dark:text-slate-400">Total Strategies:</span>
                  <span className="ml-2 font-medium">{currentStrategyData.length}</span>
                </div>
                <div>
                  <span className="text-slate-600 dark:text-slate-400">Columns:</span>
                  <span className="ml-2 font-medium">{strategyHeaders.length}</span>
                </div>
                {stoxxoNumber && (
                  <div>
                    <span className="text-slate-600 dark:text-slate-400">STOXXO:</span>
                    <span className="ml-2 font-medium">{stoxxoNumber}</span>
                  </div>
                )}
                {instrument && (
                  <div>
                    <span className="text-slate-600 dark:text-slate-400">Instrument:</span>
                    <span className="ml-2 font-medium">{instrument}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="outline" onClick={handleCopyToClipboard} disabled={currentStrategyData.length === 0}>
              {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
              {copied ? "Copied!" : "Copy to Clipboard"}
            </Button>
            <Button
              onClick={handleDownload}
              disabled={currentStrategyData.length === 0}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Download className="mr-2 h-4 w-4" />
              Download CSV
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
