
"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Menu, X, User as UserIcon, LogOut, LayoutDashboard, Heart } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { cn } from "@/lib/utils"

const NAV_LINKS = [
  { href: "/", label: "Home", public: true },
  { href: "/about", label: "About", public: true },
  { href: "/projects", label: "Projects", public: true },
  { href: "/blog", label: "Blog", public: true },
  { href: "/contact", label: "Contact", public: true },
  { href: "/donate", label: "Donate", public: false },
  { href: "/volunteer", label: "Volunteer", public: false },
]

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { user, logout } = useAuth()
  const pathname = usePathname()

  // Handle scroll effect
  useEffect(() => {
    if (typeof window === "undefined") return

    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    
    // Initial check
    handleScroll()
    
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  return (
    <nav 
      className={cn(
        "fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ease-in-out",
        scrolled ? "bg-white shadow-md py-2" : "bg-transparent shadow-none py-4"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-3 z-50 group" onClick={() => setIsOpen(false)}>
            <div className="relative h-10 w-10 overflow-hidden rounded-xl shadow-indigo-500/20 shadow-lg group-hover:scale-110 transition-transform">
                <Image
                  src="/images/ggnf-logo.jpg"
                  alt="GGNF Logo"
                  fill
                  className="object-cover"
                />
            </div>
            <div className="flex flex-col">
                <span className={cn(
                  "font-black text-xl tracking-tighter transition-colors duration-300",
                  scrolled ? "text-black" : "text-white"
                )}>GGNF</span>
                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-primary -mt-1">Foundation</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-6 font-bold text-sm text-green-600">
                {NAV_LINKS.map((link) => {
                  if (!link.public && !user) return null
                  
                  return (
                    <NavLink key={link.href} href={link.href} active={pathname === link.href}>
                      {link.label}
                    </NavLink>
                  )
                })}
            </div>
            
            <div className="h-6 w-[1px] bg-slate-200/20 mx-2"></div>
            
            <div className="flex items-center gap-4">
                {user ? (
                  <div className="flex items-center gap-4">
                    <Link 
                      href={user.role === 'admin' ? "/admin/dashboard" : "/customer/dashboard"}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-black transition-all duration-300",
                        scrolled 
                          ? "bg-slate-100 text-slate-900 hover:bg-slate-200" 
                          : "bg-white/20 text-white hover:bg-white/30 backdrop-blur-md"
                      )}
                    >
                      <LayoutDashboard size={16} />
                      {user.role === 'admin' ? 'Dashboard' : 'Profile'}
                    </Link>
                    <button
                      onClick={() => logout()}
                      className={cn(
                        "p-2 rounded-xl border transition-all duration-300",
                        scrolled 
                          ? "border-slate-200 text-slate-400 hover:text-rose-500" 
                          : "border-white/20 text-white/60 hover:text-white"
                      )}
                      title="Logout"
                    >
                      <LogOut size={18} />
                    </button>
                  </div>
                ) : (
                  <>
                     <Link 
                       href="/auth/signin" 
                       className="text-sm font-black text-green-600 hover:text-green-700 transition-colors duration-300"
                     >
                       Sign In
                     </Link>
                     <Link href="/auth/signup" className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl hover:scale-105 transition-all font-black text-sm shadow-xl shadow-primary/30">
                       <Heart size={16} fill="currentColor" />
                       Join Us
                     </Link>
                  </>
                )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className={`md:hidden p-2 rounded-xl transition-all duration-300 z-50 ${
                scrolled ? "text-black bg-slate-100" : "text-white bg-white/10"
            }`}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 bg-black/40 z-40 md:hidden transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Mobile Menu Drawer */}
      <div 
        className={`fixed left-0 top-0 h-full w-[80%] max-w-[320px] bg-slate-900 z-50 md:hidden transition-transform duration-300 ease-out shadow-2xl ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Drawer Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10 overflow-hidden rounded-xl shadow-lg">
                <Image
                  src="/images/ggnf-logo.jpg"
                  alt="GGNF Logo"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-lg tracking-tighter text-white">GGNF</span>
                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-primary -mt-1">Foundation</span>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 py-6 px-4 space-y-2">
            {NAV_LINKS.map((link) => {
              if (!link.public && !user) return null

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-base font-bold transition-all ${
                    pathname === link.href 
                      ? "bg-primary/20 text-primary" 
                      : "text-white/70 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>

          {/* Drawer Footer */}
          <div className="p-4 border-t border-white/10 space-y-3">
            {user ? (
              <>
                <Link 
                  href={user.role === 'admin' ? "/admin/dashboard" : "/customer/dashboard"}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/10 text-white font-bold hover:bg-white/20 transition-all"
                >
                  <LayoutDashboard size={20} className="text-primary" />
                  {user.role === 'admin' ? 'Dashboard' : 'Profile'}
                </Link>
                <button
                  onClick={() => { logout(); setIsOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-rose-400 font-bold hover:bg-rose-500/10 transition-all"
                >
                  <LogOut size={20} />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/auth/signin" 
                  onClick={() => setIsOpen(false)}
                  className="block w-full py-3 text-center rounded-lg bg-white/10 text-white font-bold hover:bg-white/20 transition-all"
                >
                  Sign In
                </Link>
                <Link 
                  href="/auth/signup" 
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-3 text-center rounded-lg bg-primary text-white font-black shadow-lg shadow-primary/30 hover:scale-[1.02] transition-all"
                >
                  <Heart size={16} fill="currentColor" />
                  Join Us
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

function NavLink({ href, children, active }: any) {
  return (
    <Link href={href} className={`transition-colors relative group ${active ? "text-green-700 font-extrabold" : "text-green-600 hover:text-green-700"}`}>
      {children}
      <span className={`absolute -bottom-1 left-0 h-0.5 bg-green-600 transition-all ${active ? "w-full" : "w-0 group-hover:w-full"}`}></span>
    </Link>
  )
}
