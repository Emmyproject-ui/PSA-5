"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import AdminLayout from '@/components/admin-layout'
import { adminApi } from '@/lib/api'
import { Heart, Users, HandHeart, MoreHorizontal, CreditCard, RefreshCw } from 'lucide-react'
import { useAuth } from '@/components/auth-provider'

// Types
interface DonationItem {
  id: string
  user_name: string
  user_email: string
  amount: string
  amount_raw: number
  payment_reference: string
  cause: string
  status: string
  created_at: string
}

interface VolunteerItem {
  id: number
  user_name: string
  user_email: string
  skills: string
  availability: string
  status: string
  created_at: string
}

interface Stats {
  total_users: number
  total_donations: number
  total_volunteers: number
  pending_volunteers: number
  recent_logins: number
  recent_donations: number
}

export default function AdminDashboard() {
  const { user, isLoading } = useAuth()
  const [stats, setStats] = useState<Stats | null>(null)
  const [donations, setDonations] = useState<DonationItem[]>([])
  const [volunteers, setVolunteers] = useState<VolunteerItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [statsRes, donRes, volRes] = await Promise.all([
        adminApi.getStats(),
        adminApi.getDonations(),
        adminApi.getVolunteers()
      ])
      setStats(statsRes)
      setDonations(donRes)
      setVolunteers(volRes)
    } catch (e: any) {
      setError(e.message || 'Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isLoading) return
    if (!user) {
      router.push('/auth/signin')
      return
    }
    if (user.role !== 'admin') {
      router.push('/customer/dashboard')
      return
    }
    fetchData()
  }, [user, isLoading, router])

  // Build activity feed from real data
  const activityFeed = [
    ...donations.slice(0, 5).map((d) => ({
      id: `don-${d.id}`,
      type: 'donation' as const,
      name: d.user_name,
      action: 'donated',
      amount: `₦${Number(d.amount_raw || d.amount).toLocaleString()}`,
      time: timeAgo(d.created_at),
    })),
    ...volunteers.slice(0, 5).map((v) => ({
      id: `vol-${v.id}`,
      type: 'volunteer' as const,
      name: v.user_name,
      action: 'volunteered for',
      target: v.skills || 'General',
      time: timeAgo(v.created_at),
    })),
  ].sort((a, b) => 0) // already sorted by latest from API
  .slice(0, 6)

  const totalDonationAmount = donations.reduce((sum, d) => sum + (Number(d.amount_raw) || Number(d.amount) || 0), 0)

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Title */}
        <div className="flex items-center justify-between font-primary">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-gray-100 transition-colors">Dashboard</h1>
          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-slate-800 dark:hover:bg-blue-700 transition-colors"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
            <p className="font-bold">Error loading dashboard</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard
            icon={<CreditCard className="h-6 w-6 text-white" />}
            label="Total Donations"
            value={`₦${totalDonationAmount.toLocaleString()}`}
            bgColor="bg-gradient-to-r from-blue-600 to-blue-500"
          />
          <StatCard
            icon={<Heart className="h-6 w-6 text-white" fill="currentColor" />}
            label="Donations Count"
            value={stats?.total_donations?.toString() || '0'}
            bgColor="bg-gradient-to-r from-rose-500 to-rose-400"
          />
          <StatCard
            icon={<Users className="h-6 w-6 text-white" />}
            label="Total Users"
            value={stats?.total_users?.toString() || '0'}
            bgColor="bg-gradient-to-r from-teal-500 to-teal-400"
          />
          <StatCard
            icon={<HandHeart className="h-6 w-6 text-white" />}
            label="Volunteers"
            value={stats?.total_volunteers?.toString() || '0'}
            bgColor="bg-gradient-to-r from-cyan-500 to-cyan-400"
          />
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden font-primary transition-colors">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800 dark:text-gray-100">Recent Activity</h2>
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {activityFeed.length > 0 ? activityFeed.map((item) => (
                <div key={item.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                      item.type === 'donation' ? 'bg-rose-500' : 'bg-emerald-500'
                    }`}>
                      {item.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm text-slate-700 dark:text-gray-300">
                        <span className="font-semibold text-slate-900 dark:text-gray-100">{item.name}</span>
                        {' '}{item.action}
                        {'amount' in item && <span className="font-semibold text-slate-900 dark:text-gray-100"> {item.amount}</span>}
                        {'target' in item && <span className="font-semibold text-slate-900 dark:text-gray-100"> {item.target}</span>}
                      </p>
                      <p className="text-xs text-slate-400 dark:text-gray-500 font-medium">{item.time}</p>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="px-6 py-12 text-center text-slate-400 dark:text-gray-500 font-medium">No activity yet</div>
              )}
            </div>
          )}
          <div className="px-6 py-3 border-t border-slate-100 dark:border-slate-800 text-right">
            <Link href="/admin/activity-logs" className="text-sm font-semibold text-primary dark:text-blue-400 hover:underline">
              View All Activity
            </Link>
          </div>
        </div>

        {/* Two Column Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Latest Donations */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden font-primary transition-colors">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-800 dark:text-gray-100">Latest Donations</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50/50 dark:bg-slate-800/50 transition-colors">
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {donations.slice(0, 5).map((donation) => (
                    <tr key={donation.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-xs font-bold">
                            {donation.user_name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-800 dark:text-gray-100">{donation.user_name}</p>
                            <p className="text-[11px] text-slate-400 dark:text-gray-500 font-medium">{donation.user_email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-slate-800 dark:text-gray-100">₦{Number(donation.amount_raw || donation.amount).toLocaleString()}</p>
                        <p className="text-[11px] text-slate-400 dark:text-gray-500 font-medium">{donation.payment_reference?.slice(-8) || ''}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-gray-400 font-medium">{timeAgo(donation.created_at)}</td>
                    </tr>
                  ))}
                  {donations.length === 0 && !loading && (
                    <tr><td colSpan={3} className="px-6 py-8 text-center text-slate-400">No donations yet</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-3 border-t border-slate-100 dark:border-slate-800 text-right">
              <Link href="/admin/contributions" className="text-sm font-semibold text-primary dark:text-blue-400 hover:underline">
                View All Donations
              </Link>
            </div>
          </div>

          {/* Recent Volunteers */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden font-primary transition-colors">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-800 dark:text-gray-100">Recent Volunteers</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50/50 dark:bg-slate-800/50 transition-colors">
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Skills</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {volunteers.slice(0, 5).map((volunteer) => (
                    <tr key={volunteer.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-xs font-bold">
                            {volunteer.user_name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-800 dark:text-gray-100">{volunteer.user_name}</p>
                            <p className="text-[11px] text-slate-400 dark:text-gray-500 font-medium">{volunteer.user_email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-gray-400 font-medium">{volunteer.skills || 'General'}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase ${
                          volunteer.status === 'approved' ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-500' :
                          volunteer.status === 'rejected' ? 'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-500' :
                          'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-500'
                        }`}>
                          {volunteer.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {volunteers.length === 0 && !loading && (
                    <tr><td colSpan={3} className="px-6 py-8 text-center text-slate-400">No volunteers yet</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-3 border-t border-slate-100 dark:border-slate-800 text-right font-primary">
              <Link href="/admin/volunteers" className="text-sm font-semibold text-primary dark:text-blue-400 hover:underline">
                View All Volunteers
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

function timeAgo(dateStr: string): string {
  if (!dateStr) return ''
  const now = new Date()
  const date = new Date(dateStr)
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (seconds < 60) return 'Just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`
  if (seconds < 172800) return 'Yesterday'
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`
  return date.toLocaleDateString()
}

function StatCard({ icon, label, value, bgColor }: { icon: React.ReactNode; label: string; value: string; bgColor: string }) {
  return (
    <div className={`${bgColor} rounded-2xl p-6 text-white shadow-lg`}>
      <div className="flex items-center gap-3 mb-2">
        <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center">
          {icon}
        </div>
        <span className="text-sm font-medium text-white/80">{label}</span>
      </div>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  )
}
