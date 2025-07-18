"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import StrategyConfigTable from "@/components/strategy-config-table"
import StrategyInputForm from "@/components/strategy-input-form"
import MultiLegPortfolioModal from "@/components/multi-leg-portfolio-modal"
import OnlineChecklistModal from "@/components/online-checklist-modal"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Download, RotateCcw, Undo2, Redo2, Settings2, TableIcon, Layers, Save, FileSpreadsheet } from "lucide-react"
import { type StrategyConfigRow, initialStrategyDataRaw, type GeneratedStrategySet } from "@/lib/types"
import { parseRawStrategyData, convertToCSV } from "@/lib/utils"
import { Toaster } from "@/components/ui/toaster"
import { toast } from "@/hooks/use-toast"
import SaveConfigurationsModal from "@/components/save-configurations-modal"

const MAX_HISTORY_LENGTH = 50

export default function HomePage() {
  const [strategyHeaders, setStrategyHeaders] = useState<string[]>([])
  const [history, setHistory] = useState<StrategyConfigRow[][]>([])
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState<number>(-1)
  const [isPortfolioModalOpen, setIsPortfolioModalOpen] = useState<boolean>(false)
  const [isSaveModalOpen, setIsSaveModalOpen] = useState<boolean>(false)
  const [isOnlineChecklistOpen, setIsOnlineChecklistOpen] = useState<boolean>(false)
  const [stoxxoNumber, setStoxxoNumber] = useState<string>("")
  const [instrument, setInstrument] = useState<string>("")
  const [selectedPortfolioEntries, setSelectedPortfolioEntries] = useState<
    Array<{
      id: string
      displayName: string
      parentTag: string
      type: string
      subType?: string
      isCopied: boolean
    }>
  >([])

  const currentStrategyData = useMemo(() => {
    if (currentHistoryIndex >= 0 && currentHistoryIndex < history.length) {
      return history[currentHistoryIndex]
    }
    return []
  }, [history, currentHistoryIndex])

  const updateStrategies = useCallback(
    (newData: StrategyConfigRow[] | ((prevData: StrategyConfigRow[]) => StrategyConfigRow[])) => {
      setHistory((prevHistory) => {
        const currentData =
          currentHistoryIndex >= 0 && currentHistoryIndex < prevHistory.length ? prevHistory[currentHistoryIndex] : []
        const newStrategies = typeof newData === "function" ? newData(currentData) : newData

        const newHistoryBase = prevHistory.slice(0, currentHistoryIndex + 1)
        let updatedHistory = [...newHistoryBase, newStrategies]

        if (updatedHistory.length > MAX_HISTORY_LENGTH) {
          updatedHistory = updatedHistory.slice(updatedHistory.length - MAX_HISTORY_LENGTH)
        }
        setCurrentHistoryIndex(updatedHistory.length - 1)
        return updatedHistory
      })
    },
    [currentHistoryIndex],
  )

  useEffect(() => {
    // Only parse headers from initial data, but start with empty table
    const { headers } = parseRawStrategyData(initialStrategyDataRaw)
    setStrategyHeaders(headers)
    // Start with empty history - no initial data loaded
    setHistory([[]])
    setCurrentHistoryIndex(0)
  }, [])

  const handleAddStrategies = useCallback(
    (newStrategySets: GeneratedStrategySet[]) => {
      const finalizedNewRows: StrategyConfigRow[] = []
      const existingTags = new Set(currentStrategyData.map((row) => row.StrategyTag))

      newStrategySets.forEach((set) => {
        set.generatedRows.forEach((newRow) => {
          let potentialTag = newRow.StrategyTag
          let isDuplicate =
            existingTags.has(potentialTag) || finalizedNewRows.some((r) => r.StrategyTag === potentialTag)

          if (isDuplicate) {
            const pseudoAccFirstLetter =
              set.sourcePseudoAcc && set.sourcePseudoAcc[0] ? set.sourcePseudoAcc[0].toUpperCase() : "X"
            potentialTag = `${newRow.StrategyTag}${pseudoAccFirstLetter}`
            isDuplicate = existingTags.has(potentialTag) || finalizedNewRows.some((r) => r.StrategyTag === potentialTag)

            if (isDuplicate) {
              let counter = 1
              let suffixedTag = `${potentialTag}${counter}`
              while (existingTags.has(suffixedTag) || finalizedNewRows.some((r) => r.StrategyTag === suffixedTag)) {
                counter++
                suffixedTag = `${potentialTag}${counter}`
              }
              potentialTag = suffixedTag
            }
          }

          // Add the pseudo account information to the strategy row
          const finalizedRow = {
            ...newRow,
            StrategyTag: potentialTag,
            "Pseudo Acc": set.sourcePseudoAcc || "",
          }
          finalizedNewRows.push(finalizedRow)
        })
      })

      if (finalizedNewRows.length > 0) {
        updateStrategies((prevData) => [...prevData, ...finalizedNewRows])
        toast({
          title: "Strategies Added",
          description: `${finalizedNewRows.length} unique configurations added.`,
        })
      } else {
        toast({
          title: "No New Strategies",
          description: "No new strategies were generated or all were duplicates.",
          variant: "default",
        })
      }
    },
    [updateStrategies, currentStrategyData],
  )

  const handleStoxxoNumberChange = (value: string) => {
    setStoxxoNumber(value)
  }

  const handleInstrumentChange = (value: string) => {
    setInstrument(value)
  }

  const handlePortfolioSelectionChange = useCallback(
    (
      entries: Array<{
        id: string
        displayName: string
        parentTag: string
        type: string
        subType?: string
        isCopied: boolean
      }>,
    ) => {
      setSelectedPortfolioEntries(entries)
    },
    [],
  )

  const handleDownloadCSV = () => {
    if (strategyHeaders.length === 0 || currentStrategyData.length === 0) {
      toast({
        title: "No Data",
        description: "There is no data to download.",
        variant: "destructive",
      })
      return
    }

    // Extract plan letters from strategy tags
    const planLetterSet = new Set<string>()
    currentStrategyData.forEach((row) => {
      const strategyTag = row.StrategyTag || ""
      // Extract plan letter from tags like "PLANA5J", "PLANB6B", etc.
      const match = strategyTag.match(/PLAN([A-Z])/i)
      if (match && match[1]) {
        planLetterSet.add(match[1].toUpperCase())
      }
    })

    // Create a sorted array of unique plan letters
    const planLetters = Array.from(planLetterSet).sort().join("")

    // Clean instrument name for filename (remove spaces and special characters)
    const cleanInstrument = instrument
      .replace(/\s+/g, "_") // Replace spaces with underscores
      .replace(/[^A-Za-z0-9_-]/g, "") // Remove special characters except underscore and hyphen
      .toUpperCase()

    // Format current date and time
    const now = new Date()
    const dateStr = now.toISOString().split("T")[0] // YYYY-MM-DD
    const timeStr = now.toTimeString().split(" ")[0].replace(/:/g, "") // HHMMSS

    // Generate filename with all components
    const filenameParts: string[] = []

    if (stoxxoNumber) {
      filenameParts.push(`STOXXO${stoxxoNumber}`)
    }

    if (cleanInstrument) {
      filenameParts.push(cleanInstrument)
    }

    if (planLetters) {
      filenameParts.push(`PLAN${planLetters}`)
    }

    // Add date and time
    filenameParts.push(`${dateStr}_${timeStr}`)

    // Create final filename
    const filename = filenameParts.length > 1 ? filenameParts.join("_") : `STRATEGIES_${dateStr}_${timeStr}`

    // Generate and download CSV
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
        title: "CSV Downloaded",
        description: `File saved as ${filename}.csv`,
      })
    }
  }

  const handleDownloadChecklistCSV = () => {
    if (strategyHeaders.length === 0 || currentStrategyData.length === 0) {
      toast({
        title: "No Data",
        description: "There is no data to download.",
        variant: "destructive",
      })
      return
    }

    // Extract plan letters from strategy tags
    const planLetterSet = new Set<string>()
    currentStrategyData.forEach((row) => {
      const strategyTag = row.StrategyTag || ""
      const match = strategyTag.match(/PLAN([A-Z])/i)
      if (match && match[1]) {
        planLetterSet.add(match[1].toUpperCase())
      }
    })

    // Create a sorted array of unique plan letters
    const planLetters = Array.from(planLetterSet).sort().join("")

    // Create main header
    const headerParts = []
    if (stoxxoNumber) headerParts.push(`STOXXO ${stoxxoNumber}`)
    if (instrument) headerParts.push(instrument)
    if (planLetters) headerParts.push(`PLAN ${planLetters}`)

    const mainHeader = headerParts.join(" - ")

    // STRATEGY TAGS section
    const strategyTagsHeaders = [
      "CHECKLIST",
      "START TRADING",
      "PORTFOLIO ENABLED",
      "StrategyTag",
      "User Account",
      "Pseudo Acc",
      "Max Profit",
      "Max Loss",
      "Profit Locking",
      "Entry Order Retry",
      "Entry Retry Count",
      "Entry Retry Wait (Seconds)",
      "Entry Max Wait (Seconds)",
      "Exit Order Retry",
      "Exit Retry Count",
      "Exit Retry Wait (Seconds)",
      "Exit Max Wait (Seconds)",
    ]

    const strategyTagsData = currentStrategyData.map((row) => [
      "[ ]", // CHECKLIST - Using ASCII characters that work in all systems
      "NO", // START TRADING
      "NO", // PORTFOLIO ENABLED
      row.StrategyTag || "",
      row["User Account"] || "",
      row["Pseudo Acc"] || "",
      row["Max Profit"] || "",
      row["Max Loss"] || "",
      row["Profit Locking"] || "",
      row["Entry Order Retry"] || "",
      row["Entry Retry Count"] || "",
      row["Entry Retry Wait (Seconds)"] || "",
      row["Entry Max Wait (Seconds)"] || "",
      row["Exit Order Retry"] || "",
      row["Exit Retry Count"] || "",
      row["Exit Retry Wait (Seconds)"] || "",
      row["Exit Max Wait (Seconds)"] || "",
    ])

    // MULTILEG PORTFOLIO section - Use selected entries from the modal
    const multilegHeaders = ["CHECKLIST", "MULTI LEG PORTFOLIO Name", "MIS", "NRML", "Strategy Tags"]

    // Group selected entries by plan type
    const planAEntries: string[][] = []
    const planBEntries: string[][] = []
    const planCEntries: string[][] = []
    const otherEntries: string[][] = []

    if (selectedPortfolioEntries.length > 0) {
      // Sort entries by plan type
      selectedPortfolioEntries.forEach((entry) => {
        const planMatch = entry.parentTag.match(/PLAN([A-C])/i)
        const planType = planMatch ? planMatch[1].toUpperCase() : null

        const entryRow = [
          "[ ]", // CHECKLIST - Using ASCII characters
          entry.displayName, // MULTI LEG PORTFOLIO Name
          "[ ]", // MIS - Using ASCII characters
          "[ ]", // NRML - Using ASCII characters
          entry.parentTag, // Strategy Tags
        ]

        if (planType === "A") {
          planAEntries.push(entryRow)
        } else if (planType === "B") {
          planBEntries.push(entryRow)
        } else if (planType === "C") {
          planCEntries.push(entryRow)
        } else {
          otherEntries.push(entryRow)
        }
      })
    }

    // Helper function to escape CSV values
    const escapeCSV = (value: string): string => {
      const stringValue = value.toString()
      if (stringValue.includes(",") || stringValue.includes("\n") || stringValue.includes('"')) {
        return `"${stringValue.replace(/"/g, '""')}"`
      }
      return stringValue
    }

    // Build the complete CSV content
    const csvLines: string[] = []

    // Main header
    csvLines.push(escapeCSV(mainHeader))
    csvLines.push("") // Empty line

    // STRATEGY TAGS section
    csvLines.push("STRATEGY TAGS")
    csvLines.push(strategyTagsHeaders.map(escapeCSV).join(","))
    strategyTagsData.forEach((row) => {
      csvLines.push(row.map(escapeCSV).join(","))
    })

    csvLines.push("") // Empty line
    csvLines.push("") // Empty line

    // MULTILEG PORTFOLIO section with plan separation
    csvLines.push("MULTILEG PORTFOLIO")
    csvLines.push(multilegHeaders.map(escapeCSV).join(","))

    // Add Plan A entries with header
    if (planAEntries.length > 0) {
      csvLines.push(
        escapeCSV("--- PLAN A ENTRIES ---") +
          "," +
          escapeCSV("") +
          "," +
          escapeCSV("") +
          "," +
          escapeCSV("") +
          "," +
          escapeCSV(""),
      )
      planAEntries.forEach((row) => {
        csvLines.push(row.map(escapeCSV).join(","))
      })
      csvLines.push("") // Empty line for separation
    }

    // Add Plan B entries with header
    if (planBEntries.length > 0) {
      csvLines.push(
        escapeCSV("--- PLAN B ENTRIES ---") +
          "," +
          escapeCSV("") +
          "," +
          escapeCSV("") +
          "," +
          escapeCSV("") +
          "," +
          escapeCSV(""),
      )
      planBEntries.forEach((row) => {
        csvLines.push(row.map(escapeCSV).join(","))
      })
      csvLines.push("") // Empty line for separation
    }

    // Add Plan C entries with header
    if (planCEntries.length > 0) {
      csvLines.push(
        escapeCSV("--- PLAN C ENTRIES ---") +
          "," +
          escapeCSV("") +
          "," +
          escapeCSV("") +
          "," +
          escapeCSV("") +
          "," +
          escapeCSV(""),
      )
      planCEntries.forEach((row) => {
        csvLines.push(row.map(escapeCSV).join(","))
      })
      csvLines.push("") // Empty line for separation
    }

    // Add other entries if any
    if (otherEntries.length > 0) {
      csvLines.push(
        escapeCSV("--- OTHER ENTRIES ---") +
          "," +
          escapeCSV("") +
          "," +
          escapeCSV("") +
          "," +
          escapeCSV("") +
          "," +
          escapeCSV(""),
      )
      otherEntries.forEach((row) => {
        csvLines.push(row.map(escapeCSV).join(","))
      })
    }

    // If no entries were selected at all
    if (
      planAEntries.length === 0 &&
      planBEntries.length === 0 &&
      planCEntries.length === 0 &&
      otherEntries.length === 0
    ) {
      csvLines.push(escapeCSV("No entries selected in Multi Leg Portfolio"))
    }

    const csvContent = csvLines.join("\n")

    // Add UTF-8 BOM for proper Excel encoding
    const BOM = "\uFEFF"
    const csvContentWithBOM = BOM + csvContent

    // Generate filename
    const now = new Date()
    const dateStr = now.toISOString().split("T")[0]
    const timeStr = now.toTimeString().split(" ")[0].replace(/:/g, "")

    const filenameParts = []
    if (stoxxoNumber) filenameParts.push(`STOXXO${stoxxoNumber}`)
    if (instrument)
      filenameParts.push(
        instrument
          .replace(/\s+/g, "_")
          .replace(/[^A-Za-z0-9_-]/g, "")
          .toUpperCase(),
      )
    if (planLetters) filenameParts.push(`PLAN${planLetters}`)
    filenameParts.push("CHECKLIST")
    filenameParts.push(`${dateStr}_${timeStr}`)

    const filename = filenameParts.join("_")

    // Create and download the file
    const blob = new Blob([csvContentWithBOM], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)

    link.setAttribute("href", url)
    link.setAttribute("download", `${filename}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Checklist CSV Downloaded",
      description: `File saved as ${filename}.csv with separated PLAN A, PLAN B, and PLAN C sections`,
    })
  }

  const handleClearAllData = useCallback(() => {
    updateStrategies([])
    toast({
      title: "Configurations Cleared",
      description: "All configurations have been removed from the table.",
    })
  }, [updateStrategies])

  const handleUndo = () => {
    if (currentHistoryIndex > 0) {
      setCurrentHistoryIndex(currentHistoryIndex - 1)
      toast({ title: "Undo", description: "Last action reverted." })
    }
  }

  const handleRedo = () => {
    if (currentHistoryIndex < history.length - 1) {
      setCurrentHistoryIndex(currentHistoryIndex + 1)
      toast({ title: "Redo", description: "Last undone action restored." })
    }
  }

  const memoizedHeaders = useMemo(() => strategyHeaders, [strategyHeaders])

  const canUndo = useMemo(() => currentHistoryIndex > 0, [currentHistoryIndex])
  const canRedo = useMemo(() => currentHistoryIndex < history.length - 1, [currentHistoryIndex, history.length])
  const canClear = useMemo(() => currentStrategyData.length > 0, [currentStrategyData])

  return (
    <>
      <div className="min-h-screen bg-slate-100 dark:bg-slate-950 py-6 sm:py-8">
        <main className="container mx-auto px-4">
          <header className="mb-8">
            <div className="flex items-center space-x-3 mb-2">
              <Settings2 className="h-8 w-8 text-sky-600 dark:text-sky-500" />
              <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Strategy Configuration Manager</h1>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Manage trading strategy configurations by pasting bulk data or adding individual entries.
            </p>
          </header>

          <StrategyInputForm
            onAddStrategies={handleAddStrategies}
            onStoxxoNumberChange={handleStoxxoNumberChange}
            onInstrumentChange={handleInstrumentChange}
            stoxxoNumber={stoxxoNumber}
            instrument={instrument}
          />

          <Card className="mt-10 shadow-lg">
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center space-x-3">
                  <TableIcon className="h-6 w-6 text-sky-600 dark:text-sky-500" />
                  <div>
                    <CardTitle className="text-xl font-semibold text-slate-800 dark:text-slate-200">
                      Current Configurations
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
                      View and manage your strategy settings.
                      {(stoxxoNumber || instrument) && (
                        <span className="ml-2 font-medium text-sky-600 dark:text-sky-400">
                          {stoxxoNumber && `STOXXO #${stoxxoNumber}`}
                          {stoxxoNumber && instrument && " • "}
                          {instrument && instrument}
                        </span>
                      )}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-2 flex-wrap">
                  <Button onClick={handleUndo} variant="outline" size="sm" disabled={!canUndo} aria-label="Undo">
                    <Undo2 className="h-4 w-4" />
                  </Button>
                  <Button onClick={handleRedo} variant="outline" size="sm" disabled={!canRedo} aria-label="Redo">
                    <Redo2 className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => setIsPortfolioModalOpen(true)}
                    variant="outline"
                    size="sm"
                    disabled={currentStrategyData.length === 0}
                    className="bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/20 dark:hover:bg-purple-900/30 border-purple-200 dark:border-purple-800"
                  >
                    <Layers className="mr-1.5 h-4 w-4 text-purple-600 dark:text-purple-400" />
                    Multi Leg Portfolio
                  </Button>
                  <Button
                    onClick={() => setIsSaveModalOpen(true)}
                    variant="outline"
                    size="sm"
                    disabled={currentStrategyData.length === 0}
                    className="bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/30 border-green-200 dark:border-green-800"
                  >
                    <Save className="mr-1.5 h-4 w-4 text-green-600 dark:text-green-400" />
                    Save
                  </Button>
                  <Button onClick={handleClearAllData} variant="destructive" size="sm" disabled={!canClear}>
                    <RotateCcw className="mr-1.5 h-4 w-4" />
                    Clear All
                  </Button>
                  <Button
                    onClick={handleDownloadCSV}
                    variant="default"
                    size="sm"
                    disabled={currentStrategyData.length === 0}
                    className="bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600 text-white"
                  >
                    <Download className="mr-1.5 h-4 w-4" />
                    Download CSV
                  </Button>
                  <Button
                    onClick={() => setIsOnlineChecklistOpen(true)}
                    variant="outline"
                    size="sm"
                    disabled={currentStrategyData.length === 0}
                    className="bg-orange-50 hover:bg-orange-100 dark:bg-orange-900/20 dark:hover:bg-orange-900/30 border-orange-200 dark:border-orange-800"
                  >
                    <FileSpreadsheet className="mr-1.5 h-4 w-4 text-orange-600 dark:text-orange-400" />
                    Online Checklist
                  </Button>
                  <Button
                    onClick={handleDownloadChecklistCSV}
                    variant="outline"
                    size="sm"
                    disabled={currentStrategyData.length === 0}
                    className="bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800"
                  >
                    <Download className="mr-1.5 h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    Checklist CSV
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <StrategyConfigTable headers={memoizedHeaders} dataRows={currentStrategyData} />
            </CardContent>
          </Card>
        </main>
      </div>

      <MultiLegPortfolioModal
        isOpen={isPortfolioModalOpen}
        onClose={() => setIsPortfolioModalOpen(false)}
        strategyData={currentStrategyData}
        onSelectionChange={handlePortfolioSelectionChange}
      />

      <SaveConfigurationsModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        currentStrategyData={currentStrategyData}
        strategyHeaders={memoizedHeaders}
        stoxxoNumber={stoxxoNumber}
        instrument={instrument}
      />

      <OnlineChecklistModal
        isOpen={isOnlineChecklistOpen}
        onClose={() => setIsOnlineChecklistOpen(false)}
        strategyData={currentStrategyData}
        selectedPortfolioEntries={selectedPortfolioEntries}
        stoxxoNumber={stoxxoNumber}
        instrument={instrument}
      />

      <Toaster />
    </>
  )
}
