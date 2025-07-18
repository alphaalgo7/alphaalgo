"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import type { StrategyConfigRow } from "@/lib/types"

interface StrategyConfigTableProps {
  headers: string[]
  dataRows: StrategyConfigRow[]
}

export default function StrategyConfigTable({ headers, dataRows }: StrategyConfigTableProps) {
  if (headers.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-slate-500 dark:text-slate-400">
        <p>No configuration data available. Add some strategies to get started.</p>
      </div>
    )
  }

  const getStrategyTagColor = (tag: string) => {
    if (tag.includes("PLANA")) return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
    if (tag.includes("PLANB")) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    if (tag.includes("PLANC")) return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
    if (tag.includes("DUMMY")) return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
    return "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200"
  }

  const formatCellValue = (value: string, header: string) => {
    if (header === "StrategyTag") {
      return (
        <Badge variant="secondary" className={getStrategyTagColor(value)}>
          {value}
        </Badge>
      )
    }

    if (header === "Enabled") {
      return <Badge variant={value === "TRUE" ? "default" : "secondary"}>{value === "TRUE" ? "✓" : "✗"}</Badge>
    }

    return value || "-"
  }

  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50 dark:bg-slate-800">
            {headers.map((header, index) => (
              <TableHead
                key={index}
                className="font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap px-3 py-3 text-xs"
              >
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {dataRows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={headers.length} className="text-center py-8 text-slate-500 dark:text-slate-400">
                No strategies configured yet. Use the form above to add configurations.
              </TableCell>
            </TableRow>
          ) : (
            dataRows.map((row, rowIndex) => (
              <TableRow
                key={rowIndex}
                className="hover:bg-slate-50 dark:hover:bg-slate-800 border-b border-slate-200 dark:border-slate-700"
              >
                {headers.map((header, cellIndex) => (
                  <TableCell
                    key={cellIndex}
                    className="px-3 py-2 text-xs text-slate-600 dark:text-slate-300 whitespace-nowrap"
                  >
                    {formatCellValue(row[header] || "", header)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
