"use client"

import * as React from "react"
import { X } from "lucide-react"
import { motion } from "framer-motion"

interface BetterPopupProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  className?: string
  width?: number | string
  height?: number | string
  initialPosition?: { x: number; y: number }
}

export function BetterPopup({
  isOpen,
  onClose,
  title,
  children,
  className = "",
  width = 400,
  height = "auto",
  initialPosition = { x: 100, y: 100 },
}: BetterPopupProps) {
  const [position, setPosition] = React.useState(initialPosition)
  const popupRef = React.useRef<HTMLDivElement>(null)
  const [isMounted, setIsMounted] = React.useState(false)

  // Client-side only code
  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  // Reset position when popup opens
  React.useEffect(() => {
    if (isOpen) {
      setPosition(initialPosition)
    }
  }, [isOpen, initialPosition])

  React.useEffect(() => {
    // Ensure each popup has a unique z-index to handle stacking
    // when multiple popups are open and being dragged
    const handlePopupClick = (e: MouseEvent) => {
      if (popupRef.current && popupRef.current.contains(e.target as Node)) {
        // When a popup is clicked, bring it to the front by increasing its z-index
        if (popupRef.current) {
          const allPopups = document.querySelectorAll(".better-popup-container")
          allPopups.forEach((popup) => {
            ;(popup as HTMLElement).style.zIndex = "100"
          })
          popupRef.current.style.zIndex = "101"
        }
      }
    }

    document.addEventListener("mousedown", handlePopupClick)

    return () => {
      document.removeEventListener("mousedown", handlePopupClick)
    }
  }, [])

  if (!isOpen || !isMounted) return null

  return (
    <div
      className="fixed inset-0 bg-black/5 z-[100] overflow-hidden"
      onClick={(e) => {
        // Close when clicking outside the popup
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      <motion.div
        ref={popupRef}
        className={`absolute bg-white rounded-md shadow-xl border border-gray-200 overflow-hidden better-popup-container ${className}`}
        style={{
          width,
          height,
          top: initialPosition.y,
          left: initialPosition.x,
          x: position.x,
          y: position.y,
        }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2 }}
        drag
        dragMomentum={false}
        dragElastic={0}
        onClick={(e) => e.stopPropagation()}
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
          <div className="overflow-auto flex-1 p-4">{children}</div>
        </div>
      </motion.div>
    </div>
  )
}
