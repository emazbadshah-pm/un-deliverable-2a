"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Eye, EyeOff, X, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface PasswordRecoveryProps {
  onBackToLogin: () => void
}

type RecoveryStep = "email" | "otp" | "newPassword" | "success"

const validEmails = ["mirsad@ummahnavigator.com", "admin@ummahnavigator.com"]
const correctOTP = "123456"

export function PasswordRecovery({ onBackToLogin }: PasswordRecoveryProps) {
  const [step, setStep] = useState<RecoveryStep>("email")
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendTimer])

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (!validEmails.includes(email.toLowerCase())) {
      setError("Email not associated with any account")
      setIsLoading(false)
      return
    }

    setStep("otp")
    setResendTimer(60)
    setIsLoading(false)
  }

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      nextInput?.focus()
    }
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`)
      prevInput?.focus()
    }
  }

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const otpString = otp.join("")
    if (otpString.length !== 6) {
      setError("Please enter complete OTP")
      setIsLoading(false)
      return
    }

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (otpString !== correctOTP) {
      setError("Invalid OTP Code")
      setIsLoading(false)
      return
    }

    setStep("newPassword")
    setIsLoading(false)
  }

  const handleResendOtp = async () => {
    if (resendTimer > 0) return

    setError("")
    setResendTimer(60)
    // Simulate sending OTP
    await new Promise((resolve) => setTimeout(resolve, 500))
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long")
      setIsLoading(false)
      return
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setStep("success")
    setIsLoading(false)

    // Auto redirect to login after 3 seconds
    setTimeout(() => {
      onBackToLogin()
    }, 3000)
  }

  const renderEmailStep = () => (
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
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Account Recovery</h2>
        <p className="text-gray-600">
          {"Enter the email linked to your admin account. We'll send you an OTP to verify."}
        </p>
      </div>

      <form onSubmit={handleEmailSubmit} className="space-y-6">
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

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#24735c] hover:bg-[#1e5d4a] text-white font-medium py-2 px-4 rounded-xl transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Sending...
            </div>
          ) : (
            "Next"
          )}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <Button variant="link" onClick={onBackToLogin} className="text-sm text-gray-600 hover:text-gray-500">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Login
        </Button>
      </div>
    </div>
  )

  const renderOtpStep = () => (
    <div className="bg-white py-8 px-4 shadow-sm rounded-xl sm:px-10">
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
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">OTP Verification</h2>
        <p className="text-gray-600">Enter the OTP sent to your email</p>
      </div>

      <form onSubmit={handleOtpSubmit} className="space-y-6">
        <div className="flex justify-center space-x-2">
          {otp.map((digit, index) => (
            <Input
              key={index}
              id={`otp-${index}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleOtpKeyDown(index, e)}
              className="w-12 h-12 text-center text-lg font-semibold border border-gray-300 rounded-xl focus:outline-none focus:ring-[#24735c] focus:border-[#24735c]"
            />
          ))}
        </div>

        <div className="text-center">
          <span className="text-gray-600 text-sm">{"Did not receive OTP? "}</span>
          {resendTimer > 0 ? (
            <span className="text-blue-600 text-sm font-medium">{resendTimer}</span>
          ) : (
            <Button
              type="button"
              variant="link"
              onClick={handleResendOtp}
              disabled={resendTimer > 0 || isLoading}
              className="text-sm text-blue-600 hover:text-blue-500 p-0 h-auto font-medium disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600 mr-1"></div>
                  Sending...
                </div>
              ) : (
                "Resend"
              )}
            </Button>
          )}
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#24735c] hover:bg-[#1e5d4a] text-white font-medium py-2 px-4 rounded-xl transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Verifying...
            </div>
          ) : (
            "Next"
          )}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <Button variant="link" onClick={() => setStep("email")} className="text-sm text-gray-600 hover:text-gray-500">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Email
        </Button>
      </div>
    </div>
  )

  const renderPasswordStep = () => (
    <div className="bg-white py-8 px-4 shadow-sm rounded-xl sm:px-10">
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
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Create New Password</h2>
        <p className="text-gray-600">Enter your new password below</p>
      </div>

      <form onSubmit={handlePasswordSubmit} className="space-y-6">
        <div>
          <Label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
            New Password
          </Label>
          <div className="relative">
            <Input
              id="newPassword"
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New Password"
              required
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-[#24735c] focus:border-[#24735c]"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-auto p-1 text-gray-400 hover:text-gray-600"
            >
              {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <div>
          <Label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
            Confirm Password
          </Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              required
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-[#24735c] focus:border-[#24735c]"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-auto p-1 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#24735c] hover:bg-[#1e5d4a] text-white font-medium py-2 px-4 rounded-xl transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Updating...
            </div>
          ) : (
            "Update Password"
          )}
        </Button>
      </form>
    </div>
  )

  const renderSuccessStep = () => (
    <div className="bg-white py-8 px-4 shadow-sm rounded-xl sm:px-10">
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
          <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Password Updated Successfully</h2>
        <p className="text-gray-600 mb-6">Your password has been updated. You will be redirected to login shortly.</p>
        <Button
          onClick={onBackToLogin}
          className="bg-[#24735c] hover:bg-[#1e5d4a] text-white font-medium py-2 px-4 rounded-xl transition-colors duration-200"
        >
          Go to Login
        </Button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            Ummah<span className="text-[#d98c4a]">Navigator</span>
          </h1>
        </div>

        {step === "email" && renderEmailStep()}
        {step === "otp" && renderOtpStep()}
        {step === "newPassword" && renderPasswordStep()}
        {step === "success" && renderSuccessStep()}
      </div>
    </div>
  )
}
