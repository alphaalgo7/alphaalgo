"use client"

import type * as React from "react"
import { X } from "lucide-react"
import { cva } from "class-variance-authority"

interface SimpleDialogProps {
  title: string
  description?: string
  children: React.ReactNode
  footer?: React.ReactNode
  open: boolean
  onOpenChange: (open: boolean) => void
  className?: string
  size?: "sm" | "md" | "lg" | "xl"
}

const dialogSizeVariants = cva("", {
  variants: {
    size: {
      sm: "sm:max-w-[500px]",
      md: "sm:max-w-[600px]",
      lg: "sm:max-w-[800px]",
      xl: "sm:max-w-[1000px]",
    },
  },
  defaultVariants: {
    size: "md",
  },
})

export function SimpleDialog({
  title,
  description,
  children,
  footer,
  open,
  onOpenChange,
  className,
  size = "md",
}: SimpleDialogProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
      <div
        className={`bg-white rounded-lg shadow-xl overflow-hidden max-w-full max-h-[90vh] ${dialogSizeVariants({ size })} ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col w-full h-full">
          <div className="p-4 cursor-move border-b bg-gradient-to-r from-slate-800 to-slate-700 text-white">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">{title}</h2>
              <button
                className="h-8 w-8 flex items-center justify-center text-white hover:bg-slate-600 rounded-full"
                onClick={() => onOpenChange(false)}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </button>
            </div>
            {description && <p className="text-slate-300 mt-1">{description}</p>}
          </div>
          <div className="flex-1 overflow-auto p-4">{children}</div>
          {footer && <div className="p-4 border-t">{footer}</div>}
        </div>
      </div>
    </div>
  )
}
