"use client"

import type * as React from "react"
import { X } from "lucide-react"

interface SimplePopupProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  className?: string
  width?: number | string
  height?: number | string
}

export function SimplePopup({
  isOpen,
  onClose,
  title,
  children,
  className = "",
  width = 400,
  height = "auto",
}: SimplePopupProps) {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black/5 z-[100] overflow-hidden"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      <div
        className={`absolute bg-white rounded-md shadow-xl border border-gray-200 overflow-hidden ${className}`}
        style={{
          width,
          height,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col h-full">
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
          <div className="overflow-auto flex-1 p-4">{children}</div>
        </div>
      </div>
    </div>
  )
}
