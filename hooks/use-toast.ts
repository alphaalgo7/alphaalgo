"use client"

import { toast as sonnerToast } from "sonner"

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

function toast({ title, description = "", variant = "default", duration = 5000 }: ToastProps) {
  // Add timestamp to description
  const timestamp = getCurrentTime()
  const descriptionWithTime = `${description}\n\n${timestamp}`

  if (variant === "destructive") {
    return sonnerToast.error(title || "Error", {
      description: descriptionWithTime,
      duration: duration,
      className: "toast-with-timestamp",
      style: {
        whiteSpace: "pre-line", // This ensures the newlines are respected
      },
    })
  } else {
    return sonnerToast.success(title || "Success", {
      description: descriptionWithTime,
      duration: duration,
      className: "toast-with-timestamp",
      style: {
        whiteSpace: "pre-line", // This ensures the newlines are respected
      },
    })
  }
}

function useToast() {
  return {
    toast,
  }
}

export { useToast, toast }
