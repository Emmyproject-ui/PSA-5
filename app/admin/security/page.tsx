"use client"

import { useEffect, useState } from 'react'
import AdminLayout from '@/components/admin-layout'
import { adminApi } from '@/lib/api'
import { Shield, User, Mail, Calendar, Search, RefreshCw, LogIn, AlertTriangle, CheckCircle, Monitor, Globe } from 'lucide-react'

interface SecurityLog {
  id: string
  type: string
  event: string
  description: string
  user_name: string
  user_email: string
  ip_address: string
  user_agent: string
  created_at: string
}

export default function AdminSecurityPage() {
  const [logs, setLogs] = useState<SecurityLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterEvent, setFilterEvent] = useState<'all' | 'successful_login' | 'failed_login' | 'admin_access'>('all')

  const fetchLogs = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await adminApi.getSecurityLogs()
      setLogs(data)
    } catch (e: any) {
      setError(e.message || 'Failed to load security logs')
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
      log.ip_address.includes(searchTerm)
    const matchesFilter = filterEvent === 'all' || log.event === filterEvent
    return matchesSearch && matchesFilter
  })

  const getEventIcon = (event: string) => {
    switch (event) {
      case 'successful_login': return <CheckCircle className="h-5 w-5 text-emerald-500" />
      case 'failed_login': return <AlertTriangle className="h-5 w-5 text-red-500" />
      case 'admin_access': return <Shield className="h-5 w-5 text-blue-500" />
      default: return <LogIn className="h-5 w-5 text-slate-400" />
    }
  }

  const getEventBgClass = (event: string) => {
    switch (event) {
      case 'successful_login': return 'bg-emerald-50'
      case 'failed_login': return 'bg-red-50'
      case 'admin_access': return 'bg-blue-50'
      default: return 'bg-slate-50'
    }
  }

  const getEventLabel = (event: string) => {
    switch (event) {
      case 'successful_login': return 'Login Success'
      case 'failed_login': return 'Login Failed'
      case 'admin_access': return 'Admin Access'
      default: return event
    }
  }

  return (
    <AdminLayout title="Security Center">
      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search by name, email, or IP address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
        <select
          value={filterEvent}
          onChange={(e) => setFilterEvent(e.target.value as any)}
          className="px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <option value="all">All Events</option>
          <option value="successful_login">Successful Logins</option>
          <option value="failed_login">Failed Logins</option>
          <option value="admin_access">Admin Access</option>
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
              <Shield className="h-6 w-6 text-slate-600" />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-800">{logs.length}</p>
              <p className="text-sm text-slate-500">Total Events</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-50 rounded-xl">
              <CheckCircle className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-800">{logs.filter(l => l.event === 'successful_login').length}</p>
              <p className="text-sm text-slate-500">Successful Logins</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-50 rounded-xl">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-800">{logs.filter(l => l.event === 'failed_login').length}</p>
              <p className="text-sm text-slate-500">Failed Attempts</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-xl">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-800">{logs.filter(l => l.event === 'admin_access').length}</p>
              <p className="text-sm text-slate-500">Admin Actions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-red-700">
          <p className="font-bold">Error loading security logs</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-500 font-medium">Loading security logs...</p>
          </div>
        </div>
      )}

      {/* Security Logs Table */}
      {!loading && !error && (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="text-left px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-wider">Event</th>
                  <th className="text-left px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-wider">User</th>
                  <th className="text-left px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-wider">IP Address</th>
                  <th className="text-left px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-wider">Device</th>
                  <th className="text-left px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-wider">Date & Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${getEventBgClass(log.event)}`}>
                          {getEventIcon(log.event)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{getEventLabel(log.event)}</p>
                          <p className="text-xs text-slate-500">{log.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold text-slate-800 flex items-center gap-1">
                          <User size={14} />
                          {log.user_name}
                        </p>
                        <p className="text-xs text-slate-500 flex items-center gap-1">
                          <Mail size={10} />
                          {log.user_email}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Globe size={14} />
                        <code className="px-2 py-1 bg-slate-100 rounded text-xs font-mono">
                          {log.ip_address}
                        </code>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-500 text-xs max-w-[200px] truncate">
                        <Monitor size={14} className="shrink-0" />
                        {log.user_agent.substring(0, 30)}...
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-500 text-sm">
                        <Calendar size={14} />
                        <div>
                          <p>{new Date(log.created_at).toLocaleDateString()}</p>
                          <p className="text-xs text-slate-400">{new Date(log.created_at).toLocaleTimeString()}</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredLogs.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                      No security logs found
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
