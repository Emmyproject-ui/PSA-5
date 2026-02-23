"use client"

import { useEffect, useState } from 'react'
import AdminLayout from '@/components/admin-layout'
import { adminApi } from '@/lib/api'
import { Activity, User, Mail, Calendar, Search, RefreshCw, UserPlus, DollarSign, Heart, Globe } from 'lucide-react'

interface ActivityLog {
  id: string
  type: string
  description: string
  user_name: string
  user_email: string
  ip_address: string
  created_at: string
}

export default function AdminActivityLogsPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'registration' | 'donation' | 'volunteer'>('all')

  const fetchLogs = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await adminApi.getActivityLogs()
      setLogs(data)
    } catch (e: any) {
      setError(e.message || 'Failed to load activity logs')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLogs()
  }, [])

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterType === 'all' || log.type === filterType
    return matchesSearch && matchesFilter
  })

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'registration': return <UserPlus className="h-5 w-5 text-blue-500" />
      case 'donation': return <DollarSign className="h-5 w-5 text-emerald-500" />
      case 'volunteer': return <Heart className="h-5 w-5 text-rose-500" />
      default: return <Activity className="h-5 w-5 text-slate-400" />
    }
  }

  const getTypeBgClass = (type: string) => {
    switch (type) {
      case 'registration': return 'bg-blue-50'
      case 'donation': return 'bg-emerald-50'
      case 'volunteer': return 'bg-rose-50'
      default: return 'bg-slate-50'
    }
  }

  return (
    <AdminLayout title="Activity Logs">
      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search by name, email, or activity..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as any)}
          className="px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <option value="all">All Activities</option>
          <option value="registration">Registrations</option>
          <option value="donation">Donations</option>
          <option value="volunteer">Volunteers</option>
        </select>
        <button 
          onClick={fetchLogs}
          className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors"
        >
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-slate-100 rounded-xl">
              <Activity className="h-6 w-6 text-slate-600" />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-800">{logs.length}</p>
              <p className="text-sm text-slate-500">Total Activities</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-xl">
              <UserPlus className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-800">{logs.filter(l => l.type === 'registration').length}</p>
              <p className="text-sm text-slate-500">Registrations</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-50 rounded-xl">
              <DollarSign className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-800">{logs.filter(l => l.type === 'donation').length}</p>
              <p className="text-sm text-slate-500">Donations</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-rose-50 rounded-xl">
              <Heart className="h-6 w-6 text-rose-600" />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-800">{logs.filter(l => l.type === 'volunteer').length}</p>
              <p className="text-sm text-slate-500">Volunteer Signups</p>
            </div>
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-red-700">
          <p className="font-bold">Error loading activity logs</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-500 font-medium">Loading activity logs...</p>
          </div>
        </div>
      )}

      {/* Activity Timeline */}
      {!loading && !error && (
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <div className="space-y-4">
            {filteredLogs.map((log, index) => (
              <div key={log.id} className="flex gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors">
                <div className={`p-3 rounded-xl ${getTypeBgClass(log.type)} shrink-0`}>
                  {getTypeIcon(log.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-800">{log.description}</p>
                  <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <User size={14} />
                      {log.user_name}
                    </span>
                    <span className="flex items-center gap-1">
                      <Mail size={14} />
                      {log.user_email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Globe size={14} />
                      {log.ip_address}
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="flex items-center gap-2 text-slate-500 text-sm">
                    <Calendar size={14} />
                    {new Date(log.created_at).toLocaleDateString()}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    {new Date(log.created_at).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            {filteredLogs.length === 0 && (
              <div className="text-center py-12 text-slate-500">
                No activity logs found
              </div>
            )}
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
