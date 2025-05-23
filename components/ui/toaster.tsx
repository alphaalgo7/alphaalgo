"use client"

import { Toaster as SonnerToaster } from "sonner"

export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      toastOptions={{
        style: {
          background: "white",
          color: "black",
          border: "1px solid #e2e8f0",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          whiteSpace: "pre-line", // This ensures newlines are respected
        },
        className: "border-slate-200 rounded-md toast-with-timestamp",
        duration: 5000,
      }}
      closeButton
      richColors
      expand={false}
    />
  )
}
