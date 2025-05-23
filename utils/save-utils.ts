// This utility helps ensure data is properly saved and provides feedback

type SaveOptions = {
  onSuccess?: (data: any) => void
  onError?: (error: Error) => void
  showToast?: boolean
}

export async function updateMultiLegStrategies(portfolioData: any) {
  try {
    // Get existing strategies
    const existingStrategiesJSON = localStorage.getItem("multi_leg_strategies")
    const strategies = existingStrategiesJSON ? JSON.parse(existingStrategiesJSON) : []

    // Check if this portfolio already exists in strategies
    const existingIndex = strategies.findIndex((s: any) => s.portfolioName.split(" (")[0] === portfolioData.name)

    // Determine the symbol based on the first leg or default to NIFTY
    const symbol = portfolioData.legs[0]?.symbol || "NIFTY"

    // Get the strategy tag - either the first one or a default
    const strategyTag =
      portfolioData.strategyTags && portfolioData.strategyTags.length > 0 ? portfolioData.strategyTags[0] : "DEFAULT"

    // Format the times properly
    const formatTime = (timeObj: any) => {
      return `${timeObj.hours}:${timeObj.minutes}:${timeObj.seconds}`
    }

    // Create strategy object from portfolio data
    const strategyObject = {
      id: existingIndex >= 0 ? strategies[existingIndex].id : Date.now().toString(),
      enabled: existingIndex >= 0 ? strategies[existingIndex].enabled : false,
      status: existingIndex >= 0 ? strategies[existingIndex].status : "Disabled",
      portfolioName: `${portfolioData.name} (${portfolioData.legs.length}L)`,
      product: "MIS",
      symbol: symbol,
      strategyTag: strategyTag,
      startTime: formatTime(portfolioData.startTime),
      endTime: formatTime(portfolioData.endTime),
      sqOffTime: formatTime(portfolioData.sqOffTime),
      pnl: existingIndex >= 0 ? strategies[existingIndex].pnl : "0.00",
      lastUpdated: new Date().toISOString(),
    }

    // Update or add the strategy
    if (existingIndex >= 0) {
      strategies[existingIndex] = strategyObject
    } else {
      strategies.push(strategyObject)
    }

    // Save updated strategies
    localStorage.setItem("multi_leg_strategies", JSON.stringify(strategies))

    return true
  } catch (error) {
    console.error("Error updating multi-leg strategies:", error)
    return false
  }
}

export async function saveData(key: string, data: any, options: SaveOptions = { showToast: true }) {
  try {
    // In a real app, this would be an API call
    // For now, we'll simulate saving to localStorage
    localStorage.setItem(key, JSON.stringify(data))

    // If this is a portfolio save, update the multi-leg strategies
    if (key.startsWith("portfolio_")) {
      await updateMultiLegStrategies(data)
    }

    // Simulate a network delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    if (options.showToast) {
      // Import dynamically to avoid circular dependencies
      const { enhancedToast } = await import("@/components/enhanced-toast")

      enhancedToast({
        title: "Saved Successfully",
        description: `Your ${key} has been saved`,
        variant: "default",
        details: { [key]: typeof data === "object" ? "Updated" : data },
      })
    }

    options.onSuccess?.(data)
    return { success: true, data }
  } catch (error) {
    console.error("Error saving data:", error)

    if (options.showToast) {
      const { enhancedToast } = await import("@/components/enhanced-toast")

      enhancedToast({
        title: "Save Failed",
        description: `Failed to save ${key}. Please try again.`,
        variant: "destructive",
        details: { error: (error as Error).message },
      })
    }

    options.onError?.(error as Error)
    return { success: false, error }
  }
}

export async function loadData(key: string, defaultValue: any = null) {
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : defaultValue
  } catch (error) {
    console.error("Error loading data:", error)
    return defaultValue
  }
}

// Add a new function to save strategies
export async function saveStrategy(strategyData: any) {
  try {
    // Get existing strategies
    const existingStrategiesJSON = localStorage.getItem("strategies")
    const strategies = existingStrategiesJSON ? JSON.parse(existingStrategiesJSON) : []

    // Check if this strategy already exists
    const existingIndex = strategies.findIndex((s: any) => s.name === strategyData.name)

    // Create strategy object
    const strategyObject = {
      id: existingIndex >= 0 ? strategies[existingIndex].id : Date.now(),
      name: strategyData.name,
      maxProfit: strategyData.profitProtection?.profitReachesValue || "0",
      maxLoss: strategyData.lossProtection?.maximumLossValue?.toString() || "0",
      profitLocking: strategyData.profitProtection?.increasingProfitBy
        ? `${strategyData.profitProtection.profitReachesValue}~${strategyData.profitProtection.minimumProfitValue}~${strategyData.profitProtection.increasingProfitBy}~${strategyData.profitProtection.trailProfitBy}`
        : "0~0~0~0",
      tags: strategyData.strategyTags || ["DEFAULT"],
      legs: strategyData.legs || [],
      lotSize: strategyData.lotSize || 75,
      strikeStep: strategyData.strikeStep || 50,
      startTime: strategyData.startTime || { hours: "09", minutes: "20", seconds: "00" },
      endTime: strategyData.endTime || { hours: "15", minutes: "15", seconds: "00" },
      sqOffTime: strategyData.sqOffTime || { hours: "15", minutes: "25", seconds: "00" },
      timestamp: new Date().toISOString(),
    }

    // Update or add the strategy
    if (existingIndex >= 0) {
      strategies[existingIndex] = strategyObject
    } else {
      strategies.push(strategyObject)
    }

    // Save updated strategies
    localStorage.setItem("strategies", JSON.stringify(strategies))

    return { success: true, data: strategyObject }
  } catch (error) {
    console.error("Error saving strategy:", error)
    return { success: false, error }
  }
}

// Add a function to load strategies
export async function loadStrategies() {
  try {
    const strategiesJSON = localStorage.getItem("strategies")
    return strategiesJSON ? JSON.parse(strategiesJSON) : []
  } catch (error) {
    console.error("Error loading strategies:", error)
    return []
  }
}
