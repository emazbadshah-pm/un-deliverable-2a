"use client"

import type React from "react"

import { useState } from "react"
import { Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface AddAdminFormProps {
  onBack: () => void
  onSuccess: (message: string) => void
  onError: (message: string) => void
}

// Simulate existing emails in the system
const existingEmails = [
  "isa.j@google.com",
  "tabraiz@hotmail.com",
  "komalkhalid@outlook.com",
  "fatima@icloud.com",
  "muzammil997@protonmail.com",
  "aurangzebhina89@yahoo.com",
  "rabia.wahid_99@gmail.com",
  "i.khalil007@gmail.com",
  "ramsha_jamil@yahoo.com",
  "zaamin_shah@outlook.com",
  "mirsad@ummahnavigator.com",
]

export function AddAdminForm({ onBack, onSuccess, onError }: AddAdminFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    accessLevel: "Full Access",
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const validateForm = () => {
    if (!formData.name.trim()) {
      return "Administrator name is required"
    }
    if (!formData.email.trim()) {
      return "Email address is required"
    }
    if (!formData.email.includes("@")) {
      return "Please enter a valid email address"
    }
    if (existingEmails.includes(formData.email.toLowerCase())) {
      return `${formData.name.split(" ")[0]} is already added as an admin`
    }
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const error = validateForm()
    if (error) {
      onError(error)
      return
    }

    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsLoading(false)

    const accessType = formData.accessLevel === "Full Access" ? "Full Access" : "View Only"
    onSuccess(`${formData.name} added as ${accessType} Admin`)

    // Reset form
    setFormData({
      name: "",
      email: "",
      accessLevel: "Full Access",
    })

    // Go back to admin list
    setTimeout(() => {
      onBack()
    }, 100)
  }

  return (
    <div className="bg-white rounded-xl p-8 max-w-2xl">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Admin Provisioning</h2>
        <p className="text-gray-600">Create new administrator account with specific access levels</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Admin Name
            </Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Enter Full Name"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Admin Email
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="Email Address"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="space-y-4">
          <RadioGroup
            value={formData.accessLevel}
            onValueChange={(value) => handleInputChange("accessLevel", value)}
            className="space-y-3"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Full Access" id="full-access" />
              <Label htmlFor="full-access" className="text-sm font-medium text-gray-700">
                Full Access
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="View Only" id="view-only" />
              <Label htmlFor="view-only" className="text-sm font-medium text-gray-700">
                View Only Access
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start space-x-3">
          <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> Admins will receive their credentials on the email you have entered
          </p>
        </div>

        <div className="flex space-x-4 pt-4">
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-8 rounded-xl transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Adding...
              </div>
            ) : (
              "Add User"
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            disabled={isLoading}
            className="py-2 px-8 bg-transparent border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
