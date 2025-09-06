import { Button } from "@/components/ui/button"
import { Edit, Eye, Trash2 } from "lucide-react"

const companyData = [
  {
    id: "2201",
    author: "Wilams",
    company: "The Walt Disney Company",
    lastUpdated: "January 06, 2025",
  },
  {
    id: "2201",
    author: "Wilams",
    company: "The Walt Disney Company",
    lastUpdated: "January 06, 2025",
  },
  {
    id: "2201",
    author: "Wilams",
    company: "The Walt Disney Company",
    lastUpdated: "January 06, 2025",
  },
  {
    id: "2201",
    author: "Wilams",
    company: "The Walt Disney Company",
    lastUpdated: "January 06, 2025",
  },
  {
    id: "2201",
    author: "Wilams",
    company: "The Walt Disney Company",
    lastUpdated: "January 06, 2025",
  },
]

export default function CompanyWebsiteDashboard() {
  return (
    <div className="p-6  min-h-screen">
      <div className="">
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
            <thead className=" border-b">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Company ID</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Author Name</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Company Name</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Last Updated</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {companyData.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{item.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{item.author}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                        <div className="w-4 h-4 bg-white rounded-sm"></div>
                      </div>
                      <span className="text-sm text-gray-900">{item.company}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.lastUpdated}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
