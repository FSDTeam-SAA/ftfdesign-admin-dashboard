"use client"

import { useState, useEffect, ChangeEvent } from "react"
import { ChevronRight, Eye, EyeOff, Edit, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useMutation, useQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import { useSession } from "next-auth/react"

// Define TypeScript interface for API response
interface UserProfile {
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

interface ApiResponse {
  success: boolean
  message: string
  data: UserProfile
}

export default function SettingsPage() {
  const [currentView, setCurrentView] = useState<"main" | "personal" | "password">("main")
  const [isEditing, setIsEditing] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const  session  = useSession()
  const token = session?.data?.accessToken

  // Fetch user profile data
  const { data: profileData, isLoading, refetch } = useQuery<ApiResponse>({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      if (!response.ok) {
        throw new Error("Failed to fetch profile")
      }
      return response.json()
    },
  })

  // Update form data when profile data is fetched
  useEffect(() => {
    if (profileData?.data) {
      setFormData({
        name: profileData.data.name,
        email: profileData.data.email,
        phone: profileData.data.phone,
      })
      setImagePreview(profileData.data.imageLink)
    }
  }, [profileData])

  // Handle image upload and preview
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async () => {
      const formDataToSend = new FormData()
      formDataToSend.append("data", JSON.stringify({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      }))
      if (imageFile) {
        formDataToSend.append("image", imageFile)
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/update-profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      })

      if (!response.ok) {
        throw new Error("Failed to update profile")
      }
      return response.json()
    },
    onSuccess: () => {
      toast.success("Profile updated successfully!")
      setIsEditing(false)
      setImageFile(null)
      refetch()
      setCurrentView("main")
    },
    // eslint-disable-next-line
    onError: (error: any) => {
      toast.error(error.message || "An error occurred while updating profile")
    },
  })

  const changePasswordMutation = useMutation({
    mutationFn: async (data: { currentPassword: string; newPassword: string }) => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to change password")
      }
      return response.json()
    },
    onSuccess: () => {
      toast.success("Password changed successfully!")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      setCurrentView("main")
    },
    // eslint-disable-next-line
    onError: (error: any) => {
      toast.error(error.message || "An error occurred while changing password")
    },
  })

  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match")
      return
    }
    changePasswordMutation.mutate({ currentPassword, newPassword })
  }

  const renderBreadcrumb = () => {
    const breadcrumbs = ["Dashboard", "Setting"]

    if (currentView === "personal") {
      breadcrumbs.push("Personal Information")
    } else if (currentView === "password") {
      breadcrumbs.push("Change Password")
    }

    return (
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        {breadcrumbs.map((item, index) => (
          <span key={item} className="flex items-center gap-2">
            {item}
            {index < breadcrumbs.length - 1 && <ChevronRight className="w-4 h-4" />}
          </span>
        ))}
      </div>
    )
  }

  const renderMainSettings = () => (
    <div className="space-y-4">
      <div
        className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 border transition-colors"
        onClick={() => setCurrentView("personal")}
      >
        <span className="text-gray-700">Personal Information</span>
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </div>
      <div
        className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 border transition-colors"
        onClick={() => setCurrentView("password")}
      >
        <span className="text-gray-700">Change Password</span>
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </div>
    </div>
  )

  const renderPasswordChange = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Avatar className="w-16 h-16">
          <AvatarImage src={imagePreview || profileData?.data?.imageLink || "/professional-bearded-man.png"} alt={profileData?.data?.name} />
          <AvatarFallback>{profileData?.data?.name?.slice(0, 2).toUpperCase() || "MR"}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold text-gray-900">{profileData?.data?.name || "Mr. Raja"}</h3>
          <p className="text-gray-500">@{profileData?.data?.name.toLowerCase() || "raja123"}</p>
        </div>
      </div>
      <hr className="border-gray-200" />
      <div>
        <h4 className="font-semibold text-gray-900 mb-6">Change Password</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div>
            <label className="block text-sm text-gray-500 mb-2">Current Password</label>
            <div className="relative">
              <Input
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="pr-10 bg-gray-50 border-gray-200"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-2">New Password</label>
            <div className="relative">
              <Input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="pr-10 bg-gray-50 border-gray-200"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-2">Confirm New Password</label>
            <div className="relative">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pr-10 bg-gray-50 border-gray-200"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setCurrentView("main")} className="text-gray-600 hover:text-gray-800">
            ✕ Cancel
          </Button>
          <Button
            className="bg-orange-500 hover:bg-orange-600 text-white"
            onClick={handlePasswordChange}
            disabled={changePasswordMutation.isPending}
          >
            {changePasswordMutation.isPending ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </div>
  )

  const renderPersonalInformation = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={imagePreview || profileData?.data?.imageLink || "/professional-bearded-man.png"} alt={profileData?.data?.name} />
            <AvatarFallback>{profileData?.data?.name?.slice(0, 2).toUpperCase() || "MR"}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-gray-900">{profileData?.data?.name || "Mr. Raja"}</h3>
          </div>
        </div>
        {!isEditing && (
          <Button
            className="bg-[#EFA610] hover:bg-[#EFA610] text-white"
            onClick={() => setIsEditing(true)}
          >
            <Edit className="w-4 h-4 mr-2" />
            Update Profile
          </Button>
        )}
      </div>

      {isLoading ? (
        <div>Loading profile...</div>
      ) : (
        <>
          {isEditing && (
            <div>
              <label className="block text-base text-[#929292] mb-2">Profile Image</label>
              <div className="flex items-center gap-4">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="border-[#616161] h-[40px]"
                />
                <Button className="bg-[#EFA610] hover:bg-[#EFA610] text-white">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload
                </Button>
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-base text-[#929292] mb-2">Full Name</label>
              {isEditing ? (
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="border-[#616161] h-[40px]"
                />
              ) : (
                <div className="border-[#616161] h-[40px] border rounded-md px-3 py-2 text-gray-900 bg-gray-50">
                  {profileData?.data?.name}
                </div>
              )}
            </div>
            <div>
              <label className="block text-base text-[#929292] mb-2">Email</label>
              {isEditing ? (
                <Input
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="border-[#616161] h-[40px]"
                />
              ) : (
                <div className="border-[#616161] h-[40px] border rounded-md px-3 py-2 text-gray-900 bg-gray-50">
                  {profileData?.data?.email}
                </div>
              )}
            </div>
            <div>
              <label className="block text-base text-[#929292] mb-2">Phone Number</label>
              {isEditing ? (
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="border-[#616161] h-[40px]"
                />
              ) : (
                <div className="border-[#616161] h-[40px] border rounded-md px-3 py-2 text-gray-900 bg-gray-50">
                  {profileData?.data?.phone}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {isEditing && (
        <div className="flex justify-end gap-3 pt-4">
          <Button
            variant="ghost"
            onClick={() => {
              setIsEditing(false)
              setImageFile(null)
              setImagePreview(profileData?.data?.imageLink || null)
              setCurrentView("main")
            }}
            className="text-gray-600 hover:text-gray-800"
          >
            ✕ Cancel
          </Button>
          <Button
            className="bg-[#EFA610] hover:bg-[#EFA610] text-white"
            onClick={() => updateProfileMutation.mutate()}
            disabled={updateProfileMutation.isPending}
          >
            {updateProfileMutation.isPending ? "Saving..." : "Save"}
          </Button>
        </div>
      )}
    </div>
  )

  return (
    <div className="min-h-screen">
      <div className="p-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Settings</h1>
        {renderBreadcrumb()}
        <div className="p-6">
          {currentView === "main" && renderMainSettings()}
          {currentView === "password" && renderPasswordChange()}
          {currentView === "personal" && renderPersonalInformation()}
        </div>
      </div>
    </div>
  )
}