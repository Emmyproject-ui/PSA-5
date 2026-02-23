"use client"

import { useAuth } from "@/components/auth-provider"
import { useEffect, useState } from "react"
import { Heart, CreditCard, HandHeart, Info, Loader2 } from "lucide-react"
import { customerApi } from "@/lib/api"

interface NotificationItem {
  id: string
  type: 'donation' | 'volunteer' | 'system'
  title: string
  message: string
  time: string
  read: boolean
  icon: typeof CreditCard
  color: string
  bg: string
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

export default function NotificationsPage() {
  const { user, isLoading } = useAuth()
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isLoading || !user) return

    const fetchData = async () => {
      setLoading(true)
      try {
        const [donations, volunteering] = await Promise.all([
          customerApi.getMyDonations(),
          customerApi.getMyVolunteering(),
        ])

        const items: NotificationItem[] = []

        // Build notifications from real donations
        donations.forEach((d: any) => {
          items.push({
            id: `don-${d.id}`,
            type: 'donation',
            title: 'Donation Confirmed',
            message: `Your donation of ₦${Number(d.amount_raw || d.amount).toLocaleString()}${d.cause ? ` to '${d.cause}'` : ''} has been confirmed.`,
            time: timeAgo(d.created_at),
            read: true,
            icon: CreditCard,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
          })
        })

        // Build notifications from real volunteer activity
        volunteering.forEach((v: any) => {
          items.push({
            id: `vol-${v.id}`,
            type: 'volunteer',
            title: v.status === 'approved' ? 'Volunteer Application Approved' :
                   v.status === 'rejected' ? 'Volunteer Application Update' :
                   'Volunteer Application Submitted',
            message: v.status === 'approved'
              ? `Your volunteer application for "${v.skills || 'General'}" has been approved!`
              : v.status === 'rejected'
              ? `Your volunteer application for "${v.skills || 'General'}" was not approved this time.`
              : `Your volunteer application for "${v.skills || 'General'}" is pending review.`,
            time: timeAgo(v.created_at),
            read: v.status !== 'pending',
            icon: HandHeart,
            color: v.status === 'approved' ? 'text-emerald-600' : v.status === 'rejected' ? 'text-red-500' : 'text-amber-500',
            bg: v.status === 'approved' ? 'bg-emerald-50' : v.status === 'rejected' ? 'bg-red-50' : 'bg-amber-50',
          })
        })

        // Add a welcome notification
        items.push({
          id: 'welcome',
          type: 'system',
          title: 'Welcome to GGNF',
          message: 'Thank you for joining GGNF! Start by exploring our campaigns.',
          time: timeAgo(user.created_at || new Date().toISOString()),
          read: true,
          icon: Info,
          color: 'text-blue-500',
          bg: 'bg-blue-50',
        })

        // Sort by most recent first (unread first, then by position)
        items.sort((a, b) => (a.read === b.read ? 0 : a.read ? 1 : -1))
        setNotifications(items)
      } catch (e) {
        console.warn("Could not load notifications:", e)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [user, isLoading])

  if (isLoading || !user) return null

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div>
      <div className="flex items-center justify-between mb-6 font-primary transition-colors">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Notifications</h1>
          {unreadCount > 0 && (
            <span className="h-6 min-w-[24px] bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold px-1.5">
              {unreadCount}
            </span>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-7 w-7 animate-spin text-blue-600" />
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Info className="h-10 w-10 mx-auto mb-3 text-gray-300" />
          <p className="font-medium">No notifications yet</p>
          <p className="text-sm mt-1">Make a donation or volunteer to see activity here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => {
            const Icon = notification.icon
            // Map light bg/color to dark equivalents
            const darkBgMap: Record<string, string> = {
              'bg-emerald-50': 'dark:bg-emerald-950/30',
              'bg-red-50': 'dark:bg-red-950/30',
              'bg-amber-50': 'dark:bg-amber-950/30',
              'bg-blue-50': 'dark:bg-blue-950/30',
            }
            const darkColorMap: Record<string, string> = {
              'text-emerald-600': 'dark:text-emerald-500',
              'text-red-50': 'dark:text-red-500', // Note: fix potential typo in original color if it was text-red-50
              'text-amber-500': 'dark:text-amber-400',
              'text-blue-500': 'dark:text-blue-400',
              'text-red-500': 'dark:text-red-400',
            }

            const darkBg = darkBgMap[notification.bg] || 'dark:bg-slate-800'
            const darkColor = darkColorMap[notification.color] || notification.color

            return (
              <div
                key={notification.id}
                className={`flex items-start gap-4 p-5 bg-white dark:bg-slate-900 border rounded-2xl transition-all hover:shadow-sm font-primary ${
                  notification.read 
                  ? 'border-gray-200 dark:border-slate-800' 
                  : 'border-blue-200 dark:border-blue-900 bg-blue-50/30 dark:bg-blue-950/10'
                }`}
              >
                <div className={`h-10 w-10 ${notification.bg} ${darkBg} rounded-xl flex items-center justify-center flex-shrink-0 transition-colors`}>
                  <Icon className={`h-5 w-5 ${notification.color} ${darkColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className={`text-sm font-semibold transition-colors ${notification.read ? 'text-gray-700 dark:text-gray-300' : 'text-gray-900 dark:text-gray-100'}`}>
                      {notification.title}
                    </h3>
                    <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap flex-shrink-0">{notification.time}</span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{notification.message}</p>
                </div>
                {!notification.read && (
                  <div className="h-2.5 w-2.5 bg-blue-500 rounded-full flex-shrink-0 mt-1.5" />
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
