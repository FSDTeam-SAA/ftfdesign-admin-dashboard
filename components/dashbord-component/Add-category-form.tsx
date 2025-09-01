"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ChevronRight, Upload } from "lucide-react"
import { useRouter } from "next/navigation"

interface AddCategoryFormProps {
  initialData?: {
    id: number
    name: string
    description?: string
  }
  isEdit?: boolean
}

export function AddCategoryForm({ initialData, isEdit = false }: AddCategoryFormProps) {
  const router = useRouter()
  const [title, setTitle] = useState(initialData?.name || "")
  const [description, setDescription] = useState(initialData?.description || "")

  const handleSave = () => {
    // Handle save logic here
    console.log("Saving category:", { title, description })
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">{isEdit ? "Edit Category" : "Add Category"}</h1>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Dashboard</span>
            <ChevronRight className="w-4 h-4" />
            <span>Category</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6">General Information</h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Add Title</label>
                  <Input
                    placeholder="Add your title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full"
                  />
                </div>

                <div>
                  <Textarea
                    placeholder="Description..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full min-h-[200px] resize-none"
                  />
                </div>

                {/* Icon selector section */}
                <div className="flex gap-4 pt-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">$</span>
                  </div>
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">$</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Thumbnail Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Thumbnail</h3>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-4" />
                <p className="text-sm text-gray-500">Upload thumbnail image</p>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end mt-8">
          <Button onClick={handleSave} className="bg-orange-500 hover:bg-orange-600 text-white px-8">
            Save
          </Button>
        </div>
      </div>
    </div>
  )
}
