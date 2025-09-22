"use client"

import { Button } from "@/components/ui/button"
import { Plus, Edit, Trash2 } from "lucide-react"
import Image from "next/image"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext } from "@/components/ui/pagination"
import { useState } from "react"
import { toast } from "sonner"
import { useSession } from "next-auth/react"
import Link from "next/link"

interface BlogListProps {
    onAddBlog: () => void
}

interface BlogPost {
    _id: string
    blogTitle: string
    blogDescription: string
    image: string
    createdAt: string
    updatedAt: string
    __v: number
}

interface ApiResponse {
    status: boolean
    message: string
    data: BlogPost[]
    meta: {
        total: number
        page: number
        limit: number
        totalPages: number
    }
}

async function fetchBlogs(page: number = 1): Promise<ApiResponse> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog?page=${page}&limit=10`)
    if (!response.ok) {
        throw new Error("Failed to fetch blogs")
    }
    return response.json()
}

async function deleteBlog(id: string, token: string | undefined): Promise<void> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    })
    if (!response.ok) {
        throw new Error("Failed to delete blog")
    }
}

// Shimmer animation CSS
const shimmerStyles = `
  .shimmer {
    animation: shimmer 1.5s infinite linear;
    background: linear-gradient(to right, #f0f0f0 4%, #e0e0e0 25%, #f0f0f0 36%);
    background-size: 1000px 100%;
  }
  @keyframes shimmer {
    0% { background-position: -1000px 0; }
    100% { background-position: 1000px 0; }
  }
`

export function BlogList({ onAddBlog }: BlogListProps) {
    const [currentPage, setCurrentPage] = useState(1)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedBlogId, setSelectedBlogId] = useState<string | null>(null)
    const queryClient = useQueryClient()
    const session = useSession()
    const token = session?.data?.accessToken

    const { data, isLoading, error } = useQuery<ApiResponse>({
        queryKey: ["blogs", currentPage],
        queryFn: () => fetchBlogs(currentPage),
    })

    const deleteMutation = useMutation({
        mutationFn: () => deleteBlog(selectedBlogId!, token),
        onSuccess: () => {
            toast.success("Blog deleted successfully")
            queryClient.invalidateQueries({ queryKey: ["blogs", currentPage] })
            setIsModalOpen(false)
            setSelectedBlogId(null)
        },
        onError: (error) => {
            toast.error(`Failed to delete blog: ${error.message}`)
        },
    })

    const handleDeleteClick = (id: string) => {
        setSelectedBlogId(id)
        setIsModalOpen(true)
    }

    const handleConfirmDelete = () => {
        if (selectedBlogId) {
            deleteMutation.mutate()
        }
    }

    const handleCancelDelete = () => {
        setIsModalOpen(false)
        setSelectedBlogId(null)
    }

    const renderPaginationItems = () => {
        if (!data?.meta) return null

        const { totalPages, page } = data.meta
        const items = []

        for (let i = 1; i <= totalPages; i++) {
            items.push(
                <PaginationItem key={i}>
                    <PaginationLink
                        href="#"
                        isActive={i === page}
                        onClick={(e) => {
                            e.preventDefault()
                            setCurrentPage(i)
                        }}
                    >
                        {i}
                    </PaginationLink>
                </PaginationItem>
            )
        }

        return items
    }

    // Skeleton Loader Component
    const SkeletonRow = () => (
        <div className="grid grid-cols-12 gap-4 p-4 items-center border-b border-gray-100">
            <div className="col-span-5 flex items-start gap-3">
                <div className="w-[120px] h-[100px] rounded-lg shimmer" />
                <div className="flex-1 min-w-0">
                    <div className="h-5 w-3/4 shimmer rounded mb-2" />
                    <div className="h-4 w-full shimmer rounded mb-1" />
                    <div className="h-4 w-5/6 shimmer rounded" />
                </div>
            </div>
            <div className="col-span-2">
                <div className="h-4 w-2/3 shimmer rounded" />
            </div>
            <div className="col-span-2">
                <div className="h-4 w-1/3 shimmer rounded" />
            </div>
            <div className="col-span-3 flex items-center gap-2">
                <div className="h-6 w-6 shimmer rounded" />
                <div className="h-6 w-6 shimmer rounded" />
            </div>
        </div>
    )

    return (
        <div className="p-6">
            <style>{shimmerStyles}</style>

            {/* Confirmation Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
                        <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
                        <p className="text-gray-600 mb-6">Are you sure you want to delete this blog post? This action cannot be undone.</p>
                        <div className="flex justify-end gap-2">
                            <Button
                                variant="outline"
                                onClick={handleCancelDelete}
                                className="px-4 py-2"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleConfirmDelete}
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2"
                                disabled={deleteMutation.isPending}
                            >
                                {deleteMutation.isPending ? "Deleting..." : "Delete"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900 mb-1">Blog management</h1>
                    <div className="flex items-center text-sm text-gray-500">
                        <span>Dashboard</span>
                        <span className="mx-2">{">"}</span>
                        <span>Blog management</span>
                    </div>
                </div>
                <Button
                    onClick={onAddBlog}
                    className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                    <Plus size={16} />
                    Add blog
                </Button>
            </div>

            {/* Table */}
            <div className="overflow-hidden">
                <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b border-t border-gray comissão de ética e disciplina200 text-sm font-medium text-gray-700">
                    <div className="col-span-6 text-base text-[#131313] font-bold">Blog Name</div>
                    <div className="col-span-2 text-base text-[#131313] font-bold">Added</div>
                    <div className="col-span-2 text-base text-[#131313] font-bold">Comments</div>
                    <div className="col-span-2 text-base text-[#131313] font-bold">Action</div>
                </div>

                {isLoading ? (
                    Array(5).fill(0).map((_, index) => <SkeletonRow key={index} />)
                ) : error ? (
                    <div>Error: {(error as Error).message}</div>
                ) : (
                    data?.data.map((post) => (
                        <div
                            key={post._id}
                            className="grid grid-cols-12 gap-4 p-4 items-center border-b border-gray-100"
                        >
                            <div className="col-span-6 flex items-start gap-3">
                                <div className="w-[120px] h-[100px] rounded-lg overflow-hidden flex-shrink-0">
                                    <Image
                                        src={post.image || "/placeholder.svg"}
                                        alt={post.blogTitle}
                                        width={100}
                                        height={1000}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-[#131313] text-base mb-1 line-clamp-1">{post.blogTitle}</h3>
                                    <p
                                        className="text-sm text-[#424242] line-clamp-2 leading-relaxed"
                                        dangerouslySetInnerHTML={{ __html: post.blogDescription }}
                                    />
                                </div>
                            </div>
                            <div className="col-span-2 text-sm text-gray-600">
                                {new Date(post.createdAt).toLocaleString()}
                            </div>
                            <div className="col-span-2 text-sm text-[#424242]">0</div>
                            <div className="col-span-2 flex items-center gap-2">
                                <Link href={`/blog-management/edit/${post._id}`}>

                                <button  className="p-2 text-[#424242] transition-colors">
                                    <Edit size={16} />
                                </button>
                                </Link>
                                <button
                                    className="p-2 text-[#424242] transition-colors"
                                    onClick={() => handleDeleteClick(post._id)}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Pagination */}
            {data?.meta && !isLoading && (
                <div className="flex items-center justify-between px-6 border-t pt-10">
                    <div>
                        <span className="text-sm text-gray-500">
                            Showing {(data.meta.page - 1) * data.meta.limit + 1} to{" "}
                            {Math.min(data.meta.page * data.meta.limit, data.meta.total)} of {data.meta.total} results
                        </span>
                    </div>
                    {data.meta.totalPages > 1 && (
                        <Pagination>
                            <PaginationContent>
                                <PaginationPrevious
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        if (currentPage > 1) setCurrentPage(currentPage - 1)
                                    }}
                                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                                />
                                {renderPaginationItems()}
                                <PaginationNext
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        if (currentPage < data.meta.totalPages) setCurrentPage(currentPage + 1)
                                    }}
                                    className={currentPage === data.meta.totalPages ? "pointer-events-none opacity-50" : ""}
                                />
                            </PaginationContent>
                        </Pagination>
                    )}
                </div>
            )}
        </div>
    )
}