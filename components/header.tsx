"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  BellRing,
  Search,
  ChevronDown,
  LineChart,
  Briefcase,
  ClipboardList,
  TrendingUp,
  Menu,
  X,
  Plus,
  User,
} from "lucide-react"
import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function Header() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu when pathname changes (page navigation)
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  const navItems = [
    {
      name: "Create Strategy",
      href: "/",
      icon: <Plus className="h-4 w-4 stroke-[2.5px] flex-shrink-0" />,
    },
    { name: "Strategies", href: "/strategies", icon: <TrendingUp className="h-4 w-4 stroke-[2.5px] flex-shrink-0" /> },
    { name: "Portfolios", href: "/portfolios", icon: <Briefcase className="h-4 w-4 stroke-[2.5px] flex-shrink-0" /> },
    { name: "Logs", href: "/logs", icon: <ClipboardList className="h-4 w-4 stroke-[2.5px] flex-shrink-0" /> },
    {
      name: "Live Monitor",
      href: "/live-monitor",
      icon: <LineChart className="h-4 w-4 stroke-[2.5px] flex-shrink-0" />,
    },
    { name: "User Settings", href: "/user-settings", icon: <User className="h-4 w-4 stroke-[2.5px] flex-shrink-0" /> },
  ]

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-500",
        scrolled
          ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm border-b border-gray-200 dark:border-gray-800"
          : "bg-white dark:bg-gray-900",
      )}
    >
      {/* Animated gradient line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 bg-[length:200%_auto] animate-gradient"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Create Strategy Button */}
          <div className="flex items-center space-x-4">
            {/* Logo */}
            <Link href="/" className="group flex items-center space-x-2">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white overflow-hidden transition-all duration-500 group-hover:shadow-lg group-hover:shadow-blue-500/30 group-hover:scale-110">
                {/* Logo background animation */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-gradient"></div>

                {/* Animated particles */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute h-2 w-2 rounded-full bg-white/40 top-1 left-1 animate-float-slow"></div>
                  <div className="absolute h-1.5 w-1.5 rounded-full bg-white/30 bottom-1 right-2 animate-float-medium"></div>
                  <div className="absolute h-1 w-1 rounded-full bg-white/20 bottom-2 left-2 animate-float-fast"></div>
                </div>

                {/* Icon with special hover effect */}
                <LineChart className="h-4 w-4 stroke-[2.5px] relative z-10 transition-all duration-500 group-hover:scale-110 group-hover:text-white" />

                {/* Glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-br from-blue-600 to-indigo-600 blur-lg opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>
              </div>

              <div className="transition-all duration-500 group-hover:translate-x-1">
                <span className="font-semibold text-xl text-gray-900 dark:text-white relative">
                  Moneey
                  <span className="text-blue-600 group-hover:text-indigo-500 transition-colors duration-500">.ai</span>
                  {/* Animated underline */}
                  <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 group-hover:w-full transition-all duration-500 delay-100"></span>
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group px-3 py-2 rounded-md text-sm font-medium flex items-center transition-all duration-300 relative overflow-hidden",
                  pathname === item.href
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                    : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400",
                )}
                onMouseEnter={() => setHoveredItem(item.href)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                {/* Ripple effect background */}
                <span className="absolute inset-0 overflow-hidden">
                  <span className="absolute left-1/2 top-1/2 h-0 w-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-100 dark:bg-blue-900/30 group-hover:h-[300px] group-hover:w-[300px] transition-all duration-500 ease-out"></span>
                </span>

                {/* Icon with special animation */}
                <span className="mr-2 relative z-10 transition-all duration-500 group-hover:scale-125 group-hover:rotate-12 group-hover:text-blue-600 dark:group-hover:text-blue-400 flex items-center justify-center">
                  {item.icon}

                  {/* Icon glow effect */}
                  <span className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/20 rounded-full blur-md transition-all duration-500 -z-10"></span>
                </span>

                {/* Text with animation */}
                <span className="relative z-10 transition-all duration-500 group-hover:font-medium">{item.name}</span>

                {/* Active indicator */}
                {pathname === item.href && (
                  <span className="absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r from-blue-500 to-indigo-500"></span>
                )}

                {/* Hover indicator - sliding underline */}
                <span
                  className={cn(
                    "absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500",
                    pathname === item.href ? "opacity-0" : "group-hover:w-full",
                  )}
                ></span>
              </Link>
            ))}
          </nav>

          {/* Right Side Items */}
          <div className="flex items-center space-x-4">
            {/* Search - Hidden on smallest screens */}
            <button className="group relative p-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 hidden sm:flex">
              {/* Magnetic hover effect */}
              <span className="absolute inset-0 rounded-full bg-gray-100 dark:bg-gray-800 opacity-0 group-hover:opacity-100 transition-all duration-300 -z-10 scale-0 group-hover:scale-100"></span>

              {/* Pulsing glow effect */}
              <span className="absolute inset-0 rounded-full bg-blue-500/0 group-hover:bg-blue-500/20 transition-all duration-500 -z-10 scale-0 group-hover:scale-150 group-hover:blur-md"></span>

              {/* Icon with special animation */}
              <Search className="h-5 w-5 stroke-[2px] transition-all duration-500 group-hover:scale-110 group-hover:rotate-12" />

              {/* Animated ring */}
              <span className="absolute inset-0 rounded-full border-2 border-blue-500/0 group-hover:border-blue-500/50 transition-all duration-500 scale-0 group-hover:scale-100 group-hover:animate-ping-slow"></span>
            </button>

            {/* Notifications - Hidden on smallest screens */}
            <button className="group relative p-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 hidden sm:flex">
              {/* Background effect */}
              <span className="absolute inset-0 rounded-full bg-gray-100 dark:bg-gray-800 opacity-0 group-hover:opacity-100 transition-all duration-300 -z-10 scale-0 group-hover:scale-100"></span>

              {/* Pulsing glow effect */}
              <span className="absolute inset-0 rounded-full bg-red-500/0 group-hover:bg-red-500/20 transition-all duration-500 -z-10 scale-0 group-hover:scale-150 group-hover:blur-md"></span>

              {/* Icon with special animation */}
              <BellRing className="h-5 w-5 stroke-[2px] transition-all duration-500 group-hover:scale-110 group-hover:animate-bell-ring" />

              {/* Notification badge with special effect */}
              <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-gray-900 transition-all duration-500 group-hover:scale-150 group-hover:animate-pulse"></span>

              {/* Animated ring */}
              <span className="absolute inset-0 rounded-full border-2 border-red-500/0 group-hover:border-red-500/50 transition-all duration-500 scale-0 group-hover:scale-100 group-hover:animate-ping-slow"></span>
            </button>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* User Menu - Hidden on mobile */}
            <div className="hidden md:flex items-center">
              <button className="group flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 p-1 rounded-full relative">
                {/* Background effect */}
                <span className="absolute inset-0 rounded-full bg-gray-100 dark:bg-gray-800 opacity-0 group-hover:opacity-100 transition-all duration-300 -z-10 scale-0 group-hover:scale-100"></span>

                {/* Glow effect */}
                <span className="absolute inset-0 rounded-full bg-blue-500/0 group-hover:bg-blue-500/20 transition-all duration-500 -z-10 scale-0 group-hover:scale-150 group-hover:blur-md"></span>

                {/* Avatar with special effects */}
                <div className="relative">
                  <Avatar className="h-8 w-8 border-2 border-transparent group-hover:border-blue-500 transition-all duration-500 group-hover:shadow-md group-hover:shadow-blue-500/20 group-hover:scale-110">
                    <AvatarImage src="/professional-avatar.png" />
                    <AvatarFallback className="bg-blue-600 text-white">JD</AvatarFallback>
                  </Avatar>

                  {/* Avatar glow */}
                  <span className="absolute -inset-1 rounded-full bg-blue-500/0 group-hover:bg-blue-500/30 transition-all duration-500 blur-md opacity-0 group-hover:opacity-100"></span>
                </div>

                {/* Text with animation */}
                <span className="text-sm font-medium transition-all duration-500 group-hover:translate-x-0.5 group-hover:font-semibold">
                  John Doe
                </span>

                {/* Chevron with special animation */}
                <ChevronDown className="h-4 w-4 opacity-70 transition-all duration-500 group-hover:rotate-180 group-hover:text-blue-500" />

                {/* Animated ring */}
                <span className="absolute inset-0 rounded-full border-2 border-blue-500/0 group-hover:border-blue-500/50 transition-all duration-500 scale-0 group-hover:scale-100 group-hover:animate-ping-slow"></span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden group relative p-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {/* Background effect */}
              <span className="absolute inset-0 rounded-full bg-gray-100 dark:bg-gray-800 opacity-0 group-hover:opacity-100 transition-all duration-300 -z-10 scale-0 group-hover:scale-100"></span>

              {/* Glow effect */}
              <span className="absolute inset-0 rounded-full bg-blue-500/0 group-hover:bg-blue-500/20 transition-all duration-500 -z-10 scale-0 group-hover:scale-150 group-hover:blur-md"></span>

              {/* Icon with special animation */}
              {mobileMenuOpen ? (
                <X className="h-6 w-6 stroke-[2px] transition-all duration-500 group-hover:scale-110 group-hover:text-blue-500" />
              ) : (
                <>
                  <Menu className="h-6 w-6 stroke-[2px] transition-all duration-500 group-hover:scale-110" />
                  {/* Animated lines */}
                  <span className="absolute top-[11px] left-[8px] h-0.5 w-[8px] bg-current rounded-full transition-all duration-300 group-hover:w-[16px] group-hover:bg-blue-500"></span>
                  <span className="absolute top-[15px] left-[8px] h-0.5 w-[16px] bg-current rounded-full transition-all duration-300 group-hover:w-[12px] group-hover:bg-blue-500"></span>
                  <span className="absolute top-[19px] left-[8px] h-0.5 w-[12px] bg-current rounded-full transition-all duration-300 group-hover:w-[8px] group-hover:bg-blue-500"></span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div
        className={cn(
          "md:hidden fixed inset-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md transition-all duration-300 flex flex-col",
          mobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none",
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          <Link href="/" className="flex items-center space-x-2" onClick={() => setMobileMenuOpen(false)}>
            <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
              <LineChart className="h-4 w-4 stroke-[2.5px]" />
            </div>
            <span className="font-semibold text-xl text-gray-900 dark:text-white">
              Moneey<span className="text-blue-600">.ai</span>
            </span>
          </Link>
          <button
            className="p-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
            onClick={() => setMobileMenuOpen(false)}
          >
            <X className="h-6 w-6 stroke-[2px]" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <nav className="flex flex-col space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group px-4 py-3 rounded-lg flex items-center transition-all duration-300 relative overflow-hidden",
                  pathname === item.href
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400",
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {/* Icon with animation */}
                <span className="mr-3 relative z-10 transition-all duration-300 group-hover:scale-110 group-hover:text-blue-600 dark:group-hover:text-blue-400 flex items-center justify-center flex-shrink-0">
                  {item.icon}
                </span>

                {/* Text */}
                <span className="text-base font-medium">{item.name}</span>

                {/* Active indicator */}
                {pathname === item.href && (
                  <span className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-r-full"></span>
                )}
              </Link>
            ))}
          </nav>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 p-4">
          <div className="flex items-center gap-3 mb-4">
            <Avatar className="h-10 w-10 border-2 border-blue-500/20">
              <AvatarImage src="/professional-avatar.png" />
              <AvatarFallback className="bg-blue-600 text-white">JD</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">John Doe</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Premium Trader</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <button className="text-sm text-blue-600 dark:text-blue-400 font-medium">View Profile</button>
            <button className="text-sm text-red-600 dark:text-red-400 font-medium">Sign Out</button>
          </div>
        </div>
      </div>
    </header>
  )
}
