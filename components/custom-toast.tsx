"use client"

import { toast } from "sonner"

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
  variant?: "default" | "destructive"
  duration?: number
}

export function customToast({ title, description = "", variant = "default", duration = 5000 }: ToastProps) {
  const timestamp = getCurrentTime()

  // Simple description with timestamp
  const messageWithTimestamp = `${description}\n\n${timestamp}`

  if (variant === "destructive") {
    toast.error(title || "Error", {
      description: messageWithTimestamp,
      duration: duration,
    })
  } else {
    toast.success(title || "Success", {
      description: messageWithTimestamp,
      duration: duration,
    })
  }
}
