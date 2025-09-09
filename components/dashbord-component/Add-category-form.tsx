"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { ChevronRight, Upload, X, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { useSession } from "next-auth/react"

interface AddCategoryFormProps {
  initialData?: {
  id: string;
  name: string;
  description: string;
  thumbnail?: string;
  }
  isEdit?: boolean
}

interface FormErrors {
  title?: string
  thumbnail?: string
}

export function AddCategoryForm({ initialData, isEdit = false }: AddCategoryFormProps) {
  const router = useRouter()
  const [title, setTitle] = useState(initialData?.name || "")
  // const [description, setDescription] = useState(initialData?.description || "")
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [errors, setErrors] = useState<FormErrors>({})
  const fileInputRef = useRef<HTMLInputElement>(null)
  const session = useSession()
  const token = session?.data?.accessToken
  
  // Form validation
  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {}
    
    if (!title.trim()) {
      newErrors.title = "Title is required"
    } else if (title.length < 3) {
      newErrors.title = "Title must be at least 3 characters long"
    }

    if (!selectedImage && !isEdit) {
      newErrors.thumbnail = "Thumbnail image is required"
    }

    return newErrors
  }

  // TanStack Query mutation for form submission
  const mutation = useMutation({
    mutationFn: async () => {
   
      
      if (!token && !isEdit) {
        throw new Error("Authentication token not found")
      }

      const formData = new FormData()
      formData.append("data", JSON.stringify({ title }))
      if (selectedImage) {
        formData.append("thumbnail", selectedImage)
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/category/create`, {
        method: "POST",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to create category")
      }

      return response.json()
    },
    onSuccess: (data) => {
      toast.success(data.message || "Category created successfully")
      router.push("/category")
    },
    //eslint-disable-next-line
    onError: (error: any) => {
      toast.error(error.message || "Failed to create category")
    },
  })

  const handleSave = () => {
    const validationErrors = validateForm()
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length === 0) {
      mutation.mutate()
    } else {
      toast.error("Please fix the form errors before submitting")
    }
  }

  const handleGoBack = () => {
    router.back()
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      // setErrors((prev) => ({ ...prev, thumbnail: undefinedAsString }))
    }
  }

  const handleRemoveImage = () => {
    setSelectedImage(null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    setErrors((prev) => ({ ...prev, thumbnail: "Thumbnail image is required" }))
  }

  const handleUploadAreaClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="min-h-screen p-6">
      <div className="w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">{isEdit ? "Edit Category" : "Add Category"}</h1>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Dashboard</span>
            <ChevronRight className="w-4 h-4" />
            <span>Category</span>
          </div>
        </div>

        <div className=" max-w-4xl ">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <div className="rounded-lg  ">
              <h2 className="text-lg font-medium text-gray-900 mb-6">General Information</h2>

              <div className="space-y-6">
                <div className="">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Add Title</label>
                  <Input
                    placeholder="Add your title..."
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value)
                      setErrors((prev) => ({ ...prev, title: undefined }))
                    }}
                    className={`w-full ${errors.title ? "border-red-500" : ""}`}
                  />
                  {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                </div>

                {/* <div>
                  <Textarea
                    placeholder="Description..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full min-h-[200px] resize-none"
                  />
                </div> */}
              </div>
            </div>
          </div>

          {/* Thumbnail Section */}
          <div className="lg:col-span-1 border border-gray-200 rounded-lg mt-5">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Thumbnail</h3>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />

              {imagePreview ? (
                <div className="relative border border-gray-300 rounded-lg overflow-hidden">
                  <div className="relative w-full h-64">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <button
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                  >
                    <X className="w-01 h-5 text-gray-700" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={handleUploadAreaClick}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors ${
                    errors.thumbnail ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-4" />
                  <p className="text-sm text-gray-500">Upload thumbnail image</p>
                  <p className="text-xs text-gray-400 mt-1">Click to browse</p>
                </div>
              )}
              {errors.thumbnail && <p className="text-red-500 text-sm mt-2">{errors.thumbnail}</p>}
            </div>
          </div>
      
        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mt-8">
          <Button 
            onClick={handleGoBack} 
            variant="outline" 
            className="flex items-center gap-2"
            disabled={mutation.isPending}
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Button>
          <Button 
            onClick={handleSave} 
            className="bg-[#EFA610] hover:bg-[#EFA610] text-white px-8"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Saving..." : "Save"}
          </Button>
        </div>
        </div>

      </div>
    </div>
  )
}