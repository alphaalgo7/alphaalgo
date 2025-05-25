"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import { X } from "lucide-react"
import { createPortal } from "react-dom"

interface BasicPopupProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  width?: number | string
}

export function BasicPopup({ isOpen, onClose, title, children, width = 400 }: BasicPopupProps) {
  // Reference to store the portal container
  const portalRef = useRef<HTMLDivElement | null>(null)

  // Create portal container on mount
  useEffect(() => {
    // Create the portal container if it doesn't exist
    if (!portalRef.current) {
      const div = document.createElement("div")
      div.id = `popup-portal-${Math.random().toString(36).substr(2, 9)}`
      document.body.appendChild(div)
      portalRef.current = div
    }

    // Clean up on unmount
    return () => {
      if (portalRef.current && document.body.contains(portalRef.current)) {
        document.body.removeChild(portalRef.current)
      }
    }
  }, [])

  // Close on escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }

    if (isOpen) {
      window.addEventListener("keydown", handleEsc)
    }

    return () => {
      window.removeEventListener("keydown", handleEsc)
    }
  }, [isOpen, onClose])

  // Don't render anything if not open or if portal ref is not available
  if (!isOpen || !portalRef.current) return null

  // Create the popup content
  const popupContent = (
    <div
      className="fixed inset-0 bg-black/30 z-[9999] flex items-center justify-center p-4"
      onClick={onClose}
      style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}
    >
      <div
        className="bg-white rounded-md shadow-lg overflow-auto max-h-[90vh]"
        style={{
          width: typeof width === "number" ? `${width}px` : width,
          position: "relative",
          zIndex: 10000,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="p-3 border-b bg-gradient-to-r from-blue-600 to-blue-700 text-white flex items-center justify-between">
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
        <div className="p-4">{children}</div>
      </div>
    </div>
  )

  // Use createPortal to render the popup at the document body level
  return createPortal(popupContent, portalRef.current)
}
