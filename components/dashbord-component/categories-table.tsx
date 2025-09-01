"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"

// Dummy data matching the image
const categoriesData = [
  { id: 1, name: "T-Shirt", date: "04/15/2025" },
  { id: 2, name: "Shirts", date: "04/15/2025" },
  { id: 3, name: "Pants & Shorts", date: "04/15/2025" },
  { id: 4, name: "Bag & Backpacks", date: "04/15/2025" },
  { id: 5, name: "Gifts", date: "04/15/2025" },
]

export function CategoriesTable() {
  const [categories] = useState(categoriesData)

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-semibold text-gray-900">Categories</h1>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Dashboard</span>
            <ChevronRight className="w-4 h-4" />
            <span>Categories</span>
          </div>
          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">5</span>
          </div>
        </div>
        <Link href="/categories/add">
          <Button className="bg-orange-500 hover:bg-orange-600 text-white">+ Add Categories</Button>
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-4 px-6 font-medium text-gray-700">Name</th>
              <th className="text-left py-4 px-6 font-medium text-gray-700">Date</th>
              <th className="text-left py-4 px-6 font-medium text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category, index) => (
              <tr key={category.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="py-4 px-6">
                  <span className="inline-block bg-orange-500 text-white px-4 py-2 rounded-md text-sm font-medium">
                    {category.name}
                  </span>
                </td>
                <td className="py-4 px-6 text-gray-600">{category.date}</td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <Link href={`/categories/edit/${category.id}`}>
                      <Button variant="ghost" size="sm" className="p-2">
                        <Edit className="w-4 h-4 text-gray-500" />
                      </Button>
                    </Link>
                    <Button variant="ghost" size="sm" className="p-2">
                      <Trash2 className="w-4 h-4 text-gray-500" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer with pagination */}
      <div className="flex items-center justify-between p-6 border-t">
        <span className="text-sm text-gray-500">Showing 1 of 10 results</span>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="p-2">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="w-8 h-8 bg-blue-600 text-white hover:bg-blue-700">
            1
          </Button>
          <Button variant="ghost" size="sm" className="w-8 h-8">
            2
          </Button>
          <Button variant="ghost" size="sm" className="w-8 h-8">
            3
          </Button>
          <Button variant="ghost" size="sm" className="p-2">
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
