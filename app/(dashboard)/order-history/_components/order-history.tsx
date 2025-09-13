'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import { useSession } from 'next-auth/react'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext } from "@/components/ui/pagination"
import { useState } from 'react'
import { toast } from 'sonner'

// Define interfaces for the API response
interface Employee {
  _id: string
  name: string
  employeeId: string
}

interface Product {
  _id: string
  title: string
  price: number
}

interface Shop {
  _id: string
  companyId: string
  companyName: string
}

interface Order {
  _id: string
  employeeId: Employee
  productId: Product
  shopId: Shop
  status: string
  __v: number
}

interface ApiResponse {
  success: boolean
  code: number
  message: string
  data: Order[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

// Skeleton Loader Component
const SkeletonRow = () => (
  <tr>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex items-center">
        <div className="w-10 h-10 bg-gray-200 rounded-md mr-3 animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="h-4 bg-gray-200 rounded w-16 animate-pulse" />
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="h-4 bg-gray-200 rounded w-12 animate-pulse" />
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="h-4 bg-gray-200 rounded w-32 animate-pulse" />
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
      <div className="h-4 bg-gray-200 rounded w-16 mt-1 animate-pulse" />
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex space-x-2">
        <div className="h-7 bg-gray-200 rounded w-20 animate-pulse" />
        <div className="h-7 bg-gray-200 rounded w-20 animate-pulse" />
      </div>
    </td>
  </tr>
)

export function OrderHistory() {
  const { data: session } = useSession()
  const token = session?.accessToken
  const [currentPage, setCurrentPage] = useState(1)
  const queryClient = useQueryClient()

  // Fetch orders using TanStack Query with pagination
  const { data, isLoading, error } = useQuery<ApiResponse>({
    queryKey: ['orders', currentPage],
    queryFn: async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/order?page=${currentPage}&limit=10`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      })
      if (!response.ok) {
        throw new Error('Failed to fetch orders')
      }
      return response.json()
    },
  })

  // Mutation for updating order status
  const updateStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/order/status/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: JSON.stringify({ status }),
      })
      if (!response.ok) {
        throw new Error(`Failed to update order status to ${status}`)
      }
      return response.json()
    },
    onSuccess: (_, variables) => {
      toast.success(`Order ${variables.status === 'approved' ? 'approved' : 'rejected'} successfully!`)
      queryClient.invalidateQueries({ queryKey: ['orders', currentPage] })
    },
    onError: (error) => {
      toast.error(`Error: ${(error as Error).message}`)
    },
  })

  // Format date for display
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    }).format(date)
  }

  // Format time for display
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(date).toLowerCase()
  }

  // Pagination handler
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= (data?.meta.totalPages || 1)) {
      setCurrentPage(page)
    }
  }

  // Render pagination items
  const renderPaginationItems = () => {
    const totalPages = data?.meta.totalPages || 1
    const items = []

    // Add Previous button
    items.push(
      <PaginationItem key="prev">
        <PaginationPrevious 
          onClick={() => handlePageChange(currentPage - 1)}
          className={currentPage === 1 ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
        />
      </PaginationItem>
    )

    // Add page numbers
    for (let i = 1; i <= totalPages; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            onClick={() => handlePageChange(i)}
            isActive={currentPage === i}
            className={currentPage === i ? 'bg-[#1059EF] text-white' : 'text-[#424242]'}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      )
    }

    // Add Next button
    items.push(
      <PaginationItem key="next">
        <PaginationNext 
          onClick={() => handlePageChange(currentPage + 1)}
          className={currentPage === totalPages ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
        />
      </PaginationItem>
    )

    return items
  }

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[#424242] mb-2">Order History</h1>
        <div className="flex items-center text-sm text-gray-500">
          <span>Dashboard</span>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span>Order History</span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden">
        <table className="w-full">
          <thead className="border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-base font-medium text-[#131313] uppercase tracking-wider">
                Product Name
              </th>
              <th className="px-6 py-3 text-left text-base font-medium text-[#131313] uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-base font-medium text-[#131313] uppercase tracking-wider">
                Quantity
              </th>
              <th className="px-6 py-3 text-left text-base font-medium text-[#131313] uppercase tracking-wider">
                Company Name
              </th>
              <th className="px-6 py-3 text-left text-base font-medium text-[#131313] uppercase tracking-wider">
                Employee Id
              </th>
              <th className="px-6 py-3 text-left text-base font-medium text-[#131313] uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left pl工作中

System: 10 text-base font-medium text-[#131313] uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {isLoading ? (
              Array(5).fill(0).map((_, index) => <SkeletonRow key={index} />)
            ) : error ? (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-sm text-red-500">
                  Error loading orders: {(error as Error).message}
                </td>
              </tr>
            ) : (
              data?.data.map((order) => (
                <tr key={order._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-black rounded-md flex items-center justify-center mr-3">
                        <span className="text-white text-xs font-bold">
                          {order.productId.title.slice(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-[#424242]">{order.productId.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#424242]">${order.productId.price.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#424242]">01</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#424242]">{order.shopId.companyName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#424242]">{order.employeeId.employeeId}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-[#424242]">{formatDate(new Date())}</div>
                    <div className="text-sm text-gray-500">{formatTime(new Date())}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <span className={`text-xs px-3 py-1 h-7 rounded-md text-white ${
                        order.status === 'approved' ? 'bg-[#008000]' :
                        order.status === 'cancelled' ? 'bg-[#FF5858]' :
                        'bg-gray-300'
                      }`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                      {order.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            className="text-xs px-3 py-1 h-7 text-white bg-[#008000] hover:bg-[#006600]"
                            onClick={() => updateStatusMutation.mutate({ orderId: order._id, status: 'approved' })}
                            disabled={updateStatusMutation.isPending}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            className="text-xs px-3 py-1 h-7 text-white bg-[#FF5858] hover:bg-[#CC4646]"
                            onClick={() => updateStatusMutation.mutate({ orderId: order._id, status: 'cancelled' })}
                            disabled={updateStatusMutation.isPending}
                          >
                            Cancel
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer with pagination */}
      <div className="flex items-center justify-between px-6 border-t pt-10">
        <div>
          <span className="text-sm text-gray-500">
            {data?.meta
              ? `Showing ${(data.meta.page - 1) * data.meta.limit + 1} to ${Math.min(data.meta.page * data.meta.limit, data.meta.total)} of ${data.meta.total} results`
              : "No results"}
          </span>
        </div>

        <div>
          {data?.meta.totalPages as number > 1 && (
            <Pagination>
              <PaginationContent>
                {renderPaginationItems()}
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </div>
    </div>
  )
}