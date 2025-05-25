"use client"

import * as React from "react"
import { X } from "lucide-react"
import { motion } from "framer-motion"

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"

interface DraggablePopoverProps {
  trigger: React.ReactNode
  title?: string
  children: React.ReactNode
  className?: string
  align?: "center" | "start" | "end"
  side?: "top" | "right" | "bottom" | "left"
  sideOffset?: number
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function DraggablePopover({
  trigger,
  title,
  children,
  className,
  align = "center",
  side = "bottom",
  sideOffset = 4,
  open,
  onOpenChange,
}: DraggablePopoverProps) {
  const [position, setPosition] = React.useState({ x: 0, y: 0 })
  const [isOpen, setIsOpen] = React.useState(false)
  const constraintsRef = React.useRef(null)

  // Handle controlled/uncontrolled state
  const isControlled = open !== undefined
  const isPopoverOpen = isControlled ? open : isOpen

  const handleOpenChange = (newOpen: boolean) => {
    if (!isControlled) {
      setIsOpen(newOpen)
    }
    onOpenChange?.(newOpen)

    // Reset position when popover opens
    if (newOpen) {
      setPosition({ x: 0, y: 0 })
    }
  }

  return (
    <Popover open={isPopoverOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent
        className={`p-0 border-0 shadow-xl overflow-hidden z-50 ${className}`}
        align={align}
        side={side}
        sideOffset={sideOffset}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <motion.div
          ref={constraintsRef}
          className="w-full h-full flex flex-col rounded-lg border bg-background"
          drag
          dragConstraints={{ left: -500, right: 500, top: -500, bottom: 500 }}
          dragElastic={0.05}
          dragMomentum={false}
          dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
          style={{ x: position.x, y: position.y }}
          onDragEnd={(_, info) => {
            setPosition({
              x: position.x + info.offset.x,
              y: position.y + info.offset.y,
            })
          }}
        >
          {title && (
            <div className="p-3 cursor-move border-b bg-gradient-to-r from-blue-600 to-blue-700 text-white flex items-center justify-between">
              <h3 className="font-medium">{title}</h3>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-white hover:bg-blue-600 rounded-full"
                onClick={() => handleOpenChange(false)}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Close</span>
              </Button>
            </div>
          )}
          <div className="p-4">{children}</div>
        </motion.div>
      </PopoverContent>
    </Popover>
  )
}
