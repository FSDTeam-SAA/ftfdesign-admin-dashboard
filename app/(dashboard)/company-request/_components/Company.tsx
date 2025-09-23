

"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ChevronRight } from "lucide-react"
import Image from "next/image"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext } from "@/components/ui/pagination"
import { toast } from "sonner"
import { useSession } from "next-auth/react"
import jsPDF from "jspdf"

interface User {
  _id: string
  name: string
  email: string
  isVerified: boolean
  isShopCreated: boolean
  shop: string
}

interface CompanyRequest {
  _id: string
  userId: User
  companyId: string
  companyName: string
  companyLogo: string
  companyBanner: string
  companyAddress: string
  status: "pending" | "approved" | "rejected"
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
  data: CompanyRequest[]
  pagination: PaginationData
}

const fetchShops = async (page: number = 1): Promise<ApiResponse> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shop?page=${page}&limit=10`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
  if (!response.ok) {
    throw new Error("Failed to fetch shops")
  }
  return response.json()
}

const updateShopStatus = async ({ id, status, token }: { id: string; status: "approved" | "rejected"; token: string }) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shop/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  })
  if (!response.ok) {
    throw new Error(`Failed to ${status} shop`)
  }
  return response.json()
}

export default function CompanyProfileRequest() {
  const [selectedCompany, setSelectedCompany] = useState<CompanyRequest | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const queryClient = useQueryClient()
  const { data: session } = useSession()
  const token = session?.accessToken || ""

  const { data, isLoading, error } = useQuery<ApiResponse>({
    queryKey: ["shops", currentPage],
    queryFn: () => fetchShops(currentPage),
  })

  const approveMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: "approved" | "rejected" }) =>
      updateShopStatus({ id, status, token }),
    onSuccess: () => {
      toast.success("Shop approved successfully")
      queryClient.invalidateQueries({ queryKey: ["shops", currentPage] })
    },
    onError: (error) => {
      toast.error(`Failed to approve shop: ${(error as Error).message}`)
    },
  })

  const rejectMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: "approved" | "rejected" }) =>
      updateShopStatus({ id, status, token }),
    onSuccess: () => {
      toast.success("Shop rejected successfully")
      queryClient.invalidateQueries({ queryKey: ["shops", currentPage] })
    },
    onError: (error) => {
      toast.error(`Failed to reject shop: ${(error as Error).message}`)
    },
  })

  const handleApprove = (id: string) => {
    if (token) {
      approveMutation.mutate({ id, status: "approved" })
    } else {
      toast.error("Authentication token not found")
    }
  }

  const handleReject = (id: string) => {
    if (token) {
      rejectMutation.mutate({ id, status: "rejected" })
    } else {
      toast.error("Authentication token not found")
    }
  }

  const handleSeeDetails = (company: CompanyRequest) => {
    setSelectedCompany(company)
    setIsModalOpen(true)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleDownloadPDF = (company: CompanyRequest) => {
    try {
      const doc = new jsPDF()
      
      // Set font and styles
      doc.setFont("helvetica", "normal")
      doc.setFontSize(16)
      
      // Add title
      doc.text("Company Profile Details", 20, 20)
      
      // Add company details
      doc.setFontSize(12)
      doc.text(`Company Unique Id: ${company.companyId}`, 20, 40)
      doc.text(`Company Name: ${company.companyName}`, 20, 50)
      doc.text(`Company Address: ${company.companyAddress}`, 20, 60)
      doc.text(`Subscription Employees: ${company.subscriptionEmployees}`, 20, 70)
      doc.text(`Total Given Coin: $${company.totalGivenCoin.toFixed(2)}`, 20, 80)
      doc.text(`Subscription Plan: ${company.subscriptionPlan}`, 20, 90)
      doc.text(`Subscription Start Date: ${new Date(company.subscriptionStartDate).toLocaleDateString()}`, 20, 100)
      doc.text(`Subscription End Date: ${new Date(company.subscriptionEndDate).toLocaleDateString()}`, 20, 110)
      doc.text(`Status: ${company.status}`, 20, 120)
      doc.text(`Created At: ${new Date(company.createdAt).toLocaleDateString()} ${new Date(company.createdAt).toLocaleTimeString()}`, 20, 130)
      
      // Save the PDF
      doc.save(`${company.companyName}_profile.pdf`)
      toast.success("PDF downloaded successfully")
    } catch (error) {
      toast.error(`Failed to generate PDF: ${(error as Error).message}`)
    }
  }

  const renderPaginationItems = () => {
    if (!data?.pagination) return null
    const { totalPages, page } = data.pagination
    const pages = []

    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <PaginationItem key={i}>
          <PaginationLink
            isActive={i === page}
            onClick={() => handlePageChange(i)}
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
          onClick={() => page > 1 && handlePageChange(page - 1)}
          className={page === 1 ? "pointer-events-none opacity-50" : ""}
        />
        {pages}
        <PaginationNext
          onClick={() => page < totalPages && handlePageChange(page + 1)}
          className={page === totalPages ? "pointer-events-none opacity-50" : ""}
        />
      </>
    )
  }

  const renderSkeleton = () => (
    <div className="w-full">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left p-4 font-bold text-[#131313] text-base">Company Name</th>
            <th className="text-left p-4 font-bold text-[#131313] text-base">Company Id</th>
            <th className="text-left p-4 font-bold text-[#131313] text-base">Price</th>
            <th className="text-left p-4 font-bold text-[#131313] text-base">Employee Count</th>
            <th className="text-left p-4 font-bold text-[#131313] text-base">Date</th>
            <th className="text-center p-4 font-bold text-[#131313] text-base">Action</th>
          </tr>
        </thead>
        <tbody>
          {[...Array(5)].map((_, index) => (
            <tr key={index} className="border-b">
              <td className="p-4">
                <div className="h-5 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              </td>
              <td className="p-4">
                <div className="h-5 bg-gray-200 rounded w-1/2 animate-pulse"></div>
              </td>
              <td className="p-4">
                <div className="h-5 bg-gray-200 rounded w-1/4 animate-pulse"></div>
              </td>
              <td className="p-4">
                <div className="h-5 bg-gray-200 rounded w-1/4 animate-pulse"></div>
              </td>
              <td className="p-4">
                <div className="h-5 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4 mt-1 animate-pulse"></div>
              </td>
              <td className="p-4">
                <div className="flex items-center justify-end gap-2">
                  <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  if (isLoading) return <div className="min-h-screen p-6">{renderSkeleton()}</div>
  if (error) return <div className="min-h-screen p-6">Error: {(error as Error).message}</div>

  return (
    <div className="min-h-screen p-6">
      <div className="mx-auto w-full">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-[#424242]">Company Profile Request</h1>
          <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
            <span>Dashboard</span>
            <ChevronRight className="h-4 w-4" />
            <span>Company Profile Request</span>
          </div>
        </div>

        {/* Table */}
        <div className="">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4 font-bold text-[#131313] text-base">Company Name</th>
                <th className="text-left p-4 font-bold text-[#131313] text-base">Company Id</th>
                <th className="text-left p-4 font-bold text-[#131313] text-base">Price</th>
                <th className="text-left p-4 font-bold text-[#131313] text-base">Employee Count</th>
                <th className="text-left p-4 font-bold text-[#131313] text-base">Date</th>
                <th className="text-center p-4 font-bold text-[#131313] text-base">Action</th>
              </tr>
            </thead>
            <tbody>
              {data?.data.map((company) => (
                <tr key={company._id} className="border-b">
                  <td className="p-4">
                    <div className="font-medium text-[#424242]">{company.companyName}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-[#424242] font-medium">{company.companyId}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-[#424242] font-medium">
                      ${company.totalGivenCoin.toFixed(2)}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-[#424242] font-medium">{company.subscriptionEmployees}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-[#424242] font-medium">
                      {new Date(company.createdAt).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-[#424242]">
                      {new Date(company.createdAt).toLocaleTimeString()}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        className="bg-[#008000] hover:bg-[#006600] h-[30px] w-[100px] cursor-pointer"
                        onClick={() => handleApprove(company._id)}
                        disabled={company.status === "approved" || approveMutation.isPending}
                      >
                        Approve
                      </Button>
                      <Badge
                        className="bg-[#1059EF] hover:bg-[#1059EF] text-white h-[30px] w-[100px] cursor-pointer"
                        onClick={() => handleSeeDetails(company)}
                      >
                        See Details
                      </Badge>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="bg-[#FF5858] hover:bg-[#FF5858] h-[30px] w-[100px] cursor-pointer"
                        onClick={() => handleReject(company._id)}
                        disabled={company.status === "rejected" || rejectMutation.isPending}
                      >
                        Cancel
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
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

        {/* Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-4xl mx-auto bg-white">
            <DialogHeader>
              <DialogTitle className="sr-only">Company Details</DialogTitle>
            </DialogHeader>

            {selectedCompany && (
              <div className="space-y-6 p-6">
                {/* Company Unique Id */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Company Unique Id</h3>
                  <p className="text-[#424242] font-medium">{selectedCompany.companyId}</p>
                </div>

                {/* Company Name */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Company Name</h3>
                  <p className="text-[#424242] font-medium">{selectedCompany.companyName}</p>
                </div>

                {/* Company Address */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Company Address</h3>
                  <p className="text-[#424242] font-medium">{selectedCompany.companyAddress}</p>
                </div>

                {/* Company Logo */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Company Logo</h3>
                  <div className="flex justify-center">
                    <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                      <Image
                        src={selectedCompany.companyLogo || "/placeholder.svg"}
                        alt="Company Logo"
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>

                {/* Company Banner */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Company Banner</h3>
                  <div className="w-full h-32 bg-teal-600 rounded-lg overflow-hidden flex items-center justify-center">
                    <Image
                      src={selectedCompany.companyBanner || "/placeholder.svg"}
                      alt="Company Banner"
                      width={1000}
                      height={1000}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Download Button */}
                <Button 
                  className="w-full bg-yellow-500 hover:bg-yellow-500/90 text-white font-medium py-3 !border-none"
                  onClick={() => handleDownloadPDF(selectedCompany)}
                >
                  Download 
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}