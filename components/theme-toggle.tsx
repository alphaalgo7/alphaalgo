"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <button className="relative p-2 rounded-full">
        <div className="h-5 w-5"></div>
      </button>
    )
  }

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="group relative p-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
      aria-label={theme === "light" ? "Switch to dark theme" : "Switch to light theme"}
    >
      <span className="absolute inset-0 rounded-full bg-gray-100 dark:bg-gray-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></span>
      <span className="absolute inset-0 rounded-full bg-yellow-500/10 dark:bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-all duration-300 -z-10 group-hover:scale-110 blur-sm"></span>

      <div className="relative h-5 w-5 overflow-hidden">
        <Sun className="h-5 w-5 stroke-[2px] transition-all duration-500 rotate-0 dark:-rotate-90 dark:scale-0 dark:opacity-0 group-hover:scale-110" />
        <Moon className="absolute top-0 h-5 w-5 stroke-[2px] transition-all duration-500 rotate-90 scale-0 opacity-0 dark:rotate-0 dark:scale-100 dark:opacity-100 group-hover:scale-110" />
      </div>
    </button>
  )
}
