import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer } from "recharts"

const revenueReportData = [
  { month: "JAN", thisYear: 95, lastYear: 85 },
  { month: "FEB", thisYear: 130, lastYear: 120 },
  { month: "MAR", thisYear: 85, lastYear: 90 },
  { month: "APR", thisYear: 140, lastYear: 130 },
  { month: "MAY", thisYear: 110, lastYear: 100 },
  { month: "JUN", thisYear: 95, lastYear: 85 },
  { month: "JUL", thisYear: 120, lastYear: 110 },
  { month: "AUG", thisYear: 145, lastYear: 135 },
  { month: "SEP", thisYear: 100, lastYear: 95 },
  { month: "OCT", thisYear: 135, lastYear: 125 },
  { month: "NOV", thisYear: 115, lastYear: 105 },
  { month: "DEC", thisYear: 125, lastYear: 115 },
]

export function RevenueReportChart() {
  return (
    <Card className="!bg-transparent">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-[24px] text-[#131313] font-bold">Revenue report</CardTitle>
          <div className="flex gap-5">
               <div className="flex items-center gap-1 text-xs border p-2 rounded-md">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-xs text-[#424242]">This Year</span>
            </div>
            <div className="flex items-center gap-1 text-xs border p-2 rounded-md">
              <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
              <span className="text-gray-600">Last Year</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
         
            <button className="px-3 py-1 bg-orange-500 text-white text-xs rounded">Save</button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueReportData} barCategoryGap="20%">
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#6b7280" }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#6b7280" }} />
              <Bar dataKey="thisYear" fill="#1059EF" radius={[8, 8, 0, 0]} barSize={20} />
              <Bar dataKey="lastYear" fill="#035F8A" radius={[8, 8, 0, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
