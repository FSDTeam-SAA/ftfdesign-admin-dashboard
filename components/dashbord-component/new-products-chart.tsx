import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useSession } from "next-auth/react";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/dashboard/admin-new-products-report`;

// Fetch function for the API
const fetchNewProductsReport = async (token:string) => {
  const response = await fetch(API_URL, {headers:{
    Authorization: `Bearer ${token}`,
  }});
  if (!response.ok) {
    throw new Error("Failed to fetch new products report");
  }
  const result = await response.json();
  return result.data;
};

// const timeFilters = [
//   { label: "Day", key: "day" },
//   { label: "Week", key: "week" },
//   { label: "Month", key: "month" },
//   { label: "Year", key: "year" },
// ];

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

export default function NewProductsChart() {
  // const [activeFilter, setActiveFilter] = useState("month");
  const [viewType, setViewType] = useState("bar"); // "bar" or "pie"
  const {data:session} = useSession()
  // TanStack Query to fetch data
  const { data, isLoading, error } = useQuery({
    queryKey: ["newProductsReport"],
    queryFn: ()=> fetchNewProductsReport(session?.accessToken as string),
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 5 * 60 * 1000, // Consider data stale after 5 minutes
  });

  // Transform API data for charts
  const chartData = data
    ? [
        { name: "Day", value: data.day, color: COLORS[0] },
        { name: "Week", value: data.week, color: COLORS[1] },
        { name: "Month", value: data.month, color: COLORS[2] },
        { name: "Year", value: data.year, color: COLORS[3] },
      ]
    : [];

  // Filter data based on active selection for pie chart
  const pieData = data ? chartData.filter((item) => item.value > 0) : [];

  // Get total products
  const totalProducts = data
    ? data.day + data.week + data.month + data.year
    : 0;

  // Loading state
  if (isLoading) {
    return (
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">
            Total New Products Report
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">
            Total New Products Report
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <div className="text-center">
              <div className="text-red-500 mb-2">⚠️ Failed to load data</div>
              <p className="text-gray-600 text-sm">{error.message}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white border border-gray-200 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Total New Products Report
          </CardTitle>
          <div className="flex items-center gap-4">
            {/* Chart Type Toggle */}
            <div className="flex gap-1 bg-gray-100 rounded-md p-1">
              <button
                onClick={() => setViewType("bar")}
                className={`px-3 py-1 text-xs rounded transition-colors ${
                  viewType === "bar"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Bar
              </button>
              <button
                onClick={() => setViewType("pie")}
                className={`px-3 py-1 text-xs rounded transition-colors ${
                  viewType === "pie"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Pie
              </button>
            </div>

            {/* Legend */}
            <div className="flex gap-3">
              {chartData.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center gap-2 text-xs"
                >
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-gray-600">
                    {item.name}: {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Time Filters */}
        {/* <div className="flex gap-1 mt-3">
          {timeFilters.map((filter) => (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key)}
              className={`px-3 py-1 text-xs rounded-md transition-colors ${
                activeFilter === filter.key
                  ? "bg-orange-400 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {filter.label}: {data ? data[filter.key] : 0}
            </button>
          ))}
        </div> */}

        {/* Summary */}
        <div className="mt-3 text-sm text-gray-600">
          Total Products:{" "}
          <span className="font-semibold text-gray-900">{totalProducts}</span>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            {viewType === "bar" ? (
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "6px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} fill="#3b82f6">
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            ) : (
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value, percent }) =>
                    `${name}: ${value} (${((percent ?? 0) * 100).toFixed(0)}%)`
                  }
                  labelLine={false}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "6px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
              </PieChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
