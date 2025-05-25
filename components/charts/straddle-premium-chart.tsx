"use client"

import { useMemo } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
  ReferenceLine,
  Label,
  Brush,
} from "recharts"
import { useTheme } from "next-themes"

interface DataPoint {
  time: string
  actualPremium: number
  expectedPremium: number
  rds: number
  ivScore: number
}

interface StraddlePremiumChartProps {
  data: DataPoint[]
  advanced?: boolean
}

export default function StraddlePremiumChart({ data, advanced = false }: StraddlePremiumChartProps) {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  // Calculate the difference between actual and expected premium
  const enhancedData = useMemo(() => {
    return data.map((point) => ({
      ...point,
      difference: point.actualPremium - point.expectedPremium,
      percentDifference: ((point.actualPremium - point.expectedPremium) / point.expectedPremium) * 100,
    }))
  }, [data])

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 border border-slate-700 p-3 rounded-md shadow-lg">
          <p className="text-slate-300 font-medium">{`Time: ${label}`}</p>
          <p className="text-blue-400">{`Actual Premium: ₹${payload[0].value.toFixed(2)}`}</p>
          <p className="text-green-400">{`Expected Premium: ₹${payload[1].value.toFixed(2)}`}</p>
          {advanced && (
            <>
              <p className="text-purple-400">{`Difference: ₹${payload[0].payload.difference.toFixed(2)}`}</p>
              <p className="text-amber-400">{`% Difference: ${payload[0].payload.percentDifference.toFixed(2)}%`}</p>
            </>
          )}
        </div>
      )
    }
    return null
  }

  if (advanced) {
    return (
      <div className="w-full h-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={enhancedData}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 30,
            }}
          >
            <defs>
              <linearGradient id="actualPremiumGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="expectedPremiumGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="time" stroke="#94a3b8" tick={{ fill: "#94a3b8" }}>
              <Label value="Time (9:15 - 9:25 AM)" position="insideBottom" offset={-20} fill="#94a3b8" />
            </XAxis>
            <YAxis stroke="#94a3b8" tick={{ fill: "#94a3b8" }}>
              <Label value="Premium (₹)" angle={-90} position="insideLeft" fill="#94a3b8" />
            </YAxis>
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="top" height={36} wrapperStyle={{ paddingTop: "10px" }} />
            <ReferenceLine
              y={enhancedData[0].expectedPremium}
              stroke="#f59e0b"
              strokeDasharray="3 3"
              label={{ value: "Opening Premium", position: "right", fill: "#f59e0b" }}
            />
            <Area
              type="monotone"
              dataKey="actualPremium"
              name="Actual Premium"
              stroke="#3b82f6"
              fillOpacity={1}
              fill="url(#actualPremiumGradient)"
              strokeWidth={2}
              activeDot={{ r: 8, strokeWidth: 2, stroke: "#1d4ed8" }}
            />
            <Area
              type="monotone"
              dataKey="expectedPremium"
              name="Expected Premium"
              stroke="#22c55e"
              fillOpacity={0.3}
              fill="url(#expectedPremiumGradient)"
              strokeWidth={2}
              strokeDasharray="5 5"
              activeDot={{ r: 6, strokeWidth: 2, stroke: "#15803d" }}
            />
            <Brush dataKey="time" height={30} stroke="#475569" fill="#1e293b" tickFormatter={(tick) => ""} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    )
  }

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 0,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="time" stroke="#94a3b8" tick={{ fill: "#94a3b8" }} />
          <YAxis stroke="#94a3b8" tick={{ fill: "#94a3b8" }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line
            type="monotone"
            dataKey="actualPremium"
            name="Actual Premium"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ r: 4, strokeWidth: 2, stroke: "#1d4ed8", fill: "#3b82f6" }}
            activeDot={{ r: 8, strokeWidth: 2, stroke: "#1d4ed8" }}
          />
          <Line
            type="monotone"
            dataKey="expectedPremium"
            name="Expected Premium"
            stroke="#22c55e"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ r: 4, strokeWidth: 2, stroke: "#15803d", fill: "#22c55e" }}
            activeDot={{ r: 6, strokeWidth: 2, stroke: "#15803d" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
