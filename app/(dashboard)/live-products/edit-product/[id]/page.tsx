"use client"

import { useState, useEffect } from "react"
import { useMutation, useQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, X } from "lucide-react"
import { useRouter, useParams } from "next/navigation"
import { Textarea } from "@/components/ui/textarea"
import Image from "next/image"
import { useSession } from "next-auth/react"



interface Category {
  _id: string
  title: string
}

interface ImageFile {
  file?: File
  preview: string
}

const fetchProduct = async (id: string, token?: string) => {
  if (!token) throw new Error("Authentication token is missing")

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  const data = await response.json()
  if (!response.ok) throw new Error(data.message || "Failed to fetch product")
  return data.data
}

const updateProduct = async (id: string, productFormData: FormData, token?: string) => {
  if (!token) throw new Error("Authentication token is missing")

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product/${id}`, {
    method: "PUT", // 🔄 যদি backend PATCH চায় তাহলে এখানে PATCH দাও
    headers: { Authorization: `Bearer ${token}` },
    body: productFormData,
  })

  const data = await response.json()
  if (!response.ok) throw new Error(data.message || "Failed to update product")
  return data
}

export default function ProductForm() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const { data: session } = useSession()
  const token = session?.accessToken

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: 0,
    quantity: 0,
    category: "",
  })

  const [images, setImages] = useState<ImageFile[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loadingCategories, setLoadingCategories] = useState(true)

  // product fetch
  const { data: product, isLoading: isProductLoading, error: productError } = useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProduct(id, token),
    enabled: !!id && !!token,
  })

  // categories fetch
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/category`)
        const data = await response.json()
        if (data.success) setCategories(data.data)
      } catch (error) {
        console.error("Error fetching categories:", error)
        toast.error("Failed to load categories")
      } finally {
        setLoadingCategories(false)
      }
    }
    fetchCategories()
  }, [])

  // যখন product load হবে তখন formData & image বসাও
  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title,
        description: product.description,
        price: product.price,
        quantity: product.quantity,
        category: product.category._id,
      })
      if (product.productImage) {
        setImages([{ preview: product.productImage }])
      }
    }
  }, [product])

  const mutation = useMutation({
    mutationFn: (productFormData: FormData) => updateProduct(id, productFormData, token),
    onSuccess: () => {
      toast.success("Product updated successfully!")
      images.forEach((image) => {
        if (image.file) URL.revokeObjectURL(image.preview)
      })
      router.push("/live-products")
    },
    //eslint-disable-next-line
    onError: (error: any) => {
      toast.error(error.message || "Failed to update product")
    },
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newImages = Array.from(files).map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }))
      setImages((prev) => [...prev, ...newImages])
    }
  }

  const removeImage = (index: number) => {
    setImages((prev) => {
      const updatedImages = prev.filter((_, i) => i !== index)
      if (prev[index].file) URL.revokeObjectURL(prev[index].preview)
      return updatedImages
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const productFormData = new FormData()
    productFormData.append("title", formData.title)
    productFormData.append("description", formData.description)
    productFormData.append("price", String(formData.price))
    productFormData.append("quantity", String(formData.quantity))
    productFormData.append("category", formData.category)

    if (images.length > 0) {
      if (images[0].file) {
        productFormData.append("productImage", images[0].file)
      }
      images.slice(1).forEach((image, index) => {
        if (image.file) {
          productFormData.append(`additionalImages[${index}]`, image.file)
        }
      })
    }

    mutation.mutate(productFormData)
  }

  const handleCancel = () => {
    images.forEach((image) => {
      if (image.file) URL.revokeObjectURL(image.preview)
    })
    router.push("/live-products")
  }

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  if (isProductLoading) return <div>Loading product...</div>
  //eslint-disable-next-line
  if (productError) return <div>Error loading product: {(productError as any).message}</div>

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="text-white px-6 py-4 flex justify-between">
        <h1 className="text-[24px] font-bold text-[#131313]">Edit Product</h1>
        <div className="flex justify-end gap-4 pt-6">
          <Button type="button" variant="outline" onClick={handleCancel} className="px-6 bg-transparent text-[#131313]">
            Cancel
          </Button>
          <Button
            type="submit"
            form="product-form"
            className="bg-[#D9AD5E] hover:bg-[#D9AD5E] text-white px-6"
            disabled={mutation.isPending || !token}
          >
            {mutation.isPending ? "Updating..." : "Update Resource"}
          </Button>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="px-6 py-3">
        <div className="flex items-center text-sm text-gray-600">
          <span>Dashboard</span>
          <span className="mx-2">›</span>
          <span>Live Products</span>
          <span className="mx-2">›</span>
          <span>Edit Product</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="p-6">
          <form id="product-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
              {/* Left column */}
              <div className="col-span-3">
                <div>
                  <label className="block text-16 font-semibold text-[#131313] mb-2">Title</label>
                  <Input
                    type="text"
                    placeholder="Add your title..."
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    className="w-full border border-[#B6B6B6] rounded-md px-3 h-[50px]"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-[23px]">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                    <Input
                      type="number"
                      placeholder="Add price..."
                      value={formData.price}
                      onChange={(e) => handleInputChange("price", Number(e.target.value))}
                      className="w-full border border-[#B6B6B6] rounded-md px-3 h-[50px]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                    <Input
                      type="number"
                      placeholder="Add Quantity..."
                      value={formData.quantity}
                      onChange={(e) => handleInputChange("quantity", Number(e.target.value))}
                      className="w-full border border-[#B6B6B6] rounded-md px-3 h-[50px]"
                      required
                    />
                  </div>
                </div>

                <label className="block text-sm font-medium text-gray-700 mb-2 mt-6">Description</label>
                <Textarea
                  placeholder="Add description..."
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  className="w-full h-[241px] border-[#B6B6B6] rounded-md"
                />
              </div>

              {/* Right column */}
              <div className="space-y-6 col-span-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => handleInputChange("category", value)}
                    disabled={loadingCategories}
                  >
                    <SelectTrigger className="w-full border border-[#B6B6B6] rounded-md px-3 h-[50px]">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category._id} value={category._id}>
                          {category.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Images</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Upload images</p>
                    </label>
                  </div>

                  {images.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      {images.map((image, index) => (
                        <div key={index} className="relative">
                          <Image
                            src={image.preview}
                            width={100}
                            height={100}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-32 object-cover rounded-md"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
