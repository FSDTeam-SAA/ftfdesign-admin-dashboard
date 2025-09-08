import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Camera, X } from "lucide-react"
import dynamic from "next/dynamic"
import { useMutation } from "@tanstack/react-query"

import { toast } from "sonner"

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false })
import "react-quill/dist/quill.snow.css"
import Image from "next/image"

interface AddBlogFormProps {
  onBack: () => void
}

export function AddBlogForm({ onBack }: AddBlogFormProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)


  // TanStack Query mutation for creating blog
  const createBlogMutation = useMutation({
    mutationFn: async () => {
      const formDataToSend = new FormData()
      formDataToSend.append("data", JSON.stringify({
        blogTitle: title,
        blogDescription: content,
      }))
      if (image) {
        formDataToSend.append("image", image)
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog/create`, {
        method: "POST",
        body: formDataToSend,
      })

      if (!response.ok) {
        throw new Error("Failed to create blog")
      }

      return response.json()
    },
  onSuccess: () => {
  toast.success("Blog created successfully!")
     onBack()
  // clear form after success (optional)
  setTitle("")
  setContent("")
  setImage(null)
  setImagePreview(null)
},
    onError: (error) => {
      toast.error("Failed to create blog. Please try again.")
      console.error("Error creating blog:", error)
    },
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setImage(null)
    setImagePreview(null)
  }

  const handleSave = () => {
    if (!title || !content) {
      toast.error("Please fill in title and content")
      return
    }
    createBlogMutation.mutate()
  }

  const modules = {
    toolbar: [["bold", "italic", "underline"], [{ align: [] }], [{ list: "ordered" }, { list: "bullet" }], ["clean"]],
  }

  const formats = ["bold", "italic", "underline", "align", "list", "bullet"]

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">Blog management</h1>
          <div className="flex items-center text-sm text-gray-500">
            <button onClick={onBack} className="hover:text-gray-700 transition-colors">
              Dashboard
            </button>
            <span className="mx-2">{">"}</span>
            <button onClick={onBack} className="hover:text-gray-700 transition-colors">
              Blog management
            </button>
            <span className="mx-2">{">"}</span>
            <span>Add Blog</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={onBack}
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-lg"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={createBlogMutation.isPending}
            className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            {createBlogMutation.isPending ? "Saving..." : "Save blog"}
          </Button>
        </div>
      </div>

      {/* Form Content */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Column - Form */}
        <div className="col-span-8">
          <div className="rounded-lg border border-gray-200 p-6">
            {/* Blog Title */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Blog Title</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Add your title..."
                className="w-full"
              />
            </div>

            <div className="mb-4">
              <div className="quill-container">
                <ReactQuill
                  theme="snow"
                  value={content}
                  onChange={setContent}
                  modules={modules}
                  formats={formats}
                  placeholder="Description..."
                  className="min-h-[300px]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Thumbnail */}
        <div className="col-span-4">
          <div className="rounded-lg border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-700 mb-4">Thumbnail</h3>

           {/* Upload Area */}
<label
  htmlFor="image-upload"
  className="block border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-500 transition-colors cursor-pointer"
>
  <input
    id="image-upload"
    type="file"
    accept="image/*"
    onChange={handleImageChange}
    className="hidden"
  />

  {imagePreview ? (
    <div className="relative">
      <Image
        src={imagePreview}
        width={100}
        height={100}
        alt="Thumbnail preview"
        className="w-full h-48 object-cover rounded-lg"
      />
      <button
        type="button"
        onClick={handleRemoveImage}
        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
      >
        <X size={16} />
      </button>
    </div>
  ) : (
    <div className="flex flex-col items-center">
      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
        <Camera size={20} className="text-gray-400" />
      </div>
      <p className="text-sm text-gray-500">Click to upload thumbnail</p>
    </div>
  )}
</label>

          </div>
        </div>
      </div>

      <style jsx global>{`
        .quill-container .ql-editor {
          min-height: 300px;
          font-size: 14px;
        }
        .quill-container .ql-toolbar {
          border-top: 1px solid #e5e7eb;
          border-left: 1px solid #e5e7eb;
          border-right: 1px solid #e5e7eb;
        }
        .quill-container .ql-container {
          border-bottom: 1px solid #e5e7eb;
          border-left: 1px solid #e5e7eb;
          border-right: 1px solid #e5e7eb;
        }
      `}</style>
    </div>
  )
}