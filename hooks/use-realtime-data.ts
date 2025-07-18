"use client"

import { useState, useEffect, useCallback, useRef } from "react"

interface RealtimeData {
  strategies?: any[]
  stoxxoNumber?: string
  instrument?: string
  timestamp: string
}

interface UseRealtimeDataReturn {
  isConnected: boolean
  lastUpdate?: string
  saveData: (data: RealtimeData) => Promise<void>
  loadData: () => Promise<RealtimeData | null>
  subscribeToUpdates: (callback: (data: RealtimeData) => void) => void
  unsubscribeFromUpdates: () => void
}

export function useRealtimeData(userId: string): UseRealtimeDataReturn {
  const [isConnected, setIsConnected] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<string>()
  const wsRef = useRef<WebSocket | null>(null)
  const callbackRef = useRef<((data: RealtimeData) => void) | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>()

  const connect = useCallback(() => {
    // Skip WebSocket connection for now and use simulated connection
    // In a real app, you would connect to your actual WebSocket server
    simulateConnection()
  }, [])

  const simulateConnection = useCallback(() => {
    // Simulate connection for demo purposes
    setIsConnected(true)
    console.log("Using simulated real-time connection with localStorage fallback")

    // Simulate periodic connection status updates
    const interval = setInterval(() => {
      setLastUpdate(new Date().toISOString())
    }, 30000) // Update every 30 seconds

    // Store interval reference for cleanup
    if (wsRef.current) {
      clearInterval(wsRef.current as any)
    }
    wsRef.current = interval as any

    return () => {
      clearInterval(interval)
    }
  }, [])

  const saveData = useCallback(
    async (data: RealtimeData) => {
      try {
        // For now, just use localStorage and simulate API calls
        // In a real app, you would save to your backend

        // Simulate API call (optional - can be removed if causing issues)
        try {
          const response = await fetch("/api/strategies/save", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId,
              data,
            }),
          })

          if (response.ok) {
            console.log("Data saved to server successfully")
          }
        } catch (apiError) {
          console.log("Server save failed, using localStorage fallback:", apiError)
        }

        // Always save to localStorage as primary storage for demo
        localStorage.setItem(`stoxxo_data_${userId}`, JSON.stringify(data))
        setLastUpdate(data.timestamp)

        console.log("Data saved to localStorage successfully")
      } catch (error) {
        console.error("Failed to save data:", error)
        // Even if everything fails, try localStorage one more time
        try {
          localStorage.setItem(`stoxxo_data_${userId}`, JSON.stringify(data))
          setLastUpdate(data.timestamp)
        } catch (storageError) {
          console.error("localStorage also failed:", storageError)
        }
      }
    },
    [userId],
  )

  const loadData = useCallback(async (): Promise<RealtimeData | null> => {
    try {
      // Try to load from server first
      const response = await fetch(`/api/strategies/load?userId=${userId}`)
      if (response.ok) {
        const data = await response.json()
        if (data) {
          setLastUpdate(data.timestamp)
          return data
        }
      }
    } catch (error) {
      console.error("Failed to load data from server:", error)
    }

    // Fallback to localStorage
    try {
      const savedData = localStorage.getItem(`stoxxo_data_${userId}`)
      if (savedData) {
        const data = JSON.parse(savedData) as RealtimeData
        setLastUpdate(data.timestamp)
        return data
      }
    } catch (error) {
      console.error("Failed to load data from localStorage:", error)
    }

    return null
  }, [userId])

  const subscribeToUpdates = useCallback((callback: (data: RealtimeData) => void) => {
    callbackRef.current = callback
  }, [])

  const unsubscribeFromUpdates = useCallback(() => {
    callbackRef.current = null
  }, [])

  useEffect(() => {
    connect()

    return () => {
      if (wsRef.current) {
        if (typeof wsRef.current === "number") {
          // It's an interval ID
          clearInterval(wsRef.current)
        } else if (wsRef.current.close) {
          // It's a WebSocket
          wsRef.current.close()
        }
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
    }
  }, [connect])

  return {
    isConnected,
    lastUpdate,
    saveData,
    loadData,
    subscribeToUpdates,
    unsubscribeFromUpdates,
  }
}
