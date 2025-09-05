"use client"

import React from "react"
import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff, Lock } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { useAuth } from "@/components/provider/AuthContext"
import { useRouter } from "next/navigation"



export default function UpdatePasswordForm() {
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter()
  const { accessToken } = useAuth()
  // TanStack Query mutation for POST request
  const mutation = useMutation({
    mutationFn: async (passwordData: { newPassword: string }) => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(passwordData),
      })
      if (!response.ok) {
        throw new Error("Failed to reset password")
      }
      return response.json()
    },
    onSuccess: () => {
      toast.success("Password updated successfully!")
      router.push("/login")
    },
    onError: (error: Error) => {
      toast.error(`Error: ${error.message}`)
    },
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    // Trigger the mutation with the new password
    mutation.mutate({ newPassword })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-[570px] w-full mx-auto rounded-2xl p-8 py-10 border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-[32px] font-semibold text-[#212121] mb-2">Update Password</h1>
          <p className="text-[#212121] text-base">Create your new password</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-[#FCF7EF] p-4 rounded-[6px]">
          <div className="space-y-2">
            <label className="text-base font-medium text-[#212121]">New Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type={showNewPassword ? "text" : "password"}
                placeholder="Enter your New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="pl-10 pr-10 h-12 bg-[#E8E4DC] border-[#595959] rounded-lg"
                required
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-base font-medium text-[#212121]">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Enter your Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-10 pr-10 h-12 bg-[#E8E4DC] border-[#595959] rounded-lg"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full h-12 bg-[#D9AD5E] hover:bg-[#D9AD5E]/90 text-white font-medium rounded-lg"
            disabled={mutation.isPending}
          >
            {mutation ? "Updating..." : "Continue"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/login">
            <button className="text-sm text-[#212121] hover:text-[#D9AD5E] font-medium">
              ← Back to Sign In
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}