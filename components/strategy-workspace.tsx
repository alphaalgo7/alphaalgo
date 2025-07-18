"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import StrategyConfigTable from "@/components/strategy-config-table"
import StrategyInputForm from "@/components/strategy-input-form"
import MultiLegPortfolioModal from "@/components/multi-leg-portfolio-modal"
import OnlineChecklistModal from "@/components/online-checklist-modal"
import SaveConfigurationsModal from "@/components/save-configurations-modal"
import UserDashboard from "@/components/user-dashboard"
import RealtimeStatus from "@/components/realtime-status"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import {
  Download,
  RotateCcw,
  Undo2,
  Redo2,
  Settings2,
  TableIcon,
  Layers,
  Save,
  FileSpreadsheet,
  UserIcon,
  LogOut,
} from "lucide-react"
import { type StrategyConfigRow, initialStrategyDataRaw, type GeneratedStrategySet } from "@/lib/types"
import { parseRawStrategyData, convertToCSV } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"
import { useRealtimeData } from "@/hooks/use-realtime-data"

const MAX_HISTORY_LENGTH = 50

interface UserData {
  id: string
  name: string
  email: string
  avatar?: string
  createdAt: string
  lastLogin: string
}

interface StrategyWorkspaceProps {
  user: UserData
  onLogout: () => void
}

export default function StrategyWorkspace({ user, onLogout }: StrategyWorkspaceProps) {
  const [showDashboard, setShowDashboard] = useState(false)
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

  // Real-time data hook
  const { isConnected, lastUpdate, saveData, loadData, subscribeToUpdates, unsubscribeFromUpdates } = useRealtimeData(
    user.id,
  )

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

        // Save to real-time database
        saveData({
          strategies: newStrategies,
          stoxxoNumber,
          instrument,
          timestamp: new Date().toISOString(),
        })

        return updatedHistory
      })
    },
    [currentHistoryIndex, saveData, stoxxoNumber, instrument],
  )

  useEffect(() => {
    // Load initial data
    const { headers } = parseRawStrategyData(initialStrategyDataRaw)
    setStrategyHeaders(headers)

    // Load user's saved data
    loadUserData()

    // Subscribe to real-time updates
    subscribeToUpdates((data) => {
      if (data.strategies) {
        setHistory([[...data.strategies]])
        setCurrentHistoryIndex(0)
      }
      if (data.stoxxoNumber) setStoxxoNumber(data.stoxxoNumber)
      if (data.instrument) setInstrument(data.instrument)
    })

    return () => {
      unsubscribeFromUpdates()
    }
  }, [subscribeToUpdates, unsubscribeFromUpdates])

  const loadUserData = async () => {
    try {
      const userData = await loadData()
      if (userData) {
        if (userData.strategies) {
          setHistory([userData.strategies])
          setCurrentHistoryIndex(0)
        }
        if (userData.stoxxoNumber) setStoxxoNumber(userData.stoxxoNumber)
        if (userData.instrument) setInstrument(userData.instrument)
      } else {
        // Start with empty history if no saved data
        setHistory([[]])
        setCurrentHistoryIndex(0)
      }
    } catch (error) {
      console.error("Failed to load user data:", error)
      setHistory([[]])
      setCurrentHistoryIndex(0)
    }
  }

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
          description: `${finalizedNewRows.length} unique configurations added and saved to cloud.`,
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
    // Auto-save to cloud
    saveData({
      strategies: currentStrategyData,
      stoxxoNumber: value,
      instrument,
      timestamp: new Date().toISOString(),
    })
  }

  const handleInstrumentChange = (value: string) => {
    setInstrument(value)
    // Auto-save to cloud
    saveData({
      strategies: currentStrategyData,
      stoxxoNumber,
      instrument: value,
      timestamp: new Date().toISOString(),
    })
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
      const match = strategyTag.match(/PLAN([A-Z])/i)
      if (match && match[1]) {
        planLetterSet.add(match[1].toUpperCase())
      }
    })

    const planLetters = Array.from(planLetterSet).sort().join("")
    const cleanInstrument = instrument
      .replace(/\s+/g, "_")
      .replace(/[^A-Za-z0-9_-]/g, "")
      .toUpperCase()

    const now = new Date()
    const dateStr = now.toISOString().split("T")[0]
    const timeStr = now.toTimeString().split(" ")[0].replace(/:/g, "")

    const filenameParts: string[] = []
    if (stoxxoNumber) filenameParts.push(`STOXXO${stoxxoNumber}`)
    if (cleanInstrument) filenameParts.push(cleanInstrument)
    if (planLetters) filenameParts.push(`PLAN${planLetters}`)
    filenameParts.push(`${dateStr}_${timeStr}`)

    const filename = filenameParts.length > 1 ? filenameParts.join("_") : `STRATEGIES_${dateStr}_${timeStr}`

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

  const handleClearAllData = useCallback(() => {
    updateStrategies([])
    toast({
      title: "Configurations Cleared",
      description: "All configurations have been removed and changes saved to cloud.",
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

  if (showDashboard) {
    return <UserDashboard user={user} onClose={() => setShowDashboard(false)} onLogout={onLogout} />
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 py-6 sm:py-8">
      <main className="container mx-auto px-4">
        <header className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Settings2 className="h-8 w-8 text-sky-600 dark:text-sky-500" />
              <div>
                <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
                  Strategy Configuration Manager
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Real-time strategy management with cloud synchronization
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <RealtimeStatus isConnected={isConnected} lastUpdate={lastUpdate} />
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowDashboard(true)}
                  className="flex items-center space-x-2"
                >
                  <UserIcon className="h-4 w-4" />
                  <span>{user.name}</span>
                </Button>
                <Button variant="ghost" size="sm" onClick={onLogout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </header>

        <StrategyInputForm
          onAddStrategies={handleAddStrategies}
          onStoxxoNumberChange={handleStoxxoNumberChange}
          onInstrumentChange={handleInstrumentChange}
          stoxxoNumber={stoxxoNumber}
          instrument={instrument}
          user={user}
        />

        <Card className="mt-10 shadow-lg">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center space-x-3">
                <TableIcon className="h-6 w-6 text-sky-600 dark:text-sky-500" />
                <div>
                  <CardTitle className="text-xl font-semibold text-slate-800 dark:text-slate-200">
                    Live Configurations
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
                    Real-time synchronized strategy settings
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
                  Export
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
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <StrategyConfigTable headers={memoizedHeaders} dataRows={currentStrategyData} />
          </CardContent>
        </Card>
      </main>

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
    </div>
  )
}
