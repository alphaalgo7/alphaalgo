import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { FormInputData, GeneratedStrategyRow, GeneratedStrategySet, StrategyConfigRow } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Updated generateStrategyRows to return GeneratedStrategySet
export function generateStrategyRows(formData: FormInputData, planLetter: string): GeneratedStrategySet {
  const {
    pseudoAcc, // We need this for the return type
    tradingAcc,
    mainBasket,
    dayMaxProfit,
    dayMaxLoss,
    profitReaches,
    lockMinProfit,
    increaseProfitBy,
    trailProfitBy,
  } = formData

  const userAccount = `${tradingAcc}=${mainBasket}`
  const profitLocking = [
    cleanNumericString(profitReaches),
    cleanNumericString(lockMinProfit),
    cleanNumericString(increaseProfitBy),
    cleanNumericString(trailProfitBy),
  ].join("~")

  const baseRow = {
    Enabled: "TRUE",
    "No Duplicate Signals for Seconds": "0",
    "Start Time": "00:00:00",
    "End Time": "00:00:00",
    "SqOff Time": "00:00:00",
    "User Account": userAccount,
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
    "Max Profit": cleanNumericString(dayMaxProfit),
    "Max Loss": cleanNumericString(dayMaxLoss),
    "Profit Locking": profitLocking,
    "Delay Between Users": "0",
    "LIMIT Only": "FALSE",
    "LIMIT Type": "BidAsk",
    "LIMIT Spread": "0",
    MaxModifications: "0",
    LimitModificationGapTime: "0",
  }

  const rows: StrategyConfigRow[] = []
  const upperPlanLetter = planLetter.toUpperCase()

  rows.push({
    ...baseRow,
    StrategyTag: `PLAN${upperPlanLetter}${mainBasket}B`,
  })
  rows.push({
    ...baseRow,
    StrategyTag: `PLAN${upperPlanLetter}${mainBasket}BDUMMY`,
  })

  return { generatedRows: rows, sourcePseudoAcc: pseudoAcc }
}

export function parseRawStrategyData(rawData: string): { headers: string[]; dataRows: StrategyConfigRow[] } {
  const lines = rawData.trim().split("\n")
  const relevantLines = lines.filter((line) => !line.startsWith("#") && line.trim() !== "")

  if (relevantLines.length === 0) {
    return { headers: [], dataRows: [] }
  }

  const headerLine = relevantLines[0]
  const parsedHeaders = headerLine.split("\t").map((h) => h.trim())

  const parsedDataRows: StrategyConfigRow[] = []
  for (let i = 1; i < relevantLines.length; i++) {
    const values = relevantLines[i].split("\t")
    const row: StrategyConfigRow = {} as StrategyConfigRow
    parsedHeaders.forEach((header, index) => {
      row[header] = values[index] !== undefined ? values[index].trim() : ""
    })
    parsedDataRows.push(row)
  }
  return { headers: parsedHeaders, dataRows: parsedDataRows }
}

const cleanNumericString = (value: string) => {
  // Remove commas and clean the value
  const cleaned = (value || "").replace(/,/g, "") || "0"
  // Remove .00 from the end if present
  return cleaned.replace(/\.00$/, "")
}

export function convertToCSV(headers: string[], data: StrategyConfigRow[]): string {
  // Helper function to escape CSV values
  const escapeCSVValue = (value: string): string => {
    // Convert to string and handle null/undefined
    const stringValue = (value || "").toString()

    // If the value contains comma, newline, or double quote, wrap in quotes and escape internal quotes
    if (stringValue.includes(",") || stringValue.includes("\n") || stringValue.includes('"')) {
      return `"${stringValue.replace(/"/g, '""')}"`
    }

    return stringValue
  }

  // Process data to clean StrategyTag values and Profit Locking values
  const processedData = data.map((row) => {
    // Create a new object to avoid mutating the original
    const newRow = { ...row }

    // Clean only the StrategyTag field
    if (newRow.StrategyTag) {
      newRow.StrategyTag = newRow.StrategyTag.replace(/[^A-Za-z0-9-]/g, "")
    }

    // Clean Profit Locking field to remove .00
    if (newRow["Profit Locking"]) {
      newRow["Profit Locking"] = newRow["Profit Locking"].replace(/\.00/g, "")
    }

    return newRow
  })

  // Properly format headers with CSV escaping
  const headerString = headers.map((header) => escapeCSVValue(header)).join(",")

  // Format data rows with CSV escaping
  const rowsString = processedData
    .map((row) => headers.map((header) => escapeCSVValue(row[header] || "")).join(","))
    .join("\n")

  return `${headerString}\n${rowsString}`
}

export function exportToCSV(data: GeneratedStrategyRow[], stoxxoNumber: string, instrument: string): string {
  const headers = [
    "Plan Letter",
    "STOXXO Number",
    "Instrument",
    "Strategy Type",
    "Pseudo Acc",
    "Trading Acc",
    "Main Basket",
    "5.5L Basket",
    "Day Max Profit",
    "Day Max Loss",
    "Profit Reaches",
    "Lock Min Profit",
    "Increase Profit By",
    "Trail Profit By",
  ]

  const rows = data.map((row) => [
    row.planLetter,
    stoxxoNumber,
    instrument,
    row.strategyType,
    row.pseudoAcc,
    row.tradingAcc,
    row.mainBasket,
    row.fiveLBasket,
    row.dayMaxProfit,
    row.dayMaxLoss,
    row.profitReaches,
    row.lockMinProfit,
    row.increaseProfitBy,
    row.trailProfitBy,
  ])

  return [headers, ...rows].map((row) => row.join(",")).join("\n")
}
