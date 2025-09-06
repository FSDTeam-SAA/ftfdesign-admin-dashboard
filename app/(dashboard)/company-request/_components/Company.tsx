"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ChevronRight } from "lucide-react"
import Image from "next/image"

interface CompanyRequest {
  id: string
  companyName: string
  companyId: string
  price: string
  employeeCount: string
  date: string
  time: string
  status: "Approved" | "Pending"
  uniqueId: string
  address: string
  logo: string
  banner: string
}

const mockData: CompanyRequest[] = [
  {
    id: "1",
    companyName: "The Walt Disney Company",
    companyId: "1025",
    price: "$200.00",
    employeeCount: "0-300",
    date: "04/21/2025",
    time: "03:18pm",
    status: "Approved",
    uniqueId: "115496",
    address: "2972 Westheimer Rd. Santa Ana, Illinois 85486",
    logo: "/disney-logo-with-crown-and-n-letter.jpg",
    banner: "/teal-green-banner-with-wlo-text.jpg",
  },
  {
    id: "2",
    companyName: "The Walt Disney Company",
    companyId: "1025",
    price: "$200.00",
    employeeCount: "0-300",
    date: "04/21/2025",
    time: "03:18pm",
    status: "Approved",
    uniqueId: "115497",
    address: "2972 Westheimer Rd. Santa Ana, Illinois 85486",
    logo: "/disney-logo-with-crown-and-n-letter.jpg",
    banner: "/teal-green-banner-with-wlo-text.jpg",
  },
  {
    id: "3",
    companyName: "The Walt Disney Company",
    companyId: "1025",
    price: "$200.00",
    employeeCount: "0-300",
    date: "04/21/2025",
    time: "03:18pm",
    status: "Approved",
    uniqueId: "115498",
    address: "2972 Westheimer Rd. Santa Ana, Illinois 85486",
    logo: "/disney-logo-with-crown-and-n-letter.jpg",
    banner: "/teal-green-banner-with-wlo-text.jpg",
  },
  {
    id: "4",
    companyName: "The Walt Disney Company",
    companyId: "1025",
    price: "$200.00",
    employeeCount: "0-300",
    date: "04/21/2025",
    time: "03:18pm",
    status: "Approved",
    uniqueId: "115499",
    address: "2972 Westheimer Rd. Santa Ana, Illinois 85486",
    logo: "/disney-logo-with-crown-and-n-letter.jpg",
    banner: "/teal-green-banner-with-wlo-text.jpg",
  },
  {
    id: "5",
    companyName: "The Walt Disney Company",
    companyId: "1025",
    price: "$200.00",
    employeeCount: "0-300",
    date: "04/21/2025",
    time: "03:18pm",
    status: "Approved",
    uniqueId: "115500",
    address: "2972 Westheimer Rd. Santa Ana, Illinois 85486",
    logo: "/disney-logo-with-crown-and-n-letter.jpg",
    banner: "/teal-green-banner-with-wlo-text.jpg",
  },
  {
    id: "6",
    companyName: "The Walt Disney Company",
    companyId: "1025",
    price: "$200.00",
    employeeCount: "0-300",
    date: "04/21/2025",
    time: "03:18pm",
    status: "Approved",
    uniqueId: "115501",
    address: "2972 Westheimer Rd. Santa Ana, Illinois 85486",
    logo: "/disney-logo-with-crown-and-n-letter.jpg",
    banner: "/teal-green-banner-with-wlo-text.jpg",
  },
  {
    id: "7",
    companyName: "The Walt Disney Company",
    companyId: "1025",
    price: "$200.00",
    employeeCount: "0-300",
    date: "04/21/2025",
    time: "03:18pm",
    status: "Approved",
    uniqueId: "115502",
    address: "2972 Westheimer Rd. Santa Ana, Illinois 85486",
    logo: "/disney-logo-with-crown-and-n-letter.jpg",
    banner: "/teal-green-banner-with-wlo-text.jpg",
  },
]

export default function CompanyProfileRequest() {
  const [selectedCompany, setSelectedCompany] = useState<CompanyRequest | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleSeeDetails = (company: CompanyRequest) => {
    setSelectedCompany(company)
    setIsModalOpen(true)
  }

  return (
    <div className="min-h-screen  p-6">
      <div className="mx-auto w-full">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-[#424242]  font-mdium">Company Profile Request</h1>
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
              {mockData.map((company) => (
                <tr key={company.id} className="border-b">
                  <td className="p-4">
                    <div className="font-medium text-[#424242]  ">{company.companyName}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-[#424242]  font-mdium">{company.companyId}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-[#424242]  font-mdium">{company.price}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-[#424242]  font-mdium">{company.employeeCount}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-[#424242]  font-mdium">{company.date}</div>
                    <div className="text-sm text-[#424242]">{company.time}</div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <Badge className="bg-[#008000] text-white hover:bg-[#008000] py-1 cursor-pointer">
                        Approved
                      </Badge>
                      <Badge
                      
                        className="bg-[#1059EF] hover:bg-[#1059EF] text-white py-1 cursor-pointer"
                        onClick={() => handleSeeDetails(company)}
                      >
                        See Details
                      </Badge>
                      <Button size="sm" variant="destructive" className="bg-[#FF5858] hover:bg-[#FF5858] py-1 cursor-pointer">
                        Cancel
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
        
        </div>
      </div>

      {/* Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl mx-auto bg-white">
          <DialogHeader>
            <DialogTitle className="sr-only">Company Details</DialogTitle>
          </DialogHeader>

          {selectedCompany && (
            <div className="space-y-6 p-6">
              {/* Company Unique ID */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-1">Company Unique Id</h3>
                <p className="text-[#424242]  font-mdium">{selectedCompany.uniqueId}</p>
              </div>

              {/* Company Name */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-1">Company Name</h3>
                <p className="text-[#424242]  font-mdium">{selectedCompany.companyName}</p>
              </div>

              {/* Company Address */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-1">Company Address</h3>
                <p className="text-[#424242]  font-mdium">{selectedCompany.address}</p>
              </div>

              {/* Company Logo */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Company Logo</h3>
                <div className="flex justify-center">
                  <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                    <Image
                      src={selectedCompany.logo || "/placeholder.svg"}
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
                    src={selectedCompany.banner || "/placeholder.svg"}
                    alt="Company Banner"
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Download Button */}
              <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-3">Download</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}