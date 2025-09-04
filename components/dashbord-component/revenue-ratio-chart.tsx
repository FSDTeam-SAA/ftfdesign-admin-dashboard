import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Line, LineChart, XAxis, YAxis, ResponsiveContainer, Tooltip, TooltipProps } from "recharts"

const revenueRatioData = [
  { date: "3 Oct", thisMonth: 1800, lastMonth: 200 },
  { date: "10 Oct", thisMonth: 2600, lastMonth: 1200 },
  { date: "14 Oct", thisMonth: 2200, lastMonth: 1000 },
  { date: "20 Oct", thisMonth: 3800, lastMonth: 2800 },
  { date: "23 Oct", thisMonth: 2000, lastMonth: 3400 },
  { date: "27 Oct", thisMonth: 1000, lastMonth: 3000 },
  { date: "30 Oct", thisMonth: 4000, lastMonth: 2000 },
]

const timeFilters = [
  { label: "Day", active: false },
  { label: "Week", active: false },
  { label: "Month", active: true },
  { label: "Year", active: false },
]

interface CustomTooltipProps extends TooltipProps<number, string> {
  active?: boolean
  payload?: Array<{
    value: number
    dataKey: string
    color: string
    payload: {
      date: string
      thisMonth: number
      lastMonth: number
    }
  }>
  label?: string
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="text-sm font-medium text-gray-900 mb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-gray-600">{entry.dataKey === "thisMonth" ? "This Month" : "Last Month"}:</span>
            <span className="font-medium text-gray-900">{entry.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

export function RevenueRatioChart() {
  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">Revenue Ratio</CardTitle>
          <div className="flex gap-1">
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
        </div>
        <div className="flex gap-4 text-xs mt-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            <span className="text-gray-600">This Month</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
            <span className="text-gray-600">Last Month</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueRatioData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#6b7280" }}
                className="text-xs"
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#6b7280" }}
                domain={[0, 4000]}
                tickFormatter={(value) => `${value / 1000}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="thisMonth"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: "#3b82f6" }}
              />
              <Line
                type="monotone"
                dataKey="lastMonth"
                stroke="#c084fc"
                strokeWidth={3}
                dot={{ fill: "#c084fc", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: "#c084fc" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}