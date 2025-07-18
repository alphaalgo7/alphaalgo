import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { StrategyConfigRow, FormInputData, GeneratedStrategySet } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function parseRawStrategyData(rawData: string): {
  headers: string[]
  rows: StrategyConfigRow[]
} {
  const lines = rawData.trim().split("\n")
  const headers: string[] = []
  const rows: StrategyConfigRow[] = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()

    // Skip empty lines and comments
    if (!line || line.startsWith("#")) {
      continue
    }

    const values = line.split("\t")

    // First non-comment line is headers
    if (headers.length === 0) {
      headers.push(...values)
      continue
    }

    // Create row object
    const row: StrategyConfigRow = {
      Enabled: "",
      StrategyTag: "",
      "No Duplicate Signals for Seconds": "",
      "Start Time": "",
      "End Time": "",
      "SqOff Time": "",
      "User Account": "",
      "Unique ID Req for Order": "",
      "Entry Order Retry": "",
      "Entry Retry Count": "",
      "Entry Retry Wait (Seconds)": "",
      "Entry Max Wait (Seconds)": "",
      "Exit Order Retry": "",
      "Exit Retry Count": "",
      "Exit Retry Wait (Seconds)": "",
      "Exit Max Wait (Seconds)": "",
      "Cancel Previous Open Signal": "",
      "Stop & Reverse": "",
      "Part / Multi Exits": "",
      "Hold Sell Seconds": "",
      "Allowed Trades": "",
      "Max Loss Wait Seconds": "",
      "Max Profit": "",
      "Max Loss": "",
      "Profit Locking": "",
      "Delay Between Users": "",
      "LIMIT Only": "",
      "LIMIT Type": "",
      "LIMIT Spread": "",
      MaxModifications: "",
      LimitModificationGapTime: "",
    }

    // Map values to headers
    headers.forEach((header, index) => {
      if (values[index] !== undefined) {
        row[header as keyof StrategyConfigRow] = values[index]
      }
    })

    rows.push(row)
  }

  return { headers, rows }
}

export function convertToCSV(headers: string[], rows: StrategyConfigRow[]): string {
  const csvHeaders = headers.join(",")
  const csvRows = rows.map((row) =>
    headers
      .map((header) => {
        const value = row[header] || ""
        // Escape values that contain commas, quotes, or newlines
        if (value.includes(",") || value.includes('"') || value.includes("\n")) {
          return `"${value.replace(/"/g, '""')}"`
        }
        return value
      })
      .join(","),
  )

  return [csvHeaders, ...csvRows].join("\n")
}

export function generateStrategyRows(formData: FormInputData, planLetter: string): GeneratedStrategySet {
  // This is a simplified version - you may need to adjust based on your business logic
  const generatedRows: StrategyConfigRow[] = []

  // Create a basic strategy row based on form data
  const baseRow: StrategyConfigRow = {
    Enabled: "TRUE",
    StrategyTag: `PLAN${planLetter}${formData.mainBasket}`,
    "No Duplicate Signals for Seconds": "0",
    "Start Time": "00:00:00",
    "End Time": "00:00:00",
    "SqOff Time": "00:00:00",
    "User Account": formData.tradingAcc,
    "Unique ID Req for Order": "FALSE",
    "Entry Order Retry": "TRUE",
    "Entry Retry Count": "40",
    "Entry Retry Wait (Seconds)": "15",
    "Entry Max Wait (Seconds)": "600",
    "Exit Order Retry": "TRUE",
    "Exit Retry Count": "40",
    "Exit Retry Wait (Seconds)": "15",
    "Exit Max Wait (Seconds)": "600",
    "Cancel Previous Open Signal": "FALSE",
    "Stop & Reverse": "FALSE",
    "Part / Multi Exits": "FALSE",
    "Hold Sell Seconds": "0",
    "Allowed Trades": "BOTH",
    "Max Loss Wait Seconds": "0",
    "Max Profit": formData.dayMaxProfit,
    "Max Loss": formData.dayMaxLoss,
    "Profit Locking": `${formData.profitReaches}~${formData.lockMinProfit}~${formData.increaseProfitBy}~${formData.trailProfitBy}`,
    "Delay Between Users": "0",
    "LIMIT Only": "FALSE",
    "LIMIT Type": "BidAsk",
    "LIMIT Spread": "0",
    MaxModifications: "0",
    LimitModificationGapTime: "0",
    "Pseudo Acc": formData.pseudoAcc,
  }

  generatedRows.push(baseRow)

  return {
    generatedRows,
    sourcePseudoAcc: formData.pseudoAcc,
  }
}
