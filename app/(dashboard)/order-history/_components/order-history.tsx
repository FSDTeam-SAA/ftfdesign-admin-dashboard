"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";
import { useSession } from "next-auth/react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import { useState } from "react";
import { toast } from "sonner";
import Image from "next/image";

interface Product {
  title: string;
  price: number;
  quantity: number;
  totalCoin: number;
  image: string;
  productId: string;
  _id: string;
}

interface Employee {
  _id: string;
  name: string;
  email: string;
}

interface Shop {
  _id: string;
  companyName: string;
}

interface Order {
  _id: string;
  employee: Employee;
  shop: Shop;
  items: Product[];
  status: "pending" | "rejected" | "delivered" | "approved";
  country: string;
  zipCode: number;
  name: string;
  address: string;
  totalPayCoin: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
  paymentStatus?: string;
}

interface ApiResponse {
  success: boolean;
  code: number;
  message: string;
  data: Order[]; // Fixed: data is directly an array of orders
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
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
      <div className="h-7 bg-gray-200 rounded w-20 animate-pulse" />
    </td>
  </tr>
);

export function OrderHistory() {
  const { data: session } = useSession();
  const token = session?.accessToken;
  const [currentPage, setCurrentPage] = useState(1);
  const queryClient = useQueryClient();

  // Fetch orders using TanStack Query with pagination
  const { data, isLoading, error, isFetching } = useQuery<ApiResponse>({
    queryKey: ["orders", currentPage],
    queryFn: async () => {
      if (!token) {
        throw new Error("No authentication token available");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/order?page=${currentPage}&limit=10`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(
          `Failed to fetch orders: ${response.status} ${errorData}`
        );
      }

      const result = await response.json();
      console.log("API Response:", result); // Debug log
      return result;
    },
    enabled: !!token, // Only run query when token is available
    retry: 3,
    retryDelay: 1000,
  });

  // Mutation for updating order status
  const updateStatusMutation = useMutation({
    mutationFn: async ({
      orderId,
      status,
    }: {
      orderId: string;
      status: string;
    }) => {
      if (!token) {
        throw new Error("No authentication token available");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/order/status/${orderId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(
          `Failed to update order status: ${response.status} ${errorData}`
        );
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      toast.success(
        `Order status updated to ${variables.status} successfully!`
      );
      // Invalidate and refetch the current page
      queryClient.invalidateQueries({ queryKey: ["orders", currentPage] });
    },
    onError: (error) => {
      toast.error(`Error: ${(error as Error).message}`);
    },
  });

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return new Intl.DateTimeFormat("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      }).format(new Date(dateString));
    } catch {
      return "Invalid Date";
    }
  };

  // Format time for display
  const formatTime = (dateString: string) => {
    try {
      return new Intl.DateTimeFormat("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
        .format(new Date(dateString))
        .toLowerCase();
    } catch {
      return "Invalid Time";
    }
  };

  // Pagination handler
  const handlePageChange = (page: number) => {
    const totalPages = data?.meta?.totalPages || 1;
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page);
    }
  };

  // Calculate pagination range for better UX
  const getPaginationRange = () => {
    const totalPages = data?.meta?.totalPages || 1;
    const delta = 2; // Number of pages to show on each side of current page
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  // Render pagination items with improved logic
  const renderPaginationItems = () => {
    const totalPages = data?.meta?.totalPages || 1;
    if (totalPages <= 1) return null;

    const items = [];
    const paginationRange = getPaginationRange();

    // Add Previous button
    items.push(
      <PaginationItem key="prev">
        <PaginationPrevious
          onClick={() => handlePageChange(currentPage - 1)}
          className={
            currentPage === 1 || isFetching
              ? "cursor-not-allowed opacity-50"
              : "cursor-pointer hover:bg-gray-100"
          }
        />
      </PaginationItem>
    );

    // Add page numbers
    paginationRange.forEach((page, index) => {
      if (page === "...") {
        items.push(
          <PaginationItem key={`dots-${index}`}>
            <span className="px-3 py-2 text-gray-500">...</span>
          </PaginationItem>
        );
      } else {
        items.push(
          <PaginationItem key={page}>
            <PaginationLink
              onClick={() => handlePageChange(page as number)}
              isActive={currentPage === page}
              className={`cursor-pointer ${
                currentPage === page
                  ? "bg-[#1059EF] text-white hover:bg-[#0d4cc7]"
                  : "text-[#424242] hover:bg-gray-100"
              } ${isFetching ? "cursor-not-allowed opacity-50" : ""}`}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        );
      }
    });

    // Add Next button
    items.push(
      <PaginationItem key="next">
        <PaginationNext
          onClick={() => handlePageChange(currentPage + 1)}
          className={
            currentPage === totalPages || isFetching
              ? "cursor-not-allowed opacity-50"
              : "cursor-pointer hover:bg-gray-100"
          }
        />
      </PaginationItem>
    );

    return items;
  };

  // Status options for dropdown
  const statusOptions: Order["status"][] = ["pending", "delivered"];

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-[#008000]";
      case "rejected":
        return "bg-[#FF5858]";
      case "delivered":
        return "bg-[#1059EF]";
      case "pending":
        return "bg-[#FFA500]";
      default:
        return "bg-gray-300";
    }
  };

  // Handle loading and error states
  if (!token) {
    return (
      <div className="p-6">
        <div className="text-center text-gray-500">
          Please log in to view your orders.
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[#424242] mb-2">
          Order History
        </h1>
        <div className="flex items-center text-sm text-gray-500">
          <span>Dashboard</span>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span>Order History</span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-[#131313] uppercase tracking-wider">
                  Product Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-[#131313] uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-[#131313] uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-[#131313] uppercase tracking-wider">
                  Company Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-[#131313] uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-[#131313] uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-[#131313] uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {isLoading ? (
                Array(5)
                  .fill(0)
                  .map((_, index) => <SkeletonRow key={index} />)
              ) : error ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-8 text-center text-sm text-red-500"
                  >
                    <div className="flex flex-col items-center">
                      <span className="mb-2">❌ Error loading orders</span>
                      <span className="text-xs text-gray-400">
                        {(error as Error).message}
                      </span>
                      <button
                        onClick={() =>
                          queryClient.refetchQueries({
                            queryKey: ["orders", currentPage],
                          })
                        }
                        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs"
                      >
                        Retry
                      </button>
                    </div>
                  </td>
                </tr>
              ) : !data?.data || data.data.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-8 text-center text-sm text-gray-500"
                  >
                    <div className="flex flex-col items-center">
                      <span className="text-2xl mb-2">📦</span>
                      <span>No orders found</span>
                    </div>
                  </td>
                </tr>
              ) : (
                data.data.map((order) => (
                  <tr
                    key={order._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-black rounded-md flex items-center justify-center mr-3">
                          {order.items[0]?.image ? (
                            <Image
                              src={order.items[0]?.image || "/placeholder.png"}
                              alt={order.items[0]?.title || "Product Image"}
                              width={100}
                              height={100}
                              className="object-cover rounded-md"
                            />
                          ) : (
                            <span className="text-white text-xs font-bold">
                              {order.items[0]?.title
                                ?.slice(0, 2)
                                .toUpperCase() || "N/A"}
                            </span>
                          )}
                        </div>
                        <div className="max-w-[200px]">
                          <span className="text-sm font-medium text-[#424242] line-clamp-2">
                            {order.items.map((item) => item.title).join(", ")}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#424242]">
                      $
                      {order.items
                        .reduce((sum, item) => sum + item.price, 0)
                        .toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#424242]">
                      {order.items.reduce(
                        (sum, item) => sum + item.quantity,
                        0
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#424242]">
                      {order.shop?.companyName || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#424242]">
                      <div>
                        <div className="font-medium">
                          {order.employee?.name || "N/A"}
                        </div>
                        <div className="text-xs text-gray-500">
                          {order.employee?.email || ""}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-[#424242]">
                        {formatDate(order.createdAt)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatTime(order.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          updateStatusMutation.mutate({
                            orderId: order._id,
                            status: e.target.value,
                          })
                        }
                        disabled={updateStatusMutation.isPending}
                        className={`text-xs px-3 py-1 h-8 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-1 cursor-pointer transition-all ${getStatusColor(
                          order.status
                        )} ${
                          updateStatusMutation.isPending
                            ? "cursor-not-allowed opacity-50"
                            : "hover:opacity-90"
                        }`}
                      >
                        {statusOptions.map((status) => (
                          <option
                            key={status}
                            value={status}
                            className="text-black"
                          >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer with pagination */}
      {data?.meta && data.data.length > 0 && (
        <div className="flex items-center justify-between px-6 py-4 bg-white border-t">
          <div className="flex items-center text-sm text-gray-500">
            <span>
              Showing{" "}
              <span className="font-medium text-gray-900">
                {(data.meta.page - 1) * data.meta.limit + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium text-gray-900">
                {Math.min(data.meta.page * data.meta.limit, data.meta.total)}
              </span>{" "}
              of{" "}
              <span className="font-medium text-gray-900">
                {data.meta.total}
              </span>{" "}
              results
            </span>
            {isFetching && (
              <div className="ml-2 flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                <span className="ml-1 text-xs">Loading...</span>
              </div>
            )}
          </div>

          {data.meta.totalPages > 1 && (
            <Pagination>
              <PaginationContent>{renderPaginationItems()}</PaginationContent>
            </Pagination>
          )}
        </div>
      )}
    </div>
  );
}
