"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function MobileNav() {
  const [open, setOpen] = React.useState(false)
  const pathname = usePathname()

  const navItems = [
    { name: "Portfolio Settings", href: "/portfolio-settings" },
    { name: "Portfolios", href: "/portfolios" },
    { name: "Multi-Leg", href: "/multi-leg" },
    { name: "Strategies", href: "/strategies" },
    { name: "User Settings", href: "/user-settings" },
    { name: "Logs", href: "/logs" },
  ]

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden rounded-full">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="p-0 w-full max-w-[300px]">
        <div className="bg-[#0f172a] dark:bg-gray-950 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative h-8 w-8 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 rounded-md"></div>
                <div className="absolute inset-[1px] bg-[#0f172a] dark:bg-gray-950 rounded-md flex items-center justify-center">
                  <span className="text-transparent bg-clip-text bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 font-bold text-lg">
                    M
                  </span>
                </div>
              </div>
              <span className="font-bold text-xl text-white">
                Moneey<span className="text-cyan-500">.ai</span>
              </span>
            </div>
            <SheetClose className="rounded-full p-1 text-white hover:bg-white/10">
              <X className="h-5 w-5" />
            </SheetClose>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <Avatar className="h-10 w-10 border-2 border-purple-500">
              <AvatarImage src="/professional-avatar.png" />
              <AvatarFallback className="bg-gradient-to-br from-purple-600 to-blue-600 text-white">JD</AvatarFallback>
            </Avatar>
            <div className="text-white">
              <p className="text-sm font-medium">John Doe</p>
              <p className="text-xs text-gray-400">Premium Trader</p>
            </div>
          </div>
        </div>

        <div className="p-4">
          <div className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "block px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                  pathname === item.href
                    ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white",
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
