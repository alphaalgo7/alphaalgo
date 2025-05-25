import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="flex flex-col h-screen">
      {/* Navigation Tabs Skeleton */}
      <div className="bg-slate-700 p-2">
        <div className="flex space-x-4">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
          <div className="ml-auto">
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="flex-1 p-4">
        <Skeleton className="h-8 w-full mb-4" />
        <div className="space-y-2">
          {Array(8)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
        </div>
      </div>
    </div>
  )
}
