"use client"

import { useEffect, useState } from 'react'
import AdminLayout from '@/components/admin-layout'
import { adminApi } from '@/lib/api'
import { DollarSign, User, Mail, Calendar, CreditCard, Search, RefreshCw, CheckCircle, XCircle, Clock } from 'lucide-react'

interface Contribution {
  id: string
  type: string
  user_name: string
  user_email: string
  amount: number
  status: string
  reference: string
  payment_method: string
  created_at: string
}

export default function AdminContributionsPage() {
  const [contributions, setContributions] = useState<Contribution[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'pending' | 'failed'>('all')

  const fetchContributions = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await adminApi.getContributions()
      setContributions(data)
    } catch (e: any) {
      setError(e.message || 'Failed to load contributions')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchContributions()
  }, [])

  const filteredContributions = contributions.filter(c => {
    const matchesSearch = c.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.user_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.reference.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || c.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const totalAmount = contributions.reduce((sum, c) => sum + c.amount, 0)
  const completedAmount = contributions.filter(c => c.status === 'completed').reduce((sum, c) => sum + c.amount, 0)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-emerald-500" />
      case 'pending': return <Clock className="h-4 w-4 text-amber-500" />
      case 'failed': return <XCircle className="h-4 w-4 text-red-500" />
      default: return <Clock className="h-4 w-4 text-slate-400" />
    }
  }

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-emerald-100 text-emerald-700'
      case 'pending': return 'bg-amber-100 text-amber-700'
      case 'failed': return 'bg-red-100 text-red-700'
      default: return 'bg-slate-100 text-slate-600'
    }
  }

  return (
    <AdminLayout title="Contributions & Payments">
      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search by name, email, or reference..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
          className="px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <option value="all">All Status</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
        <button 
          onClick={fetchContributions}
          className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors"
        >
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 min-w-0">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-50 rounded-xl flex-shrink-0">
              <DollarSign className="h-6 w-6 text-emerald-600" />
            </div>
            <div className="min-w-0">
              <p className="text-2xl font-black text-slate-800 truncate">₦{totalAmount.toLocaleString()}</p>
              <p className="text-sm text-slate-500">Total Received</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 min-w-0">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-xl flex-shrink-0">
              <CheckCircle className="h-6 w-6 text-blue-600" />
            </div>
            <div className="min-w-0">
              <p className="text-2xl font-black text-slate-800 truncate">₦{completedAmount.toLocaleString()}</p>
              <p className="text-sm text-slate-500">Confirmed</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 min-w-0">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-50 rounded-xl flex-shrink-0">
              <CreditCard className="h-6 w-6 text-purple-600" />
            </div>
            <div className="min-w-0">
              <p className="text-2xl font-black text-slate-800">{contributions.length}</p>
              <p className="text-sm text-slate-500">Total Transactions</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 min-w-0">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-50 rounded-xl flex-shrink-0">
              <Clock className="h-6 w-6 text-amber-600" />
            </div>
            <div className="min-w-0">
              <p className="text-2xl font-black text-slate-800">{contributions.filter(c => c.status === 'pending').length}</p>
              <p className="text-sm text-slate-500">Pending</p>
            </div>
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-red-700">
          <p className="font-bold">Error loading contributions</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-500 font-medium">Loading contributions...</p>
          </div>
        </div>
      )}

      {/* Contributions Table */}
      {!loading && !error && (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="text-left px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-wider">Contributor</th>
                  <th className="text-left px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-wider">Amount</th>
                  <th className="text-left px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-wider">Reference</th>
                  <th className="text-left px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-wider">Method</th>
                  <th className="text-left px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredContributions.map((contribution) => (
                  <tr key={contribution.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold">
                          {contribution.user_name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{contribution.user_name}</p>
                          <p className="text-xs text-slate-500 flex items-center gap-1">
                            <Mail size={10} />
                            {contribution.user_email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-black text-lg text-emerald-600">₦{contribution.amount.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black uppercase ${getStatusClass(contribution.status)}`}>
                        {getStatusIcon(contribution.status)}
                        {contribution.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <code className="px-2 py-1 bg-slate-100 rounded text-xs font-mono text-slate-600">
                        {contribution.reference}
                      </code>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-600">
                        <CreditCard size={14} />
                        {contribution.payment_method}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-500 text-sm">
                        <Calendar size={14} />
                        {new Date(contribution.created_at).toLocaleDateString()}
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredContributions.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                      No contributions found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
