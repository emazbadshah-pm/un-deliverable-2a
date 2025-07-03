"use client"

import type React from "react"

import { useState } from "react"
import { Eye, EyeOff, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { PasswordRecovery } from "./password-recovery"

interface LoginFormProps {
  onLogin: (email: string, password: string) => { success: boolean; error?: string }
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPasswordRecovery, setShowPasswordRecovery] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const result = onLogin(email, password)

    if (!result.success) {
      setError(result.error || "Login failed")
    }

    setIsLoading(false)
  }

  if (showPasswordRecovery) {
    return <PasswordRecovery onBackToLogin={() => setShowPasswordRecovery(false)} />
  }

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            Ummah<span className="text-[#d98c4a]">Navigator</span>
          </h1>
        </div>

        <div className="bg-white py-8 px-4 rounded-xl sm:px-10 shadow-none">
          {error && (
            <Alert className="mb-6 border-red-200 bg-red-50">
              <div className="flex items-center justify-between">
                <AlertDescription className="text-red-800 font-medium">{error}</AlertDescription>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setError("")}
                  className="h-auto p-1 text-red-800 hover:bg-red-100"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </Alert>
          )}

          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-gray-900">Administrative Login</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-[#24735c] focus:border-[#24735c]"
              />
            </div>

            <div>
              <Label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-[#24735c] focus:border-[#24735c]"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-auto p-1 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="text-right">
              <Button
                type="button"
                variant="link"
                onClick={() => setShowPasswordRecovery(true)}
                className="text-sm text-[#24735c] hover:text-[#1e5d4a] p-0 h-auto font-normal"
              >
                Forgot Password
              </Button>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#24735c] hover:bg-[#1e5d4a] text-white font-medium py-2 px-4 rounded-xl transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Logging in...
                </div>
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
