"use client"

import { CheckCircle, XCircle, AlertTriangle } from "lucide-react"
import { motion } from "framer-motion"

interface TradingSignalsProps {
  riskFactor: number
}

export default function TradingSignals({ riskFactor }: TradingSignalsProps) {
  // Define signals based on risk factor
  const signals = [
    {
      name: "Reverse Decay",
      active: riskFactor > 30,
      type: riskFactor > 60 ? "high" : riskFactor > 30 ? "medium" : "low",
    },
    {
      name: "IV Expansion",
      active: riskFactor > 40,
      type: riskFactor > 70 ? "high" : riskFactor > 40 ? "medium" : "low",
    },
    {
      name: "Breakout Potential",
      active: riskFactor > 50,
      type: riskFactor > 80 ? "high" : riskFactor > 50 ? "medium" : "low",
    },
    {
      name: "Theta Decay",
      active: riskFactor < 40,
      type: riskFactor < 20 ? "high" : riskFactor < 40 ? "medium" : "low",
    },
  ]

  // Get icon based on signal type and active state
  const getIcon = (active: boolean, type: string) => {
    if (!active) return <XCircle className="h-4 w-4 text-slate-500" />

    if (type === "high") return <AlertTriangle className="h-4 w-4 text-red-500" />
    if (type === "medium") return <AlertTriangle className="h-4 w-4 text-amber-500" />
    return <CheckCircle className="h-4 w-4 text-green-500" />
  }

  // Get color based on signal type and active state
  const getColor = (active: boolean, type: string) => {
    if (!active) return "#64748b"

    if (type === "high") return "#ef4444"
    if (type === "medium") return "#f59e0b"
    return "#22c55e"
  }

  return (
    <div className="space-y-3">
      {signals.map((signal, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="flex items-center justify-between p-2 rounded-md bg-slate-800/50 border border-slate-700"
        >
          <div className="flex items-center gap-2">
            {getIcon(signal.active, signal.type)}
            <span className="font-medium" style={{ color: getColor(signal.active, signal.type) }}>
              {signal.name}
            </span>
          </div>
          <div
            className="px-2 py-0.5 rounded text-xs font-medium"
            style={{ backgroundColor: signal.active ? getColor(signal.active, signal.type) + "20" : "#1e293b" }}
          >
            {signal.active
              ? signal.type === "high"
                ? "Strong"
                : signal.type === "medium"
                  ? "Moderate"
                  : "Weak"
              : "Inactive"}
          </div>
        </motion.div>
      ))}
    </div>
  )
}
