export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 py-6 sm:py-8">
      <main className="container mx-auto px-4">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-300 dark:bg-slate-700 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-2/3 mb-8"></div>

          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg p-6">
            <div className="h-6 bg-slate-300 dark:bg-slate-700 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-4 bg-slate-200 dark:bg-slate-800 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
