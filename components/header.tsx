"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, LineChart, History, Settings, HelpCircle, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", active: true },
    { icon: LineChart, label: "Analytics" },
    { icon: History, label: "Backtest" },
    { icon: Settings, label: "Settings" },
  ]

  return (
    <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <div className="flex items-center gap-2 mr-8">
              <div className="h-8 w-8 rounded-md bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <LineChart className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl text-white">moneyy.ai</span>
            </div>

            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md",
                    item.active ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white hover:bg-slate-800/50",
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Button>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
              <HelpCircle className="h-5 w-5" />
            </Button>

            <div className="hidden md:flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-xs font-bold text-white">JD</span>
              </div>
              <span className="text-sm font-medium text-white">John Doe</span>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-slate-400 hover:text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-t border-slate-800">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex flex-col space-y-2">
              {navItems.map((item, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className={cn(
                    "flex items-center justify-start gap-2 px-3 py-2 text-sm font-medium rounded-md",
                    item.active ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white hover:bg-slate-800/50",
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Button>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
