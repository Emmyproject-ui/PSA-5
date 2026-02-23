"use client"

import { useAuth } from "@/components/auth-provider"
import { useState, useEffect } from "react"
import { Moon, Bell, Shield, Download, Monitor, Trash2, Clock, CheckCircle2 } from "lucide-react"
import toast from "react-hot-toast"
import { useTheme } from "next-themes"
import { settingsApi } from "@/lib/api"
import { format } from "date-fns"

interface Session {
  id: number
  name: string
  last_used_at: string | null
  created_at: string
  is_current: boolean
}

interface UserSettings {
  notifications: {
    donationReceipts: boolean
    campaignProgress: boolean
    rewardLevel: boolean
    newsUpdates: boolean
  }
}

const SETTINGS_KEY = 'ggnf-user-settings'

const defaultSettings: UserSettings = {
  notifications: {
    donationReceipts: true,
    campaignProgress: true,
    rewardLevel: true,
    newsUpdates: true,
  },
}

function loadSettings(): UserSettings {
  if (typeof window === 'undefined') return defaultSettings
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    if (raw) return { ...defaultSettings, ...JSON.parse(raw) }
  } catch {}
  return defaultSettings
}

function saveSettings(settings: UserSettings) {
  if (typeof window === 'undefined') return
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
}

export default function SettingsPage() {
  const { user, isLoading } = useAuth()
  const [settings, setSettings] = useState<UserSettings>(defaultSettings)
  const [mounted, setMounted] = useState(false)
  const [sessions, setSessions] = useState<Session[]>([])
  const [isExporting, setIsExporting] = useState(false)
  const [isRevokingAll, setIsRevokingAll] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setSettings(loadSettings())
    fetchSessions()
    setMounted(true)
  }, [])

  const fetchSessions = async () => {
    try {
      const data = await settingsApi.getSessions()
      setSessions(data)
    } catch (error) {
      console.error("Failed to fetch sessions:", error)
    }
  }

  if (isLoading || !user) return null

  const handleRevokeSession = async (id: number) => {
    try {
      await settingsApi.revokeSession(id)
      setSessions(sessions.filter(s => s.id !== id))
      toast.success("Session revoked successfully")
    } catch (error: any) {
      toast.error(error.message || "Failed to revoke session")
    }
  }

  const handleRevokeOtherSessions = async () => {
    if (!confirm("Are you sure you want to revoke all other sessions?")) return
    setIsRevokingAll(true)
    try {
      await settingsApi.revokeOtherSessions()
      setSessions(sessions.filter(s => s.is_current))
      toast.success("All other sessions revoked")
    } catch (error: any) {
      toast.error(error.message || "Failed to revoke sessions")
    } finally {
      setIsRevokingAll(false)
    }
  }

  const handleExportData = async () => {
    setIsExporting(true)
    try {
      const data = await settingsApi.exportData()
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `ggnf-user-data-${user.name.toLowerCase().replace(/\s+/g, '-')}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      toast.success("Data exported successfully")
    } catch (error: any) {
      toast.error(error.message || "Failed to export data")
    } finally {
      setIsExporting(false)
    }
  }

  const toggleNotification = (key: keyof UserSettings['notifications']) => {
    const updated = {
      ...settings,
      notifications: { ...settings.notifications, [key]: !settings.notifications[key] },
    }
    setSettings(updated)
    saveSettings(updated)
    toast.success("Notification preference updated")
  }

  if (!mounted) return null

  const isDark = theme === 'dark'

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 font-primary transition-colors">Settings</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-primary">
        {/* Account Settings */}
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 transition-colors">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-5">Account Settings</h3>

          {/* Dark Mode */}
          <div className="flex items-center justify-between py-4 border-b border-gray-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <Moon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Enable Dark Mode</span>
            </div>
            <button
              onClick={() => {
                const newTheme = isDark ? 'light' : 'dark'
                setTheme(newTheme)
                toast.success(isDark ? "Light mode enabled" : "Dark mode enabled")
              }}
              className={`relative h-6 w-11 rounded-full transition-colors ${isDark ? 'bg-blue-600' : 'bg-gray-300'}`}
            >
              <span className={`absolute top-0.5 left-0.5 h-5 w-5 bg-white rounded-full shadow transition-transform ${isDark ? 'translate-x-5' : ''}`} />
            </button>
          </div>

        </div>

        {/* Email Notifications */}
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 transition-colors">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-5">Email Notifications</h3>

          <div className="space-y-1">
            {[
              { key: 'donationReceipts' as const, label: 'Donation receipt updates' },
              { key: 'campaignProgress' as const, label: 'Campaign progress updates' },
              { key: 'rewardLevel' as const, label: 'Reward level promotions' },
              { key: 'newsUpdates' as const, label: 'News & updates from GGNF' },
            ].map(({ key, label }) => (
              <label
                key={key}
                className="flex items-center gap-3 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800 rounded-lg px-2 -mx-2 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={settings.notifications[key]}
                  onChange={() => toggleNotification(key)}
                  className="h-4 w-4 rounded border-gray-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500"
                />
                <Bell className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Session Management */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 transition-colors">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                Active Sessions
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Manage your active login sessions on various devices.</p>
            </div>
            {sessions.length > 1 && (
              <button
                onClick={handleRevokeOtherSessions}
                disabled={isRevokingAll}
                className="text-sm font-semibold text-red-600 dark:text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
              >
                {isRevokingAll ? 'Revoking...' : 'Revoke all other sessions'}
              </button>
            )}
          </div>

          <div className="space-y-4">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/50"
              >
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                    <Monitor className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{session.name}</span>
                      {session.is_current && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 dark:text-emerald-500 px-2 py-0.5 rounded-full uppercase tracking-wider">
                          <CheckCircle2 className="h-3 w-3" />
                          current
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-1">
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                        <Clock className="h-3.5 w-3.5" />
                        Created {format(new Date(session.created_at), 'MMM d, yyyy HH:mm')}
                      </div>
                      {session.last_used_at && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                          <span className="h-1 w-1 rounded-full bg-gray-300 dark:bg-gray-600" />
                          Last active {format(new Date(session.last_used_at), 'MMM d, HH:mm')}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {!session.is_current && (
                  <button
                    onClick={() => handleRevokeSession(session.id)}
                    className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-500 transition-colors"
                    title="Revoke session"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Data Export */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Download className="h-5 w-5 text-blue-600" />
                Data Privacy & Export
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-xl">
                Download a copy of your personal data, including profile information, donation history, and volunteer records.
              </p>
            </div>
            <button
              onClick={handleExportData}
              disabled={isExporting}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all shadow-sm hover:shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isExporting ? <Monitor className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              {isExporting ? 'Exporting...' : 'Export My Data'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
