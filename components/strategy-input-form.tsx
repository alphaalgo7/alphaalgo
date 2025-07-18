"use client"

import { Badge } from "@/components/ui/badge"
import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import {
  AlertCircle,
  ClipboardPaste,
  Plus,
  X,
  Sparkles,
  Grid3X3,
  Save,
  Edit3,
  Trash2,
  Check,
  Settings,
} from "lucide-react"
import type { FormInputData, GeneratedStrategySet } from "@/lib/types"
import { generateStrategyRows } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"

interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

interface StrategyInputFormProps {
  onAddStrategies: (newStrategySets: GeneratedStrategySet[]) => void
  onStoxxoNumberChange: (stoxxoNumber: string) => void
  onInstrumentChange: (instrument: string) => void
  stoxxoNumber: string
  instrument: string
  user?: User | null
}

const EXPECTED_COLUMNS = [
  "pseudoAcc",
  "tradingAcc",
  "mainBasket",
  "fiveLBasket",
  "dayMaxProfit",
  "dayMaxLoss",
  "profitReaches",
  "lockMinProfit",
  "increaseProfitBy",
  "trailProfitBy",
]

const PLAN_LETTERS = ["A", "B", "C", "D", "E", "F"]
const STOXXO_NUMBERS = Array.from({ length: 11 }, (_, i) => (i + 1).toString())
const INSTRUMENTS = ["SENSEX1DTE", "SENSEX0DTE", "NIFTY1DTE", "NIFTY0DTE", "SENSEX2DTE"]
const BUYING_OPTIONS = ["S1BUYING", "S2BUYING", "S3BUYING", "N1BUYING", "N2BUYING", "N3BUYING"]

