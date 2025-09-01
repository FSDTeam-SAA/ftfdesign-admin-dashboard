import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"

const productSellData = [
  { name: "Category 1", value: 30, color: "#3b82f6" },
  { name: "Category 2", value: 25, color: "#10b981" },
  { name: "Category 3", value: 20, color: "#f59e0b" },
  { name: "Category 4", value: 25, color: "#ef4444" },
]

export function ProductSellChart() {
  return (
    <Card className="bg-white">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium">Product Sell</CardTitle>
          <button className="text-xs text-blue-600 hover:underline">View Details</button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-48 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={productSellData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {productSellData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 space-y-2">
          {productSellData.map((item, index) => (
            <div key={index} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full`} style={{ backgroundColor: item.color }}></div>
                <span className="text-gray-600">Category sales {item.value}%</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
