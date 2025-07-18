"use client"

import { useMemo } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { StrategyConfigRow } from "@/lib/types"

interface StrategyConfigTableProps {
  headers: string[]
  dataRows: StrategyConfigRow[]
}

export default function StrategyConfigTable({ headers = [], dataRows = [] }: StrategyConfigTableProps) {
  const memoizedData = useMemo(() => {
    if (!Array.isArray(dataRows)) return []
    return dataRows
  }, [dataRows])

  const memoizedHeaders = useMemo(() => {
    if (!Array.isArray(headers)) return []
    return headers
  }, [headers])

  if (memoizedHeaders.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-500 dark:text-slate-400">
        <p>No headers available</p>
      </div>
    )
  }

  if (memoizedData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-500 dark:text-slate-400">
        <div className="text-center">
          <p className="text-lg font-medium mb-2">No configurations yet</p>
          <p className="text-sm">Add some strategy configurations to see them here.</p>
        </div>
      </div>
    )
  }

  return (
    <ScrollArea className="h-[600px] w-full">
      <div className="min-w-full">
        <Table>
          <TableHeader className="sticky top-0 bg-slate-50 dark:bg-slate-800 z-10">
            <TableRow>
              {memoizedHeaders.map((header, index) => (
                <TableHead
                  key={`${header}-${index}`}
                  className="font-semibold text-slate-700 dark:text-slate-300 border-r border-slate-200 dark:border-slate-700 last:border-r-0 min-w-[120px] whitespace-nowrap"
                >
                  {header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {memoizedData.map((row, rowIndex) => (
              <TableRow
                key={`row-${rowIndex}`}
                className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                {memoizedHeaders.map((header, colIndex) => {
                  const cellValue = row[header] || ""
                  const isStrategyTag = header === "StrategyTag"
                  const isProfitLocking = header === "Profit Locking"
                  const isEnabled = header === "Enabled"

                  return (
                    <TableCell
                      key={`${rowIndex}-${colIndex}`}
                      className="border-r border-slate-200 dark:border-slate-700 last:border-r-0 text-sm"
                    >
                      {isEnabled ? (
                        <Badge
                          variant={cellValue.toLowerCase() === "true" ? "default" : "secondary"}
                          className={
                            cellValue.toLowerCase() === "true"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200"
                          }
                        >
                          {cellValue.toLowerCase() === "true" ? "Enabled" : "Disabled"}
                        </Badge>
                      ) : isStrategyTag ? (
                        <Badge
                          variant="outline"
                          className="font-mono text-xs bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-900 dark:text-sky-200 dark:border-sky-800"
                        >
                          {cellValue}
                        </Badge>
                      ) : isProfitLocking && cellValue.includes("~") ? (
                        <div className="space-y-1">
                          {cellValue.split("~").map((value, idx) => (
                            <Badge
                              key={idx}
                              variant="secondary"
                              className="text-xs mr-1 bg-purple-50 text-purple-700 dark:bg-purple-900 dark:text-purple-200"
                            >
                              {value}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <span className="text-slate-700 dark:text-slate-300 font-medium">
                          {cellValue || (
                            <span className="text-slate-400 dark:text-slate-500 italic text-xs">Empty</span>
                          )}
                        </span>
                      )}
                    </TableCell>
                  )
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </ScrollArea>
  )
}
