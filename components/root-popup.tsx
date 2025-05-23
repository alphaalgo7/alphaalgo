"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { X } from "lucide-react"
import { motion } from "framer-motion"

interface RootPopupProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  width?: string
  height?: string
}

export function RootPopup({
  isOpen,
  onClose,
  title = "Popup",
  children,
  width = "400px",
  height = "auto",
}: RootPopupProps) {
  const [mounted, setMounted] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    setMounted(true)

    // Add event listener for Escape key
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }

    document.addEventListener("keydown", handleEscKey)

    // Prevent scrolling when popup is open
    if (isOpen) {
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey)
      document.body.style.overflow = "auto"
    }
  }, [isOpen, onClose])

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  // Only render on client-side
  if (!mounted || !isOpen) return null

  // Use createPortal to render at document body level
  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50"
      onClick={handleOverlayClick}
      style={{ backdropFilter: "blur(2px)" }}
    >
      <motion.div
        className="relative bg-white rounded-lg shadow-lg"
        style={{ width, height, maxWidth: "95vw", maxHeight: "95vh" }}
        onClick={(e) => e.stopPropagation()}
        drag
        dragMomentum={false}
        dragElastic={0}
        dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
        initial={{ x: 0, y: 0 }}
        animate={{ x: position.x, y: position.y }}
        onDragEnd={(_, info) => {
          setPosition({
            x: position.x + info.offset.x,
            y: position.y + info.offset.y,
          })
        }}
      >
        <div className="flex items-center justify-between p-4 border-b cursor-move">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100" aria-label="Close">
            <X size={20} />
          </button>
        </div>
        <div className="p-4 overflow-auto" style={{ maxHeight: "calc(95vh - 60px)" }}>
          {children}
        </div>
      </motion.div>
    </div>,
    document.body,
  )
}

// Example usage component
export function PopupExample() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div>
      <button onClick={() => setIsOpen(true)} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Open Popup
      </button>

      <RootPopup isOpen={isOpen} onClose={() => setIsOpen(false)} title="Example Popup">
        <div className="space-y-4">
          <p>This popup renders at the document root level using React portals.</p>
          <p>It will always appear on top of everything else on the page.</p>
          <button
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Close
          </button>
        </div>
      </RootPopup>
    </div>
  )
}
