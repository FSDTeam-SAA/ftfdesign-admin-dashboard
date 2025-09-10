
"use client"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import { useSession } from "next-auth/react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import Image from "next/image"

// Define TypeScript interfaces for the API response
interface Product {
  _id: string;
  title: string;
  price: number;
  quantity: number;
  category: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
}

interface Shop {
  _id: string;
  companyId: string;
  companyName: string;
  companyAddress: string;
}

interface AssignedProduct {
  _id: string;
  productId: Product;
  userId: User;
  shopId: Shop;
  coin: number;
  status: string;
  __v: number;
}

export function RequestProduct() {
  const session = useSession()
  const token = session?.data?.accessToken
  const queryClient = useQueryClient()

  // Fetch data using TanStack Query with native fetch
  const { data, isLoading, error } = useQuery<AssignedProduct[], Error>({
    queryKey: ['assignedProducts'],
    queryFn: async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/assigned-product`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      const result = await response.json()
      return result.data
    },
    enabled: !!token, // Only fetch when token is available
  })

  // Mutation to update product status
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/assigned-product/status/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })
      if (!response.ok) {
        throw new Error('Failed to update status')
      }
      return response.json()
    },
    onMutate: async ({ id, status }) => {
      // Cancel any outgoing refetches to avoid overwriting optimistic update
      await queryClient.cancelQueries({ queryKey: ['assignedProducts'] })

      // Snapshot the previous value
      const previousData = queryClient.getQueryData(['assignedProducts'])

      // Optimistically update the status
      queryClient.setQueryData(['assignedProducts'], (old: AssignedProduct[] | undefined) =>
        old?.map((item) =>
          item._id === id ? { ...item, status } : item
        )
      )

      // Return context with previous data for rollback on error
      return { previousData }
    },
    onError: (err, variables, context) => {
      // Rollback to previous data on error
      queryClient.setQueryData(['assignedProducts'], context?.previousData)
    },
    onSettled: () => {
      // Refetch to ensure data is in sync with server
      queryClient.invalidateQueries({ queryKey: ['assignedProducts'] })
    },
  })

  // Handle status update
  const handleStatusUpdate = (id: string, status: string) => {
    updateStatusMutation.mutate({ id, status })
  }

  // Skeleton Loader Component
  const SkeletonRow = () => (
    <tr className="animate-pulse">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gray-200 rounded-md mr-3"></div>
          <div className="h-4 bg-gray-200 rounded w-32"></div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-4 bg-gray-200 rounded w-16"></div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-4 bg-gray-200 rounded w-12"></div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-4 bg-gray-200 rounded w-24"></div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-4 bg-gray-200 rounded w-20"></div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-4 bg-gray-200 rounded w-16"></div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex space-x-2">
          <div className="h-7 bg-gray-200 rounded w-20"></div>
          <div className="h-7 bg-gray-200 rounded w-20"></div>
        </div>
      </td>
    </tr>
  )

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[#424242] mb-2">Request For Products</h1>
        <div className="flex items-center text-sm text-gray-500">
          <span>Dashboard</span>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span>Request For Products</span>
        </div>
      </div>

      {/* Table or Skeleton/No Data */}
      <div className="overflow-hidden">
        {isLoading ? (
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
                <th className="px-6 py-3 text-left pl-10 text-base font-medium text-[#131313] uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {Array(5).fill(0).map((_, index) => (
                <SkeletonRow key={index} />
              ))}
            </tbody>
          </table>
        ) : error ? (
          <div className="text-center text-gray-500 py-4">Error fetching products: {error.message}</div>
        ) : !data || data.length === 0 ? (
          <div className="text-center text-gray-500 py-4">No data available</div>
        ) : (
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
                <th className="px-6 py-3 text-left pl-10 text-base font-medium text-[#131313] uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data?.map((order) => (
                <tr key={order._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-black rounded-md flex items-center justify-center mr-3">
                        <Image src={""} alt={order.productId.title} width={40} height={40} />
                      </div>
                      <span className="text-sm font-medium text-[#424242]">{order.productId.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#424242]">${order.productId.price.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#424242]">{order.productId.quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#424242]">{order.shopId.companyName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#424242]">{order.shopId.companyId}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-[#424242]">-</div>
                    <div className="text-sm text-gray-500">-</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        className={`${
                          order.status === 'approved'
                            ? 'bg-[#008000] hover:bg-[#008000]'
                            : 'bg-[#4CAF50] hover:bg-[#45a049]'
                        } text-white text-xs px-3 py-1 h-7`}
                        onClick={() => handleStatusUpdate(order._id, 'approved')}
                        disabled={order.status !== 'pending'}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        className={`${
                          order.status === 'rejected'
                            ? 'bg-[#FF5858] hover:bg-[#FF5858]'
                            : 'bg-[#FF0000] hover:bg-[#e60000]'
                        } text-white text-xs px-3 py-1 h-7`}
                        onClick={() => handleStatusUpdate(order._id, 'rejected')}
                        disabled={order.status !== 'pending'}
                      >
                        Cancel
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}