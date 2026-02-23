"use client"

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/components/auth-provider'
import Link from 'next/link'
import { Loader2, LayoutDashboard, CreditCard, Heart, User, Bell, Settings, LogOut, Menu, X, CheckCircle2, Globe } from 'lucide-react'

const sidebarLinks = [
  { href: '/customer/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/customer/donations', label: 'My Donations', icon: CreditCard },
  { href: '/customer/campaigns', label: 'Supported Campaigns', icon: Heart },
  { href: '/customer/profile', label: 'My Profile', icon: User },
  { href: '/customer/notifications', label: 'Notifications', icon: Bell },
  { href: '/customer/settings', label: 'Settings', icon: Settings },
]

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoading, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/auth/signin')
        return
      }
      if (user.role === 'admin') {
        router.push('/admin/dashboard')
        return
      }
    }
  }, [user, isLoading, router])

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-950 transition-colors">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!user || user.role !== 'customer') {
    return null
  }

  const handleLogout = async () => {
    await logout()
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors font-primary">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 h-screen w-[260px] bg-[#1d4ed8] text-white flex flex-col
        transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:sticky lg:top-0 lg:z-auto lg:flex-shrink-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Close button for mobile */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden absolute top-4 right-4 p-1 rounded-lg hover:bg-blue-600 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Logo */}
        <div className="px-6 py-6 flex items-center gap-3 border-b border-blue-500/30">
          <div className="h-9 w-9 bg-white rounded-lg flex items-center justify-center">
            <span className="text-blue-700 font-black text-sm">GG</span>
          </div>
          <span className="text-lg font-bold tracking-tight">GGNF</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + '/')
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                  ${isActive
                    ? 'bg-white/15 text-white shadow-sm'
                    : 'text-blue-100/80 hover:bg-white/10 hover:text-white'}
                `}
              >
                <link.icon className="h-5 w-5 flex-shrink-0" />
                <span>{link.label}</span>
                {link.label === 'Notifications' && (
                  <span className="ml-auto h-5 min-w-[20px] bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold px-1">
                    3
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Bottom Links */}
        <div className="px-3 py-4 border-t border-blue-500/30 space-y-1">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-blue-100/80 hover:bg-white/10 hover:text-white transition-all"
          >
            <Globe className="h-5 w-5" />
            <span>Back to Website</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-blue-100/80 hover:bg-white/10 hover:text-white transition-all w-full"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-30 transition-colors">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Menu className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </button>

          <div className="flex-1" />

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block font-primary">
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{user.name}</p>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 dark:text-emerald-500 px-2 py-0.5 rounded-full">
                <CheckCircle2 className="h-3 w-3" />
                verified
              </span>
            </div>
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center overflow-hidden ring-2 ring-blue-100 dark:ring-blue-900/50 transition-all">
              <User className="h-5 w-5 text-white" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
