"use client"

import { useEffect, useState } from 'react'
import AdminLayout from '@/components/admin-layout'
import { adminApi } from '@/lib/api'
import { Heart, User, Mail, Calendar, Phone, CheckCircle, Clock, Search, RefreshCw, XCircle } from 'lucide-react'

interface Volunteer {
  id: number
  user_name: string
  user_email: string
  phone: string
  interests: string[] | null
  availability: string
  status: string
  created_at: string
}

export default function AdminVolunteersPage() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [actionLoading, setActionLoading] = useState<number | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 4000)
  }

  const fetchVolunteers = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await adminApi.getVolunteers()
      setVolunteers(data)
    } catch (e: any) {
      setError(e.message || 'Failed to load volunteers')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVolunteers()
  }, [])

  const handleApprove = async (id: number) => {
    setActionLoading(id)
    try {
      await adminApi.approveVolunteer(id)
      showToast('Volunteer approved successfully!', 'success')
      await fetchVolunteers()
    } catch (e: any) {
      showToast(e.message || 'Failed to approve volunteer', 'error')
    } finally {
      setActionLoading(null)
    }
  }

  const handleReject = async (id: number) => {
    setActionLoading(id)
    try {
      await adminApi.rejectVolunteer(id)
      showToast('Volunteer rejected.', 'success')
      await fetchVolunteers()
    } catch (e: any) {
      showToast(e.message || 'Failed to reject volunteer', 'error')
    } finally {
      setActionLoading(null)
    }
  }

  const filteredVolunteers = volunteers.filter(v => 
    v.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.user_email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusIcon = (status: string) => {
    switch (status) {
        case 'approved': return <CheckCircle className="h-4 w-4 text-emerald-500" />
        case 'pending': return <Clock className="h-4 w-4 text-amber-500" />
        case 'rejected': return <XCircle className="h-4 w-4 text-rose-500" />
        default: return <Clock className="h-4 w-4 text-slate-400" />
    }
  }

  const getStatusClass = (status: string) => {
    switch (status) {
        case 'approved': return 'bg-emerald-100 text-emerald-700'
        case 'pending': return 'bg-amber-100 text-amber-700'
        case 'rejected': return 'bg-red-100 text-red-700'
        default: return 'bg-slate-100 text-slate-600'
    }
  }

  return (
    <AdminLayout title="Volunteer Management">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-xl shadow-lg border transition-all animate-in slide-in-from-top-2 ${
          toast.type === 'success'
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          {toast.type === 'success' ? <CheckCircle className="h-5 w-5 text-emerald-600" /> : <XCircle className="h-5 w-5 text-red-600" />}
          <span className="font-semibold text-sm">{toast.message}</span>
          <button onClick={() => setToast(null)} className="ml-2 text-slate-400 hover:text-slate-600">&times;</button>
        </div>
      )}
      {/* Search & Actions */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
        <button 
          onClick={fetchVolunteers}
          className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors"
        >
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

       {/* Stats */}
       <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-rose-50 rounded-xl">
              <Heart className="h-6 w-6 text-rose-600" />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-800">{volunteers.length}</p>
              <p className="text-sm text-slate-500">Total Volunteers</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-50 rounded-xl">
              <CheckCircle className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-800">{volunteers.filter(v => v.status === 'approved').length}</p>
              <p className="text-sm text-slate-500">Active / Approved</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-50 rounded-xl">
              <Clock className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-800">{volunteers.filter(v => v.status === 'pending').length}</p>
              <p className="text-sm text-slate-500">Pending Review</p>
            </div>
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-red-700">
          <p className="font-bold">Error loading volunteers</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-500 font-medium">Loading volunteers...</p>
          </div>
        </div>
      )}

      {!loading && !error && (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="text-left px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-wider">Volunteer</th>
                  <th className="text-left px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-wider">Contact</th>
                  <th className="text-left px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-wider">Joined</th>
                  <th className="text-left px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredVolunteers.map((volunteer) => (
                  <tr key={volunteer.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 font-bold">
                          {volunteer.user_name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-bold text-slate-800">{volunteer.user_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-slate-600 text-sm">
                          <Mail size={14} />
                          {volunteer.user_email}
                        </div>
                        <div className="flex items-center gap-2 text-slate-600 text-sm">
                          <Phone size={14} />
                          {volunteer.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                       <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black uppercase ${getStatusClass(volunteer.status)}`}>
                        {getStatusIcon(volunteer.status)}
                        {volunteer.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-500 text-sm">
                        <Calendar size={14} />
                        {new Date(volunteer.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {volunteer.status !== 'approved' && (
                          <button
                            onClick={() => handleApprove(volunteer.id)}
                            disabled={actionLoading === volunteer.id}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <CheckCircle size={14} />
                            {actionLoading === volunteer.id ? 'Processing...' : 'Approve'}
                          </button>
                        )}
                        {volunteer.status !== 'rejected' && (
                          <button
                            onClick={() => handleReject(volunteer.id)}
                            disabled={actionLoading === volunteer.id}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-rose-600 text-white text-xs font-bold rounded-lg hover:bg-rose-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <XCircle size={14} />
                            {actionLoading === volunteer.id ? 'Processing...' : 'Reject'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredVolunteers.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                      No volunteers found
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
