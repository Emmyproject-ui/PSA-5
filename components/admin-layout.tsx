"use client"

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { LogOut, Users, LayoutDashboard, Heart, HandHeart, Settings, Search, Bell, Menu, X, BookOpen, FolderKanban } from 'lucide-react'
import { useAuth } from '@/components/auth-provider'

interface AdminLayoutProps {
  children: React.ReactNode
  title?: string
}

const NAV_ITEMS = [
  { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/users', icon: Users, label: 'Users', badge: 7 },
  { href: '/admin/contributions', icon: Heart, label: 'Donations' },
  { href: '/admin/volunteers', icon: HandHeart, label: 'Volunteers' },
  { href: '/admin/blog', icon: BookOpen, label: 'Blog Posts' },
  { href: '/admin/projects', icon: FolderKanban, label: 'Projects' },
  { href: '/admin/security', icon: Settings, label: 'Settings' },
]

export default function AdminLayout({ children, title }: AdminLayoutProps) {
  const { user, isLoading, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/auth/signin')
        return
      }
      if (user.role !== 'admin') {
        router.push('/customer/dashboard')
        return
      }
    }
  }, [user, isLoading, router])

  const handleLogout = async () => {
    await logout()
  }

  if (isLoading || !user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-950 transition-colors">
        <div className="flex flex-col items-center gap-4 font-primary">
          <div className="h-16 w-16 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f1f5f9] dark:bg-slate-950 flex overflow-x-hidden transition-colors">
      {/* Sidebar - Fixed */}
      <aside className="w-64 bg-[#1e293b] dark:bg-slate-900 border-r border-slate-700/50 dark:border-slate-800 fixed h-full flex-col text-slate-300 hidden lg:flex overflow-y-auto transition-colors transition-sidebar">
        {/* Logo */}
        <div className="p-6 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-gradient-to-br from-rose-500 to-orange-400 rounded-xl flex items-center justify-center">
              <Heart className="h-5 w-5 text-white" fill="currentColor" />
            </div>
          </div>
          <h1 className="text-lg font-bold text-white mt-4">Admin Dashboard</h1>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive 
                    ? 'bg-primary/20 text-white border-l-4 border-primary' 
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="ml-auto bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>
        
        {/* User Profile at Bottom */}
        <div className="p-4 border-t border-slate-700/50 dark:border-slate-800">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 dark:bg-slate-950/30">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold text-sm">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user.name}</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Admin</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full mt-3 flex items-center justify-center gap-2 text-rose-400 hover:text-rose-300 font-medium text-sm py-2 rounded-xl hover:bg-rose-500/10 transition-all"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <aside className={`fixed top-0 left-0 bottom-0 w-64 bg-[#1e293b] dark:bg-slate-900 z-50 transform transition-transform duration-300 ease-in-out lg:hidden flex flex-col ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-6 border-b border-slate-700/50 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-gradient-to-br from-rose-500 to-orange-400 rounded-xl flex items-center justify-center">
              <Heart className="h-5 w-5 text-white" fill="currentColor" />
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="text-slate-400 hover:text-white">
            <X size={24} />
          </button>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive 
                    ? 'bg-primary/20 text-white border-l-4 border-primary' 
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="ml-auto bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-slate-700/50">
           <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 text-rose-400 hover:text-rose-300 font-medium text-sm py-2 rounded-xl hover:bg-rose-500/10 transition-all"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
        {/* Top Header */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30 transition-colors">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
            >
              <Menu size={24} />
            </button>
            <h2 className="text-xl font-bold text-slate-800 dark:text-gray-100 truncate font-primary">{title || `Welcome, ${user.name}!`}</h2>
          </div>
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="hidden md:flex relative font-primary">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary/20 transition-all w-48"
              />
            </div>
            
            {/* Notification Bell */}
            <button className="relative p-2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
              <Bell size={20} />
              <span className="absolute top-1 right-1 h-2 w-2 bg-rose-500 rounded-full"></span>
            </button>
            
            {/* Profile Avatar */}
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold text-sm border-2 border-white shadow-sm">
              {user.name.charAt(0).toUpperCase()}
            </div>
            
            {/* Mobile Logout */}
            <div className="lg:hidden">
              <button onClick={handleLogout} className="p-2 text-rose-500 bg-rose-50 rounded-lg">
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  )
}
