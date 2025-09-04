"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload } from "lucide-react"
import { useRouter } from "next/navigation"

interface Product {
  id: number
  name: string
  category: string
  price: string
  quantity: number
  date: string
  time: string
}

interface ProductFormProps {
  product?: Product | null
  isEdit?: boolean
}

export function ProductForm({ product, isEdit = false }: ProductFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    quantity: "",
    thumbnail: "",
  })

  useEffect(() => {
    if (product && isEdit) {
      setFormData({
        name: product.name,
        category: product.category,
        price: product.price.replace("$", ""), // Remove $ sign for editing
        quantity: product.quantity.toString(),
        thumbnail: "",
      })
    }
  }, [product, isEdit])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const productData = {
      name: formData.name,
      category: formData.category,
      price: formData.price,
      quantity: formData.quantity,
      thumbnail: formData.thumbnail,
    }

    console.log("[v0] Save product:", productData)
    router.push("/")
  }

  const handleCancel = () => {
    router.push("/")
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className=" text-white px-6 py-4">
        <h1 className="text-xl font-bold text-[#131313]">{isEdit ? "Edit Product" : "Add Product"}</h1>
      </div>

      {/* Breadcrumb */}
      <div className="bg-white px-6 py-3 border-b">
        <div className="flex items-center text-sm text-gray-600">
          <span>Dashboard</span>
          <span className="mx-2">›</span>
          <span>Live Products</span>
          <span className="mx-2">›</span>
          <span>{isEdit ? "Edit Product" : "Add Product"}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Add Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Add Title</label>
              <Input
                type="text"
                placeholder="Add title..."
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="w-full"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                <textarea
                  placeholder="Add price..."
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  className="w-full min-h-[120px] p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Quantity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                  <Input
                    type="number"
                    placeholder="Add quantity..."
                    value={formData.quantity}
                    onChange={(e) => handleInputChange("quantity", e.target.value)}
                    required
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="T-Shirt">T-Shirt</SelectItem>
                      <SelectItem value="Shoes">Shoes</SelectItem>
                      <SelectItem value="Accessories">Accessories</SelectItem>
                      <SelectItem value="Pants">Pants</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Thumbnail */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Thumbnail</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Upload thumbnail</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-6">
              <Button type="button" variant="outline" onClick={handleCancel} className="px-6 bg-transparent">
                Cancel
              </Button>
              <Button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white px-6">
                {isEdit ? "Update Resource" : "Publish Resource"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
