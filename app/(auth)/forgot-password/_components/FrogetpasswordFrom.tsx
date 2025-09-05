"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/provider/AuthContext"



export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
     const { setAccessToken } = useAuth();




  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })
const data = await response.json();
      if (response.ok) {
       toast.success("OTP sent successfully")
        setAccessToken(data.data.accessToken);
        router.push("/verify-otp")
      } else {
        const errorData = await response.json()
        toast.error(errorData.message)
      }
    } catch (d) {
      console.log(d)
    } finally {
      setIsLoading(false)
   
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-[570px] w-full mx-auto rounded-2xl p-8 py-10 border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-[32px] font-semibold text-[#212121] mb-2">Forgot Password</h1>
          <p className="text-[#212121] text-base">
            Enter the email address associated with your account.
            <br />
            We&apos;ll send you an OTP to your email.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-[#FCF7EF] p-4 rounded-[6px]">
          <div className="space-y-2">
            <label className="text-base font-medium text-[#212121]">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="email"
                placeholder="Enter your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 h-12 bg-[#E8E4DC] border-[#595959] rounded-lg"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full h-12 bg-[#D9AD5E] hover:bg-[#D9AD5E]/90 text-white font-medium rounded-lg"
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Send OTP"}
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