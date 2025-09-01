import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Line, LineChart, XAxis, YAxis, ResponsiveContainer } from "recharts"

const revenueRatioData = [
  { month: "OCT", thisMonth: 35, lastMonth: 30 },
  { month: "NOV", thisMonth: 42, lastMonth: 35 },
  { month: "DEC", thisMonth: 38, lastMonth: 40 },
  { month: "JAN", thisMonth: 45, lastMonth: 38 },
  { month: "FEB", thisMonth: 52, lastMonth: 45 },
  { month: "MAR", thisMonth: 48, lastMonth: 50 },
  { month: "APR", thisMonth: 55, lastMonth: 48 },
  { month: "MAY", thisMonth: 60, lastMonth: 55 },
]

export function RevenueRatioChart() {
  return (
    <Card className="bg-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Revenue Ratio</CardTitle>
        <div className="flex gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-gray-600">This Month</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span className="text-gray-600">Last Month</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueRatioData}>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#6b7280" }} />
              <YAxis hide />
              <Line
                type="monotone"
                dataKey="thisMonth"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: "#3b82f6", strokeWidth: 2, r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="lastMonth"
                stroke="#8b5cf6"
                strokeWidth={2}
                dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
