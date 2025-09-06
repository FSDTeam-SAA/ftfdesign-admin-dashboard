"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useQuery } from "@tanstack/react-query"

// Define the user profile data interface
interface UserProfile {
  success: boolean
  message: string
  data: {
    _id: string
    name: string
    email: string
    phone: string
    isVerified: boolean
    imageLink: string | null
    role: string
    isShopCreated: boolean
    isPaid: boolean
    employeeCount: number
    createdAt: string
    updatedAt: string
    shop: string
  }
}

// Fetch user profile function
const fetchUserProfile = async (): Promise<UserProfile> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/profile`)
  if (!response.ok) {
    throw new Error("Failed to fetch user profile")
  }
  return response.json()
}

export function DashboardHeader() {
  // Use Tanstack Query to fetch user profile
  const { data, isLoading, error } = useQuery<UserProfile>({
    queryKey: ["userProfile"],
    queryFn: fetchUserProfile,
  })

  // Get user data or set defaults
  const userName = data?.data.name || "User"
  const avatarImage = data?.data.imageLink || ""
  // Get first letter of name for fallback
  const initials = userName.charAt(0).toUpperCase()

  return (
    <header className="bg-[#035F8A] border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-end">
        <div className="flex items-center gap-3">
          {isLoading ? (
            <span className="text-sm font-medium text-white">Loading...</span>
          ) : error ? (
            <span className="text-sm font-medium text-white">Error loading profile</span>
          ) : (
            <span className="text-sm font-medium text-white">{userName}</span>
          )}
          <Avatar className="h-8 w-8">
            <AvatarImage src={avatarImage} alt={userName} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}