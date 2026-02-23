"use client"

import { useAuth } from "@/components/auth-provider"
import { customerApi } from "@/lib/api"
import Link from "next/link"
import { useEffect, useState } from "react"
import { CreditCard, Heart, Clock, TrendingUp, ArrowRight, Users } from "lucide-react"

export default function DashboardPage() {
  const { user, isLoading } = useAuth()
  const [donations, setDonations] = useState<any[]>([])
  const [volunteers, setVolunteers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      if (isLoading || !user) return
      setLoading(true)

      try {
        const [donData, volData] = await Promise.all([
          customerApi.getMyDonations(),
          customerApi.getMyVolunteering(),
        ])
        setDonations(donData)
        setVolunteers(volData)
      } catch (e) {
        console.warn("Could not fetch dashboard data:", e)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [user, isLoading])

  const totalDonated = donations.reduce((sum: number, d: any) => sum + (Number(d.amount_raw) || Number(d.amount) || 0), 0)
  const volunteerCount = volunteers.length

  if (isLoading || !user) return null

  return (
    <div>
      {/* Welcome */}
      <div className="mb-8 font-primary">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 transition-colors">
          Welcome back, <span className="text-blue-600 dark:text-blue-400">{user.name}</span> 👋
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Here&#39;s an overview of your impact and activity.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={<CreditCard className="h-6 w-6 text-blue-600" />}
          label="Total Donated"
          value={`₦${totalDonated.toLocaleString()}`}
          bg="bg-blue-50"
        />
        <StatCard
          icon={<Heart className="h-6 w-6 text-rose-500" />}
          label="Campaigns Supported"
          value={`${donations.length}`}
          bg="bg-rose-50"
        />
        <StatCard
          icon={<Clock className="h-6 w-6 text-amber-500" />}
          label="Volunteer Events"
          value={`${volunteerCount}`}
          bg="bg-amber-50"
        />
        <StatCard
          icon={<TrendingUp className="h-6 w-6 text-emerald-500" />}
          label="Impact Score"
          value={`${Math.max(1, Math.floor(totalDonated / 5000))}`}
          bg="bg-emerald-50"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 font-primary">
        <Link
          href="/donate"
          className="flex items-center justify-between p-6 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-rose-50 dark:bg-rose-950/30 flex items-center justify-center transition-colors">
              <Heart className="h-6 w-6 text-rose-500" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Make a Donation</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Support a cause you care about</p>
            </div>
          </div>
          <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
        </Link>

        <Link
          href="/volunteer"
          className="flex items-center justify-between p-6 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center transition-colors">
              <Users className="h-6 w-6 text-emerald-500" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Volunteer</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Join our team on the ground</p>
            </div>
          </div>
          <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
        </Link>
      </div>

      {/* Recent Donations */}
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl overflow-hidden font-primary transition-colors">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Recent Donations</h2>
          <Link href="/customer/donations" className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 transition-colors">
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 dark:bg-slate-800/50">
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Campaign</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Amount</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Date</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                {donations.length > 0 ? (
                  donations.slice(0, 5).map((don: any, i: number) => (
                    <tr key={i} className="hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">{don.cause || don.payment_reference || "General Donation"}</td>
                      <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-gray-100">₦{Number(don.amount_raw || don.amount).toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{don.created_at ? new Date(don.created_at).toLocaleDateString() : '-'}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase ${
                          (don.status || 'completed') === 'completed'
                            ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-500 border border-emerald-200 dark:border-emerald-800'
                            : 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-500 border border-amber-200 dark:border-amber-800'
                        }`}>
                          {don.status || "Confirmed"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-400 dark:text-gray-500 font-medium">
                      No donations yet. Make your first contribution!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({ icon, label, value, bg }: { icon: React.ReactNode, label: string, value: string, bg: string }) {
  // Map light bg to dark bg equivalents
  const darkBgMap: Record<string, string> = {
    'bg-blue-50': 'dark:bg-blue-950/30',
    'bg-rose-50': 'dark:bg-rose-950/30',
    'bg-amber-50': 'dark:bg-amber-950/30',
    'bg-emerald-50': 'dark:bg-emerald-950/30',
  }
  const darkBg = darkBgMap[bg] || 'dark:bg-slate-800/50'

  return (
    <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-5 hover:shadow-md transition-all font-primary">
      <div className="flex items-center gap-4">
        <div className={`h-12 w-12 ${bg} ${darkBg} rounded-xl flex items-center justify-center flex-shrink-0 transition-colors`}>
          {icon}
        </div>
        <div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">{label}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-0.5">{value}</p>
        </div>
      </div>
    </div>
  )
}
