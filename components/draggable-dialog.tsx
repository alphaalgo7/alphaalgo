"use client"

import * as React from "react"
import { X } from "lucide-react"
import { cva } from "class-variance-authority"
import { motion } from "framer-motion"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface DraggableDialogProps {
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

export function DraggableDialog({
  title,
  description,
  children,
  footer,
  open,
  onOpenChange,
  className,
  size = "md",
}: DraggableDialogProps) {
  const [position, setPosition] = React.useState({ x: 0, y: 0 })
  const constraintsRef = React.useRef(null)
  const [isMounted, setIsMounted] = React.useState(false)

  // Client-side only code
  React.useEffect(() => {
    setIsMounted(true)

    // Ensure each dialog has a unique z-index to handle stacking
    // when multiple dialogs are open and being dragged
    const handleDialogClick = (e: MouseEvent) => {
      if (constraintsRef.current && constraintsRef.current.contains(e.target as Node)) {
        // When a dialog is clicked, bring it to the front by increasing its z-index
        const allDialogs = document.querySelectorAll(".draggable-dialog-container")
        allDialogs.forEach((dialog) => {
          const dialogContent = dialog.closest('[role="dialog"]')
          if (dialogContent) {
            ;(dialogContent as HTMLElement).style.zIndex = "50"
          }
        })

        const dialogContent = constraintsRef.current.closest('[role="dialog"]')
        if (dialogContent) {
          ;(dialogContent as HTMLElement).style.zIndex = "51"
        }
      }
    }

    document.addEventListener("mousedown", handleDialogClick)

    return () => {
      document.removeEventListener("mousedown", handleDialogClick)
    }
  }, [])

  // Reset position when dialog opens
  React.useEffect(() => {
    if (open) {
      setPosition({ x: 0, y: 0 })
    }
  }, [open])

  if (!isMounted) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`p-0 border-0 shadow-xl overflow-hidden z-50 ${dialogSizeVariants({ size })} ${className}`}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <motion.div
          ref={constraintsRef}
          className="w-full h-full flex flex-col rounded-lg border bg-background draggable-dialog-container"
          drag
          dragConstraints={{ left: -500, right: 500, top: -500, bottom: 500 }} // Increase drag area
          dragElastic={0.05} // Reduce elasticity for more precise movement
          dragMomentum={false}
          dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }} // Improve drag transition
          style={{ x: position.x, y: position.y }}
          onDragEnd={(_, info) => {
            setPosition({
              x: position.x + info.offset.x,
              y: position.y + info.offset.y,
            })
          }}
        >
          <DialogHeader className="p-4 cursor-move border-b bg-gradient-to-r from-slate-800 to-slate-700 text-white">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-lg font-bold">{title}</DialogTitle>
              <DialogClose asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-slate-600 rounded-full">
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </Button>
              </DialogClose>
            </div>
            {description && <DialogDescription className="text-slate-300">{description}</DialogDescription>}
          </DialogHeader>
          <div className="flex-1 overflow-auto p-4">{children}</div>
          {footer && <DialogFooter className="p-4 border-t">{footer}</DialogFooter>}
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
