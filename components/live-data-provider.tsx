"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import LiveDataService, { type LiveTickData, type OptionChainData } from "@/lib/live-data-service"

interface LiveDataContextType {
  isConnected: boolean
  tickData: LiveTickData | null
  optionChain: OptionChainData[]
  straddlePremium: number
  connect: (accessToken: string) => Promise<void>
  disconnect: () => void
}

const LiveDataContext = createContext<LiveDataContextType | undefined>(undefined)

export function useLiveData() {
  const context = useContext(LiveDataContext)
  if (context === undefined) {
    throw new Error("useLiveData must be used within a LiveDataProvider")
  }
  return context
}

interface LiveDataProviderProps {
  children: ReactNode
}

export function LiveDataProvider({ children }: LiveDataProviderProps) {
  const [liveDataService] = useState(() => {
    try {
      return new LiveDataService()
    } catch (error) {
      console.warn("Failed to initialize LiveDataService:", error)
      return null
    }
  })
  const [isConnected, setIsConnected] = useState(false)
  const [tickData, setTickData] = useState<LiveTickData | null>(null)
  const [optionChain, setOptionChain] = useState<OptionChainData[]>([])
  const [straddlePremium, setStraddlePremium] = useState(0)

  const connect = async (accessToken: string) => {
    if (!liveDataService) {
      console.error("LiveDataService not available")
      return
    }

    try {
      await liveDataService.initialize(accessToken)

      // Subscribe to tick data updates
      liveDataService.subscribe((data: LiveTickData) => {
        setTickData(data)
      })

      // Fetch initial option chain data
      const optionData = await liveDataService.getNiftyATMOptions()
      setOptionChain(optionData)

      // Calculate initial straddle premium
      if (optionData.length > 0) {
        const atmStrike = optionData[Math.floor(optionData.length / 2)]?.strike || 0
        const premium = liveDataService.calculateStraddlePremium(optionData, atmStrike)
        setStraddlePremium(premium)
      }

      setIsConnected(true)
    } catch (error) {
      console.error("Failed to connect to live data:", error)
      throw error
    }
  }

  const disconnect = () => {
    if (liveDataService) {
      liveDataService.disconnect()
    }
    setIsConnected(false)
    setTickData(null)
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect()
    }
  }, [])

  const value: LiveDataContextType = {
    isConnected,
    tickData,
    optionChain,
    straddlePremium,
    connect,
    disconnect,
  }

  return <LiveDataContext.Provider value={value}>{children}</LiveDataContext.Provider>
}
