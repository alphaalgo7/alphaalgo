"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { ChevronUp, ChevronDown } from "lucide-react"

interface TimeInputProps {
  initialTime?: { hours: string; minutes: string; seconds: string }
  onChange?: (time: { hours: string; minutes: string; seconds: string }) => void
  className?: string
}

export function TimeInput({
  initialTime = { hours: "09", minutes: "30", seconds: "00" },
  onChange,
  className = "",
}: TimeInputProps) {
  const [time, setTime] = useState(initialTime)
  const [activeField, setActiveField] = useState<"hours" | "minutes" | "seconds">("hours")

  const hoursRef = useRef<HTMLInputElement>(null)
  const minutesRef = useRef<HTMLInputElement>(null)
  const secondsRef = useRef<HTMLInputElement>(null)

  // Format a number to always have 2 digits
  const formatTwoDigits = (value: number): string => {
    return value.toString().padStart(2, "0")
  }

  // Handle increment/decrement for the active field
  const handleIncrement = () => {
    const newTime = { ...time }

    if (activeField === "hours") {
      let hours = Number.parseInt(time.hours, 10)
      hours = (hours + 1) % 24
      newTime.hours = formatTwoDigits(hours)
    } else if (activeField === "minutes") {
      let minutes = Number.parseInt(time.minutes, 10)
      minutes = (minutes + 1) % 60
      newTime.minutes = formatTwoDigits(minutes)
    } else if (activeField === "seconds") {
      let seconds = Number.parseInt(time.seconds, 10)
      seconds = (seconds + 1) % 60
      newTime.seconds = formatTwoDigits(seconds)
    }

    setTime(newTime)
    if (onChange) onChange(newTime)
  }

  const handleDecrement = () => {
    const newTime = { ...time }

    if (activeField === "hours") {
      let hours = Number.parseInt(time.hours, 10)
      hours = (hours - 1 + 24) % 24
      newTime.hours = formatTwoDigits(hours)
    } else if (activeField === "minutes") {
      let minutes = Number.parseInt(time.minutes, 10)
      minutes = (minutes - 1 + 60) % 60
      newTime.minutes = formatTwoDigits(minutes)
    } else if (activeField === "seconds") {
      let seconds = Number.parseInt(time.seconds, 10)
      seconds = (seconds - 1 + 60) % 60
      newTime.seconds = formatTwoDigits(seconds)
    }

    setTime(newTime)
    if (onChange) onChange(newTime)
  }

  // Handle direct input for each field
  const handleInputChange = (field: "hours" | "minutes" | "seconds", value: string) => {
    // Only allow numeric input
    if (!/^\d*$/.test(value)) return

    const numValue = value === "" ? 0 : Number.parseInt(value, 10)
    const newTime = { ...time }

    if (field === "hours") {
      if (numValue >= 0 && numValue < 24) {
        newTime.hours = formatTwoDigits(numValue)
      }
    } else if (field === "minutes" || field === "seconds") {
      if (numValue >= 0 && numValue < 60) {
        newTime[field] = formatTwoDigits(numValue)
      }
    }

    setTime(newTime)
    if (onChange) onChange(newTime)
  }

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent, field: "hours" | "minutes" | "seconds") => {
    setActiveField(field)

    if (e.key === "ArrowUp") {
      e.preventDefault()
      handleIncrement()
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      handleDecrement()
    } else if (e.key === "ArrowRight" && field !== "seconds") {
      e.preventDefault()
      if (field === "hours" && minutesRef.current) {
        minutesRef.current.focus()
      } else if (field === "minutes" && secondsRef.current) {
        secondsRef.current.focus()
      }
    } else if (e.key === "ArrowLeft" && field !== "hours") {
      e.preventDefault()
      if (field === "seconds" && minutesRef.current) {
        minutesRef.current.focus()
      } else if (field === "minutes" && hoursRef.current) {
        hoursRef.current.focus()
      }
    }
  }

  // Focus the input when the active field changes
  useEffect(() => {
    if (activeField === "hours" && hoursRef.current) {
      hoursRef.current.focus()
    } else if (activeField === "minutes" && minutesRef.current) {
      minutesRef.current.focus()
    } else if (activeField === "seconds" && secondsRef.current) {
      secondsRef.current.focus()
    }
  }, [activeField])

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center">
        <div className="flex-1 flex items-center bg-white border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
          {/* Hours */}
          <div className="flex-1 relative">
            <input
              ref={hoursRef}
              type="text"
              value={time.hours}
              onChange={(e) => handleInputChange("hours", e.target.value)}
              onFocus={() => setActiveField("hours")}
              onKeyDown={(e) => handleKeyDown(e, "hours")}
              className="w-full h-10 px-2 text-center border-0 focus:outline-none"
              maxLength={2}
              aria-label="Hours"
            />
          </div>

          <span className="text-gray-500">:</span>

          {/* Minutes */}
          <div className="flex-1 relative">
            <input
              ref={minutesRef}
              type="text"
              value={time.minutes}
              onChange={(e) => handleInputChange("minutes", e.target.value)}
              onFocus={() => setActiveField("minutes")}
              onKeyDown={(e) => handleKeyDown(e, "minutes")}
              className="w-full h-10 px-2 text-center border-0 focus:outline-none"
              maxLength={2}
              aria-label="Minutes"
            />
          </div>

          <span className="text-gray-500">:</span>

          {/* Seconds */}
          <div className="flex-1 relative">
            <input
              ref={secondsRef}
              type="text"
              value={time.seconds}
              onChange={(e) => handleInputChange("seconds", e.target.value)}
              onFocus={() => setActiveField("seconds")}
              onKeyDown={(e) => handleKeyDown(e, "seconds")}
              className="w-full h-10 px-2 text-center border-0 focus:outline-none"
              maxLength={2}
              aria-label="Seconds"
            />
          </div>
        </div>

        {/* Up/Down buttons - moved outside to affect only the active field */}
        <div className="flex flex-col ml-1">
          <button
            type="button"
            onClick={handleIncrement}
            className="flex items-center justify-center p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-t-md border border-gray-300"
            aria-label="Increment"
          >
            <ChevronUp className="h-3 w-3" />
          </button>
          <button
            type="button"
            onClick={handleDecrement}
            className="flex items-center justify-center p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-b-md border border-gray-300 border-t-0"
            aria-label="Decrement"
          >
            <ChevronDown className="h-3 w-3" />
          </button>
        </div>
      </div>
      <div className="text-xs text-gray-500 mt-1">
        Active: {activeField.charAt(0).toUpperCase() + activeField.slice(1)}
      </div>
    </div>
  )
}
