"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff, Mail, Lock } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export default function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
  

    const callbackUrl = searchParams.get("callbackUrl") ?? "/"

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
      callbackUrl,
    })

    setLoading(false)

    if (res?.ok) {
      router.push(res.url ?? callbackUrl)
      toast.success("Login successful")
    } else {
     
      toast.error("Email or password wrong") 
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-[570px] w-full mx-auto rounded-2xl p-8 py-10 border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-[32px] font-semibold text-[#212121] mb-2">Hello, Welcome!</h1>
          <p className="text-[#212121] text-base">Please Enter Your Details Below to Continue</p>
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
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-base font-medium text-[#212121]">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10 h-12 bg-[#E8E4DC] border-[#595959] rounded-lg"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="text-right">
            <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              Forgot password?
            </Link>
          </div>

          <Button type="submit" disabled={loading} className="w-full h-12 bg-[#D9AD5E] hover:bg-[#D9AD5E] text-white font-medium rounded-lg">
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  )
}