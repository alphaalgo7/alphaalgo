"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Label,
  Cell,
} from "recharts"

interface DataPoint {
  time: string
  actualPremium: number
  expectedPremium: number
  rds: number
  ivScore: number
}

interface ReverseDecayScoreChartProps {
  data: DataPoint[]
}

export default function ReverseDecayScoreChart({ data }: ReverseDecayScoreChartProps) {
  // Transform data to show RDS as percentage
  const chartData = data.map((point) => ({
    ...point,
    rdsPercent: point.rds * 100,
  }))

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 border border-slate-700 p-3 rounded-md shadow-lg">
          <p className="text-slate-300 font-medium">{`Time: ${label}`}</p>
          <p className="text-purple-400">{`RDS: ${payload[0].value.toFixed(2)}%`}</p>
          <p className="text-slate-400 text-xs mt-1">
            {payload[0].value < 5
              ? "Normal decay pattern"
              : payload[0].value < 10
                ? "Potential reverse decay"
                : "High conviction reverse decay"}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 0,
            bottom: 30,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="time" stroke="#94a3b8" tick={{ fill: "#94a3b8" }}>
            <Label value="Time (9:15 - 9:25 AM)" position="insideBottom" offset={-20} fill="#94a3b8" />
          </XAxis>
          <YAxis stroke="#94a3b8" tick={{ fill: "#94a3b8" }}>
            <Label value="RDS (%)" angle={-90} position="insideLeft" fill="#94a3b8" />
          </YAxis>
          <Tooltip content={<CustomTooltip />} />
          <Legend verticalAlign="top" height={36} wrapperStyle={{ paddingTop: "10px" }} />
          <ReferenceLine
            y={5}
            stroke="#f59e0b"
            strokeDasharray="3 3"
            label={{ value: "Potential Reverse Decay (5%)", position: "right", fill: "#f59e0b" }}
          />
          <ReferenceLine
            y={10}
            stroke="#ef4444"
            strokeDasharray="3 3"
            label={{ value: "High Conviction (10%)", position: "right", fill: "#ef4444" }}
          />
          <Bar dataKey="rdsPercent" name="Reverse Decay Score (%)" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.rdsPercent < 5 ? "#22c55e" : entry.rdsPercent < 10 ? "#f59e0b" : "#ef4444"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
