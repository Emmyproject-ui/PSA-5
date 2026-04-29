"use client"

import { useAuth } from "@/components/auth-provider"
import { useEffect, useState } from "react"
import { Heart, CreditCard, HandHeart, Info, Loader2, CheckCircle, XCircle, Clock } from "lucide-react"
import { customerApi } from "@/lib/api"

const SEEN_KEY = 'ggnf-notifications-seen-at'

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

function getSeenAt(): Date | null {
  try {
    const raw = localStorage.getItem(SEEN_KEY)
    return raw ? new Date(raw) : null
  } catch { return null }
}

function markAsSeen() {
  try { localStorage.setItem(SEEN_KEY, new Date().toISOString()) } catch {}
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
        const seenAt = getSeenAt()
        const [donations, volunteering] = await Promise.all([
          customerApi.getMyDonations(),
          customerApi.getMyVolunteering(),
        ])

        const items: NotificationItem[] = []

        // Volunteer notifications — one per application showing current status
        volunteering.forEach((v: any) => {
          const statusChangedAt = v.updated_at || v.created_at
          // Mark as unread if: status is not pending AND changed after the user last viewed notifications
          const isStatusDecided = v.status === 'approved' || v.status === 'rejected'
          const isNew = isStatusDecided && seenAt ? new Date(statusChangedAt) > seenAt : isStatusDecided && !seenAt

          let title: string
          let message: string
          let icon: typeof CreditCard
          let color: string
          let bg: string

          if (v.status === 'approved') {
            title = '✅ Volunteer Application Approved!'
            message = `Great news! Your volunteer application for "${v.skills || 'General'}" has been approved. Welcome to the team!`
            icon = CheckCircle
            color = 'text-emerald-600'
            bg = 'bg-emerald-50'
          } else if (v.status === 'rejected') {
            title = '❌ Volunteer Application Update'
            message = `Your volunteer application for "${v.skills || 'General'}" was not approved this time. Feel free to apply again.`
            icon = XCircle
            color = 'text-red-500'
            bg = 'bg-red-50'
          } else {
            // pending
            title = '⏳ Volunteer Application Submitted'
            message = `Your volunteer application for "${v.skills || 'General'}" is pending review by our team. We'll notify you once a decision is made.`
            icon = Clock
            color = 'text-amber-500'
            bg = 'bg-amber-50'
          }

          items.push({
            id: `vol-${v.id}`,
            type: 'volunteer',
            title,
            message,
            // For decided applications, show WHEN admin acted (updated_at); for pending show applied time
            time: isStatusDecided ? timeAgo(statusChangedAt) : `Applied ${timeAgo(v.created_at)}`,
            read: !isNew,
            icon,
            color,
            bg,
          })
        })

        // Donation notifications
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

        // Welcome notification
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

        // Unread first, then by type
        items.sort((a, b) => (a.read === b.read ? 0 : a.read ? 1 : -1))
        setNotifications(items)
      } catch (e) {
        console.warn("Could not load notifications:", e)
      } finally {
        setLoading(false)
        // Mark all as seen now that the user has visited this page
        markAsSeen()
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
        {unreadCount > 0 && (
          <span className="text-xs text-gray-400 dark:text-gray-500">{unreadCount} new</span>
        )}
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
            const darkBgMap: Record<string, string> = {
              'bg-emerald-50': 'dark:bg-emerald-950/30',
              'bg-red-50': 'dark:bg-red-950/30',
              'bg-amber-50': 'dark:bg-amber-950/30',
              'bg-blue-50': 'dark:bg-blue-950/30',
            }
            const darkColorMap: Record<string, string> = {
              'text-emerald-600': 'dark:text-emerald-500',
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
