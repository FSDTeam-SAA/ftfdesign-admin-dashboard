"use client"

import { useState } from "react"
import { useQuery } from '@tanstack/react-query'
import { Button } from "@/components/ui/button"
import { Eye} from "lucide-react"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext } from "@/components/ui/pagination"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import Image from "next/image"

// Define interfaces for TypeScript
interface User {
  _id: string
  name: string
  email: string
  isVerified: boolean
  isShopCreated: boolean
  shop: string
}

interface Shop {
  _id: string
  userId: User
  companyId: string
  companyName: string
  companyLogo: string
  companyBanner: string
  companyAddress: string
  status: string
  subscriptionEmployees: number
  totalGivenCoin: number
  totalUsedCoin: number
  createdAt: string
  updatedAt: string
  subscriptionPlan: string
  subscriptionEndDate: string
  subscriptionStartDate: string
}

interface PaginationData {
  total: number
  page: number
  limit: number
  totalPages: number
}

interface ApiResponse {
  success: boolean
  code: number
  message: string
  data: Shop[]
  pagination: PaginationData
}

// Fetch function for the API
const fetchShops = async (page: number = 1): Promise<ApiResponse> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shop?page=${page}&limit=10`)
  if (!response.ok) {
    throw new Error('Failed to fetch shops')
  }
  return response.json()
}

export default function CompanyWebsiteDashboard() {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null)

  // Use TanStack Query to fetch data
  const { data, isLoading, error } = useQuery<ApiResponse>({
    queryKey: ['shops', currentPage],
    queryFn: () => fetchShops(currentPage),
  })

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: '2-digit',
      year: 'numeric'
    })
  }

  // Render pagination items
  const renderPaginationItems = () => {
    if (!data?.pagination) return null
    const { totalPages, page } = data.pagination
    const pages = []

    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <PaginationItem key={i}>
          <PaginationLink
            isActive={i === page}
            onClick={() => setCurrentPage(i)}
            className={i === page ? "bg-[#1059EF] text-white" : ""}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      )
    }

    return (
      <>
        <PaginationPrevious
          onClick={() => page > 1 && setCurrentPage(page - 1)}
          className={page === 1 ? "pointer-events-none opacity-50" : ""}
        />
        {pages}
        <PaginationNext
          onClick={() => page < totalPages && setCurrentPage(page + 1)}
          className={page === totalPages ? "pointer-events-none opacity-50" : ""}
        />
      </>
    )
  }

  // Loading skeleton
  const renderLoadingSkeleton = () => (
    <div className="p-6 min-h-screen">
      <div className="animate-pulse">
        <div className="p-6 border-b">
          <div className="h-8 w-64 bg-gray-200 rounded"></div>
          <div className="flex items-center gap-2 mt-2">
            <div className="h-4 w-24 bg-gray-200 rounded"></div>
            <div className="h-4 w-4 bg-gray-200 rounded"></div>
            <div className="h-4 w-32 bg-gray-200 rounded"></div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b">
              <tr>
                {Array(5).fill(0).map((_, index) => (
                  <th key={index} className="px-6 py-4">
                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {Array(5).fill(0).map((_, index) => (
                <tr key={index}>
                  {Array(5).fill(0).map((_, cellIndex) => (
                    <td key={cellIndex} className="px-6 py-4">
                      <div className="h-4 w-32 bg-gray-200 rounded"></div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  if (isLoading) return renderLoadingSkeleton()
  if (error) return <div className="min-h-screen p-6">Error: {(error as Error).message}</div>

  return (
    <div className="p-6 min-h-screen">
      <div>
        {/* Header */}
        <div className="p-6 border-b">
          <h1 className="text-2xl font-semibold text-gray-900">Company Website</h1>
          <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
            <span>Dashboard</span>
            <span>›</span>
            <span>Company Website</span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Company ID</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Author Name</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Company Name</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Last Updated</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data?.data.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{item.companyId}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{item.userId.name}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Image
                        src={item.companyLogo}
                        width={100}
                        height={100}
                        alt={item.companyName}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className="text-sm text-gray-900">{item.companyName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{formatDate(item.updatedAt)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0"
                            onClick={() => setSelectedShop(item)}
                          >
                             <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[625px]">
                          <DialogHeader>
                            <DialogTitle>{selectedShop?.companyName} Details</DialogTitle>
                          </DialogHeader>
                          {selectedShop && (
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-2 items-center gap-4">
                                <span className="font-medium">Company ID:</span>
                                <span>{selectedShop.companyId}</span>
                              </div>
                              <div className="grid grid-cols-2 items-center gap-4">
                                <span className="font-medium">Author Name:</span>
                                <span>{selectedShop.userId.name}</span>
                              </div>
                              <div className="grid grid-cols-2 items-center gap-4">
                                <span className="font-medium">Company Address:</span>
                                <span>{selectedShop.companyAddress}</span>
                              </div>
                              <div className="grid grid-cols-2 items-center gap-4">
                                <span className="font-medium">Status:</span>
                                <span>{selectedShop.status}</span>
                              </div>
                              <div className="grid grid-cols-2 items-center gap-4">
                                <span className="font-medium">Subscription Plan:</span>
                                <span>{selectedShop.subscriptionPlan}</span>
                              </div>
                              <div className="grid grid-cols-2 items-center gap-4">
                                <span className="font-medium">Subscription Start:</span>
                                <span>{formatDate(selectedShop.subscriptionStartDate)}</span>
                              </div>
                              <div className="grid grid-cols-2 items-center gap-4">
                                <span className="font-medium">Subscription End:</span>
                                <span>{formatDate(selectedShop.subscriptionEndDate)}</span>
                              </div>
                              <div className="grid grid-cols-2 items-center gap-4">
                                <span className="font-medium">Total Employees:</span>
                                <span>{selectedShop.subscriptionEmployees}</span>
                              </div>
                              <div className="grid grid-cols-2 items-center gap-4">
                                <span className="font-medium">Total Given Coins:</span>
                                <span>{selectedShop.totalGivenCoin}</span>
                              </div>
                              <div className="grid grid-cols-2 items-center gap-4">
                                <span className="font-medium">Total Used Coins:</span>
                                <span>{selectedShop.totalUsedCoin}</span>
                              </div>
                              <div className="grid grid-cols-2 items-center gap-4">
                                <span className="font-medium">Created At:</span>
                                <span>{formatDate(selectedShop.createdAt)}</span>
                              </div>
                              <div className="grid grid-cols-2 items-center gap-4">
                                <span className="font-medium">Last Updated:</span>
                                <span>{formatDate(selectedShop.updatedAt)}</span>
                              </div>
                              <div className="grid grid-cols-2 items-center gap-4">
                                <span className="font-medium">Company Logo:</span>
                                <Image
                                  src={selectedShop.companyLogo}
                                  alt={selectedShop.companyName}
                                  width={100}
                                  height={100}
                                  className="w-16 h-16 rounded-full object-cover"
                                />
                              </div>
                              <div className="grid grid-cols-2 items-center gap-4">
                                <span className="font-medium">Company Banner:</span>
                                <Image
                                  src={selectedShop.companyBanner}
                                  alt={selectedShop.companyName}
                                  width={1000}
                                  height={1000}
                                  className="w-32 h-16 object-cover rounded"
                                />
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      {/* <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Edit className="h-4 w-4" />
                      </Button> */}
                      {/* <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Eye className="h-4 w-4" />
                      </Button> */}
                      {/* <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button> */}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer with pagination */}
        {data?.pagination && (
          <div className="flex items-center justify-between px-6 border-t pt-10">
            <div>
              <span className="text-sm text-gray-500">
                Showing {(data.pagination.page - 1) * data.pagination.limit + 1} to{" "}
                {Math.min(data.pagination.page * data.pagination.limit, data.pagination.total)} of{" "}
                {data.pagination.total} results
              </span>
            </div>
            {data.pagination.totalPages > 1 && (
              <Pagination>
                <PaginationContent>{renderPaginationItems()}</PaginationContent>
              </Pagination>
            )}
          </div>
        )}
      </div>
    </div>
  )
}