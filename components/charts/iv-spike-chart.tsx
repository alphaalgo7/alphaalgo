"use client"

import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Label,
  Area,
  AreaChart,
} from "recharts"

interface DataPoint {
  time: string
  actualPremium: number
  expectedPremium: number
  rds: number
  ivScore: number
}

interface IVSpikeChartProps {
  data: DataPoint[]
}

export default function IVSpikeChart({ data }: IVSpikeChartProps) {
  // Transform data to show IV score as percentage
  const chartData = data.map((point) => ({
    ...point,
    ivScorePercent: point.ivScore * 100,
  }))

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 border border-slate-700 p-3 rounded-md shadow-lg">
          <p className="text-slate-300 font-medium">{`Time: ${label}`}</p>
          <p className="text-orange-400">{`IV Change: ${payload[0].value.toFixed(2)}%`}</p>
          <p className="text-slate-400 text-xs mt-1">
            {payload[0].value <= 0
              ? "IV decreasing or stable"
              : payload[0].value < 5
                ? "Slight IV increase"
                : "Significant IV spike"}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 0,
            bottom: 30,
          }}
        >
          <defs>
            <linearGradient id="ivGradientPositive" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f97316" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="ivGradientNegative" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="time" stroke="#94a3b8" tick={{ fill: "#94a3b8" }}>
            <Label value="Time (9:15 - 9:25 AM)" position="insideBottom" offset={-20} fill="#94a3b8" />
          </XAxis>
          <YAxis stroke="#94a3b8" tick={{ fill: "#94a3b8" }}>
            <Label value="IV Change (%)" angle={-90} position="insideLeft" fill="#94a3b8" />
          </YAxis>
          <Tooltip content={<CustomTooltip />} />
          <Legend verticalAlign="top" height={36} wrapperStyle={{ paddingTop: "10px" }} />
          <ReferenceLine y={0} stroke="#94a3b8" strokeDasharray="3 3" />
          <ReferenceLine
            y={5}
            stroke="#f59e0b"
            strokeDasharray="3 3"
            label={{ value: "Significant IV Spike (5%)", position: "right", fill: "#f59e0b" }}
          />
          <Area
            type="monotone"
            dataKey="ivScorePercent"
            name="IV Change (%)"
            stroke="#f97316"
            fill="url(#ivGradientPositive)"
            strokeWidth={2}
            activeDot={{ r: 8, strokeWidth: 2, stroke: "#ea580c" }}
            fillOpacity={1}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
