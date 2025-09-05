
"use client"

import React, { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useAuth } from "@/components/provider/AuthContext"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface VerifyTokenResponse {
  data: {
    accessToken: string
  }
}

export default function VerifyOtpForm() {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""])
  const inputRefs = useRef<Array<HTMLInputElement | null>>([])
  const { accessToken, setAccessToken } = useAuth()
  const router=useRouter()
  // TanStack Query mutation for OTP verification
  const verifyOtpMutation = useMutation<VerifyTokenResponse, Error, string>({
    mutationFn: async (otpValue: string) => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify-token`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ otp: otpValue }),
      })

      if (!response.ok) {
        const errData = await response.json()
        throw new Error(errData.message || "OTP verification failed")
      }

      return response.json()
    },
    onSuccess: (res) => {
    
      if (res.data.accessToken) {
        setAccessToken(res.data.accessToken)
        console.log("New access token saved in context:", res.data.accessToken)
      }
      toast.success("OTP verified successfully")
      router.push("/update-password")
    },
    onError: (error) => {
      console.error("OTP Verification Failed:", error.message)
    },
  })

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text/plain").trim()
    if (/^\d{6}$/.test(pastedData)) {
      const newOtp = pastedData.split("").slice(0, 6)
      setOtp(newOtp)
      inputRefs.current[5]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus()
      } else {
        const newOtp = [...otp]
        newOtp[index] = ""
        setOtp(newOtp)
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault()
      inputRefs.current[index - 1]?.focus()
    } else if (e.key === "ArrowRight" && index < 5) {
      e.preventDefault()
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const otpValue = otp.join("")
    if (otpValue.length === 6) {
      verifyOtpMutation.mutate(otpValue)
    }
  }

  const handleResendOtp = () => {
    setOtp(["", "", "", "", "", ""])
    inputRefs.current[0]?.focus()
  }

  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-[570px] w-full mx-auto rounded-2xl p-8 py-10 border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-[32px] font-semibold text-[#212121] mb-2">Verify OTP</h1>
          <p className="text-[#212121] text-base">
            We&apos;ve sent a verification code to your email. Check your
            <br />
            inbox and enter the code here.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-[#FCF7EF] p-4 rounded-[6px]">
          <div className="flex justify-center gap-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el
                }}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value.replace(/\D/g, ""))}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="w-12 h-12 text-center text-lg font-semibold border border-[#595959] rounded-lg bg-[#E8E4DC] focus:outline-none focus:ring-2 focus:ring-[#D9AD5E] focus:border-transparent transition-colors"
              />
            ))}
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-[#212121] font-medium">Didn&apos;t Receive OTP?</span>
            <button
              type="button"
              onClick={handleResendOtp}
              className="text-[#212121] hover:text-[#D9AD5E] font-medium underline"
            >
              RESEND OTP
            </button>
          </div>

          <Button
            type="submit"
            disabled={otp.join("").length !== 6 }
            className="w-full h-12 bg-[#D9AD5E] hover:bg-[#D9AD5E]/90 disabled:bg-gray-300 text-white font-medium rounded-lg transition-colors"
          >
            {verifyOtpMutation.isPending ? "Verifying..." : "Verify"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/forgot-password">
            <button className="text-sm text-[#212121] hover:text-[#D9AD5E] font-medium transition-colors">
              ← Back to Forgot Password
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
