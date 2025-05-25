"use client"

import { AlertCircle, AlertTriangle, CheckCircle, ArrowRight } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

interface ActionRecommendationProps {
  riskFactor: number
}

export default function ActionRecommendation({ riskFactor }: ActionRecommendationProps) {
  let title = ""
  let description = ""
  let icon = null
  let actionText = ""
  let color = ""

  if (riskFactor < 30) {
    title = "Standby"
    description = "Normal decay pattern observed. No action required at this time."
    icon = <CheckCircle className="h-5 w-5" />
    actionText = "Monitor Market"
    color = "#22c55e"
  } else if (riskFactor < 60) {
    title = "Possible Entry – Watch Direction"
    description = "Moderate reverse decay detected. Monitor market direction for potential entry."
    icon = <AlertTriangle className="h-5 w-5" />
    actionText = "Prepare Strategy"
    color = "#f59e0b"
  } else {
    title = "Trade Opportunity – Volatility Incoming"
    description = "High reverse decay detected. Prepare for volatility breakout and consider strategic positions."
    icon = <AlertCircle className="h-5 w-5" />
    actionText = "Execute Strategy"
    color = "#ef4444"
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      <Alert className="border-none bg-slate-800/70">
        <div className="flex items-start gap-3">
          <div style={{ color }}>{icon}</div>
          <div>
            <AlertTitle className="text-xl font-bold mb-1" style={{ color }}>
              {title}
            </AlertTitle>
            <AlertDescription className="text-slate-300">{description}</AlertDescription>
          </div>
        </div>
      </Alert>

      <div className="space-y-3">
        <h4 className="text-sm font-medium text-slate-400">Recommended Actions:</h4>
        <ul className="space-y-2">
          {riskFactor < 30 ? (
            <>
              <li className="flex items-center gap-2 text-sm text-slate-300">
                <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                Continue monitoring normal decay patterns
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-300">
                <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                No position adjustment needed
              </li>
            </>
          ) : riskFactor < 60 ? (
            <>
              <li className="flex items-center gap-2 text-sm text-slate-300">
                <div className="h-1.5 w-1.5 rounded-full bg-amber-500"></div>
                Watch for directional cues in price action
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-300">
                <div className="h-1.5 w-1.5 rounded-full bg-amber-500"></div>
                Prepare for potential volatility expansion
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-300">
                <div className="h-1.5 w-1.5 rounded-full bg-amber-500"></div>
                Consider hedging existing positions
              </li>
            </>
          ) : (
            <>
              <li className="flex items-center gap-2 text-sm text-slate-300">
                <div className="h-1.5 w-1.5 rounded-full bg-red-500"></div>
                High probability of significant price movement
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-300">
                <div className="h-1.5 w-1.5 rounded-full bg-red-500"></div>
                Consider directional or volatility strategies
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-300">
                <div className="h-1.5 w-1.5 rounded-full bg-red-500"></div>
                Implement risk management protocols
              </li>
            </>
          )}
        </ul>

        <Button className="w-full mt-4" style={{ backgroundColor: color, color: "white" }}>
          {actionText}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  )
}
