"use client"

import type React from "react"

import { Toaster as Sonner } from "sonner"

const Toaster = (props: React.ComponentProps<typeof Sonner>) => {
  return (
    <Sonner
      position="top-right"
      toastOptions={{
        style: {
          background: "white",
          color: "black",
          border: "1px solid #ddd",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
