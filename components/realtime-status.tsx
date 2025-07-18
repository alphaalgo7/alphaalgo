"use client"

import { Badge } from "@/components/ui/badge"
import { Wifi, WifiOff, Clock } from "lucide-react"

interface RealtimeStatusProps {
  isConnected: boolean
  lastUpdate?: string
}

export default function RealtimeStatus({ isConnected, lastUpdate }: RealtimeStatusProps) {
  const formatLastUpdate = (timestamp?: string) => {
    if (!timestamp) return "Never"

    const now = new Date()
    const updateTime = new Date(timestamp)
    const diffMs = now.getTime() - updateTime.getTime()
    const diffSeconds = Math.floor(diffMs / 1000)
    const diffMinutes = Math.floor(diffSeconds / 60)

    if (diffSeconds < 60) {
      return `${diffSeconds}s ago`
    } else if (diffMinutes < 60) {
      return `${diffMinutes}m ago`
    } else {
      return updateTime.toLocaleTimeString()
    }
  }

  return (
    <div className="flex items-center space-x-2">
      <Badge
        variant={isConnected ? "default" : "destructive"}
        className={`flex items-center space-x-1 ${
          isConnected
            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
        }`}
      >
        {isConnected ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
        <span>{isConnected ? "Live" : "Offline"}</span>
      </Badge>
      {lastUpdate && (
        <Badge variant="secondary" className="flex items-center space-x-1 text-xs">
          <Clock className="h-3 w-3" />
          <span>{formatLastUpdate(lastUpdate)}</span>
        </Badge>
      )}
    </div>
  )
}
