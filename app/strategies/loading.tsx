export default function Loading() {
  return (
    <div className="container mx-auto p-4">
      <div className="h-10 bg-gray-200 rounded animate-pulse mb-6"></div>
      <div className="space-y-2">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="h-12 bg-gray-200 rounded animate-pulse"></div>
        ))}
      </div>
    </div>
  )
}
