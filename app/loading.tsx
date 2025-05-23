"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LineChart, Settings, RefreshCw, ChevronUp, ChevronDown, ArrowRight, CheckCircle2 } from "lucide-react"

export default function Loading() {
  const [loadingStep, setLoadingStep] = useState(0)
  const [progress, setProgress] = useState(0)

  const loadingSteps = [
    "Initializing strategy builder...",
    "Loading market data...",
    "Preparing trading components...",
    "Setting up option chains...",
    "Finalizing strategy builder...",
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingStep((prev) => {
        if (prev < loadingSteps.length - 1) {
          return prev + 1
        }
        clearInterval(interval)
        return prev
      })
    }, 800)

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 100) {
          return prev + 1
        }
        clearInterval(progressInterval)
        return prev
      })
    }, 40)

    return () => {
      clearInterval(interval)
      clearInterval(progressInterval)
    }
  }, [loadingSteps.length])

  return (
    <div className="w-full max-w-[1300px] mx-auto p-4 text-sm">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          <motion.div
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2 rounded-lg font-bold"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            Moneey.ai
          </motion.div>
          <div className="flex flex-col">
            <motion.h1
              className="text-xl font-bold"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Create New Strategy
            </motion.h1>
            <motion.span
              className="text-slate-500 text-xs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Loading strategy builder...
            </motion.span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.3 }}>
            <Card>
              <CardContent className="p-3 flex items-center gap-3">
                <Skeleton className="h-12 w-24" />
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.4 }}>
            <Card>
              <CardContent className="p-3 flex items-center gap-3">
                <div className="flex flex-col">
                  <span className="text-xs text-slate-500">Lot Size</span>
                  <div className="flex items-center">
                    <Skeleton className="h-6 w-8" />
                    <div className="flex flex-col ml-2">
                      <ChevronUp className="h-3 w-3 text-slate-300" />
                      <ChevronDown className="h-3 w-3 text-slate-300" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.5 }}>
            <div className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center">
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              <span>Refresh Data</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Loading Progress */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card className="border-0 shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-slate-800 to-slate-700 p-4 text-white">
            <h2 className="text-lg font-bold flex items-center">
              <Settings className="h-4 w-4 mr-2" />
              Loading Strategy Builder
            </h2>
          </div>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>

              <div className="space-y-4">
                {loadingSteps.map((step, index) => (
                  <div
                    key={index}
                    className={`flex items-center ${index <= loadingStep ? "text-slate-800" : "text-slate-400"}`}
                  >
                    {index < loadingStep ? (
                      <CheckCircle2 className="h-5 w-5 mr-3 text-green-500" />
                    ) : index === loadingStep ? (
                      <div className="h-5 w-5 mr-3 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
                    ) : (
                      <div className="h-5 w-5 mr-3 rounded-full border border-slate-300" />
                    )}
                    <span className={index <= loadingStep ? "font-medium" : "font-normal"}>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Skeleton UI for Main Content */}
      <div className="grid gap-6">
        {/* Settings Panel Skeleton */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <Card className="overflow-hidden border-0 shadow-lg">
            <div className="bg-gradient-to-r from-slate-800 to-slate-700 p-4 text-white">
              <h2 className="text-lg font-bold flex items-center">
                <Settings className="h-4 w-4 mr-2" />
                Trading Configuration
              </h2>
            </div>

            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="space-y-4">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <div className="flex gap-2">
                        <Skeleton className="h-10 w-full" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-40" />
                      <div className="flex gap-2">
                        <Skeleton className="h-10 w-full" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Trading Legs Table Skeleton */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <Card className="overflow-hidden border-0 shadow-lg">
            <div className="bg-gradient-to-r from-slate-800 to-slate-700 p-4 text-white">
              <h2 className="text-lg font-bold flex items-center">
                <LineChart className="h-4 w-4 mr-2" />
                Trading Legs
              </h2>
            </div>

            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-100">
                      {[...Array(8)].map((_, i) => (
                        <th key={i} className="px-4 py-3 text-left">
                          <Skeleton className="h-4 w-16" />
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[...Array(2)].map((_, i) => (
                      <tr key={i} className="border-b border-slate-200">
                        {[...Array(8)].map((_, j) => (
                          <td key={j} className="px-4 py-3">
                            {j === 3 ? (
                              <Badge variant="destructive" className="w-16">
                                <Skeleton className="h-4 w-full bg-white/20" />
                              </Badge>
                            ) : j === 4 ? (
                              <Badge variant="outline" className="w-16">
                                <Skeleton className="h-4 w-full bg-slate-200" />
                              </Badge>
                            ) : (
                              <Skeleton className="h-6 w-16" />
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Execution Parameters Skeleton */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          <Card className="overflow-hidden border-0 shadow-lg">
            <div className="bg-gradient-to-r from-slate-800 to-slate-700 p-4 text-white">
              <div className="flex gap-2">
                <Skeleton className="h-8 w-40 bg-white/20" />
                <Skeleton className="h-8 w-32 bg-white/10" />
                <Skeleton className="h-8 w-36 bg-white/10" />
              </div>
            </div>

            <CardContent className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card className="border border-slate-200">
                    <CardContent className="p-4">
                      <Skeleton className="h-6 w-48 mb-4" />
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[...Array(6)].map((_, i) => (
                          <div key={i} className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-9 w-full" />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <Card className="border border-slate-200">
                    <CardContent className="p-4">
                      <Skeleton className="h-6 w-36 mb-4" />
                      <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-9 w-full" />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Animated Trading Elements */}
      <div className="fixed bottom-8 right-8 flex items-center gap-3">
        <motion.div
          className="flex items-center gap-2 bg-white p-3 rounded-lg shadow-lg"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.5,
            delay: 1.2,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            repeatDelay: 2,
          }}
        >
          <div className="flex flex-col items-center">
            <span className="text-xs text-slate-500">Loading market data</span>
            <div className="flex items-center gap-1 mt-1">
              <motion.div
                className="h-2 w-2 rounded-full bg-green-500"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
              />
              <motion.div
                className="h-2 w-2 rounded-full bg-blue-500"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 1, delay: 0.2, repeat: Number.POSITIVE_INFINITY }}
              />
              <motion.div
                className="h-2 w-2 rounded-full bg-purple-500"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 1, delay: 0.4, repeat: Number.POSITIVE_INFINITY }}
              />
              <motion.div
                className="h-2 w-2 rounded-full bg-red-500"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 1, delay: 0.6, repeat: Number.POSITIVE_INFINITY }}
              />
              <motion.div
                className="h-2 w-2 rounded-full bg-yellow-500"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 1, delay: 0.8, repeat: Number.POSITIVE_INFINITY }}
              />
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-slate-400" />
        </motion.div>
      </div>
    </div>
  )
}
