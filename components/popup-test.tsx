"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ExecutionParameters } from "./execution-parameters"
import { TargetSettings } from "./target-settings"
import { StoplossSettings } from "./stoploss-settings"
import { TimeInput } from "./time-input"
import { QuantityInput } from "./quantity-input"
import { CustomFunctionBuilder } from "./custom-function-builder"
import { X, Code } from "lucide-react"
import { motion } from "framer-motion"

export function PopupTest() {
  const [popups, setPopups] = useState<
    Array<{
      id: string
      title: string
      content: React.ReactNode
      position: { x: number; y: number }
      size: { width: number | string; height: number | string }
    }>
  >([])

  // State for time settings
  const [timeValue, setTimeValue] = useState({ hours: "09", minutes: "30", seconds: "00" })

  // State for quantity input
  const [quantityValue, setQuantityValue] = useState("100")
  const [isPercentageMode, setIsPercentageMode] = useState(false)
  const [calculatedQuantity, setCalculatedQuantity] = useState(100)

  const openPopup = (id: string, title: string, content: React.ReactNode, width = 400, height = "auto") => {
    // Check if popup already exists
    const existingPopupIndex = popups.findIndex((popup) => popup.id === id)

    if (existingPopupIndex >= 0) {
      // If it exists, just update it (this prevents multiple instances of the same popup)
      const updatedPopups = [...popups]
      updatedPopups[existingPopupIndex] = {
        ...updatedPopups[existingPopupIndex],
        content,
      }
      setPopups(updatedPopups)
    } else {
      // If it doesn't exist, add it
      setPopups([
        ...popups,
        {
          id,
          title,
          content,
          position: { x: 0, y: 0 },
          size: { width, height },
        },
      ])
    }
  }

  const closePopup = (id: string) => {
    setPopups(popups.filter((popup) => popup.id !== id))
  }

  const updatePopupPosition = (id: string, position: { x: number; y: number }) => {
    setPopups(popups.map((popup) => (popup.id === id ? { ...popup, position } : popup)))
  }

  // Strike Selection Content
  const StrikeSelectionContent = () => (
    <div className="p-4 space-y-4">
      <div className="grid grid-cols-2 gap-2">
        <Button variant="outline" className="justify-start">
          CE
        </Button>
        <Button variant="outline" className="justify-start">
          PE
        </Button>
      </div>

      <div className="h-60 overflow-y-auto border rounded-md">
        <div className="grid grid-cols-1 divide-y">
          {Array.from({ length: 20 }, (_, i) => 18000 + i * 100).map((strike) => (
            <button
              key={strike}
              className="p-2 text-left hover:bg-gray-100 w-full"
              onClick={() => {
                console.log(`Selected strike: ${strike}`)
                closePopup("strike")
              }}
            >
              {strike}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Custom Strike</Label>
        <div className="flex gap-2">
          <Input placeholder="Enter strike price" className="h-8 text-xs" />
          <Button size="sm" className="h-8">
            Apply
          </Button>
        </div>
      </div>
    </div>
  )

  // Time Settings Content
  const TimeSettingsContent = () => (
    <div className="p-4 space-y-4">
      <div className="space-y-2">
        <Label className="text-sm font-medium">Entry Time</Label>
        <TimeInput value={timeValue} onChange={setTimeValue} />
        <div className="flex justify-between mt-2">
          <Button variant="outline" size="sm" className="text-xs">
            09:15:00
          </Button>
          <Button variant="outline" size="sm" className="text-xs">
            09:30:00
          </Button>
          <Button variant="outline" size="sm" className="text-xs">
            10:00:00
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Exit Time</Label>
        <TimeInput value={{ hours: "15", minutes: "15", seconds: "00" }} onChange={() => {}} />
        <div className="flex justify-between mt-2">
          <Button variant="outline" size="sm" className="text-xs">
            15:15:00
          </Button>
          <Button variant="outline" size="sm" className="text-xs">
            15:20:00
          </Button>
          <Button variant="outline" size="sm" className="text-xs">
            15:25:00
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Square Off Time</Label>
        <TimeInput value={{ hours: "15", minutes: "25", seconds: "00" }} onChange={() => {}} />
        <div className="flex justify-between mt-2">
          <Button variant="outline" size="sm" className="text-xs">
            15:25:00
          </Button>
          <Button variant="outline" size="sm" className="text-xs">
            15:30:00
          </Button>
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-2">
        <Button variant="outline" onClick={() => closePopup("time")}>
          Cancel
        </Button>
        <Button onClick={() => closePopup("time")}>Apply</Button>
      </div>
    </div>
  )

  // Payoff Chart Content
  const PayoffChartContent = () => (
    <div className="p-4 h-full flex flex-col">
      <div className="flex justify-between mb-4">
        <div>
          <span className="font-medium">Max Profit:</span> ₹15,000
        </div>
        <div>
          <span className="font-medium">Max Loss:</span> ₹8,500
        </div>
        <div>
          <span className="font-medium">Breakeven:</span> 16,250
        </div>
      </div>

      <svg width="100%" height="100%" viewBox="0 0 500 300">
        {/* X and Y axes */}
        <line x1="50" y1="250" x2="450" y2="250" stroke="black" />
        <line x1="50" y1="50" x2="50" y2="250" stroke="black" />

        {/* X-axis labels */}
        <text x="250" y="280" textAnchor="middle">
          Price
        </text>
        {[18000, 18500, 19000, 19500, 20000].map((price, i) => (
          <React.Fragment key={price}>
            <line x1={50 + i * 100} y1="250" x2={50 + i * 100} y2="255" stroke="black" />
            <text x={50 + i * 100} y="270" textAnchor="middle" fontSize="10">
              {price}
            </text>
          </React.Fragment>
        ))}

        {/* Y-axis labels */}
        <text x="30" y="30" textAnchor="middle">
          P/L
        </text>
        {[-1000, -500, 0, 500, 1000].map((pl, i) => (
          <React.Fragment key={pl}>
            <line x1="45" y1={250 - i * 50} x2="50" y2={250 - i * 50} stroke="black" />
            <text x="35" y={250 - i * 50 + 5} textAnchor="end" fontSize="10">
              {pl}
            </text>
          </React.Fragment>
        ))}

        {/* Zero line */}
        <line x1="50" y1="150" x2="450" y2="150" stroke="gray" strokeDasharray="5,5" />

        {/* Example payoff curve for a call option */}
        <path d="M50,150 L250,150 L450,50" fill="none" stroke="blue" strokeWidth="2" />

        {/* Example payoff curve for a put option */}
        <path d="M50,50 L250,150 L450,150" fill="none" stroke="red" strokeWidth="2" />

        {/* Combined payoff */}
        <path d="M50,100 C150,120 350,180 450,100" fill="none" stroke="green" strokeWidth="3" />
      </svg>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-medium">Price Range</Label>
          <div className="flex gap-2 mt-1">
            <Input placeholder="Min" className="h-8 text-xs" defaultValue="18000" />
            <Input placeholder="Max" className="h-8 text-xs" defaultValue="20000" />
          </div>
        </div>
        <div>
          <Label className="text-sm font-medium">View</Label>
          <Select defaultValue="combined">
            <SelectTrigger className="h-8 mt-1">
              <SelectValue placeholder="Select view" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="combined">Combined</SelectItem>
              <SelectItem value="individual">Individual Legs</SelectItem>
              <SelectItem value="greeks">Greeks</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )

  // Execution Settings Content
  const ExecutionSettingsContent = () => (
    <div className="p-4">
      <Tabs defaultValue="execution">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="execution">Execution</TabsTrigger>
          <TabsTrigger value="target">Target</TabsTrigger>
          <TabsTrigger value="stoploss">Stoploss</TabsTrigger>
        </TabsList>
        <TabsContent value="execution">
          <ExecutionParameters />
        </TabsContent>
        <TabsContent value="target">
          <TargetSettings />
        </TabsContent>
        <TabsContent value="stoploss">
          <StoplossSettings />
        </TabsContent>
      </Tabs>
    </div>
  )

  // Quantity Input Content
  const QuantityInputContent = () => (
    <div className="p-4 space-y-4">
      <div className="space-y-2">
        <Label className="text-sm font-medium">Quantity</Label>
        <QuantityInput
          value={quantityValue}
          onChange={setQuantityValue}
          isPercentageMode={isPercentageMode}
          setIsPercentageMode={setIsPercentageMode}
          calculatedQuantity={calculatedQuantity}
          setCalculatedQuantity={setCalculatedQuantity}
        />
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Lot Size</Label>
        <Input type="number" defaultValue="75" className="h-9" />
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Max Lots</Label>
        <Input type="number" defaultValue="10" className="h-9" />
      </div>

      <div className="flex justify-end space-x-2 pt-2">
        <Button variant="outline" onClick={() => closePopup("quantity")}>
          Cancel
        </Button>
        <Button onClick={() => closePopup("quantity")}>Apply</Button>
      </div>
    </div>
  )

  // Portfolio Settings Content
  const PortfolioSettingsContent = () => (
    <div className="p-4 space-y-4">
      <div className="space-y-2">
        <Label className="text-sm font-medium">Portfolio Name</Label>
        <Input placeholder="Enter portfolio name" />
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Strategy Tags</Label>
        <div className="flex flex-wrap gap-2">
          {["DEFAULT", "INTRADAY", "POSITIONAL"].map((tag) => (
            <div key={tag} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs flex items-center">
              {tag}
              <button className="ml-1 text-blue-500 hover:text-blue-700">×</button>
            </div>
          ))}
          <button className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">+ Add</button>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Remarks</Label>
        <textarea className="w-full h-20 border rounded-md p-2 text-sm bg-slate-50 border-slate-200"></textarea>
      </div>

      <div className="flex justify-end space-x-2 pt-2">
        <Button variant="outline" onClick={() => closePopup("portfolio")}>
          Cancel
        </Button>
        <Button onClick={() => closePopup("portfolio")}>Save Portfolio</Button>
      </div>
    </div>
  )

  // Function Builder Content
  const FunctionBuilderContent = () => (
    <div className="p-4">
      <CustomFunctionBuilder />
    </div>
  )

  return (
    <div className="p-4 space-y-4">
      <div className="flex flex-wrap gap-4">
        <Button onClick={() => openPopup("strike", "Strike Selection", <StrikeSelectionContent />)}>
          Open Strike Selection
        </Button>
        <Button onClick={() => openPopup("time", "Time Settings", <TimeSettingsContent />)}>Open Time Settings</Button>
        <Button onClick={() => openPopup("payoff", "Payoff Chart", <PayoffChartContent />, 600, 400)}>
          Open Payoff Chart
        </Button>
        <Button onClick={() => openPopup("execution", "Execution Settings", <ExecutionSettingsContent />, 600)}>
          Open Execution Settings
        </Button>
        <Button onClick={() => openPopup("quantity", "Quantity Input", <QuantityInputContent />)}>
          Open Quantity Input
        </Button>
        <Button onClick={() => openPopup("portfolio", "Portfolio Settings", <PortfolioSettingsContent />, 500)}>
          Open Portfolio Settings
        </Button>
        <Button
          onClick={() => openPopup("function", "Custom Function Builder", <FunctionBuilderContent />, 800, 600)}
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          <Code className="h-4 w-4 mr-2" /> Open Function Builder
        </Button>
      </div>

      {/* Render all popups */}
      {popups.map((popup) => (
        <DraggablePopup
          key={popup.id}
          title={popup.title}
          position={popup.position}
          size={popup.size}
          onClose={() => closePopup(popup.id)}
          onPositionChange={(position) => updatePopupPosition(popup.id, position)}
        >
          {popup.content}
        </DraggablePopup>
      ))}
    </div>
  )
}

// Draggable Popup Component
interface DraggablePopupProps {
  title: string
  children: React.ReactNode
  position: { x: number; y: number }
  size: { width: number | string; height: number | string }
  onClose: () => void
  onPositionChange: (position: { x: number; y: number }) => void
}

function DraggablePopup({ title, children, position, size, onClose, onPositionChange }: DraggablePopupProps) {
  const [isDragging, setIsDragging] = useState(false)
  const popupRef = React.useRef<HTMLDivElement>(null)

  // Handle z-index for multiple popups
  React.useEffect(() => {
    const handlePopupClick = (e: MouseEvent) => {
      if (popupRef.current && popupRef.current.contains(e.target as Node)) {
        // When a popup is clicked, bring it to the front
        const allPopups = document.querySelectorAll(".draggable-popup")
        allPopups.forEach((popup) => {
          ;(popup as HTMLElement).style.zIndex = "100"
        })
        popupRef.current.style.zIndex = "101"
      }
    }

    document.addEventListener("mousedown", handlePopupClick)
    return () => document.removeEventListener("mousedown", handlePopupClick)
  }, [])

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none">
      <motion.div
        ref={popupRef}
        className="absolute bg-white rounded-lg shadow-xl border border-gray-200 pointer-events-auto draggable-popup"
        style={{
          width: size.width,
          height: size.height,
          maxWidth: "95vw",
          maxHeight: "95vh",
          top: 100,
          left: 100,
          x: position.x,
          y: position.y,
        }}
        drag
        dragMomentum={false}
        dragElastic={0}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={(_, info) => {
          onPositionChange({
            x: position.x + info.offset.x,
            y: position.y + info.offset.y,
          })
          setIsDragging(false)
        }}
      >
        <div className="flex flex-col h-full">
          <div className="p-3 cursor-move border-b bg-gradient-to-r from-blue-600 to-blue-700 text-white flex items-center justify-between">
            <h3 className="font-medium">{title}</h3>
            <button
              className="h-6 w-6 rounded-full flex items-center justify-center text-white hover:bg-blue-600"
              onClick={onClose}
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Close</span>
            </button>
          </div>
          <div className={`overflow-auto flex-1 ${isDragging ? "pointer-events-none" : "pointer-events-auto"}`}>
            {children}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
