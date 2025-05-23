"use client"

import { toast } from "sonner"
import { Check, AlertCircle, Info } from "lucide-react"

// Function to get current time in HH:MM:SS format
function getCurrentTime() {
  const now = new Date()
  const hours = now.getHours().toString().padStart(2, "0")
  const minutes = now.getMinutes().toString().padStart(2, "0")
  const seconds = now.getSeconds().toString().padStart(2, "0")
  return `${hours}:${minutes}:${seconds}`
}

type ToastProps = {
  title?: string
  description?: string
  variant?: "default" | "destructive" | "info"
  duration?: number
  details?: Record<string, any> // For showing what was changed
}

export function enhancedToast({ title, description = "", variant = "default", duration = 5000, details }: ToastProps) {
  const timestamp = getCurrentTime()

  // Format details if provided
  let detailsText = ""
  if (details && Object.keys(details).length > 0) {
    detailsText =
      "\n\nChanges:\n" +
      Object.entries(details)
        .map(([key, value]) => `• ${key}: ${value}`)
        .join("\n")
  }

  // Combine description with details and timestamp
  const messageWithDetails = `${description}${detailsText}\n\n${timestamp}`

  if (variant === "destructive") {
    toast.error(title || "Error", {
      description: messageWithDetails,
      duration: duration,
      icon: <AlertCircle className="h-5 w-5" />,
    })
  } else if (variant === "info") {
    toast.info(title || "Information", {
      description: messageWithDetails,
      duration: duration,
      icon: <Info className="h-5 w-5" />,
    })
  } else {
    toast.success(title || "Success", {
      description: messageWithDetails,
      duration: duration,
      icon: <Check className="h-5 w-5" />,
    })
  }
}
