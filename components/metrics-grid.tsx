"use client"

import { motion } from "framer-motion"
import { TrendingDown, TrendingUp, AlertTriangle } from "lucide-react"

interface DataPoint {
  time: string
  actualPremium: number
  expectedPremium: number
  rds: number
  ivScore: number
}

interface MetricsGridProps {
  data: DataPoint[]
}

export default function MetricsGrid({ data }: MetricsGridProps) {
  // Get the latest data point
  const latestPoint = data[data.length - 1]

  // Calculate additional metrics
  const premiumDifference = latestPoint.actualPremium - latestPoint.expectedPremium
  const premiumDifferencePercent = (premiumDifference / latestPoint.expectedPremium) * 100
  const combinedRiskScore = 0.7 * latestPoint.rds + 0.3 * latestPoint.ivScore

  // Metrics to display
  const metrics = [
    {
      name: "ATM Straddle Premium",
      value: `₹${latestPoint.actualPremium.toFixed(2)}`,
      change: premiumDifferencePercent,
      color: premiumDifferencePercent >= 0 ? "#22c55e" : "#ef4444",
      icon: premiumDifferencePercent >= 0 ? TrendingUp : TrendingDown,
    },
    {
      name: "Expected Premium",
      value: `₹${latestPoint.expectedPremium.toFixed(2)}`,
      secondary: `Diff: ${premiumDifferencePercent > 0 ? "+" : ""}${premiumDifferencePercent.toFixed(2)}%`,
      color: "#94a3b8",
    },
    {
      name: "Reverse Decay Score",
      value: `${(latestPoint.rds * 100).toFixed(2)}%`,
      color: latestPoint.rds > 0.1 ? "#ef4444" : latestPoint.rds > 0.05 ? "#f59e0b" : "#22c55e",
      icon: latestPoint.rds > 0.05 ? AlertTriangle : null,
    },
    {
      name: "IV Spike Score",
      value: `${(latestPoint.ivScore * 100).toFixed(2)}%`,
      color: latestPoint.ivScore > 0.05 ? "#ef4444" : latestPoint.ivScore > 0 ? "#f59e0b" : "#3b82f6",
    },
    {
      name: "Combined Risk Score",
      value: `${(combinedRiskScore * 100).toFixed(2)}%`,
      color: combinedRiskScore > 0.1 ? "#ef4444" : combinedRiskScore > 0.05 ? "#f59e0b" : "#22c55e",
    },
    {
      name: "Time Elapsed",
      value: `${data.length - 1} min`,
      secondary: "9:15 - 9:25 AM",
      color: "#94a3b8",
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-4">
      {metrics.map((metric, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="bg-slate-800/50 rounded-lg p-3 border border-slate-700"
        >
          <div className="flex justify-between items-start">
            <p className="text-xs font-medium text-slate-400">{metric.name}</p>
            {metric.icon && <metric.icon className="h-4 w-4" style={{ color: metric.color }} />}
          </div>
          <p className="text-xl font-bold mt-1" style={{ color: metric.color }}>
            {metric.value}
          </p>
          {metric.secondary && <p className="text-xs text-slate-400 mt-1">{metric.secondary}</p>}
          {metric.change !== undefined && (
            <div className="flex items-center gap-1 mt-1">
              {metric.change >= 0 ? (
                <TrendingUp className="h-3 w-3 text-green-500" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500" />
              )}
              <span className="text-xs font-medium" style={{ color: metric.change >= 0 ? "#22c55e" : "#ef4444" }}>
                {metric.change > 0 ? "+" : ""}
                {metric.change.toFixed(2)}%
              </span>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  )
}
