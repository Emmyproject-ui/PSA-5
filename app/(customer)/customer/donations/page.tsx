"use client"

import { useAuth } from "@/components/auth-provider"
import { customerApi } from "@/lib/api"
import { useEffect, useState } from "react"
import { Download, FileText } from "lucide-react"

export default function MyDonationsPage() {
  const { user, isLoading } = useAuth()
  const [donations, setDonations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'month' | 'year'>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const perPage = 10

  useEffect(() => {
    const fetchDonations = async () => {
      if (isLoading || !user) return
      setLoading(true)
      setError(null)
      try {
        const data = await customerApi.getMyDonations()
        setDonations(data)
      } catch (e: any) {
        setError(e.message || 'Failed to load donations')
      } finally {
        setLoading(false)
      }
    }
    fetchDonations()
  }, [user, isLoading])

  if (isLoading || !user) return null

  // Apply filter
  const now = new Date()
  const filtered = donations.filter((don: any) => {
    if (filter === 'all') return true
    const date = new Date(don.created_at)
    if (filter === 'month') return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
    if (filter === 'year') return date.getFullYear() === now.getFullYear()
    return true
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage))
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage)

  const statusColor = (status: string) => {
    const s = status?.toLowerCase() || 'completed'
    if (s === 'completed' || s === 'confirmed') return 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-500 border-emerald-200 dark:border-emerald-800'
    if (s === 'pending') return 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-500 border-amber-200 dark:border-amber-800'
    return 'bg-gray-100 dark:bg-slate-800/50 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-slate-700'
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 font-primary transition-colors">My Donations</h1>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        {/* Filters */}
        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-1 transition-colors">
          {([['all', 'All Time'], ['month', 'This Month'], ['year', 'This Year']] as const).map(([key, label]) => (
            <button
              key={key}
              onClick={() => { setFilter(key); setCurrentPage(1) }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === key
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <button className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 transition-colors shadow-sm">
          <FileText className="h-4 w-4" />
          Export as PDF
        </button>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-red-700">
          <p className="font-bold">Error loading donations</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        /* Table */
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl overflow-hidden font-primary transition-colors">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 dark:bg-slate-800/50 border-b border-gray-100 dark:border-slate-800">
                  <th className="px-6 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Campaign</th>
                  <th className="px-6 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Amount</th>
                  <th className="px-6 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Date</th>
                  <th className="px-6 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Status</th>
                  <th className="px-6 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Reference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                {paginated.length > 0 ? (
                  paginated.map((don: any, i: number) => (
                    <tr key={i} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{don.cause || "General Donation"}</span>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-gray-100">₦{Number(don.amount_raw || don.amount).toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {don.created_at ? new Date(don.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '-'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase border ${statusColor(don.status)}`}>
                          {don.status || "Confirmed"}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-primary">
                        <span className="text-xs font-mono text-gray-500 dark:text-gray-400">{don.payment_reference || '-'}</span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                      No donations found for this period.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filtered.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between text-sm transition-colors">
              <p className="text-gray-500 dark:text-gray-400">
                Showing {((currentPage - 1) * perPage) + 1} to {Math.min(currentPage * perPage, filtered.length)} of {filtered.length} entries
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  ‹
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                      currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  ›
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
