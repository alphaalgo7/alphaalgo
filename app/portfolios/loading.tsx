export default function Loading() {
  return (
    <div className="w-full max-w-[1300px] mx-auto p-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2 rounded-lg font-bold">
            Moneey.ai
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold">Portfolios</h1>
            <span className="text-slate-500 text-xs">Manage your trading strategies</span>
          </div>
        </div>
      </div>

      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    </div>
  )
}
