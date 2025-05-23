"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ChevronUp, ChevronDown, ToggleLeft, ToggleRight } from "lucide-react"

interface QuantityInputProps {
  initialValue?: string
  availableMargin: number
  numberOfLegs: number
  perLotCost: number
  onChange?: (value: string, calculatedQuantity: number) => void
  className?: string
}

export function QuantityInput({
  initialValue = "100",
  availableMargin = 100000,
  numberOfLegs = 2,
  perLotCost = 500,
  onChange,
  className = "",
}: QuantityInputProps) {
  const [value, setValue] = useState(initialValue)
  const [isPercentage, setIsPercentage] = useState(initialValue.includes("%"))
  const [calculatedQuantity, setCalculatedQuantity] = useState(0)

  // Parse the numeric value from the input
  const parseValue = (val: string): number => {
    const numericValue = Number.parseFloat(val.replace("%", ""))
    return isNaN(numericValue) ? 0 : numericValue
  }

  // Calculate quantity based on input
  const calculateQuantity = (val: string) => {
    const numericValue = parseValue(val)

    if (val.includes("%")) {
      // Margin-based calculation
      return Math.floor((availableMargin * (numericValue / 100)) / numberOfLegs / perLotCost)
    } else {
      // Absolute quantity
      return numericValue
    }
  }

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

    // Detect if the input is a percentage
    const newIsPercentage = newValue.includes("%")
    setIsPercentage(newIsPercentage)
  }

  // Toggle between percentage and absolute
  const toggleMode = () => {
    const numericValue = parseValue(value)

    if (isPercentage) {
      // Convert percentage to absolute
      setValue(String(Math.floor((availableMargin * (numericValue / 100)) / numberOfLegs / perLotCost)))
    } else {
      // Convert absolute to percentage
      const percentage = ((numericValue * numberOfLegs * perLotCost) / availableMargin) * 100
      setValue(`${percentage.toFixed(2)}%`)
    }

    setIsPercentage(!isPercentage)
  }

  // Update calculated quantity when value changes
  useEffect(() => {
    const quantity = calculateQuantity(value)
    setCalculatedQuantity(quantity)

    if (onChange) {
      onChange(value, quantity)
    }
  }, [value, availableMargin, numberOfLegs, perLotCost, onChange])

  return (
    <div className={`${className}`}>
      <div className="flex items-center mb-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={value}
            onChange={handleChange}
            className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
          onClick={toggleMode}
          className="ml-2 text-gray-500 hover:text-blue-500"
          title={isPercentage ? "Switch to absolute" : "Switch to percentage"}
        >
          {isPercentage ? <ToggleRight className="h-6 w-6" /> : <ToggleLeft className="h-6 w-6" />}
        </button>
      </div>

      <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
        <div className="text-sm">
          <div className="flex justify-between mb-1">
            <span className="text-gray-600">Mode:</span>
            <span className="font-medium">{isPercentage ? "Margin %" : "Absolute"}</span>
          </div>
          <div className="flex justify-between mb-1">
            <span className="text-gray-600">Calculated Quantity:</span>
            <span className="font-medium">{calculatedQuantity}</span>
          </div>
          <div className="flex justify-between mb-1">
            <span className="text-gray-600">Per Leg:</span>
            <span className="font-medium">{Math.floor(calculatedQuantity / numberOfLegs)}</span>
          </div>
          {isPercentage && (
            <div className="flex justify-between">
              <span className="text-gray-600">Margin Used:</span>
              <span className="font-medium">
                ₹{(calculatedQuantity * perLotCost).toLocaleString()}({parseValue(value)}%)
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
