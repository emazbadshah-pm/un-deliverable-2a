"use client"

import { useState } from "react"
import { LoginForm } from "@/components/login-form"
import { Dashboard } from "@/components/dashboard"

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<{ name: string; email: string; role: "Full Access" | "View Only" } | null>(null)

  const handleLogin = (email: string, password: string) => {
    // Simulate authentication with different user roles
    if (email === "mirsad@ummahnavigator.com" && password === "password123") {
      setIsAuthenticated(true)
      setUser({ name: "Mirsad Skopljak", email, role: "Full Access" })
      return { success: true }
    }
    if (email === "sarah@ummahnavigator.com" && password === "viewonly123") {
      setIsAuthenticated(true)
      setUser({ name: "Sarah Ahmed", email, role: "View Only" })
      return { success: true }
    }
    return { success: false, error: "Incorrect Credentials" }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setUser(null)
  }

  if (isAuthenticated && user) {
    return <Dashboard user={user} onLogout={handleLogout} />
  }

  return <LoginForm onLogin={handleLogin} />
}
