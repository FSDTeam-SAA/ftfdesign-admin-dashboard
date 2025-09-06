import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"

export function OrderHistory() {
  const orders = [
    {
      id: 1,
      productName: "T-Shirt",
      price: "$200.00",
      quantity: "02",
      companyName: "The Walt Disney Company",
      employeeId: "17456",
      date: "04/21/2025",
      time: "03:18pm",
    },
    {
      id: 2,
      productName: "T-Shirt",
      price: "$200.00",
      quantity: "02",
      companyName: "The Walt Disney Company",
      employeeId: "17456",
      date: "04/21/2025",
      time: "03:18pm",
    },
    {
      id: 3,
      productName: "T-Shirt",
      price: "$200.00",
      quantity: "02",
      companyName: "The Walt Disney Company",
      employeeId: "17456",
      date: "04/21/2025",
      time: "03:18pm",
    },
    {
      id: 4,
      productName: "T-Shirt",
      price: "$200.00",
      quantity: "02",
      companyName: "The Walt Disney Company",
      employeeId: "17456",
      date: "04/21/2025",
      time: "03:18pm",
    },
    {
      id: 5,
      productName: "T-Shirt",
      price: "$200.00",
      quantity: "02",
      companyName: "The Walt Disney Company",
      employeeId: "17456",
      date: "04/21/2025",
      time: "03:18pm",
    },
    {
      id: 6,
      productName: "T-Shirt",
      price: "$200.00",
      quantity: "02",
      companyName: "The Walt Disney Company",
      employeeId: "17456",
      date: "04/21/2025",
      time: "03:18pm",
    },
    {
      id: 7,
      productName: "T-Shirt",
      price: "$200.00",
      quantity: "02",
      companyName: "The Walt Disney Company",
      employeeId: "17456",
      date: "04/21/2025",
      time: "03:18pm",
    },
  ]

  return (
    <div className="p-6 ">
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
      <div className=" overflow-hidden">
        <table className="w-full">
          <thead className=" border-b border-gray-200">
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
          <tbody className=" divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id} >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-black rounded-md flex items-center justify-center mr-3">
                      <span className="text-white text-xs font-bold">EK</span>
                    </div>
                    <span className="text-sm font-medium text-[#424242]">{order.productName}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#424242]">{order.price}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#424242]">{order.quantity}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#424242]">{order.companyName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#424242]">{order.employeeId}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-[#424242]">{order.date}</div>
                  <div className="text-sm text-gray-500">{order.time}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    <Button size="sm" className="bg-[#008000] hover:bg-[#008000] text-white text-xs px-3 py-1 h-7">
                      Approved
                    </Button>
                    <Button size="sm" className="bg-[#1059EF] hover:bg-[#1059EF] text-white text-xs px-3 py-1 h-7">
                      Processing
                    </Button>
                    <Button size="sm" className="bg-[#FF5858] hover:bg-[#FF5858] text-white text-xs px-3 py-1 h-7">
                      Cancel
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
    </div>
  )
}
