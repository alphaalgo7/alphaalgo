import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function LiveMonitorLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-slate-200 dark:bg-slate-800/80 dark:border-slate-700">
          <div>
            <Skeleton className="h-10 w-[200px] mb-2" />
            <Skeleton className="h-4 w-[300px]" />
          </div>
          <div className="flex flex-col items-end">
            <Skeleton className="h-8 w-[100px] mb-2" />
            <Skeleton className="h-4 w-[150px]" />
          </div>
        </div>

        {/* Summary Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <Card
                key={i}
                className="border-0 shadow-lg overflow-hidden bg-white/90 backdrop-blur-sm dark:bg-slate-800/90"
              >
                <CardHeader className="pb-2 border-b">
                  <Skeleton className="h-4 w-[100px]" />
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-8 w-[80px]" />
                    <Skeleton className="h-5 w-5 rounded-full" />
                  </div>
                  <Skeleton className="h-3 w-[100px] mt-2" />
                </CardContent>
              </Card>
            ))}
        </div>

        {/* Tabs Skeleton */}
        <div className="bg-white/80 backdrop-blur-sm p-1 rounded-xl shadow-sm border border-slate-200 dark:bg-slate-800/80 dark:border-slate-700">
          <Skeleton className="h-12 w-full rounded-lg" />
        </div>

        {/* Content Skeleton */}
        <Card className="border-0 shadow-lg overflow-hidden bg-white/90 backdrop-blur-sm dark:bg-slate-800/90 mt-6">
          <CardHeader className="flex flex-row items-center justify-between border-b">
            <div>
              <Skeleton className="h-6 w-[200px] mb-2" />
              <Skeleton className="h-4 w-[300px]" />
            </div>
            <Skeleton className="h-9 w-[100px]" />
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
