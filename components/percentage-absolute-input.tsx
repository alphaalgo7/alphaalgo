"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ChevronUp, ChevronDown, Info } from "lucide-react"

interface PercentageAbsoluteInputProps {
  initialValue: string
  livePrice: number
  onChange?: (value: string) => void
  className?: string
}

export function PercentageAbsoluteInput({
  initialValue = "10%",
  livePrice = 100,
  onChange,
  className = "",
}: PercentageAbsoluteInputProps) {
  const [value, setValue] = useState(initialValue)
  const [isPercentage, setIsPercentage] = useState(initialValue.includes("%"))
  const [showInfoBox, setShowInfoBox] = useState(false)

  // Parse the numeric value from the input
  const parseValue = (val: string): number => {
    const numericValue = Number.parseFloat(val.replace("%", ""))
    return isNaN(numericValue) ? 0 : numericValue
  }

  // Calculate the absolute and percentage equivalents
  const calculateEquivalents = (val: string) => {
    const numericValue = parseValue(val)

    if (val.includes("%")) {
      // If percentage, calculate absolute value
      return {
        percentage: `${numericValue}%`,
        absolute: ((numericValue / 100) * livePrice).toFixed(2),
      }
    } else {
      // If absolute, calculate percentage
      return {
        percentage: `${((numericValue / livePrice) * 100).toFixed(2)}%`,
        absolute: numericValue.toString(),
      }
    }
  }

  const equivalents = calculateEquivalents(value)

  // Handle increment/decrement
  const handleIncrement = () => {
    const numericValue = parseValue(value)
    if (isPercentage) {
      setValue(`${numericValue + 1}%`)
    } else {
      setValue(`${numericValue + 1}`)
    }
  }

  const handleDecrement = () => {
    const numericValue = parseValue(value)
    if (isPercentage) {
      setValue(`${Math.max(0, numericValue - 1)}%`)
    } else {
      setValue(`${Math.max(0, numericValue - 1)}`)
    }
  }

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setValue(newValue)

    // Detect if the input is a percentage or absolute value
    const newIsPercentage = newValue.includes("%")
    setIsPercentage(newIsPercentage)

    if (onChange) {
      onChange(newValue)
    }
  }

  // Notify parent component when value changes
  useEffect(() => {
    if (onChange) {
      onChange(value)
    }
  }, [value, onChange])

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center">
        <div className="relative flex-1">
          <input
            type="text"
            value={value}
            onChange={handleChange}
            className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onFocus={() => setShowInfoBox(true)}
            onBlur={() => setTimeout(() => setShowInfoBox(false), 200)}
          />
          <div className="absolute inset-y-0 right-0 flex flex-col pr-3">
            <button
              type="button"
              onClick={handleIncrement}
              className="flex-1 flex items-center justify-center text-gray-500 hover:text-gray-700"
            >
              <ChevronUp className="h-3 w-3" />
            </button>
            <button
              type="button"
              onClick={handleDecrement}
              className="flex-1 flex items-center justify-center text-gray-500 hover:text-gray-700"
            >
              <ChevronDown className="h-3 w-3" />
            </button>
          </div>
        </div>
        <button
          type="button"
          className="ml-2 text-gray-500 hover:text-blue-500"
          onClick={() => setShowInfoBox(!showInfoBox)}
        >
          <Info className="h-5 w-5" />
        </button>
      </div>

      {showInfoBox && (
        <div className="absolute mt-1 p-2 bg-white border border-gray-200 rounded-md shadow-md z-10 w-full">
          <div className="text-xs text-gray-600">
            <div className="flex justify-between mb-1">
              <span>Absolute:</span>
              <span className="font-medium">{equivalents.absolute}</span>
            </div>
            <div className="flex justify-between">
              <span>Percentage:</span>
              <span className="font-medium">{equivalents.percentage}</span>
            </div>
            <div className="mt-1 text-gray-400 text-[10px]">Based on live price: {livePrice}</div>
          </div>
        </div>
      )}
    </div>
  )
}
