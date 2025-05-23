"use client"

import * as React from "react"
import { Check, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card, CardContent } from "@/components/ui/card"

const instruments = [
  { value: "nifty", label: "NIFTY 50" },
  { value: "banknifty", label: "BANK NIFTY" },
  { value: "finnifty", label: "FIN NIFTY" },
  { value: "sensex", label: "SENSEX" },
  { value: "midcpnifty", label: "MIDCAP NIFTY" },
  { value: "niftyit", label: "NIFTY IT" },
]

interface InstrumentSelectorProps {
  onSelect?: (value: string) => void
  defaultValue?: string
  className?: string
}

export function InstrumentSelector({ onSelect, defaultValue = "nifty", className }: InstrumentSelectorProps) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState(defaultValue)

  const handleSelect = (currentValue: string) => {
    setValue(currentValue)
    setOpen(false)
    if (onSelect) {
      onSelect(currentValue)
    }
  }

  const selectedInstrument = instruments.find((instrument) => instrument.value === value)

  return (
    <Card className={cn("border-0 shadow-sm", className)}>
      <CardContent className="p-3">
        <div className="flex flex-col">
          <span className="text-xs text-slate-400 mb-1">Instrument</span>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="justify-between bg-slate-50 border-slate-200 h-9"
              >
                {selectedInstrument ? selectedInstrument.label : "Select instrument..."}
                <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder="Search instrument..." />
                <CommandList>
                  <CommandEmpty>No instrument found.</CommandEmpty>
                  <CommandGroup>
                    {instruments.map((instrument) => (
                      <CommandItem key={instrument.value} value={instrument.value} onSelect={handleSelect}>
                        <Check
                          className={cn("mr-2 h-4 w-4", value === instrument.value ? "opacity-100" : "opacity-0")}
                        />
                        {instrument.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </CardContent>
    </Card>
  )
}
