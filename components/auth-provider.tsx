"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { useRouter } from "next/navigation"
import { authApi } from "@/lib/api"
import { tokenService, User } from "@/services/storage/token.service"

export type UserRole = "admin" | "user" | "guest"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const initAuth = async () => {
      const token = tokenService.getToken();
      const storedUser = tokenService.getUser();
      
      if (token && storedUser) {
        setUser(storedUser);
        try {
          // Verify token with backend
          const data = await authApi.me();
          setUser(data);
          tokenService.setUser(data);
        } catch (e) {
          // Token invalid, clear storage
          tokenService.clearAll();
        }
      }
      setIsLoading(false);
    }
    initAuth();
  }, [])

  const login = async (email: string, password: string) => { 
    setIsLoading(true);
    try {
      const data = await authApi.login({ email, password });

      setUser(data.user);
      tokenService.setToken(data.access_token);
      tokenService.setUser(data.user);
      
      if (data.user.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        // 'user' role goes to customer dashboard
        router.push("/customer/dashboard");
      }
    } catch (e: any) {
      console.error("Login Error:", e);
      alert(e.message || "Unable to connect to login server.");
    } finally {
      setIsLoading(false);
    }
  }

  const signup = async (name: string, email: string, password: string) => { 
    setIsLoading(true);
    try {
      const data = await authApi.register({ name, email, password, password_confirmation: password });

      setUser(data.user);
      tokenService.setToken(data.access_token);
      tokenService.setUser(data.user);
      router.push("/customer/dashboard");
    } catch (e: any) {
       console.error("Signup Error:", e);
       alert(e.message || "Unable to connect to registration server.");
    } finally {
      setIsLoading(false);
    }
  }

  const logout = async () => {
    setIsLoading(true);
    try {
        await authApi.logout();
    } catch (e) {}
    
    setUser(null);
    tokenService.clearAll();
    setIsLoading(false);
    router.push("/auth/signin");
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
