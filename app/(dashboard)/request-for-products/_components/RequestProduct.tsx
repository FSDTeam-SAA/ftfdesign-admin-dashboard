"use client"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import { useSession } from "next-auth/react"
import { useQuery } from "@tanstack/react-query"

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
  const  session  = useSession()
  const token = session?.data?.accessToken

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

      {/* Table */}
      <div className="overflow-hidden">
        {isLoading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>Error fetching products: {error.message}</div>
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
                <th className="px-6 py-3 text-left pl-10 text-base font-medium text-[#131313] uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data?.map((order) => (
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
                          order.status === 'approved' ? 'bg-[#008000] hover:bg-[#008000]' : 'bg-gray-400 hover:bg-gray-400'
                        } text-white text-xs px-3 py-1 h-7`}
                        disabled={order.status !== 'approved'}
                      >
                        Approved
                      </Button>
                      <Button
                        size="sm"
                        className="bg-[#FF5858] hover:bg-[#FF5858] text-white text-xs px-3 py-1 h-7"
                        disabled={order.status === 'approved'}
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