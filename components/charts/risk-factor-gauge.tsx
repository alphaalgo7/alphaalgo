"use client"
import { motion } from "framer-motion"

interface RiskFactorGaugeProps {
  value: number
}

export default function RiskFactorGauge({ value }: RiskFactorGaugeProps) {
  // Ensure value is between 0 and 100
  const safeValue = Math.min(100, Math.max(0, value))

  // Calculate angle for the needle (from -90 to 90 degrees)
  const angle = -90 + (safeValue / 100) * 180

  // Calculate color based on risk factor
  const getColor = (value: number) => {
    if (value < 30) return "#22c55e" // Green for low risk
    if (value < 60) return "#f59e0b" // Amber for medium risk
    return "#ef4444" // Red for high risk
  }

  const color = getColor(safeValue)

  // Get risk level text
  const getRiskLevel = (value: number) => {
    if (value < 30) return "Low Risk"
    if (value < 60) return "Moderate Risk"
    return "High Risk"
  }

  // Create gradient stops based on value
  const gradientStops = [
    { offset: "0%", color: "#22c55e" },
    { offset: "30%", color: "#22c55e" },
    { offset: "30%", color: "#f59e0b" },
    { offset: "60%", color: "#f59e0b" },
    { offset: "60%", color: "#ef4444" },
    { offset: "100%", color: "#ef4444" },
  ]

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      <svg viewBox="0 0 200 120" className="w-full max-w-[240px]">
        {/* Gauge background */}
        <defs>
          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            {gradientStops.map((stop, index) => (
              <stop key={index} offset={stop.offset} stopColor={stop.color} />
            ))}
          </linearGradient>
        </defs>

        {/* Gauge track */}
        <path d="M20,100 A80,80 0 0,1 180,100" fill="none" stroke="#1e293b" strokeWidth="12" strokeLinecap="round" />

        {/* Gauge value */}
        <path
          d="M20,100 A80,80 0 0,1 180,100"
          fill="none"
          stroke="url(#gaugeGradient)"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray="251.2"
          strokeDashoffset={251.2 - (safeValue / 100) * 251.2}
        />

        {/* Gauge ticks */}
        {[0, 30, 60, 100].map((tick, index) => {
          const tickAngle = -90 + (tick / 100) * 180
          const x = 100 + 70 * Math.cos((tickAngle * Math.PI) / 180)
          const y = 100 + 70 * Math.sin((tickAngle * Math.PI) / 180)
          return (
            <g key={index}>
              <line x1="100" y1="100" x2={x} y2={y} stroke="#475569" strokeWidth="1" strokeDasharray="2 2" />
              <text
                x={100 + 90 * Math.cos((tickAngle * Math.PI) / 180)}
                y={100 + 90 * Math.sin((tickAngle * Math.PI) / 180)}
                fill="#94a3b8"
                fontSize="8"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {tick}
              </text>
            </g>
          )
        })}

        {/* Gauge needle */}
        <motion.g
          initial={{ rotate: -90, originX: 100, originY: 100 }}
          animate={{ rotate: angle, originX: 100, originY: 100 }}
          transition={{ type: "spring", stiffness: 50, damping: 15 }}
        >
          <line x1="100" y1="100" x2="100" y2="30" stroke={color} strokeWidth="3" strokeLinecap="round" />
          <circle cx="100" cy="100" r="6" fill={color} />
        </motion.g>

        {/* Value text */}
        <text x="100" y="80" fill="white" fontSize="24" fontWeight="bold" textAnchor="middle">
          {safeValue.toFixed(0)}
        </text>

        <text x="100" y="95" fill="#94a3b8" fontSize="10" textAnchor="middle">
          Risk Factor
        </text>
      </svg>

      <div className="mt-2 text-center">
        <span className="text-lg font-semibold" style={{ color }}>
          {getRiskLevel(safeValue)}
        </span>
      </div>
    </div>
  )
}
