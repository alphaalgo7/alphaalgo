"use client"

import { Card, CardContent } from "@/components/ui/card"
import { InstrumentSelector } from "@/components/instrument-selector"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight } from "lucide-react"

export function InstrumentCard() {
  const handleInstrumentChange = (value: string) => {
    console.log("Selected instrument:", value)
    // Here you would typically update state or fetch data based on the selected instrument
  }

  return (
    <Card className="bg-gradient-to-r from-slate-900 to-slate-800 text-white border-0 overflow-hidden">
      <CardContent className="p-3 flex items-center gap-3 relative z-10">
        <InstrumentSelector
          onSelect={handleInstrumentChange}
          defaultValue="nifty"
          className="bg-transparent border-0 shadow-none flex-1"
        />
        <div className="flex flex-col">
          <span className="text-xl font-bold">24,314.00</span>
          <Badge className="bg-green-500 hover:bg-green-600 self-start">
            <ArrowUpRight className="h-3 w-3 mr-1" />
            +1.2%
          </Badge>
        </div>
      </CardContent>
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-blue-500" />
    </Card>
  )
}
