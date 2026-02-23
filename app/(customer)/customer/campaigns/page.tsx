"use client"

import { useAuth } from "@/components/auth-provider"
import { useEffect, useState } from "react"
import { Heart, Loader2, FolderOpen } from "lucide-react"
import Link from "next/link"
import { customerApi } from "@/lib/api"

interface CampaignGroup {
  cause: string
  totalDonated: number
  donationCount: number
  lastDonation: string
}

export default function SupportedCampaignsPage() {
  const { user, isLoading } = useAuth()
  const [campaigns, setCampaigns] = useState<CampaignGroup[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isLoading || !user) return

    const fetchData = async () => {
      setLoading(true)
      try {
        const donations = await customerApi.getMyDonations()

        // Group donations by cause
        const grouped: Record<string, CampaignGroup> = {}
        donations.forEach((d: any) => {
          const cause = d.cause || 'General Fund'
          if (!grouped[cause]) {
            grouped[cause] = {
              cause,
              totalDonated: 0,
              donationCount: 0,
              lastDonation: d.created_at,
            }
          }
          grouped[cause].totalDonated += Number(d.amount_raw) || Number(d.amount) || 0
          grouped[cause].donationCount += 1
          // Track the most recent donation date
          if (new Date(d.created_at) > new Date(grouped[cause].lastDonation)) {
            grouped[cause].lastDonation = d.created_at
          }
        })

        setCampaigns(Object.values(grouped).sort((a, b) => b.totalDonated - a.totalDonated))
      } catch (e) {
        console.warn("Could not load campaigns:", e)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [user, isLoading])

  if (isLoading || !user) return null

  // Color palette for campaign cards
  const colors = [
    'from-blue-500 to-blue-600',
    'from-emerald-500 to-emerald-600',
    'from-purple-500 to-purple-600',
    'from-amber-500 to-amber-600',
    'from-rose-500 to-rose-600',
    'from-teal-500 to-teal-600',
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 font-primary transition-colors">Supported Campaigns</h1>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-7 w-7 animate-spin text-blue-600" />
        </div>
      ) : campaigns.length === 0 ? (
        <div className="text-center py-16">
          <FolderOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No campaigns supported yet</h3>
          <p className="text-sm text-gray-400 mb-6">Make your first donation to see your supported campaigns here.</p>
          <Link
            href="/donate"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors"
          >
            <Heart className="h-4 w-4" />
            Make a Donation
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign, idx) => (
            <div
              key={campaign.cause}
              className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl overflow-hidden hover:shadow-lg transition-all font-primary"
            >
              {/* Color Header */}
              <div className={`h-32 bg-gradient-to-br ${colors[idx % colors.length]} flex items-center justify-center`}>
                <Heart className="h-12 w-12 text-white/30" fill="currentColor" />
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">{campaign.cause}</h3>

                {/* Amount */}
                <div className="flex items-baseline gap-1 mb-3">
                  <span className="text-xl font-black text-gray-900 dark:text-gray-100">₦{campaign.totalDonated.toLocaleString()}</span>
                  <span className="text-sm text-gray-400 dark:text-gray-500 font-medium">total donated</span>
                </div>

                {/* Donation Info */}
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-4 space-y-1">
                  <p>{campaign.donationCount} donation{campaign.donationCount !== 1 ? 's' : ''} by {user.name}</p>
                  <p>Last Donation: {timeAgo(campaign.lastDonation)}</p>
                </div>

                {/* Donate Again */}
                <Link
                  href="/donate"
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 transition-colors"
                >
                  <Heart className="h-4 w-4" />
                  Donate Again
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
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
