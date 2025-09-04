"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, ChevronRight } from "lucide-react"
import Link from "next/link"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination"

interface Category {
  _id: string
  title: string
  thumbnail: string
  createdAt: string
  updatedAt: string
}

interface CategoryResponse {
  success: boolean
  code: number
  message: string
  data: Category[]
  pagination: {
    totalCategories: number
    currentPage: number
    totalPages: number
    limit: number
  }
}

export function CategoriesTable() {
  const [currentPage, setCurrentPage] = useState(1)
  const limit = 10

  const {
    data: response,
    isLoading,
    error,
  } = useQuery<CategoryResponse>({
    queryKey: ["categories", currentPage, limit],
    queryFn: async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/category?page=${currentPage}&limit=${limit}`)
      if (!response.ok) {
        throw new Error("Failed to fetch categories")
      }
      return response.json()
    },
  })

  const categories = response?.data || []
  const pagination = response?.pagination

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    })
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const renderPaginationItems = () => {
    if (!pagination) return null

    const items = []
    const { currentPage: current, totalPages } = pagination

    // Previous button
    items.push(
      <PaginationItem key="prev">
        <PaginationPrevious
          href="#"
          onClick={(e) => {
            e.preventDefault()
            if (current > 1) handlePageChange(current - 1)
          }}
          className={current <= 1 ? "pointer-events-none opacity-50" : ""}
        />
      </PaginationItem>,
    )

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= current - 1 && i <= current + 1)) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault()
                handlePageChange(i)
              }}
              isActive={i === current}
            >
              {i}
            </PaginationLink>
          </PaginationItem>,
        )
      } else if ((i === current - 2 && current > 3) || (i === current + 2 && current < totalPages - 2)) {
        items.push(
          <PaginationItem key={`ellipsis-${i}`}>
            <PaginationEllipsis />
          </PaginationItem>,
        )
      }
    }

    // Next button
    items.push(
      <PaginationItem key="next">
        <PaginationNext
          href="#"
          onClick={(e) => {
            e.preventDefault()
            if (current < totalPages) handlePageChange(current + 1)
          }}
          className={current >= totalPages ? "pointer-events-none opacity-50" : ""}
        />
      </PaginationItem>,
    )

    return items
  }

  // Skeleton loading component
  const SkeletonRow = () => (
    <tr className="animate-pulse">
      <td className="py-4 px-6">
        <div className=" h-[40px] w-[200px] rounded-[8px]"></div>
      </td>
      <td className="py-4 px-6">
        <div className="h-4 w-24 rounded"></div>
      </td>
      <td className="py-4 px-6 flex items-center justify-end">
        <div className="flex items-center gap-2">
          <div className=" h-8 w-8 rounded"></div>
          <div className=" h-8 w-8 rounded"></div>
        </div>
      </td>
    </tr>
  )

  if (isLoading) {
    return (
      <div className="">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#B6B6B6] pb-7">
          <div className="gap-4">
            <div className=" h-8 w-48 rounded animate-pulse"></div>
            <div className="flex items-center gap-2 mt-3">
              <div className=" h-4 w-20 rounded animate-pulse"></div>
              <div className=" h-4 w-4 rounded animate-pulse"></div>
              <div className=" h-4 w-24 rounded animate-pulse"></div>
            </div>
          </div>
          <div className=" h-[50px] w-32 rounded-[2px] animate-pulse"></div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left py-4 px-6">
                  <div className=" h-6 w-24 rounded animate-pulse"></div>
                </th>
                <th className="text-left py-4 px-6">
                  <div className=" h-6 w-20 rounded animate-pulse"></div>
                </th>
                <th className="text-right py-4 px-6">
                  <div className=" h-6 w-20 rounded animate-pulse"></div>
                </th>
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, index) => (
                <SkeletonRow key={index} />
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer with pagination */}
        <div className="flex items-center justify-between px-6 border-t pt-10">
          <div className=" h-4 w-48 rounded animate-pulse"></div>
          <div className="flex gap-2">
            <div className=" h-8 w-8 rounded animate-pulse"></div>
            <div className=" h-8 w-8 rounded animate-pulse"></div>
            <div className=" h-8 w-8 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg text-red-500">Error loading categories</div>
      </div>
    )
  }

  return (
    <div className="">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-[#B6B6B6] pb-7">
        <div className=" gap-4">
          <h1 className="text-2xl bold text-[#131313]">Categories</h1>
          <div className="flex items-center gap-2 text-sm text-[#929292] mt-3">
            <span>Dashboard</span>
            <ChevronRight className="w-4 h-4" />
            <span>Categories</span>
          </div>
        </div>
        <Link href="/category/add">
          <Button className="bg-[#D9AD5E] hover:bg-[#D9AD5E] text-white h-[50px] rounded-[2px]">
            + Add Categories
          </Button>
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="">
            <tr>
              <th className="text-left py-4 px-6 text-[18px] text-[#131313] font-bold">Name</th>
              <th className="text-left py-4 px-6 text-[18px] text-[#131313] font-bold">Date</th>
              <th className="text-right py-4 px-6 text-[18px] text-[#131313] font-bold">Action</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category: Category) => (
              <tr key={category._id} className="border-t border-[#B6B6B6] pt-10"  >
                <td className="py-4 px-6">
                  <span className=" bg-[#EFA610] text-white px-4 py-2 text-sm font-medium text-center w-[200px] h-[40px] rounded-[8px] flex items-center justify-center">
                    {category.title}
                  </span>
                </td>
                <td className="py-4 px-6 text-base text-[#424242]">{formatDate(category.createdAt)}</td>
                <td className="py-4 px-6 flex items-center justify-end">
                  <div className="flex items-center gap-2">
                    <Link href={`/category/edit/${category._id}`}>
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
      <div className="flex items-center justify-between px-6 border-t pt-10">
        <div>
          <span className="text-sm text-gray-500">
            {pagination
              ? `Showing ${(pagination.currentPage - 1) * pagination.limit + 1} to ${Math.min(pagination.currentPage * pagination.limit, pagination.totalCategories)} of ${pagination.totalCategories} results`
              : "No results"}
          </span>
        </div>

        <div>
          {pagination && pagination.totalPages > 1 && (
            <Pagination>
              <PaginationContent>{renderPaginationItems()}</PaginationContent>
            </Pagination>
          )}
        </div>
      </div>
    </div>
  )
}