export default function StrategyInputForm({
  onAddStrategies,
  onStoxxoNumberChange,
  onInstrumentChange,
  stoxxoNumber,
  instrument,
  user,
}: StrategyInputFormProps) {
  const [pastedData, setPastedData] = useState<string>("")
  const [planLetter, setPlanLetter] = useState<string>("")
  const [customPlanLetters, setCustomPlanLetters] = useState<string[]>([])
  const [customStoxxoNumbers, setCustomStoxxoNumbers] = useState<string[]>([])
  const [customInstruments, setCustomInstruments] = useState<string[]>([])
  const [showAddPlanModal, setShowAddPlanModal] = useState(false)
  const [showAddStoxxoModal, setShowAddStoxxoModal] = useState(false)
  const [showAddInstrumentModal, setShowAddInstrumentModal] = useState(false)
  const [newItemInput, setNewItemInput] = useState("")
  const [tableData, setTableData] = useState<FormInputData[]>([])
  const [editingRowIndex, setEditingRowIndex] = useState<number | null>(null)
  const [showManualEntryModal, setShowManualEntryModal] = useState(false)

  // Enhanced dropdown options state with more comprehensive data
  const [dropdownOptions, setDropdownOptions] = useState({
    pseudoAcc: ["PSEUDO001", "PSEUDO002", "PSEUDO003", "PSEUDO004", "PSEUDO005", "ALPHA001", "BETA002", "GAMMA003"],
    tradingAcc: ["TRADE001", "TRADE002", "TRADE003", "TRADE004", "TRADE005", "ACC_MAIN", "ACC_BACKUP", "ACC_TEST"],
    mainBasket: ["10000", "25000", "50000", "75000", "100000", "150000", "200000", "250000", "300000", "500000"],
    fiveLBasket: ["550000", "500000", "600000", "750000", "1000000", "1250000", "1500000", "2000000"],
    dayMaxProfit: ["1000", "2000", "3000", "5000", "7500", "10000", "15000", "20000", "25000", "30000"],
    dayMaxLoss: ["500", "1000", "1500", "2000", "3000", "5000", "7500", "10000", "15000"],
    profitReaches: ["500", "750", "1000", "1250", "1500", "2000", "2500", "3000", "4000", "5000"],
    lockMinProfit: ["200", "300", "400", "500", "750", "1000", "1250", "1500", "2000"],
    increaseProfitBy: ["100", "150", "200", "250", "300", "400", "500", "750", "1000"],
    trailProfitBy: ["50", "75", "100", "125", "150", "200", "250", "300", "400", "500"],
  })

  const [editingDropdown, setEditingDropdown] = useState<{
    field: keyof typeof dropdownOptions | null
    newValue: string
  }>({
    field: null,
    newValue: "",
  })

  const [editingCell, setEditingCell] = useState<{
    rowIndex: number
    field: keyof FormInputData
  } | null>(null)

  const handlePasteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPastedData(e.target.value)
  }

  const handlePlanLetterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlanLetter(e.target.value.toUpperCase())
  }

  const handleStoxxoNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onStoxxoNumberChange(e.target.value)
  }

  const handleInstrumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onInstrumentChange(e.target.value)
  }

  const handlePlanLetterButtonClick = (letter: string) => {
    setPlanLetter(letter)
  }

  const handleStoxxoNumberButtonClick = (number: string) => {
    onStoxxoNumberChange(number)
  }

  const handleInstrumentButtonClick = (instrumentName: string) => {
    onInstrumentChange(instrumentName)
  }

  const handleAddPlanLetter = () => {
    if (
      newItemInput.trim() &&
      !PLAN_LETTERS.includes(newItemInput.toUpperCase()) &&
      !customPlanLetters.includes(newItemInput.toUpperCase())
    ) {
      setCustomPlanLetters([...customPlanLetters, newItemInput.toUpperCase()])
      setNewItemInput("")
      setShowAddPlanModal(false)
      toast({
        title: "Plan Letter Added!",
        description: `Plan ${newItemInput.toUpperCase()} has been added successfully.`,
      })
    }
  }

  const handleAddStoxxoNumber = () => {
    if (newItemInput.trim() && !STOXXO_NUMBERS.includes(newItemInput) && !customStoxxoNumbers.includes(newItemInput)) {
      setCustomStoxxoNumbers([...customStoxxoNumbers, newItemInput])
      setNewItemInput("")
      setShowAddStoxxoModal(false)
      toast({
        title: "STOXXO Number Added!",
        description: `STOXXO ${newItemInput} has been added successfully.`,
      })
    }
  }

  const handleAddInstrument = () => {
    if (newItemInput.trim() && !INSTRUMENTS.includes(newItemInput) && !customInstruments.includes(newItemInput)) {
      setCustomInstruments([...customInstruments, newItemInput])
      setNewItemInput("")
      setShowAddInstrumentModal(false)
      toast({
        title: "Instrument Added!",
        description: `${newItemInput} has been added successfully.`,
      })
    }
  }

  const getInstrumentColor = (instrumentName: string, isSelected: boolean) => {
    const colorMap: Record<string, { selected: string; unselected: string }> = {
      SENSEX1DTE: {
        selected: "bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700",
        unselected:
          "border-2 border-purple-200 hover:border-purple-400 hover:bg-purple-50 text-purple-600 hover:text-purple-700",
      },
      SENSEX0DTE: {
        selected: "bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700",
        unselected:
          "border-2 border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50 text-indigo-600 hover:text-indigo-700",
      },
      NIFTY1DTE: {
        selected: "bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-600 hover:to-cyan-700",
        unselected:
          "border-2 border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50 text-emerald-600 hover:text-emerald-700",
      },
      NIFTY0DTE: {
        selected: "bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700",
        unselected:
          "border-2 border-amber-200 hover:border-amber-400 hover:bg-amber-50 text-amber-600 hover:text-amber-700",
      },
      SENSEX2DTE: {
        selected: "bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700",
        unselected: "border-2 border-rose-200 hover:border-rose-400 hover:bg-rose-50 text-rose-600 hover:text-rose-700",
      },
      S1BUYING: {
        selected: "bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700",
        unselected:
          "border-2 border-orange-200 hover:border-orange-400 hover:bg-orange-50 text-orange-600 hover:text-orange-700",
      },
      S2BUYING: {
        selected: "bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700",
        unselected: "border-2 border-red-200 hover:border-red-400 hover:bg-red-50 text-red-600 hover:text-red-700",
      },
      S3BUYING: {
        selected: "bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700",
        unselected: "border-2 border-pink-200 hover:border-pink-400 hover:bg-pink-50 text-pink-600 hover:text-pink-700",
      },
      N1BUYING: {
        selected: "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700",
        unselected:
          "border-2 border-green-200 hover:border-green-400 hover:bg-green-50 text-green-600 hover:text-green-700",
      },
      N2BUYING: {
        selected: "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700",
        unselected:
          "border-2 border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50 text-emerald-600 hover:text-emerald-700",
      },
      N3BUYING: {
        selected: "bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700",
        unselected: "border-2 border-teal-200 hover:border-teal-400 hover:bg-teal-50 text-teal-600 hover:text-teal-700",
      },
    }

    // Default color for custom instruments
    const defaultColor = {
      selected: "bg-gradient-to-r from-slate-500 to-gray-600 hover:from-slate-600 hover:to-gray-700",
      unselected:
        "border-2 border-slate-200 hover:border-slate-400 hover:bg-slate-50 text-slate-600 hover:text-slate-700",
    }

    const colors = colorMap[instrumentName] || defaultColor
    return isSelected ? colors.selected : colors.unselected
  }

  const addNewRow = () => {
    const newRow: FormInputData = {
      pseudoAcc: "",
      tradingAcc: "",
      mainBasket: "",
      fiveLBasket: "",
      dayMaxProfit: "",
      dayMaxLoss: "",
      profitReaches: "",
      lockMinProfit: "",
      increaseProfitBy: "",
      trailProfitBy: "",
    }
    setTableData([...tableData, newRow])
    setEditingRowIndex(tableData.length)
  }

  const deleteRow = (index: number) => {
    const newData = tableData.filter((_, i) => i !== index)
    setTableData(newData)
    setEditingRowIndex(null)
    toast({
      title: "Entry Deleted",
      description: "The entry has been removed successfully.",
    })
  }

  const duplicateRow = (index: number) => {
    const rowToDuplicate = { ...tableData[index] }
    const newData = [...tableData]
    newData.splice(index + 1, 0, rowToDuplicate)
    setTableData(newData)
    toast({
      title: "Entry Duplicated",
      description: "The entry has been duplicated successfully.",
    })
  }

  const updateRowData = (index: number, field: keyof FormInputData, value: string) => {
    const newData = [...tableData]
    newData[index] = { ...newData[index], [field]: value }
    setTableData(newData)
  }

  const saveRow = (index: number) => {
    setEditingRowIndex(null)
    toast({
      title: "Entry Saved",
      description: "Changes have been saved successfully.",
    })
  }

  const editRow = (index: number) => {
    setEditingRowIndex(index)
  }

  const convertTableToPasteData = () => {
    const headers = [
      "Pseudo Acc",
      "Trading Acc",
      "MAIN BASKET",
      "5.5L BASKET",
      "DAY MAX PROFIT",
      "Day Max loss",
      "Profit Reaches",
      "Lock Min Profit",
      "Increase Profit By",
      "Trail Profit By",
    ]
    const rows = tableData.map((row) => [
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

    const pasteText = [headers.join("\t"), ...rows.map((row) => row.join("\t"))].join("\n")
    setPastedData(pasteText)

    toast({
      title: "Table Data Converted!",
      description: "Table data has been converted to paste format below.",
    })
  }

  const addDropdownOption = (field: keyof typeof dropdownOptions, value: string) => {
    if (value.trim() && !dropdownOptions[field].includes(value.trim())) {
      setDropdownOptions({
        ...dropdownOptions,
        [field]: [...dropdownOptions[field], value.trim()],
      })
      toast({
        title: "Option Added!",
        description: `"${value.trim()}" has been added to ${field} options.`,
      })
    }
    setEditingDropdown({ field: null, newValue: "" })
  }

  const removeDropdownOption = (field: keyof typeof dropdownOptions, value: string) => {
    setDropdownOptions({
      ...dropdownOptions,
      [field]: dropdownOptions[field].filter((option) => option !== value),
    })
    toast({
      title: "Option Removed!",
      description: `"${value}" has been removed from ${field} options.`,
    })
  }

  const processPastedData = () => {
    if (!planLetter.trim()) {
      toast({
        title: "Plan Letter Required",
        description: "Please enter a Plan Letter (e.g., A, B, C).",
        variant: "destructive",
        icon: <AlertCircle className="h-5 w-5 text-red-500" />,
      })
      return
    }

    const lines = pastedData.trim().split("\n")
    const allNewStrategySets: GeneratedStrategySet[] = []
    let processedCount = 0
    let skippedLines = 0

    lines.forEach((line, index) => {
      const values = line.split("\t").map((v) => v.trim())

      if (values.length < 2 || !values[1] || !values[2]) {
        if (line.trim() !== "") skippedLines++
        return
      }
      if (index === 0 && (values[0].toLowerCase().includes("pseudo") || values[1].toLowerCase().includes("trading"))) {
        skippedLines++
        return
      }
      if (values.length < EXPECTED_COLUMNS.length && values.length > 2) {
        while (values.length < EXPECTED_COLUMNS.length) {
          values.push("")
        }
      } else if (values.length < 2) {
        skippedLines++
        return
      }

      const formData: FormInputData = {
        pseudoAcc: values[0] || "",
        tradingAcc: values[1] || "",
        mainBasket: (values[2] || "").replace(/\.00$/, ""),
        fiveLBasket: values[3] || "",
        dayMaxProfit: values[4] === "-" ? "0" : values[4] || "0",
        dayMaxLoss: values[5] || "0",
        profitReaches: values[6] || "0",
        lockMinProfit: values[7] || "0",
        increaseProfitBy: values[8] || "0",
        trailProfitBy: values[9] || "0",
      }

      if (!formData.tradingAcc || !formData.mainBasket) {
        if (line.trim() !== "") skippedLines++
        return
      }
      if (formData.mainBasket && !/^\d+$/.test(formData.mainBasket)) {
        const parsedBasket = Number.parseInt(formData.mainBasket, 10)
        if (!isNaN(parsedBasket)) {
          formData.mainBasket = String(parsedBasket)
        } else {
          skippedLines++
          return
        }
      }

      try {
        const strategySet = generateStrategyRows(formData, planLetter)
        allNewStrategySets.push(strategySet)
        processedCount++
      } catch (error) {
        console.error("Error generating strategies for line:", line, error)
        skippedLines++
      }
    })

    if (allNewStrategySets.length > 0) {
      onAddStrategies(allNewStrategySets)
      const totalGeneratedRows = allNewStrategySets.reduce((sum, set) => sum + set.generatedRows.length, 0)
      toast({
        title: "Strategies Processed!",
        description: `${processedCount} entries for Plan ${planLetter} generated ${totalGeneratedRows} configurations. ${skippedLines > 0 ? `${skippedLines} lines skipped.` : ""}`,
      })
    } else if (skippedLines > 0 && processedCount === 0) {
      toast({
        title: "No Strategies Processed",
        description: `All ${skippedLines} lines were skipped. Check data and Plan Letter.`,
        variant: "destructive",
      })
    } else {
      toast({
        title: "No Data Processed",
        description: `Pasted data was empty or invalid for Plan ${planLetter}.`,
        variant: "destructive",
      })
    }
    setPastedData("")
  }

  const renderAdvancedDropdownWithEdit = (
    field: keyof typeof dropdownOptions,
    value: string,
    onChange: (value: string) => void,
    rowIndex: number,
  ) => {
    const isEditing = editingCell?.rowIndex === rowIndex && editingCell?.field === field

    if (isEditing) {
      return (
        <div className="relative group">
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full h-12 text-sm border-2 border-blue-400 rounded-lg px-4 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 pr-12 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-md"
            autoFocus
          >
            <option value="">Select {field}...</option>
            {dropdownOptions[field].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <div className="absolute right-1 top-1 flex gap-1">
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="h-10 w-10 p-0 hover:bg-green-100 dark:hover:bg-green-900 text-green-600"
              onClick={() => setEditingCell(null)}
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="h-10 w-10 p-0 hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-600"
              onClick={() => setEditingDropdown({ field, newValue: "" })}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )
    }

    return (
      <div className="relative group cursor-pointer" onClick={() => setEditingCell({ rowIndex, field })}>
        <div className="w-full h-12 flex items-center px-4 bg-slate-50 dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-600 transition-all group-hover:shadow-md">
          <span className="text-slate-700 dark:text-slate-300 font-medium flex-1">
            {value || <span className="text-slate-400 dark:text-slate-500 italic">Click to select...</span>}
          </span>
          <Edit3 className="h-4 w-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
    )
  }

  const saveTableData = () => {
    if (tableData.length === 0) {
      toast({
        title: "No Data to Save",
        description: "Please add some entries before saving.",
        variant: "destructive",
      })
      return
    }

    // Simulate saving to user's workspace
    if (user) {
      toast({
        title: "Data Saved!",
        description: `${tableData.length} entries saved to your workspace.`,
      })
    } else {
      toast({
        title: "Sign In Required",
        description: "Please sign in to save your work to the cloud.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="shadow-lg bg-white dark:bg-slate-900 border-0 ring-1 ring-slate-200 dark:ring-slate-800">
      <CardHeader className="bg-gradient-to-r from-sky-50 to-purple-50 dark:from-sky-950 dark:to-purple-950 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-sky-100 dark:bg-sky-900 rounded-lg">
            <ClipboardPaste className="h-6 w-6 text-sky-600 dark:text-sky-400" />
          </div>
          <div>
            <CardTitle className="text-xl font-semibold text-slate-800 dark:text-slate-100">
              Strategy Configuration Builder
            </CardTitle>
            <CardDescription className="text-sm text-slate-600 dark:text-slate-400">
              Create and manage trading strategies with advanced data entry tools
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Plan Letter Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Label htmlFor="planLetter" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Plan Letter
              </Label>
              <span className="text-red-500 text-sm">*</span>
            </div>
            <Input
              id="planLetter"
              name="planLetter"
              value={planLetter}
              onChange={handlePlanLetterChange}
              placeholder="e.g., A"
              maxLength={10}
              className="h-12 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            />
            <div className="flex flex-wrap gap-2">
              {[...PLAN_LETTERS, ...customPlanLetters].map((letter) => (
                <Button
                  key={letter}
                  variant={planLetter === letter ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePlanLetterButtonClick(letter)}
                  className={`h-10 px-4 text-sm font-semibold transition-all duration-200 ${
                    planLetter === letter
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg scale-105"
                      : "border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-50 text-blue-600 hover:text-blue-700 hover:scale-105"
                  } rounded-lg`}
                >
                  {letter}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAddPlanModal(true)}
                className="h-10 px-4 text-sm font-semibold border-2 border-dashed border-blue-300 hover:border-blue-500 hover:bg-blue-50 text-blue-500 hover:text-blue-700 rounded-lg transition-all duration-200 hover:scale-105"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
          </div>

          {/* STOXXO Number Section */}
          <div className="space-y-4">
            <Label htmlFor="stoxxoNumber" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              STOXXO Number
            </Label>
            <Input
              id="stoxxoNumber"
              name="stoxxoNumber"
              value={stoxxoNumber}
              onChange={handleStoxxoNumberChange}
              placeholder="e.g., 12345"
              className="h-12 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            />
            <div className="flex flex-wrap gap-2">
              {[...STOXXO_NUMBERS, ...customStoxxoNumbers].map((number) => (
                <Button
                  key={number}
                  variant={stoxxoNumber === number ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleStoxxoNumberButtonClick(number)}
                  className={`h-10 px-4 text-sm font-semibold transition-all duration-200 ${
                    stoxxoNumber === number
                      ? "bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white shadow-lg scale-105"
                      : "border-2 border-green-200 hover:border-green-400 hover:bg-green-50 text-green-600 hover:text-green-700 hover:scale-105"
                  } rounded-lg`}
                >
                  {number}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAddStoxxoModal(true)}
                className="h-10 px-4 text-sm font-semibold border-2 border-dashed border-green-300 hover:border-green-500 hover:bg-green-50 text-green-500 hover:text-green-700 rounded-lg transition-all duration-200 hover:scale-105"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
          </div>

          {/* Instrument Section */}
          <div className="space-y-4">
            <Label htmlFor="instrument" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Instrument
            </Label>
            <Input
              id="instrument"
              name="instrument"
              value={instrument}
              onChange={handleInstrumentChange}
              placeholder="e.g., SENSEX 0DTE"
              className="h-12 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            />
            <div className="flex flex-wrap gap-2">
              {[...INSTRUMENTS, ...customInstruments].map((instrumentName) => (
                <Button
                  key={instrumentName}
                  variant={instrument === instrumentName ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleInstrumentButtonClick(instrumentName)}
                  className={`h-10 px-3 text-xs font-semibold transition-all duration-200 ${
                    instrument === instrumentName
                      ? getInstrumentColor(instrumentName, true) + " text-white shadow-lg scale-105"
                      : getInstrumentColor(instrumentName, false) + " hover:scale-105"
                  } rounded-lg whitespace-nowrap`}
                >
                  {instrumentName}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAddInstrumentModal(true)}
                className="h-10 px-3 text-xs font-semibold border-2 border-dashed border-orange-300 hover:border-orange-500 hover:bg-orange-50 text-orange-500 hover:text-orange-700 rounded-lg transition-all duration-200 hover:scale-105"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
            {/* Buying Options */}
            <div className="mt-4">
              <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">
                Buying Options
              </Label>
              <div className="flex flex-wrap gap-2">
                {BUYING_OPTIONS.map((buyingOption) => (
                  <Button
                    key={buyingOption}
                    variant={instrument === buyingOption ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleInstrumentButtonClick(buyingOption)}
                    className={`h-10 px-3 text-xs font-semibold transition-all duration-200 ${
                      instrument === buyingOption
                        ? getInstrumentColor(buyingOption, true) + " text-white shadow-lg scale-105"
                        : getInstrumentColor(buyingOption, false) + " hover:scale-105"
                    } rounded-lg whitespace-nowrap`}
                  >
                    {buyingOption}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Manual Data Entry Button */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 p-6 rounded-xl border border-purple-200 dark:border-purple-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <Grid3X3 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <Label className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                    Advanced Data Entry Studio
                  </Label>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Professional spreadsheet-like interface with smart dropdowns and data validation
                  </p>
                </div>
              </div>
              <Button
                onClick={() => setShowManualEntryModal(true)}
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                disabled={!planLetter.trim()}
              >
                <Sparkles className="h-5 w-5 mr-2" />
                Open Studio for Plan {planLetter || "..."}
              </Button>
            </div>
            {!planLetter.trim() && (
              <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
                <p className="text-sm text-amber-700 dark:text-amber-300 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Please select a Plan Letter first to enable the advanced data entry studio.
                </p>
              </div>
            )}
          </div>

          {/* Paste Data Section */}
          <div className="space-y-4">
            <Label htmlFor="pastedData" className="text-lg font-semibold text-slate-700 dark:text-slate-300">
              Bulk Data Import
            </Label>
            <Textarea
              id="pastedData"
              placeholder={`Pseudo Acc	Trading Acc	MAIN BASKET	5.5L BASKET	DAY MAX PROFIT	...`}
              value={pastedData}
              onChange={handlePasteChange}
              rows={8}
              className="text-sm border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 font-mono"
            />
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Each row: Pseudo Acc, Trading Acc, MAIN BASKET, 5.5L BASKET, DAY MAX PROFIT, Day Max loss, Profit Reaches,
              Lock Min Profit, Increase Profit By, Trail Profit By.
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
        <Button
          onClick={processPastedData}
          disabled={!pastedData.trim() || !planLetter.trim()}
          size="lg"
          className="w-full bg-gradient-to-r from-sky-600 to-purple-600 hover:from-sky-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02]"
        >
          <ClipboardPaste className="h-5 w-5 mr-2" />
          Process Data for Plan {planLetter || "..."}
        </Button>
      </CardFooter>

      {/* Enhanced Full-Screen Manual Data Entry Modal */}
      {showManualEntryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-2">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-[98vw] h-[98vh] overflow-hidden flex flex-col border border-slate-200 dark:border-slate-800">
            {/* Enhanced Header */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-white bg-opacity-20 rounded-xl">
                    <Grid3X3 className="h-8 w-8" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold">Data Entry Studio</h2>
                    <p className="text-purple-100 mt-1">Plan {planLetter} • Advanced Configuration Builder</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {user && (
                    <Button
                      onClick={saveTableData}
                      variant="secondary"
                      className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white border-white border-opacity-30"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save to Cloud
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setShowManualEntryModal(false)
                      setEditingRowIndex(null)
                      setEditingCell(null)
                    }}
                    className="text-white hover:bg-white hover:bg-opacity-20"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Enhanced Content Area */}
            <div className="flex-1 overflow-hidden flex flex-col">
              {/* Toolbar */}
              <div className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      Build your strategy configurations with intelligent dropdowns and real-time validation
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge
                      variant="secondary"
                      className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                    >
                      {tableData.length} entries
                    </Badge>
                    <Button onClick={addNewRow} className="bg-green-600 hover:bg-green-700 text-white shadow-md">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Entry
                    </Button>
                  </div>
                </div>
              </div>

              {/* Enhanced Table Container */}
              <div className="flex-1 overflow-auto p-6">
                {tableData.length > 0 ? (
                  <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700">
                          <tr>
                            {[
                              "Pseudo Account",
                              "Trading Account",
                              "Main Basket",
                              "5.5L Basket",
                              "Max Profit",
                              "Max Loss",
                              "Profit Reaches",
                              "Lock Min Profit",
                              "Increase Profit By",
                              "Trail Profit By",
                              "Actions",
                            ].map((header) => (
                              <th
                                key={header}
                                className="px-6 py-4 text-left font-semibold text-slate-700 dark:text-slate-300 border-r border-slate-200 dark:border-slate-600 last:border-r-0 min-w-[180px]"
                              >
                                {header}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                          {tableData.map((row, index) => (
                            <tr
                              key={index}
                              className={`hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${
                                editingRowIndex === index ? "bg-blue-50 dark:bg-blue-950" : ""
                              }`}
                            >
                              {Object.keys(dropdownOptions).map((field) => (
                                <td
                                  key={field}
                                  className="px-6 py-4 border-r border-slate-200 dark:border-slate-600 last:border-r-0"
                                >
                                  {renderAdvancedDropdownWithEdit(
                                    field as keyof typeof dropdownOptions,
                                    row[field as keyof FormInputData],
                                    (value) => updateRowData(index, field as keyof FormInputData, value),
                                    index,
                                  )}
                                </td>
                              ))}
                              <td className="px-6 py-4">
                                <div className="flex items-center space-x-2">
                                  <Button
                                    onClick={() => duplicateRow(index)}
                                    size="sm"
                                    variant="outline"
                                    className="border-blue-300 text-blue-600 hover:bg-blue-50"
                                  >
                                    <Settings className="h-4 w-4 mr-1" />
                                    Duplicate
                                  </Button>
                                  <Button
                                    onClick={() => deleteRow(index)}
                                    size="sm"
                                    variant="outline"
                                    className="border-red-300 text-red-600 hover:bg-red-50"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="p-8 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 rounded-2xl border-2 border-dashed border-purple-300 dark:border-purple-700">
                      <Grid3X3 className="h-16 w-16 text-purple-400 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">
                        Ready to Build Strategies
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md">
                        Start creating your Plan {planLetter} configurations with our intelligent data entry system
                      </p>
                      <Button
                        onClick={addNewRow}
                        size="lg"
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg"
                      >
                        <Plus className="h-5 w-5 mr-2" />
                        Create First Entry
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Enhanced Footer */}
              {tableData.length > 0 && (
                <div className="bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Badge
                        variant="secondary"
                        className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                      >
                        {tableData.length} entries configured
                      </Badge>
                      <Button
                        onClick={convertTableToPasteData}
                        variant="outline"
                        className="border-blue-300 text-blue-600 hover:bg-blue-50 bg-transparent"
                      >
                        Convert to Paste Format
                      </Button>
                    </div>
                    <Button
                      onClick={() => {
                        setShowManualEntryModal(false)
                        setEditingRowIndex(null)
                        setEditingCell(null)
                      }}
                      size="lg"
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg"
                    >
                      Done & Close Studio
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Dropdown Edit Modal */}
      {editingDropdown.field && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-2xl max-w-lg w-full mx-4 border border-slate-200 dark:border-slate-700">
            <h3 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-100">
              Manage {editingDropdown.field} Options
            </h3>
            <div className="mb-6">
              <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 block">
                Current Options:
              </Label>
              <div className="flex flex-wrap gap-2 mb-4 max-h-40 overflow-y-auto p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                {dropdownOptions[editingDropdown.field].map((option) => (
                  <div
                    key={option}
                    className="flex items-center gap-2 bg-white dark:bg-slate-700 px-3 py-2 rounded-lg text-sm shadow-sm border border-slate-200 dark:border-slate-600"
                  >
                    <span className="text-slate-700 dark:text-slate-300">{option}</span>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="h-5 w-5 p-0 hover:bg-red-100 text-red-500 hover:text-red-600"
                      onClick={() => removeDropdownOption(editingDropdown.field!, option)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">Add New Option:</Label>
              <Input
                value={editingDropdown.newValue}
                onChange={(e) => setEditingDropdown({ ...editingDropdown, newValue: e.target.value })}
                placeholder={`Enter new ${editingDropdown.field} value`}
                className="h-12"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    addDropdownOption(editingDropdown.field!, editingDropdown.newValue)
                  }
                }}
              />
            </div>
            <div className="flex gap-3 justify-end mt-8">
              <Button variant="outline" onClick={() => setEditingDropdown({ field: null, newValue: "" })}>
                Cancel
              </Button>
              <Button
                onClick={() => addDropdownOption(editingDropdown.field!, editingDropdown.newValue)}
                disabled={!editingDropdown.newValue.trim()}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Option
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Other Enhanced Modals */}
      {showAddPlanModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-100">Add New Plan Letter</h3>
            <Input
              value={newItemInput}
              onChange={(e) => setNewItemInput(e.target.value.toUpperCase())}
              placeholder="Enter plan letter (e.g., G, H, I)"
              className="mb-6 h-12"
              maxLength={10}
            />
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddPlanModal(false)
                  setNewItemInput("")
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddPlanLetter}
                disabled={!newItemInput.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Add Plan
              </Button>
            </div>
          </div>
        </div>
      )}

      {showAddStoxxoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-100">Add New STOXXO Number</h3>
            <Input
              value={newItemInput}
              onChange={(e) => setNewItemInput(e.target.value)}
              placeholder="Enter STOXXO number (e.g., 12, 13, 14)"
              className="mb-6 h-12"
            />
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddStoxxoModal(false)
                  setNewItemInput("")
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddStoxxoNumber}
                disabled={!newItemInput.trim()}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Add Number
              </Button>
            </div>
          </div>
        </div>
      )}

      {showAddInstrumentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-100">Add New Instrument</h3>
            <Input
              value={newItemInput}
              onChange={(e) => setNewItemInput(e.target.value.toUpperCase())}
              placeholder="Enter instrument name (e.g., BANKNIFTY0DTE)"
              className="mb-6 h-12"
            />
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddInstrumentModal(false)
                  setNewItemInput("")
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddInstrument}
                disabled={!newItemInput.trim()}
                className="bg-orange-600 hover:bg-orange-700 text-white"
              >
                Add Instrument
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}
