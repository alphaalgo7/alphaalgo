"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { BacktestResult } from "@/lib/backtest-service"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ArrowUpCircle, ArrowDownCircle, AlertCircle } from "lucide-react"

interface BacktestResultsProps {
  results: BacktestResult | null
}

export default function BacktestResults({ results }: BacktestResultsProps) {
  if (!results) return null

  const { trades, summary, equityCurve } = results

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(value)
  }

  // Custom tooltip for equity curve
  const EquityCurveTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 border border-slate-700 p-3 rounded-md shadow-lg">
          <p className="text-slate-300 font-medium">{`Date: ${label}`}</p>
          <p className="text-blue-400">{`Equity: ${formatCurrency(payload[0].value)}`}</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card
          className={`bg-slate-800/50 border-slate-700 ${summary.netPnl >= 0 ? "border-l-4 border-l-green-500" : "border-l-4 border-l-red-500"}`}
        >
          <CardContent className="p-4">
            <p className="text-xs font-medium text-slate-400">Net P&L</p>
            <p className={`text-2xl font-bold mt-1 ${summary.netPnl >= 0 ? "text-green-400" : "text-red-400"}`}>
              {formatCurrency(summary.netPnl)}
            </p>
            <p className={`text-xs font-medium mt-1 ${summary.netPnlPercent >= 0 ? "text-green-400" : "text-red-400"}`}>
              {summary.netPnlPercent.toFixed(2)}%
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <p className="text-xs font-medium text-slate-400">Win Rate</p>
            <p className="text-2xl font-bold mt-1 text-blue-400">{(summary.winRate * 100).toFixed(1)}%</p>
            <p className="text-xs font-medium mt-1 text-slate-400">
              {summary.winningTrades} / {summary.totalTrades} trades
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <p className="text-xs font-medium text-slate-400">Profit Factor</p>
            <p className="text-2xl font-bold mt-1 text-purple-400">{summary.profitFactor.toFixed(2)}</p>
            <p className="text-xs font-medium mt-1 text-slate-400">Gross Profit / Gross Loss</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <p className="text-xs font-medium text-slate-400">Max Drawdown</p>
            <p className="text-2xl font-bold mt-1 text-amber-400">{formatCurrency(summary.maxDrawdown)}</p>
            <p className="text-xs font-medium mt-1 text-slate-400">Largest equity drop</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle>Equity Curve</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={equityCurve}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="date" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip content={<EquityCurveTooltip />} />
                <Line
                  type="monotone"
                  dataKey="equity"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="trades" className="w-full">
        <TabsList className="bg-slate-800/70 border border-slate-700">
          <TabsTrigger value="trades" className="data-[state=active]:bg-blue-600">
            Trades
          </TabsTrigger>
          <TabsTrigger value="performance" className="data-[state=active]:bg-blue-600">
            Performance
          </TabsTrigger>
          <TabsTrigger value="metrics" className="data-[state=active]:bg-blue-600">
            Metrics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="trades" className="mt-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle>Trade History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border border-slate-700 overflow-hidden">
                <Table>
                  <TableHeader className="bg-slate-800">
                    <TableRow className="hover:bg-slate-800/80 border-slate-700">
                      <TableHead className="text-slate-300">#</TableHead>
                      <TableHead className="text-slate-300">Entry Date</TableHead>
                      <TableHead className="text-slate-300">Exit Date</TableHead>
                      <TableHead className="text-right text-slate-300">Entry Price</TableHead>
                      <TableHead className="text-right text-slate-300">Exit Price</TableHead>
                      <TableHead className="text-right text-slate-300">P&L</TableHead>
                      <TableHead className="text-right text-slate-300">P&L %</TableHead>
                      <TableHead className="text-center text-slate-300">Duration</TableHead>
                      <TableHead className="text-center text-slate-300">Exit Reason</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {trades.map((trade, index) => (
                      <TableRow
                        key={index}
                        className={`
                          border-slate-700 hover:bg-slate-800/50
                          ${trade.pnl > 0 ? "bg-green-900/10" : "bg-red-900/10"}
                        `}
                      >
                        <TableCell className="font-medium text-slate-300">{index + 1}</TableCell>
                        <TableCell>{trade.entryDate}</TableCell>
                        <TableCell>{trade.exitDate}</TableCell>
                        <TableCell className="text-right">{formatCurrency(trade.entryPrice)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(trade.exitPrice)}</TableCell>
                        <TableCell
                          className={`text-right font-medium ${trade.pnl >= 0 ? "text-green-400" : "text-red-400"}`}
                        >
                          {formatCurrency(trade.pnl)}
                        </TableCell>
                        <TableCell className={`text-right ${trade.pnl >= 0 ? "text-green-400" : "text-red-400"}`}>
                          {trade.pnlPercent.toFixed(2)}%
                        </TableCell>
                        <TableCell className="text-center">{trade.duration} days</TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant="outline"
                            className={`
                              ${
                                trade.exitReason === "target"
                                  ? "border-green-500 text-green-400"
                                  : trade.exitReason === "stopLoss"
                                    ? "border-red-500 text-red-400"
                                    : trade.exitReason === "threshold"
                                      ? "border-blue-500 text-blue-400"
                                      : "border-slate-500 text-slate-400"
                              }
                            `}
                          >
                            {trade.exitReason === "target"
                              ? "Target"
                              : trade.exitReason === "stopLoss"
                                ? "Stop Loss"
                                : trade.exitReason === "threshold"
                                  ? "Threshold"
                                  : "End of Period"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="mt-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle>Performance Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-4 text-slate-200">Trade Outcomes</h3>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { name: "Winning Trades", value: summary.winningTrades },
                          { name: "Losing Trades", value: summary.losingTrades },
                        ]}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="name" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip
                          contentStyle={{ backgroundColor: "#1e293b", borderColor: "#475569" }}
                          itemStyle={{ color: "#f1f5f9" }}
                        />
                        <Bar dataKey="value" fill="#3b82f6">
                          <Cell fill="#22c55e" />
                          <Cell fill="#ef4444" />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4 text-slate-200">Trade P&L Distribution</h3>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={trades.map((trade, index) => ({
                          id: index + 1,
                          pnl: trade.pnl,
                        }))}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="id" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip
                          contentStyle={{ backgroundColor: "#1e293b", borderColor: "#475569" }}
                          itemStyle={{ color: "#f1f5f9" }}
                          formatter={(value: number) => [formatCurrency(value), "P&L"]}
                        />
                        <Bar dataKey="pnl" fill="#3b82f6">
                          {trades.map((trade, index) => (
                            <Cell key={`cell-${index}`} fill={trade.pnl >= 0 ? "#22c55e" : "#ef4444"} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics" className="mt-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle>Strategy Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-slate-800 rounded-md">
                    <div className="flex items-center gap-2">
                      <ArrowUpCircle className="h-5 w-5 text-green-400" />
                      <span className="text-slate-200">Average Win</span>
                    </div>
                    <span className="text-green-400 font-medium">{formatCurrency(summary.averageWin)}</span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-slate-800 rounded-md">
                    <div className="flex items-center gap-2">
                      <ArrowDownCircle className="h-5 w-5 text-red-400" />
                      <span className="text-slate-200">Average Loss</span>
                    </div>
                    <span className="text-red-400 font-medium">{formatCurrency(summary.averageLoss)}</span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-slate-800 rounded-md">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-amber-400" />
                      <span className="text-slate-200">Profit Factor</span>
                    </div>
                    <span className="text-amber-400 font-medium">{summary.profitFactor.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-slate-800 rounded-md">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-purple-400" />
                      <span className="text-slate-200">Sharpe Ratio</span>
                    </div>
                    <span className="text-purple-400 font-medium">{summary.sharpeRatio.toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-slate-800 rounded-md">
                    <h4 className="text-sm font-medium text-slate-400 mb-2">Trade Analysis</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-300">Total Trades</span>
                        <span className="text-blue-400 font-medium">{summary.totalTrades}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-300">Winning Trades</span>
                        <span className="text-green-400 font-medium">{summary.winningTrades}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-300">Losing Trades</span>
                        <span className="text-red-400 font-medium">{summary.losingTrades}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-300">Win Rate</span>
                        <span className="text-blue-400 font-medium">{(summary.winRate * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-800 rounded-md">
                    <h4 className="text-sm font-medium text-slate-400 mb-2">Risk Metrics</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-300">Max Drawdown</span>
                        <span className="text-amber-400 font-medium">{formatCurrency(summary.maxDrawdown)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-300">Win/Loss Ratio</span>
                        <span className="text-purple-400 font-medium">
                          {summary.averageLoss === 0 ? "∞" : (summary.averageWin / summary.averageLoss).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
