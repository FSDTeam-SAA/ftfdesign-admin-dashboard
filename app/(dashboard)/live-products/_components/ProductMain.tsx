'use client'
import { Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { toast } from 'sonner'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useSession } from "next-auth/react"
import Image from "next/image"

interface Category {
  _id: string;
  title: string;
}

interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  quantity: number;
  productImage: string;
  category: Category;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface PaginationData {
  totalProducts: number;
  currentPage: number;
  totalPages: number;
  limit: number;
}

interface ApiResponse {
  success: boolean;
  code: number;
  message: string;
  data: Product[];
  pagination: PaginationData;
}

export default function ProductMain() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const limit = 10;
  const queryClient = useQueryClient();
     const session = useSession();
    const token = session?.data?.accessToken;
  const { data: response, isLoading } = useQuery<ApiResponse>({
    queryKey: ['products', currentPage],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product/get-all?page=${currentPage}&limit=${limit}`);
      if (!res.ok) {
        throw new Error('Failed to fetch products');
      }
      return res.json();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (productId: string) => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product/${productId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
      if (!res.ok) {
        throw new Error('Failed to delete product');
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success('Product deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['products', currentPage] });
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
    },
    onError: () => {
      toast.error('Failed to delete product');
    },
  });

  const products = response?.data || [];
  const pagination = response?.pagination;

  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const formatTime = (isoDate: string) => {
    const date = new Date(isoDate);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase();
  };

  const handleDeleteClick = (productId: string) => {
    setProductToDelete(productId);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (productToDelete) {
      deleteMutation.mutate(productToDelete);
    }
  };

  const renderPaginationItems = () => {
    if (!pagination) return null;

    const items = [];

    items.push(
      <PaginationItem key="prev">
        <PaginationPrevious
          href="#"
          onClick={(e) => {
            e.preventDefault();
            if (currentPage > 1) setCurrentPage((prev) => prev - 1);
          }}
        />
      </PaginationItem>
    );

    for (let i = 1; i <= pagination.totalPages; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            href="#"
            isActive={currentPage === i}
            onClick={(e) => {
              e.preventDefault();
              setCurrentPage(i);
            }}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    items.push(
      <PaginationItem key="next">
        <PaginationNext
          href="#"
          onClick={(e) => {
            e.preventDefault();
            if (currentPage < pagination.totalPages) setCurrentPage((prev) => prev + 1);
          }}
        />
      </PaginationItem>
    );

    return items;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        {/* Header Skeleton */}
        <div className="text-white px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
            <div className="h-10 w-32 bg-gray-200 rounded-md animate-pulse" />
          </div>
        </div>

        {/* Breadcrumb Skeleton */}
        <div className="px-6 py-3 border-b">
          <div className="flex items-center text-sm text-[#424242]">
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
            <span className="mx-2">›</span>
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>

        {/* Table Skeleton */}
        <div className="p-6">
          <div className="rounded-lg shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="border-b">
                <tr>
                  <th className="text-left py-3 px-4 font-bold text-[#131313] text-base">Product Name</th>
                  <th className="text-left py-3 px-4 font-bold text-[#131313] text-base">Category</th>
                  <th className="text-left py-3 px-4 font-bold text-[#131313] text-base">Price</th>
                  <th className="text-left py-3 px-4 font-bold text-[#131313] text-base">Quantity</th>
                  <th className="text-left py-3 px-4 font-bold text-[#131313] text-base">Date</th>
                  <th className="text-left py-3 px-4 font-bold text-[#131313] text-base">Action</th>
                </tr>
              </thead>
              <tbody>
                {[...Array(5)].map((_, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded animate-pulse" />
                        <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                    </td>
                    <td className="py-3 px-4">
                      <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                    </td>
                    <td className="py-3 px-4">
                      <div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
                    </td>
                    <td className="py-3 px-4">
                      <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                      <div className="h-3 w-16 bg-gray-200 rounded animate-pulse mt-1" />
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gray-200 rounded animate-pulse" />
                        <div className="w-6 h-6 bg-gray-200 rounded animate-pulse" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer with Pagination Skeleton */}
        <div className="flex items-center justify-between px-6 border-t pt-10">
          <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
          <div className="flex gap-2">
            <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
            {[...Array(3)].map((_, index) => (
              <div key={index} className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
            ))}
            <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="text-white px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-[24px] font-bold text-[#131313]">Live Products</h1>
          <Link
            href="/live-products/add-product"
            className="bg-[#D9AD5E] hover:bg-[#D9AD5E] text-white px-4 rounded-md text-sm font-medium py-3"
          >
            + Add Product
          </Link>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="px-6 py-3 border-b">
        <div className="flex items-center text-sm text-[#424242]">
          <span>Dashboard</span>
          <span className="mx-2">›</span>
          <span>Live Products</span>
        </div>
      </div>

      {/* Table */}
      <div className="p-6">
        <div className="rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="border-b">
              <tr>
                <th className="text-left py-3 px-4 font-bold text-[#131313] text-base">Product Name</th>
                <th className="text-left py-3 px-4 font-bold text-[#131313] text-base">Category</th>
                <th className="text-left py-3 px-4 font-bold text-[#131313] text-base">Price</th>
                <th className="text-left py-3 px-4 font-bold text-[#131313] text-base">Quantity</th>
                <th className="text-left py-3 px-4 font-bold text-[#131313] text-base">Date</th>
                <th className="text-left py-3 px-4 font-bold text-[#131313] text-base">Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} className="border-t pt-10">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <Image
                        src={product.productImage}
                        alt={product.title}
                        width={100}
                        height={100}
                        className="w-[100px] h-[60px] object-contain rounded-[6px] "
                      />
                      <span className="font-medium text-[#424242]">{product.title}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-[#424242]">{product.category.title}</td>
                  <td className="py-3 px-4 text-[#424242]">${product.price}</td>
                  <td className="py-3 px-4 text-[#424242]">{product.quantity}</td>
                  <td className="py-3 px-4 text-[#424242]">
                    <div>
                      <div>{formatDate(product.createdAt)}</div>
                      <div className="text-sm text-gray-500">{formatTime(product.createdAt)}</div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Link href={`/live-products/edit-product/${product._id}`} className="p-1 hover:bg-gray-100 rounded">
                        <Edit className="w-4 h-4 text-gray-500" />
                      </Link>
                      <button
                        onClick={() => handleDeleteClick(product._id)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <Trash2 className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteModalOpen(false);
                setProductToDelete(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Footer with pagination */}
      <div className="flex items-center justify-between px-6 border-t pt-10">
        <div>
          <span className="text-sm text-gray-500">
            {pagination
              ? `Showing ${(pagination.currentPage - 1) * pagination.limit + 1} to ${Math.min(pagination.currentPage * pagination.limit, pagination.totalProducts)} of ${pagination.totalProducts} results`
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