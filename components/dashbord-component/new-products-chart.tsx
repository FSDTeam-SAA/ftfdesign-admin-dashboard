import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"

const newProductsData = [
  { name: "Completed", value: 75, color: "#3b82f6" },
  { name: "This Week", value: 60, color: "#c7d2fe" },
  { name: "This Month", value: 45, color: "#e0e7ff" },
  { name: "Remaining", value: 25, color: "#f1f5f9" },
]

const timeFilters = [
  { label: "Day", active: false },
  { label: "Week", active: false },
  { label: "Month", active: true },
  { label: "Year", active: false },
]

export function NewProductsChart() {
  return (
    <Card className="bg-white border border-gray-200 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">Total New Products Report</CardTitle>
          <div className="flex gap-3">
            <div className="flex items-center gap-2 text-xs">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <span className="text-gray-600">This day</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
              <span className="text-gray-600">This Week</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-2 h-2 bg-blue-200 rounded-full"></div>
              <span className="text-gray-600">This Month</span>
            </div>
          </div>
        </div>
        <div className="flex gap-1 mt-3">
          {timeFilters.map((filter, index) => (
            <button
              key={index}
              className={`px-3 py-1 text-xs rounded-md transition-colors ${
                filter.active ? "bg-orange-400 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-64 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={[newProductsData[0]]}
                cx="50%"
                cy="50%"
                innerRadius={85}
                outerRadius={105}
                paddingAngle={0}
                dataKey="value"
                strokeWidth={0}
              >
                <Cell fill="#3b82f6" />
              </Pie>
              <Pie
                data={[newProductsData[1]]}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={80}
                paddingAngle={0}
                dataKey="value"
                strokeWidth={0}
              >
                <Cell fill="#c7d2fe" />
              </Pie>
              <Pie
                data={[newProductsData[2]]}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={60}
                paddingAngle={0}
                dataKey="value"
                strokeWidth={0}
              >
                <Cell fill="#e0e7ff" />
              </Pie>
              <Pie
                data={[{ value: 30 }]}
                cx="50%"
                cy="50%"
                innerRadius={25}
                outerRadius={40}
                paddingAngle={0}
                dataKey="value"
                strokeWidth={0}
              >
                <Cell fill="#f59e0b" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
