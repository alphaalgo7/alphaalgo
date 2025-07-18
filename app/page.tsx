"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import AuthModal from "@/components/auth-modal"
import LandingPage from "@/components/landing-page"
import StrategyWorkspace from "@/components/strategy-workspace"
import { type StrategyConfigRow, initialStrategyDataRaw, type GeneratedStrategySet } from "@/lib/types"
import { parseRawStrategyData, convertToCSV } from "@/lib/utils"
import { Toaster } from "@/components/ui/toaster"
import { toast } from "@/hooks/use-toast"

const MAX_HISTORY_LENGTH = 50

interface UserData {
  id: string
  name: string
  email: string
  avatar?: string
  createdAt: string
  lastLogin: string
}

export default function HomePage() {
  const [user, setUser] = useState<UserData | null>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
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
  const [isLoading, setIsLoading] = useState(true)

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
    const initializeApp = async () => {
      try {
        // Check for existing user session
        const savedUser = localStorage.getItem("stoxxo_user")
        if (savedUser) {
          const userData = JSON.parse(savedUser)
          setUser(userData)

          // Verify session with server in background (optional)
          try {
            await verifyUserSession(userData.id)
          } catch (error) {
            console.error("Session verification failed:", error)
            // Don't logout on verification failure, just log the error
          }
        }

        // Initialize strategy headers
        const { headers } = parseRawStrategyData(initialStrategyDataRaw)
        setStrategyHeaders(headers)
        setHistory([[]])
        setCurrentHistoryIndex(0)
      } catch (error) {
        console.error("App initialization failed:", error)
      } finally {
        // Always set loading to false, regardless of success or failure
        setIsLoading(false)
      }
    }

    initializeApp()
  }, [])

  const checkUserSession = async () => {
    try {
      // Check localStorage first for quick load
      const savedUser = localStorage.getItem("stoxxo_user")
      if (savedUser) {
        const userData = JSON.parse(savedUser)
        setUser(userData)

        // Verify session with server in background
        await verifyUserSession(userData.id)
      }
    } catch (error) {
      console.error("Session check failed:", error)
      localStorage.removeItem("stoxxo_user")
    } finally {
      setIsLoading(false)
    }
  }

  const verifyUserSession = async (userId: string) => {
    try {
      const response = await fetch(`/api/auth/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      })

      if (!response.ok) {
        throw new Error("Session expired")
      }

      const userData = await response.json()
      setUser(userData)
      localStorage.setItem("stoxxo_user", JSON.stringify(userData))
    } catch (error) {
      console.error("Session verification failed:", error)
      // Don't clear user data on verification failure since API might not be available
      // Just log the error and continue with cached user data
    }
  }

  const handleLogin = async (userData: UserData) => {
    try {
      // In a real app, this would authenticate with your backend
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        throw new Error("Login failed")
      }

      const authenticatedUser = await response.json()
      setUser(authenticatedUser)
      localStorage.setItem("stoxxo_user", JSON.stringify(authenticatedUser))
      setShowAuthModal(false)

      toast({
        title: "Welcome back!",
        description: `Successfully signed in as ${authenticatedUser.name}`,
      })
    } catch (error) {
      console.error("Login error:", error)
      toast({
        title: "Login Failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      })
    }
  }

  const handleLogout = async () => {
    try {
      if (user) {
        await fetch("/api/auth/logout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id }),
        })
      }
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setUser(null)
      localStorage.removeItem("stoxxo_user")
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      })
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading STOXXO...</p>
        </div>
      </div>
    )
  }

  // Show landing page if user is not authenticated
  if (!user) {
    return (
      <>
        <LandingPage onSignIn={() => setShowAuthModal(true)} />
        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} onLogin={handleLogin} />
        <Toaster />
      </>
    )
  }

  // Show workspace if user is authenticated
  return (
    <>
      <StrategyWorkspace user={user} onLogout={handleLogout} />
      <Toaster />
    </>
  )
}
