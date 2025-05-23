"use client"

import * as React from "react"
import { X } from "lucide-react"
import { motion } from "framer-motion"

interface FreeDraggablePopoverProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  className?: string
  width?: string
  height?: string
  initialPosition?: { x: number; y: number }
}

export function FreeDraggablePopover({
  isOpen,
  onClose,
  title,
  children,
  className = "",
  width = "400px",
  height = "auto",
  initialPosition = { x: 0, y: 0 },
}: FreeDraggablePopoverProps) {
  const [position, setPosition] = React.useState(initialPosition)
  const [isDragging, setIsDragging] = React.useState(false)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <motion.div
        className={`absolute pointer-events-auto rounded-lg border bg-background shadow-xl overflow-hidden ${className}`}
        style={{
          width,
          height,
          x: position.x,
          y: position.y,
          top: initialPosition.y,
          left: initialPosition.x,
        }}
        drag
        dragMomentum={false}
        dragElastic={0}
        dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={(_, info) => {
          setPosition({
            x: position.x + info.offset.x,
            y: position.y + info.offset.y,
          })
          setIsDragging(false)
        }}
      >
        <div className="flex flex-col h-full">
          {title && (
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
          )}
          <div className={`${isDragging ? "pointer-events-none" : "pointer-events-auto"} overflow-auto flex-1`}>
            {children}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
