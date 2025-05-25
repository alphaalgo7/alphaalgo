"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Download, Filter, Search } from "lucide-react"

interface DataPoint {
  time: string
  actualPremium: number
  expectedPremium: number
  rds: number
  ivScore: number
}

interface DataTableProps {
  data: DataPoint[]
}

export default function DataTable({ data }: DataTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortConfig, setSortConfig] = useState<{
    key: keyof DataPoint
    direction: "ascending" | "descending"
  } | null>(null)

  // Filter data based on search term
  const filteredData = data.filter((point) => point.time.toLowerCase().includes(searchTerm.toLowerCase()))

  // Sort data based on sort config
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortConfig) return 0

    const { key, direction } = sortConfig

    if (a[key] < b[key]) {
      return direction === "ascending" ? -1 : 1
    }
    if (a[key] > b[key]) {
      return direction === "ascending" ? 1 : -1
    }
    return 0
  })

  // Handle sort
  const handleSort = (key: keyof DataPoint) => {
    let direction: "ascending" | "descending" = "ascending"

    if (sortConfig && sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    }

    setSortConfig({ key, direction })
  }

  // Get sort direction for a column
  const getSortDirection = (key: keyof DataPoint) => {
    if (!sortConfig || sortConfig.key !== key) return null
    return sortConfig.direction
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search by time..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-slate-900 border-slate-700 text-white"
          />
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="border-slate-700 text-slate-200">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSearchTerm("")}>Show All</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSearchTerm("9:15")}>Opening (9:15)</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSearchTerm("9:25")}>Closing (9:25)</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" className="border-slate-700 text-slate-200">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="rounded-md border border-slate-700 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-800">
            <TableRow className="hover:bg-slate-800/80 border-slate-700">
              <TableHead className="text-slate-300 cursor-pointer" onClick={() => handleSort("time")}>
                Time
                {getSortDirection("time") === "ascending" && " ↑"}
                {getSortDirection("time") === "descending" && " ↓"}
              </TableHead>
              <TableHead
                className="text-right text-slate-300 cursor-pointer"
                onClick={() => handleSort("actualPremium")}
              >
                Actual Premium (₹)
                {getSortDirection("actualPremium") === "ascending" && " ↑"}
                {getSortDirection("actualPremium") === "descending" && " ↓"}
              </TableHead>
              <TableHead
                className="text-right text-slate-300 cursor-pointer"
                onClick={() => handleSort("expectedPremium")}
              >
                Expected Premium (₹)
                {getSortDirection("expectedPremium") === "ascending" && " ↑"}
                {getSortDirection("expectedPremium") === "descending" && " ↓"}
              </TableHead>
              <TableHead className="text-right text-slate-300 cursor-pointer" onClick={() => handleSort("rds")}>
                RDS (%)
                {getSortDirection("rds") === "ascending" && " ↑"}
                {getSortDirection("rds") === "descending" && " ↓"}
              </TableHead>
              <TableHead className="text-right text-slate-300 cursor-pointer" onClick={() => handleSort("ivScore")}>
                IV Score (%)
                {getSortDirection("ivScore") === "ascending" && " ↑"}
                {getSortDirection("ivScore") === "descending" && " ↓"}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-slate-400">
                  No data found
                </TableCell>
              </TableRow>
            ) : (
              sortedData.map((point, index) => (
                <TableRow
                  key={index}
                  className={`
                    border-slate-700 hover:bg-slate-800/50
                    ${point.rds > 0.1 ? "bg-red-900/20" : point.rds > 0.05 ? "bg-amber-900/20" : ""}
                  `}
                >
                  <TableCell className="font-medium text-slate-300">{point.time}</TableCell>
                  <TableCell className="text-right text-blue-400">{point.actualPremium.toFixed(2)}</TableCell>
                  <TableCell className="text-right text-green-400">{point.expectedPremium.toFixed(2)}</TableCell>
                  <TableCell
                    className={`text-right ${
                      point.rds > 0.1 ? "text-red-400" : point.rds > 0.05 ? "text-amber-400" : "text-green-400"
                    }`}
                  >
                    {(point.rds * 100).toFixed(2)}%
                  </TableCell>
                  <TableCell
                    className={`text-right ${
                      point.ivScore > 0.05 ? "text-red-400" : point.ivScore > 0 ? "text-amber-400" : "text-blue-400"
                    }`}
                  >
                    {(point.ivScore * 100).toFixed(2)}%
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
