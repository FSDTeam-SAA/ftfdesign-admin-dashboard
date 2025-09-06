import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowDown } from "lucide-react"

const productData = [
  { id: "A5550", quantity: 4, amount: "$500" },
  { id: "A5550", quantity: 5, amount: "$300" },
  { id: "A5550", quantity: 2, amount: "$300" },
  { id: "A5550", quantity: 6, amount: "$300" },
  { id: "A5550", quantity: 1, amount: "$300" },
  { id: "A5550", quantity: 2, amount: "$300" },
]

export default function MyWalletDashboard() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">My Wallet</h1>
            <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
              <span>Dashboard</span>
              <span>›</span>
              <span>My Wallet</span>
            </div>
          </div>
          <Button className="bg-orange-400 hover:bg-orange-500 text-white">
            Withdraw
            <ArrowDown className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {/* Revenue Card */}
        <div className="bg-[#035F8A] rounded-lg p-6 text-white mb-8 max-w-[470px]">
          <h2 className="text-lg font-medium mb-2">Total Revenue</h2>
          <p className="text-3xl font-bold">$11000.245</p>
        </div>

        {/* Products History */}
        <div className="">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Products History</h3>
            <div className="flex items-center gap-4">
              <Input placeholder="All Your Products" className="max-w-xs" />
              <Button variant="outline">Reset</Button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className=" border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-base font-bold text-[#131313]">Product ID</th>
                  <th className="px-6 py-4 text-center text-base font-bold text-[#131313]">Quantity</th>
                  <th className="px-6 py-4 text-right text-base font-bold text-[#131313]">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {productData.map((item, index) => (
                  <tr key={index} className="">
                    <td className="px-6 py-4 text-base text-[#131313]">{item.id}</td>
                    <td className="px-6 py-4 text-base text-[#131313] text-center">{item.quantity}</td>
                    <td className="px-6 py-4 text-base text-[#131313] text-right">{item.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
